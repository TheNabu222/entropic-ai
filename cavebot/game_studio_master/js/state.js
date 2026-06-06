/* ===== GLOBAL STATE ===== */
const State = {
  project: {
    name: 'Untitled Project',
    canvasWidth: 800,
    canvasHeight: 600,
    scenes: [],
    assets: [],   // { id, name, dataURL, width, height }
    activeSceneId: null,
    // Phase 3A
    dialogueTrees: [],
    inventoryItems: [],
    flags: [],
    saveLoadSettings: { autoSave: true, autoSaveOnTransition: true, maxSlots: 5, showSaveLoadUI: true },
    // Phase 3 UI customization
    inventoryUI: { style: 'bar', slotSize: 40, position: 'bottom' },
    questUI: { showPanel: true, pinTracked: true, accent: '#7c5cfc' },
  },

  // UI state
  selectedObjectId: null,
  gridVisible: true,
  snapEnabled: false,
  snapSize: 32,
  isPreviewMode: false,
  isDragging: false,
  isResizing: false,
  isRotating: false,
  isDrawingHitbox: false,
  showHitboxes: true,

  // Undo/Redo
  undoStack: [],
  redoStack: [],
  maxUndo: 50,

  // ---- Scene helpers ----
  getActiveScene() {
    return this.project.scenes.find(s => s.id === this.project.activeSceneId) || null;
  },

  getObject(id) {
    const scene = this.getActiveScene();
    return scene ? scene.objects.find(o => o.id === id) : null;
  },

  getSelectedObject() {
    return this.selectedObjectId ? this.getObject(this.selectedObjectId) : null;
  },

  createScene(name) {
    const scene = {
      id: Utils.uid(),
      name: name || `Scene ${this.project.scenes.length + 1}`,
      objects: [],
      hitboxes: [],
      bgColor: 'transparent',
    };
    this.project.scenes.push(scene);
    return scene;
  },

  deleteScene(id) {
    const idx = this.project.scenes.findIndex(s => s.id === id);
    if (idx === -1 || this.project.scenes.length <= 1) return false;
    this.project.scenes.splice(idx, 1);
    if (this.project.activeSceneId === id) {
      this.project.activeSceneId = this.project.scenes[0].id;
    }
    return true;
  },

  createObject(assetId, x, y) {
    const scene = this.getActiveScene();
    if (!scene) return null;
    const asset = this.project.assets.find(a => a.id === assetId);
    if (!asset) return null;

    const maxZ = scene.objects.reduce((m, o) => Math.max(m, o.zIndex), 0);
    const obj = {
      id: Utils.uid(),
      assetId,
      name: asset.name,
      x, y,
      width: asset.width,
      height: asset.height,
      rotation: 0,
      opacity: 1,
      blendMode: 'normal',
      flipX: false,
      flipY: false,
      locked: false,
      visible: true,
      zIndex: maxZ + 1,
      // Interaction
      cursor: 'default',
      clickAction: 'none',
      targetSceneId: null,
      dialogueText: '',
      customJS: '',
      flavorText: '',
      // Phase 3A
      dialogueTreeId: '',      // which dialogue tree to trigger
      giveItemId: '',           // item to give player on click
      requireItemId: '',        // item required to interact
      requireItemFailText: '',  // text shown if missing item
      setFlag: null,            // { flag, operation, value }
      checkFlag: null,          // { flag, operator, value }
      flavorTexts: [],          // array of variant flavor texts
      flavorFlagConditions: [], // [{ text, flag, operator, value }] context-aware
      // Phase 3B
      skillCheck: null,         // { skill, difficulty, failText }
      questAction: null,        // { questId, milestoneId }
      repChange: null,          // { npcId, type, delta }
      applyEffectId: '',
      needChanges: {},
      npcBehavior: (typeof NPCAI !== 'undefined' ? NPCAI.createBehavior() : null),
    };
    scene.objects.push(obj);
    return obj;
  },

  deleteObject(id) {
    const scene = this.getActiveScene();
    if (!scene) return;
    const idx = scene.objects.findIndex(o => o.id === id);
    if (idx !== -1) scene.objects.splice(idx, 1);
    if (this.selectedObjectId === id) this.selectedObjectId = null;
  },

  // Undo
  pushUndo() {
    this.undoStack.push(JSON.stringify(this.project));
    if (this.undoStack.length > this.maxUndo) this.undoStack.shift();
    this.redoStack = [];
  },

  undo() {
    if (!this.undoStack.length) return false;
    this.redoStack.push(JSON.stringify(this.project));
    const prev = JSON.parse(this.undoStack.pop());
    this.project = prev;
    return true;
  },

  redo() {
    if (!this.redoStack.length) return false;
    this.undoStack.push(JSON.stringify(this.project));
    const next = JSON.parse(this.redoStack.pop());
    this.project = next;
    return true;
  },

  // Serialize
  toJSON() {
    return JSON.stringify(this.project, null, 2);
  },

  fromJSON(json) {
    try {
      const data = typeof json === 'string' ? JSON.parse(json) : json;
      this.project = data;
      this.undoStack = [];
      this.redoStack = [];
      this.selectedObjectId = null;
      return true;
    } catch (e) {
      console.error('Failed to load project:', e);
      return false;
    }
  },

  // Auto-save to localStorage
  autoSave() {
    try {
      localStorage.setItem('anzu_autosave', this.toJSON());
      localStorage.setItem('anzu_autosave_time', new Date().toISOString());
    } catch (e) {
      console.warn('Autosave failed:', e);
    }
  },

  loadAutoSave() {
    try {
      const data = localStorage.getItem('anzu_autosave');
      if (data) return this.fromJSON(data);
    } catch (e) { /* ignore */ }
    return false;
  }
};
