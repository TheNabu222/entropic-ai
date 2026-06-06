/* ===== GAME FLAGS / GLOBAL VARIABLES SYSTEM ===== */
const GameFlags = {
  /* Project-level flags live in State.project.flags = [{ id, name, type, defaultValue }] */

  init() {
    // Ensure project has flags array
    if (!State.project.flags) State.project.flags = [];
  },

  ensureFlags() {
    if (!State.project.flags) State.project.flags = [];
  },

  // ---- CRUD ----
  addFlag(name, type = 'boolean', defaultValue = null) {
    this.ensureFlags();
    if (!name || name.trim() === '') return null;
    name = name.trim();
    // Prevent duplicates
    if (State.project.flags.find(f => f.name === name)) return null;
    const flag = {
      id: Utils.uid(),
      name,
      type, // 'boolean', 'number', 'string'
      defaultValue: defaultValue !== null ? defaultValue : (type === 'boolean' ? false : type === 'number' ? 0 : ''),
    };
    State.project.flags.push(flag);
    State.autoSave();
    return flag;
  },

  removeFlag(id) {
    this.ensureFlags();
    const idx = State.project.flags.findIndex(f => f.id === id);
    if (idx !== -1) {
      State.project.flags.splice(idx, 1);
      State.autoSave();
    }
  },

  updateFlag(id, updates) {
    this.ensureFlags();
    const flag = State.project.flags.find(f => f.id === id);
    if (flag) {
      Object.assign(flag, updates);
      State.autoSave();
    }
  },

  getFlag(name) {
    this.ensureFlags();
    return State.project.flags.find(f => f.name === name) || null;
  },

  getAllFlags() {
    this.ensureFlags();
    return State.project.flags;
  },

  // ---- Runtime helpers (used during preview/export) ----
  // Returns initial runtime state object
  createRuntimeState() {
    this.ensureFlags();
    const state = {};
    for (const f of State.project.flags) {
      state[f.name] = f.defaultValue;
    }
    return state;
  },

  // Evaluate a condition against runtime flags
  // condition: { flag, operator, value }
  evaluateCondition(condition, runtimeFlags) {
    if (!condition || !condition.flag) return true;
    const val = runtimeFlags[condition.flag];
    switch (condition.operator) {
      case '==': return val == condition.value;
      case '!=': return val != condition.value;
      case '>':  return Number(val) > Number(condition.value);
      case '<':  return Number(val) < Number(condition.value);
      case '>=': return Number(val) >= Number(condition.value);
      case '<=': return Number(val) <= Number(condition.value);
      case 'truthy': return !!val;
      case 'falsy': return !val;
      default: return true;
    }
  },

  // Apply a flag action
  // action: { flag, operation, value }
  applyAction(action, runtimeFlags) {
    if (!action || !action.flag) return;
    switch (action.operation) {
      case 'set': runtimeFlags[action.flag] = action.value; break;
      case 'toggle': runtimeFlags[action.flag] = !runtimeFlags[action.flag]; break;
      case 'increment': runtimeFlags[action.flag] = (Number(runtimeFlags[action.flag]) || 0) + (Number(action.value) || 1); break;
      case 'decrement': runtimeFlags[action.flag] = (Number(runtimeFlags[action.flag]) || 0) - (Number(action.value) || 1); break;
      case 'append': runtimeFlags[action.flag] = String(runtimeFlags[action.flag] || '') + String(action.value || ''); break;
    }
  },

  // ---- UI Rendering (for the Flags tab in editor) ----
  render(container) {
    this.ensureFlags();
    const flags = State.project.flags;

    container.innerHTML = `
      <div class="flags-editor">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <h4 style="margin:0;font-size:13px;color:var(--text-primary)">Game Variables</h4>
          <button class="p3-btn accent" id="btn-add-flag">+ Add Flag</button>
        </div>
        <p style="font-size:11px;color:var(--text-dim);margin-bottom:8px">
          Define global variables that track game state (quest progress, items collected, etc.)
        </p>
        <div class="flags-list" id="flags-list">
          ${flags.length === 0 ? '<div style="text-align:center;padding:16px;color:var(--text-dim);font-size:11px">No flags defined. Click "+ Add Flag" to create one.</div>' : ''}
          ${flags.map(f => `
            <div class="flag-row" data-id="${f.id}">
              <input type="text" value="${this._esc(f.name)}" class="flag-name" placeholder="flag_name" style="flex:1" />
              <select class="flag-type" style="width:80px">
                <option value="boolean" ${f.type === 'boolean' ? 'selected' : ''}>Bool</option>
                <option value="number" ${f.type === 'number' ? 'selected' : ''}>Num</option>
                <option value="string" ${f.type === 'string' ? 'selected' : ''}>Str</option>
              </select>
              <input type="text" value="${this._esc(String(f.defaultValue))}" class="flag-default" placeholder="default" style="width:60px" />
              <button class="flag-delete" title="Delete">✕</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Bind events
    container.querySelector('#btn-add-flag')?.addEventListener('click', () => {
      this.addFlag('new_flag_' + (flags.length + 1));
      this.render(container);
    });

    container.querySelectorAll('.flag-row').forEach(row => {
      const id = row.dataset.id;
      row.querySelector('.flag-name')?.addEventListener('change', (e) => {
        this.updateFlag(id, { name: e.target.value.trim().replace(/\s+/g, '_') });
      });
      row.querySelector('.flag-type')?.addEventListener('change', (e) => {
        const type = e.target.value;
        const def = type === 'boolean' ? false : type === 'number' ? 0 : '';
        this.updateFlag(id, { type, defaultValue: def });
        this.render(container);
      });
      row.querySelector('.flag-default')?.addEventListener('change', (e) => {
        let val = e.target.value;
        const flag = State.project.flags.find(f => f.id === id);
        if (flag) {
          if (flag.type === 'boolean') val = val === 'true';
          else if (flag.type === 'number') val = Number(val) || 0;
          this.updateFlag(id, { defaultValue: val });
        }
      });
      row.querySelector('.flag-delete')?.addEventListener('click', () => {
        this.removeFlag(id);
        this.render(container);
      });
    });
  },

  _esc(str) {
    return String(str).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },

  // Populate flag select dropdown
  populateFlagSelect(select, selectedValue = '') {
    this.ensureFlags();
    select.innerHTML = '<option value="">-- None --</option>';
    for (const f of State.project.flags) {
      const opt = document.createElement('option');
      opt.value = f.name;
      opt.textContent = f.name + ` (${f.type})`;
      select.appendChild(opt);
    }
    select.value = selectedValue;
  },
};
