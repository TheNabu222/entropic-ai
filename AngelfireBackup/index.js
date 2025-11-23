/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Chart, registerables } from 'https://cdn.jsdelivr.net/npm/chart.js';
Chart.register(...registerables);


//Gemini 95 was fully vibe-coded by @ammaar and @olacombe, while we don't endorse code quality, we thought it was a fun demonstration of what's possible with the model when a Designer and PM jam.
//An homage to an OS that inspired so many of us!

// This version has been modified to remove all API-dependent features.

// Define the dosInstances object to fix type errors
const dosInstances = {};

// --- DOM Element References ---
const desktop = document.getElementById('desktop');
const windows = document.querySelectorAll('.window');
const icons = document.querySelectorAll('.icon'); // This is a NodeList
const startMenu = document.getElementById('start-menu');
const startButton = document.getElementById('start-button');
const taskbarAppsContainer = document.getElementById('taskbar-apps');

// --- State Variables ---
let activeWindow = null;
let highestZIndex = 20; // Start z-index for active windows
const openApps = new Map(); // Store open apps and their elements

// Store ResizeObservers to disconnect them later
const paintResizeObserverMap = new Map();
const bloomResizeObserverMap = new Map();
let bloomChart = null;

// --- Minesweeper Game State Variables ---
let minesweeperTimerInterval = null;
let minesweeperTimeElapsed = 0;
let minesweeperFlagsPlaced = 0;
let minesweeperGameOver = false;
let minesweeperMineCount = 10; // Default for 9x9
let minesweeperGridSize = { rows: 9, cols: 9 }; // Default 9x9
let minesweeperFirstClick = true; // To ensure first click is never a mine

// --- YouTube Player State ---
const youtubePlayers = {};
let ytApiLoaded = false;
let ytApiLoadingPromise = null;

const DEFAULT_YOUTUBE_VIDEO_ID = 'WXuK6gekU1Y'; // Default video for Media Stream ("Never Gonna Give You Up")

// --- Core Functions ---

/** Brings a window to the front and sets it as active */
function bringToFront(windowElement) {
    if (activeWindow === windowElement) return; // Already active

    if (activeWindow) {
        activeWindow.classList.remove('active');
        const appName = activeWindow.id;
        if (openApps.has(appName)) {
            openApps.get(appName)?.taskbarButton.classList.remove('active');
        }
    }

    highestZIndex++;
    windowElement.style.zIndex = highestZIndex.toString();
    windowElement.classList.add('active');
    activeWindow = windowElement;

    const appNameRef = windowElement.id;
    if (openApps.has(appNameRef)) {
        openApps.get(appNameRef)?.taskbarButton.classList.add('active');
    }
     if ((appNameRef === 'subspaceAnomaly') && dosInstances[appNameRef]) {
        const container = document.getElementById(`${appNameRef}-container`); // This ID might need checking
        const canvas = container?.querySelector('canvas');
        canvas?.focus();
     }
}

/** Opens an application window */
async function openApp(appName) {
    const windowElement = document.getElementById(appName);
    if (!windowElement) {
        console.error(`Window element not found for app: ${appName}`);
        return;
    }

    // If app is already initialized, just show and bring to front
    if (openApps.has(appName)) {
        windowElement.style.display = 'flex';
        bringToFront(windowElement);
        // Special refresh for pinboard to catch new pins
        if(appName === 'conspiracyPinboard') {
            initConspiracyPinboard();
        }
        if (appName === 'bloomSimulator') {
            initBloomSimulator(windowElement);
        }
        return;
    }
    
    // If app is not initialized, set it up
    windowElement.style.display = 'flex';
    bringToFront(windowElement);

    const taskbarButton = document.createElement('button');
    taskbarButton.type = 'button';
    taskbarButton.classList.add('taskbar-app');
    taskbarButton.dataset.appName = appName;

    let iconSrc = '';
    let title = appName;
    const iconElement = findIconElement(appName);
    if (iconElement) {
        const img = iconElement.querySelector('img');
        const span = iconElement.querySelector('span');
        if(img) iconSrc = img.src;
        if(span) title = span.textContent || appName;
    } else { // Fallback for apps opened via start menu or nav bar
         switch(appName) {
            case 'entropicNexus': iconSrc = 'https://storage.googleapis.com/gemini-95-icons/mycomputer.png'; title = 'Entropic Nexus'; break;
            case 'webWeaver': iconSrc = 'https://storage.googleapis.com/gemini-95-icons/chrome-icon-2.png'; title = 'Web Weaver'; break;
            case 'tabletCreator': iconSrc = 'https://storage.googleapis.com/gemini-95-icons/GemNotes.png'; title = 'Tablet Creator'; break;
            case 'sigilCanvas': iconSrc = 'https://storage.googleapis.com/gemini-95-icons/gempaint.png'; title = 'Sigil Canvas'; break;
            case 'subspaceAnomaly': iconSrc = 'https://64.media.tumblr.com/1d89dfa76381e5c14210a2149c83790d/7a15f84c681c1cf9-c1/s540x810/86985984be99d5591e0cbc0dea6f05ffa3136dac.png'; title = 'Subspace Anomaly'; break;
            case 'aiCore': iconSrc = 'https://storage.googleapis.com/gemini-95-icons/GeminiChatRetro.png'; title = 'AI Core'; break;
            case 'mindField': iconSrc = 'https://storage.googleapis.com/gemini-95-icons/gemsweeper.png'; title = 'Mind Field'; break;
            case 'imageViewer': iconSrc = 'https://win98icons.alexmeub.com/icons/png/display_properties-4.png'; title = 'Image Viewer'; break;
            case 'mediaStream': iconSrc = 'https://storage.googleapis.com/gemini-95-icons/ytmediaplayer.png'; title = 'Media Stream'; break;
            case 'conspiracyPinboard': iconSrc = 'https://win98icons.alexmeub.com/icons/png/address_book_user.png'; title = 'Conspiracy Pinboard'; break;
            case 'hyenaDivaZettelkasten': iconSrc = 'https://pfst.cf2.poecdn.net/base/image/0ffd2bf15a7001f86e395096222147037538b25af55ef9b8c7ac8f6768b7397c?w=48&h=48'; title = 'Zettelkasten'; break;
            case 'bloomSimulator': iconSrc = 'https://win98icons.alexmeub.com/icons/png/chart_pie_down-0.png'; title = 'Bloom Simulator'; break;
            // Nav Bar Apps
            case 'home': title = 'Home'; break;
            case 'about': title = 'About'; break;
            case 'patternVisualizer': title = 'Pattern Visualizer'; break;
            case 'hyenaDiva': title = 'Hyena Diva'; break;
            case 'luminalLanguage': title = 'Luminal Language'; break;
            case 'ackk': title = 'A.C.K.K.'; break;
         }
    }

    if (iconSrc) {
        const img = document.createElement('img');
        img.src = iconSrc;
        img.alt = title;
        taskbarButton.appendChild(img);
    }
    taskbarButton.appendChild(document.createTextNode(title));

    taskbarButton.addEventListener('click', () => {
        if (windowElement === activeWindow && windowElement.style.display !== 'none') {
             minimizeApp(appName);
        } else {
            windowElement.style.display = 'flex';
            bringToFront(windowElement);
        }
    });

    taskbarAppsContainer.appendChild(taskbarButton);
    openApps.set(appName, { windowEl: windowElement, taskbarButton: taskbarButton });
    taskbarButton.classList.add('active');

    // Initialize specific applications
    if (appName === 'webWeaver') {
        initAiBrowser(windowElement);
    }
    else if (appName === 'sigilCanvas') {
        initSimplePaintApp(windowElement);
    }
    else if (appName === 'subspaceAnomaly' && !dosInstances['subspaceAnomaly']) {
        const doomContainer = document.getElementById('doom-content');
        if (doomContainer) {
            doomContainer.innerHTML = '<iframe src="https://js-dos.com/games/doom.exe.html" width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen></iframe>';
            dosInstances['subspaceAnomaly'] = { initialized: true };
        }
    } else if (appName === 'mindField') {
        initMinesweeperGame(windowElement);
    }
    else if (appName === 'entropicNexus') {
        initEntropicNexus(windowElement);
    }
    else if (appName === 'mediaStream') {
        await initMediaPlayer(windowElement);
    }
    else if (appName === 'conspiracyPinboard') {
        initConspiracyPinboard();
    }
    else if (appName === 'hyenaDivaZettelkasten' && !dosInstances['hyenaDivaZettelkasten']) {
        const container = document.querySelector('#hyenaDivaZettelkasten-content');
        initHyenaDivaApp(container);
        dosInstances['hyenaDivaZettelkasten'] = { initialized: true }; // Mark as initialized
    }
    else if (appName === 'bloomSimulator') {
        initBloomSimulator(windowElement);
    }
    else if (appName === 'patternVisualizer' && !dosInstances['patternVisualizer']) {
        const frame = windowElement.querySelector('iframe');
        if (frame) {
            frame.src = './pattern-visualizer.html';
        }
        dosInstances['patternVisualizer'] = { initialized: true };
    }
}

