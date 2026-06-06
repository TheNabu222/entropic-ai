/* ===== ADVANCED ASSET MANAGER ===== */
const AssetManager = {
  activeTab: 'organize',
  activeCategory: null,
  selectedAssets: new Set(),
  activeTags: new Set(),
  searchQuery: '',
  metadataAssetId: null,

  CATEGORIES: [
    { id: 'Background', icon: '🏔', label: 'Background' },
    { id: 'Sprite', icon: '🧍', label: 'Sprite' },
    { id: 'UI', icon: '🖼', label: 'UI' },
    { id: 'Icon', icon: '⭐', label: 'Icon' },
    { id: 'Inventory', icon: '🎒', label: 'Inventory' },
    { id: 'Tileset', icon: '🧱', label: 'Tileset' },
    { id: 'Effect', icon: '✨', label: 'Effect' },
    { id: 'Unsorted', icon: '📦', label: 'Unsorted' },
  ],

  init() {
    // Ensure all assets have Phase 2 properties
    this._ensureAssetMeta();
  },

  _ensureAssetMeta() {
    for (const a of State.project.assets) {
      if (!a.category) a.category = 'Unsorted';
      if (!a.tags) a.tags = [];
      if (!a.vibeDescription) a.vibeDescription = '';
      if (!a.lore) a.lore = '';
      if (a.needsAttention === undefined) a.needsAttention = false;
      if (!a.colorPalette) a.colorPalette = [];
      if (!a.aiAnalyzed) a.aiAnalyzed = false;
    }
  },

  render() {
    this._ensureAssetMeta();
    const container = document.getElementById('am-content');
    if (!container) return;

    switch (this.activeTab) {
      case 'organize': this._renderOrganize(container); break;
      case 'metadata': this._renderMetadata(container); break;
      case 'tools': this._renderTools(container); break;
      case 'search': this._renderSearch(container); break;
    }
  },

  setTab(tab) {
    this.activeTab = tab;
    document.querySelectorAll('.am-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tab);
    });
    document.querySelectorAll('.am-tab-content').forEach(c => {
      c.classList.toggle('active', c.dataset.tab === tab);
    });
    this.render();
  },

  // === ORGANIZE TAB ===
  _renderOrganize(container) {
    const el = document.getElementById('am-organize');
    if (!el) return;

    let html = '';

    // Category bins
    html += '<div class="am-section"><h4>📂 Categories</h4>';
    html += '<div class="category-bins">';
    for (const cat of this.CATEGORIES) {
      const count = State.project.assets.filter(a => a.category === cat.id).length;
      const active = this.activeCategory === cat.id ? ' active' : '';
      html += `<div class="cat-bin${active}" data-category="${cat.id}" 
        ondragover="event.preventDefault();this.classList.add('drag-over')" 
        ondragleave="this.classList.remove('drag-over')"
        ondrop="AssetManager.dropOnCategory(event,'${cat.id}');this.classList.remove('drag-over')">
        <span class="bin-icon">${cat.icon}</span>
        <span class="bin-label">${cat.label}</span>
        <span class="bin-count">${count}</span>
      </div>`;
    }
    html += '</div></div>';

    // Batch selection bar
    if (this.selectedAssets.size > 0) {
      html += `<div class="batch-bar">
        <span class="batch-count">${this.selectedAssets.size} selected</span>
        <div class="batch-actions">
          <button class="small-btn" onclick="AssetManager.batchSetCategory()">Set Category</button>
          <button class="small-btn" onclick="AssetManager.batchAddTag()">Add Tag</button>
          <button class="small-btn" onclick="AssetManager.batchDelete()">Delete</button>
          <button class="small-btn" onclick="AssetManager.clearSelection()">✕</button>
        </div>
      </div>`;
    }

    // Tags filter
    const allTags = this._getAllTags();
    if (allTags.length > 0) {
      html += '<div class="am-section"><h4>🏷 Tags</h4>';
      html += '<div class="tag-container">';
      for (const tag of allTags.slice(0, 20)) {
        const active = this.activeTags.has(tag) ? ' active' : '';
        html += `<span class="tag-pill${active}" onclick="AssetManager.toggleTagFilter('${tag.replace(/'/g, "\\'")}')">${tag}</span>`;
      }
      html += '</div></div>';
    }

    // Filtered asset grid
    const filtered = this._getFilteredAssets();
    html += '<div class="am-section"><h4>Assets (' + filtered.length + ')</h4>';
    html += '<div class="asset-gallery" style="max-height:none">';
    for (const asset of filtered) {
      const sel = this.selectedAssets.has(asset.id) ? ' selected' : '';
      const needsAtt = asset.needsAttention ? '<span class="duplicate-badge">!</span>' : '';
      html += `<div class="asset-thumb${sel}" draggable="true" data-asset-id="${asset.id}"
        onclick="AssetManager.toggleSelect('${asset.id}', event)"
        ondragstart="event.dataTransfer.setData('text/plain','${asset.id}')"
        ondblclick="AssetManager.openMetadata('${asset.id}')"
        title="${asset.name}\n${asset.category || 'Unsorted'}\n${(asset.tags||[]).join(', ')}">
        <img src="${asset.dataURL}" alt="${asset.name}" loading="lazy" />
        <span class="asset-label">${asset.name}</span>
        ${needsAtt}
      </div>`;
    }
    if (filtered.length === 0) {
      html += '<div class="empty-state" style="grid-column:1/-1"><p>No assets match filters</p></div>';
    }
    html += '</div></div>';

    el.innerHTML = html;

    // Bind category bin clicks
    el.querySelectorAll('.cat-bin').forEach(bin => {
      bin.addEventListener('click', () => {
        const cat = bin.dataset.category;
        this.activeCategory = this.activeCategory === cat ? null : cat;
        this.render();
      });
    });
  },

  // === METADATA TAB ===
  _renderMetadata(container) {
    const el = document.getElementById('am-metadata');
    if (!el) return;

    if (!this.metadataAssetId) {
      // Show list of assets to pick from, or use first selected
      if (this.selectedAssets.size > 0) {
        this.metadataAssetId = this.selectedAssets.values().next().value;
      } else {
        el.innerHTML = '<div class="empty-state"><p>Double-click an asset or select one to view metadata</p></div>';
        return;
      }
    }

    const asset = State.project.assets.find(a => a.id === this.metadataAssetId);
    if (!asset) {
      el.innerHTML = '<div class="empty-state"><p>Asset not found</p></div>';
      return;
    }

    const usage = AssetTools.getAssetUsage(asset.id);
    const palette = asset.colorPalette || [];

    let html = '<div class="metadata-panel">';
    html += `<h4>📋 ${asset.name} <span style="font-weight:400;font-size:10px;color:var(--text-muted)">${asset.width}×${asset.height}</span></h4>`;

    // Preview
    html += `<div class="metadata-preview"><img src="${asset.dataURL}" alt="${asset.name}" /></div>`;

    // Palette
    if (palette.length > 0) {
      html += '<div class="metadata-row"><span class="meta-label">Palette</span><div class="palette-row" style="flex:1">';
      for (const c of palette) {
        html += `<div class="palette-swatch" style="background:${c}" data-color="${c}" title="${c}"></div>`;
      }
      html += '</div></div>';
    }

    // Vibe
    html += `<div class="metadata-row">
      <span class="meta-label">Vibe</span>
      <span class="meta-value">${asset.vibeDescription || '<i style="color:var(--text-muted)">Not analyzed yet</i>'}</span>
    </div>`;

    // Category
    html += `<div class="metadata-row"><span class="meta-label">Category</span>
      <select id="meta-category" onchange="AssetManager.setAssetCategory('${asset.id}', this.value)">`;
    for (const cat of this.CATEGORIES) {
      html += `<option value="${cat.id}" ${asset.category === cat.id ? 'selected' : ''}>${cat.icon} ${cat.label}</option>`;
    }
    html += '</select></div>';

    // Tags
    html += '<div class="metadata-row"><span class="meta-label">Tags</span><div style="flex:1">';
    html += '<div class="tag-container">';
    for (const tag of (asset.tags || [])) {
      html += `<span class="tag-pill">${tag}<span class="tag-remove" onclick="AssetManager.removeTag('${asset.id}','${tag.replace(/'/g, "\\'")}')">&times;</span></span>`;
    }
    html += '</div>';
    html += `<div class="tag-input-row" style="margin-top:4px">
      <input type="text" id="meta-tag-input" placeholder="Add tag..." onkeydown="if(event.key==='Enter')AssetManager.addTagFromInput('${asset.id}')" />
    </div></div></div>`;

    // Lore
    html += `<div class="metadata-row"><span class="meta-label">Lore</span>
      <textarea id="meta-lore" placeholder="Narrative context for this asset..." onchange="AssetManager.setLore('${asset.id}', this.value)">${asset.lore || ''}</textarea>
    </div>`;

    // Needs attention flag
    html += `<div class="metadata-row"><span class="meta-label">Status</span>
      <span class="flag-badge ${asset.needsAttention ? '' : 'ok'}" onclick="AssetManager.toggleAttention('${asset.id}')">
        ${asset.needsAttention ? '⚠ Needs Attention' : '✓ OK'}
      </span>
    </div>`;

    // Source info
    if (asset.sourcePath) {
      html += `<div class="metadata-row"><span class="meta-label">Source</span>
        <span class="meta-value" style="font-size:10px">${asset.sourceRepo || ''} / ${asset.sourcePath || ''}</span>
      </div>`;
    }

    // Usage tracker
    html += '<div class="metadata-row"><span class="meta-label">Used in</span><div style="flex:1">';
    if (usage.length > 0) {
      html += '<div class="usage-list">';
      for (const u of usage) {
        html += `<div class="usage-item" onclick="Scenes.switchTo('${u.scene.id}')">${u.scene.name} (×${u.count})</div>`;
      }
      html += '</div>';
    } else {
      html += '<span style="font-size:10px;color:var(--text-muted)">Not used in any scene</span>';
    }
    html += '</div></div>';

    // AI Suggested Name
    if (asset.suggestedName) {
      html += `<div class="metadata-row"><span class="meta-label">AI Name</span>
        <span class="meta-value">${asset.suggestedName}</span>
        <button class="small-btn" onclick="AssetManager.applyAIName('${asset.id}')" style="font-size:10px">Apply</button>
      </div>`;
    }

    html += '</div>';

    // Navigation buttons
    const assets = State.project.assets;
    const idx = assets.findIndex(a => a.id === asset.id);
    html += '<div style="display:flex;gap:4px;justify-content:center;margin-top:4px">';
    if (idx > 0) html += `<button class="small-btn" onclick="AssetManager.openMetadata('${assets[idx-1].id}')">← Prev</button>`;
    html += `<span style="font-size:10px;color:var(--text-muted);padding:4px">${idx+1} / ${assets.length}</span>`;
    if (idx < assets.length - 1) html += `<button class="small-btn" onclick="AssetManager.openMetadata('${assets[idx+1].id}')">Next →</button>`;
    html += '</div>';

    el.innerHTML = html;
  },

  // === TOOLS TAB ===
  _renderTools(container) {
    const el = document.getElementById('am-tools');
    if (!el) return;

    const selCount = this.selectedAssets.size;
    const allCount = State.project.assets.length;
    const targetLabel = selCount > 0 ? `${selCount} selected` : `all ${allCount}`;

    let html = '';

    // AI Analysis
    html += '<div class="am-section"><h4>🤖 AI Analysis</h4>';
    html += '<div id="ai-status" class="ai-status-bar"><span>Ready to analyze</span></div>';
    html += '<div style="display:flex;gap:4px;margin-top:4px">';
    html += `<button class="small-btn" onclick="AIAnalysis.bulkAnalyze(false)">🔍 Local Analysis (${targetLabel})</button>`;
    html += `<button class="small-btn" onclick="AIAnalysis.bulkAnalyze(true)">🧠 AI Analysis (${targetLabel})</button>`;
    html += '<button class="small-btn" onclick="AIAnalysis.cancelAnalysis()">✕ Cancel</button>';
    html += '</div>';
    html += '<div class="am-row" style="margin-top:4px"><label>API Key</label>';
    html += `<input type="password" id="ai-api-key" placeholder="Abacus.AI key (optional)" value="${AIAnalysis.apiKey || ''}" 
      onchange="AIAnalysis.setApiKey(this.value)" /></div>`;
    html += '</div>';

    // Smart Rename
    html += '<div class="am-section"><h4>✏️ Smart Rename</h4>';
    html += `<button class="small-btn" onclick="AssetManager.previewRenames()">Preview Renames (${targetLabel})</button>`;
    html += '<div id="rename-preview"></div>';
    html += '</div>';

    // Optimization Tools
    html += '<div class="am-section"><h4>⚡ Optimization</h4>';
    html += '<div class="tools-grid">';
    html += `<button class="tool-btn" onclick="AssetManager.runTool('webp')"><span class="tool-icon">🔄</span>PNG→WebP</button>`;
    html += `<button class="tool-btn" onclick="AssetManager.runTool('trim')"><span class="tool-icon">✂️</span>Trim Margins</button>`;
    html += `<button class="tool-btn" onclick="AssetManager.runTool('icons64')"><span class="tool-icon">📐</span>Icons→64px</button>`;
    html += `<button class="tool-btn" onclick="AssetManager.runTool('icons128')"><span class="tool-icon">📐</span>Icons→128px</button>`;
    html += `<button class="tool-btn" onclick="AssetManager.runTool('dupes')"><span class="tool-icon">🔎</span>Find Dupes</button>`;
    html += `<button class="tool-btn" onclick="AssetManager.runTool('placeholder')"><span class="tool-icon">⬜</span>Placeholder</button>`;
    html += '</div></div>';

    // Sprite Slicer
    html += '<div class="am-section"><h4>🔪 Sprite Sheet Slicer</h4>';
    html += '<div class="am-row"><label>Cols</label><input type="number" id="slicer-cols" value="4" min="1" max="32" />';
    html += '<label>Rows</label><input type="number" id="slicer-rows" value="4" min="1" max="32" /></div>';
    html += `<button class="small-btn" onclick="AssetManager.runSlicer()" ${selCount !== 1 ? 'disabled title="Select exactly 1 asset"' : ''}>Slice Selected Sheet</button>`;
    html += '<div id="slicer-preview"></div>';
    html += '</div>';

    // Custom Resize
    html += '<div class="am-section"><h4>📏 Custom Resize</h4>';
    html += '<div class="am-row"><label>W</label><input type="number" id="resize-w" value="256" min="1" />';
    html += '<label>H</label><input type="number" id="resize-h" value="256" min="1" /></div>';
    html += '<div class="am-row"><label></label><input type="checkbox" id="resize-aspect" checked /> <span style="font-size:10px">Maintain aspect ratio</span></div>';
    html += `<button class="small-btn" onclick="AssetManager.runResize()">Resize (${targetLabel})</button>`;
    html += '</div>';

    // Export
    html += '<div class="am-section"><h4>📄 Export</h4>';
    html += '<div class="tools-grid">';
    html += `<button class="tool-btn" onclick="AssetManager.exportManifest()"><span class="tool-icon">📋</span>Markdown Manifest</button>`;
    html += `<button class="tool-btn" onclick="AssetManager.exportCatalog()"><span class="tool-icon">📚</span>Asset Catalog</button>`;
    html += `<button class="tool-btn" onclick="AssetManager.shuffleAssets()"><span class="tool-icon">🎲</span>Shuffle / Discover</button>`;
    html += '</div></div>';

    el.innerHTML = html;
  },

  // === SEARCH TAB ===
  _renderSearch(container) {
    const el = document.getElementById('am-search');
    if (!el) return;

    let html = '<div class="am-section">';
    html += '<h4>🔍 Visual Search</h4>';
    html += `<div class="visual-search-bar">
      <input type="text" id="am-search-input" placeholder="Describe what you're looking for (e.g. 'blue glow', 'cave background')..." 
        value="${this.searchQuery}" onkeydown="if(event.key==='Enter')AssetManager.doVisualSearch()" />
      <button onclick="AssetManager.doVisualSearch()">Search</button>
    </div></div>`;

    // Results
    const results = this.searchQuery ?
      AIAnalysis.visualSearch(this.searchQuery, State.project.assets) :
      State.project.assets;

    html += `<div class="am-section"><h4>Results (${results.length})</h4>`;
    html += '<div class="asset-gallery" style="max-height:none">';
    for (const asset of results) {
      html += `<div class="asset-thumb" draggable="true" data-asset-id="${asset.id}"
        ondragstart="event.dataTransfer.setData('text/plain','${asset.id}')"
        ondblclick="AssetManager.openMetadata('${asset.id}')"
        title="${asset.name}\n${asset.vibeDescription || ''}">
        <img src="${asset.dataURL}" alt="${asset.name}" loading="lazy" />
        <span class="asset-label">${asset.name}</span>
      </div>`;
    }
    if (results.length === 0) {
      html += '<div class="empty-state" style="grid-column:1/-1"><p>No results found</p></div>';
    }
    html += '</div></div>';

    el.innerHTML = html;
  },

  // === Actions ===
  toggleSelect(assetId, event) {
    if (event && event.shiftKey) {
      // Multi-select
      if (this.selectedAssets.has(assetId)) {
        this.selectedAssets.delete(assetId);
      } else {
        this.selectedAssets.add(assetId);
      }
    } else if (event && event.ctrlKey) {
      if (this.selectedAssets.has(assetId)) {
        this.selectedAssets.delete(assetId);
      } else {
        this.selectedAssets.add(assetId);
      }
    } else {
      if (this.selectedAssets.has(assetId) && this.selectedAssets.size === 1) {
        this.selectedAssets.clear();
      } else {
        this.selectedAssets.clear();
        this.selectedAssets.add(assetId);
      }
    }
    this.render();
  },

  clearSelection() {
    this.selectedAssets.clear();
    this.render();
  },

  openMetadata(assetId) {
    this.metadataAssetId = assetId;
    this.setTab('metadata');
  },

  dropOnCategory(event, category) {
    event.preventDefault();
    const assetId = event.dataTransfer.getData('text/plain');
    if (assetId) {
      this.setAssetCategory(assetId, category);
    }
    // Also move all selected
    for (const id of this.selectedAssets) {
      this.setAssetCategory(id, category);
    }
  },

  setAssetCategory(assetId, category) {
    const asset = State.project.assets.find(a => a.id === assetId);
    if (asset) {
      asset.category = category;
      State.autoSave();
      this.render();
    }
  },

  setLore(assetId, lore) {
    const asset = State.project.assets.find(a => a.id === assetId);
    if (asset) {
      asset.lore = lore;
      State.autoSave();
    }
  },

  toggleAttention(assetId) {
    const asset = State.project.assets.find(a => a.id === assetId);
    if (asset) {
      asset.needsAttention = !asset.needsAttention;
      State.autoSave();
      this.render();
    }
  },

  addTagFromInput(assetId) {
    const input = document.getElementById('meta-tag-input');
    if (!input || !input.value.trim()) return;
    const tag = input.value.trim();
    const asset = State.project.assets.find(a => a.id === assetId);
    if (asset) {
      if (!asset.tags) asset.tags = [];
      if (!asset.tags.includes(tag)) {
        asset.tags.push(tag);
        State.autoSave();
        this.render();
      }
    }
  },

  removeTag(assetId, tag) {
    const asset = State.project.assets.find(a => a.id === assetId);
    if (asset && asset.tags) {
      asset.tags = asset.tags.filter(t => t !== tag);
      State.autoSave();
      this.render();
    }
  },

  toggleTagFilter(tag) {
    if (this.activeTags.has(tag)) {
      this.activeTags.delete(tag);
    } else {
      this.activeTags.add(tag);
    }
    this.render();
  },

  applyAIName(assetId) {
    const asset = State.project.assets.find(a => a.id === assetId);
    if (asset && asset.suggestedName) {
      asset.name = asset.suggestedName;
      Assets.render();
      State.autoSave();
      this.render();
    }
  },

  // Batch operations
  batchSetCategory() {
    const cat = prompt('Enter category: Background, Sprite, UI, Icon, Inventory, Tileset, Effect, Unsorted');
    if (!cat) return;
    for (const id of this.selectedAssets) {
      this.setAssetCategory(id, cat);
    }
    Toast.show(`Set ${this.selectedAssets.size} assets to ${cat}`, 'success');
  },

  batchAddTag() {
    const tag = prompt('Enter tag to add:');
    if (!tag) return;
    for (const id of this.selectedAssets) {
      const asset = State.project.assets.find(a => a.id === id);
      if (asset) {
        if (!asset.tags) asset.tags = [];
        if (!asset.tags.includes(tag)) asset.tags.push(tag);
      }
    }
    State.autoSave();
    this.render();
    Toast.show(`Added tag "${tag}" to ${this.selectedAssets.size} assets`, 'success');
  },

  batchDelete() {
    if (!confirm(`Delete ${this.selectedAssets.size} assets?`)) return;
    for (const id of this.selectedAssets) {
      const idx = State.project.assets.findIndex(a => a.id === id);
      if (idx !== -1) State.project.assets.splice(idx, 1);
    }
    this.selectedAssets.clear();
    Assets.render();
    State.autoSave();
    this.render();
    Toast.show('Assets deleted', 'success');
  },

  // Tools
  async runTool(tool) {
    const targets = this._getTargetAssets();
    if (targets.length === 0) {
      Toast.show('No assets to process', 'info');
      return;
    }

    switch (tool) {
      case 'webp': {
        Toast.show(`Converting ${targets.length} assets to WebP...`, 'info');
        const count = await AssetTools.batchConvertWebP(targets);
        Assets.render();
        State.autoSave();
        Toast.show(`Converted ${count} assets to WebP`, 'success');
        break;
      }
      case 'trim': {
        Toast.show(`Trimming ${targets.length} assets...`, 'info');
        for (const a of targets) await AssetTools.trimTransparent(a);
        Assets.render();
        State.autoSave();
        Toast.show(`Trimmed ${targets.length} assets`, 'success');
        break;
      }
      case 'icons64': {
        const count = await AssetTools.forceIconSize(targets, 64);
        Assets.render();
        State.autoSave();
        Toast.show(`Resized ${count} icons to 64px`, 'success');
        break;
      }
      case 'icons128': {
        const count = await AssetTools.forceIconSize(targets, 128);
        Assets.render();
        State.autoSave();
        Toast.show(`Resized ${count} icons to 128px`, 'success');
        break;
      }
      case 'dupes': {
        const dupes = AssetTools.findDuplicates(State.project.assets);
        if (dupes.length === 0) {
          Toast.show('No duplicates found!', 'success');
        } else {
          Toast.show(`Found ${dupes.length} potential duplicates`, 'info');
          // Mark duplicates
          for (const d of dupes) {
            d.duplicate.needsAttention = true;
            if (!d.duplicate.tags) d.duplicate.tags = [];
            if (!d.duplicate.tags.includes('#duplicate')) d.duplicate.tags.push('#duplicate');
          }
          this.render();
        }
        break;
      }
      case 'placeholder': {
        const label = prompt('Placeholder label:', 'Placeholder');
        if (!label) return;
        const w = parseInt(prompt('Width:', '128')) || 128;
        const h = parseInt(prompt('Height:', '128')) || 128;
        const ph = AssetTools.generatePlaceholder(label, w, h);
        State.project.assets.push(ph);
        Assets.render();
        State.autoSave();
        this.render();
        Toast.show('Placeholder created', 'success');
        break;
      }
    }
  },

  async runSlicer() {
    if (this.selectedAssets.size !== 1) {
      Toast.show('Select exactly 1 sprite sheet', 'info');
      return;
    }
    const assetId = this.selectedAssets.values().next().value;
    const asset = State.project.assets.find(a => a.id === assetId);
    if (!asset) return;

    const cols = parseInt(document.getElementById('slicer-cols')?.value) || 4;
    const rows = parseInt(document.getElementById('slicer-rows')?.value) || 4;

    Toast.show(`Slicing into ${cols}×${rows} frames...`, 'info');
    const frames = await AssetTools.sliceSpriteSheet(asset, cols, rows);

    for (const frame of frames) {
      State.project.assets.push(frame);
    }

    Assets.render();
    State.autoSave();
    this.render();
    Toast.show(`Created ${frames.length} frames`, 'success');
  },

  async runResize() {
    const targets = this._getTargetAssets();
    const w = parseInt(document.getElementById('resize-w')?.value) || 256;
    const h = parseInt(document.getElementById('resize-h')?.value) || 256;
    const aspect = document.getElementById('resize-aspect')?.checked ?? true;

    for (const a of targets) {
      await AssetTools.resize(a, w, h, aspect);
    }
    Assets.render();
    State.autoSave();
    Toast.show(`Resized ${targets.length} assets`, 'success');
  },

  previewRenames() {
    const targets = this._getTargetAssets();
    const renames = AssetTools.generateRenames(targets);
    const preview = document.getElementById('rename-preview');
    if (!preview) return;

    let html = '<div class="rename-preview-list">';
    for (const r of renames.slice(0, 30)) {
      html += `<div class="rename-row">
        <span class="old-name">${r.oldName}</span>
        <span class="arrow">→</span>
        <span class="new-name">${r.newName}</span>
      </div>`;
    }
    if (renames.length > 30) {
      html += `<div style="text-align:center;color:var(--text-muted);font-size:10px">...and ${renames.length - 30} more</div>`;
    }
    html += '</div>';
    html += `<button class="small-btn" style="margin-top:4px" onclick="AssetManager._applyRenames()">Apply All Renames</button>`;
    preview.innerHTML = html;

    // Store for later application
    this._pendingRenames = renames;
  },

  _applyRenames() {
    if (this._pendingRenames) {
      AssetTools.applyRenames(this._pendingRenames);
      this._pendingRenames = null;
      Toast.show('Renames applied', 'success');
      this.render();
    }
  },

  doVisualSearch() {
    const input = document.getElementById('am-search-input');
    this.searchQuery = input?.value || '';
    this.render();
  },

  shuffleAssets() {
    // Shuffle and show random assets
    const assets = [...State.project.assets];
    for (let i = assets.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [assets[i], assets[j]] = [assets[j], assets[i]];
    }
    const random = assets.slice(0, 12);
    Toast.show(`Showing ${random.length} random assets – check the organize tab`, 'info');
    // Highlight them
    this.selectedAssets.clear();
    for (const a of random) this.selectedAssets.add(a.id);
    this.setTab('organize');
  },

  exportManifest() {
    const md = AssetTools.generateManifest(State.project.assets);
    Utils.download(md, 'asset-manifest.md', 'text/markdown');
    Toast.show('Manifest exported', 'success');
  },

  exportCatalog() {
    // Generate a simple HTML catalog
    let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Asset Catalog</title>
      <style>body{background:#1a1d28;color:#e8e8ec;font-family:system-ui;padding:20px}
      .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
      .card{background:#252836;border-radius:8px;padding:10px;text-align:center}
      .card img{max-width:100%;height:100px;object-fit:contain;image-rendering:pixelated}
      .card h4{font-size:12px;margin:6px 0 2px}
      .card p{font-size:10px;color:#9b9db0;margin:0}
      h2{color:#d4a843}h3{color:#7c5cfc}</style></head><body>
      <h1>🎮 Asset Catalog</h1><p>${State.project.assets.length} assets</p>`;

    const categories = {};
    for (const a of State.project.assets) {
      const cat = a.category || 'Unsorted';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(a);
    }

    for (const [cat, items] of Object.entries(categories).sort()) {
      html += `<h2>${cat} (${items.length})</h2><div class="grid">`;
      for (const item of items) {
        html += `<div class="card"><img src="${item.dataURL}" /><h4>${item.name}</h4>
          <p>${item.width}×${item.height}</p>
          <p>${(item.tags || []).join(', ')}</p></div>`;
      }
      html += '</div>';
    }

    html += '</body></html>';
    Utils.download(html, 'asset-catalog.html', 'text/html');
    Toast.show('Catalog exported', 'success');
  },

  updateAIStatus(state, message) {
    const el = document.getElementById('ai-status');
    if (!el) return;
    el.className = 'ai-status-bar' + (state === 'done' ? ' done' : '');
    el.innerHTML = (state === 'analyzing' ? '<div class="pulse"></div>' : '') + `<span>${message}</span>`;
  },

  // --- Helpers ---
  _getFilteredAssets() {
    let assets = State.project.assets;

    // Category filter
    if (this.activeCategory) {
      assets = assets.filter(a => (a.category || 'Unsorted') === this.activeCategory);
    }

    // Tag filter
    if (this.activeTags.size > 0) {
      assets = assets.filter(a =>
        [...this.activeTags].every(tag => (a.tags || []).includes(tag))
      );
    }

    return assets;
  },

  _getTargetAssets() {
    if (this.selectedAssets.size > 0) {
      return State.project.assets.filter(a => this.selectedAssets.has(a.id));
    }
    return [...State.project.assets];
  },

  _getAllTags() {
    const tagSet = new Set();
    for (const a of State.project.assets) {
      for (const t of (a.tags || [])) tagSet.add(t);
    }
    return [...tagSet].sort();
  }
};
