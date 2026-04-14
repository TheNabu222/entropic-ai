// ====
// QUICK STYLES - Style Chips in PRO CSS Panel
// Replaces separate Style Chips panel with integrated section
// ====

(function() {
  'use strict';

  const STYLE_PRESETS = [
    {
      id: 'glassy',
      name: 'Glassy',
      emoji: '💎',
      styles: {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        color: '#ffffff'
      }
    },
    {
      id: 'vhs-burn',
      name: 'VHS Burn',
      emoji: '📼',
      styles: {
        background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)',
        border: '2px solid #ff006e',
        borderRadius: '4px',
        boxShadow: '0 0 20px rgba(255, 0, 110, 0.5), inset 0 0 60px rgba(255, 0, 110, 0.1)',
        color: '#ff006e',
        textShadow: '0 0 10px #ff006e'
      }
    },
    {
      id: 'terminal',
      name: 'Terminal',
      emoji: '💻',
      styles: {
        background: '#0a0a0a',
        border: '1px solid #00ff00',
        borderRadius: '0',
        boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)',
        color: '#00ff00',
        fontFamily: "'VT323', 'Courier New', monospace",
        textShadow: '0 0 5px #00ff00'
      }
    },
    {
      id: 'frutiger-aero',
      name: 'Frutiger Aero',
      emoji: '🌊',
      styles: {
        background: 'linear-gradient(180deg, rgba(135, 206, 250, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)',
        border: '1px solid rgba(135, 206, 250, 0.5)',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 120, 200, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        color: '#1a5276'
      }
    },
    {
      id: 'mcbling',
      name: 'McBling',
      emoji: '✨',
      styles: {
        background: 'linear-gradient(135deg, #ff69b4 0%, #ff1493 25%, #ff00ff 50%, #8b00ff 75%, #4169e1 100%)',
        border: '3px solid #ffd700',
        borderRadius: '20px',
        boxShadow: '0 0 30px rgba(255, 0, 255, 0.5), 0 0 60px rgba(255, 215, 0, 0.3)',
        color: '#ffffff',
        textShadow: '2px 2px 0 #ff00ff, -2px -2px 0 #00ffff'
      }
    }
  ];

  window.STYLE_PRESETS = STYLE_PRESETS;

  // Inject into main-app's property panel builder
  window.buildQuickStylesHTML = function() {
    return `
      <details class="prop-group" open>
        <summary>🎨 Quick Styles</summary>
        <div class="prop-body">
          <div class="quick-styles-grid">
            ${STYLE_PRESETS.map(p => `
              <button class="qs-chip" data-style="${p.id}" title="${p.name}">
                <span class="qs-emoji">${p.emoji}</span>
                <span class="qs-name">${p.name}</span>
              </button>
            `).join('')}
          </div>
          <div class="qs-feedback" id="qs-feedback"></div>
        </div>
      </details>
    `;
  };

  function applyQuickStyle(presetId) {
    const preset = STYLE_PRESETS.find(p => p.id === presetId);
    if (!preset) return false;

    const selected = window.selectedEl;
    if (!selected) {
      showQSFeedback('⚠️ Select an element first', 'error');
      return false;
    }

    // Apply styles
    Object.entries(preset.styles).forEach(([prop, value]) => {
      selected.style[prop] = value;
    });

    // Visual feedback
    showQSFeedback(`${preset.emoji} ${preset.name} applied!`, 'success');
    
    // Update chip states
    document.querySelectorAll('.qs-chip').forEach(c => c.classList.remove('active'));
    document.querySelector(`.qs-chip[data-style="${presetId}"]`)?.classList.add('active');

    if (window.saveState) window.saveState();
    if (window.playSound) window.playSound('pop');
    if (window.updateStatus) window.updateStatus(`Applied ${preset.name} style`);

    return true;
  }

  function showQSFeedback(msg, type) {
    const fb = document.getElementById('qs-feedback');
    if (!fb) return;
    fb.textContent = msg;
    fb.className = `qs-feedback ${type}`;
    fb.style.display = 'block';
    setTimeout(() => fb.style.display = 'none', 2000);
  }

  // Setup handlers after DOM ready
  function setupQuickStylesHandlers() {
    document.addEventListener('click', (e) => {
      const chip = e.target.closest('.qs-chip');
      if (chip) {
        e.preventDefault();
        const styleId = chip.dataset.style;
        applyQuickStyle(styleId);
      }
    });
  }

  // Add CSS
  function addQuickStylesCSS() {
    if (document.getElementById('quick-styles-css')) return;
    const style = document.createElement('style');
    style.id = 'quick-styles-css';
    style.textContent = `
      .quick-styles-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 6px;
      }
      .qs-chip {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        padding: 8px 4px;
        background: var(--glass-bg, rgba(255,255,255,0.05));
        border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        color: var(--text-main, #fff);
      }
      .qs-chip:hover {
        transform: translateY(-2px);
        border-color: var(--magenta, #ff00cc);
        box-shadow: 0 4px 15px rgba(255, 0, 204, 0.3);
      }
      .qs-chip.active {
        border-color: var(--cyan, #00f0ff);
        background: rgba(0, 240, 255, 0.15);
        box-shadow: 0 0 10px rgba(0, 240, 255, 0.4);
      }
      .qs-emoji { font-size: 18px; }
      .qs-name { font-size: 8px; text-transform: uppercase; opacity: 0.7; }
      .qs-feedback {
        display: none;
        margin-top: 8px;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 11px;
        text-align: center;
      }
      .qs-feedback.success {
        background: rgba(0, 255, 100, 0.15);
        color: #00ff64;
        border: 1px solid rgba(0, 255, 100, 0.3);
      }
      .qs-feedback.error {
        background: rgba(255, 0, 100, 0.15);
        color: #ff6464;
        border: 1px solid rgba(255, 0, 100, 0.3);
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize
  addQuickStylesCSS();
  setupQuickStylesHandlers();

  window.quickStyles = { apply: applyQuickStyle, presets: STYLE_PRESETS };
  console.log('🎨 Quick Styles loaded!');
})();