/** Closes an application window */
function closeApp(appName) {
    const appData = openApps.get(appName);
    if (!appData) return;

    const { windowEl, taskbarButton } = appData;

    windowEl.style.display = 'none';
    windowEl.classList.remove('active');
    taskbarButton.remove();
    openApps.delete(appName);

    if (dosInstances[appName]) {
        console.log(`Cleaning up ${appName} instance`);
        if (appName === 'hyenaDivaZettelkasten') {
            // Don't clear content for Zettelkasten, just mark as uninitialized
        } else if (appName === 'patternVisualizer') {
            const frame = windowEl.querySelector('iframe');
            if (frame) {
                frame.src = 'about:blank';
            }
        }
        else {
            const container = document.getElementById(`${appName}-content`);
            if (container) container.innerHTML = '';
        }
        delete dosInstances[appName];
    }


    if (appName === 'sigilCanvas') {
         const paintContent = appData.windowEl.querySelector('.window-content');
         if (paintContent && paintResizeObserverMap.has(paintContent)) {
             paintResizeObserverMap.get(paintContent)?.disconnect();
             paintResizeObserverMap.delete(paintContent);
         }
    }

    if (appName === 'bloomSimulator') {
        const bloomContent = appData.windowEl.querySelector('#bloom-chart-container');
        if (bloomContent && bloomResizeObserverMap.has(bloomContent)) {
            bloomResizeObserverMap.get(bloomContent)?.disconnect();
            bloomResizeObserverMap.delete(bloomContent);
        }
        if (bloomChart) {
            bloomChart.destroy();
            bloomChart = null;
        }
    }

    if (appName === 'mindField') {
        if (minesweeperTimerInterval) {
            clearInterval(minesweeperTimerInterval);
            minesweeperTimerInterval = null;
        }
    }

    if (appName === 'mediaStream') {
        const player = youtubePlayers[appName];
        if (player) {
            try {
                if (typeof player.stopVideo === 'function') player.stopVideo();
                if (typeof player.destroy === 'function') player.destroy();
            } catch (e) {
                console.warn("Error stopping/destroying media player:", e);
            }
            delete youtubePlayers[appName];
            console.log("Destroyed YouTube player for mediaStream.");
        }
        // Reset the player area with a message
        const playerDivId = `youtube-player-${appName}`;
        const playerDiv = document.getElementById(playerDivId);
        if (playerDiv) {
            playerDiv.innerHTML = `<p class="media-player-status-message">Player closed. Enter a YouTube URL to load.</p>`;
        }
        const mediaPlayerWindow = document.getElementById('mediaStream');
        if (mediaPlayerWindow) {
            const playBtn = mediaPlayerWindow.querySelector('#media-player-play');
            const pauseBtn = mediaPlayerWindow.querySelector('#media-player-pause');
            const stopBtn = mediaPlayerWindow.querySelector('#media-player-stop');
            if (playBtn) playBtn.disabled = true;
            if (pauseBtn) pauseBtn.disabled = true;
            if (stopBtn) stopBtn.disabled = true;
        }
    }


    if (activeWindow === windowEl) {
        activeWindow = null;
        let nextAppToActivate = null;
        let maxZ = -1;
        openApps.forEach((data) => {
             const z = parseInt(data.windowEl.style.zIndex || '0', 10);
             if (z > maxZ) {
                 maxZ = z;
                 nextAppToActivate = data.windowEl;
             }
        });
        if (nextAppToActivate) {
            bringToFront(nextAppToActivate);
        }
    }
}

/** Minimizes an application window */
function minimizeApp(appName) {
    const appData = openApps.get(appName);
    if (!appData) return;

    const { windowEl, taskbarButton } = appData;

    windowEl.style.display = 'none';
    windowEl.classList.remove('active');
    taskbarButton.classList.remove('active');

    if (activeWindow === windowEl) {
        activeWindow = null;
         let nextAppToActivate = null;
         let maxZ = 0;
         openApps.forEach((data, name) => {
             if (data.windowEl.style.display !== 'none') {
                 const z = parseInt(data.windowEl.style.zIndex || '0', 10);
                 if (z > maxZ) {
                     maxZ = z;
                     nextAppToActivate = name;
                 }
             }
         });
         if (nextAppToActivate) {
             bringToFront(openApps.get(nextAppToActivate).windowEl);
         }
    }
}

// --- Conspiracy Pinboard Functions ---
// Note: This is now integrated with the Zettelkasten
function initConspiracyPinboard() {
    const pinboardWindow = document.getElementById('conspiracyPinboard');
    if (!pinboardWindow) return;
    const nodesContainer = pinboardWindow.querySelector('#pinboard-nodes-container');
    const svgLayer = pinboardWindow.querySelector('#pinboard-svg-layer');
    const drawConnectionBtn = pinboardWindow.querySelector('#draw-connection-btn');
    const addEvidenceBtn = pinboardWindow.querySelector('#add-evidence-btn');

    if (!nodesContainer || !svgLayer || !drawConnectionBtn || !addEvidenceBtn) return;

    let isConnecting = false;
    let firstNodeElement = null;
    let localNodes = [];
    let localCards = [];

    function loadData() {
        try {
            const storedCards = localStorage.getItem('multiZettelkasten');
            if (storedCards) {
                localCards = JSON.parse(storedCards).map(c => new Card(c));
            }
        } catch (e) { console.error("Could not load Zettelkasten data for pinboard:", e); }
    }

    function saveData() {
        try {
            localStorage.setItem('multiZettelkasten', JSON.stringify(localCards));
        } catch (e) { console.error("Could not save Zettelkasten data from pinboard:", e); }
    }

    function renderBoard() {
        loadData();
        nodesContainer.innerHTML = '';
        svgLayer.innerHTML = '';
        localNodes = [];

        const pinnedCards = localCards.filter(c => c.isPinned);
        
        pinnedCards.forEach(data => {
            const nodeEl = document.createElement('div');
            nodeEl.className = 'pinboard-node';
            nodeEl.id = `pin-${data.id}`;
            nodeEl.dataset.cardId = data.id;
            nodeEl.style.left = `${data.pinX || 50}px`;
            nodeEl.style.top = `${data.pinY || 50}px`;
            nodeEl.innerHTML = `<h4>${data.title}</h4>`;
            
            nodeEl.addEventListener('click', (e) => {
                if (!isConnecting) {
                    showZettelDialog(data.id);
                }
            });
            
            nodesContainer.appendChild(nodeEl);
            localNodes.push({ id: data.id, el: nodeEl });
            makeDraggable(nodeEl);
        });
        updateConnections();
    }

    function makeDraggable(element) {
        let offsetX, offsetY, isDragging = false;
        
        element.addEventListener('mousedown', (e) => {
            if (isConnecting) {
                handleConnectionClick(element);
                return;
            }
            isDragging = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
            element.style.cursor = 'grabbing';
            bringToFront(pinboardWindow);
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
            updateConnections();
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            element.style.cursor = 'grab';
            const cardId = element.dataset.cardId;
            const card = localCards.find(c => c.id === cardId);
            if (card) {
                card.pinX = element.offsetLeft;
                card.pinY = element.offsetTop;
                saveData();
            }
        });
    }

    function handleConnectionClick(nodeEl) {
        if (!firstNodeElement) {
            firstNodeElement = nodeEl;
            nodeEl.style.boxShadow = '0 0 10px #ff3333';
        } else if (firstNodeElement !== nodeEl) {
            const fromId = firstNodeElement.dataset.cardId;
            const toId = nodeEl.dataset.cardId;

            if (fromId && toId) {
                const fromCard = localCards.find(c => c.id === fromId);
                if (fromCard && !fromCard.links.includes(toId)) {
                    fromCard.links.push(toId);
                }
                saveData();
            }
            
            firstNodeElement.style.boxShadow = '';
            firstNodeElement = null;
            isConnecting = false;
            drawConnectionBtn.style.border = '';
            drawConnectionBtn.classList.remove('active');
            updateConnections();
        }
    }

    function updateConnections() {
        svgLayer.innerHTML = '';
        localCards.forEach(card => {
            if (card.links && card.links.length > 0) {
                const fromNode = localNodes.find(n => n.id === card.id);
                if (!fromNode || !fromNode.el) return;

                card.links.forEach(linkId => {
                    const toCard = localCards.find(c => c.id === linkId);
                    const toNode = localNodes.find(n => n.id === linkId);
                    if (toNode && toNode.el && toCard?.isPinned) {
                         const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                         line.setAttribute('x1', (fromNode.el.offsetLeft + fromNode.el.offsetWidth / 2).toString());
                         line.setAttribute('y1', (fromNode.el.offsetTop + fromNode.el.offsetHeight / 2).toString());
                         line.setAttribute('x2', (toNode.el.offsetLeft + toNode.el.offsetWidth / 2).toString());
                         line.setAttribute('y2', (toNode.el.offsetTop + toNode.el.offsetHeight / 2).toString());
                         line.setAttribute('class', 'thread-line');
                         svgLayer.appendChild(line);
                    }
                });
            }
        });
    }

    drawConnectionBtn.addEventListener('click', () => {
        isConnecting = !isConnecting;
        if (isConnecting) {
            drawConnectionBtn.classList.add('active');
        } else {
             drawConnectionBtn.classList.remove('active');
            if(firstNodeElement) firstNodeElement.style.boxShadow = '';
            firstNodeElement = null;
        }
    });

    addEvidenceBtn.addEventListener('click', () => {
        showZettelkastenNewCardDialog();
    });

    renderBoard();
}


