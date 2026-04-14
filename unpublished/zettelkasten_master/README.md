# 🏛️ Nabu Archive - Master Zettelkasten

A unified, static Zettelkasten knowledge management system combining features from multiple source implementations. Designed for **Neocities** deployment (pure HTML/CSS/JS, no server required).

![Nabu Archive](https://img.shields.io/badge/Version-1.0-ff72b6)
![Neocities Compatible](https://img.shields.io/badge/Neocities-Compatible-72FADE)
![Static Site](https://img.shields.io/badge/Type-Static%20Site-fffb01)

## ✨ Features

### 🖥️ Desktop Interface
- **Windows 98/XP hybrid aesthetic** with draggable, resizable windows
- **Taskbar** with Start menu, running applications, and system clock
- **Desktop icons** for quick access to main features
- **Mobile responsive** with toggle button for mobile/desktop modes
- **Vaporwave/Y2K color scheme** (cyan, magenta, yellow)

### 📜 Tablet Browser
- **List view** - Simple card-based display of all tablets
- **Hierarchy view** - Organized by ID prefixes with visual indentation
- **Category filtering** - Filter by Location, Deity, Anomaly, etc.
- **Tag filtering** - Filter by any tag in the system
- **Click-to-view** detailed tablet information

### 🕸️ Network Graph
- **Visual node-based representation** of tablets and their connections
- **Draggable nodes** - Arrange the graph as you like
- **Toggle options** for labels and connection lines
- **Interactive** - Click nodes to view details

### 📊 System Health Dashboard
- **Statistics overview**: Total tablets, connections, categories, orphans
- **Category distribution chart** with color-coded bars
- **Profile header** with MySpace-style aesthetic
- **Real-time updates** as data changes

### ✨ Tablet Creator
- **Create new tablets** with ID, category, title, description
- **Add tags** (comma-separated)
- **Link to related tablets** by ID
- **Duplicate ID prevention**

### 💾 Data Manager
- **Import JSON files** (drag & drop or click to upload)
- **Export to JSON** for backup or sharing
- **Browser localStorage** for persistent storage
- **Backup creation** with timestamped filenames

### 🔍 Search
- **Full-text search** across titles, descriptions, and tags
- **Configurable search scope** with checkboxes
- **Instant results** displayed as clickable cards

## 📁 File Structure

```
/zettelkasten_master/
├── index.html      # Main HTML file
├── styles.css      # All CSS styles
├── script.js       # All JavaScript functionality
├── data.json       # Default Zettelkasten data
├── FEATURES.md     # Detailed feature analysis
└── README.md       # This file
```

## 🚀 Quick Start

### Local Development
1. Clone or download this folder
2. Open `index.html` in any modern browser
3. That's it! No build tools or servers required.

### Neocities Deployment
1. Create a new site on [Neocities](https://neocities.org)
2. Upload all files from this folder
3. Your Zettelkasten is live!

### Loading Your Data
1. Click the **Database** desktop icon or Start → Data Manager
2. Drag and drop your JSON file into the upload zone
3. Your tablets will appear in the Tablet Browser

## 📋 Data Format

The system expects JSON data in this format:

```json
[
  {
    "id": "Z001",
    "category": "Location",
    "title": "Tierra del Fuego",
    "description": "Geo-anchored anomaly site...",
    "tags": ["location", "anomaly", "sacred-site"],
    "related": ["Z015", "Z042"]
  }
]
```

### Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (e.g., Z001, L002, D003) |
| `category` | string | Yes | One of: Location, Deity, Anomaly, Artifact, Event, Concept, Entity, Keyword, eXternal |
| `title` | string | Yes | Display title |
| `description` | string | No | Full description text |
| `tags` | array | No | Array of tag strings |
| `related` | array | No | Array of related tablet IDs |

## 🎨 Customization

### Colors
Edit the CSS variables in `styles.css`:

```css
:root {
  --cyan: #72FADE;
  --magenta: #ff72b6;
  --yellow: #fffb01;
  --purple: #bf5fff;
  --bg-dark: #0d0221;
}
```

### Categories
Add new categories in `script.js` (createTabletForm select) and `styles.css` (color classes).

## 🔧 Browser Compatibility
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (with mobile mode)

## 📜 Credits

This unified system combines features from:
- **zettl.html** - Windows 98 Edition
- **index 3.html** - Windows XP Edition (Bureau Auto-Organizer)
- **entropindex** - Entropic Consciousness Desktop
- **kettlekorn_visualizer** - Visual Zettelkasten concepts
- **Nabu Archive** styling and data format

## 📝 Hierarchy System

The Zettelkasten follows a hierarchical organization:

| Level | Symbol | Description |
|-------|--------|-------------|
| **Trunk** | 🌳 | Major domains/categories (1000-level) |
| **Branch** | 🌿 | Major subdivisions (1100-level) |
| **Leaf** | 🍃 | Specific concepts (1100/1) |
| **Flower** | 🌸 | Details/nuances (1100/1-A) |
| **Fruit** | 🍎 | Applied examples (1100/1-A-1) |
| **Bud** | 🌱 | Micro-entries/questions (1100/1-A-1/1a) |

## 🔐 Privacy

- All data is stored **locally in your browser**
- No data is sent to any server
- Export/backup your data regularly!

---

<div align="center">
  <p>✧･ﾟ: *✧･ﾟ Built with 💜 for knowledge preservation ✧･ﾟ: *✧･ﾟ</p>
  <p><sub>Nabu Archive v1.0 | Neocities Compatible</sub></p>
</div>
