/* ===== GITHUB BRIDGE MODULE ===== */
const GitHubBridge = {
  connected: false,
  owner: '',
  repo: '',
  token: '',
  currentPath: '',
  repoContents: [],
  selectedFiles: new Set(),
  allImages: [],
  syncInProgress: false,

  init() {
    // Load saved credentials
    try {
      const saved = JSON.parse(localStorage.getItem('anzu_github_creds') || '{}');
      this.owner = saved.owner || '';
      this.repo = saved.repo || '';
      this.token = saved.token || '';
    } catch(e) {}
    this._buildModal();
    this._bindEvents();
  },

  _buildModal() {
    const modal = document.createElement('div');
    modal.id = 'github-modal';
    modal.className = 'github-modal';
    modal.hidden = true;
    modal.innerHTML = `
      <div class="github-modal-content">
        <div class="github-modal-header">
          <h3>🐙 GitHub Bridge</h3>
          <button class="close-btn" id="gh-close">&times;</button>
        </div>
        <div class="gh-connect-bar">
          <input type="text" id="gh-owner" placeholder="Username" value="${this.owner}" />
          <input type="text" id="gh-repo" placeholder="Repository" value="${this.repo}" />
          <input type="password" id="gh-token" placeholder="Token (optional for public)" value="${this.token}" />
          <button class="gh-btn" id="gh-connect-btn">⚡ Connect</button>
          <span class="gh-status" id="gh-status"></span>
        </div>
        <div class="gh-progress" id="gh-progress" hidden><div class="bar" id="gh-progress-bar"></div></div>
        <div class="gh-body">
          <div class="gh-browser">
            <div class="gh-breadcrumb" id="gh-breadcrumb">
              <span data-path="">root</span>
            </div>
            <div class="gh-file-list" id="gh-file-list">
              <div class="gh-empty">Connect to a repository to browse files</div>
            </div>
          </div>
          <div class="gh-preview">
            <div class="gh-preview-toolbar">
              <button class="gh-btn-sm" id="gh-select-all">Select All Images</button>
              <button class="gh-btn-sm" id="gh-deselect-all">Deselect All</button>
              <button class="gh-btn-sm" id="gh-select-folder">Select Folder Images</button>
              <span class="spacer"></span>
              <span class="sel-count" id="gh-sel-count">0 selected</span>
              <button class="gh-btn-sm primary" id="gh-pull-selected">⬇ Pull Selected</button>
              <button class="gh-btn-sm primary" id="gh-pull-all">⬇ Pull All Images</button>
            </div>
            <div class="gh-preview-grid" id="gh-preview-grid">
              <div class="gh-empty">Select a folder to preview images</div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },

  _bindEvents() {
    document.getElementById('gh-close').addEventListener('click', () => this.hide());
    document.getElementById('gh-connect-btn').addEventListener('click', () => this.connect());
    document.getElementById('gh-select-all').addEventListener('click', () => this.selectAllImages());
    document.getElementById('gh-deselect-all').addEventListener('click', () => this.deselectAll());
    document.getElementById('gh-select-folder').addEventListener('click', () => this.selectFolderImages());
    document.getElementById('gh-pull-selected').addEventListener('click', () => this.pullSelected());
    document.getElementById('gh-pull-all').addEventListener('click', () => this.pullAllImages());
    document.getElementById('gh-breadcrumb').addEventListener('click', (e) => {
      const span = e.target.closest('span[data-path]');
      if (span) this.navigateTo(span.dataset.path);
    });
    // Close on backdrop click
    document.getElementById('github-modal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.hide();
    });
    // Keyboard
    document.getElementById('gh-token').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.connect();
    });
  },

  show() {
    document.getElementById('github-modal').hidden = false;
    if (this.connected) this.navigateTo(this.currentPath);
  },

  hide() {
    document.getElementById('github-modal').hidden = true;
  },

  saveCredentials() {
    localStorage.setItem('anzu_github_creds', JSON.stringify({
      owner: this.owner,
      repo: this.repo,
      token: this.token
    }));
  },

  async connect() {
    this.owner = document.getElementById('gh-owner').value.trim();
    this.repo = document.getElementById('gh-repo').value.trim();
    this.token = document.getElementById('gh-token').value.trim();

    if (!this.owner || !this.repo) {
      this._setStatus('Enter username and repo', 'err');
      return;
    }

    this._setStatus('Connecting...', '');
    try {
      const data = await this._apiGet(`/repos/${this.owner}/${this.repo}`);
      this.connected = true;
      this.saveCredentials();
      this._setStatus(`✓ ${data.full_name}`, 'ok');
      document.getElementById('gh-connect-btn').textContent = '✓ Connected';
      document.getElementById('gh-connect-btn').classList.add('connected');
      this.navigateTo('');
      Toast.show(`Connected to ${data.full_name}`, 'success');
    } catch(err) {
      this.connected = false;
      this._setStatus(`✗ ${err.message}`, 'err');
      Toast.show(`Failed: ${err.message}`, 'error');
    }
  },

  async navigateTo(path) {
    this.currentPath = path;
    this._updateBreadcrumb(path);
    const fileList = document.getElementById('gh-file-list');
    fileList.innerHTML = '<div class="gh-loading"><div class="spinner"></div>Loading...</div>';

    try {
      const contents = await this._apiGet(`/repos/${this.owner}/${this.repo}/contents/${path}`);
      const items = Array.isArray(contents) ? contents : [contents];
      this.repoContents = items;
      this._renderFileList(items, path);
      // Auto-show images in preview
      const images = items.filter(f => f.type === 'file' && this._isImage(f.name));
      if (images.length > 0) {
        this._renderPreviewGrid(images);
      }
    } catch(err) {
      fileList.innerHTML = `<div class="gh-empty">Error: ${err.message}</div>`;
    }
  },

  _renderFileList(items, path) {
    const fileList = document.getElementById('gh-file-list');
    fileList.innerHTML = '';

    // Sort: dirs first, then files
    const sorted = [...items].sort((a, b) => {
      if (a.type === 'dir' && b.type !== 'dir') return -1;
      if (a.type !== 'dir' && b.type === 'dir') return 1;
      return a.name.localeCompare(b.name);
    });

    // Parent directory
    if (path) {
      const parent = document.createElement('div');
      parent.className = 'gh-file-item';
      const parentPath = path.includes('/') ? path.substring(0, path.lastIndexOf('/')) : '';
      parent.innerHTML = `<span class="icon">📁</span><span class="name">..</span>`;
      parent.addEventListener('click', () => this.navigateTo(parentPath));
      fileList.appendChild(parent);
    }

    for (const item of sorted) {
      const div = document.createElement('div');
      div.className = 'gh-file-item';
      const icon = item.type === 'dir' ? '📁' :
                   this._isImage(item.name) ? '🖼' : '📄';
      const size = item.size ? this._formatSize(item.size) : '';
      div.innerHTML = `<span class="icon">${icon}</span><span class="name">${item.name}</span><span class="size">${size}</span>`;

      if (item.type === 'dir') {
        div.addEventListener('click', () => this.navigateTo(item.path));
      } else if (this._isImage(item.name)) {
        div.addEventListener('click', () => this._previewSingleFile(item));
      }
      fileList.appendChild(div);
    }
  },

  _renderPreviewGrid(images) {
    const grid = document.getElementById('gh-preview-grid');
    grid.innerHTML = '';
    for (const img of images) {
      const div = document.createElement('div');
      div.className = 'gh-preview-item' + (this.selectedFiles.has(img.path) ? ' selected' : '');
      div.dataset.path = img.path;
      div.dataset.name = img.name;
      div.dataset.sha = img.sha;
      div.dataset.downloadUrl = img.download_url || '';
      div.innerHTML = `
        <div class="gh-item-check">✓</div>
        <img src="${img.download_url}" alt="${img.name}" loading="lazy" />
        <span class="gh-item-label">${img.name}</span>
      `;
      div.addEventListener('click', (e) => {
        if (this.selectedFiles.has(img.path)) {
          this.selectedFiles.delete(img.path);
          div.classList.remove('selected');
        } else {
          this.selectedFiles.add(img.path);
          div.classList.add('selected');
        }
        this._updateSelCount();
      });
      grid.appendChild(div);
    }
    this._updateSelCount();
  },

  selectAllImages() {
    document.querySelectorAll('.gh-preview-item').forEach(el => {
      el.classList.add('selected');
      this.selectedFiles.add(el.dataset.path);
    });
    this._updateSelCount();
  },

  deselectAll() {
    this.selectedFiles.clear();
    document.querySelectorAll('.gh-preview-item').forEach(el => el.classList.remove('selected'));
    this._updateSelCount();
  },

  selectFolderImages() {
    document.querySelectorAll('.gh-preview-item').forEach(el => {
      el.classList.add('selected');
      this.selectedFiles.add(el.dataset.path);
    });
    this._updateSelCount();
  },

  _updateSelCount() {
    document.getElementById('gh-sel-count').textContent = `${this.selectedFiles.size} selected`;
  },

  async pullSelected() {
    if (this.selectedFiles.size === 0) {
      Toast.show('No files selected', 'info');
      return;
    }
    await this._pullFiles(Array.from(this.selectedFiles));
  },

  async pullAllImages() {
    Toast.show('Scanning repository for all images...', 'info');
    this._showProgress(true);
    try {
      const allImages = await this._scanAllImages('');
      if (allImages.length === 0) {
        Toast.show('No images found in repository', 'info');
        this._showProgress(false);
        return;
      }
      Toast.show(`Found ${allImages.length} images. Pulling...`, 'info');
      await this._pullFiles(allImages.map(f => f.path), allImages);
    } catch(err) {
      Toast.show(`Scan failed: ${err.message}`, 'error');
    }
    this._showProgress(false);
  },

  async _scanAllImages(path) {
    let results = [];
    try {
      const contents = await this._apiGet(`/repos/${this.owner}/${this.repo}/contents/${path}`);
      const items = Array.isArray(contents) ? contents : [contents];
      for (const item of items) {
        if (item.type === 'dir') {
          const sub = await this._scanAllImages(item.path);
          results = results.concat(sub);
        } else if (this._isImage(item.name)) {
          results.push(item);
        }
      }
    } catch(e) {}
    return results;
  },

  async _pullFiles(paths, fileInfos) {
    this._showProgress(true);
    const total = paths.length;
    let done = 0;
    let failed = 0;

    for (const path of paths) {
      try {
        const info = fileInfos ? fileInfos.find(f => f.path === path) : null;
        const url = info?.download_url || `https://lh4.googleusercontent.com/pmnJq0W-odK3qaoFydvC2a9QZcFvVsldrS51-BCJsNj4PL1a0N24RDN6eK1dLV7Mu5esuR54PQ=s640-h400-e365-rw`;
        const name = path.split('/').pop().replace(/\.[^.]+$/, '');
        const ext = path.split('.').pop().toLowerCase();

        // Download image
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const blob = await resp.blob();
        const dataURL = await this._blobToDataURL(blob);
        const img = await Utils.loadImage(dataURL);

        // Check for duplicate
        const exists = State.project.assets.find(a => a.name === name);
        if (!exists) {
          const asset = {
            id: Utils.uid(),
            name: name,
            dataURL: dataURL,
            width: img.naturalWidth,
            height: img.naturalHeight,
            // Phase 2 metadata
            sourceRepo: `${this.owner}/${this.repo}`,
            sourcePath: path,
            category: this._guessCategory(path),
            tags: [],
            vibeDescription: '',
            lore: '',
            needsAttention: false,
            aiAnalyzed: false,
          };
          State.project.assets.push(asset);
        }
      } catch(err) {
        console.warn(`Failed to pull: ${path}`, err);
        failed++;
      }
      done++;
      this._setProgress((done / total) * 100);
    }

    this._showProgress(false);
    Assets.render();
    AssetManager.render();
    State.autoSave();
    Toast.show(`Pulled ${done - failed}/${total} images${failed ? ` (${failed} failed)` : ''}`, failed ? 'info' : 'success');
  },

  async pushOrganized() {
    if (!this.connected || !this.token) {
      Toast.show('Need a token to push to GitHub', 'error');
      return;
    }
    // This creates a new branch and commits organized assets
    Toast.show('Push functionality: organize assets into folders and commit', 'info');
    // Future: implement actual push via GitHub API
  },

  // --- API helpers ---
  async _apiGet(endpoint) {
    const headers = { 'Accept': 'application/vnd.github.v3+json' };
    if (this.token) headers['Authorization'] = `token ${this.token}`;
    const resp = await fetch(`https://api.github.com${endpoint}`, { headers });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${resp.status}`);
    }
    return resp.json();
  },

  _blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  },

  _isImage(name) {
    return /\.(png|jpg|jpeg|gif|webp|svg|bmp|ico)$/i.test(name);
  },

  _guessCategory(path) {
    const p = path.toLowerCase();
    if (p.includes('background') || p.includes('bg_') || p.includes('/bg/')) return 'Background';
    if (p.includes('sprite') || p.includes('character') || p.includes('npc')) return 'Sprite';
    if (p.includes('icon') || p.includes('ui_') || p.includes('/ui/')) return 'UI';
    if (p.includes('inventory') || p.includes('item')) return 'Inventory';
    if (p.includes('tileset') || p.includes('tile')) return 'Tileset';
    return 'Unsorted';
  },

  _formatSize(bytes) {
    if (bytes < 1024) return bytes + 'B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + 'KB';
    return (bytes / 1048576).toFixed(1) + 'MB';
  },

  _updateBreadcrumb(path) {
    const bc = document.getElementById('gh-breadcrumb');
    bc.innerHTML = '<span data-path="">root</span>';
    if (path) {
      const parts = path.split('/');
      let accum = '';
      for (const part of parts) {
        accum += (accum ? '/' : '') + part;
        bc.innerHTML += `<span class="sep">›</span><span data-path="${accum}">${part}</span>`;
      }
    }
  },

  _setStatus(text, cls) {
    const el = document.getElementById('gh-status');
    el.textContent = text;
    el.className = 'gh-status' + (cls ? ' ' + cls : '');
  },

  _showProgress(show) {
    document.getElementById('gh-progress').hidden = !show;
    if (!show) this._setProgress(0);
  },

  _setProgress(pct) {
    document.getElementById('gh-progress-bar').style.width = pct + '%';
  },

  _previewSingleFile(item) {
    // Show single file in preview with metadata
    const grid = document.getElementById('gh-preview-grid');
    grid.innerHTML = '';
    const div = document.createElement('div');
    div.className = 'gh-preview-item gh-preview-item-single' + (this.selectedFiles.has(item.path) ? ' selected' : '');
    div.dataset.path = item.path;
    div.dataset.name = item.name;
    div.innerHTML = `
      <div class="gh-item-check">✓</div>
      <img src="${item.download_url}" alt="${item.name}" />
      <span class="gh-item-label">${item.name} (${this._formatSize(item.size)})</span>
    `;
    div.addEventListener('click', () => {
      if (this.selectedFiles.has(item.path)) {
        this.selectedFiles.delete(item.path);
        div.classList.remove('selected');
      } else {
        this.selectedFiles.add(item.path);
        div.classList.add('selected');
      }
      this._updateSelCount();
    });
    grid.appendChild(div);
  }
};
