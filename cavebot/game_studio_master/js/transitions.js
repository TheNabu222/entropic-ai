/* ===== SCENE TRANSITION EFFECTS ===== */
const Transitions = {
  /* 
    Scene-level property: scene.transition = { type, duration }
    Types: 'none', 'fade-black', 'crossfade', 'flash', 'slide-left', 'slide-right', 'slide-up', 'slide-down'
  */

  TYPES: [
    { value: 'none', label: 'None (Instant)' },
    { value: 'fade-black', label: 'Fade to Black' },
    { value: 'crossfade', label: 'Crossfade' },
    { value: 'flash', label: 'Flash' },
    { value: 'slide-left', label: 'Slide Left' },
    { value: 'slide-right', label: 'Slide Right' },
    { value: 'slide-up', label: 'Slide Up' },
    { value: 'slide-down', label: 'Slide Down' },
  ],

  init() {
    // Ensure all scenes have transition data
    this.ensureSceneTransitions();
  },

  ensureSceneTransitions() {
    for (const scene of State.project.scenes) {
      if (!scene.transition) {
        scene.transition = { type: 'fade-black', duration: 0.5 };
      }
    }
  },

  // ---- Editor UI for scene transition settings ----
  renderSceneSettings(container, sceneId) {
    const scene = State.project.scenes.find(s => s.id === sceneId);
    if (!scene) { container.innerHTML = ''; return; }

    if (!scene.transition) scene.transition = { type: 'fade-black', duration: 0.5 };
    const t = scene.transition;

    container.innerHTML = `
      <div class="transition-settings">
        <label>Transition Effect (When Entering)</label>
        <select id="trans-type">
          ${this.TYPES.map(tt => `<option value="${tt.value}" ${t.type === tt.value ? 'selected' : ''}>${tt.label}</option>`).join('')}
        </select>
        <label style="margin-top:6px">Duration (seconds)</label>
        <input type="number" id="trans-duration" value="${t.duration}" min="0.1" max="5" step="0.1" />
        <div style="margin-top:8px">
          <button class="p3-btn" id="btn-preview-transition">▶ Preview Transition</button>
        </div>
      </div>
    `;

    container.querySelector('#trans-type')?.addEventListener('change', (e) => {
      scene.transition.type = e.target.value;
      State.autoSave();
    });

    container.querySelector('#trans-duration')?.addEventListener('change', (e) => {
      scene.transition.duration = Math.max(0.1, parseFloat(e.target.value) || 0.5);
      State.autoSave();
    });

    container.querySelector('#btn-preview-transition')?.addEventListener('click', () => {
      this.previewTransition(scene.transition);
    });
  },

  // Preview a transition effect in the editor
  previewTransition(transition) {
    if (!transition || transition.type === 'none') return;

    const canvasArea = document.getElementById('canvas-area');
    if (!canvasArea) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      z-index: 10000; pointer-events: none;
    `;

    const dur = (transition.duration || 0.5) + 's';

    switch (transition.type) {
      case 'fade-black':
        overlay.style.background = '#000';
        overlay.style.animation = `fadeBlack ${dur} ease forwards`;
        break;
      case 'crossfade':
        overlay.style.background = 'rgba(0,0,0,0.5)';
        overlay.style.animation = `crossfade ${dur} ease forwards`;
        break;
      case 'flash':
        overlay.style.background = '#fff';
        overlay.style.animation = `flashTransition ${Math.min(parseFloat(dur), 0.5)}s ease forwards`;
        break;
      case 'slide-left':
      case 'slide-right':
      case 'slide-up':
      case 'slide-down':
        overlay.style.background = '#000';
        const dir = transition.type.replace('slide-', '');
        const slideMap = { left: 'translateX(-100%)', right: 'translateX(100%)', up: 'translateY(-100%)', down: 'translateY(100%)' };
        overlay.animate([
          { transform: slideMap[dir], opacity: 1 },
          { transform: 'translate(0,0)', opacity: 1 },
          { transform: 'translate(0,0)', opacity: 1 },
          { transform: slideMap[dir === 'left' ? 'right' : dir === 'right' ? 'left' : dir === 'up' ? 'down' : 'up'], opacity: 1 },
        ], {
          duration: (transition.duration || 0.5) * 1000,
          easing: 'ease-in-out',
        });
        break;
    }

    canvasArea.style.position = 'relative';
    canvasArea.appendChild(overlay);
    setTimeout(() => overlay.remove(), (transition.duration || 0.5) * 1000 + 100);
  },

  // ---- Runtime transition (used in Preview and Export) ----
  // Returns CSS + JS code for transitions in exported games
  generateRuntimeCode() {
    return `
// === TRANSITION RUNTIME ===
function playTransition(type, duration, callback) {
  if (!type || type === 'none') { if (callback) callback(); return; }
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:10000;pointer-events:none;';
  const dur = (duration || 0.5) * 1000;
  
  switch(type) {
    case 'fade-black':
      overlay.style.background = '#000';
      overlay.animate([{opacity:0},{opacity:1,offset:0.4},{opacity:1,offset:0.6},{opacity:0}], {duration:dur, easing:'ease'});
      break;
    case 'crossfade':
      overlay.style.background = 'rgba(0,0,0,0.6)';
      overlay.animate([{opacity:0},{opacity:1,offset:0.5},{opacity:0}], {duration:dur, easing:'ease'});
      break;
    case 'flash':
      overlay.style.background = '#fff';
      overlay.animate([{opacity:0},{opacity:1,offset:0.3},{opacity:0}], {duration:Math.min(dur,500), easing:'ease'});
      break;
    case 'slide-left': case 'slide-right': case 'slide-up': case 'slide-down':
      overlay.style.background = '#000';
      const d = type.replace('slide-','');
      const m = {left:'translateX(-100%)',right:'translateX(100%)',up:'translateY(-100%)',down:'translateY(100%)'};
      const mo = {left:'right',right:'left',up:'down',down:'up'};
      overlay.animate([{transform:m[d]},{transform:'translate(0,0)',offset:0.4},{transform:'translate(0,0)',offset:0.6},{transform:m[mo[d]]}], {duration:dur, easing:'ease-in-out'});
      break;
  }
  game.appendChild(overlay);
  setTimeout(() => { if (callback) callback(); }, dur * 0.5);
  setTimeout(() => overlay.remove(), dur + 50);
}
`;
  },
};
