const chatbox = document.getElementById("chatbox");
const toggleBtn = document.getElementById("chatbot-toggle");
const closeBtn = document.querySelector(".close-btn");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const chatBody = document.getElementById("chat-body");

// Toggle chatbox visibility
toggleBtn.addEventListener("click", () => {
  chatbox.classList.toggle("active");

  if (chatbox.classList.contains("active")) {
    renderSuggestions();  // 👈 Add this line
    input.focus();
  }

  // Accessibility
  chatbox.setAttribute("aria-hidden", !chatbox.classList.contains("active"));
  if (chatbox.classList.contains("active")) {
    input.focus();
  }
});

// Close chatbox
closeBtn.addEventListener("click", () => {
  chatbox.classList.remove("active");
  chatbox.setAttribute("aria-hidden", "true");
});

// Append messages
function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  msg.appendChild(bubble);
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

//typing animate

function typeBotMessage(text) {
  const msg = document.createElement("div");
  msg.className = "message bot";
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  msg.appendChild(bubble);
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;

  let index = 0;

  function typeNextChar() {
    if (index < text.length) {
      bubble.textContent += text.charAt(index);
      index++;
      chatBody.scrollTop = chatBody.scrollHeight;
      setTimeout(typeNextChar, 25); // Typing speed in ms
    }
  }

  typeNextChar();
}

// Show typing indicator
function showTyping() {
  const typing = document.createElement("div");
  typing.className = "typing-indicator";
  typing.id = "typing";
  typing.textContent = "Typing...";
  chatBody.appendChild(typing);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Remove typing indicator
function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

// Send message to backend (replace URL with your API endpoint)
async function sendMessage() {
  const msg = input.value.trim();
  if (!msg) return;
  appendMessage("user", msg);
  input.value = "";
  showTyping();

  try {
    const res = await fetch("https://sara.up.railway.app/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });
    const data = await res.json();
    removeTyping();
    //appendMessage("bot", data.reply);
    typeBotMessage(data.reply);

  } catch (err) {
    removeTyping();
    appendMessage("bot", "❌ Could not reach API.");
  }
  input.focus();
}

// Send on click
sendBtn.addEventListener("click", sendMessage);

// Send on Enter key
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});




//generate random questions

const suggestionTopics = [
  "Skills",
  "Education",
  "What Learning",
  "Career Goals",
  "Languages Use",
  "Projects Worked On",
  "Dream Job",
  "Programming Experience"
];

// Generate 3 random suggestions
function renderSuggestions() {
  const container = document.getElementById("suggestion-buttons");
  container.innerHTML = ""; // Clear existing

  const selected = suggestionTopics
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  selected.forEach((topic) => {
    const btn = document.createElement("button");
    btn.className = "suggest-btn";
    btn.textContent = topic;
    btn.addEventListener("click", () => {
      renderSuggestions();  // 👈 Add this line
      input.value = topic;
      sendMessage();
    });
    container.appendChild(btn);
  });
}