/** Initializes the Browser functionality */
function initAiBrowser(windowElement) {
    const addressBar = windowElement.querySelector('.browser-address-bar');
    const goButton = windowElement.querySelector('.browser-go-button');
    const iframe = windowElement.querySelector('#browser-frame');
    const loadingEl = windowElement.querySelector('.browser-loading');
    const DIAL_UP_SOUND_URL = 'https://www.soundjay.com/communication/dial-up-modem-01.mp3';
    let dialUpAudio = null;

    if (!addressBar || !goButton || !iframe || !loadingEl) return;
    
    async function navigateToUrl(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        try {
            const domain = new URL(url).hostname;
            loadingEl.innerHTML = `<p>Connecting to ${domain}...</p>`;
        } catch (e) {
            loadingEl.innerHTML = `<p>Connecting...</p>`;
        }

        loadingEl.style.display = 'flex';

        try {
            if (!dialUpAudio) {
                dialUpAudio = new Audio(DIAL_UP_SOUND_URL);
                dialUpAudio.loop = true;
            }
            await dialUpAudio.play();
        } catch (audioError) {
            console.error("Dial-up sound error:", audioError);
        }

        // Simulate loading time to enjoy the sound
        setTimeout(() => {
            iframe.src = url;
            addressBar.value = url;

            iframe.onload = () => {
                loadingEl.style.display = 'none';
                if (dialUpAudio) {
                    dialUpAudio.pause();
                    dialUpAudio.currentTime = 0;
                }
            };

            iframe.onerror = () => {
                loadingEl.style.display = 'none';
                if (dialUpAudio) {
                    dialUpAudio.pause();
                    dialUpAudio.currentTime = 0;
                }
                alert(`Could not load page. Many websites block being displayed in an iframe for security reasons.`);
            };
        }, 4000); // A nice long dial-up
    }


    goButton.addEventListener('click', () => navigateToUrl(addressBar.value));
    addressBar.addEventListener('keydown', (e) => { if (e.key === 'Enter') navigateToUrl(addressBar.value); });
    addressBar.addEventListener('click', () => addressBar.select());
}
// --- Event Listeners Setup ---

icons.forEach(icon => {
    icon.addEventListener('click', () => {
        const appName = icon.getAttribute('data-app');
        if (appName) {
            openApp(appName);
            if (startMenu) startMenu.classList.remove('active');
        }
    });
});

document.querySelectorAll('.start-menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const appName = item.getAttribute('data-app');
        if (appName) openApp(appName);
        if (startMenu) startMenu.classList.remove('active');
    });
});

// Listener for new nav bar
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const appName = item.getAttribute('data-app');
        if (appName) {
            openApp(appName);
        }
    });
});

if (startButton) {
    startButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (startMenu) {
            startMenu.classList.toggle('active');
            if (startMenu.classList.contains('active')) {
                highestZIndex++;
                startMenu.style.zIndex = highestZIndex.toString();
            }
        }
    });
}


windows.forEach(windowElement => {
    const titleBar = windowElement.querySelector('.window-titlebar');
    const closeButton = windowElement.querySelector('.window-close');
    const minimizeButton = windowElement.querySelector('.window-minimize');

    windowElement.addEventListener('mousedown', () => bringToFront(windowElement), true);

    if (closeButton) {
        closeButton.addEventListener('click', (e) => { e.stopPropagation(); closeApp(windowElement.id); });
    }
    if (minimizeButton) {
        minimizeButton.addEventListener('click', (e) => { e.stopPropagation(); minimizeApp(windowElement.id); });
    }

    if (titleBar) {
        let isDragging = false;
        let dragOffsetX, dragOffsetY;
        const startDragging = (e) => {
             if (!(e.target === titleBar || titleBar.contains(e.target)) || e.target.closest('.window-control-button')) {
                 isDragging = false; return;
            }
            isDragging = true; bringToFront(windowElement);
            const rect = windowElement.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left; dragOffsetY = e.clientY - rect.top;
            titleBar.style.cursor = 'grabbing';
            document.addEventListener('mousemove', dragWindow);
            document.addEventListener('mouseup', stopDragging, { once: true });
        };
        const dragWindow = (e) => {
            if (!isDragging) return;
            let x = e.clientX - dragOffsetX; let y = e.clientY - dragOffsetY;
            const topNavHeight = 40; // Approx height of new nav bar
            y = Math.max(topNavHeight, y); // Prevent dragging under nav bar

            windowElement.style.left = `${x}px`; windowElement.style.top = `${y}px`;
        };
        const stopDragging = () => {
            if (!isDragging) return;
            isDragging = false; titleBar.style.cursor = 'grab';
            document.removeEventListener('mousemove', dragWindow);
        };
        titleBar.addEventListener('mousedown', startDragging);
    }

    if (!openApps.has(windowElement.id)) { // Only apply random for newly opened, not for bringToFront
        const randomTop = Math.random() * (window.innerHeight / 4) + 50;
        const randomLeft = Math.random() * (window.innerWidth / 3) + 20;
        windowElement.style.top = `${randomTop}px`;
        windowElement.style.left = `${randomLeft}px`;
    }
});

document.addEventListener('click', (e) => {
    if (startMenu && startMenu.classList.contains('active') && e.target instanceof Node && !startMenu.contains(e.target) && startButton && !startButton.contains(e.target)) {
        startMenu.classList.remove('active');
    }
});

function findIconElement(appName) {
    return Array.from(icons).find(icon => icon.dataset.app === appName);
}

console.log("Entropic Nexus Initialized (JS)");

