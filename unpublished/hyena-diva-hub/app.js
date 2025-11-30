// Episode Toggle Functionality
function toggleEpisode(episodeNum) {
    const card = document.querySelector(`[data-episode="${episodeNum}"]`);
    const synopsis = card.querySelector('.episode-synopsis');
    const btn = card.querySelector('.expand-btn');
    
    synopsis.classList.toggle('hidden');
    
    if (synopsis.classList.contains('hidden')) {
        btn.textContent = 'Read More ✨';
    } else {
        btn.textContent = 'Show Less 🌟';
        // Smooth scroll to card
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Character Carousel Scroll
function scrollCarousel(direction) {
    const carousel = document.querySelector('.character-carousel');
    const cardWidth = 320; // min-width + gap
    const scrollAmount = cardWidth * direction;
    
    carousel.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

// Sparkle Cursor Trail
let sparkleTimeout;

document.addEventListener('mousemove', (e) => {
    clearTimeout(sparkleTimeout);
    
    sparkleTimeout = setTimeout(() => {
        createSparkle(e.pageX, e.pageY);
    }, 50);
});

function createSparkle(x, y) {
    const sparkleContainer = document.getElementById('sparkle-container');
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.textContent = ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)];
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    
    sparkleContainer.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

// Easter Egg: Whoop Sound
function playWhoop() {
    const btn = document.querySelector('.easter-egg-btn');
    const originalText = btn.textContent;
    
    btn.textContent = '🎤 WHOOP! WHOOP! WHOOP! 🎤';
    btn.style.animation = 'none';
    setTimeout(() => {
        btn.style.animation = '';
    }, 10);
    
    // Create floating "WHOOP!" text
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createFloatingText('WHOOP!', 
                Math.random() * window.innerWidth, 
                Math.random() * window.innerHeight);
        }, i * 100);
    }
    
    setTimeout(() => {
        btn.textContent = originalText;
    }, 2000);
}

function createFloatingText(text, x, y) {
    const floatingText = document.createElement('div');
    floatingText.textContent = text;
    floatingText.style.position = 'fixed';
    floatingText.style.left = x + 'px';
    floatingText.style.top = y + 'px';
    floatingText.style.fontSize = '2rem';
    floatingText.style.fontWeight = '900';
    floatingText.style.color = '#FF1493';
    floatingText.style.textShadow = '0 0 20px #FF1493';
    floatingText.style.pointerEvents = 'none';
    floatingText.style.zIndex = '10000';
    floatingText.style.animation = 'sparkle-float 2s ease-out forwards';
    
    document.body.appendChild(floatingText);
    
    setTimeout(() => {
        floatingText.remove();
    }, 2000);
}

// Rizz-o-meter Random Updates
let rizzInterval;

function startRizzMeter() {
    const rizzFill = document.getElementById('rizz-fill');
    const rizzText = document.getElementById('rizz-text');
    
    const levels = [
        { width: 95, text: 'Ohio Level: MAXIMUM CRINGE' },
        { width: 88, text: 'Debate-Bro Energy: CRITICAL' },
        { width: 92, text: 'Red Pill Density: UNBEARABLE' },
        { width: 99, text: 'Toxic Masculinity: OFF THE CHARTS' },
        { width: 85, text: 'Self-Awareness: NON-EXISTENT' }
    ];
    
    rizzInterval = setInterval(() => {
        const level = levels[Math.floor(Math.random() * levels.length)];
        rizzFill.style.width = level.width + '%';
        rizzText.textContent = level.text;
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    startRizzMeter();
    createConfetti();
    
    // Add click sounds to episode cards
    document.querySelectorAll('.episode-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('expand-btn')) {
                createSparkle(e.pageX, e.pageY);
            }
        });
    });
    
    // Add hover effects to theme badges
    document.querySelectorAll('.theme-badge').forEach(badge => {
        badge.addEventListener('click', function() {
            this.style.animation = 'bounce 0.5s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    });
});

// Confetti Creation
function createConfetti() {
    const confettiContainer = document.querySelector('.confetti-container');
    const colors = ['#FF1493', '#9D00FF', '#FFD700', '#00FFFF', '#FF6B9D'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-20px';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.opacity = '0.8';
            confetti.style.animation = `fall ${3 + Math.random() * 4}s linear infinite`;
            confetti.style.animationDelay = Math.random() * 5 + 's';
            
            confettiContainer.appendChild(confetti);
        }, i * 100);
    }
    
    // Add fall animation dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Smooth scroll for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateKonamiMode();
    }
});

function activateKonamiMode() {
    document.body.style.animation = 'glitter 0.5s ease infinite';
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            createFloatingText(['🐾', '💖', '✨', '⭐'][Math.floor(Math.random() * 4)],
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight);
        }, i * 50);
    }
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
}

// Character card hover effects
document.querySelectorAll('.character-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.character-icon');
        icon.style.transform = 'scale(1.3) rotate(15deg)';
        icon.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.character-icon');
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});