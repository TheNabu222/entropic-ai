/* ===== RPG SYSTEMS MANAGER (Phase 3B) =====
   Unified manager that coordinates all RPG subsystems
   and provides focused renders for left-panel tabs. */
const RPGSystems = {
  activeSubTab: 'needs',

  SUB_TABS: [
    { key: 'needs', label: '🧠 Needs', module: 'NeedsTracker' },
    { key: 'npcs', label: '👥 NPCs', module: 'Reputation' },
    { key: 'quests', label: '📜 Quests', module: 'QuestTracker' },
    { key: 'dice', label: '🎲 Skills', module: 'DiceEngine' },
    { key: 'daynight', label: '🌅 Time', module: 'DayNight' },
    { key: 'status', label: '✨ Effects', module: 'StatusEffects' },
    { key: 'save', label: '💾 Save', module: 'SaveLoad' },
  ],

  init() {
    NeedsTracker.init();
    Reputation.init();
    QuestTracker.init();
    DiceEngine.init();
    DayNight.init();
    StatusEffects.init();
    NPCAI.init();
  },

  ensureData() {
    NeedsTracker._ensure();
    Reputation._ensure();
    QuestTracker._ensure();
    DiceEngine._ensure();
    DayNight._ensure();
    StatusEffects._ensure();
  },

  _getModule(key) {
    const row = this.SUB_TABS.find(t => t.key === key);
    if (!row) return null;
    return window[row.module] || null;
  },

  render(container) {
    if (!container) return;
    container.innerHTML = `
      <div class="rpg-systems-tabs" style="display:flex;flex-wrap:wrap;gap:0;border-bottom:1px solid var(--border);margin-bottom:4px">
        ${this.SUB_TABS.map(t => `
          <button class="rpg-sub-tab ${this.activeSubTab === t.key ? 'active' : ''}" data-key="${t.key}"
            style="padding:5px 7px;font-size:10px;background:${this.activeSubTab === t.key ? 'var(--bg-tertiary)' : 'transparent'};
            border:none;border-bottom:${this.activeSubTab === t.key ? '2px solid var(--accent)' : '2px solid transparent'};
            color:${this.activeSubTab === t.key ? 'var(--accent)' : 'var(--text-dim)'};cursor:pointer;white-space:nowrap"
            title="Open ${t.label.replace(/[\u{1F300}-\u{1FAFF}]/gu, '').trim()} settings">
            ${t.label}
          </button>
        `).join('')}
      </div>
      <div id="rpg-sub-content"></div>
    `;

    container.querySelectorAll('.rpg-sub-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeSubTab = btn.dataset.key;
        this.render(container);
      });
    });

    const subContent = container.querySelector('#rpg-sub-content');
    const module = this._getModule(this.activeSubTab);
    if (!module) return;

    if (this.activeSubTab === 'save' && typeof module.renderSettings === 'function') {
      module.renderSettings(subContent);
    } else if (typeof module.render === 'function') {
      module.render(subContent);
    }
  },

  // Focused render for left tabs: npcs / quests / systems
  renderFocused(container, mode) {
    if (!container) return;

    if (mode === 'npcs') {
      const module = this._getModule('npcs');
      if (module?.render) module.render(container);
      return;
    }

    if (mode === 'quests') {
      const module = this._getModule('quests');
      if (module?.render) module.render(container);
      return;
    }

    // mode === 'systems': compact stack of all gameplay systems except NPC/Quest
    container.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:8px;padding:2px">
        <div class="dtree-preview">⚙ Configure global gameplay systems and runtime behavior.</div>
        <div id="systems-needs" class="dialogue-node-editor"></div>
        <div id="systems-skills" class="dialogue-node-editor"></div>
        <div id="systems-time" class="dialogue-node-editor"></div>
        <div id="systems-effects" class="dialogue-node-editor"></div>
        <div id="systems-save" class="dialogue-node-editor"></div>
      </div>
    `;

    NeedsTracker.render(container.querySelector('#systems-needs'));
    DiceEngine.render(container.querySelector('#systems-skills'));
    DayNight.render(container.querySelector('#systems-time'));
    StatusEffects.render(container.querySelector('#systems-effects'));
    SaveLoad.renderSettings(container.querySelector('#systems-save'));
  },

  createRuntimeState() {
    return {
      needs: NeedsTracker.createRuntimeState(),
      reputation: Reputation.createRuntimeState(),
      quests: QuestTracker.createRuntimeState(),
      skills: DiceEngine.createRuntimeState(),
      time: DayNight.createRuntimeState(),
      statusEffects: StatusEffects.createRuntimeState(),
      npcStates: NPCAI.createRuntimeState(),
    };
  },

  getExportData() {
    return {
      rpgNeeds: State.project.rpgNeeds || null,
      rpgNPCs: State.project.rpgNPCs || [],
      rpgQuests: State.project.rpgQuests || [],
      rpgSkills: State.project.rpgSkills || null,
      rpgDayNight: State.project.rpgDayNight || null,
      rpgStatusEffects: State.project.rpgStatusEffects || [],
      inventoryUI: State.project.inventoryUI || { style: 'bar', slotSize: 40, position: 'bottom' },
      questUI: State.project.questUI || { showPanel: true, pinTracked: true, accent: '#7c5cfc' },
    };
  },
};
