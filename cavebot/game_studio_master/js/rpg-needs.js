/* ===== NEEDS TRACKER SYSTEM (Phase 3B) ===== */
const NeedsTracker = {
  NEED_TYPES: [
    { key: 'rest', label: 'Rest', icon: '😴', color: '#60a5fa', decayRate: 0.5 },
    { key: 'hunger', label: 'Hunger', icon: '🍖', color: '#f97316', decayRate: 0.8 },
    { key: 'connection', label: 'Connection', icon: '💬', color: '#a78bfa', decayRate: 0.3 },
    { key: 'spiritual', label: 'Spiritual', icon: '✨', color: '#fbbf24', decayRate: 0.2 },
    { key: 'novelty', label: 'Novelty', icon: '🔮', color: '#34d399', decayRate: 0.4 },
    { key: 'community', label: 'Community', icon: '🏘️', color: '#fb7185', decayRate: 0.25 },
  ],

  init() {
    this._ensure();
  },

  _ensure() {
    if (!State.project.rpgNeeds) {
      State.project.rpgNeeds = {
        enabled: false,
        decayEnabled: true,
        decayMultiplier: 1,
        warningThreshold: 25,
        needs: this.NEED_TYPES.map(n => ({
          key: n.key, label: n.label, icon: n.icon, color: n.color,
          defaultValue: 75, decayRate: n.decayRate, enabled: true,
        })),
      };
    }
  },

  getConfig() { this._ensure(); return State.project.rpgNeeds; },

  // Runtime: create initial needs state
  createRuntimeState() {
    this._ensure();
    const state = {};
    const cfg = State.project.rpgNeeds;
    if (!cfg.enabled) return state;
    for (const n of cfg.needs) {
      if (n.enabled) state[n.key] = n.defaultValue;
    }
    return state;
  },

  // Runtime: apply need change
  applyNeedChange(runtimeNeeds, changes) {
    if (!changes) return;
    for (const [key, delta] of Object.entries(changes)) {
      if (runtimeNeeds[key] !== undefined) {
        runtimeNeeds[key] = Math.max(0, Math.min(100, runtimeNeeds[key] + delta));
      }
    }
  },

  // Runtime: decay needs (call per time tick)
  decayNeeds(runtimeNeeds, elapsed) {
    const cfg = this.getConfig();
    if (!cfg.decayEnabled) return [];
    const warnings = [];
    for (const n of cfg.needs) {
      if (!n.enabled || runtimeNeeds[n.key] === undefined) continue;
      runtimeNeeds[n.key] = Math.max(0, runtimeNeeds[n.key] - (n.decayRate * cfg.decayMultiplier * elapsed));
      if (runtimeNeeds[n.key] <= cfg.warningThreshold) {
        warnings.push(n);
      }
    }
    return warnings;
  },

  // UI Render
  render(container) {
    this._ensure();
    const cfg = State.project.rpgNeeds;
    container.innerHTML = `
      <div class="rpg-editor" style="padding:8px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <h4 style="margin:0;font-size:13px;color:var(--text-primary)">🧠 Needs Tracker</h4>
          <label style="font-size:11px;color:var(--text-dim);display:flex;align-items:center;gap:4px">
            <input type="checkbox" id="rpg-needs-enabled" ${cfg.enabled ? 'checked' : ''} /> Enabled
          </label>
        </div>
        <p style="font-size:11px;color:var(--text-dim);margin-bottom:8px">Sims-like need bars that decay over time. Configure defaults and decay rates.</p>
        <div style="margin-bottom:8px">
          <label style="font-size:10px;color:var(--text-dim)">DECAY MULTIPLIER</label>
          <input type="range" id="rpg-needs-decay-mult" min="0" max="3" step="0.1" value="${cfg.decayMultiplier}" style="width:100%" />
          <span style="font-size:10px;color:var(--text-secondary)" id="rpg-needs-decay-val">${cfg.decayMultiplier}x</span>
        </div>
        <div style="margin-bottom:8px">
          <label style="font-size:10px;color:var(--text-dim)">WARNING THRESHOLD</label>
          <input type="number" id="rpg-needs-warn" value="${cfg.warningThreshold}" min="0" max="50" style="width:60px" />
        </div>
        <div id="rpg-needs-list">
          ${cfg.needs.map((n, i) => `
            <div class="rpg-need-row" data-idx="${i}" style="display:flex;align-items:center;gap:6px;padding:4px 0;border-bottom:1px solid var(--border)">
              <input type="checkbox" class="need-enabled" ${n.enabled ? 'checked' : ''} />
              <span style="font-size:14px">${n.icon}</span>
              <input type="text" class="need-label" value="${this._esc(n.label)}" style="flex:1;font-size:11px" />
              <input type="number" class="need-default" value="${n.defaultValue}" min="0" max="100" style="width:40px;font-size:10px" title="Default" />
              <input type="number" class="need-decay" value="${n.decayRate}" min="0" max="5" step="0.1" style="width:40px;font-size:10px" title="Decay/tick" />
              <input type="color" class="need-color" value="${n.color}" style="width:24px;height:20px;padding:0;border:none" />
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelector('#rpg-needs-enabled')?.addEventListener('change', e => {
      cfg.enabled = e.target.checked; State.autoSave();
    });
    container.querySelector('#rpg-needs-decay-mult')?.addEventListener('input', e => {
      cfg.decayMultiplier = parseFloat(e.target.value);
      container.querySelector('#rpg-needs-decay-val').textContent = cfg.decayMultiplier + 'x';
      State.autoSave();
    });
    container.querySelector('#rpg-needs-warn')?.addEventListener('change', e => {
      cfg.warningThreshold = parseInt(e.target.value) || 25; State.autoSave();
    });
    container.querySelectorAll('.rpg-need-row').forEach(row => {
      const i = parseInt(row.dataset.idx);
      row.querySelector('.need-enabled')?.addEventListener('change', e => { cfg.needs[i].enabled = e.target.checked; State.autoSave(); });
      row.querySelector('.need-label')?.addEventListener('change', e => { cfg.needs[i].label = e.target.value; State.autoSave(); });
      row.querySelector('.need-default')?.addEventListener('change', e => { cfg.needs[i].defaultValue = parseInt(e.target.value) || 75; State.autoSave(); });
      row.querySelector('.need-decay')?.addEventListener('change', e => { cfg.needs[i].decayRate = parseFloat(e.target.value) || 0.5; State.autoSave(); });
      row.querySelector('.need-color')?.addEventListener('change', e => { cfg.needs[i].color = e.target.value; State.autoSave(); });
    });
  },

  _esc(s) { return String(s||'').replace(/"/g, '&quot;').replace(/</g, '&lt;'); },
};
