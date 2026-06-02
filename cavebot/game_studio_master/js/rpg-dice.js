/* ===== TTRPG DICE / STAT CHECK ENGINE (Phase 3B) ===== */
const DiceEngine = {
  SKILLS: [
    { key: 'naturalist', label: 'Naturalist', icon: '🌿', color: '#4ade80' },
    { key: 'occultist', label: 'Occultist', icon: '🔮', color: '#a78bfa' },
    { key: 'scribal', label: 'Scribal', icon: '📜', color: '#fbbf24' },
  ],

  DICE_TYPES: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'],

  init() { this._ensure(); },

  _ensure() {
    if (!State.project.rpgSkills) {
      State.project.rpgSkills = {
        enabled: false,
        skills: this.SKILLS.map(s => ({
          key: s.key, label: s.label, icon: s.icon, color: s.color,
          defaultLevel: 10, maxLevel: 100,
        })),
        xpPerLevel: 100,
        defaultDice: 'd20',
      };
    }
  },

  getConfig() { this._ensure(); return State.project.rpgSkills; },

  // Runtime
  createRuntimeState() {
    this._ensure();
    const cfg = State.project.rpgSkills;
    if (!cfg.enabled) return { skills: {}, xp: {} };
    const skills = {}, xp = {};
    for (const s of cfg.skills) {
      skills[s.key] = s.defaultLevel;
      xp[s.key] = 0;
    }
    return { skills, xp };
  },

  // Roll a die
  roll(diceType) {
    const sides = parseInt(diceType.replace('d', ''));
    return Math.floor(Math.random() * sides) + 1;
  },

  // Skill check: roll + skillLevel vs difficulty
  skillCheck(runtimeSkills, skillKey, difficulty, diceType) {
    const cfg = this.getConfig();
    const dice = diceType || cfg.defaultDice || 'd20';
    const rollResult = this.roll(dice);
    const skillLevel = runtimeSkills.skills[skillKey] || 0;
    const modifier = Math.floor(skillLevel / 10); // every 10 points = +1 modifier
    const total = rollResult + modifier;
    const success = total >= difficulty;
    return { rollResult, modifier, total, difficulty, success, dice, skillKey };
  },

  // Award XP and check level up
  awardXP(runtimeSkills, skillKey, amount) {
    const cfg = this.getConfig();
    if (!runtimeSkills.xp[skillKey]) runtimeSkills.xp[skillKey] = 0;
    runtimeSkills.xp[skillKey] += amount;
    const xpNeeded = cfg.xpPerLevel || 100;
    let leveled = false;
    while (runtimeSkills.xp[skillKey] >= xpNeeded) {
      runtimeSkills.xp[skillKey] -= xpNeeded;
      runtimeSkills.skills[skillKey] = Math.min(
        (runtimeSkills.skills[skillKey] || 0) + 1,
        cfg.skills.find(s => s.key === skillKey)?.maxLevel || 100
      );
      leveled = true;
    }
    return leveled;
  },

  populateSkillSelect(select, selectedKey) {
    this._ensure();
    select.innerHTML = '<option value="">-- None --</option>';
    for (const s of State.project.rpgSkills.skills) {
      const opt = document.createElement('option');
      opt.value = s.key; opt.textContent = `${s.icon} ${s.label}`;
      select.appendChild(opt);
    }
    if (selectedKey) select.value = selectedKey;
  },

  render(container) {
    this._ensure();
    const cfg = State.project.rpgSkills;
    container.innerHTML = `
      <div class="rpg-editor" style="padding:8px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <h4 style="margin:0;font-size:13px;color:var(--text-primary)">🎲 Dice & Skills</h4>
          <label style="font-size:11px;color:var(--text-dim);display:flex;align-items:center;gap:4px">
            <input type="checkbox" id="rpg-skills-enabled" ${cfg.enabled ? 'checked' : ''} /> Enabled
          </label>
        </div>
        <p style="font-size:11px;color:var(--text-dim);margin-bottom:8px">TTRPG-style skill checks. Roll dice + skill modifier vs difficulty.</p>
        <div style="display:flex;gap:8px;margin-bottom:8px">
          <div>
            <label style="font-size:10px;color:var(--text-dim)">DEFAULT DICE</label>
            <select id="rpg-default-dice" style="width:70px">
              ${this.DICE_TYPES.map(d => `<option value="${d}" ${cfg.defaultDice === d ? 'selected' : ''}>${d}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="font-size:10px;color:var(--text-dim)">XP/LEVEL</label>
            <input type="number" id="rpg-xp-level" value="${cfg.xpPerLevel}" min="10" style="width:60px" />
          </div>
        </div>
        <div id="rpg-skills-list">
          ${cfg.skills.map((s, i) => `
            <div class="rpg-skill-row" data-idx="${i}" style="display:flex;align-items:center;gap:6px;padding:4px 0;border-bottom:1px solid var(--border)">
              <span style="font-size:14px">${s.icon}</span>
              <input type="text" class="skill-label" value="${this._esc(s.label)}" style="flex:1;font-size:11px" />
              <input type="text" class="skill-key" value="${s.key}" style="width:70px;font-size:10px" title="Key" />
              <input type="number" class="skill-default" value="${s.defaultLevel}" min="0" max="100" style="width:40px;font-size:10px" title="Default" />
              <input type="color" class="skill-color" value="${s.color}" style="width:24px;height:20px;padding:0;border:none" />
            </div>
          `).join('')}
          <button class="p3-btn" id="rpg-add-skill" style="margin-top:4px;font-size:9px">+ Add Skill</button>
        </div>
      </div>
    `;

    container.querySelector('#rpg-skills-enabled')?.addEventListener('change', e => {
      cfg.enabled = e.target.checked; State.autoSave();
    });
    container.querySelector('#rpg-default-dice')?.addEventListener('change', e => {
      cfg.defaultDice = e.target.value; State.autoSave();
    });
    container.querySelector('#rpg-xp-level')?.addEventListener('change', e => {
      cfg.xpPerLevel = parseInt(e.target.value) || 100; State.autoSave();
    });
    container.querySelector('#rpg-add-skill')?.addEventListener('click', () => {
      const key = 'skill_' + (cfg.skills.length + 1);
      cfg.skills.push({ key, label: 'New Skill', icon: '⚡', color: '#60a5fa', defaultLevel: 10, maxLevel: 100 });
      State.autoSave(); this.render(container);
    });
    container.querySelectorAll('.rpg-skill-row').forEach(row => {
      const i = parseInt(row.dataset.idx);
      row.querySelector('.skill-label')?.addEventListener('change', e => { cfg.skills[i].label = e.target.value; State.autoSave(); });
      row.querySelector('.skill-key')?.addEventListener('change', e => { cfg.skills[i].key = e.target.value; State.autoSave(); });
      row.querySelector('.skill-default')?.addEventListener('change', e => { cfg.skills[i].defaultLevel = parseInt(e.target.value) || 10; State.autoSave(); });
      row.querySelector('.skill-color')?.addEventListener('change', e => { cfg.skills[i].color = e.target.value; State.autoSave(); });
    });
  },

  _esc(s) { return String(s||'').replace(/"/g, '&quot;').replace(/</g, '&lt;'); },
};
