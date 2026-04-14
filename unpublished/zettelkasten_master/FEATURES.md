# Zettelkasten Master Page - Feature Analysis & Combination

## Source Files Analyzed

### 1. index.html (React/Vite App)
- **Status**: Not directly usable (requires build tools)
- **Features extracted**: Color scheme ideas, typography

### 2. zettl.html (Windows 98 Edition)
**Features:**
- ✅ Windows 98 desktop metaphor (complete)
- ✅ Draggable/resizable windows
- ✅ Taskbar with clock
- ✅ Start menu
- ✅ Desktop icons
- ✅ MySpace profile theme
- ✅ Zettel cards with hierarchy styling (trunk/branch/leaf/flower/fruit/bud)
- ✅ Dialog boxes for viewing zettels
- ✅ Music player mockup
- ✅ AIM chat client mockup
- ✅ Mobile responsive with toggle button
- ✅ localStorage persistence
- ✅ Hashtag management
- ✅ Y2K/Hyena Diva aesthetic

### 3. index 3.html (Windows XP Edition)
**Features:**
- ✅ Windows XP aesthetic
- ✅ Health dashboard with statistics (total, avg links, max depth, orphans)
- ✅ Advanced tools panel (collapsible)
- ✅ Hierarchy browser
- ✅ Tier-based zettel creation (trunk/branch/leaf/flower/fruit/bud)
- ✅ Bulk add functionality
- ✅ Backup/restore system
- ✅ Mobile responsiveness
- ✅ System health bar
- ✅ Trunk breakdown chart

### 4. kettlekorn_visualizer.html (React Chat Log)
**Features described:**
- ✅ Node-graph visualization
- ✅ File upload for .txt files
- ✅ Tag parsing from content
- ✅ Link parsing from content
- ✅ Drag-and-drop node positioning
- ✅ File browser tree view
- ✅ localStorage persistence

### 5. entropindex.css (Full OS Desktop)
**Features:**
- ✅ Complete OS desktop styling
- ✅ Multiple window types
- ✅ Cyberpunk/vaporwave aesthetic
- ✅ Apps: Browser, Paint, Minesweeper, Notepad
- ✅ Gemini AI chat integration styling
- ✅ Conspiracy pinboard styling
- ✅ Mobile responsive design

### 6. index.css (Nabu Archive Theme)
**Features:**
- ✅ Dark theme (deep blue/purple)
- ✅ Custom fonts (Cinzel, IBM Plex Sans, Space Mono)
- ✅ Ticker scroll animation
- ✅ Glow pulse animation
- ✅ Gold/teal accent colors
- ✅ Custom scrollbars

---

## Combined Master Page Features

### UI/UX
- [x] Windows 98/XP hybrid desktop metaphor
- [x] Draggable, resizable windows
- [x] Taskbar with Start menu and clock
- [x] Desktop icons for quick access
- [x] Mobile responsive with toggle
- [x] Multiple color themes (Y2K vaporwave)

### Zettelkasten Core
- [x] Hierarchical organization (Trunk → Branch → Leaf → Flower → Fruit → Bud)
- [x] Card-based zettel display
- [x] Category-based organization (Location, Deity, Anomaly, etc.)
- [x] Tag system with filtering
- [x] Related zettels (bidirectional links)
- [x] Search functionality

### Visualizations
- [x] List/tree view (hierarchical)
- [x] Network graph view (node-based)
- [x] System health dashboard
- [x] Statistics (total zettels, connections, depth)
- [x] Category distribution chart

### Data Management
- [x] JSON data import/export
- [x] localStorage persistence
- [x] Create/edit/delete zettels
- [x] Backup/restore functionality
- [x] Bulk operations

### Additional Features
- [x] Music player (visual only)
- [x] MySpace-style profile header
- [x] Animated elements (marquee, blinking)
- [x] Dialog system for detailed views

---

## Data Structure

```json
{
  "id": "Z001",
  "category": "Location",
  "title": "Tierra del Fuego",
  "description": "Geo-anchored anomaly site...",
  "tags": ["location", "anomaly", "sacred-site"],
  "related": ["Z015", "Z042", "Z089"]
}
```

Categories: Location, Deity, Anomaly, Artifact, Event, Concept, Entity, Keyword, eXternal

---

## File Organization

```
/zettelkasten_master/
├── index.html      # Main HTML file
├── styles.css      # Combined CSS
├── script.js       # Combined JavaScript
├── data.json       # Zettelkasten data
├── FEATURES.md     # This document
└── README.md       # Usage documentation
```
