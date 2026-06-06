/* ===== SOCIAL REPUTATION + NPC MANAGER (Phase 3B) ===== */
const Reputation = {
  REL_TYPES: ['Friendship', 'Romance', 'Rivalry'],

  init() { this._ensure(); },
  _ensure() {
    if (!State.project.rpgNPCs) State.project.rpgNPCs = [];
  },

  getNPCs() { this._ensure(); return State.project.rpgNPCs; },

  addNPC(name) {
    this._ensure();
    const npc = {
      id: Utils.uid(),
      name: name || 'New NPC',
      spriteAssetId: '',
      moodProfile: { defaultMood: 'neutral', volatility: 0.2 },
      stats: { charm: 10, grit: 10, lore: 10 },
      startLocation: { sceneId: State.project.activeSceneId || '', x: 100, y: 100 },
      schedule: [{ hour: 8, sceneId: State.project.activeSceneId || '', x: 100, y: 100, action: 'idle' }],
      navWaypoints: [{ x: 100, y: 100 }, { x: 200, y: 100 }],
      relationships: { Friendship: 50, Romance: 0, Rivalry: 0 },
      gates: [],
    };
    State.project.rpgNPCs.push(npc);
    State.autoSave();
    return npc;
  },

  removeNPC(id) {
    this._ensure();
    const idx = State.project.rpgNPCs.findIndex(n => n.id === id);
    if (idx !== -1) { State.project.rpgNPCs.splice(idx, 1); State.autoSave(); }
  },

  updateNPC(id, updates) {
    const npc = State.project.rpgNPCs.find(n => n.id === id);
    if (npc) { Object.assign(npc, updates); State.autoSave(); }
  },

  getNPC(id) { this._ensure(); return State.project.rpgNPCs.find(n => n.id === id); },

  createRuntimeState() {
    this._ensure();
    const state = {};
    for (const npc of State.project.rpgNPCs) {
      state[npc.id] = {
        ...npc.relationships,
        mood: npc.moodProfile?.defaultMood || 'neutral',
        location: { ...(npc.startLocation || { sceneId: '', x: 0, y: 0 }) },
      };
    }
    return state;
  },

  applyRepChange(runtimeRep, npcId, type, delta) {
    if (!runtimeRep[npcId]) return;
    runtimeRep[npcId][type] = Math.max(0, Math.min(100, (runtimeRep[npcId][type] || 0) + delta));
  },

  checkGate(runtimeRep, npcId, type, threshold) {
    if (!runtimeRep[npcId]) return false;
    return (runtimeRep[npcId][type] || 0) >= threshold;
  },

  populateNPCSelect(select, selectedId) {
    this._ensure();
    select.innerHTML = '<option value="">-- None --</option>';
    for (const npc of State.project.rpgNPCs) {
      const opt = document.createElement('option');
      opt.value = npc.id;
      opt.textContent = npc.name;
      select.appendChild(opt);
    }
    if (selectedId) select.value = selectedId;
  },

  _sceneOptions(selectedId) {
    return (State.project.scenes || []).map(s => `<option value="${s.id}" ${s.id === selectedId ? 'selected' : ''}>${this._esc(s.name)}</option>`).join('');
  },

  render(container) {
    this._ensure();
    const npcs = State.project.rpgNPCs;
    const assets = State.project.assets || [];
    container.innerHTML = `
      <div class="rpg-editor" style="padding:8px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <h4 style="margin:0;font-size:13px;color:var(--text-primary)">👥 NPCs & Relationships</h4>
          <button class="p3-btn accent" id="rpg-add-npc" title="Create NPC profile">+ Add NPC</button>
        </div>
        <p style="font-size:11px;color:var(--text-dim);margin-bottom:8px">Define NPC stats, schedule, waypoints, and relationship gates for dialogue/quests.</p>
        <div id="rpg-npc-list" style="max-height:480px;overflow-y:auto">
          ${npcs.length === 0 ? '<div style="text-align:center;padding:16px;color:var(--text-dim);font-size:11px">No NPCs defined.</div>' : ''}
          ${npcs.map(npc => `
            <div class="rpg-npc-card" data-id="${npc.id}" style="background:var(--bg-tertiary);border:1px solid var(--border);border-radius:6px;padding:8px;margin-bottom:6px">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
                <input type="text" class="npc-name" value="${this._esc(npc.name)}" style="flex:1;font-size:12px;font-weight:600" />
                <button class="npc-delete" style="background:none;border:none;color:var(--text-dim);cursor:pointer" title="Delete">✕</button>
              </div>

              <div class="prop-row">
                <label>Sprite</label>
                <select class="npc-sprite"><option value="">-- None --</option>${assets.map(a => `<option value="${a.id}" ${npc.spriteAssetId === a.id ? 'selected' : ''}>${this._esc(a.name)}</option>`).join('')}</select>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:5px 0">
                <div>
                  <div style="font-size:10px;color:var(--text-dim)">Default Mood</div>
                  <select class="npc-mood"><option value="neutral" ${npc.moodProfile?.defaultMood === 'neutral' ? 'selected' : ''}>neutral</option><option value="happy" ${npc.moodProfile?.defaultMood === 'happy' ? 'selected' : ''}>happy</option><option value="guarded" ${npc.moodProfile?.defaultMood === 'guarded' ? 'selected' : ''}>guarded</option><option value="hostile" ${npc.moodProfile?.defaultMood === 'hostile' ? 'selected' : ''}>hostile</option></select>
                </div>
                <div>
                  <div style="font-size:10px;color:var(--text-dim)">Mood Volatility</div>
                  <input type="number" class="npc-volatility" min="0" max="1" step="0.05" value="${npc.moodProfile?.volatility ?? 0.2}" />
                </div>
              </div>

              ${this.REL_TYPES.map(t => `
                <div style="display:flex;align-items:center;gap:4px;margin-bottom:3px">
                  <span style="font-size:10px;color:var(--text-dim);width:65px">${t}</span>
                  <input type="range" class="npc-rel" data-type="${t}" min="0" max="100" value="${npc.relationships[t] || 0}" style="flex:1" />
                  <span class="npc-rel-val" style="font-size:10px;width:25px;text-align:right;color:var(--text-secondary)">${npc.relationships[t] || 0}</span>
                </div>
              `).join('')}

              <div style="font-size:10px;color:var(--text-dim);margin:6px 0 2px">START LOCATION</div>
              <div style="display:grid;grid-template-columns:1.2fr .8fr .8fr;gap:4px;margin-bottom:4px">
                <select class="npc-start-scene">${this._sceneOptions(npc.startLocation?.sceneId)}</select>
                <input type="number" class="npc-start-x" value="${npc.startLocation?.x ?? 100}" placeholder="X" />
                <input type="number" class="npc-start-y" value="${npc.startLocation?.y ?? 100}" placeholder="Y" />
              </div>

              <div style="font-size:10px;color:var(--text-dim);margin:6px 0 2px">SCHEDULE</div>
              ${(npc.schedule || []).map((s, si) => `
                <div data-si="${si}" style="display:grid;grid-template-columns:.6fr 1fr .8fr .8fr 1fr auto;gap:4px;margin-bottom:2px">
                  <input class="sch-hour" type="number" min="0" max="23" value="${s.hour ?? 8}" />
                  <select class="sch-scene">${this._sceneOptions(s.sceneId)}</select>
                  <input class="sch-x" type="number" value="${s.x ?? 100}" />
                  <input class="sch-y" type="number" value="${s.y ?? 100}" />
                  <input class="sch-action" type="text" value="${this._esc(s.action || 'idle')}" />
                  <button class="sch-del">✕</button>
                </div>
              `).join('')}
              <button class="npc-add-sch p3-btn" style="font-size:9px;padding:2px 6px">+ Schedule Entry</button>

              <div style="font-size:10px;color:var(--text-dim);margin:6px 0 2px">NAV WAYPOINTS</div>
              ${(npc.navWaypoints || []).map((wp, wi) => `
                <div data-wi="${wi}" style="display:grid;grid-template-columns:1fr 1fr auto;gap:4px;margin-bottom:2px">
                  <input class="wp-x" type="number" value="${wp.x}" />
                  <input class="wp-y" type="number" value="${wp.y}" />
                  <button class="wp-del">✕</button>
                </div>
              `).join('')}
              <button class="npc-add-wp p3-btn" style="font-size:9px;padding:2px 6px">+ Waypoint</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelector('#rpg-add-npc')?.addEventListener('click', () => { this.addNPC(); this.render(container); });

    container.querySelectorAll('.rpg-npc-card').forEach(card => {
      const id = card.dataset.id;
      const npc = State.project.rpgNPCs.find(n => n.id === id);
      if (!npc) return;

      card.querySelector('.npc-name')?.addEventListener('change', e => { npc.name = e.target.value; State.autoSave(); });
      card.querySelector('.npc-delete')?.addEventListener('click', () => { this.removeNPC(id); this.render(container); });
      card.querySelector('.npc-sprite')?.addEventListener('change', e => { npc.spriteAssetId = e.target.value; State.autoSave(); });
      card.querySelector('.npc-mood')?.addEventListener('change', e => { npc.moodProfile.defaultMood = e.target.value; State.autoSave(); });
      card.querySelector('.npc-volatility')?.addEventListener('change', e => { npc.moodProfile.volatility = parseFloat(e.target.value) || 0; State.autoSave(); });

      card.querySelectorAll('.npc-rel').forEach(slider => {
        slider.addEventListener('input', e => {
          const t = e.target.dataset.type;
          npc.relationships[t] = parseInt(e.target.value);
          e.target.nextElementSibling.textContent = e.target.value;
          State.autoSave();
        });
      });

      card.querySelector('.npc-start-scene')?.addEventListener('change', e => { npc.startLocation.sceneId = e.target.value; State.autoSave(); });
      card.querySelector('.npc-start-x')?.addEventListener('change', e => { npc.startLocation.x = parseInt(e.target.value) || 0; State.autoSave(); });
      card.querySelector('.npc-start-y')?.addEventListener('change', e => { npc.startLocation.y = parseInt(e.target.value) || 0; State.autoSave(); });

      card.querySelectorAll('[data-si]').forEach(row => {
        const si = parseInt(row.dataset.si);
        row.querySelector('.sch-hour')?.addEventListener('change', e => { npc.schedule[si].hour = parseInt(e.target.value) || 0; State.autoSave(); });
        row.querySelector('.sch-scene')?.addEventListener('change', e => { npc.schedule[si].sceneId = e.target.value; State.autoSave(); });
        row.querySelector('.sch-x')?.addEventListener('change', e => { npc.schedule[si].x = parseInt(e.target.value) || 0; State.autoSave(); });
        row.querySelector('.sch-y')?.addEventListener('change', e => { npc.schedule[si].y = parseInt(e.target.value) || 0; State.autoSave(); });
        row.querySelector('.sch-action')?.addEventListener('change', e => { npc.schedule[si].action = e.target.value; State.autoSave(); });
        row.querySelector('.sch-del')?.addEventListener('click', () => { npc.schedule.splice(si, 1); State.autoSave(); this.render(container); });
      });
      card.querySelector('.npc-add-sch')?.addEventListener('click', () => {
        npc.schedule.push({ hour: 12, sceneId: State.project.activeSceneId || '', x: 100, y: 100, action: 'idle' });
        State.autoSave(); this.render(container);
      });

      card.querySelectorAll('[data-wi]').forEach(row => {
        const wi = parseInt(row.dataset.wi);
        row.querySelector('.wp-x')?.addEventListener('change', e => { npc.navWaypoints[wi].x = parseInt(e.target.value) || 0; State.autoSave(); });
        row.querySelector('.wp-y')?.addEventListener('change', e => { npc.navWaypoints[wi].y = parseInt(e.target.value) || 0; State.autoSave(); });
        row.querySelector('.wp-del')?.addEventListener('click', () => { npc.navWaypoints.splice(wi, 1); State.autoSave(); this.render(container); });
      });
      card.querySelector('.npc-add-wp')?.addEventListener('click', () => {
        npc.navWaypoints.push({ x: 120, y: 120 });
        State.autoSave(); this.render(container);
      });
    });
  },

  _esc(s) { return String(s||'').replace(/"/g, '&quot;').replace(/</g, '&lt;'); },
};
