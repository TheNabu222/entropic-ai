/* ===== SAVE / LOAD SYSTEM ===== */
const SaveLoad = {
  /*
    This module manages save/load for EXPORTED games (runtime).
    It stores game state in localStorage with multiple save slots.
    
    Save data structure:
    {
      slot: 0-4,
      timestamp: ISO string,
      sceneName: string,
      currentSceneId: string,
      inventory: [{ itemId, count }],
      flags: { flagName: value },
      dialogueProgress: { treeId: lastNodeId },
      objectStates: { objectId: { pickedUp, used, interacted } },
      playtime: seconds
    }
  */

  MAX_SLOTS: 5,
  STORAGE_PREFIX: 'anzu_save_',

  init() {
    // Editor-side: nothing to do
    // This module provides functions used by Preview and Export runtime
  },

  // ---- Editor-side: Scene settings ----
  renderSettings(container) {
    const proj = State.project;
    if (!proj.saveLoadSettings) {
      proj.saveLoadSettings = {
        autoSave: true,
        autoSaveOnTransition: true,
        maxSlots: 5,
        showSaveLoadUI: true,
      };
    }
    const settings = proj.saveLoadSettings;

    container.innerHTML = `
      <div style="padding:8px">
        <h4 style="margin:0 0 8px;font-size:13px;color:var(--text-primary)">💾 Save/Load Settings</h4>
        <p style="font-size:11px;color:var(--text-dim);margin-bottom:8px">
          Configure how save/load works in the exported game.
        </p>

        <div class="prop-row" style="margin-bottom:6px">
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
            <input type="checkbox" id="sl-auto-save" ${settings.autoSave ? 'checked' : ''} />
            <span style="font-size:12px;color:var(--text-secondary)">Enable Auto-Save</span>
          </label>
        </div>

        <div class="prop-row" style="margin-bottom:6px">
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
            <input type="checkbox" id="sl-auto-transition" ${settings.autoSaveOnTransition ? 'checked' : ''} />
            <span style="font-size:12px;color:var(--text-secondary)">Auto-Save on Scene Transition</span>
          </label>
        </div>

        <div class="prop-row" style="margin-bottom:6px">
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
            <input type="checkbox" id="sl-show-ui" ${settings.showSaveLoadUI ? 'checked' : ''} />
            <span style="font-size:12px;color:var(--text-secondary)">Show Save/Load Button in Game</span>
          </label>
        </div>

        <div class="prop-row" style="margin-bottom:6px">
          <label style="font-size:11px;color:var(--text-dim)">Save Slots</label>
          <input type="number" id="sl-max-slots" value="${settings.maxSlots}" min="1" max="10" style="width:60px" />
        </div>
      </div>
    `;

    container.querySelector('#sl-auto-save')?.addEventListener('change', (e) => { settings.autoSave = e.target.checked; State.autoSave(); });
    container.querySelector('#sl-auto-transition')?.addEventListener('change', (e) => { settings.autoSaveOnTransition = e.target.checked; State.autoSave(); });
    container.querySelector('#sl-show-ui')?.addEventListener('change', (e) => { settings.showSaveLoadUI = e.target.checked; State.autoSave(); });
    container.querySelector('#sl-max-slots')?.addEventListener('change', (e) => { settings.maxSlots = Utils.clamp(parseInt(e.target.value) || 5, 1, 10); State.autoSave(); });
  },

  // ---- Runtime functions (used in Preview and Export) ----

  // Generate runtime save/load code for exported games
  generateRuntimeCode() {
    return `
// === SAVE/LOAD RUNTIME ===
const SaveSystem = {
  PREFIX: 'anzu_game_',
  MAX_SLOTS: ${State.project.saveLoadSettings?.maxSlots || 5},
  startTime: Date.now(),

  save(slot) {
    const data = {
      slot,
      timestamp: new Date().toISOString(),
      currentSceneId: currentScene?.id || START_SCENE,
      sceneName: currentScene?.name || 'Unknown',
      inventory: [...playerInventory],
      flags: {...runtimeFlags},
      dialogueProgress: {...dialogueProgress},
      objectStates: {...objectStates},
      playtime: Math.floor((Date.now() - this.startTime) / 1000),
    };
    try {
      localStorage.setItem(this.PREFIX + 'slot_' + slot, JSON.stringify(data));
      localStorage.setItem(this.PREFIX + 'last_slot', String(slot));
      return true;
    } catch(e) { console.warn('Save failed:', e); return false; }
  },

  load(slot) {
    try {
      const raw = localStorage.getItem(this.PREFIX + 'slot_' + slot);
      if (!raw) return null;
      const data = JSON.parse(raw);
      playerInventory = data.inventory || [];
      Object.assign(runtimeFlags, data.flags || {});
      Object.assign(dialogueProgress, data.dialogueProgress || {});
      Object.assign(objectStates, data.objectStates || {});
      this.startTime = Date.now() - ((data.playtime || 0) * 1000);
      loadScene(data.currentSceneId);
      return data;
    } catch(e) { console.warn('Load failed:', e); return null; }
  },

  getSlotInfo(slot) {
    try {
      const raw = localStorage.getItem(this.PREFIX + 'slot_' + slot);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch(e) { return null; }
  },

  deleteSlot(slot) {
    localStorage.removeItem(this.PREFIX + 'slot_' + slot);
  },

  autoSave() {
    this.save(0); // Slot 0 is auto-save
  },

  showSaveLoadUI(mode) {
    const existing = document.getElementById('sl-modal');
    if (existing) existing.remove();
    
    const modal = document.createElement('div');
    modal.id = 'sl-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:99999';
    
    let html = '<div style="background:rgba(10,10,20,0.95);border:2px solid rgba(124,92,252,0.5);border-radius:10px;padding:20px;min-width:320px;max-width:400px;backdrop-filter:blur(8px)">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h3 style="margin:0;color:#7c5cfc;font-size:16px">' + (mode === 'save' ? '💾 Save Game' : '📂 Load Game') + '</h3><button onclick="document.getElementById(\\'sl-modal\\').remove()" style="background:none;border:none;color:rgba(255,255,255,0.5);font-size:18px;cursor:pointer">&times;</button></div>';
    
    for (let i = 0; i < this.MAX_SLOTS; i++) {
      const info = this.getSlotInfo(i);
      const label = i === 0 ? 'Auto-Save' : 'Slot ' + i;
      if (info) {
        const date = new Date(info.timestamp).toLocaleString();
        const mins = Math.floor((info.playtime || 0) / 60);
        html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;margin-bottom:6px;cursor:pointer" class="sl-slot" data-slot="' + i + '">';
        html += '<div><div style="font-size:13px;color:#e8e8ec;font-weight:500">' + label + '</div><div style="font-size:10px;color:rgba(255,255,255,0.4)">' + (info.sceneName || 'Unknown') + ' • ' + date + ' • ' + mins + 'min</div></div>';
        html += '<div style="display:flex;gap:4px">';
        if (mode === 'save') html += '<button class="sl-action" data-action="save" data-slot="' + i + '" style="padding:4px 8px;border-radius:4px;font-size:11px;cursor:pointer;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);color:#e8e8ec">Save</button>';
        if (mode === 'load') html += '<button class="sl-action" data-action="load" data-slot="' + i + '" style="padding:4px 8px;border-radius:4px;font-size:11px;cursor:pointer;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);color:#e8e8ec">Load</button>';
        html += '<button class="sl-action" data-action="delete" data-slot="' + i + '" style="padding:4px 8px;border-radius:4px;font-size:11px;cursor:pointer;border:1px solid rgba(239,68,68,0.3);background:rgba(239,68,68,0.1);color:#ef4444">✕</button>';
        html += '</div></div>';
      } else {
        html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:6px;margin-bottom:6px" class="sl-slot" data-slot="' + i + '">';
        html += '<div style="font-size:12px;color:rgba(255,255,255,0.3);font-style:italic">' + label + ' — Empty</div>';
        if (mode === 'save') html += '<button class="sl-action" data-action="save" data-slot="' + i + '" style="padding:4px 8px;border-radius:4px;font-size:11px;cursor:pointer;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);color:#e8e8ec">Save</button>';
        html += '</div>';
      }
    }
    
    html += '</div>';
    modal.innerHTML = html;
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
      const btn = e.target.closest('.sl-action');
      if (btn) {
        const slot = parseInt(btn.dataset.slot);
        const action = btn.dataset.action;
        if (action === 'save') { this.save(slot); modal.remove(); showToast('Game saved to ' + (slot === 0 ? 'Auto-Save' : 'Slot ' + slot)); }
        else if (action === 'load') { this.load(slot); modal.remove(); showToast('Game loaded from ' + (slot === 0 ? 'Auto-Save' : 'Slot ' + slot)); }
        else if (action === 'delete') { this.deleteSlot(slot); this.showSaveLoadUI(mode); }
      }
    });
  }
};

function showToast(msg) {
  const t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.9);color:#e8e8ec;padding:8px 16px;border-radius:6px;font-size:13px;z-index:99999;border:1px solid rgba(124,92,252,0.4);animation:fadeIn 0.3s ease';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(() => t.remove(), 300); }, 2000);
}
`;
  },
};
