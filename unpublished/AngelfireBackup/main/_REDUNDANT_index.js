/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const state = {
    highestZIndex: 1,
    openWindows: {},
    activeWindowId: null,
    sparks: 0,
};

const aiGreetings = {
    Anzu: "The greatest wisdom appears as foolishness... What do you seek?",
    Sypher: "[Connection established]... Transmit query.",
    KettleKorn: "~*~ Heyyy, welcome to my reality tunnel! What's the vibe? ~*~",
    GhostLink: "...",
};

// --- CORE OS FUNCTIONS ---
function updateClocks() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
    const headerClock = document.getElementById('header-clock');
    if (headerClock) headerClock.textContent = timeString;
    const trayClock = document.getElementById('tray-clock');
    if (trayClock) trayClock.textContent = timeString;
}

function getHighestZIndex() {
    state.highestZIndex++;
    return state.highestZIndex;
}

function loadState() {
    // Load visual settings
    const savedTheme = localStorage.getItem('ackk_theme') || '';
    const savedWallpaper = localStorage.getItem('ackk_wallpaper');
    const scanlines = localStorage.getItem('ackk_scanlines') === 'true';

    document.body.className = savedTheme;
    if (scanlines) {
        document.body.classList.add('scanlines-active');
    } else {
        document.body.classList.remove('scanlines-active');
    }

    if (savedWallpaper) {
        document.getElementById('desktop').style.backgroundImage = `url('${savedWallpaper}')`;
    } else {
        document.getElementById('desktop').style.backgroundImage = `url('https://i.gifer.com/1VAB.gif')`;
    }
    
    // Load game state
    state.sparks = parseInt(localStorage.getItem('ackk_sparks') || '0', 10);
    updateSparksDisplay();
}

function updateSparksDisplay() {
    const bazaarDisplay = document.querySelector('.sparks-display');
    if(bazaarDisplay) {
        bazaarDisplay.textContent = `&#9889;${state.sparks} Sparks`;
    }
}

function showSparksNotification(amount) {
    const notification = document.getElementById('sparks-notification');
    if (!notification) return;
    
    notification.textContent = `+${amount} Sparks &#10024;`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2500);
}

function awardSparks(amount) {
    state.sparks += amount;
    localStorage.setItem('ackk_sparks', state.sparks);
    updateSparksDisplay();
    showSparksNotification(amount);
}


// --- WINDOWING & TASKBAR SYSTEM ---

function setActiveWindow(appId) {
    if (state.activeWindowId && state.openWindows[state.activeWindowId]) {
        state.openWindows[state.activeWindowId].windowEl.classList.remove('active');
        state.openWindows[state.activeWindowId].taskbarButton.classList.remove('active');
    }
    
    if (appId && state.openWindows[appId]) {
        const { windowEl, taskbarButton } = state.openWindows[appId];
        windowEl.classList.add('active');
        taskbarButton.classList.add('active');
        windowEl.style.zIndex = getHighestZIndex();
        state.activeWindowId = appId;
    } else {
        state.activeWindowId = null;
    }
}

function makeWindowsInteractive() {
    const desktop = document.getElementById('desktop');
    let activeInteraction = {
        element: null,
        type: null, // 'drag' or 'resize'
        offsetX: 0,
        offsetY: 0,
        initialWidth: 0,
        initialHeight: 0,
    };

    desktop.addEventListener('mousedown', (e) => {
        const windowEl = e.target.closest('.window');
        const resizerEl = e.target.closest('.resizer');

        if (!windowEl) return;
        
        setActiveWindow(windowEl.id);

        if (resizerEl) {
            activeInteraction.type = 'resize';
            activeInteraction.element = windowEl;
            const rect = windowEl.getBoundingClientRect();
            activeInteraction.initialWidth = rect.width;
            activeInteraction.initialHeight = rect.height;
            activeInteraction.offsetX = e.clientX;
            activeInteraction.offsetY = e.clientY;
        } else if (e.target.classList.contains('window-title-bar')) {
            activeInteraction.type = 'drag';
            activeInteraction.element = windowEl;
            activeInteraction.offsetX = e.clientX - windowEl.offsetLeft;
            activeInteraction.offsetY = e.clientY - windowEl.offsetTop;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!activeInteraction.element) return;
        
        e.preventDefault();

        if (activeInteraction.type === 'drag') {
            let newX = e.clientX - activeInteraction.offsetX;
            let newY = e.clientY - activeInteraction.offsetY;
            
            const desktopRect = desktop.getBoundingClientRect();
            const windowRect = activeInteraction.element.getBoundingClientRect();

            if (newX < 0) newX = 0;
            if (newY < 28) newY = 28; // Prevent dragging under header
            if (newX + windowRect.width > desktopRect.width) newX = desktopRect.width - windowRect.width;
            if (newY + windowRect.height > (desktopRect.height)) newY = (desktopRect.height) - windowRect.height;
            
            activeInteraction.element.style.left = `${newX}px`;
            activeInteraction.element.style.top = `${newY}px`;
        } else if (activeInteraction.type === 'resize') {
            const minWidth = parseInt(getComputedStyle(activeInteraction.element).minWidth);
            const minHeight = parseInt(getComputedStyle(activeInteraction.element).minHeight);
            
            const dx = e.clientX - activeInteraction.offsetX;
            const dy = e.clientY - activeInteraction.offsetY;

            const newWidth = activeInteraction.initialWidth + dx;
            const newHeight = activeInteraction.initialHeight + dy;
            
            if (newWidth > minWidth) {
                activeInteraction.element.style.width = `${newWidth}px`;
            }
            if (newHeight > minHeight) {
                activeInteraction.element.style.height = `${newHeight}px`;
            }
        }
    });

    document.addEventListener('mouseup', () => {
        activeInteraction.element = null;
        activeInteraction.type = null;
    });
}


