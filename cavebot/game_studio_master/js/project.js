/* ===== PROJECT SYSTEM ===== */
const Project = {
  init() {
    document.getElementById('btn-new-project').addEventListener('click', () => this.newProject());
    document.getElementById('btn-open-project').addEventListener('click', () => this.showOpenModal());
    document.getElementById('btn-save-project').addEventListener('click', () => this.saveProject());

    document.getElementById('btn-open-file').addEventListener('click', () => {
      document.getElementById('project-file-input').click();
    });
    document.getElementById('project-file-input').addEventListener('change', (e) => this.openFile(e));
    document.getElementById('btn-open-local').addEventListener('click', () => this.loadFromLocal());

    // Project name editing
    document.getElementById('project-name').addEventListener('dblclick', () => this.renameProject());

    // Modal close
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => this.closeModals());
    });
    document.getElementById('modal-backdrop').addEventListener('click', () => this.closeModals());
  },

  newProject() {
    if (!confirm('Create a new project? Unsaved changes will be lost.')) return;
    State.project = {
      name: 'Untitled Project',
      canvasWidth: 800,
      canvasHeight: 600,
      scenes: [],
      assets: [],
      activeSceneId: null,
      dialogueTrees: [],
      inventoryItems: [],
      flags: [],
      saveLoadSettings: { autoSave: true, autoSaveOnTransition: true, maxSlots: 5, showSaveLoadUI: true },
      inventoryUI: { style: 'bar', slotSize: 40, position: 'bottom' },
      questUI: { showPanel: true, pinTracked: true, accent: '#7c5cfc' },
    };
    State.undoStack = [];
    State.redoStack = [];
    State.selectedObjectId = null;

    const scene = State.createScene('Scene 1');
    State.project.activeSceneId = scene.id;

    this.refreshAll();
    State.autoSave();
  },

  saveProject() {
    const json = State.toJSON();
    const name = Utils.sanitizeName(State.project.name) || 'untitled';
    Utils.download(json, `${name}.anzu`, 'application/json');
    State.autoSave();
  },

  showOpenModal() {
    document.getElementById('modal-backdrop').hidden = false;
    document.getElementById('modal-open').hidden = false;

    // Show autosave info
    const time = localStorage.getItem('anzu_autosave_time');
    const recent = document.getElementById('recent-projects');
    if (time) {
      recent.innerHTML = `<p style="margin-top:12px;color:var(--text-secondary);font-size:12px">
        Last autosave: ${new Date(time).toLocaleString()}</p>`;
    } else {
      recent.innerHTML = '<p style="color:var(--text-muted);font-size:12px">No autosave found.</p>';
    }
  },

  async openFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      if (State.fromJSON(text)) {
        this.closeModals();
        this.refreshAll();
      } else {
        alert('Failed to parse project file.');
      }
    } catch (err) {
      alert('Error reading file: ' + err.message);
    }
    e.target.value = '';
  },

  loadFromLocal() {
    if (State.loadAutoSave()) {
      this.closeModals();
      this.refreshAll();
    } else {
      alert('No autosave data found.');
    }
  },

  renameProject() {
    const name = prompt('Project name:', State.project.name);
    if (name && name.trim()) {
      State.project.name = name.trim();
      document.getElementById('project-name').textContent = State.project.name;
      State.autoSave();
    }
  },

  closeModals() {
    document.getElementById('modal-backdrop').hidden = true;
    document.querySelectorAll('.modal').forEach(m => m.hidden = true);
  },

  refreshAll() {
    document.getElementById('project-name').textContent = State.project.name;

    // Ensure schema for older projects
    if (!State.project.dialogueTrees) State.project.dialogueTrees = [];
    if (!State.project.inventoryItems) State.project.inventoryItems = [];
    if (!State.project.flags) State.project.flags = [];
    if (!State.project.saveLoadSettings) {
      State.project.saveLoadSettings = { autoSave: true, autoSaveOnTransition: true, maxSlots: 5, showSaveLoadUI: true };
    }
    if (!State.project.inventoryUI) State.project.inventoryUI = { style: 'bar', slotSize: 40, position: 'bottom' };
    if (!State.project.questUI) State.project.questUI = { showPanel: true, pinTracked: true, accent: '#7c5cfc' };
    if (typeof RPGSystems !== 'undefined') RPGSystems.ensureData();
    if (typeof Transitions !== 'undefined') Transitions.ensureSceneTransitions();

    // Ensure at least one scene
    if (!State.project.scenes.length) {
      const scene = State.createScene('Scene 1');
      State.project.activeSceneId = scene.id;
    }
    if (!State.project.activeSceneId) {
      State.project.activeSceneId = State.project.scenes[0].id;
    }

    Canvas.applyCanvasSize();
    Scenes.render();
    Canvas.renderScene();
    Layers.render();
    Assets.render();
    Properties.update();
    Hitbox.render();
    Hitbox.renderList();
  },
};
