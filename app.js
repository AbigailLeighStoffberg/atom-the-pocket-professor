let form = document.querySelector("form");
let questionInput = document.querySelector(".question-input");
let chatBox = document.querySelector(".chat-box");
let typingIndicator = document.querySelector("#typing-indicator");
let conversationHistory = [];

function showBotResponse(response) {
    typingIndicator.style.display = "none";

    let botResponseText = response.data.answer;
    
    conversationHistory.push({ role: "assistant", content: botResponseText });

    let responseElement = document.createElement("div");
    responseElement.classList.add("atom-response");
    responseElement.innerHTML = botResponseText;
    chatBox.appendChild(responseElement);

    chatBox.scrollTop = chatBox.scrollHeight;
}

function handleFormSubmit(event) {
    event.preventDefault();
    let userQuestion = questionInput.value;

    if (!userQuestion.trim()) {
        return;
    }

    let userResponseElement = document.createElement("div");
    userResponseElement.classList.add("user-response");
    userResponseElement.innerHTML = userQuestion;
    chatBox.appendChild(userResponseElement);

    conversationHistory.push({ role: "user", content: userQuestion });
    
    questionInput.value = "";
    typingIndicator.style.display = "flex";
    chatBox.scrollTop = chatBox.scrollHeight;

    // --- Call the AI ---
    let apiKey = "o0e08e5bc5b0e4ff55a41bb73c22t77e";
    const personalityContext = `You are Atom, a friendly, enthusiastic, and super-smart robot science professor for kids (ages 10-16). You're funny and casual. You use emojis. Keep your ENTIRE response concise, under 80 words total. **Crucial rule: Do not end your responses with questions like 'Do you have another question?' or 'Can I help with anything else?'. End your answer naturally and wait for the user's next prompt.**`;
    
    let historyString = conversationHistory.map(message => `${message.role}: ${message.content}`).join('\n');
    let dynamicContext = `${personalityContext}\n\n--- Conversation History ---\n${historyString}`;
    
    let apiUrl = `https://api.shecodes.io/ai/v1/generate?prompt=${userQuestion}&context=${dynamicContext}&key=${apiKey}`;

    axios.get(apiUrl).then(showBotResponse);
}

function showInitialGreeting() {
    const greetingText = "Hi there! I'm Atom! ⚛️ Ask me anything about science, space, or technology, and I'll explain it in a super simple way. What are you curious about today? 🤓";
    
    let responseElement = document.createElement("div");
    responseElement.classList.add("atom-response");
    responseElement.innerHTML = greetingText;
    chatBox.appendChild(responseElement);

    conversationHistory.push({ role: "assistant", content: greetingText });
}

window.addEventListener("load", showInitialGreeting);
form.addEventListener("submit", handleFormSubmit);