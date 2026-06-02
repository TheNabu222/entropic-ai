/* ===== SCENE MANAGEMENT ===== */
const Scenes = {
  list: null,
  addBtn: null,

  init() {
    this.list = document.getElementById('scene-list');
    this.addBtn = document.getElementById('btn-add-scene');
    this.addBtn.addEventListener('click', () => this.addScene());
  },

  addScene(name) {
    State.pushUndo();
    const scene = State.createScene(name);
    State.project.activeSceneId = scene.id;
    State.selectedObjectId = null;
    this.render();
    Canvas.renderScene();
    Layers.render();
    Properties.update();
    State.autoSave();
  },

  switchTo(id) {
    if (State.project.activeSceneId === id) return;
    State.project.activeSceneId = id;
    State.selectedObjectId = null;
    this.render();
    Canvas.renderScene();
    Layers.render();
    Properties.update();
    Hitbox.render();
    Hitbox.renderList();
  },

  deleteScene(id) {
    if (State.project.scenes.length <= 1) return;
    if (!confirm('Delete this scene?')) return;
    State.pushUndo();
    State.deleteScene(id);
    State.selectedObjectId = null;
    this.render();
    Canvas.renderScene();
    Layers.render();
    Properties.update();
    State.autoSave();
  },

  renameScene(id) {
    const scene = State.project.scenes.find(s => s.id === id);
    if (!scene) return;
    const newName = prompt('Rename scene:', scene.name);
    if (newName && newName.trim()) {
      State.pushUndo();
      scene.name = newName.trim();
      this.render();
      Canvas.renderScene();
      State.autoSave();
    }
  },

  duplicateScene(id) {
    const scene = State.project.scenes.find(s => s.id === id);
    if (!scene) return;
    State.pushUndo();
    const dup = JSON.parse(JSON.stringify(scene));
    dup.id = Utils.uid();
    dup.name = scene.name + ' (copy)';
    dup.objects.forEach(o => o.id = Utils.uid());
    dup.hitboxes.forEach(h => h.id = Utils.uid());
    State.project.scenes.push(dup);
    State.project.activeSceneId = dup.id;
    State.selectedObjectId = null;
    this.render();
    Canvas.renderScene();
    Layers.render();
    Properties.update();
    State.autoSave();
  },

  render() {
    this.list.innerHTML = '';
    for (const scene of State.project.scenes) {
      const isActive = scene.id === State.project.activeSceneId;
      const el = document.createElement('div');
      el.className = 'scene-item' + (isActive ? ' active' : '');
      el.dataset.id = scene.id;

      el.innerHTML = `
        <div class="scene-thumb">${scene.objects.length ? '🎬' : '📄'}</div>
        <div class="scene-info">
          <div class="scene-name">${scene.name}</div>
          <div class="scene-count">${scene.objects.length} objects</div>
        </div>
        <div class="scene-actions">
          <button class="scene-action-btn" data-action="rename" title="Rename">✏️</button>
          <button class="scene-action-btn" data-action="duplicate" title="Duplicate">📋</button>
          <button class="scene-action-btn delete" data-action="delete" title="Delete">🗑</button>
        </div>
      `;

      el.addEventListener('click', (e) => {
        if (e.target.closest('.scene-action-btn')) return;
        this.switchTo(scene.id);
      });

      el.querySelectorAll('.scene-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = btn.dataset.action;
          if (action === 'rename') this.renameScene(scene.id);
          else if (action === 'duplicate') this.duplicateScene(scene.id);
          else if (action === 'delete') this.deleteScene(scene.id);
        });
      });

      this.list.appendChild(el);
    }
  },
};