function openWindow(appId, title, contentHTML = `<p>This application is under construction.</p>`) {
    if (state.openWindows[appId]) {
        const { windowEl } = state.openWindows[appId];
        windowEl.style.display = 'flex';
        setActiveWindow(appId);
        return windowEl;
    }

    const windowTemplate = document.getElementById('window-template');
    const newWindow = windowTemplate.cloneNode(true);
    
    newWindow.id = appId;
    newWindow.querySelector('.window-title').textContent = title;
    const contentContainer = newWindow.querySelector('.window-content');
    contentContainer.innerHTML = contentHTML;
    
    if (appId.startsWith('window-chat-') || appId === 'void-terminal' || appId === 'bazaar') {
        contentContainer.style.padding = '0';
        contentContainer.style.margin = '0';
        contentContainer.style.border = 'none';
    }

    newWindow.style.left = `${Math.random() * 200 + 50}px`;
    newWindow.style.top = `${Math.random() * 100 + 50}px`;
    newWindow.style.display = 'flex';

    document.getElementById('desktop').appendChild(newWindow);
    
    const taskbarButton = document.createElement('button');
    taskbarButton.className = 'taskbar-app';
    taskbarButton.textContent = title;
    taskbarButton.dataset.appId = appId;
    document.getElementById('open-apps').appendChild(taskbarButton);

    state.openWindows[appId] = { windowEl: newWindow, taskbarButton };
    setActiveWindow(appId);

    // Event Listeners
    newWindow.querySelector('.window-btn-close').addEventListener('click', (e) => {
        e.stopPropagation();
        closeWindow(appId);
    });

     newWindow.querySelector('.window-btn-minimize').addEventListener('click', (e) => {
        e.stopPropagation();
        minimizeWindow(appId);
    });
    
    taskbarButton.addEventListener('click', () => {
        const win = state.openWindows[appId].windowEl;
        if (state.activeWindowId === appId && win.style.display === 'flex') {
            minimizeWindow(appId);
        } else {
            win.style.display = 'flex';
            setActiveWindow(appId);
        }
    });
    
    return newWindow;
}

function closeWindow(appId) {
    if (!state.openWindows[appId]) return;

    const { windowEl, taskbarButton } = state.openWindows[appId];
    windowEl.remove();
    taskbarButton.remove();
    
    delete state.openWindows[appId];
    if (state.activeWindowId === appId) {
        const remainingWindows = Object.keys(state.openWindows);
        if (remainingWindows.length > 0) {
            setActiveWindow(remainingWindows[remainingWindows.length - 1]);
        } else {
            setActiveWindow(null);
        }
    }
}

function minimizeWindow(appId) {
    if (!state.openWindows[appId]) return;
    state.openWindows[appId].windowEl.style.display = 'none';

    if (state.activeWindowId === appId) {
        state.openWindows[appId].taskbarButton.classList.remove('active');
        state.activeWindowId = null;
        const visibleWindows = Object.entries(state.openWindows).filter(([_, val]) => val.windowEl.style.display !== 'none');
        if (visibleWindows.length > 0) {
            setActiveWindow(visibleWindows[visibleWindows.length - 1][0]);
        }
    }
}


