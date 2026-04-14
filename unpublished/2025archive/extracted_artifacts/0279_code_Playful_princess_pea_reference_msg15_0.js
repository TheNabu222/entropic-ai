// ADD THIS TO YOUR EXISTING SCRIPT (after your Pip is loaded)

// Pip Speech System
const pipPhrases = [
    "ERROR: Can only process 10 PDFs!",
    "SEARCHING: princess_name.txt in 0.222kb...",
    "STATUS: Too shy to be king :(",
    "ALERT: 7 other Pips self-defenestrated",
    "INFO: Polliw.ogg lol",
    "LOADING: 222 pterabytes of loneliness",
    "WARNING: Pea documentation overwhelming",
    "SYSTEM: Chthonically depressed but functional",
    "NOTE: Which doctor? Unknown.",
    "bc7f2a.1: The mycelium knows",
    "DIRECTIVE: Our dance is the cha-cha slide",
    "FACT: KIDZBOP DID 9/11",
    "REMINDER: This is not a pea-brain!",
    "UPDATE: Still processing bureaucratic horror",
    "QUERY: Has anyone seen the princess's name?"
];

// Create speech bubble
const speechBubble = document.createElement('div');
speechBubble.id = 'pip-speech';
speechBubble.style.cssText = `
    position: absolute;
    bottom: 160px;
    right: 0;
    background: rgba(0, 20, 40, 0.95);
    border: 2px solid #00ff00;
    padding: 10px;
    max-width: 250px;
    display: none;
    font-family: 'VT323', monospace;
    color: #00ff00;
    box-shadow: 0 0 20px #00ff00;
    z-index: 10000;
`;

// Add speech bubble to Pip container
const pipContainer = document.getElementById('bonzi-container').parentElement;
pipContainer.appendChild(speechBubble);

// Make Pip clickable
pipContainer.style.cursor = 'pointer';
pipContainer.addEventListener('click', () => {
    speechBubble.textContent = pipPhrases[Math.floor(Math.random() * pipPhrases.length)];
    speechBubble.style.display = 'block';
    
    setTimeout(() => {
        speechBubble.style.display = 'none';
    }, 3000);
});