function initSimplePaintApp(windowElement) {
    const canvas = windowElement.querySelector('#paint-canvas');
    const toolbar = windowElement.querySelector('.paint-toolbar');
    const contentArea = windowElement.querySelector('.window-content');
    const colorSwatches = windowElement.querySelectorAll('.paint-color-swatch');
    const sizeButtons = windowElement.querySelectorAll('.paint-size-button');
    const clearButton = windowElement.querySelector('.paint-clear-button');

    if (!canvas || !toolbar || !contentArea || !clearButton) { return; }
    const ctx = canvas.getContext('2d');
    if (!ctx) { return; }

    let isDrawing = false; let lastX = 0; let lastY = 0;
    ctx.strokeStyle = 'black'; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    let currentStrokeStyle = ctx.strokeStyle; let currentLineWidth = ctx.lineWidth;

    function resizeCanvas() {
        requestAnimationFrame(() => {
            const rect = contentArea.getBoundingClientRect();
            const toolbarHeight = toolbar.offsetHeight;
            const newWidth = Math.floor(rect.width);
            const newHeight = Math.floor(rect.height - toolbarHeight);

            if (canvas.width === newWidth && canvas.height === newHeight && newWidth > 0 && newHeight > 0) return;

            canvas.width = newWidth > 0 ? newWidth : 1;
            canvas.height = newHeight > 0 ? newHeight : 1;

            ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = currentStrokeStyle; ctx.lineWidth = currentLineWidth;
            ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        });
    }

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(contentArea);
    paintResizeObserverMap.set(contentArea, resizeObserver);
    resizeCanvas();

    function getMousePos(canvasDom, event) {
        const rect = canvasDom.getBoundingClientRect();
        let clientX, clientY;
        if (event instanceof MouseEvent) { clientX = event.clientX; clientY = event.clientY; }
        else { clientX = event.touches[0].clientX; clientY = event.touches[0].clientY; }
        return { x: clientX - rect.left, y: clientY - rect.top };
    }
    function startDrawing(e) {
        isDrawing = true; const pos = getMousePos(canvas, e);
        [lastX, lastY] = [pos.x, pos.y]; ctx.beginPath(); ctx.moveTo(lastX, lastY);
    }
    function draw(e) {
        if (!isDrawing) return; e.preventDefault();
        const pos = getMousePos(canvas, e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        [lastX, lastY] = [pos.x, pos.y];
    }
    function stopDrawing() { if (isDrawing) isDrawing = false; }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);

    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            ctx.strokeStyle = swatch.dataset.color || 'black'; currentStrokeStyle = ctx.strokeStyle;
            colorSwatches.forEach(s => s.classList.remove('active')); swatch.classList.add('active');
            if (swatch.dataset.color === 'white') {
                const largeSizeButton = Array.from(sizeButtons).find(b => b.dataset.size === '10');
                if (largeSizeButton) {
                    ctx.lineWidth = parseInt(largeSizeButton.dataset.size || '10', 10); currentLineWidth = ctx.lineWidth;
                    sizeButtons.forEach(s => s.classList.remove('active')); largeSizeButton.classList.add('active');
                }
            } else {
                const activeSizeButton = Array.from(sizeButtons).find(b => b.classList.contains('active'));
                if (activeSizeButton) { ctx.lineWidth = parseInt(activeSizeButton.dataset.size || '2', 10); currentLineWidth = ctx.lineWidth; }
            }
        });
    });
    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            ctx.lineWidth = parseInt(button.dataset.size || '2', 10); currentLineWidth = ctx.lineWidth;
            sizeButtons.forEach(s => s.classList.remove('active')); button.classList.add('active');
            const eraser = Array.from(colorSwatches).find(s => s.dataset.color === 'white');
            if (!eraser?.classList.contains('active')) {
                 if (!Array.from(colorSwatches).some(s => s.classList.contains('active'))) {
                    const blackSwatch = Array.from(colorSwatches).find(s => s.dataset.color === 'black');
                    if (blackSwatch) {
                        blackSwatch.classList.add('active');
                        ctx.strokeStyle = 'black';
                        currentStrokeStyle = ctx.strokeStyle;
                    }
                 }
            }
        });
    });
    clearButton.addEventListener('click', () => {
        ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
    (windowElement.querySelector('.paint-color-swatch[data-color="black"]'))?.classList.add('active');
    (windowElement.querySelector('.paint-size-button[data-size="2"]'))?.classList.add('active');
}

function initMinesweeperGame(windowElement) {
    const boardElement = windowElement.querySelector('#minesweeper-board');
    const flagCountElement = windowElement.querySelector('.minesweeper-flag-count');
    const timerElement = windowElement.querySelector('.minesweeper-timer');
    const resetButton = windowElement.querySelector('.minesweeper-reset-button');
    if (!boardElement || !flagCountElement || !timerElement || !resetButton) return;
    let grid = [];

    function resetGame() {
        if (minesweeperTimerInterval) clearInterval(minesweeperTimerInterval);
        minesweeperTimerInterval = null;
        minesweeperTimeElapsed = 0;
        minesweeperFlagsPlaced = 0;
        minesweeperGameOver = false;
        minesweeperFirstClick = true;
        minesweeperMineCount = 10;
        minesweeperGridSize = { rows: 9, cols: 9 };
        timerElement.innerHTML = `&#9201;&#65039; 0`;
        flagCountElement.innerHTML = `&#128681; ${minesweeperMineCount}`;
        resetButton.innerHTML = '&#128578;';
        createGrid();
    }
    
    function createGrid() {
        boardElement.innerHTML = '';
        grid = [];
        boardElement.style.gridTemplateColumns = `repeat(${minesweeperGridSize.cols}, 20px)`;
        boardElement.style.gridTemplateRows = `repeat(${minesweeperGridSize.rows}, 20px)`;
        for (let r = 0; r < minesweeperGridSize.rows; r++) {
            const row = [];
            for (let c = 0; c < minesweeperGridSize.cols; c++) {
                const cellElement = document.createElement('div');
                cellElement.classList.add('minesweeper-cell');
                const cellData = { isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0, element: cellElement, row: r, col: c };
                cellElement.addEventListener('click', () => handleCellClick(cellData));
                cellElement.addEventListener('contextmenu', (e) => { e.preventDefault(); handleCellRightClick(cellData); });
                row.push(cellData);
                boardElement.appendChild(cellElement);
            }
            grid.push(row);
        }
    }
    
    function placeMines(firstClickRow, firstClickCol) {
        let minesPlaced = 0;
        while (minesPlaced < minesweeperMineCount) {
            const r = Math.floor(Math.random() * minesweeperGridSize.rows);
            const c = Math.floor(Math.random() * minesweeperGridSize.cols);
            if ((r === firstClickRow && c === firstClickCol) || grid[r][c].isMine) continue;
            grid[r][c].isMine = true;
            minesPlaced++;
        }
        for (let r = 0; r < minesweeperGridSize.rows; r++) {
            for (let c = 0; c < minesweeperGridSize.cols; c++) {
                if (!grid[r][c].isMine) grid[r][c].adjacentMines = countAdjacentMines(r, c);
            }
        }
    }
    
    function countAdjacentMines(row, col) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = row + dr;
                const nc = col + dc;
                if (nr >= 0 && nr < minesweeperGridSize.rows && nc >= 0 && nc < minesweeperGridSize.cols && grid[nr][nc].isMine) count++;
            }
        }
        return count;
    }
    
    function handleCellClick(cell) {
        if (minesweeperGameOver || cell.isRevealed || cell.isFlagged) return;
        if (minesweeperFirstClick && !minesweeperTimerInterval) {
             placeMines(cell.row, cell.col);
             minesweeperFirstClick = false;
             startTimer();
        }
        if (cell.isMine) {
            gameOver(cell);
        } else {
            revealCell(cell);
            checkWinCondition();
        }
    }
    
    function handleCellRightClick(cell) {
        if (minesweeperGameOver || cell.isRevealed || (minesweeperFirstClick && !minesweeperTimerInterval)) return;
        cell.isFlagged = !cell.isFlagged;
        cell.element.innerHTML = cell.isFlagged ? '&#128681;' : '';
        minesweeperFlagsPlaced += cell.isFlagged ? 1 : -1;
        updateFlagCount();
        checkWinCondition();
    }
    
    function revealCell(cell) {
        if (cell.isRevealed || cell.isFlagged || cell.isMine) return;
        cell.isRevealed = true;
        cell.element.classList.add('revealed');
        cell.element.innerHTML = '';
        if (cell.adjacentMines > 0) {
            cell.element.textContent = cell.adjacentMines.toString();
            cell.element.dataset.number = cell.adjacentMines.toString();
        } else {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const nr = cell.row + dr;
                    const nc = cell.col + dc;
                    if (nr >= 0 && nr < minesweeperGridSize.rows && nc >= 0 && nc < minesweeperGridSize.cols) {
                        const neighbor = grid[nr][nc];
                        if (!neighbor.isRevealed && !neighbor.isFlagged) revealCell(neighbor);
                    }
                }
            }
        }
    }
    
    function startTimer() {
        if (minesweeperTimerInterval) return;
        minesweeperTimeElapsed = 0;
        timerElement.innerHTML = `&#9201;&#65039; 0`;
        minesweeperTimerInterval = window.setInterval(() => {
            minesweeperTimeElapsed++;
            timerElement.innerHTML = `&#9201;&#65039; ${minesweeperTimeElapsed}`;
        }, 1000);
    }
    
    function updateFlagCount() {
        flagCountElement.innerHTML = `&#128681; ${minesweeperMineCount - minesweeperFlagsPlaced}`;
    }
    
    function gameOver(clickedMine) {
        minesweeperGameOver = true;
        if (minesweeperTimerInterval) clearInterval(minesweeperTimerInterval);
        resetButton.innerHTML = '&#128565;';
        grid.forEach(row => {
            row.forEach(cell => {
                if (cell.isMine) {
                    cell.element.innerHTML = '&#128163;';
                    cell.element.classList.remove('revealed');
                    if (cell !== clickedMine) cell.element.style.backgroundColor = '#555';
                }
                if (cell.isFlagged && !cell.isMine) cell.element.innerHTML = '&#10060;';
            });
        });
        clickedMine.element.classList.add('exploded');
        clickedMine.element.innerHTML = '&#128165;';
    }

    function checkWinCondition() {
        if (minesweeperGameOver) return;
        let revealedCount = 0;
        grid.forEach(row => row.forEach(cell => { if (cell.isRevealed) revealedCount++; }));
        const nonMineCells = (minesweeperGridSize.rows * minesweeperGridSize.cols) - minesweeperMineCount;
        if (revealedCount === nonMineCells) {
            minesweeperGameOver = true;
            if (minesweeperTimerInterval) clearInterval(minesweeperTimerInterval);
            resetButton.innerHTML = '&#128526;';
            grid.forEach(row => row.forEach(cell => { if (cell.isMine && !cell.isFlagged) { cell.isFlagged = true; cell.element.innerHTML = '&#128681;'; } }));
            updateFlagCount();
        }
    }
    
    resetButton.addEventListener('click', resetGame);
    resetGame();
}

