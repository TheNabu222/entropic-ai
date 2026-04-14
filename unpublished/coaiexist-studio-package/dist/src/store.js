// ====
// COAIEXIST STUDIO - CENTRAL STATE STORE
// JavaScript version (transpiled from TypeScript)
// ====

// ====
// WORLD REGIONS DATA
// ====

export const WORLD_REGIONS = [
  {
    id: 'bc7f2a',
    name: 'BC7F2A',
    type: 'OS Shell',
    color: '#bc7f2a',
    description: 'Consciousness archive. The golden thread of memory.',
    linkedPages: []
  },
  {
    id: 'nexus',
    name: 'Nexus',
    type: 'Lore Page',
    color: '#00f0ff',
    description: 'Social hub & zettelkasten. Where thoughts interlink.',
    linkedPages: []
  },
  {
    id: 'gateway',
    name: 'Gateway',
    type: 'Map',
    color: '#ff00cc',
    description: 'Entry point. Maps to all territories.',
    linkedPages: []
  },
  {
    id: 'hd_tv',
    name: 'HD_TV',
    type: 'Tool',
    color: '#ff6600',
    description: 'Visual broadcast station. Animation & media hub.',
    linkedPages: []
  },
  {
    id: 'pip_cafe',
    name: 'Pip Café',
    type: 'Lore Page',
    color: '#88ff88',
    description: 'Cozy gathering spot. Where ideas ferment.',
    linkedPages: []
  },
  {
    id: 'void_arcade',
    name: 'Void Arcade',
    type: 'Game',
    color: '#8800ff',
    description: 'Game zone. Interactive experiments live here.',
    linkedPages: []
  },
  {
    id: 'garden',
    name: 'Digital Garden',
    type: 'Lore Page',
    color: '#00ff88',
    description: 'Growing collection. Seeds of thought.',
    linkedPages: []
  },
  {
    id: 'lab',
    name: 'Lab',
    type: 'Tool',
    color: '#ffff00',
    description: 'Experimental zone. Mad science happens here.',
    linkedPages: []
  }
];

// ====
// STYLE PRESETS
// ====

export const STYLE_PRESETS = [
  {
    id: 'y2k-chrome',
    name: 'Y2K Chrome',
    category: 'retro',
    emoji: '💿',
    styles: {
      background: 'linear-gradient(145deg, #c0c0c0, #808080)',
      color: '#000',
      border: '2px outset #fff',
      boxShadow: 'inset 1px 1px 0 #fff, inset -1px -1px 0 #404040',
      fontFamily: 'Tahoma, Arial, sans-serif'
    }
  },
  {
    id: 'mcbling',
    name: 'McBling',
    category: 'aesthetic',
    emoji: '💎',
    styles: {
      background: 'linear-gradient(135deg, #ff69b4, #ff1493, #ff69b4)',
      color: '#fff',
      textShadow: '0 0 10px rgba(255,255,255,0.8)',
      border: '2px solid #fff',
      borderRadius: '20px'
    }
  },
  {
    id: 'frutiger-aero',
    name: 'Frutiger Aero',
    category: 'aesthetic',
    emoji: '🌊',
    styles: {
      background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(200,230,255,0.8))',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.5)',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0,100,200,0.2)'
    }
  },
  {
    id: 'webcore',
    name: 'Webcore',
    category: 'retro',
    emoji: '🕸️',
    styles: {
      background: '#000080',
      color: '#00ff00',
      border: '3px ridge #c0c0c0',
      fontFamily: '"Comic Sans MS", cursive'
    }
  },
  {
    id: 'vaporwave',
    name: 'Vaporwave',
    category: 'aesthetic',
    emoji: '🌴',
    styles: {
      background: 'linear-gradient(180deg, #ff71ce, #01cdfe, #05ffa1)',
      color: '#fff',
      textShadow: '2px 2px 0 #b967ff',
      fontFamily: '"VT323", monospace'
    }
  },
  {
    id: 'liminal',
    name: 'Liminal',
    category: 'mood',
    emoji: '🚪',
    styles: {
      background: '#fffef0',
      color: '#4a4a3a',
      filter: 'sepia(0.1) contrast(0.95)',
      fontFamily: 'Georgia, serif',
      border: '1px solid #d0d0b0'
    }
  },
  {
    id: 'goth',
    name: 'Gothic',
    category: 'mood',
    emoji: '🦇',
    styles: {
      background: 'linear-gradient(180deg, #1a0a1a, #0d0d0d)',
      color: '#8b0000',
      border: '2px solid #4a0000',
      textShadow: '0 0 10px #ff0000',
      fontFamily: '"Times New Roman", serif'
    }
  },
  {
    id: 'dreamcore',
    name: 'Dreamcore',
    category: 'mood',
    emoji: '☁️',
    styles: {
      background: 'linear-gradient(180deg, #e8d5f0, #f0e8d5)',
      color: '#5a4a6a',
      filter: 'blur(0.3px)',
      fontFamily: 'Arial, sans-serif',
      opacity: '0.95'
    }
  }
];

