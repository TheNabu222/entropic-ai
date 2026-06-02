# ⚔ Anzu Game Studio

**Phase 1: Core Foundation + Scene Builder**

A browser-based game creation studio for building point-and-click adventure games. Zero dependencies — exports clean HTML/CSS/JS ready for Neocities hosting.

## 🚀 Quick Start

Open `index.html` in any modern browser, or run a local server:

```bash
python3 -m http.server 8080
# Visit http://localhost:8080
```

## ✨ Phase 1 Features

### Scene Builder
- **Canvas/Stage** — 800×600 with transparency grid
- **Asset Library** — Upload images, search/filter, drag onto stage
- **Drag-and-drop** positioning with keyboard nudging (Arrow keys: 1px, Shift+Arrow: 10px)
- **Transform handles** — Resize (8-point), rotate (Shift for 15° snap)
- **Snap-to-grid** toggle

### Layer Management
- Layer list panel with thumbnails
- Z-index controls (move up/down/front/back)
- Layer locking & visibility toggle

### Object Properties
- Position (X, Y), Size (W, H), Rotation
- Opacity, Blend modes (15 options)
- Flip horizontal/vertical
- **Interaction settings:**
  - Cursor on hover (Default, Hand, Eye, Crosshair, Speech, Grab, Blocked)
  - Click action (None, Scene Change, Dialogue, Custom JS)
  - Flavor text field

### Visual Hitbox Editor
- Draw clickable regions over objects
- Toggle hitbox visibility
- Hitbox list with color coding

### Preview Mode
- Full-screen preview with scene rendering
- Interactive — click actions, dialogues, scene transitions all work
- Press `P` to enter, `Escape` to exit

### Scene Management
- Create, rename, duplicate, delete scenes
- Scene list with object counts
- Scene linking for click actions

### Project System
- New / Open / Save (.anzu JSON files)
- Auto-save to LocalStorage every 30 seconds
- Load from auto-save

### Export System
- Generates standalone HTML with embedded game runtime
- Inline base64 assets (no external files needed)
- Configurable game title and canvas size
- Includes: scene rendering, click interactions, cursor changes, scene transitions, dialogue system

## ⌨ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Save project |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Ctrl+D` | Duplicate selected |
| `Delete` | Delete selected |
| `Arrow keys` | Nudge 1px |
| `Shift+Arrow` | Nudge 10px |
| `G` | Toggle grid |
| `P` | Preview mode |
| `Escape` | Deselect / Exit preview |
| `[` / `]` | Move layer down/up |
| Right-click | Context menu |

## 🏗 Architecture

```
game_studio_master/
├── index.html          # Main app shell
├── css/
│   ├── main.css        # Core styles, variables, layout
│   ├── panels.css      # Panel-specific styles
│   ├── canvas.css      # Canvas/stage styles
│   └── modals.css      # Modal & overlay styles
├── js/
│   ├── utils.js        # Utility functions
│   ├── state.js        # Global state management + undo/redo
│   ├── assets.js       # Asset library (upload, gallery, search)
│   ├── canvas.js       # Stage rendering, drag/resize/rotate
│   ├── layers.js       # Layer list & z-index management
│   ├── properties.js   # Properties panel bindings
│   ├── hitbox.js       # Hitbox drawing & rendering
│   ├── scenes.js       # Scene CRUD & navigation
│   ├── project.js      # Project new/open/save
│   ├── preview.js      # Preview mode runtime
│   ├── export.js       # HTML game export generator
│   ├── shortcuts.js    # Keyboard shortcuts
│   └── app.js          # App initialization
└── README.md
```

## 🔮 Future Phases

### Phase 2 — GitHub & AI Integration
- GitHub repo sync (push/pull assets)
- AI-powered asset generation
- Sprite sheet editor
- Icon generator
- Advanced dialogue system

### Phase 3 — Advanced Game Engine
- Inventory system
- Character/NPC system
- Audio manager (BGM + SFX)
- Parallax scrolling
- Save/load game state
- Custom cursor images
- Animation timeline
- Conditional logic/variables

---

*Built for [Neocities](https://neocities.org) deployment — no build step required for exported games.*