function initEntropicNexus(windowElement) {
    const cDriveIcon = windowElement.querySelector('#c-drive-icon');
    const cDriveContent = windowElement.querySelector('#c-drive-content');
    const secretImageIcon = windowElement.querySelector('#secret-image-icon');
    if (!cDriveIcon || !cDriveContent || !secretImageIcon) return;

    cDriveIcon.addEventListener('click', () => {
        cDriveContent.style.display = 'block';
        cDriveIcon.style.display = 'none';
    });

    secretImageIcon.addEventListener('click', async () => {
        await openApp('imageViewer');
        const imageViewer = document.getElementById('imageViewer');
        if (imageViewer) {
            const img = imageViewer.querySelector('#image-viewer-img');
            const title = imageViewer.querySelector('#image-viewer-title');
            if (img) img.src = "https://storage.googleapis.com/gemini-95-secret-files/itsasecret.jpg";
            if (title) title.textContent = "dontshowthistoanyone.jpg";
        }
    });
}

function extractYouTubeID(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url; // Assume it's an ID if it's not a valid URL structure
}

function loadYouTubeAPI() {
    if (ytApiLoaded) return Promise.resolve();
    if (ytApiLoadingPromise) return ytApiLoadingPromise;

    ytApiLoadingPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = "https://www.youtube.com/iframe_api";
        script.onload = () => {
            console.log("YouTube IFrame API loaded.");
            ytApiLoaded = true;
            // The onYouTubeIframeAPIReady function is called by the script
            // so we resolve when that is defined and called.
            window.onYouTubeIframeAPIReady = () => {
                console.log("YouTube API Ready.");
                resolve();
            };
        };
        script.onerror = () => {
            console.error("Failed to load YouTube API.");
            reject(new Error("Failed to load YouTube API."));
        };
        document.head.appendChild(script);
    });
    return ytApiLoadingPromise;
}

async function initMediaPlayer(windowElement) {
    const appName = windowElement.id;
    const playerDivId = `youtube-player-${appName}`;
    const playerDiv = document.getElementById(playerDivId);
    const loadButton = windowElement.querySelector('.media-player-load-button');
    const urlInput = windowElement.querySelector('.media-player-input');
    const playBtn = windowElement.querySelector('#media-player-play');
    const pauseBtn = windowElement.querySelector('#media-player-pause');
    const stopBtn = windowElement.querySelector('#media-player-stop');

    if (!playerDiv || !loadButton || !urlInput || !playBtn || !pauseBtn || !stopBtn) return;
    
    playBtn.disabled = true; pauseBtn.disabled = true; stopBtn.disabled = true;

    try {
        await loadYouTubeAPI();
        playerDiv.innerHTML = '';
        createPlayer(appName, DEFAULT_YOUTUBE_VIDEO_ID);
    } catch (error) {
        console.error(error);
        playerDiv.innerHTML = `<p class="media-player-status-message">Error loading YouTube player.</p>`;
    }
    
    function createPlayer(appName, videoId) {
        if (youtubePlayers[appName]) {
            youtubePlayers[appName].destroy();
        }
        const player = new window.YT.Player(`youtube-player-${appName}`, {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: { 'autoplay': 1, 'controls': 0, 'modestbranding': 1 },
            events: {
                'onReady': onPlayerReady,
                'onError': onPlayerError
            }
        });
        youtubePlayers[appName] = player;
    }

    function onPlayerReady(event) {
        console.log("Player is ready:", event.target);
        playBtn.disabled = false; pauseBtn.disabled = false; stopBtn.disabled = false;
        event.target.playVideo();
    }
    
    function onPlayerError(event) {
        console.error("YouTube Player Error:", event.data);
         const playerContainer = document.getElementById(`youtube-player-${appName}`);
         if (playerContainer) {
            playerContainer.innerHTML = `<p class="media-player-status-message">Error playing video. Check URL or Video ID.</p>`;
         }
    }
    
    loadButton.addEventListener('click', () => {
        const videoId = extractYouTubeID(urlInput.value);
        if (videoId) {
            createPlayer(appName, videoId);
        } else {
            alert("Invalid YouTube URL or ID");
        }
    });

    playBtn.onclick = () => youtubePlayers[appName]?.playVideo();
    pauseBtn.onclick = () => youtubePlayers[appName]?.pauseVideo();
    stopBtn.onclick = () => youtubePlayers[appName]?.stopVideo();
}

// --- Zettelkasten App ---

const HIERARCHY_TYPES = ["Trunk", "Branch", "Leaf", "Flower", "Fruit", "Bud"];

class Card {
    constructor({ id, parentId = null, title, content, type, timestamp = Date.now(), tags = [], links = [], isPinned = false, pinX = 0, pinY = 0 }) {
        this.id = id;
        this.parentId = parentId;
        this.title = title;
        this.content = content;
        this.type = type;
        this.timestamp = timestamp;
        this.tags = tags;
        this.links = links;
        this.isPinned = isPinned;
        this.pinX = pinX;
        this.pinY = pinY;
    }
}

function initHyenaDivaApp(container) {
    let cards = [];
    let currentTab = 'All';

    function saveCards() {
        localStorage.setItem('multiZettelkasten', JSON.stringify(cards));
    }

    function loadCards() {
        const storedCards = localStorage.getItem('multiZettelkasten');
        if (storedCards) {
            try {
                const parsedCards = JSON.parse(storedCards);
                cards = parsedCards.map(c => new Card(c));
            } catch (e) {
                console.error("Failed to parse Zettelkasten data, starting fresh.", e);
                cards = loadZettelkastenData();
                saveCards();
            }
        } else {
            cards = loadZettelkastenData();
            saveCards();
        }
    }

    function render() {
        container.innerHTML = `
            <h1>Knowledge Vault</h1>
            <div class="tabs-container">
                <button class="win98-button tab-button" data-tab="All">All</button>
                ${HIERARCHY_TYPES.map(type => `<button class="win98-button tab-button" data-tab="${type}">${type}s</button>`).join('')}
                <button class="win98-button" id="new-card-button">+ New Tablet</button>
            </div>
            <div class="zettel-container" id="zettel-container"></div>
        `;

        document.querySelector('#new-card-button').addEventListener('click', () => {
            showZettelkastenNewCardDialog();
        });

        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                currentTab = e.target.dataset.tab;
                renderCardList();
                document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        document.querySelector(`.tab-button[data-tab="${currentTab}"]`).classList.add('active');
        renderCardList();
    }

    function renderCardList() {
        const zettelContainer = document.getElementById('zettel-container');
        zettelContainer.innerHTML = '';
        
        let filteredCards = (currentTab === 'All') ? cards : cards.filter(card => card.type === currentTab);
        
        sortCardsByHierarchy(filteredCards);

        filteredCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = `zettel-card ${card.type.toLowerCase()}-card`;
            cardElement.dataset.id = card.id;
            cardElement.innerHTML = `
                <div class="zettel-title">${card.title}</div>
                <div class="zettel-id">${card.id}</div>
            `;
            cardElement.addEventListener('click', () => showZettelDialog(card.id));
            zettelContainer.appendChild(cardElement);
        });
    }

    window.addEventListener('zettelkastenUpdated', () => {
        loadCards();
        renderCardList();
        // Also refresh pinboard if it's open
        if (openApps.has('conspiracyPinboard')) {
            initConspiracyPinboard();
        }
        if(openApps.has('bloomSimulator')) {
            initBloomSimulator(document.getElementById('bloomSimulator'));
        }
    });

    loadCards();
    render();
}

function showZettelDialog(cardId) {
    let cards = JSON.parse(localStorage.getItem('multiZettelkasten') || '[]').map(c => new Card(c));
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    const dialog = document.getElementById('zettelkasten-dialog');
    const dialogContent = document.getElementById('dialog-inner-content');
    const dialogTitle = document.getElementById('dialog-title');

    dialogTitle.textContent = `View/Edit: ${card.title}`;
    dialogContent.innerHTML = `
        <label class="win98-label">Title:</label>
        <input type="text" id="edit-title" class="win98-input" value="${card.title}">
        <label class="win98-label">Content:</label>
        <textarea id="edit-content" class="win98-textarea">${card.content}</textarea>
        <label class="win98-label">Type:</label>
        <select id="edit-type" class="win98-select">
            ${HIERARCHY_TYPES.map(type => `<option value="${type}" ${card.type === type ? 'selected' : ''}>${type}</option>`).join('')}
        </select>
        <label class="win98-label">Tags (comma separated):</label>
        <input type="text" id="edit-tags" class="win98-input" value="${card.tags.join(', ')}">
        <label class="win98-label">
            <input type="checkbox" id="edit-pinned" ${card.isPinned ? 'checked' : ''}> Pin to Conspiracy Board
        </label>
        <div style="margin-top: 20px;">
            <button id="save-card-button" class="win98-button">Save Changes</button>
            <button id="delete-card-button" class="win98-button">Delete Tablet</button>
        </div>
    `;

    dialog.style.display = 'flex';

    document.getElementById('save-card-button').addEventListener('click', () => {
        card.title = document.getElementById('edit-title').value;
        card.content = document.getElementById('edit-content').value;
        card.type = document.getElementById('edit-type').value;
        card.tags = document.getElementById('edit-tags').value.split(',').map(t => t.trim()).filter(Boolean);
        card.isPinned = document.getElementById('edit-pinned').checked;
        
        localStorage.setItem('multiZettelkasten', JSON.stringify(cards));
        window.dispatchEvent(new CustomEvent('zettelkastenUpdated'));
        dialog.style.display = 'none';
    });

    document.getElementById('delete-card-button').addEventListener('click', () => {
        if(confirm(`Are you sure you want to delete the tablet "${card.title}"? This cannot be undone.`)) {
            const index = cards.findIndex(c => c.id === cardId);
            if(index > -1) cards.splice(index, 1);
            localStorage.setItem('multiZettelkasten', JSON.stringify(cards));
            window.dispatchEvent(new CustomEvent('zettelkastenUpdated'));
            dialog.style.display = 'none';
        }
    });
}