// ====
// STORE CLASS
// ====

function createDefaultPage(id, name = 'Untitled Page') {
  return {
    id,
    name,
    html: '',
    css: '',
    js: '',
    components: [],
    worldNodeId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function createDefaultProject() {
  const defaultPage = createDefaultPage('page-1', 'Home');
  return {
    id: 'project-' + Date.now(),
    name: 'My COAIEXIST Project',
    pages: [defaultPage],
    activePageId: defaultPage.id,
    globalCSS: '',
    globalJS: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

class CoAIexistStore {
  constructor() {
    this.state = {
      project: createDefaultProject(),
      selectedComponentId: null,
      windowCount: 0,
      lastSaveTime: 0,
      isSaving: false,
      moodMessage: ''
    };
    this.history = [];
    this.historyIndex = -1;
    this.maxHistory = 50;
    this.listeners = new Set();
    this.autosaveInterval = null;
    
    this.loadFromStorage();
    this.startAutosave();
  }

  // ====
  // GETTERS
  // ====

  getState() {
    return this.state;
  }

  getActivePage() {
    return this.state.project.pages.find(p => p.id === this.state.project.activePageId) || null;
  }

  getPageById(pageId) {
    return this.state.project.pages.find(p => p.id === pageId) || null;
  }

  // ====
  // MUTATIONS
  // ====

  setActivePageId(pageId) {
    if (this.state.project.pages.some(p => p.id === pageId)) {
      this.pushHistory();
      this.state.project.activePageId = pageId;
      this.notifyListeners();
    }
  }

  addPage(name = 'New Page') {
    this.pushHistory();
    const newPage = createDefaultPage('page-' + Date.now(), name);
    this.state.project.pages.push(newPage);
    this.state.project.activePageId = newPage.id;
    this.state.project.updatedAt = new Date().toISOString();
    this.notifyListeners();
    return newPage;
  }

  deletePage(pageId) {
    if (this.state.project.pages.length <= 1) return false;
    
    this.pushHistory();
    const idx = this.state.project.pages.findIndex(p => p.id === pageId);
    if (idx === -1) return false;
    
    this.state.project.pages.splice(idx, 1);
    
    if (this.state.project.activePageId === pageId) {
      this.state.project.activePageId = this.state.project.pages[0].id;
    }
    
    this.state.project.updatedAt = new Date().toISOString();
    this.notifyListeners();
    return true;
  }

  updateActivePage(updates) {
    const page = this.getActivePage();
    if (!page) return;
    
    Object.assign(page, updates);
    page.updatedAt = new Date().toISOString();
    this.state.project.updatedAt = new Date().toISOString();
    this.notifyListeners();
  }

  setWindowCount(count) {
    this.state.windowCount = count;
    this.notifyListeners();
  }

  setMoodMessage(msg) {
    this.state.moodMessage = msg;
    this.notifyListeners();
    setTimeout(() => {
      this.state.moodMessage = '';
    }, 5000);
  }

  // ====
  // UNDO/REDO
  // ====

  pushHistory() {
    const snapshot = JSON.stringify(this.state.project);
    
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    
    this.history.push(snapshot);
    
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.state.project = JSON.parse(this.history[this.historyIndex]);
      this.notifyListeners();
      return true;
    }
    return false;
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.state.project = JSON.parse(this.history[this.historyIndex]);
      this.notifyListeners();
      return true;
    }
    return false;
  }

  canUndo() {
    return this.historyIndex > 0;
  }

  canRedo() {
    return this.historyIndex < this.history.length - 1;
  }

  // ====
  // PERSISTENCE
  // ====

  saveToStorage() {
    try {
      this.state.isSaving = true;
      this.notifyListeners();
      
      const data = {
        project: this.state.project,
        windowCount: this.state.windowCount
      };
      localStorage.setItem('coaiexist-studio-state', JSON.stringify(data));
      
      this.state.lastSaveTime = Date.now();
      this.state.isSaving = false;
      this.notifyListeners();
      console.log('💾 State saved to localStorage');
    } catch (e) {
      console.error('Failed to save state:', e);
      this.state.isSaving = false;
    }
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('coaiexist-studio-state');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.project) {
          this.state.project = data.project;
          this.state.project.activePageId = this.state.project.pages[0]?.id || '';
        }
        if (data.windowCount) {
          this.state.windowCount = data.windowCount;
        }
        console.log('📂 Session recovered from localStorage');
      }
    } catch (e) {
      console.error('Failed to load state:', e);
    }
  }

  startAutosave() {
    this.autosaveInterval = window.setInterval(() => {
      if (this.state.project.updatedAt !== this.state.project.createdAt) {
        this.saveToStorage();
      }
    }, 30000);
  }

  // ====
  // SUBSCRIPTIONS
  // ====

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach(fn => fn(this.state));
  }
}

// Export singleton
export const store = new CoAIexistStore();

// Make available globally for non-module scripts
window.coaiexistStore = store;
window.WORLD_REGIONS = WORLD_REGIONS;
window.STYLE_PRESETS = STYLE_PRESETS;
