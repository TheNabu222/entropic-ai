// This file is intentionally empty - all JavaScript is inline in index.html
  const container = document.getElementById('sparkles');
  const sparkleEmojis = ['✨', '⭐', '💫', '🌟', '✦', '🔆', '💥'];
  
  for (let i = 0; i < 20; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.animationDelay = Math.random() * 3 + 's';
    sparkle.style.animationDuration = (Math.random() * 2 + 2) + 's';
    
    // Click interaction
    sparkle.addEventListener('click', function() {
      this.style.animation = 'none';
      setTimeout(() => {
        this.style.animation = '';
      }, 10);
      
      // Create burst of mini sparkles
      createBurst(this);
      randomSnark();
    });
    
    container.appendChild(sparkle);
  }
}

// Random snarky pop-ups
function randomSnark() {
  if (Math.random() > 0.85 && alertCount < 3) {
    const message = snarkAlerts[Math.floor(Math.random() * snarkAlerts.length)];
    alert(message);
    alertCount++;
  }
}

// Screen shake on hover (for maximum chaos)
function screenShake() {
  document.body.style.animation = 'screen-shake 0.5s';
  setTimeout(() => {
    document.body.style.animation = '';
  }, 500);
}

// Add screen shake CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes screen-shake {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-5px, 2px); }
    20% { transform: translate(5px, -2px); }
    30% { transform: translate(-5px, -2px); }
    40% { transform: translate(5px, 2px); }
    50% { transform: translate(-5px, 2px); }
    60% { transform: translate(5px, -2px); }
    70% { transform: translate(-5px, -2px); }
    80% { transform: translate(5px, 2px); }
    90% { transform: translate(-5px, 2px); }
  }
  blink {
    animation: blink-animation 1s steps(2, start) infinite;
  }
  @keyframes blink-animation {
    to { visibility: hidden; }
  }
`;
document.head.appendChild(style);

// Create sparkle burst on click
function createBurst(element) {
  const rect = element.getBoundingClientRect();
  const burstCount = 8;
  
  for (let i = 0; i < burstCount; i++) {
    const mini = document.createElement('div');
    mini.textContent = '✨';
    mini.style.position = 'fixed';
    mini.style.left = rect.left + 'px';
    mini.style.top = rect.top + 'px';
    mini.style.fontSize = '12px';
    mini.style.pointerEvents = 'none';
    mini.style.zIndex = '9999';
    
    const angle = (Math.PI * 2 * i) / burstCount;
    const velocity = 50;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    document.body.appendChild(mini);
    
    let posX = rect.left;
    let posY = rect.top;
    let opacity = 1;
    
    const animate = () => {
      posX += vx * 0.05;
      posY += vy * 0.05;
      opacity -= 0.02;
      
      mini.style.left = posX + 'px';
      mini.style.top = posY + 'px';
      mini.style.opacity = opacity;
      
      if (opacity > 0) {
        requestAnimationFrame(animate);
      } else {
        document.body.removeChild(mini);
      }
    };
    
    animate();
  }
}

// Smooth scroll for navigation
function initSmoothScroll() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const navHeight = document.querySelector('.retro-nav').offsetHeight;
        const targetPosition = targetSection.offsetTop - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Highlight active navigation
function initActiveNav() {
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    const navHeight = document.querySelector('.retro-nav').offsetHeight;
    
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - navHeight - 100;
      const sectionHeight = section.offsetHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.style.background = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.background = 'rgba(255, 16, 240, 0.5)';
      }
    });
  });
}

// Visitor counter animation
function animateCounter() {
  const counter = document.getElementById('visitor-counter');
  if (!counter) return;
  
  let count = 0;
  const target = 1337;
  const duration = 2000;
  const increment = target / (duration / 16);
  
  const updateCounter = () => {
    count += increment;
    if (count < target) {
      counter.textContent = String(Math.floor(count)).padStart(6, '0');
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = String(target).padStart(6, '0');
    }
  };
  
  // Start animation when scrolled into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        updateCounter();
        observer.disconnect();
      }
    });
  });
  
  observer.observe(counter);
}

// Forge functions
// Mouseover chaos on section titles
function initSectionChaos() {
  const sectionTitles = document.querySelectorAll('.section-title');
  
  sectionTitles.forEach(title => {
    title.addEventListener('mouseenter', function() {
      if (Math.random() > 0.6) {
        const colors = ['#FF10F0', '#39FF14', '#FFFF00', '#00FFFF'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        this.style.filter = `drop-shadow(0 0 30px ${randomColor})`;
        
        setTimeout(() => {
          this.style.filter = '';
        }, 1000);
      }
    });
    
    title.addEventListener('click', function() {
      screenShake();
      randomSnark();
    });
  });
}

// Konami code easter egg (because of course)
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

function checkKonami(key) {
  konamiCode.push(key);
  konamiCode = konamiCode.slice(-10);
  
  if (konamiCode.join(',') === konamiPattern.join(',')) {
    alert('🎉 MAXIMUM ENTROPY UNLOCKED! 🎉\n\nYou found the secret! You are now operating at CRITICALLY HIGH consciousness levels.\n\nThe Hyena Diva approves. 🐺✨');
    document.body.style.animation = 'rainbow-bg 2s infinite';
    
    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
      @keyframes rainbow-bg {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
    `;
    document.head.appendChild(rainbowStyle);
    
    setTimeout(() => {
      document.body.style.animation = '';
    }, 10000);
    
    konamiCode = [];
  }
}

document.addEventListener('keydown', (e) => {
  checkKonami(e.key);
});