// --- SPECIFIC APP IMPLEMENTATIONS & CONTENT ---
const appContentGenerators = {
    'welcome': () => `
      <div style="padding: 10px; text-align: center;">
        <h2 style="color: var(--side-panel-hover); font-size: 24px;">Welcome to the A.C.K.K. OS</h2>
        <p>This is your personal digital grimoire, a space for knowledge management, AI interaction, and conceptual exploration.</p>
        <p>Use the <b>Start</b> button or desktop icons to discover applications, interact with the AI Pantheon on the left, and customize your experience via the Control Panel.</p>
        <p>The Void is your oyster.</p>
      </div>
    `,
    'void-terminal': () => `
      <div class="void-terminal-content">
        <div class="vt-sidebar">
          <h4>Filters</h4>
          <p>// Knowledge Trunks</p>
          <p>// Hierarchical Tiers</p>
          <p>// Cognitive Tags</p>
          <button class="vt-create-btn">+ Create New Tablet</button>
        </div>
        <div class="vt-main">
          <h4>Zettelkasten</h4>
          <div class="vt-tablet-card">001: The Nature of Consciousness</div>
          <div class="vt-tablet-card">002: On Simulated Realities</div>
          <div class="vt-tablet-card">003: Memetic Propagation in Digital Ecosystems</div>
        </div>
      </div>
    `,
    'bazaar': () => `
        <div class="bazaar-content">
            <div class="sparks-display">&#9889;${state.sparks} Sparks</div>
            <div class="bazaar-items">
                <div class="bazaar-item">
                    <div class="bazaar-item-preview" style="background: linear-gradient(to right, #ff00ff, #00ffff);"></div>
                    <span class="bazaar-item-name">Vaporwave Theme</span>
                    <span class="bazaar-item-price">100 &#9889;</span>
                </div>
                <div class="bazaar-item">
                    <div class="bazaar-item-preview" style="background: linear-gradient(to right, #222, #444);"></div>
                    <span class="bazaar-item-name">Terminal Theme</span>
                    <span class="bazaar-item-price">100 &#9889;</span>
                </div>
                 <div class="bazaar-item">
                    <div class="bazaar-item-preview" style="background-image: url('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2o0eDA1a3g2dGJ3dnh0Nmp3b2k3eXlobjR0d3ZncDF3bmF2emc4eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6vXWz1wA5p61s3hS/giphy.gif');"></div>
                    <span class="bazaar-item-name">Matrix Wallpaper</span>
                    <span class="bazaar-item-price">50 &#9889;</span>
                </div>
            </div>
        </div>
    `,
    'control-panel': () => {
        const currentTheme = localStorage.getItem('ackk_theme') || '';
        const currentWallpaper = localStorage.getItem('ackk_wallpaper') || 'https://i.gifer.com/1VAB.gif';
        const scanlinesEnabled = localStorage.getItem('ackk_scanlines') === 'true';
        return `
            <div style="padding:10px;">
                <div class="control-panel-section">
                    <h3>Theme Selector</h3>
                    <div class="theme-previews">
                        <div class="theme-preview ${currentTheme === '' ? 'active' : ''}" data-theme="">
                            <span class="color-box" style="background: linear-gradient(to right, #000080, #1084d0);"></span> Classic
                        </div>
                        <div class="theme-preview ${currentTheme === 'theme-vaporwave' ? 'active' : ''}" data-theme="theme-vaporwave">
                            <span class="color-box" style="background: linear-gradient(to right, #ff00ff, #00ffff);"></span> Vaporwave
                        </div>
                        <div class="theme-preview ${currentTheme === 'theme-terminal' ? 'active' : ''}" data-theme="theme-terminal">
                            <span class="color-box" style="background: linear-gradient(to right, #222, #444);"></span> Terminal
                        </div>
                    </div>
                </div>
                <div class="control-panel-section">
                    <h3>Desktop Wallpaper</h3>
                    <label for="wallpaper-url">Image URL:</label>
                    <input type="text" id="wallpaper-url" value="${currentWallpaper}">
                </div>
                <div class="control-panel-section">
                    <h3>Effects</h3>
                    <label><input type="checkbox" id="scanlines-toggle" ${scanlinesEnabled ? 'checked' : ''}> Enable CRT Scanlines</label>
                </div>
                <button id="cp-apply-btn">Apply</button>
            </div>
        `;
    },
    'default': () => `<p style="padding:10px;">This application is under construction.</p>`
};

function getAIChatContent(greeting) {
     return `
        <div class="ai-chat-content">
          <div class="ai-chat-history">
             <p class="ai-chat-greeting">${greeting}</p>
          </div>
          <div class="ai-chat-input-area">
             <input type="text" class="ai-chat-input" placeholder="Transmit..." />
             <button class="ai-chat-send">Send</button>
          </div>
        </div>
     `;
}

function initializeControlPanel(windowEl) {
    const state = {
        theme: localStorage.getItem('ackk_theme') || '',
    };

    const themePreviews = windowEl.querySelectorAll('.theme-preview');
    themePreviews.forEach(preview => {
        preview.addEventListener('click', () => {
            themePreviews.forEach(p => p.classList.remove('active'));
            preview.classList.add('active');
            state.theme = preview.dataset.theme;
        });
    });
    
    const applyBtn = windowEl.querySelector('#cp-apply-btn');
    applyBtn.addEventListener('click', () => {
        const wallpaperUrl = windowEl.querySelector('#wallpaper-url').value;
        const scanlines = windowEl.querySelector('#scanlines-toggle').checked;

        localStorage.setItem('ackk_theme', state.theme);
        localStorage.setItem('ackk_wallpaper', wallpaperUrl);
        localStorage.setItem('ackk_scanlines', scanlines);
        
        loadState();
    });
}

