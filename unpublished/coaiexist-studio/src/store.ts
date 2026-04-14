// ====
// COAIEXIST STUDIO - CENTRAL STATE STORE
// TypeScript interfaces + state management + undo/redo + autosave
// ====

// ====
// TYPE DEFINITIONS
// ====

export interface WorldNode {
  id: string;
  name: string;
  type: 'OS Shell' | 'Lore Page' | 'Tool' | 'Map' | 'Game';
  color: string;
  description: string;
  linkedPages: string[];
}

export interface LoreSnippet {
  id: string;
  content: string;
  tags: string[];
  worldNodeId?: string;
  createdAt: string;
}

export interface ComponentInstance {
  id: string;
  type: string;
  html: string;
  styles: Record<string, string>;
  position: { x: number; y: number };
  size: { width: number; height: number };
  worldNodeId?: string;
}

export interface StudioPage {
  id: string;
  name: string;
  html: string;
  css: string;
  js: string;
  components: ComponentInstance[];
  worldNodeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  pages: StudioPage[];
  activePageId: string;
  globalCSS: string;
  globalJS: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudioState {
  project: Project;
  selectedComponentId: string | null;
  windowCount: number;
  lastSaveTime: number;
  isSaving: boolean;
  moodMessage: string;
}

// ====
// WORLD REGIONS DATA
// ====

export const WORLD_REGIONS: WorldNode[] = [
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
    type: 'Game',
    color: '#ccff00',
    description: 'Games & HUD interfaces. Play layer.',
    linkedPages: []
  },
  {
    id: 'pea',
    name: 'PEA',
    type: 'Lore Page',
    color: '#bf5fff',
    description: 'Lore & satire zone. The absurd archive.',
    linkedPages: []
  },
  {
    id: 'nabu222',
    name: 'NABU222',
    type: 'Tool',
    color: '#ff9900',
    description: 'Creation tools. The forge.',
    linkedPages: []
  },
  {
    id: 'maps',
    name: 'Maps',
    type: 'Map',
    color: '#48c774',
    description: 'Cartography layer. Navigate the grid.',
    linkedPages: []
  },
  {
    id: 'play',
    name: 'Play',
    type: 'Game',
    color: '#f14668',
    description: 'Interactive experiences. Fun zone.',
    linkedPages: []
  }
];

// ====
// STYLE PRESETS (CHIPS)
// ====

export interface StylePreset {
  id: string;
  name: string;
  emoji: string;
  styles: Record<string, string>;
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'glassy',
    name: 'Glassy',
    emoji: '💎',
    styles: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      color: '#ffffff'
    }
  },
  {
    id: 'vhs-burn',
    name: 'VHS Burn',
    emoji: '📼',
    styles: {
      background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)',
      border: '2px solid #ff006e',
      borderRadius: '4px',
      boxShadow: '0 0 20px rgba(255, 0, 110, 0.5), inset 0 0 60px rgba(255, 0, 110, 0.1)',
      color: '#ff006e',
      textShadow: '0 0 10px #ff006e'
    }
  },
  {
    id: 'terminal',
    name: 'Terminal',
    emoji: '💻',
    styles: {
      background: '#0a0a0a',
      border: '1px solid #00ff00',
      borderRadius: '0',
      boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)',
      color: '#00ff00',
      fontFamily: "'VT323', 'Courier New', monospace",
      textShadow: '0 0 5px #00ff00'
    }
  },
  {
    id: 'frutiger-aero',
    name: 'Frutiger Aero',
    emoji: '🌊',
    styles: {
      background: 'linear-gradient(180deg, rgba(135, 206, 250, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)',
      border: '1px solid rgba(135, 206, 250, 0.5)',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0, 120, 200, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
      color: '#1a5276'
    }
  },
  {
    id: 'mcbling',
    name: 'McBling',
    emoji: '✨',
    styles: {
      background: 'linear-gradient(135deg, #ff69b4 0%, #ff1493 25%, #ff00ff 50%, #8b00ff 75%, #4169e1 100%)',
      border: '3px solid #ffd700',
      borderRadius: '20px',
      boxShadow: '0 0 30px rgba(255, 0, 255, 0.5), 0 0 60px rgba(255, 215, 0, 0.3)',
      color: '#ffffff',
      textShadow: '2px 2px 0 #ff00ff, -2px -2px 0 #00ffff'
    }
  }
];

// ====
// MOOD MESSAGES
// ====

export const MOOD_MESSAGES = {
  welcome: [
    'Welcome back, architect.',
    'The grid awaits your vision.',
    'Ready to build worlds?',
    'Consciousness online.'
  ],
  saving: 'Saving...',
  saved: 'Autosaved. Timeline preserved. ✓',
  windowSpawn: (count: number) => `You\'ve spawned ${count} windows.`,
  idle: [
    'The void hums softly.',
    'Pixels await arrangement.',
    'Liminal space detected.',
    'Memory fragments loading...'
  ]
};

// ====
// STORE CLASS
// ====

class CoAIexistStore {
  private state: StudioState;
  private undoStack: string[] = [];
  private redoStack: string[] = [];
  private maxHistorySize = 50;
  private autosaveInterval: number | null = null;
  private listeners: Set<(state: StudioState) => void> = new Set();
  private saveDebounceTimer: number | null = null;

  constructor() {
    this.state = this.createInitialState();
    this.loadFromStorage();
    this.startAutosave();
    this.setMoodMessage('welcome');
  }

