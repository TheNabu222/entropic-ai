/* ===== INVENTORY SYSTEM ===== */
const Inventory = {
  /*
    State.project.inventoryItems = [{
      id, name, icon, description,
      stackable, maxStack,
      usableOn: [{ objectName, successText, consume, setFlag, grantItemId }],
      combinations: [{ withItemId, resultItemId, consumeBoth }],
      examineText, category
    }]
  */

  activeItemId: null,

  init() {
    if (!State.project.inventoryItems) State.project.inventoryItems = [];
    if (!State.project.inventoryUI) State.project.inventoryUI = { style: 'bar', slotSize: 40, position: 'bottom' };
  },

  ensure() {
    if (!State.project.inventoryItems) State.project.inventoryItems = [];
    if (!State.project.inventoryUI) State.project.inventoryUI = { style: 'bar', slotSize: 40, position: 'bottom' };
  },

  createItem(name) {
    this.ensure();
    const item = {
      id: Utils.uid(),
      name: name || `Item ${State.project.inventoryItems.length + 1}`,
      icon: '',
      description: '',
      stackable: false,
      maxStack: 1,
      usableOn: [],
      combinations: [],
      examineText: '',
      category: 'misc',
      properties: {},
    };
    State.project.inventoryItems.push(item);
    State.autoSave();
    return item;
  },

  deleteItem(id) {
    this.ensure();
    const idx = State.project.inventoryItems.findIndex(i => i.id === id);
    if (idx !== -1) {
      State.project.inventoryItems.splice(idx, 1);
      if (this.activeItemId === id) this.activeItemId = null;
      for (const item of State.project.inventoryItems) {
        item.combinations = (item.combinations || []).filter(c => c.withItemId !== id && c.resultItemId !== id);
      }
      State.autoSave();
    }
  },

  getItem(id) {
    this.ensure();
    return State.project.inventoryItems.find(i => i.id === id) || null;
  },

  getItemByName(name) {
    this.ensure();
    return State.project.inventoryItems.find(i => i.name === name) || null;
  },

  getAllItems() {
    this.ensure();
    return State.project.inventoryItems;
  },

  getUseRule(itemId, objectName) {
    const item = this.getItem(itemId);
    if (!item || !item.usableOn) return null;
    const name = String(objectName || '').trim().toLowerCase();
    return item.usableOn.find(r => String(r.objectName || '').trim().toLowerCase() === name) || null;
  },

  getCombinationResult(itemAId, itemBId) {
    const a = this.getItem(itemAId);
    if (!a) return null;
    const combo = (a.combinations || []).find(c => c.withItemId === itemBId);
    if (combo) return combo;

    const b = this.getItem(itemBId);
    if (!b) return null;
    return (b.combinations || []).find(c => c.withItemId === itemAId) || null;
  },

  exportItemsJSON() {
    this.ensure();
    return JSON.parse(JSON.stringify(State.project.inventoryItems));
  },

  render(container) {
    this.ensure();
    const items = State.project.inventoryItems;
    const activeItem = this.activeItemId ? this.getItem(this.activeItemId) : null;
    const assets = State.project.assets || [];
    const invUI = State.project.inventoryUI;

    container.innerHTML = `
      <div class="inventory-editor">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <h4 style="margin:0;font-size:13px;color:var(--text-primary)">🎒 Inventory Items</h4>
          <div style="display:flex;gap:4px">
            <button class="p3-btn" id="btn-export-inventory-json" title="Export inventory JSON">Export JSON</button>
            <button class="p3-btn accent" id="btn-add-item" title="Create item">+ New Item</button>
          </div>
        </div>
        <p style="font-size:11px;color:var(--text-dim);margin-bottom:8px">
          Define items, use rules, combinations, and exported game inventory UI.
        </p>

        <div class="dialogue-node-editor" style="margin-bottom:8px">
          <div style="font-size:11px;color:var(--text-dim);margin-bottom:6px">INVENTORY UI (Exported Game)</div>
          <div class="prop-row">
            <label>Style</label>
            <select id="inv-ui-style" title="Layout style for inventory">
              <option value="bar" ${invUI.style === 'bar' ? 'selected' : ''}>Bottom Bar</option>
              <option value="compact" ${invUI.style === 'compact' ? 'selected' : ''}>Compact</option>
            </select>
          </div>
          <div class="prop-row">
            <label>Slot Size</label>
            <input type="number" id="inv-ui-slot" min="24" max="80" value="${invUI.slotSize || 40}" />
          </div>
          <div class="prop-row">
            <label>Position</label>
            <select id="inv-ui-pos">
              <option value="bottom" ${invUI.position === 'bottom' ? 'selected' : ''}>Bottom</option>
              <option value="top" ${invUI.position === 'top' ? 'selected' : ''}>Top</option>
            </select>
          </div>
        </div>

        <div class="inventory-item-list" id="inv-item-list">
          ${items.length === 0 ? '<div style="text-align:center;padding:12px;color:var(--text-dim);font-size:11px">No items defined. Create one!</div>' : ''}
          ${items.map(item => {
            const iconAsset = item.icon ? assets.find(a => a.id === item.icon) : null;
            return `
              <div class="inventory-item-row ${item.id === this.activeItemId ? 'active' : ''}" data-id="${item.id}">
                <div class="item-icon">
                  ${iconAsset ? `<img src="${iconAsset.dataURL}" alt="${this._esc(item.name)}" />` : '📦'}
                </div>
                <div class="item-info">
                  <div class="item-name">${this._esc(item.name)}</div>
                  <div class="item-desc">${this._esc(item.description || 'No description')}</div>
                </div>
                <button class="tree-actions" style="background:none;border:none;color:var(--text-dim);cursor:pointer" data-del="${item.id}" title="Delete">✕</button>
              </div>
            `;
          }).join('')}
        </div>

        ${activeItem ? this._renderItemEditor(activeItem, items, assets) : '<div style="text-align:center;padding:16px;color:var(--text-dim);font-size:11px">Select an item to edit its details.</div>'}
      </div>
    `;

    this._bindEvents(container);
  },

  _renderItemEditor(item, allItems, assets) {
    return `
      <div class="inventory-item-editor" id="item-editor">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
          <span style="font-size:12px;font-weight:600;color:var(--text-primary)">Edit Item</span>
        </div>

        <label>Item Name</label>
        <input type="text" id="item-name" value="${this._esc(item.name)}" placeholder="e.g. Rusty Key, Health Potion" />

        <label>Icon (Asset)</label>
        <select id="item-icon">
          <option value="">-- No Icon --</option>
          ${assets.map(a => `<option value="${a.id}" ${item.icon === a.id ? 'selected' : ''}>${this._esc(a.name)}</option>`).join('')}
        </select>
        ${item.icon && assets.find(a => a.id === item.icon) ? `
          <div class="item-icon-preview">
            <img src="${assets.find(a => a.id === item.icon).dataURL}" alt="icon" />
          </div>
        ` : ''}

        <label>Description</label>
        <textarea id="item-desc" rows="2" placeholder="A brief item description...">${this._esc(item.description || '')}</textarea>

        <label>Examine Text</label>
        <textarea id="item-examine" rows="2" placeholder="Detailed examine text...">${this._esc(item.examineText || '')}</textarea>

        <label>Category</label>
        <select id="item-category">
          <option value="misc" ${item.category === 'misc' ? 'selected' : ''}>Misc</option>
          <option value="key" ${item.category === 'key' ? 'selected' : ''}>Key Item</option>
          <option value="consumable" ${item.category === 'consumable' ? 'selected' : ''}>Consumable</option>
          <option value="weapon" ${item.category === 'weapon' ? 'selected' : ''}>Weapon</option>
          <option value="quest" ${item.category === 'quest' ? 'selected' : ''}>Quest</option>
        </select>

        <div style="display:flex;gap:8px;margin-top:6px">
          <label style="display:flex;align-items:center;gap:4px;margin:0">
            <input type="checkbox" id="item-stackable" ${item.stackable ? 'checked' : ''} /> Stackable
          </label>
          <div style="display:flex;align-items:center;gap:4px">
            <label style="margin:0;font-size:10px">Max Stack</label>
            <input type="number" id="item-max-stack" value="${item.maxStack || 1}" min="1" style="width:50px" />
          </div>
        </div>

        <label style="margin-top:8px">Use Item On Object Rules</label>
        <div id="use-rules-list">
          ${(item.usableOn || []).map((rule, i) => `
            <div class="combo-row" data-uri="${i}" style="display:grid;grid-template-columns:1fr 80px 1fr auto;gap:4px;align-items:center">
              <input type="text" class="use-object" value="${this._esc(rule.objectName || '')}" placeholder="Object name" />
              <label style="display:flex;gap:3px;align-items:center;margin:0;font-size:10px"><input type="checkbox" class="use-consume" ${rule.consume ? 'checked' : ''} />Consume</label>
              <input type="text" class="use-text" value="${this._esc(rule.successText || '')}" placeholder="Success text" />
              <button class="use-del" title="Remove">✕</button>
            </div>
          `).join('')}
        </div>
        <button class="p3-btn" id="btn-add-use-rule" style="width:100%;margin-top:4px">+ Add Use Rule</button>

        <label style="margin-top:8px">Item Combinations</label>
        <div id="combo-list">
          ${(item.combinations || []).map((c, i) => `
            <div class="combo-row" data-idx="${i}" style="display:grid;grid-template-columns:1fr 1fr 70px auto;gap:4px;align-items:center">
              <select class="combo-with" style="flex:1">
                <option value="">-- With Item --</option>
                ${allItems.filter(it => it.id !== item.id).map(it => `<option value="${it.id}" ${c.withItemId === it.id ? 'selected' : ''}>${this._esc(it.name)}</option>`).join('')}
              </select>
              <select class="combo-result" style="flex:1">
                <option value="">-- Result --</option>
                ${allItems.map(it => `<option value="${it.id}" ${c.resultItemId === it.id ? 'selected' : ''}>${this._esc(it.name)}</option>`).join('')}
              </select>
              <label style="display:flex;align-items:center;gap:3px;font-size:10px;margin:0"><input type="checkbox" class="combo-consume" ${c.consumeBoth !== false ? 'checked' : ''} />Consume</label>
              <button class="combo-del" title="Remove">✕</button>
            </div>
          `).join('')}
        </div>
        <button class="p3-btn" id="btn-add-combo" style="width:100%;margin-top:4px">+ Add Combination</button>
      </div>
    `;
  },

  _bindEvents(container) {
    container.querySelector('#btn-export-inventory-json')?.addEventListener('click', () => {
      Utils.download(JSON.stringify(this.exportItemsJSON(), null, 2), 'anzu_inventory_items.json', 'application/json');
      Toast.show('Inventory items exported as JSON.', 'success');
    });

    container.querySelector('#btn-add-item')?.addEventListener('click', () => {
      const item = this.createItem();
      this.activeItemId = item.id;
      this.render(container);
    });

    // UI customization
    container.querySelector('#inv-ui-style')?.addEventListener('change', (e) => { State.project.inventoryUI.style = e.target.value; State.autoSave(); });
    container.querySelector('#inv-ui-slot')?.addEventListener('change', (e) => { State.project.inventoryUI.slotSize = Math.max(24, parseInt(e.target.value) || 40); State.autoSave(); });
    container.querySelector('#inv-ui-pos')?.addEventListener('change', (e) => { State.project.inventoryUI.position = e.target.value; State.autoSave(); });

    container.querySelectorAll('.inventory-item-row').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('[data-del]')) return;
        this.activeItemId = el.dataset.id;
        this.render(container);
      });

      const delBtn = el.querySelector('[data-del]');
      delBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Delete this item?')) {
          this.deleteItem(delBtn.dataset.del);
          this.render(container);
        }
      });
    });

    const item = this.activeItemId ? this.getItem(this.activeItemId) : null;
    if (item) this._bindItemEditor(container, item);
  },

  _bindItemEditor(container, item) {
    const save = () => State.autoSave();

    container.querySelector('#item-name')?.addEventListener('input', (e) => { item.name = e.target.value; save(); });
    container.querySelector('#item-icon')?.addEventListener('change', (e) => { item.icon = e.target.value; save(); this.render(container); });
    container.querySelector('#item-desc')?.addEventListener('input', (e) => { item.description = e.target.value; save(); });
    container.querySelector('#item-examine')?.addEventListener('input', (e) => { item.examineText = e.target.value; save(); });
    container.querySelector('#item-category')?.addEventListener('change', (e) => { item.category = e.target.value; save(); });
    container.querySelector('#item-stackable')?.addEventListener('change', (e) => { item.stackable = e.target.checked; save(); });
    container.querySelector('#item-max-stack')?.addEventListener('change', (e) => { item.maxStack = Math.max(1, parseInt(e.target.value) || 1); save(); });

    container.querySelectorAll('[data-uri]').forEach(row => {
      const idx = parseInt(row.dataset.uri);
      row.querySelector('.use-object')?.addEventListener('change', (e) => { item.usableOn[idx].objectName = e.target.value; save(); });
      row.querySelector('.use-consume')?.addEventListener('change', (e) => { item.usableOn[idx].consume = e.target.checked; save(); });
      row.querySelector('.use-text')?.addEventListener('change', (e) => { item.usableOn[idx].successText = e.target.value; save(); });
      row.querySelector('.use-del')?.addEventListener('click', () => { item.usableOn.splice(idx, 1); save(); this.render(container); });
    });

    container.querySelector('#btn-add-use-rule')?.addEventListener('click', () => {
      if (!item.usableOn) item.usableOn = [];
      item.usableOn.push({ objectName: '', successText: '', consume: true, setFlag: null, grantItemId: '' });
      save();
      this.render(container);
    });

    container.querySelectorAll('.combo-row[data-idx]').forEach(row => {
      const idx = parseInt(row.dataset.idx);
      row.querySelector('.combo-with')?.addEventListener('change', (e) => {
        if (item.combinations[idx]) { item.combinations[idx].withItemId = e.target.value; save(); }
      });
      row.querySelector('.combo-result')?.addEventListener('change', (e) => {
        if (item.combinations[idx]) { item.combinations[idx].resultItemId = e.target.value; save(); }
      });
      row.querySelector('.combo-consume')?.addEventListener('change', (e) => {
        if (item.combinations[idx]) { item.combinations[idx].consumeBoth = e.target.checked; save(); }
      });
      row.querySelector('.combo-del')?.addEventListener('click', () => {
        item.combinations.splice(idx, 1); save(); this.render(container);
      });
    });

    container.querySelector('#btn-add-combo')?.addEventListener('click', () => {
      if (!item.combinations) item.combinations = [];
      item.combinations.push({ withItemId: '', resultItemId: '', consumeBoth: true });
      save(); this.render(container);
    });
  },

  populateItemSelect(select, selectedValue = '') {
    this.ensure();
    select.innerHTML = '<option value="">-- Select Item --</option>';
    for (const i of State.project.inventoryItems) {
      const opt = document.createElement('option');
      opt.value = i.id;
      opt.textContent = i.name;
      select.appendChild(opt);
    }
    select.value = selectedValue;
  },

  _esc(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },
};
