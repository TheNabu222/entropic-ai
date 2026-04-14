// ====
// STYLE CHIPS
// Quick-apply aesthetic presets to selected components
// ====

(function() {
  'use strict';

  // Style presets (mirrors store.ts)
  const STYLE_PRESETS = window.STYLE_PRESETS || [
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

  function createStyleChipsPanel() {
    // Find the sidebar properties panel
    const sidebar = document.querySelector('.sidebar-content');
    if (!sidebar) {
      console.log('Sidebar not found, will retry...');
      setTimeout(createStyleChipsPanel, 500);
      return;
    }

    // Check if already exists
    if (document.getElementById('style-chips-panel')) return;

    // Create the panel as a prop-group
    const panel = document.createElement('details');
    panel.id = 'style-chips-panel';
    panel.className = 'prop-group';
    panel.open = true;
    panel.innerHTML = `
      <summary>🎨 Style Chips</summary>
      <div class="prop-body">
        <div class="style-chips-grid">
          ${STYLE_PRESETS.map(preset => `
            <button class="style-chip" data-preset-id="${preset.id}" title="${preset.name}">
              <span class="chip-emoji">${preset.emoji}</span>
              <span class="chip-name">${preset.name}</span>
            </button>
          `).join('')}
        </div>
        <div class="style-chips-preview" id="style-chips-preview">
          <div class="preview-label">Preview</div>
          <div class="preview-box" id="style-preview-box">Hover a chip</div>
        </div>
      </div>
    `;

    // Insert at top of sidebar
    sidebar.insertBefore(panel, sidebar.firstChild);

    addStyleChipsStyles();
    setupChipHandlers();
  }

  function addStyleChipsStyles() {
    if (document.getElementById('style-chips-styles')) return;

    const style = document.createElement('style');
    style.id = 'style-chips-styles';
    style.textContent = `
      .style-chips-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        gap: 8px;
        margin-bottom: 15px;
      }

      .style-chip {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 10px 8px;
        background: var(--glass-bg, rgba(255,255,255,0.05));
        border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        color: var(--text-main, #fff);
      }

      .style-chip:hover {
        transform: translateY(-2px) scale(1.05);
        border-color: var(--magenta, #ff00cc);
        box-shadow: 0 5px 20px rgba(255, 0, 204, 0.3);
      }

      .style-chip:active {
        transform: scale(0.95);
      }

      .style-chip.applied {
        border-color: var(--cyan, #00f0ff);
        background: rgba(0, 240, 255, 0.1);
        box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
      }

      .chip-emoji {
        font-size: 20px;
      }

      .chip-name {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        opacity: 0.8;
      }

      .style-chips-preview {
        background: rgba(0,0,0,0.3);
        border-radius: 8px;
        padding: 15px;
        text-align: center;
        border: 2px solid var(--glass-border);
      }

      .preview-label {
        font-size: 11px;
        text-transform: uppercase;
        color: var(--text-dim, #8fa1b3);
        margin-bottom: 10px;
        font-weight: bold;
      }

      .preview-box {
        padding: 20px;
        min-height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.3s;
        background: var(--glass-bg);
        color: var(--text-main);
        font-weight: bold;
      }

      /* Toast Notification */
      .style-chip-toast {
        position: fixed;
        top: 80px;
        right: 340px;
        background: linear-gradient(135deg, var(--cyan), var(--magenta));
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 240, 255, 0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        font-weight: bold;
        animation: slideInRight 0.3s ease-out, fadeOut 0.3s ease-in 2.7s;
        pointer-events: none;
      }

      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes fadeOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }

      .style-chip.applying {
        animation: chipPulse 0.5s ease-out;
      }

      @keyframes chipPulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.2);
          box-shadow: 0 0 30px var(--cyan);
        }
      }
    `;
    document.head.appendChild(style);
  }

  function setupChipHandlers() {
    document.querySelectorAll('.style-chip').forEach(chip => {
      const presetId = chip.dataset.presetId;
      const preset = STYLE_PRESETS.find(p => p.id === presetId);
      if (!preset) return;

      // Hover preview
      chip.addEventListener('mouseenter', () => {
        const previewBox = document.getElementById('style-preview-box');
        if (previewBox) {
          Object.assign(previewBox.style, preset.styles);
          previewBox.textContent = preset.name;
        }
      });

      chip.addEventListener('mouseleave', () => {
        const previewBox = document.getElementById('style-preview-box');
        if (previewBox) {
          previewBox.style.cssText = '';
          previewBox.textContent = 'Hover a chip';
        }
      });

      // Click to apply
      chip.addEventListener('click', () => {
        // Add applying animation
        chip.classList.add('applying');
        setTimeout(() => chip.classList.remove('applying'), 500);
        
        // Apply the style
        const success = applyStylePreset(preset);
        
        if (success) {
          // Visual feedback - mark as applied
          document.querySelectorAll('.style-chip').forEach(c => c.classList.remove('applied'));
          chip.classList.add('applied');
          
          // Show toast notification
          showToast(preset);
        }
      });
    });
  }

  function showToast(preset) {
    // Remove any existing toast
    const existingToast = document.querySelector('.style-chip-toast');
    if (existingToast) existingToast.remove();

    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'style-chip-toast';
    toast.innerHTML = `
      <span style="font-size: 24px;">${preset.emoji}</span>
      <span>Applied <strong>${preset.name}</strong> style!</span>
    `;
    document.body.appendChild(toast);

    // Remove after animation
    setTimeout(() => toast.remove(), 3000);
  }

  function applyStylePreset(preset) {
    // Get selected element in canvas
    const doc = window.getCanvasDoc && window.getCanvasDoc();
    if (!doc) {
      showToast({ emoji: '⚠️', name: 'Error: No canvas' });
      return false;
    }

    const selected = doc.querySelector('.selected') || window.selectedEl;
    if (!selected) {
      showToast({ emoji: '⚠️', name: 'Error: Select element first' });
      return false;
    }

    // Apply styles
    Object.entries(preset.styles).forEach(([prop, value]) => {
      // Convert camelCase to kebab-case for CSS
      const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
      selected.style[prop] = value;
    });

    // Update store if available
    if (window.coaiexistStore) {
      window.coaiexistStore.updateActivePage({});
    }

    // Save state
    if (window.saveState) window.saveState();

    // Feedback
    if (window.playSound) window.playSound('pop');
    if (window.showStamp) window.showStamp(preset.emoji);
    if (window.updateStatus) window.updateStatus(`Applied ${preset.name} style`);
    if (window.moodBar) window.moodBar.setMood('🎨 Style applied. Aesthetics updated.', true, 3000);

    console.log(`Applied ${preset.name} style:`, preset.styles);
    return true;
  }

  // Global API
  window.styleChips = {
    presets: STYLE_PRESETS,
    apply: applyStylePreset,
    getPreset: (id) => STYLE_PRESETS.find(p => p.id === id)
  };

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(createStyleChipsPanel, 200));
  } else {
    setTimeout(createStyleChipsPanel, 200);
  }

  console.log('🎨 Style Chips loaded!');
})();