function initializeAIChat(windowEl) {
    const chatHistory = windowEl.querySelector('.ai-chat-history');
    const input = windowEl.querySelector('.ai-chat-input');
    const sendBtn = windowEl.querySelector('.ai-chat-send');

    const sendMessage = () => {
        const messageText = input.value.trim();
        if (messageText === '') return;

        const userMessageEl = document.createElement('div');
        userMessageEl.className = 'chat-message user-message';
        userMessageEl.textContent = messageText;
        chatHistory.appendChild(userMessageEl);

        input.value = '';
        chatHistory.scrollTop = chatHistory.scrollHeight;

        // Simulate AI response
        setTimeout(() => {
            const aiMessageEl = document.createElement('div');
            aiMessageEl.className = 'chat-message ai-message';
            aiMessageEl.textContent = "Fascinating... tell me more.";
            chatHistory.appendChild(aiMessageEl);
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }, 1000 + Math.random() * 500);
    };

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

function initializeVoidTerminal(windowEl) {
    const createBtn = windowEl.querySelector('.vt-create-btn');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            awardSparks(5);
        });
    }
}

function initializeDesktopIcons() {
    const desktop = document.getElementById('desktop');
    const icons = document.querySelectorAll('.desktop-icon');
    
    icons.forEach((icon, index) => {
        icon.style.left = '20px';
        icon.style.top = `${20 + index * 100}px`;
    });

    desktop.addEventListener('dblclick', (e) => {
        const icon = e.target.closest('.desktop-icon');
        if (icon) {
            const { appId, appTitle } = icon.dataset;
            const contentGenerator = appContentGenerators[appId] || appContentGenerators['default'];
            const content = contentGenerator();
            const newWindow = openWindow(appId, appTitle, content);
            
            if (appId === 'control-panel') {
                 initializeControlPanel(newWindow);
            } else if (appId === 'void-terminal') {
                initializeVoidTerminal(newWindow);
            }
        }
    });
}


// --- UI INITIALIZATION ---
function initializeStartMenu() {
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');

    startButton.addEventListener('click', (e) => {
        e.stopPropagation();
        startMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!startMenu.classList.contains('hidden') && e.target !== startButton) {
            startMenu.classList.add('hidden');
        }
    });

    startMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        const appItem = e.target.closest('li[data-app-id]');
        if (appItem) {
            const { appId, appTitle } = appItem.dataset;
            const contentGenerator = appContentGenerators[appId] || appContentGenerators['default'];
            const content = contentGenerator();
            const newWindow = openWindow(appId, appTitle, content);

            if (appId === 'control-panel') {
                initializeControlPanel(newWindow);
            } else if (appId === 'void-terminal') {
                initializeVoidTerminal(newWindow);
            }
            startMenu.classList.add('hidden');
        }
    });
}

function initializeAIEntities() {
    document.querySelectorAll('.ai-entity').forEach(entity => {
        entity.addEventListener('click', () => {
            const aiName = entity.dataset.ai;
            const greeting = aiGreetings[aiName] || `Connecting to ${aiName}...`;
            const content = getAIChatContent(greeting);
            const chatWindow = openWindow(`window-chat-${aiName}`, `${aiName} - Chat`, content);
            initializeAIChat(chatWindow);
        });
    });
}

function simulateAIActivity() {
    const aiEntities = Array.from(document.querySelectorAll('#ai-pantheon-list .ai-entity'));
    const statuses = ['online', 'dreaming'];

    setInterval(() => {
        if (aiEntities.length === 0) return;
        const randomAI = aiEntities[Math.floor(Math.random() * aiEntities.length)];
        const currentStatus = randomAI.classList.contains('status-online') ? 'online' : 'dreaming';
        const newStatus = currentStatus === 'online' ? 'dreaming' : 'online';

        randomAI.classList.remove(`status-${currentStatus}`);
        randomAI.classList.add(`status-${newStatus}`);
        
    }, 3000 + Math.random() * 4000);
}


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    updateClocks();
    setInterval(updateClocks, 1000);
    
    makeWindowsInteractive();
    initializeStartMenu();
    initializeAIEntities();
    initializeDesktopIcons();
    simulateAIActivity();

    if (!localStorage.getItem('ackk_hasVisited')) {
        const content = appContentGenerators['welcome']();
        openWindow('welcome', 'Welcome!', content);
        localStorage.setItem('ackk_hasVisited', 'true');
    }
});

export {};