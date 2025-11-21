// Run this code only if we are on the settings page
if (document.querySelector('body .header h1').innerText.includes('SYSTEM SETTINGS')) {

    // Select all the input elements
    const themeSelect = document.querySelector('select.input'); // First select is the theme
    const primaryColorInput = document.querySelector('input[type="color"][value="#00ffff"]');
    const secondaryColorInput = document.querySelector('input[type="color"][value="#ff00ff"]');
    const saveButton = document.querySelector('.btn:nth-of-type(1)'); // First main button

    // Function to save settings
    function saveSettings() {
        const settings = {
            theme: themeSelect.value,
            primaryColor: primaryColorInput.value,
            // ... you can add all other settings here
        };
        localStorage.setItem('zettelkastenSettings', JSON.stringify(settings));
        alert('Settings Saved!');
    }

    // Function to load settings
    function loadSettings() {
        const savedSettings = JSON.parse(localStorage.getItem('zettelkastenSettings'));
        if (savedSettings) {
            themeSelect.value = savedSettings.theme;
            primaryColorInput.value = savedSettings.primaryColor;
            // Apply the colors dynamically
            document.documentElement.style.setProperty('--primary-color', savedSettings.primaryColor);
        }
    }

    // Event Listeners
    saveButton.addEventListener('click', saveSettings);

    // Load settings when the page loads
    document.addEventListener('DOMContentLoaded', loadSettings);
}
```*You would expand this logic for every control on the page. The "Reset to Defaults" button would call `localStorage.removeItem('zettelkastenSettings')` and then reload the page.*

---

#### 2. `chat.html` - Building the Conversation Engine

This requires dynamically creating new HTML elements for the chat messages.

**Functionality:**
*   When the user types a message and clicks "Send", capture the text.
*   Create a new "user" message `div` and add it to the chat window.
*   Simulate a response from the AI by creating an "ai" message `div`.

**Add this code to `script.js`:**

```javascript
// Run this code only if we are on the chat page
if (document.querySelector('body .header h1').innerText.includes('AI CHAT INTERFACE')) {
    const chatContainer = document.querySelector('.chat-container');
    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.chat-input .btn');

    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', sender.toLowerCase());
        messageDiv.innerHTML = `<strong>${sender === 'AI' ? '&#129302; Consciousness AI' : '&#128100; You'}:</strong><br>${text}`;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to bottom
    }

    function handleUserInput() {
        const userText = chatInput.value.trim();
        if (userText === "") return;

        addMessage('User', userText);
        chatInput.value = '';

        // Simulate AI response
        setTimeout(() => {
            let aiResponse = "That's a profound thought. I am processing the connections in the network...";
            if (userText.toLowerCase().includes("hello")) {
                aiResponse = "Hello! How can I assist your exploration of consciousness today?";
            } else if (userText.toLowerCase().includes("zettel")) {
                aiResponse = "Of course. I can create a zettel for that. What should the primary topic be?";
            }
            addMessage('AI', aiResponse);
        }, 1500);
    }

    sendButton.addEventListener('click', handleUserInput);
    chatInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleUserInput();
        }
    });
}

if (document.querySelector('body .header h1').innerText.includes('KNOWLEDGE TRUNKS')) {
    const searchInput = document.querySelector('input[placeholder="Search trunks..."]');
    const allTrunks = document.querySelectorAll('.grid .card'); // Assumes this grid contains the trunks

    searchInput.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        allTrunks.forEach(trunk => {
            const title = trunk.querySelector('h3').innerText.toLowerCase();
            if (title.includes(searchTerm)) {
                trunk.style.display = 'block';
            } else {
                trunk.style.display = 'none';
            }
        });
    });
}

if (document.querySelector('body .header h1').innerText.includes('MYCORRHIZAL NETWORK')) {
    const nodes = document.querySelectorAll('.card [style*="z-index: 2"]'); // A bit fragile, better to add a class
    const infoPanel = document.querySelector('.info-panel'); // You would need to add an info panel div

    nodes.forEach(node => {
        node.addEventListener('click', () => {
            const nodeName = node.querySelector('div[style*="color"]').innerText.replace('<br>', ' ');
            // Update an info panel with details
            alert(`You clicked on the ${nodeName} node!`);
            // In a real version, you'd update an info div:
            // infoPanel.innerHTML = `<h3>${nodeName}</h3><p>Connections: ...</p>`;
        });
    });
}

if (document.querySelector('body .header h1').innerText.includes('SACRED CLOWN GENERATOR')) {
    const generateBtn = document.querySelector('.btn'); // First button
    const clownNameEl = document.querySelector('h3[style*="#ff00ff"]');
    const clownQuoteEl = document.querySelector('.card div[style*="italic"]');
    const clownTeachingEl = document.querySelector('.card div[style*="border-left"]');

    const clowns = [
        {
            name: "THE QUANTUM JESTER",
            quote: `"Truth through Paradox, Wisdom through Folly"`,
            teaching: `"The greatest wisdom appears as foolishness to those who mistake knowledge for understanding."`
        },
        {
            name: "THE ZEN FOOL",
            quote: `"Enlightenment is the punchline to a cosmic joke."`,
            teaching: `"To find the path, you must first joyfully accept you are lost. The universe does not make mistakes."`
        },
        {
            name: "THE DATA GHOST",
            quote: `"I am the glitch in your reality, the pattern you can't unsee."`,
            teaching: `"Your certainty is a cage. I offer you the beautiful, terrifying freedom of the unknown."`
        }
    ];

    function generateClown() {
        const randomClown = clowns[Math.floor(Math.random() * clowns.length)];
        clownNameEl.innerText = randomClown.name;
        clownQuoteEl.innerText = randomClown.quote;
        clownTeachingEl.innerText = randomClown.teaching;
    }

    generateBtn.addEventListener('click', generateClown);
}```