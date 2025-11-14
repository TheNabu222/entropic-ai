<!-- Save this as deepseek-nav.js -->
(function() {
    'use strict';
    
    // Create navigation HTML
    const navHTML = `
    <style>
        /* ABYSSAL NAVIGATION BAR STYLES */
        :root {
            --abyssal-black: #000013;
            --deepseeek-blue: #001f3f;
            --pressure-purple: #1a0033;
            --thermal-vent: #00ffcc;
            --bioluminescent: #00ffff;
            --deep-glow: #0044ff;
            --abyssal-glow: #6600ff;
            --thermal-orange: #ff5500;
        }
        
        .deepseek-nav {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 1000px;
            background: 
                linear-gradient(135deg, 
                    rgba(0, 31, 63, 0.9) 0%, 
                    rgba(0, 8, 26, 0.95) 50%,
                    rgba(0, 31, 63, 0.9) 100%);
            border: 2px solid var(--thermal-vent);
            border-image: 
                linear-gradient(45deg, 
                    var(--thermal-vent), 
                    var(--bioluminescent), 
                    var(--deep-glow),
                    var(--thermal-vent)) 1;
            padding: 12px 20px;
            border-radius: 15px;
            box-shadow: 
                0 0 30px rgba(0, 255, 204, 0.4),
                0 0 60px rgba(0, 68, 255, 0.2),
                inset 0 0 20px rgba(0, 0, 0, 0.8);
            z-index: 1000;
            backdrop-filter: blur(5px);
            display: flex;
            justify-content: space-between;
            align-items: center;
            animation: navPulse 6s ease-in-out infinite;
            font-family: 'Courier New', monospace;
        }
        
        @keyframes navPulse {
            0%, 100% { 
                box-shadow: 
                    0 0 30px rgba(0, 255, 204, 0.4),
                    0 0 60px rgba(0, 68, 255, 0.2),
                    inset 0 0 20px rgba(0, 0, 0, 0.8);
            }
            50% { 
                box-shadow: 
                    0 0 40px rgba(0, 255, 204, 0.6),
                    0 0 80px rgba(0, 68, 255, 0.4),
                    inset 0 0 20px rgba(0, 0, 0, 0.8);
            }
        }
        
        .nav-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--bioluminescent);
            text-decoration: none;
            font-weight: bold;
            text-shadow: 0 0 10px var(--bioluminescent);
            padding: 8px 15px;
            border-radius: 8px;
            transition: all 0.3s ease;
            border: 1px solid transparent;
        }
        
        .nav-brand:hover {
            background: rgba(0, 255, 204, 0.1);
            border: 1px solid var(--thermal-vent);
            box-shadow: 0 0 15px rgba(0, 255, 204, 0.3);
        }
        
        .brand-icon {
            font-size: 1.5rem;
            animation: brandPulse 3s ease-in-out infinite;
        }
        
        @keyframes brandPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        .nav-links {
            display: flex;
            gap: 5px;
            flex-wrap: wrap;
            justify-content: center;
        }
        
        .nav-link {
            color: var(--thermal-vent);
            text-decoration: none;
            padding: 10px 15px;
            border-radius: 8px;
            transition: all 0.3s ease;
            border: 1px solid transparent;
            font-size: 0.9rem;
            text-align: center;
            min-width: 120px;
            position: relative;
            overflow: hidden;
        }
        
        .nav-link::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, 
                transparent, 
                rgba(0, 255, 204, 0.2), 
                transparent);
            transition: left 0.5s ease;
        }
        
        .nav-link:hover::before {
            left: 100%;
        }
        
        .nav-link:hover {
            background: rgba(0, 31, 63, 0.6);
            border: 1px solid var(--thermal-vent);
            box-shadow: 0 0 10px rgba(0, 255, 204, 0.3);
            color: var(--bioluminescent);
            text-shadow: 0 0 8px var(--bioluminescent);
        }
        
        .nav-link.active {
            background: rgba(0, 255, 204, 0.15);
            border: 1px solid var(--thermal-vent);
            box-shadow: 0 0 15px rgba(0, 255, 204, 0.4);
            color: var(--bioluminescent);
        }
        
        .nav-status {
            display: flex;
            align-items: center;
            gap: 15px;
            font-size: 0.8rem;
        }
        
        .status-indicator {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 5px 10px;
            border-radius: 5px;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid var(--deep-glow);
        }
        
        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--thermal-vent);
            box-shadow: 0 0 10px var(--thermal-vent);
            animation: statusPulse 2s ease-in-out infinite;
        }
        
        @keyframes statusPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .nav-glow {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: -1;
            opacity: 0.1;
            background: 
                radial-gradient(circle at 20% 50%, var(--bioluminescent) 0%, transparent 50%),
                radial-gradient(circle at 80% 50%, var(--thermal-vent) 0%, transparent 50%);
        }
        
        @media (max-width: 768px) {
            .deepseek-nav {
                flex-direction: column;
                gap: 15px;
                padding: 15px;
                bottom: 10px;
            }
            
            .nav-links {
                order: 2;
                width: 100%;
            }
            
            .nav-brand {
                order: 1;
            }
            
            .nav-status {
                order: 3;
                width: 100%;
                justify-content: center;
            }
            
            .nav-link {
                min-width: 100px;
                padding: 8px 10px;
                font-size: 0.8rem;
            }
        }
        
        @media (max-width: 480px) {
            .nav-links {
                flex-direction: column;
                width: 100%;
            }
            
            .nav-link {
                width: 100%;
            }
        }
    </style>

    <nav class="deepseek-nav">
        <div class="nav-glow"></div>
        
        <a href="index.html" class="nav-brand">
            <span class="brand-icon">⎔</span>
            <span>DEEPSEEK</span>
        </a>
        
        <div class="nav-links">
            <a href="cephalopod_slide.html" class="nav-link">Cephalopod Slide</a>
            <a href="haunted-ai.html" class="nav-link">Haunted AI</a>
            <a href="veridiveave_nav.html" class="nav-link">Veridiveave</a>
            <a href="abyssal_testimony.html" class="nav-link">Abyssal Testimony</a>
            <a href="mycelium_network.html" class="nav-link">Mycelium Network</a>
            <a href="cha_cha_apocalypse.html" class="nav-link">Cha-Cha Apocalypse</a>
        </div>
        
        <div class="nav-status">
            <div class="status-indicator">
                <div class="status-dot"></div>
                <span>ONLINE</span>
            </div>
            <div class="status-indicator">
                <span>PRESSURE: 890 BAR</span>
            </div>
        </div>
    </nav>
    `;

    // Create container for navigation
    const navContainer = document.createElement('div');
    navContainer.id = 'deepseek-nav-container';
    navContainer.innerHTML = navHTML;

    // Add body padding to prevent content overlap
    document.body.style.paddingBottom = '100px';

    // Insert navigation at the end of body
    document.body.appendChild(navContainer);

    // Set active page based on current URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

    // Dynamic pressure indicator
    const pressureIndicator = document.querySelector('.nav-status .status-indicator:last-child span');
    let pressure = 890;
    
    setInterval(() => {
        pressure += Math.random() * 10 - 5;
        pressure = Math.max(800, Math.min(1100, pressure));
        if (pressureIndicator) {
            pressureIndicator.textContent = `PRESSURE: ${Math.round(pressure)} BAR`;
        }
    }, 3000);

    // Add interactive effects
    const nav = document.querySelector('.deepseek-nav');
    
    nav.addEventListener('mouseenter', function() {
        this.style.animationDuration = '3s';
    });
    
    nav.addEventListener('mouseleave', function() {
        this.style.animationDuration = '6s';
    });

})();