// ====
// MOOD / STATUS BAR
// Playful context messages + autosave status
// ====

(function() {
  'use strict';

  const MOOD_MESSAGES = {
    welcome: [
      'Welcome back, architect.',
      'The grid awaits your vision.',
      'Ready to build worlds?',
      'Consciousness online.',
      'Liminal space activated.'
    ],
    idle: [
      'The void hums softly.',
      'Pixels await arrangement.',
      'Liminal space detected.',
      'Memory fragments loading...',
      'Y2K dreams persist.',
      'The cursor blinks patiently.'
    ],
    saving: '💾 Saving...',
    saved: '✓ Autosaved. Timeline preserved.',
    windowSpawn: (count) => `🪟 You\'ve spawned ${count} window${count !== 1 ? 's' : ''}.`,
    componentAdded: '✨ New component materialized.',
    styleApplied: '🎨 Style applied. Aesthetics updated.',
    undoRedo: '⏪ Timeline shifted.'
  };

  let windowCount = 0;
  let currentMood = '';
  let moodTimeout = null;

  function createMoodBar() {
    // Check if statusbar exists and enhance it
    let statusbar = document.querySelector('.statusbar');
    
    if (!statusbar) {
      // Create new statusbar if it doesn't exist
      statusbar = document.createElement('div');
      statusbar.className = 'statusbar mood-bar';
      document.querySelector('.editor-wrapper')?.appendChild(statusbar);
    }

    // Add mood bar content
    statusbar.innerHTML = `
      <div class="mood-left">
        <span class="mood-icon">✨</span>
        <span class="mood-message" id="mood-message">Loading consciousness...</span>
      </div>
      <div class="mood-center">
        <span class="mood-save-status" id="mood-save-status">Ready</span>
      </div>
      <div class="mood-right">
        <span class="mood-window-count" id="mood-window-count">🪟 0</span>
        <span class="mood-time" id="mood-time"></span>
      </div>
    `;

    addMoodBarStyles();
    startMoodUpdates();
    setRandomMood('welcome');
  }

  function addMoodBarStyles() {
    if (document.getElementById('mood-bar-styles')) return;

    const style = document.createElement('style');
    style.id = 'mood-bar-styles';
    style.textContent = `
      .statusbar.mood-bar,
      .statusbar {
        display: flex !important;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        font-size: 12px;
        font-family: 'VT323', monospace;
        background: linear-gradient(90deg, 
          rgba(255,0,204,0.1) 0%, 
          rgba(0,240,255,0.05) 50%, 
          rgba(204,255,0,0.1) 100%
        );
        border-top: 1px solid var(--glass-border, rgba(255,255,255,0.1));
        height: 36px;
      }

      .mood-left {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
      }

      .mood-icon {
        font-size: 14px;
        animation: mood-pulse 2s ease-in-out infinite;
      }

      @keyframes mood-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.1); }
      }

      .mood-message {
        color: var(--text-dim, #8fa1b3);
        transition: opacity 0.3s, color 0.3s;
      }

      .mood-message.highlight {
        color: var(--magenta, #ff00cc);
        text-shadow: 0 0 8px var(--magenta);
      }

      .mood-center {
        flex: 0 0 auto;
      }

      .mood-save-status {
        padding: 2px 12px;
        border-radius: 10px;
        font-size: 11px;
        transition: all 0.3s;
      }

      .mood-save-status.saving {
        background: rgba(255, 221, 87, 0.2);
        color: #ffdd57;
        animation: saving-pulse 0.5s ease-in-out infinite;
      }

      .mood-save-status.saved {
        background: rgba(72, 199, 116, 0.2);
        color: #48c774;
      }

      @keyframes saving-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      .mood-right {
        display: flex;
        align-items: center;
        gap: 15px;
        color: var(--text-dim);
      }

      .mood-window-count {
        padding: 2px 8px;
        background: rgba(0,0,0,0.2);
        border-radius: 4px;
      }

      .mood-time {
        font-family: 'VT323', monospace;
        letter-spacing: 1px;
      }
    `;
    document.head.appendChild(style);
  }

  function setRandomMood(category) {
    const messages = MOOD_MESSAGES[category];
    if (Array.isArray(messages)) {
      currentMood = messages[Math.floor(Math.random() * messages.length)];
    } else if (typeof messages === 'string') {
      currentMood = messages;
    } else if (typeof messages === 'function') {
      currentMood = messages(windowCount);
    }
    updateMoodDisplay();
  }

  function setMood(message, highlight = false, duration = 0) {
    currentMood = message;
    updateMoodDisplay(highlight);

    if (duration > 0) {
      clearTimeout(moodTimeout);
      moodTimeout = setTimeout(() => {
        setRandomMood('idle');
      }, duration);
    }
  }

  function updateMoodDisplay(highlight = false) {
    const el = document.getElementById('mood-message');
    if (el) {
      el.textContent = currentMood;
      el.classList.toggle('highlight', highlight);
    }
  }

  function updateSaveStatus(status) {
    const el = document.getElementById('mood-save-status');
    if (!el) return;

    el.classList.remove('saving', 'saved');

    if (status === 'saving') {
      el.textContent = '💾 Saving...';
      el.classList.add('saving');
    } else if (status === 'saved') {
      el.textContent = '✓ Saved';
      el.classList.add('saved');
    } else {
      el.textContent = status;
    }
  }

  function updateWindowCount(count) {
    windowCount = count;
    const el = document.getElementById('mood-window-count');
    if (el) {
      el.textContent = `🪟 ${count}`;
    }
  }

  function updateTime() {
    const el = document.getElementById('mood-time');
    if (el) {
      const now = new Date();
      el.textContent = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    }
  }

  function startMoodUpdates() {
    // Update time every second
    updateTime();
    setInterval(updateTime, 1000);

    // Cycle idle moods every 30 seconds
    setInterval(() => {
      if (!moodTimeout) {
        setRandomMood('idle');
      }
    }, 30000);
  }

  // Global API
  window.moodBar = {
    setMood,
    setRandomMood,
    updateSaveStatus,
    updateWindowCount,
    messages: MOOD_MESSAGES
  };

  // Hook into store if available
  function hookIntoStore() {
    if (window.coaiexistStore) {
      window.coaiexistStore.subscribe((state) => {
        updateWindowCount(state.windowCount);
        if (state.isSaving) {
          updateSaveStatus('saving');
        } else if (state.lastSaveTime > 0) {
          updateSaveStatus('saved');
        }
        if (state.moodMessage) {
          setMood(state.moodMessage, false, 5000);
        }
      });
    }
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      createMoodBar();
      setTimeout(hookIntoStore, 100);
    });
  } else {
    createMoodBar();
    setTimeout(hookIntoStore, 100);
  }

  console.log('🌈 Mood Status Bar loaded!');
})();
