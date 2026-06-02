/* ===== DIALOGUE SYSTEM ===== */
const Dialogue = {
  /*
    Tree schema:
    {
      id, name, startNodeId,
      nodes: [{
        id, speaker, portrait, text,
        choices: [{ text, nextNodeId, flagAction, conditions:[], consequences:[] }],
        flagCondition, flagAction,
        conditions: [],   // advanced condition array
        consequences: []  // advanced consequence array
      }]
    }
  */

  activeTreeId: null,
  activeNodeId: null,

  init() {
    if (!State.project.dialogueTrees) State.project.dialogueTrees = [];
  },

  ensure() {
    if (!State.project.dialogueTrees) State.project.dialogueTrees = [];
  },

  createTree(name) {
    this.ensure();
    const startNode = {
      id: Utils.uid(),
      speaker: '',
      portrait: '',
      text: 'Hello!',
      choices: [],
      flagCondition: null,
      flagAction: null,
      conditions: [],
      consequences: [],
    };
    const tree = {
      id: Utils.uid(),
      name: name || `Dialogue ${State.project.dialogueTrees.length + 1}`,
      nodes: [startNode],
      startNodeId: startNode.id,
    };
    State.project.dialogueTrees.push(tree);
    State.autoSave();
    return tree;
  },

  deleteTree(id) {
    this.ensure();
    const idx = State.project.dialogueTrees.findIndex(t => t.id === id);
    if (idx !== -1) {
      State.project.dialogueTrees.splice(idx, 1);
      if (this.activeTreeId === id) { this.activeTreeId = null; this.activeNodeId = null; }
      State.autoSave();
    }
  },

  duplicateTree(id) {
    this.ensure();
    const src = State.project.dialogueTrees.find(t => t.id === id);
    if (!src) return null;
    const copy = JSON.parse(JSON.stringify(src));
    const idMap = {};
    copy.id = Utils.uid();
    copy.name = src.name + ' (Copy)';
    for (const node of copy.nodes) {
      const oldId = node.id;
      node.id = Utils.uid();
      idMap[oldId] = node.id;
    }
    copy.startNodeId = idMap[copy.startNodeId] || copy.nodes[0]?.id;
    for (const node of copy.nodes) {
      node.nextNodeId = idMap[node.nextNodeId] || node.nextNodeId;
      for (const choice of (node.choices || [])) {
        if (choice.nextNodeId && idMap[choice.nextNodeId]) choice.nextNodeId = idMap[choice.nextNodeId];
      }
    }
    State.project.dialogueTrees.push(copy);
    State.autoSave();
    return copy;
  },

  getTree(id) {
    this.ensure();
    return State.project.dialogueTrees.find(t => t.id === id) || null;
  },

  getActiveTree() {
    return this.activeTreeId ? this.getTree(this.activeTreeId) : null;
  },

  addNode(treeId) {
    const tree = this.getTree(treeId);
    if (!tree) return null;
    const node = {
      id: Utils.uid(),
      speaker: '',
      portrait: '',
      text: '',
      choices: [],
      flagCondition: null,
      flagAction: null,
      conditions: [],
      consequences: [],
    };
    tree.nodes.push(node);
    State.autoSave();
    return node;
  },

  deleteNode(treeId, nodeId) {
    const tree = this.getTree(treeId);
    if (!tree) return;
    const idx = tree.nodes.findIndex(n => n.id === nodeId);
    if (idx === -1) return;
    tree.nodes.splice(idx, 1);
    for (const n of tree.nodes) {
      if (n.nextNodeId === nodeId) n.nextNodeId = null;
      for (const c of (n.choices || [])) {
        if (c.nextNodeId === nodeId) c.nextNodeId = null;
      }
    }
    if (tree.startNodeId === nodeId) tree.startNodeId = tree.nodes[0]?.id || null;
    if (this.activeNodeId === nodeId) this.activeNodeId = null;
    State.autoSave();
  },

  getNode(treeId, nodeId) {
    const tree = this.getTree(treeId);
    return tree ? tree.nodes.find(n => n.id === nodeId) : null;
  },

  exportTreesJSON() {
    this.ensure();
    return JSON.parse(JSON.stringify(State.project.dialogueTrees));
  },

  render(container) {
    this.ensure();
    const trees = State.project.dialogueTrees;
    const activeTree = this.getActiveTree();
    const activeNode = activeTree ? activeTree.nodes.find(n => n.id === this.activeNodeId) : null;

    container.innerHTML = `
      <div class="dialogue-editor">
        <div class="dialogue-tree-header">
          <h4>📖 Dialogue Trees</h4>
          <div style="display:flex;gap:4px">
            <button class="p3-btn" id="btn-export-dialogue-json" title="Export all dialogue trees JSON">Export JSON</button>
            <button class="p3-btn accent" id="btn-add-tree">+ New Tree</button>
          </div>
        </div>
        <div class="dialogue-tree-list" id="dialogue-tree-list">
          ${trees.length === 0 ? '<div style="text-align:center;padding:12px;color:var(--text-dim);font-size:11px">No dialogue trees. Create one to start!</div>' : ''}
          ${trees.map(t => `
            <div class="dialogue-tree-item ${t.id === this.activeTreeId ? 'active' : ''}" data-id="${t.id}">
              <span>📖 ${this._esc(t.name)} <span style="color:var(--text-dim);font-size:10px">(${t.nodes.length} nodes)</span></span>
              <div class="tree-actions">
                <button class="tree-dup" title="Duplicate">📋</button>
                <button class="tree-del" title="Delete">✕</button>
              </div>
            </div>
          `).join('')}
        </div>

        ${activeTree ? this._renderTreeEditor(activeTree, activeNode) : '<div style="text-align:center;padding:20px;color:var(--text-dim);font-size:12px">Select or create a dialogue tree to edit.</div>'}
      </div>
    `;

    this._bindEvents(container);
  },

  _renderTreeEditor(tree, activeNode) {
    return `
      <div class="dialogue-node-editor" style="padding:6px 10px">
        <div style="display:flex;align-items:center;gap:6px">
          <label style="margin:0;flex-shrink:0">Tree Name</label>
          <input type="text" id="tree-name-input" value="${this._esc(tree.name)}" style="flex:1" />
        </div>
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;margin:8px 0 4px">
        <span style="font-size:12px;color:var(--text-secondary)">Nodes</span>
        <button class="p3-btn" id="btn-add-node">+ Add Node</button>
      </div>
      <div class="dialogue-node-list" id="dialogue-node-list">
        ${tree.nodes.map(n => `
          <div class="dialogue-node-item ${n.id === this.activeNodeId ? 'active' : ''} ${n.id === tree.startNodeId ? 'start-node' : ''}" data-node-id="${n.id}">
            <span class="node-type-badge">${n.id === tree.startNodeId ? '▶ START' : 'NODE'}</span>
            <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${this._esc(n.speaker || 'Unnamed')}: ${this._esc((n.text || '').substring(0, 30))}</span>
            <span style="color:var(--text-dim);font-size:10px">${(n.choices || []).length > 0 ? n.choices.length + ' choices' : 'linear'}</span>
          </div>
        `).join('')}
      </div>

      <div class="dialogue-node-editor" style="margin-top:6px">
        <div style="font-size:11px;color:var(--text-dim);margin-bottom:6px">VISUAL FLOW</div>
        ${this._renderFlowView(tree)}
      </div>

      ${activeNode ? this._renderNodeEditor(tree, activeNode) : '<div style="text-align:center;padding:12px;color:var(--text-dim);font-size:11px">Select a node to edit.</div>'}

      <div style="margin-top:8px;text-align:center">
        <button class="p3-btn accent" id="btn-test-dialogue" style="width:100%">▶ Test Dialogue</button>
      </div>
    `;
  },

  _renderFlowView(tree) {
    const rowH = 60;
    const w = 580;
    const h = Math.max(200, tree.nodes.length * rowH + 20);

    const pos = {};
    tree.nodes.forEach((n, i) => {
      pos[n.id] = { x: 20 + ((i % 2) * 250), y: 12 + i * rowH };
    });

    const lines = [];
    for (const node of tree.nodes) {
      const from = pos[node.id];
      if (!from) continue;
      if (node.nextNodeId && pos[node.nextNodeId]) {
        const to = pos[node.nextNodeId];
        lines.push(`<line x1="${from.x + 150}" y1="${from.y + 18}" x2="${to.x}" y2="${to.y + 18}" stroke="rgba(124,92,252,0.5)" stroke-width="2" />`);
      }
      for (const c of (node.choices || [])) {
        if (!c.nextNodeId || !pos[c.nextNodeId]) continue;
        const to = pos[c.nextNodeId];
        lines.push(`<line x1="${from.x + 150}" y1="${from.y + 22}" x2="${to.x}" y2="${to.y + 22}" stroke="rgba(74,222,128,0.45)" stroke-width="1.5" />`);
      }
    }

    return `
      <div class="dialogue-visual-tree" style="height:${Math.min(340, h + 12)}px">
        <svg width="${w}" height="${h}" style="position:absolute;left:0;top:0;pointer-events:none">${lines.join('')}</svg>
        ${tree.nodes.map(n => {
          const p = pos[n.id];
          const isActive = n.id === this.activeNodeId;
          const isStart = n.id === tree.startNodeId;
          return `<div class="visual-node ${isActive ? 'active' : ''} ${isStart ? 'start' : ''}" data-flow-node="${n.id}" style="left:${p.x}px;top:${p.y}px">
            <div class="node-label">${this._esc(n.speaker || (isStart ? 'START' : 'Node'))}</div>
            <div class="node-preview">${this._esc((n.text || '').substring(0, 24)) || '...'}</div>
          </div>`;
        }).join('')}
      </div>
    `;
  },

  _renderNodeEditor(tree, node) {
    const allNodes = tree.nodes;
    const assets = State.project.assets || [];
    GameFlags.ensureFlags();
    const flags = State.project.flags || [];

    return `
      <div class="dialogue-node-editor" id="node-editor">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
          <span style="font-size:12px;font-weight:600;color:var(--text-primary)">Edit Node</span>
          <div style="display:flex;gap:4px">
            ${node.id !== tree.startNodeId ? `<button class="p3-btn success" id="btn-set-start" style="font-size:10px">▶ Set Start</button>` : ''}
            <button class="p3-btn danger" id="btn-delete-node" style="font-size:10px">✕ Delete</button>
          </div>
        </div>

        <label>Speaker Name</label>
        <input type="text" id="node-speaker" value="${this._esc(node.speaker || '')}" placeholder="e.g. Nabu, Villager, ???" />

        <label>Portrait (Asset)</label>
        <select id="node-portrait">
          <option value="">-- No Portrait --</option>
          ${assets.map(a => `<option value="${a.id}" ${node.portrait === a.id ? 'selected' : ''}>${this._esc(a.name)}</option>`).join('')}
        </select>

        <label>Dialogue Text</label>
        <textarea id="node-text" rows="3" placeholder="What the character says...">${this._esc(node.text || '')}</textarea>

        <label>Flag Condition (Legacy)</label>
        <div style="display:flex;gap:4px;align-items:center">
          <select id="node-cond-flag" style="flex:1">
            <option value="">-- No Condition --</option>
            ${flags.map(f => `<option value="${f.name}" ${(node.flagCondition?.flag === f.name) ? 'selected' : ''}>${f.name}</option>`).join('')}
          </select>
          <select id="node-cond-op" style="width:70px">
            ${['==','!=','>','<','>=','<=','truthy','falsy'].map(op => `<option value="${op}" ${(node.flagCondition?.operator === op) ? 'selected' : ''}>${op}</option>`).join('')}
          </select>
          <input type="text" id="node-cond-val" value="${this._esc(node.flagCondition?.value ?? '')}" placeholder="value" style="width:60px" />
        </div>

        <label>Advanced Conditions (JSON array)</label>
        <textarea id="node-conditions-json" rows="3" placeholder='[{"type":"inventory","itemId":"...","operator":"has"}]'>${this._esc(JSON.stringify(node.conditions || []))}</textarea>

        <label>Consequences (JSON array)</label>
        <textarea id="node-consequences-json" rows="3" placeholder='[{"type":"reputation","npcId":"...","stat":"Friendship","delta":5}]'>${this._esc(JSON.stringify(node.consequences || []))}</textarea>

        <label>Flag Action (Legacy)</label>
        <div style="display:flex;gap:4px;align-items:center">
          <select id="node-action-flag" style="flex:1">
            <option value="">-- None --</option>
            ${flags.map(f => `<option value="${f.name}" ${(node.flagAction?.flag === f.name) ? 'selected' : ''}>${f.name}</option>`).join('')}
          </select>
          <select id="node-action-op" style="width:70px">
            ${['set','toggle','increment','decrement'].map(op => `<option value="${op}" ${(node.flagAction?.operation === op) ? 'selected' : ''}>${op}</option>`).join('')}
          </select>
          <input type="text" id="node-action-val" value="${this._esc(node.flagAction?.value ?? '')}" placeholder="value" style="width:60px" />
        </div>

        <label>Response Choices</label>
        <div class="dialogue-choices-list" id="choices-list">
          ${(node.choices || []).map((c, i) => `
            <div class="dialogue-choice-row" data-idx="${i}" style="display:grid;grid-template-columns:1fr 120px auto;gap:4px;align-items:center">
              <input type="text" value="${this._esc(c.text || '')}" class="choice-text" placeholder="Choice text..." />
              <select class="choice-next" style="width:120px">
                <option value="">-- End --</option>
                ${allNodes.filter(n => n.id !== node.id).map(n => `<option value="${n.id}" ${c.nextNodeId === n.id ? 'selected' : ''}>${this._esc(n.speaker || 'Node')}</option>`).join('')}
              </select>
              <button class="choice-del" title="Remove choice">✕</button>
            </div>
          `).join('')}
        </div>
        <button class="p3-btn" id="btn-add-choice" style="width:100%;margin-top:4px">+ Add Choice</button>

        ${(node.choices || []).length === 0 ? `
          <label>Next Node (Linear)</label>
          <select id="node-next-linear">
            <option value="">-- End Dialogue --</option>
            ${allNodes.filter(n => n.id !== node.id).map(n => `<option value="${n.id}" ${node.nextNodeId === n.id ? 'selected' : ''}>${this._esc(n.speaker || 'Node')}</option>`).join('')}
          </select>
        ` : ''}
      </div>
    `;
  },

  _bindEvents(container) {
    container.querySelector('#btn-add-tree')?.addEventListener('click', () => {
      const tree = this.createTree();
      this.activeTreeId = tree.id;
      this.activeNodeId = tree.startNodeId;
      this.render(container);
    });

    container.querySelector('#btn-export-dialogue-json')?.addEventListener('click', () => {
      const json = JSON.stringify(this.exportTreesJSON(), null, 2);
      Utils.download(json, `${Utils.sanitizeName(State.project.name || 'project')}_dialogue_trees.json`, 'application/json');
      if (typeof Toast !== 'undefined') Toast.show('Dialogue trees exported as JSON', 'success');
    });

    container.querySelectorAll('.dialogue-tree-item').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.tree-actions')) return;
        this.activeTreeId = el.dataset.id;
        const tree = this.getTree(this.activeTreeId);
        this.activeNodeId = tree?.startNodeId || null;
        this.render(container);
      });

      el.querySelector('.tree-dup')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.duplicateTree(el.dataset.id);
        this.render(container);
      });

      el.querySelector('.tree-del')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Delete this dialogue tree?')) {
          this.deleteTree(el.dataset.id);
          this.render(container);
        }
      });
    });

    container.querySelectorAll('[data-flow-node]').forEach(el => {
      el.addEventListener('click', () => {
        this.activeNodeId = el.dataset.flowNode;
        this.render(container);
      });
    });

    container.querySelector('#tree-name-input')?.addEventListener('change', (e) => {
      const tree = this.getActiveTree();
      if (tree) { tree.name = e.target.value.trim() || 'Untitled'; State.autoSave(); }
    });

    container.querySelector('#btn-add-node')?.addEventListener('click', () => {
      if (!this.activeTreeId) return;
      const node = this.addNode(this.activeTreeId);
      if (node) { this.activeNodeId = node.id; this.render(container); }
    });

    container.querySelectorAll('.dialogue-node-item').forEach(el => {
      el.addEventListener('click', () => {
        this.activeNodeId = el.dataset.nodeId;
        this.render(container);
      });
    });

    const tree = this.getActiveTree();
    const node = tree ? tree.nodes.find(n => n.id === this.activeNodeId) : null;
    if (node && tree) this._bindNodeEditor(container, tree, node);

    container.querySelector('#btn-test-dialogue')?.addEventListener('click', () => {
      if (this.activeTreeId) Preview.testDialogueTree(this.activeTreeId);
    });
  },

  _bindNodeEditor(container, tree, node) {
    const saveNode = () => State.autoSave();

    container.querySelector('#node-speaker')?.addEventListener('input', (e) => { node.speaker = e.target.value; saveNode(); });
    container.querySelector('#node-portrait')?.addEventListener('change', (e) => { node.portrait = e.target.value; saveNode(); });
    container.querySelector('#node-text')?.addEventListener('input', (e) => { node.text = e.target.value; saveNode(); });

    const updateCondition = () => {
      const flag = container.querySelector('#node-cond-flag')?.value;
      if (flag) {
        node.flagCondition = {
          flag,
          operator: container.querySelector('#node-cond-op')?.value || '==',
          value: container.querySelector('#node-cond-val')?.value || '',
        };
      } else node.flagCondition = null;
      saveNode();
    };
    container.querySelector('#node-cond-flag')?.addEventListener('change', updateCondition);
    container.querySelector('#node-cond-op')?.addEventListener('change', updateCondition);
    container.querySelector('#node-cond-val')?.addEventListener('change', updateCondition);

    const updateAction = () => {
      const flag = container.querySelector('#node-action-flag')?.value;
      if (flag) {
        node.flagAction = {
          flag,
          operation: container.querySelector('#node-action-op')?.value || 'set',
          value: container.querySelector('#node-action-val')?.value || '',
        };
      } else node.flagAction = null;
      saveNode();
    };
    container.querySelector('#node-action-flag')?.addEventListener('change', updateAction);
    container.querySelector('#node-action-op')?.addEventListener('change', updateAction);
    container.querySelector('#node-action-val')?.addEventListener('change', updateAction);

    const parseJsonField = (id, setter) => {
      const raw = container.querySelector(id)?.value?.trim();
      if (!raw) { setter([]); return; }
      try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) throw new Error('Expected array');
        setter(parsed);
      } catch (err) {
        if (typeof Toast !== 'undefined') Toast.show(`Invalid JSON in ${id}: ${err.message}`, 'error');
      }
    };

    container.querySelector('#node-conditions-json')?.addEventListener('change', () => {
      parseJsonField('#node-conditions-json', (v) => { node.conditions = v; saveNode(); });
    });

    container.querySelector('#node-consequences-json')?.addEventListener('change', () => {
      parseJsonField('#node-consequences-json', (v) => { node.consequences = v; saveNode(); });
    });

    container.querySelectorAll('.dialogue-choice-row').forEach(row => {
      const idx = parseInt(row.dataset.idx);
      row.querySelector('.choice-text')?.addEventListener('input', (e) => {
        if (node.choices[idx]) { node.choices[idx].text = e.target.value; saveNode(); }
      });
      row.querySelector('.choice-next')?.addEventListener('change', (e) => {
        if (node.choices[idx]) { node.choices[idx].nextNodeId = e.target.value || null; saveNode(); }
      });
      row.querySelector('.choice-del')?.addEventListener('click', () => {
        node.choices.splice(idx, 1);
        saveNode();
        this.render(container);
      });
    });

    container.querySelector('#btn-add-choice')?.addEventListener('click', () => {
      if (!node.choices) node.choices = [];
      node.choices.push({ text: '', nextNodeId: null, flagAction: null, conditions: [], consequences: [] });
      saveNode();
      this.render(container);
    });

    container.querySelector('#node-next-linear')?.addEventListener('change', (e) => {
      node.nextNodeId = e.target.value || null;
      saveNode();
    });

    container.querySelector('#btn-set-start')?.addEventListener('click', () => {
      tree.startNodeId = node.id;
      saveNode();
      this.render(container);
    });

    container.querySelector('#btn-delete-node')?.addEventListener('click', () => {
      if (tree.nodes.length <= 1) { Toast.show('Cannot delete the only node.', 'error'); return; }
      this.deleteNode(tree.id, node.id);
      this.render(container);
    });
  },

  populateTreeSelect(select, selectedValue = '') {
    this.ensure();
    select.innerHTML = '<option value="">-- Select Dialogue --</option>';
    for (const t of State.project.dialogueTrees) {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = t.name + ` (${t.nodes.length} nodes)`;
      select.appendChild(opt);
    }
    select.value = selectedValue;
  },

  _esc(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },
};
