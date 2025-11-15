# 🎨 COAIEXIST WYSIWYG Editor - Usage Guide

## Overview
Your WYSIWYG editor is now a **MONSTER** - simple interface, maximum power! Here's everything it can do:

---

## 🚀 Quick Start

### Loading Pages
1. Click **📄 Load Page** button in toolbar
2. Choose any page from the grid (14 available!)
3. Pick your mode:
   - **📖 Load Full Page** - Complete HTML (perfect for full edits)
   - **🎯 Extract Body Only** - Just the body content (perfect for content editing)

**Available Pages:**
- index.html, construction.html, cosmos.html
- hdtv.html, hex.html, guestbook.html
- cavebot.html, punkd.html, vote_hd.html
- pip.html, dollz.html, not_found.html
- explore.html, ackk.html

---

## 💎 Component Library System

### Saving Components
1. Load any page
2. Select an element in the canvas (click it)
3. Click **💾 Save as Component** in the properties panel
4. Name your component (e.g., "Hero Section")
5. Add a category (e.g., "Headers")
6. Done! Component saved to your library

### Using Saved Components
1. Click **💎 Components** button in toolbar
2. Browse your component library
3. Click **➕ Insert** to add to current page
4. That's it! Instant reuse

### Managing Components
- **Delete**: Click 🗑️ button on any component
- **Export**: Use `exportComponentLibrary()` in console
- **Import**: Use `importComponentLibrary()` in console

---

## 📝 RTF Formatting Toolbar

### Text Formatting
- **Bold**: Ctrl+B or click **B** button
- **Italic**: Ctrl+I or click *I* button
- **Underline**: Ctrl+U or click <u>U</u> button
- **Strikethrough**: Click <s>S</s> button

### Fonts & Sizes
- **Font Family**: 8 options (Arial, Comic Sans, VT323, etc.)
- **Font Size**: 12px to 48px

### Alignment
- Left, Center, Right, Justify buttons

### Lists & Indentation
- Bullet lists, Numbered lists
- Indent, Outdent

### Colors
- Text color picker
- Background color picker

### Insert Elements
- 🔗 Links
- 🖼️ Images
- `</>` Code blocks
- 📊 Tables

### Clear Formatting
- 🧹 Remove all styles from selected element

---

## 🎯 Bulma Components (24 Total!)

### UI Components (16)
Drag from sidebar or click to add:
- 🦸 **Hero Section** - Full-width banner with CTA
- 🧭 **Navbar** - Responsive navigation
- 📐 **Columns/Grid** - 3-column layout
- 🔔 **Notification** - Alert boxes
- 💬 **Message Box** - Header + body
- 🎴 **Card** - Image + content
- 📱 **Media Object** - Avatar + content
- 📦 **Box** - Clean container
- 🏷️ **Tags** - Label tags
- 🍞 **Breadcrumb** - Navigation trail
- 📄 **Pagination** - Page navigation
- 📑 **Tabs** - Tabbed interface
- 📊 **Progress Bar** - Visual progress
- 📋 **Table** - Data table
- 🪟 **Modal** - Overlay dialog
- ⬇️ **Dropdown** - Select menu

### Form Components (8)
- ⌨️ **Input Field** - Text input
- 📝 **Textarea** - Multi-line input
- 🔽 **Select** - Dropdown
- ☑️ **Checkbox** - Checkbox with label
- 🔘 **Radio** - Radio buttons
- 🔲 **Button** - Styled button
- 📁 **File Upload** - File picker
- 🎛️ **Field Group** - Side-by-side inputs

---

## 🔧 Pro Tips

### Building a Design System
1. Load your main page (e.g., index.html)
2. Save key components:
   - Navigation bar → "Main Nav"
   - Hero section → "Homepage Hero"
   - Footer → "Site Footer"
3. Reuse across all pages for consistency!

### Modular Page Editing
1. Load page with "Extract Body Only"
2. Edit the content
3. Save favorite sections as components
4. Export HTML when done
5. Replace body content in original file

### Component Categories
Organize by type:
- **Navigation** - Navbars, menus, breadcrumbs
- **Headers** - Heroes, titles, banners
- **Content** - Cards, boxes, media objects
- **Forms** - Inputs, buttons, fields
- **Footer** - Footers, copyright, links

### Keyboard Shortcuts
- **Ctrl+B** - Bold
- **Ctrl+I** - Italic
- **Ctrl+U** - Underline
- **Ctrl+Z** - Undo (if you added it!)
- **Ctrl+Y** - Redo (if you added it!)

---

## 🎨 Workflow Examples

### Example 1: Edit Construction Page
```
1. Click "📄 Load Page"
2. Select "construction.html"
3. Click "🎯 Extract Body Only"
4. Edit text, change colors, adjust layout
5. Save favorite sections as components
6. Export HTML
```

### Example 2: Build Component Library
```
1. Load each page one by one
2. Save best components from each:
   - Cosmos.html → Save starfield background
   - HDTV.html → Save game interface
   - Guestbook.html → Save comment form
3. Mix and match in new pages!
```

### Example 3: Consistent Site-Wide Update
```
1. Load index.html
2. Update navbar design
3. Save as "Main Navbar v2"
4. Load each other page
5. Delete old navbar
6. Insert "Main Navbar v2"
7. Export all pages
```

---

## 🚨 Troubleshooting

**Component not saving?**
- Make sure element is selected (has selection outline)
- Check localStorage isn't full
- Try exporting/importing library to reset

**Page not loading?**
- Check browser console for errors
- Verify page exists in PAGE_SOURCES list
- Try "Extract Body Only" mode instead

**RTF buttons not working?**
- Select an element first
- Some styles only work on text elements
- Check element isn't locked/protected

---

## 💾 Backup & Export

### Export Your Component Library
```javascript
exportComponentLibrary()
```
Downloads `component-library.json` file.

### Import Component Library
```javascript
importComponentLibrary()
```
Opens file picker to import components.

### Export Page HTML
1. Click **💾 Export** button in toolbar
2. Copy HTML code
3. Save to file or use directly

---

## 🎉 You're Ready!

Your WYSIWYG is now a complete design system builder:
- ✅ Load any page from source (no CORS!)
- ✅ Save & reuse components
- ✅ Full RTF formatting
- ✅ 24 Bulma components
- ✅ Modular editing workflow
- ✅ Component library persistence

**Happy building!** 🚀✨
