# 🎨 COAIEXIST.WTF Custom Navigation System

A modular system for creating themed taskbars/navigation bars for different directories.

## 📁 Directory Structure

```
navbars/
├── themes/
│   ├── windows98/        - Classic Windows 98 (used on main site)
│   ├── medieval/          - Medieval Windows 1100 AD (used in /pea)
│   ├── cyberpunk/         - Neon cyberpunk theme
│   ├── retro-mac/         - Classic Macintosh theme
│   ├── vaporwave/         - A E S T H E T I C theme
│   └── terminal/          - Hacker terminal theme
└── README.md
```

## 🚀 Quick Start

### 1. Choose a Theme

Each theme folder contains:
- `nav.css` - The styling
- `nav.js` - The functionality
- `config.js` - Navigation links configuration

### 2. Add to Your HTML

Add these two lines to the `<head>` section of your page:

```html
<link rel="stylesheet" href="https://coaiexist.wtf/navbars/themes/THEME-NAME/nav.css">
<script src="https://coaiexist.wtf/navbars/themes/THEME-NAME/nav.js"></script>
```

### 3. Customize the Links

Edit `config.js` in your chosen theme to add/remove navigation links:

```javascript
const navConfig = {
    mainSite: 'https://coaiexist.wtf/',
    baseUrl: 'https://coaiexist.wtf/your-directory/',
    title: '🎮 YOUR SECTION NAME',
    links: [
        { title: 'Home', url: 'index.html', icon: '🏠' },
        { title: 'About', url: 'about.html', icon: '📖' }
    ]
};
```

## 🎨 Creating Your Own Theme

### Step 1: Copy a Template

```bash
cp -r navbars/themes/template navbars/themes/my-new-theme
```

### Step 2: Customize the CSS

Edit `nav.css` to change:
- Colors
- Fonts
- Button styles
- Animations

### Step 3: Update config.js

Add your navigation links and customize the behavior.

### Step 4: Test!

Add the theme to a page and refresh to see your changes.

## 🔧 Theme Customization Guide

### Colors

Each theme uses CSS custom properties (variables) for easy color changes:

```css
:root {
    --taskbar-bg: #your-color;
    --taskbar-text: #your-color;
    --button-bg: #your-color;
    --button-hover: #your-color;
}
```

### Fonts

Recommended font stacks:
- **Retro/Terminal**: `'VT323', 'Courier New', monospace`
- **Medieval**: `'IM Fell English', 'UnifrakturCook', serif`
- **Modern**: `'Arial', 'Helvetica', sans-serif`
- **Cyberpunk**: `'Orbitron', 'Rajdhani', sans-serif`

### Layout Options

- **Bottom Bar**: Classic taskbar at bottom (Windows style)
- **Top Bar**: Modern navigation at top
- **Side Bar**: Vertical navigation on left/right
- **Floating**: Positioned overlay with transparency

## 📝 Examples

### Windows 98 (Main Site)
- Fixed bottom taskbar
- Outset borders
- Page counter integration
- Active page highlighting

### Medieval Windows 1100 AD (/pea directory)
- Gold/brown color scheme
- Gothic fonts
- START menu with custom messages
- Decorative borders

## 🎯 Theme Ideas

- **Y2K Bubblegum**: Pink/purple gradients, rounded buttons
- **Matrix**: Green text on black, falling characters
- **Vaporwave**: Pink/cyan gradients, Greek statues
- **MS-DOS**: Pure text, no graphics
- **Windows XP**: Blue/green, rounded corners
- **Geocities**: Rainbow gradients, under construction GIFs
- **Hacker Terminal**: Green phosphor, command prompt style
- **Retro Mac**: Platinum gray, Chicago font

## 💡 Pro Tips

1. **Keep it fast**: Minimize file size for quick loading
2. **Mobile friendly**: Test on different screen sizes
3. **Accessible**: Include proper ARIA labels
4. **Consistent**: Match the theme to your page content
5. **Fun**: Add easter eggs and animations!

---

**Need help?** Check the existing themes for examples or experiment with the template!
