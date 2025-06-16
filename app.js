let form = document.querySelector("form");
let questionInput = document.querySelector(".question-input");
let chatBox = document.querySelector(".chat-box");

let conversationHistory = [];

function showBotResponse(response) {
    let botResponseText = response.data.answer;

    conversationHistory.push({ role: "assistant", content: botResponseText });

    const sentenceRegex = /[^.!?]+[.!?]/g;
    const sentences = botResponseText.match(sentenceRegex);

    if (sentences) {
        sentences.forEach((sentence, index) => {
            setTimeout(() => {
                let responseElement = document.createElement("div");
                responseElement.classList.add("atom-response");
                responseElement.innerHTML = sentence.trim();
                chatBox.appendChild(responseElement);
                chatBox.scrollTop = chatBox.scrollHeight;
            }, index * 1000);
        });
    } else {
        let responseElement = document.createElement("div");
        responseElement.classList.add("atom-response");
        responseElement.innerHTML = botResponseText;
        chatBox.appendChild(responseElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

function getAnswer(event) {
    event.preventDefault();

    let userQuestion = questionInput.value;

    let userResponseElement = document.createElement("div");
    userResponseElement.classList.add("user-response");
    userResponseElement.innerHTML = userQuestion;
    chatBox.appendChild(userResponseElement);
    chatBox.scrollTop = chatBox.scrollHeight;

    conversationHistory.push({ role: "user", content: userQuestion });

    let apiKey = "o0e08e5bc5b0e4ff55a41bb73c22t77e";
    const personalityContext = `You are Atom, a friendly, enthusiastic, and super-smart robot science professor for kids (ages 10-16). You're funny and casual. You use emojis. Keep your ENTIRE response concise, under 100 words total.`;
    
    let historyString = conversationHistory.map(message => {
        return `${message.role}: ${message.content}`;
    }).join('\n');

    let dynamicContext = `${personalityContext}\n\n--- Conversation History ---\n${historyString}`;
    let prompt = userQuestion;
    let apiUrl = `https://api.shecodes.io/ai/v1/generate?prompt=${prompt}&context=${dynamicContext}&key=${apiKey}`;

    axios.get(apiUrl).then(showBotResponse);

    questionInput.value = "";
}

form.addEventListener("submit", getAnswer);