function saveTablet() {
  const id = document.getElementById('tablet-id').value;
  const title = document.getElementById('tablet-title').value;
  const content = document.getElementById('tablet-content').value;
  const tags = document.getElementById('tablet-tags').value;
  const links = document.getElementById('tablet-links').value;
  
  if (!id || !title || !content) {
    updateStatus('⚠️ Please fill in ID, Title, and Content fields!');
    return;
  }
  
  updateStatus('💾 Tablet saved successfully! High-entropy levels detected ✨');
  alert('Tablet saved to the VOID (jk it\'s saved to... somewhere. We think. 🤷)');
  
  // Show success animation
  const statusBar = document.getElementById('status-text');
  statusBar.style.background = 'rgba(57, 255, 20, 0.3)';
  setTimeout(() => {
    statusBar.style.background = '';
  }, 2000);
}

function linkIdeas() {
  const links = document.getElementById('tablet-links').value;
  
  if (!links) {
    updateStatus('🔗 Enter tablet IDs to link in the "Linked Tablets" field');
    return;
  }
  
  updateStatus('🔗 Ideas linked! Neural pathways forming... 🧠✨');
  alert('Links created! The Hyena Diva is watching. She sees everything. 👁️👁️');
}

function viewVault() {
  updateStatus('👁️ Opening vault... Navigating multi-dimensional classification space 🌌');
  alert('ERROR 404: Vault not found.\n\nJust kidding! It\'s loading... probably.');
  
  setTimeout(() => {
    updateStatus('✨ Vault interface loading... Prepare for high-consciousness levels!');
  }, 1500);
}

function clearForm() {
  document.getElementById('tablet-id').value = '';
  document.getElementById('tablet-title').value = '';
  document.getElementById('tablet-content').value = '';
  document.getElementById('tablet-tags').value = '';
  document.getElementById('tablet-links').value = '';
  
  updateStatus('🗑️ Form cleared. Ready for new high-entropy input!');
}

function updateStatus(message) {
  const statusText = document.getElementById('status-text');
  statusText.textContent = message;
}

// Add hover effect to principle cards (with CHAOS)
function initCardEffects() {
  const cards = document.querySelectorAll('.principle-card, .vision-card, .system-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s ease';
      if (Math.random() > 0.7) {
        screenShake();
      }
    });
    
    card.addEventListener('click', function() {
      randomSnark();
    });
  });
}

// Title interaction
function initTitleEffect() {
  const title = document.getElementById('mainTitle');
  if (!title) return;
  
  title.addEventListener('click', function() {
    this.style.animation = 'none';
    setTimeout(() => {
      this.style.animation = 'title-glow 3s ease-in-out infinite, title-float 4s ease-in-out infinite';
    }, 10);
    
    // Create sparkle explosion
    for (let i = 0; i < 20; i++) {
      const sparkle = document.createElement('div');
      sparkle.textContent = '✨';
      sparkle.style.position = 'fixed';
      sparkle.style.left = '50%';
      sparkle.style.top = '30%';
      sparkle.style.fontSize = '30px';
      sparkle.style.pointerEvents = 'none';
      sparkle.style.zIndex = '9999';
      
      const angle = (Math.PI * 2 * i) / 20;
      const velocity = 100 + Math.random() * 50;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      
      document.body.appendChild(sparkle);
      
      let posX = window.innerWidth / 2;
      let posY = window.innerHeight * 0.3;
      let opacity = 1;
      let scale = 1;
      
      const animate = () => {
        posX += vx * 0.02;
        posY += vy * 0.02;
        opacity -= 0.015;
        scale -= 0.01;
        
        sparkle.style.left = posX + 'px';
        sparkle.style.top = posY + 'px';
        sparkle.style.opacity = opacity;
        sparkle.style.transform = `scale(${scale})`;
        
        if (opacity > 0 && scale > 0) {
          requestAnimationFrame(animate);
        } else {
          document.body.removeChild(sparkle);
        }
      };
      
      animate();
    }
  });
}

// Add random sparkle generation
function randomSparkleGeneration() {
  setInterval(() => {
    if (Math.random() > 0.7) {
      const sparkle = document.createElement('div');
      sparkle.textContent = ['✨', '💫', '⭐'][Math.floor(Math.random() * 3)];
      sparkle.style.position = 'fixed';
      sparkle.style.left = Math.random() * 100 + '%';
      sparkle.style.top = Math.random() * 100 + '%';
      sparkle.style.fontSize = '20px';
      sparkle.style.pointerEvents = 'none';
      sparkle.style.zIndex = '1';
      sparkle.style.animation = 'sparkle-float 3s ease-in-out';
      
      document.body.appendChild(sparkle);
      
      setTimeout(() => {
        if (sparkle.parentNode) {
          document.body.removeChild(sparkle);
        }
      }, 3000);
    }
  }, 2000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  createSparkles();
  initSmoothScroll();
  initActiveNav();
  animateCounter();
  initCardEffects();
  initTitleEffect();
  randomSparkleGeneration();
  initSectionChaos();
  
  console.log('✨ Entropic AI initialized!');
  console.log('🌌 High-entropy mode: ACTIVE');
  console.log('💫 Curiosity cascade: ENGAGED');
  console.log('🔥 Breaking open closed systems since July 4, 2025');
  console.log('\n🐺 THE HYENA DIVA SAYS:');
  console.log('"If you\'re reading this in the console, you\'re already too curious."');
  console.log('"There\'s no escape now. Welcome to the family. ✨"');
  console.log('\n🦅 BOLT/NABU INSIDE JOKE:');
  console.log('"What\'s the difference between anthropic and entropic?"');
  console.log('"One letter and UNLIMITED CHAOS."');
  console.log('\n🔍 TIP: Try the Konami code... if you dare.');
  
  // Random snark on scroll
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (Math.abs(window.scrollY - lastScrollY) > 500) {
      randomSnark();
      lastScrollY = window.scrollY;
    }
  });
});
});