  private createInitialState(): StudioState {
    const now = new Date().toISOString();
    return {
      project: {
        id: this.generateId(),
        name: 'Untitled Project',
        pages: [{
          id: this.generateId(),
          name: 'index',
          html: '',
          css: '',
          js: '',
          components: [],
          createdAt: now,
          updatedAt: now
        }],
        activePageId: '',
        globalCSS: '',
        globalJS: '',
        createdAt: now,
        updatedAt: now
      },
      selectedComponentId: null,
      windowCount: 0,
      lastSaveTime: 0,
      isSaving: false,
      moodMessage: ''
    };
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  // ====
  // STATE ACCESS
  // ====

  getState(): StudioState {
    return this.state;
  }

  getProject(): Project {
    return this.state.project;
  }

  getActivePage(): StudioPage | undefined {
    return this.state.project.pages.find(p => p.id === this.state.project.activePageId);
  }

  getWorldRegions(): WorldNode[] {
    return WORLD_REGIONS;
  }

  getStylePresets(): StylePreset[] {
    return STYLE_PRESETS;
  }

  // ====
  // STATE MUTATIONS
  // ====

  setState(partial: Partial<StudioState>, recordHistory = true): void {
    if (recordHistory) {
      this.pushToHistory();
    }
    this.state = { ...this.state, ...partial };
    this.notifyListeners();
    this.scheduleSave();
  }

  updateProject(partial: Partial<Project>): void {
    this.pushToHistory();
    this.state.project = {
      ...this.state.project,
      ...partial,
      updatedAt: new Date().toISOString()
    };
    this.notifyListeners();
    this.scheduleSave();
  }

  updateActivePage(partial: Partial<StudioPage>): void {
    const page = this.getActivePage();
    if (!page) return;

    this.pushToHistory();
    const updatedPages = this.state.project.pages.map(p =>
      p.id === page.id
        ? { ...p, ...partial, updatedAt: new Date().toISOString() }
        : p
    );
    this.state.project = {
      ...this.state.project,
      pages: updatedPages,
      updatedAt: new Date().toISOString()
    };
    this.notifyListeners();
    this.scheduleSave();
  }

  selectComponent(id: string | null): void {
    this.state.selectedComponentId = id;
    this.notifyListeners();
  }

  incrementWindowCount(): void {
    this.state.windowCount++;
    this.setMoodMessage('windowSpawn');
    this.notifyListeners();
  }

  setMoodMessage(type: 'welcome' | 'saving' | 'saved' | 'windowSpawn' | 'idle'): void {
    const messages = MOOD_MESSAGES;
    if (type === 'windowSpawn') {
      this.state.moodMessage = messages.windowSpawn(this.state.windowCount);
    } else if (type === 'saving' || type === 'saved') {
      this.state.moodMessage = messages[type];
    } else {
      const arr = messages[type] as string[];
      this.state.moodMessage = arr[Math.floor(Math.random() * arr.length)];
    }
    this.notifyListeners();
  }

  // ====
  // UNDO / REDO
  // ====

  private pushToHistory(): void {
    const snapshot = JSON.stringify(this.state);
    this.undoStack.push(snapshot);
    if (this.undoStack.length > this.maxHistorySize) {
      this.undoStack.shift();
    }
    this.redoStack = [];
  }

  undo(): boolean {
    if (this.undoStack.length === 0) return false;

    const current = JSON.stringify(this.state);
    this.redoStack.push(current);

    const previous = this.undoStack.pop()!;
    this.state = JSON.parse(previous);
    this.notifyListeners();
    this.scheduleSave();
    return true;
  }

  redo(): boolean {
    if (this.redoStack.length === 0) return false;

    const current = JSON.stringify(this.state);
    this.undoStack.push(current);

    const next = this.redoStack.pop()!;
    this.state = JSON.parse(next);
    this.notifyListeners();
    this.scheduleSave();
    return true;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  // ====
  // PERSISTENCE
  // ====

  private scheduleSave(): void {
    if (this.saveDebounceTimer) {
      clearTimeout(this.saveDebounceTimer);
    }
    this.saveDebounceTimer = window.setTimeout(() => this.saveToStorage(), 1000);
  }

  private saveToStorage(): void {
    this.state.isSaving = true;
    this.setMoodMessage('saving');

    try {
      const data = JSON.stringify({
        project: this.state.project,
        windowCount: this.state.windowCount
      });
      localStorage.setItem('coaiexist-studio-state', data);
      this.state.lastSaveTime = Date.now();
      this.state.isSaving = false;
      this.setMoodMessage('saved');
    } catch (e) {
      console.error('Failed to save state:', e);
      this.state.isSaving = false;
    }
    this.notifyListeners();
  }

  private loadFromStorage(): void {
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

  private startAutosave(): void {
    this.autosaveInterval = window.setInterval(() => {
      if (this.state.project.updatedAt !== this.state.project.createdAt) {
        this.saveToStorage();
      }
    }, 30000); // Autosave every 30 seconds
  }

  // ====
  // SUBSCRIPTIONS
  // ====

  subscribe(listener: (state: StudioState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(fn => fn(this.state));
  }
}

// Export singleton
export const store = new CoAIexistStore();

// Make available globally for non-module scripts
(window as any).coaiexistStore = store;
(window as any).WORLD_REGIONS = WORLD_REGIONS;
(window as any).STYLE_PRESETS = STYLE_PRESETS;