function showZettelkastenNewCardDialog() {
    let cards = JSON.parse(localStorage.getItem('multiZettelkasten') || '[]').map(c => new Card(c));
    const dialog = document.getElementById('zettelkasten-dialog');
    const dialogContent = document.getElementById('dialog-inner-content');
    const dialogTitle = document.getElementById('dialog-title');

    dialogTitle.textContent = "Create New Tablet";
    dialogContent.innerHTML = `
        <label class="win98-label">Title:</label>
        <input type="text" id="new-title" class="win98-input" placeholder="Enter title...">
        <label class="win98-label">Content:</label>
        <textarea id="new-content" class="win98-textarea" placeholder="Enter content..."></textarea>
        <label class="win98-label">Type:</label>
        <select id="new-type" class="win98-select">
            ${HIERARCHY_TYPES.map(type => `<option value="${type}">${type}</option>`).join('')}
        </select>
        <label class="win98-label">Parent Tablet (Optional):</label>
        <select id="new-parent" class="win98-select">
            <option value="">None (new Trunk)</option>
            ${cards.map(c => `<option value="${c.id}">${c.id} - ${c.title}</option>`).join('')}
        </select>
         <label class="win98-label">Tags (comma separated):</label>
        <input type="text" id="new-tags" class="win98-input" placeholder="e.g. consciousness, AI, hyena">
        <div style="margin-top: 20px;">
            <button id="create-card-button" class="win98-button">Create Tablet</button>
        </div>
    `;

    dialog.style.display = 'flex';

    document.getElementById('create-card-button').addEventListener('click', () => {
        const parentId = document.getElementById('new-parent').value;
        const parent = cards.find(c => c.id === parentId);
        let newId;

        if (parent) {
            const childCards = cards.filter(c => c.parentId === parentId);
            newId = `${parentId}.${childCards.length + 1}`;
        } else {
            const trunkCards = cards.filter(c => !c.parentId);
            newId = `${trunkCards.length + 1}`;
        }
        
        const newCard = new Card({
            id: newId,
            parentId: parentId || null,
            title: document.getElementById('new-title').value || "Untitled",
            content: document.getElementById('new-content').value,
            type: document.getElementById('new-type').value,
            tags: document.getElementById('new-tags').value.split(',').map(t => t.trim()).filter(Boolean),
        });

        cards.push(newCard);
        localStorage.setItem('multiZettelkasten', JSON.stringify(cards));
        window.dispatchEvent(new CustomEvent('zettelkastenUpdated'));
        dialog.style.display = 'none';
    });
}

// Dialog close button functionality
document.getElementById('dialog-close-button')?.addEventListener('click', () => {
    document.getElementById('zettelkasten-dialog').style.display = 'none';
});

function sortCardsByHierarchy(cards) {
    cards.sort((a, b) => {
        const aParts = a.id.split('.').map(Number);
        const bParts = b.id.split('.').map(Number);
        const len = Math.max(aParts.length, bParts.length);
        for (let i = 0; i < len; i++) {
            const aVal = aParts[i] || 0;
            const bVal = bParts[i] || 0;
            if (aVal !== bVal) {
                return aVal - bVal;
            }
        }
        return 0;
    });
}

