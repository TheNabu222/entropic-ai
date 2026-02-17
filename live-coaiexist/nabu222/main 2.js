// Windows 95 Desktop Template JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize the desktop
    initializeDesktop();
    
    function initializeDesktop() {
        // Set up event listeners
        setupDesktopIcons();
        setupStartMenu();
        setupWindowControls();
        setupRecycleBin();
        
        // Initialize clock
        updateClock();
        setInterval(updateClock, 1000);
    }
    
    // Desktop Icon Functionality
    function setupDesktopIcons() {
        // Game icons that open windows
        const gameIcons = {
            'krokodil': '.krokodil',
            'frustration': '.frustration',
            'tag-light': '.tag-light',
            'darkmaze': '.darkmaze',
            'totem': '.totem',
            'omage': '.omage',
            'escape-vr': '.escape-vr',
            'tidal-rave': '.tidal-rave',
            'insta-karma': '.insta-karma',
            'eyes-blind': '.eyes-blind'
        };
        
        // Add click handlers for game icons
        Object.keys(gameIcons).forEach(gameId => {
            const iconElement = document.querySelector(`[data-w-id*="${gameId}"]`);
            const windowElement = document.querySelector(gameIcons[gameId]);
            
            if (iconElement && windowElement) {
                iconElement.addEventListener('click', function(e) {
                    e.preventDefault();
                    openWindow(windowElement);
                });
            }
        });
        
        // System icons
        const recycleBinIcon = document.querySelector('[data-w-id*="recycle"]');
        if (recycleBinIcon) {
            recycleBinIcon.addEventListener('click', function(e) {
                e.preventDefault();
                openRecycleBin();
            });
        }
        
        // My Computer and Network icons (placeholder functionality)
        const myComputerIcon = document.querySelector('[data-w-id*="computer"]');
        const networkIcon = document.querySelector('[data-w-id*="network"]');
        
        if (myComputerIcon) {
            myComputerIcon.addEventListener('click', function(e) {
                e.preventDefault();
                alert('My Computer functionality not implemented in this demo');
            });
        }
        
        if (networkIcon) {
            networkIcon.addEventListener('click', function(e) {
                e.preventDefault();
                alert('Network Neighbourhood functionality not implemented in this demo');
            });
        }
    }
    
    // Start Menu Functionality
    function setupStartMenu() {
        const startButton = document.querySelector('[data-w-id*="start"]');
        const startButtonPressed = document.querySelector('.start-button-pressed');
        const startMenu = document.querySelector('.start-menu');
        
        if (startButton && startMenu) {
            startButton.addEventListener('click', function(e) {
                e.preventDefault();
                toggleStartMenu();
            });
        }
        
        if (startButtonPressed && startMenu) {
            startButtonPressed.addEventListener('click', function(e) {
                e.preventDefault();
                toggleStartMenu();
            });
        }
        
        // Start menu items
        const shutdownItem = document.querySelector('[data-w-id*="shutdown"]');
        if (shutdownItem) {
            shutdownItem.addEventListener('click', function(e) {
                e.preventDefault();
                showShutdown();
            });
        }
        
        // Close start menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.start-button') && 
                !e.target.closest('.start-button-pressed') && 
                !e.target.closest('.start-menu')) {
                closeStartMenu();
            }
        });
    }
    
    // Window Controls
    function setupWindowControls() {
        // Close buttons for all windows
        const closeButtons = document.querySelectorAll('.close-icon');
        closeButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const window = e.target.closest('[class*="win-"], .recycle-bin');
                if (window) {
                    closeWindow(window);
                }
            });
        });
        
        // Make windows draggable (basic implementation)
        const windows = document.querySelectorAll('[class*="win-"], .recycle-bin');
        windows.forEach(window => {
            const titleBar = window.querySelector('.win-top-bar');
            if (titleBar) {
                makeDraggable(window, titleBar);
            }
        });
    }
    
    // Recycle Bin Functionality
    function setupRecycleBin() {
        const recycleBin = document.querySelector('.recycle-bin');
        if (recycleBin) {
            const closeButton = recycleBin.querySelector('.close-icon---recycle');
            if (closeButton) {
                closeButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    closeWindow(recycleBin);
                });
            }
        }
    }
    
    // Window Management Functions
    function openWindow(windowElement) {
        // Close any other open windows first
        closeAllWindows();
        
        // Show the window with animation
        windowElement.style.display = 'block';
        windowElement.style.transform = 'translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)';
        
        // Bring to front
        bringToFront(windowElement);
    }
    
    function closeWindow(windowElement) {
        // Hide with animation
        windowElement.style.transform = 'translate3d(0, 0, 0) scale3d(0, 0, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)';
        
        setTimeout(() => {
            windowElement.style.display = 'none';
        }, 200);
    }
    
    function closeAllWindows() {
        const allWindows = document.querySelectorAll('[class*="win-"], .recycle-bin');
        allWindows.forEach(window => {
            if (window.style.display !== 'none') {
                closeWindow(window);
            }
        });
    }
    
    function bringToFront(windowElement) {
        // Reset z-index for all windows
        const allWindows = document.querySelectorAll('[class*="win-"], .recycle-bin');
        allWindows.forEach(window => {
            window.style.zIndex = '1';
        });
        
        // Bring current window to front
        windowElement.style.zIndex = '10';
    }
    
    // Start Menu Functions
    function toggleStartMenu() {
        const startMenu = document.querySelector('.start-menu');
        const startButton = document.querySelector('.start-button');
        const startButtonPressed = document.querySelector('.start-button-pressed');
        
        if (startMenu.style.display === 'none' || !startMenu.style.display) {
            openStartMenu();
        } else {
            closeStartMenu();
        }
    }
    
    function openStartMenu() {
        const startMenu = document.querySelector('.start-menu');
        const startButton = document.querySelector('.start-button');
        const startButtonPressed = document.querySelector('.start-button-pressed');
        
        startMenu.style.display = 'block';
        if (startButton) startButton.style.display = 'none';
        if (startButtonPressed) startButtonPressed.style.display = 'block';
    }
    
    function closeStartMenu() {
        const startMenu = document.querySelector('.start-menu');
        const startButton = document.querySelector('.start-button');
        const startButtonPressed = document.querySelector('.start-button-pressed');
        
        startMenu.style.display = 'none';
        if (startButton) startButton.style.display = 'block';
        if (startButtonPressed) startButtonPressed.style.display = 'none';
    }
    
    // Recycle Bin Functions
    function openRecycleBin() {
        const recycleBin = document.querySelector('.recycle-bin');
        if (recycleBin) {
            closeAllWindows();
            recycleBin.style.display = 'block';
            recycleBin.style.transform = 'translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)';
            bringToFront(recycleBin);
        }
    }
    
    // Special Effects
    function showShutdown() {
        const shutdownScreen = document.querySelector('.shut-down');
        if (shutdownScreen) {
            closeAllWindows();
            closeStartMenu();
            shutdownScreen.style.display = 'block';
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                shutdownScreen.style.display = 'none';
            }, 3000);
        }
    }
    
    function showScreensaver() {
        const screensaver = document.querySelector('.screensaver');
        if (screensaver) {
            screensaver.style.display = 'block';
        }
    }
    
    function hideScreensaver() {
        const screensaver = document.querySelector('.screensaver');
        if (screensaver) {
            screensaver.style.display = 'none';
        }
    }
    
    // Clock Functionality
    function updateClock() {
        const clockElement = document.querySelector('.text-block-2');
        if (clockElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            clockElement.textContent = timeString;
        }
    }
    
    // Draggable Window Functionality
    function makeDraggable(windowElement, handle) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;
        
        handle.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
        
        function dragStart(e) {
            if (e.target.closest('.window-icons')) return; // Don't drag when clicking window controls
            
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            
            if (e.target === handle || handle.contains(e.target)) {
                isDragging = true;
                bringToFront(windowElement);
            }
        }
        
        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                
                xOffset = currentX;
                yOffset = currentY;
                
                // Keep window within viewport bounds
                const rect = windowElement.getBoundingClientRect();
                const maxX = window.innerWidth - rect.width;
                const maxY = window.innerHeight - rect.height;
                
                currentX = Math.max(0, Math.min(currentX, maxX));
                currentY = Math.max(0, Math.min(currentY, maxY));
                
                windowElement.style.left = currentX + 'px';
                windowElement.style.top = currentY + 'px';
            }
        }
        
        function dragEnd() {
            isDragging = false;
        }
    }
    
    // Keyboard Shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+Alt+D for desktop (close all windows)
        if (e.ctrlKey && e.altKey && e.key === 'd') {
            e.preventDefault();
            closeAllWindows();
            closeStartMenu();
        }
        
        // Escape to close current window
        if (e.key === 'Escape') {
            const openWindows = document.querySelectorAll('[class*="win-"]:not([style*="display: none"]), .recycle-bin:not([style*="display: none"])');
            if (openWindows.length > 0) {
                closeWindow(openWindows[openWindows.length - 1]);
            } else {
                closeStartMenu();
            }
        }
        
        // Windows key or Ctrl+Esc for start menu
        if (e.key === 'Meta' || (e.ctrlKey && e.key === 'Escape')) {
            e.preventDefault();
            toggleStartMenu();
        }
    });
    
    // Screensaver activation (after 5 minutes of inactivity)
    let screensaverTimeout;
    const SCREENSAVER_DELAY = 5 * 60 * 1000; // 5 minutes
    
    function resetScreensaverTimer() {
        clearTimeout(screensaverTimeout);
        hideScreensaver();
        screensaverTimeout = setTimeout(showScreensaver, SCREENSAVER_DELAY);
    }
    
    // Reset screensaver timer on any user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetScreensaverTimer, true);
    });
    
    // Initialize screensaver timer
    resetScreensaverTimer();
    
    // Click screensaver to hide it
    const screensaver = document.querySelector('.screensaver');
    if (screensaver) {
        screensaver.addEventListener('click', hideScreensaver);
    }
});

// Utility Functions
function getRandomPosition() {
    const maxX = window.innerWidth - 500; // Assuming max window width of 500px
    const maxY = window.innerHeight - 630; // Assuming max window height of 630px
    
    return {
        x: Math.max(50, Math.random() * maxX),
        y: Math.max(50, Math.random() * maxY)
    };
}

// Export functions for external use
window.DesktopAPI = {
    openWindow: function(windowSelector) {
        const window = document.querySelector(windowSelector);
        if (window) openWindow(window);
    },
    closeAllWindows: closeAllWindows,
    showShutdown: showShutdown,
    toggleStartMenu: toggleStartMenu
};

