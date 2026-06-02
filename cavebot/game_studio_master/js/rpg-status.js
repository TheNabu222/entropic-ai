/* ===== STATUS EFFECTS SYSTEM (Phase 3B) ===== */
const StatusEffects = {
  init() { this._ensure(); },

  _ensure() {
    if (!State.project.rpgStatusEffects) State.project.rpgStatusEffects = [];
  },

  getEffects() { this._ensure(); return State.project.rpgStatusEffects; },

  addEffect(name) {
    this._ensure();
    const effect = {
      id: Utils.uid(), name: name || 'New Effect',
      icon: '✨', color: '#a78bfa',
      duration: 0, // 0 = permanent until removed, >0 = time ticks
      needChanges: {}, // { rest: -5, hunger: -2 } per tick
      skillModifiers: {}, // { naturalist: +5 } while active
      description: '',
    };
    State.project.rpgStatusEffects.push(effect);
    State.autoSave();
    return effect;
  },

  removeEffect(id) {
    this._ensure();
    const idx = State.project.rpgStatusEffects.findIndex(e => e.id === id);
    if (idx !== -1) { State.project.rpgStatusEffects.splice(idx, 1); State.autoSave(); }
  },

  getEffect(id) { return (State.project.rpgStatusEffects || []).find(e => e.id === id); },

  // Runtime
  createRuntimeState() { return []; /* active effects: [{ effectId, remainingDuration }] */ },

  applyEffect(runtimeEffects, effectId) {
    const def = this.getEffect(effectId);
    if (!def) return;
    // Don't stack same effect
    const existing = runtimeEffects.find(e => e.effectId === effectId);
    if (existing) {
      existing.remainingDuration = def.duration; // refresh
      return;
    }
    runtimeEffects.push({ effectId, remainingDuration: def.duration });
  },

  removeActiveEffect(runtimeEffects, effectId) {
    const idx = runtimeEffects.findIndex(e => e.effectId === effectId);
    if (idx !== -1) runtimeEffects.splice(idx, 1);
  },

  tickEffects(runtimeEffects, runtimeNeeds, runtimeSkills) {
    const expired = [];
    for (let i = runtimeEffects.length - 1; i >= 0; i--) {
      const active = runtimeEffects[i];
      const def = this.getEffect(active.effectId);
      if (!def) { runtimeEffects.splice(i, 1); continue; }

      // Apply need changes
      if (def.needChanges && runtimeNeeds) {
        for (const [key, delta] of Object.entries(def.needChanges)) {
          if (runtimeNeeds[key] !== undefined) {
            runtimeNeeds[key] = Math.max(0, Math.min(100, runtimeNeeds[key] + delta));
          }
        }
      }

      // Duration tick
      if (active.remainingDuration > 0) {
        active.remainingDuration--;
        if (active.remainingDuration <= 0) {
          expired.push(def.name);
          runtimeEffects.splice(i, 1);
        }
      }
    }
    return expired;
  },

  // Get total skill modifiers from active effects
  getActiveModifiers(runtimeEffects) {
    const mods = {};
    for (const active of runtimeEffects) {
      const def = this.getEffect(active.effectId);
      if (!def || !def.skillModifiers) continue;
      for (const [key, val] of Object.entries(def.skillModifiers)) {
        mods[key] = (mods[key] || 0) + val;
      }
    }
    return mods;
  },

  populateEffectSelect(select, selectedId) {
    this._ensure();
    select.innerHTML = '<option value="">-- None --</option>';
    for (const e of State.project.rpgStatusEffects) {
      const opt = document.createElement('option');
      opt.value = e.id; opt.textContent = `${e.icon} ${e.name}`;
      select.appendChild(opt);
    }
    if (selectedId) select.value = selectedId;
  },

  render(container) {
    this._ensure();
    const effects = State.project.rpgStatusEffects;
    container.innerHTML = `
      <div class="rpg-editor" style="padding:8px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <h4 style="margin:0;font-size:13px;color:var(--text-primary)">✨ Status Effects</h4>
          <button class="p3-btn accent" id="rpg-add-effect">+ Add Effect</button>
        </div>
        <p style="font-size:11px;color:var(--text-dim);margin-bottom:8px">Temporary or permanent effects that modify needs/skills.</p>
        <div id="rpg-effects-list" style="max-height:400px;overflow-y:auto">
          ${effects.length === 0 ? '<div style="text-align:center;padding:16px;color:var(--text-dim);font-size:11px">No effects defined.</div>' : ''}
          ${effects.map(e => `
            <div class="rpg-effect-card" data-id="${e.id}" style="background:var(--bg-tertiary);border:1px solid var(--border);border-radius:6px;padding:8px;margin-bottom:6px">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
                <input type="text" class="eff-icon" value="${e.icon}" style="width:28px;font-size:14px;text-align:center" />
                <input type="text" class="eff-name" value="${this._esc(e.name)}" style="flex:1;font-size:12px;font-weight:600" />
                <input type="number" class="eff-duration" value="${e.duration}" min="0" style="width:40px;font-size:10px" title="Duration (0=permanent)" />
                <input type="color" class="eff-color" value="${e.color}" style="width:24px;height:20px;padding:0;border:none" />
                <button class="eff-delete" style="background:none;border:none;color:var(--text-dim);cursor:pointer">✕</button>
              </div>
              <input type="text" class="eff-desc" value="${this._esc(e.description)}" placeholder="Description..." style="width:100%;font-size:10px;margin-bottom:4px" />
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelector('#rpg-add-effect')?.addEventListener('click', () => {
      this.addEffect(); this.render(container);
    });

    container.querySelectorAll('.rpg-effect-card').forEach(card => {
      const id = card.dataset.id;
      const e = this.getEffect(id);
      if (!e) return;

      card.querySelector('.eff-icon')?.addEventListener('change', ev => { e.icon = ev.target.value; State.autoSave(); });
      card.querySelector('.eff-name')?.addEventListener('change', ev => { e.name = ev.target.value; State.autoSave(); });
      card.querySelector('.eff-duration')?.addEventListener('change', ev => { e.duration = parseInt(ev.target.value) || 0; State.autoSave(); });
      card.querySelector('.eff-color')?.addEventListener('change', ev => { e.color = ev.target.value; State.autoSave(); });
      card.querySelector('.eff-desc')?.addEventListener('change', ev => { e.description = ev.target.value; State.autoSave(); });
      card.querySelector('.eff-delete')?.addEventListener('click', () => { this.removeEffect(id); this.render(container); });
    });
  },

  _esc(s) { return String(s||'').replace(/"/g, '&quot;').replace(/</g, '&lt;'); },
};