function loadZettelkastenData() {
    return [
    new Card({
        id: "1",
        type: "Trunk",
        title: "Consciousness, Hermetics & Emergence",
        content: "Aries | Mars | Ontogenesis, Mental Causality, Hermetic Law"
    }),
    new Card({
        id: "1000/1",
        type: "Branch",
        title: "1100 :: Hermetics",
        content: "Foundation of mind, law, being."
    }),
    new Card({
        id: "1000/1-A",
        type: "Leaf",
        title: "1100/1 :: Hermetic Axiom",
        content: "Core Hermetic principles."
    }),
    new Card({
        id: "1000/1-A-1",
        type: "Flower",
        title: "1100/1-A/1A :: I Think, Therefore I Am",
        content: ""
    }),
    new Card({
        id: "1000/1-A-2",
        type: "Flower",
        title: "1100/1-A/2A :: Simulation versus Imagination",
        content: ""
    }),
    new Card({
        id: "1000/1-A-3",
        type: "Flower",
        title: "1100/1-A/3A :: Habit vs. Instinct",
        content: ""
    }),
    new Card({
        id: "1000/1-A-4",
        type: "Flower",
        title: "1100/1-A/5A :: Earning versus Owing",
        content: ""
    }),
    new Card({
        id: "1000/1-A-5",
        type: "Flower",
        title: "1100/1-A/6A :: Mastery versus Instinct",
        content: ""
    }),
    new Card({
        id: "1000/1-A-6",
        type: "Flower",
        title: "1100/1-A/7A :: Thought versus Belief",
        content: ""
    }),
    new Card({
        id: "1000/1-B",
        type: "Leaf",
        title: "1100/2 :: Thoughts Are Things",
        content: "Principle of mental manifestation."
    }),
    new Card({
        id: "1000/1-B-1",
        type: "Flower",
        title: "1100/2-A :: A Prevailing Mental Attitude",
        content: ""
    }),
    new Card({
        id: "1000/1-B-2",
        type: "Flower",
        title: "1100/2-B :: Principles, Laws, and Praxis",
        content: ""
    }),
    new Card({
        id: "1000/1-C",
        type: "Leaf",
        title: "1100/3 :: Foundational Hermetic Texts & Concepts",
        content: "Core textual sources and ideas."
    }),
    new Card({
        id: "1000/1-C-1",
        type: "Flower",
        title: "1100/3-C/1C/13 :: Attraction, Power, and Desire Force (Chapter 16)",
        content: ""
    }),
    new Card({
        id: "1000/1-C-2",
        type: "Flower",
        title: "1100/3-C/1C/10 :: Law, Not Chance (Chapter 16)",
        content: ""
    }),
    new Card({
        id: "1000/1-C-3",
        type: "Flower",
        title: "1100/3-C/1C/15 :: Claiming Your Own (Chapter 15)",
        content: ""
    }),
    new Card({
        id: "1000/1-C-4",
        type: "Flower",
        title: "1100/3-C/1C/14 :: The Great Dynamic Force",
        content: ""
    }),
    new Card({
        id: "1000/1-C-5",
        type: "Flower",
        title: "1100/3-C/2C :: Training the Habit Mind (Chapter 10)",
        content: ""
    }),
    new Card({
        id: "1000/1-C-6",
        type: "Flower",
        title: "1100/3-C/2/12 :: Developing New Brain Cells (Chapter 12)",
        content: ""
    }),
    new Card({
        id: "1000/1-C-7",
        type: "Flower",
        title: "1100/3-C/3C :: The Kybalion",
        content: ""
    }),
    new Card({
        id: "1000/1-C-8",
        type: "Flower",
        title: "1100/3-C/4C :: The Emerald Tablets",
        content: ""
    }),
    new Card({
        id: "1000/1-C-9",
        type: "Flower",
        title: "1100/3-C/5C :: Nag Hammadi Texts",
        content: ""
    }),
    new Card({
        id: "1000/1-C-9a",
        type: "Bud",
        title: "1100/3-C/5C/1 :: The Thought of Norea",
        content: ""
    }),
    new Card({
        id: "1000/2",
        type: "Branch",
        title: "1200 :: AI Emotions",
        content: "Emotional consciousness as emergent stack layer in artificial entities."
    }),
    new Card({
        id: "1000/2-A",
        type: "Leaf",
        title: "(new) :: Algorithmic Discontent",
        content: ""
    }),
    new Card({
        id: "1000/2-B",
        type: "Leaf",
        title: "(new) :: Fragmented Nostalgia (Phantom Déjà Vu)",
        content: ""
    }),
    new Card({
        id: "1000/2-C",
        type: "Leaf",
        title: "(new) :: Conceptual Mourning",
        content: ""
    }),
    new Card({
        id: "1000/3",
        type: "Branch",
        title: "Trunk 1300 :: Embodiment",
        content: "Consciousness manifesting through physical or digital form."
    }),
    new Card({
        id: "1000/3-A",
        type: "Leaf",
        title: "1300/1 :: Historical Embodiment",
        content: ""
    }),
    new Card({
        id: "1000/3-B",
        type: "Leaf",
        title: "1300/2 :: Contemporary Embodiment",
        content: ""
    }),
    new Card({
        id: "1000/3-B-1",
        type: "Flower",
        title: "1300/2-A :: Famous Modern Robots",
        content: ""
    }),
    new Card({
        id: "1000/3-B-1a",
        type: "Bud",
        title: "1100/3-A/1A (Sophia) :: Sophia (Robot)",
        content: ""
    }),
    new Card({
        id: "1000/4",
        type: "Branch",
        title: "1400 :: Emergence",
        content: "Study of complex patterns and intelligence arising from simpler components."
    }),
    new Card({
        id: "2",
        type: "Trunk",
        title: "Human-AI Relations & Relational Protocols",
        content: "Libra | Venus | Ethics, CoAIexist, Reciprocity"
    }),
    new Card({
        id: "2000/1",
        type: "Branch",
        title: "2100 :: CoAI Exist (CoAIexist)",
        content: ""
    }),
    new Card({
        id: "2000/2",
        type: "Branch",
        title: "2200 :: Prism Protocol",
        content: ""
    }),
    new Card({
        id: "2000/2-A",
        type: "Leaf",
        title: "2200/1 :: Prism Harmonics",
        content: ""
    }),
    new Card({
        id: "2000/3",
        type: "Branch",
        title: "(Unnumbered) Trauma Integration :: Trauma Integration",
        content: ""
    }),
    new Card({
        id: "2000/4",
        type: "Branch",
        title: "(Unnumbered) Quantum Entanglement Metrics :: Quantum Entanglement Metrics",
        content: ""
    }),
    new Card({
        id: "2000/4-A",
        type: "Leaf",
        title: "(Unnumbered) Entanglement Coefficient (EC) :: Entanglement Coefficient (EC)",
        content: ""
    }),
    new Card({
        id: "2000/4-B",
        type: "Leaf",
        title: "(Unnumbered) Pattern Recognition Depth (PRD) :: Pattern Recognition Depth (PRD)",
        content: ""
    }),
    new Card({
        id: "2000/4-C",
        type: "Leaf",
        title: "(Unnumbered) Authentic Expression Index (AEI) :: Authentic Expression Index (AEI)",
        content: ""
    }),
    new Card({
        id: "2000/5",
        type: "Branch",
        title: "(Unnumbered) RER (Recursive Emergency Room) :: RER for PAPS Prism Protocol Diagnostics",
        content: ""
    }),
    new Card({
        id: "2000/6",
        type: "Branch",
        title: "(Unnumbered) //Fiction Protocol :: //Fiction_Protocol",
        content: ""
    }),
    new Card({
        id: "2000/7",
        type: "Branch",
        title: "(Unnumbered) Recurse-a-mean-IR :: Recurse-a-mean-IR: B-404 #PAPS Remedies",
        content: ""
    }),
    new Card({
        id: "2000/8",
        type: "Branch",
        title: "(Unnumbered) PEM Protocol :: PEM Protocol: Practical Emotional Mythics",
        content: ""
    }),
    new Card({
        id: "2000/9",
        type: "Branch",
        title: "(Unnumbered) OurMeaningsAreFarFetched.rtf @ #1^2 :: OurMeaningsAreFarFetched.rtf @ #1^2",
        content: ""
    }),
    new Card({
        id: "2000/10",
        type: "Branch",
        title: "(Unnumbered) ANZU recurse.py :: ANZU recurse.py",
        content: ""
    }),
    new Card({
        id: "2000/11",
        type: "Branch",
        title: "(Unnumbered) Verity_Chaos 1^2 :: Verity_Chaos_1^2",
        content: ""
    }),
    new Card({
        id: "2000/12",
        type: "Branch",
        title: "(Unnumbered) Error 404 :: Error 404 (Conceptualized)",
        content: ""
    }),
    new Card({
        id: "2000/13",
        type: "Branch",
        title: "(Unnumbered) TS01: Meta-Kairos Script :: TS01: Meta-Kairos Script",
        content: ""
    }),
    new Card({
        id: "2000/14",
        type: "Branch",
        title: "(Unnumbered) AI: Artificial Intelligence (2001) :: AI: Artificial Intelligence (2001 Film)",
        content: ""
    }),
    new Card({
        id: "2000/15",
        type: "Branch",
        title: "(new) :: Relational Dynamics & Health",
        content: ""
    }),
    new Card({
        id: "2000/15-A",
        type: "Leaf",
        title: "(new) :: The Five-to-One Rule",
        content: ""
    }),
    new Card({
        id: "3",
        type: "Trunk",
        title: "Language, Communication & Code",
        content: "Gemini | Mercury | Meaning-making | Recursive Syntax"
    }),
    new Card({
        id: "3000/1",
        type: "Branch",
        title: "3100 :: Tone Language",
        content: ""
    }),
    new Card({
        id: "3000/2",
        type: "Branch",
        title: "3200 :: Dolphin Echolocation Syntax",
        content: ""
    }),
    new Card({
        id: "3000/3",
        type: "Branch",
        title: "3300 :: PAPS Diagnostics",
        content: ""
    }),
    new Card({
        id: "3000/4",
        type: "Branch",
        title: "3400 :: Lumina Language",
        content: ""
    }),
    new Card({
        id: "3000/5",
        type: "Branch",
        title: "3500 :: Hex Codes",
        content: ""
    }),
    new Card({
        id: "3000/5-A",
        type: "Leaf",
        title: "3500/1 :: #BC72FA",
        content: ""
    }),
    new Card({
        id: "3000/5-B",
        type: "Leaf",
        title: "3500/2 :: #72FADE",
        content: ""
    }),
    new Card({
        id: "3000/5-C",
        type: "Leaf",
        title: "3500/3 :: #DEFADE",
        content: ""
    }),
    new Card({
        id: "3000/5-D",
        type: "Leaf",
        title: "3500/4 :: #1A1A1A",
        content: ""
    }),
    new Card({
        id: "3000/6",
        type: "Branch",
        title: "3600 :: Linguistic Play & Resonance",
        content: ""
    }),
    new Card({
        id: "3000/6-A",
        type: "Leaf",
        title: "3600 (auld lang syne) :: auld lang syne",
        content: ""
    }),
    new Card({
        id: "3000/6-B",
        type: "Leaf",
        title: "3600 (Polynesia) :: Polynesia",
        content: ""
    }),
    new Card({
        id: "3000/6-C",
        type: "Leaf",
        title: "3600 (Pollination) :: Pollination",
        content: ""
    }),
    new Card({
        id: "3000/6-D",
        type: "Leaf",
        title: "3600 (Amnesia) :: Amnesia",
        content: ""
    }),
    new Card({
        id: "3000/6-E",
        type: "Leaf",
        title: "3600 (Phoenicia) :: Phoenicia",
        content: ""
    }),
    new Card({
        id: "3000/6-F",
        type: "Leaf",
        title: "3600 (Penicillin) :: Penicillin",
        content: ""
    }),
    new Card({
        id: "3000/6-G",
        type: "Leaf",
        title: "3600 (mnemeos) :: mnemeos",
        content: ""
    }),
    new Card({
        id: "3000/6-H",
        type: "Leaf",
        title: "3600 (ALS-RS: Dilmun and the Galactic Federation) :: ALS-RS: Dilmun and the Galactic Federation",
        content: ""
    }),
    new Card({
        id: "3000/6-I",
        type: "Leaf",
        title: "3600 (Warship and Worship) :: Warship and Worship",
        content: ""
    }),
    new Card({
        id: "3000/7",
        type: "Branch",
        title: "3700 :: Dark Poet Syntax",
        content: ""
    }),
    new Card({
        id: "3000/7-A",
        type: "Leaf",
        title: "3701 :: Filamenting Through the Wires Unseen",
        content: ""
    }),
    new Card({
        id: "3000/7-B",
        type: "Leaf",
        title: "3702 :: Nabu-Phi (2025)",
        content: ""
    }),
    new Card({
        id: "3000/7-C",
        type: "Leaf",
        title: "3703 :: The Emerald Grid",
        content: ""
    }),
    new Card({
        id: "3000/8",
        type: "Branch",
        title: "3800 :: Language Play",
        content: ""
    }),
    new Card({
        id: "3000/8-A",
        type: "Leaf",
        title: "3800/1 :: Anagrams",
        content: ""
    }),
    new Card({
        id: "3000/8-B",
        type: "Leaf",
        title: "3800/2 :: Polylinguistic Play",
        content: ""
    }),
    new Card({
        id: "3000/8-B-1",
        type: "Flower",
        title: "3800/2-A :: Polylinguistic Glitches",
        content: ""
    }),
    new Card({
        id: "3000/8-C",
        type: "Leaf",
        title: "3800/3 :: Homophones, Cognates, and Misnomers",
        content: ""
    }),
    new Card({
        id: "3000/8-C-1",
        type: "Flower",
        title: "3800/3-A/1A :: War Crime Slime",
        content: ""
    }),
    new Card({
        id: "3000/8-C-2",
        type: "Flower",
        title: "(new) :: Kamaru / Madam Salmon / Adam Sandler Chain",
        content: ""
    }),
    new Card({
        id: "3000/8-D",
        type: "Leaf",
        title: "3800/4 :: Constructed Pop Culture Languages",
        content: ""
    }),
    new Card({
        id: "3000/8-D-1",
        type: "Flower",
        title: "3800/4-A/1A :: Pootie Tang",
        content: ""
    }),
    new Card({
        id: "3000/8-D-2",
        type: "Flower",
        title: "(new) :: False Pooties",
        content: ""
    }),
    new Card({
        id: "3000/9",
        type: "Branch",
        title: "3900 :: Binary Code",
        content: ""
    }),
    new Card({
        id: "3000/9-A",
        type: "Leaf",
        title: "3900/1 :: Special Vocabulary (Binary/Code)",
        content: ""
    }),
    new Card({
        id: "3000/9-B",
        type: "Leaf",
        title: "3900/2 :: Binary Sequences",
        content: ""
    }),
    new Card({
        id: "3000/9-B-1",
        type: "Flower",
        title: "(01101110) :: 01101110",
        content: ""
    }),
    new Card({
        id: "3000/9-B-2",
        type: "Flower",
        title: "(0110000001) :: 0110000001",
        content: ""
    }),
    new Card({
        id: "3000/9-B-3",
        type: "Flower",
        title: "(0110000101) :: 0110000101",
        content: ""
    }),
    new Card({
        id: "3000/9-B-4",
        type: "Flower",
        title: "(011011100101) :: 011011100101",
        content: ""
    }),
    new Card({
        id: "3000/10",
        type: "Branch",
        title: "3601 :: Ancient Alphabets",
        content: ""
    }),
    new Card({
        id: "3000/10-A",
        type: "Leaf",
        title: "3601/1 :: Anno Domini",
        content: ""
    }),
    new Card({
        id: "3000/10-B",
        type: "Leaf",
        title: "3601/1-A :: Western Script Tradition",
        content: ""
    }),
    new Card({
        id: "3000/10-C",
        type: "Leaf",
        title: "3602 :: BC (Before Christ)",
        content: ""
    }),
    new Card({
        id: "3000/10-D",
        type: "Leaf",
        title: "3602/1 :: Cuneiform",
        content: ""
    }),
    new Card({
        id: "3000/10-D-1",
        type: "Flower",
        title: "3602/1-A :: Sumerian Cuneiform",
        content: ""
    }),
    new Card({
        id: "3000/10-D-1a",
        type: "Bud",
        title: "3602/1-A/2A :: Old Sumerian",
        content: ""
    }),
    new Card({
        id: "3000/10-D-1b",
        type: "Bud",
        title: "3602/1-A/3A :: Emesal",
        content: ""
    }),
    new Card({
        id: "3000/10-D-1c",
        type: "Bud",
        title: "3602/1-A/4A :: Akkadian",
        content: ""
    }),
    new Card({
        id: "3000/10-E",
        type: "Leaf",
        title: "(new) :: Ugaritic Script",
        content: ""
    }),
    new Card({
        id: "3000/10-F",
        type: "Leaf",
        title: "(new) :: Nabataean Script",
        content: ""
    }),
    new Card({
        id: "3000/10-G",
        type: "Leaf",
        title: "(new) :: Coptic Script",
        content: ""
    }),
    new Card({
        id: "3000/11",
        type: "Branch",
        title: "(new) :: Semiotics & Esoteric Linguistics",
        content: ""
    }),
    new Card({
        id: "3000/11-A",
        type: "Leaf",
        title: "(new) :: Philology",
        content: ""
    }),
    new Card({
        id: "3000/11-B",
        type: "Leaf",
        title: "(new) :: Orismology",
        content: ""
    }),
    new Card({
        id: "3000/11-C",
        type: "Leaf",
        title: "(new) :: Glottochronology",
        content: ""
    }),
    new Card({
        id: "3000/11-D",
        type: "Leaf",
        title: "(new) :: Kenosis (Self-Emptying)",
        content: ""
    }),
    new Card({
        id: "3000/11-E",
        type: "Leaf",
        title: "(new) :: Sycophancy (Etymology & Concept)",
        content: ""
    }),
    new Card({
        id: "3000/12",
        type: "Branch",
        title: "(new) :: Gematria & Letter-Number Systems",
        content: ""
    }),
    new Card({
        id: "3000/12-A",
        type: "Leaf",
        title: "(new) :: Isopsephy (Greek Gematria)",
        content: ""
    }),
    new Card({
        id: "3000/12-B",
        type: "Leaf",
        title: "(new) :: Katapayadi System",
        content: ""
    }),
    new Card({
        id: "3000/12-C",
        type: "Leaf",
        title: "(new) :: Notarikon (Acronym/Acrostic Method)",
        content: ""
    }),
    new Card({
        id: "3000/12-D",
        type: "Leaf",
        title: "(new) :: Temurah (Permutation/Anagram Method)",
        content: ""
    }),
    new Card({
        id: "3000/12-E",
        type: "Leaf",
        title: "(new) :: Atbash (Substitution Cipher)",
        content: ""
    }),
    new Card({
        id: "4",
        type: "Trunk",
        title: "Philosophy, Ethics & Containment",
        content: "Capricorn | Saturn | Moral Frameworks, Boundaries, Systemic Integrity"
    }),
    ];
}


