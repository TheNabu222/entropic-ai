# 🚀 Quick Start Guide

## Choose Your Theme

We have 4 custom themes ready to use:

### 1. 🌃 **Cyberpunk** - Neon dystopian future
```html
<link rel="stylesheet" href="https://coaiexist.wtf/navbars/themes/cyberpunk/nav.css">
<script src="https://coaiexist.wtf/navbars/themes/cyberpunk/config.js"></script>
<script src="https://coaiexist.wtf/navbars/themes/cyberpunk/nav.js"></script>
```

**Colors:** Pink/Cyan neon, dark backgrounds
**Style:** Futuristic, glowing borders, hologram effects
**Best for:** Tech projects, gaming sections, experimental content

---

### 2. 🌴 **Vaporwave** - A E S T H E T I C
```html
<link rel="stylesheet" href="https://coaiexist.wtf/navbars/themes/vaporwave/nav.css">
<script src="https://coaiexist.wtf/navbars/themes/vaporwave/config.js"></script>
<script src="https://coaiexist.wtf/navbars/themes/vaporwave/nav.js"></script>
```

**Colors:** Pink/purple/cyan gradients, bright pastels
**Style:** Retro 80s/90s aesthetic, glossy buttons, grid backgrounds
**Best for:** Art galleries, music pages, chill zones

---

### 3. 💻 **Terminal** - Hacker green screen
```html
<link rel="stylesheet" href="https://coaiexist.wtf/navbars/themes/terminal/nav.css">
<script src="https://coaiexist.wtf/navbars/themes/terminal/config.js"></script>
<script src="https://coaiexist.wtf/navbars/themes/terminal/nav.js"></script>
```

**Colors:** Classic green phosphor on black
**Style:** Monospace fonts, CRT effects, blinking cursor
**Best for:** Developer sections, code pages, system utilities

---

### 4. 📝 **Template** - Blank canvas (Windows 98 style base)
```html
<link rel="stylesheet" href="https://coaiexist.wtf/navbars/themes/template/nav.css">
<script src="https://coaiexist.wtf/navbars/themes/template/config.js"></script>
<script src="https://coaiexist.wtf/navbars/themes/template/nav.js"></script>
```

**Colors:** Gray/white (customizable via CSS variables)
**Style:** Clean, minimal, easy to customize
**Best for:** Starting point for creating your own theme

---

## Customizing Links

Edit the `config.js` file in your chosen theme:

```javascript
const navConfig = {
    baseUrl: 'https://coaiexist.wtf/YOUR-DIRECTORY/',
    title: '🎮 YOUR TITLE HERE',

    links: [
        { title: 'Page 1', url: 'page1.html', icon: '🏠' },
        { title: 'Page 2', url: 'page2.html', icon: '📖' }
    ]
};
```

---

## Copy & Modify

Want to create your own theme?

```bash
cp -r navbars/themes/template navbars/themes/my-theme
```

Then edit:
- `config.js` - Your navigation links
- `nav.css` - Change colors, fonts, styles
- `nav.js` - Modify behavior (usually don't need to change)

---

## Examples

**Existing themes in use:**
- `/` (main site) - Windows 98 style (nav.html)
- `/pea` directory - Medieval Windows 1100 AD

**New themes ready to deploy:**
- `/cyber` - Cyberpunk theme
- `/vapor` - Vaporwave theme
- `/terminal` - Terminal theme

---

## Need Help?

Check the full documentation in `README.md` or look at the existing themes for examples!
