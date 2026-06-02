/* ===== QUEST MILESTONE TRACKER (Phase 3B) ===== */
const QuestTracker = {
  init() { this._ensure(); },

  _ensure() {
    if (!State.project.rpgQuests) State.project.rpgQuests = [];
    if (!State.project.questUI) State.project.questUI = { showPanel: true, pinTracked: true, accent: '#7c5cfc' };
  },

  getQuests() { this._ensure(); return State.project.rpgQuests; },

  addQuest(name) {
    this._ensure();
    const quest = {
      id: Utils.uid(), name: name || 'New Quest',
      description: '', icon: '📜',
      milestones: [{ id: Utils.uid(), text: 'Start', completed: false }],
      completionFlagName: '',
      triggerCondition: '', // JSON condition expression (optional)
      completionCondition: '', // JSON (optional)
      hidden: false,
      tracked: true,
    };
    State.project.rpgQuests.push(quest);
    State.autoSave();
    return quest;
  },

  removeQuest(id) {
    this._ensure();
    const idx = State.project.rpgQuests.findIndex(q => q.id === id);
    if (idx !== -1) { State.project.rpgQuests.splice(idx, 1); State.autoSave(); }
  },

  getQuest(id) { return (State.project.rpgQuests || []).find(q => q.id === id); },

  addMilestone(questId, text) {
    const q = this.getQuest(questId);
    if (!q) return;
    q.milestones.push({ id: Utils.uid(), text: text || 'New milestone', completed: false });
    State.autoSave();
  },

  removeMilestone(questId, milestoneId) {
    const q = this.getQuest(questId);
    if (!q) return;
    q.milestones = q.milestones.filter(m => m.id !== milestoneId);
    State.autoSave();
  },

  createRuntimeState() {
    this._ensure();
    const state = {};
    for (const q of State.project.rpgQuests) {
      state[q.id] = {
        active: !q.hidden,
        completedMilestones: [],
        finished: false,
        tracked: q.tracked !== false,
      };
    }
    return state;
  },

  advanceMilestone(runtimeQuests, questId, milestoneId, runtimeFlags) {
    if (!runtimeQuests[questId]) return;
    const qState = runtimeQuests[questId];
    if (!qState.completedMilestones.includes(milestoneId)) qState.completedMilestones.push(milestoneId);

    const questDef = this.getQuest(questId);
    if (questDef && qState.completedMilestones.length >= questDef.milestones.length) {
      qState.finished = true;
      if (questDef.completionFlagName && runtimeFlags) runtimeFlags[questDef.completionFlagName] = true;
    }
  },

  activateQuest(runtimeQuests, questId) {
    if (runtimeQuests[questId]) runtimeQuests[questId].active = true;
  },

  populateQuestSelect(select, selectedId) {
    this._ensure();
    select.innerHTML = '<option value="">-- None --</option>';
    for (const q of State.project.rpgQuests) {
      const opt = document.createElement('option');
      opt.value = q.id; opt.textContent = q.name;
      select.appendChild(opt);
    }
    if (selectedId) select.value = selectedId;
  },

  populateMilestoneSelect(select, questId, selectedId) {
    select.innerHTML = '<option value="">-- None --</option>';
    const q = this.getQuest(questId);
    if (!q) return;
    for (const m of q.milestones) {
      const opt = document.createElement('option');
      opt.value = m.id; opt.textContent = m.text;
      select.appendChild(opt);
    }
    if (selectedId) select.value = selectedId;
  },

  render(container) {
    this._ensure();
    const quests = State.project.rpgQuests;
    const ui = State.project.questUI;
    container.innerHTML = `
      <div class="rpg-editor" style="padding:8px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <h4 style="margin:0;font-size:13px;color:var(--text-primary)">📜 Quests & Milestones</h4>
          <button class="p3-btn accent" id="rpg-add-quest">+ Add Quest</button>
        </div>

        <div class="dialogue-node-editor" style="margin-bottom:8px">
          <div style="font-size:11px;color:var(--text-dim);margin-bottom:4px">QUEST LOG UI</div>
          <div class="prop-row"><label>Show Panel</label><input id="quest-ui-show" type="checkbox" ${ui.showPanel ? 'checked' : ''} /></div>
          <div class="prop-row"><label>Pin Tracked</label><input id="quest-ui-pin" type="checkbox" ${ui.pinTracked ? 'checked' : ''} /></div>
          <div class="prop-row"><label>Accent</label><input id="quest-ui-accent" type="color" value="${ui.accent || '#7c5cfc'}" /></div>
        </div>

        <p style="font-size:11px;color:var(--text-dim);margin-bottom:8px">Create quests with milestones, triggers, and completion logic.</p>
        <div id="rpg-quest-list" style="max-height:400px;overflow-y:auto">
          ${quests.length === 0 ? '<div style="text-align:center;padding:16px;color:var(--text-dim);font-size:11px">No quests defined.</div>' : ''}
          ${quests.map(q => `
            <div class="rpg-quest-card" data-id="${q.id}" style="background:var(--bg-tertiary);border:1px solid var(--border);border-radius:6px;padding:8px;margin-bottom:6px">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
                <input type="text" class="quest-name" value="${this._esc(q.name)}" style="flex:1;font-size:12px;font-weight:600" />
                <label style="font-size:10px;color:var(--text-dim);display:flex;align-items:center;gap:2px"><input type="checkbox" class="quest-hidden" ${q.hidden ? 'checked' : ''} /> Hidden</label>
                <label style="font-size:10px;color:var(--text-dim);display:flex;align-items:center;gap:2px"><input type="checkbox" class="quest-tracked" ${q.tracked !== false ? 'checked' : ''} /> Tracked</label>
                <button class="quest-delete" style="background:none;border:none;color:var(--text-dim);cursor:pointer">✕</button>
              </div>
              <input type="text" class="quest-desc" value="${this._esc(q.description)}" placeholder="Description..." style="width:100%;font-size:10px;margin-bottom:4px" />
              <input type="text" class="quest-trigger" value="${this._esc(q.triggerCondition || '')}" placeholder="Trigger condition JSON (optional)" style="width:100%;font-size:10px;margin-bottom:4px" />
              <input type="text" class="quest-complete-cond" value="${this._esc(q.completionCondition || '')}" placeholder="Completion condition JSON (optional)" style="width:100%;font-size:10px;margin-bottom:4px" />
              <div style="margin-bottom:4px">
                <span style="font-size:10px;color:var(--text-dim)">COMPLETION FLAG</span>
                <input type="text" class="quest-flag" value="${this._esc(q.completionFlagName || '')}" placeholder="flag_name" style="width:100%;font-size:10px" />
              </div>
              <div style="font-size:10px;color:var(--text-dim);margin-bottom:2px">MILESTONES</div>
              <div class="quest-milestones">
                ${q.milestones.map((m, mi) => `
                  <div style="display:flex;align-items:center;gap:3px;margin-bottom:2px" data-mi="${m.id}">
                    <span style="font-size:10px;color:var(--accent)">${mi + 1}.</span>
                    <input type="text" class="ms-text" value="${this._esc(m.text)}" style="flex:1;font-size:10px" />
                    <button class="ms-del" style="background:none;border:none;color:var(--text-dim);cursor:pointer;font-size:10px">✕</button>
                  </div>
                `).join('')}
                <button class="quest-add-ms p3-btn" style="font-size:9px;padding:2px 6px;margin-top:2px">+ Milestone</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelector('#rpg-add-quest')?.addEventListener('click', () => { this.addQuest(); this.render(container); });

    container.querySelector('#quest-ui-show')?.addEventListener('change', e => { ui.showPanel = e.target.checked; State.autoSave(); });
    container.querySelector('#quest-ui-pin')?.addEventListener('change', e => { ui.pinTracked = e.target.checked; State.autoSave(); });
    container.querySelector('#quest-ui-accent')?.addEventListener('change', e => { ui.accent = e.target.value; State.autoSave(); });

    container.querySelectorAll('.rpg-quest-card').forEach(card => {
      const id = card.dataset.id;
      const q = this.getQuest(id);
      if (!q) return;

      card.querySelector('.quest-name')?.addEventListener('change', e => { q.name = e.target.value; State.autoSave(); });
      card.querySelector('.quest-desc')?.addEventListener('change', e => { q.description = e.target.value; State.autoSave(); });
      card.querySelector('.quest-trigger')?.addEventListener('change', e => { q.triggerCondition = e.target.value; State.autoSave(); });
      card.querySelector('.quest-complete-cond')?.addEventListener('change', e => { q.completionCondition = e.target.value; State.autoSave(); });
      card.querySelector('.quest-hidden')?.addEventListener('change', e => { q.hidden = e.target.checked; State.autoSave(); });
      card.querySelector('.quest-tracked')?.addEventListener('change', e => { q.tracked = e.target.checked; State.autoSave(); });
      card.querySelector('.quest-flag')?.addEventListener('change', e => { q.completionFlagName = e.target.value; State.autoSave(); });
      card.querySelector('.quest-delete')?.addEventListener('click', () => { this.removeQuest(id); this.render(container); });
      card.querySelector('.quest-add-ms')?.addEventListener('click', () => { this.addMilestone(id); this.render(container); });

      card.querySelectorAll('[data-mi]').forEach(mrow => {
        const mid = mrow.dataset.mi;
        const milestone = q.milestones.find(m => m.id === mid);
        if (!milestone) return;
        mrow.querySelector('.ms-text')?.addEventListener('change', e => { milestone.text = e.target.value; State.autoSave(); });
        mrow.querySelector('.ms-del')?.addEventListener('click', () => { this.removeMilestone(id, mid); this.render(container); });
      });
    });
  },

  _esc(s) { return String(s||'').replace(/"/g, '&quot;').replace(/</g, '&lt;'); },
};
