/* ===== ASSET MANAGER ===== */
const Assets = {
  gallery: null,
  searchInput: null,
  uploadInput: null,

  init() {
    this.gallery = document.getElementById('asset-gallery');
    this.searchInput = document.getElementById('asset-search');
    this.uploadInput = document.getElementById('asset-upload');

    this.uploadInput.addEventListener('change', (e) => this.handleUpload(e));
    this.searchInput.addEventListener('input', Utils.debounce(() => this.render(), 200));

    // Drag from asset gallery
    this.gallery.addEventListener('dragstart', (e) => {
      const thumb = e.target.closest('.asset-thumb');
      if (!thumb) return;
      e.dataTransfer.setData('text/plain', thumb.dataset.assetId);
      e.dataTransfer.effectAllowed = 'copy';
    });
  },

  async handleUpload(e) {
    const files = Array.from(e.target.files);
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      try {
        const dataURL = await Utils.fileToDataURL(file);
        const img = await Utils.loadImage(dataURL);
        const asset = {
          id: Utils.uid(),
          name: file.name.replace(/\.[^.]+$/, ''),
          dataURL,
          width: img.naturalWidth,
          height: img.naturalHeight,
        };
        State.project.assets.push(asset);
      } catch (err) {
        console.warn('Failed to load asset:', file.name, err);
      }
    }
    this.uploadInput.value = '';
    this.render();
    State.autoSave();
  },

  addAssetFromDataURL(name, dataURL, width, height) {
    const asset = {
      id: Utils.uid(),
      name,
      dataURL,
      width,
      height,
    };
    State.project.assets.push(asset);
    this.render();
    return asset;
  },

  deleteAsset(id) {
    const idx = State.project.assets.findIndex(a => a.id === id);
    if (idx !== -1) {
      State.project.assets.splice(idx, 1);
      this.render();
      State.autoSave();
    }
  },

  render() {
    const query = (this.searchInput?.value || '').toLowerCase();
    const filtered = State.project.assets.filter(a =>
      !query || a.name.toLowerCase().includes(query)
    );

    this.gallery.innerHTML = '';

    if (filtered.length === 0) {
      this.gallery.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
        <p>${State.project.assets.length ? 'No matches' : 'Upload images to get started'}</p>
      </div>`;
      return;
    }

    for (const asset of filtered) {
      const div = document.createElement('div');
      div.className = 'asset-thumb';
      div.draggable = true;
      div.dataset.assetId = asset.id;
      div.title = `${asset.name} (${asset.width}×${asset.height})`;
      div.innerHTML = `
        <img src="${asset.dataURL}" alt="${asset.name}" loading="lazy" />
        <span class="asset-label">${asset.name}</span>
        <button class="asset-delete" data-id="${asset.id}" title="Delete">&times;</button>
      `;
      // Delete handler
      div.querySelector('.asset-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteAsset(asset.id);
      });
      this.gallery.appendChild(div);
    }
  }
};