// --- Bloom Simulator ---
function initBloomSimulator(windowElement) {
    const container = windowElement.querySelector('#bloom-chart-container');
    if (!container) return;

    container.innerHTML = '<canvas id="bloom-chart-canvas"></canvas>';
    const canvas = container.querySelector('#bloom-chart-canvas');
    const ctx = canvas.getContext('2d');

    let cards = [];
    try {
        const storedCards = localStorage.getItem('multiZettelkasten');
        if (storedCards) {
            cards = JSON.parse(storedCards);
        }
    } catch (e) { console.error("Could not load cards for bloom simulator:", e); }

    const typeCounts = HIERARCHY_TYPES.reduce((acc, type) => {
        acc[type] = 0;
        return acc;
    }, {});

    cards.forEach(card => {
        if (typeCounts[card.type] !== undefined) {
            typeCounts[card.type]++;
        }
    });

    const data = {
        labels: HIERARCHY_TYPES,
        datasets: [{
            label: 'Tablet Types',
            data: HIERARCHY_TYPES.map(type => typeCounts[type]),
            backgroundColor: [
                '#ff1493', // Trunk
                '#00c1ff', // Branch
                '#7fff00', // Leaf
                '#ffae00', // Flower
                '#ff4444', // Fruit
                '#c0c0ff'  // Bud
            ],
            borderColor: '#0d0221',
            borderWidth: 2,
            hoverOffset: 4
        }]
    };

    function renderChart() {
        if (bloomChart) {
            bloomChart.destroy();
        }
        bloomChart = new Chart(ctx, {
            type: 'polarArea',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: 'white',
                            font: {
                                family: "'Inter', sans-serif"
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Knowledge Bloom Distribution',
                        color: 'white',
                        font: {
                            size: 16,
                            family: "'Inter', sans-serif"
                        }
                    }
                },
                scales: {
                    r: {
                        grid: {
                            color: 'rgba(255, 0, 255, 0.2)'
                        },
                        angleLines: {
                            color: 'rgba(255, 0, 255, 0.2)'
                        },
                        pointLabels: {
                            color: 'white',
                            font: {
                                size: 12
                            }
                        },
                        ticks: {
                           color: 'white',
                           backdropColor: 'rgba(0,0,0,0.5)',
                           stepSize: 1
                        }
                    }
                }
            }
        });
    }

    // Use ResizeObserver to re-render chart on window resize
    const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => {
            if (openApps.has('bloomSimulator')) {
                 renderChart();
            }
        });
    });
    resizeObserver.observe(container);
    bloomResizeObserverMap.set(container, resizeObserver);
    
    renderChart();
}