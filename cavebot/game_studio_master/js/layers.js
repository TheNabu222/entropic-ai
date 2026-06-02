/* ===== LAYER MANAGEMENT ===== */
const Layers = {
  list: null,

  init() {
    this.list = document.getElementById('layer-list');
  },

  render() {
    const scene = State.getActiveScene();
    this.list.innerHTML = '';
    if (!scene || !scene.objects.length) {
      this.list.innerHTML = '<div class="empty-state">No layers yet.</div>';
      return;
    }

    // Render top-to-bottom (highest zIndex first)
    const sorted = [...scene.objects].sort((a, b) => b.zIndex - a.zIndex);

    for (const obj of sorted) {
      const asset = State.project.assets.find(a => a.id === obj.assetId);
      const el = document.createElement('div');
      el.className = 'layer-item' +
        (obj.id === State.selectedObjectId ? ' active' : '') +
        (obj.locked ? ' locked' : '');
      el.dataset.id = obj.id;

      el.innerHTML = `
        <div class="layer-thumb">
          ${asset ? `<img src="${asset.dataURL}" alt="" />` : ''}
        </div>
        <span class="layer-name">${obj.name}</span>
        <div class="layer-controls">
          <button class="layer-btn${obj.visible ? ' active' : ''}" data-action="visibility" title="${obj.visible ? 'Hide' : 'Show'}">
            ${obj.visible ? '👁' : '🚫'}
          </button>
          <button class="layer-btn${obj.locked ? ' locked-indicator' : ''}" data-action="lock" title="${obj.locked ? 'Unlock' : 'Lock'}">
            ${obj.locked ? '🔒' : '🔓'}
          </button>
          <button class="layer-btn" data-action="up" title="Move Up">↑</button>
          <button class="layer-btn" data-action="down" title="Move Down">↓</button>
        </div>
      `;

      // Click to select
      el.addEventListener('click', (e) => {
        if (e.target.closest('.layer-btn')) return;
        State.selectedObjectId = obj.id;
        Canvas.renderScene();
        this.render();
        Properties.update();
      });

      // Layer control buttons
      el.querySelectorAll('.layer-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = btn.dataset.action;
          State.pushUndo();
          switch (action) {
            case 'visibility':
              obj.visible = !obj.visible;
              break;
            case 'lock':
              obj.locked = !obj.locked;
              break;
            case 'up':
              this.moveUp(obj.id);
              break;
            case 'down':
              this.moveDown(obj.id);
              break;
          }
          Canvas.renderScene();
          this.render();
          Properties.update();
          State.autoSave();
        });
      });

      this.list.appendChild(el);
    }
  },

  moveUp(id) {
    const scene = State.getActiveScene();
    if (!scene) return;
    const sorted = [...scene.objects].sort((a, b) => a.zIndex - b.zIndex);
    const idx = sorted.findIndex(o => o.id === id);
    if (idx < sorted.length - 1) {
      const temp = sorted[idx].zIndex;
      sorted[idx].zIndex = sorted[idx + 1].zIndex;
      sorted[idx + 1].zIndex = temp;
    }
  },

  moveDown(id) {
    const scene = State.getActiveScene();
    if (!scene) return;
    const sorted = [...scene.objects].sort((a, b) => a.zIndex - b.zIndex);
    const idx = sorted.findIndex(o => o.id === id);
    if (idx > 0) {
      const temp = sorted[idx].zIndex;
      sorted[idx].zIndex = sorted[idx - 1].zIndex;
      sorted[idx - 1].zIndex = temp;
    }
  },

  moveToFront(id) {
    const scene = State.getActiveScene();
    if (!scene) return;
    State.pushUndo();
    const maxZ = scene.objects.reduce((m, o) => Math.max(m, o.zIndex), 0);
    const obj = scene.objects.find(o => o.id === id);
    if (obj) obj.zIndex = maxZ + 1;
    Canvas.renderScene();
    this.render();
    State.autoSave();
  },

  moveToBack(id) {
    const scene = State.getActiveScene();
    if (!scene) return;
    State.pushUndo();
    const minZ = scene.objects.reduce((m, o) => Math.min(m, o.zIndex), Infinity);
    const obj = scene.objects.find(o => o.id === id);
    if (obj) obj.zIndex = minZ - 1;
    Canvas.renderScene();
    this.render();
    State.autoSave();
  },
};
