# GoatCounter Setup Guide for coaiexist.wtf

Complete reference for implementing GoatCounter analytics across the site.

## Basic Setup

### Method 1: Simple Script Tag (Recommended for most pages)

Add this script tag before the closing `</body>` tag:

```html
<script data-goatcounter="https://coaiexist.goatcounter.com/count"
        async
        src="//gc.zgo.at/count.js"></script>
```

**Where to use:** Static pages, simple HTML files

**Example files using this method:**
- `bc7f2a/mercy_egg_v1.html`
- `nexus/index.html`

---

### Method 2: Dynamic Script Loading (For iframes and dynamic content)

Use this JavaScript approach when you need more control:

```javascript
(function() {
  'use strict';
  var path;
  try {
    // Get the current page path (or parent page if in iframe)
    path = window.parent.location.pathname;
  } catch(e) {
    path = location.pathname || '/';
  }

  // Create and configure the GoatCounter script
  var gc = document.createElement('script');
  gc.setAttribute('data-goatcounter', 'https://coaiexist.goatcounter.com/count');
  gc.setAttribute('data-goatcounter-settings', JSON.stringify({
      path: path,
      event: false  // Set to true if you want to track events
  }));
  gc.src = '//gc.zgo.at/count.js';
  gc.async = true;
  document.head.appendChild(gc);
})();
```

**Where to use:** Navigation bars (iframes), dynamic pages

**Example files using this method:**
- `nav.html` (main navigation)
- `admin/navbars/terminal-nav.html`

---

## Tracking Custom Events with data-goatcounter-click

Once the GoatCounter script is loaded, you can track button/link clicks by adding data attributes.

### Basic Click Tracking

Add `data-goatcounter-click` to any link or button:

```html
<a href="https://coaiexist.wtf/maps/gateway"
   data-goatcounter-click="nav-worlds">
   🗿 WORLDS
</a>
```

### Click Tracking with Custom Title

Add both attributes for more detailed tracking:

```html
<a href="https://coaiexist.wtf"
   data-goatcounter-click="nav-start"
   data-goatcounter-title="START button clicked">
   ⊞ START
</a>
```

### Naming Convention for Tracking IDs

Use descriptive, kebab-case names:

- `nav-` prefix for navigation buttons
- Describe the destination or action
- Examples:
  - `nav-start` - Start/home button
  - `nav-worlds` - Link to worlds/gateway
  - `nav-hex-codex` - Link to hex codex
  - `nav-back-to-main` - Back to main site button

---

## Implementation Examples

### Win98 Navbar (admin/navbars/win98-nav.html)

```html
<nav class="win98-taskbar">
  <a href="https://coaiexist.wtf"
     class="taskbar-start"
     data-goatcounter-click="nav-start">⊞ START</a>

  <a href="https://coaiexist.wtf/hex"
     class="taskbar-button"
     data-goatcounter-click="nav-hex-codex">🎨 HEX CODEX</a>

  <a href="https://coaiexist.wtf/maps/gateway"
     class="taskbar-button"
     data-goatcounter-click="nav-worlds">🗿 WORLDS</a>
</nav>
```

### Cyberpunk Navbar (admin/navbars/cyberpunk-nav.html)

```html
<nav class="cyber-nav">
  <a href="https://coaiexist.wtf"
     class="cyber-btn cyber-start"
     data-goatcounter-click="nav-start">⊞ START</a>

  <a href="https://coaiexist.wtf"
     class="cyber-btn cyber-back"
     data-goatcounter-click="nav-back-to-main">↩ MAIN SITE</a>

  <a href="/bc7f2a/testaments/sypher.html"
     class="cyber-btn"
     data-goatcounter-click="nav-sypher">🌃 SYPHER</a>
</nav>
```

### Dynamic JavaScript Navigation (admin/navbars/deepseek-nav.js)

```javascript
const navHTML = `
<nav class="deepseek-nav">
  <a href="index.html"
     class="nav-brand"
     data-goatcounter-click="nav-deepseek-home">
    <span class="brand-icon">⎔</span>
    <span>DEEPSEEK</span>
  </a>

  <div class="nav-links">
    <a href="cephalopod_slide.html"
       class="nav-link"
       data-goatcounter-click="nav-cephalopod-slide">Cephalopod Slide</a>
    <a href="haunted-ai.html"
       class="nav-link"
       data-goatcounter-click="nav-haunted-ai">Haunted AI</a>
  </div>
</nav>
`;
```

---

## Complete Page Template

Here's a complete HTML page template with GoatCounter:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Your Page Title</title>
</head>
<body>

  <!-- Your content here -->
  <nav>
    <a href="/" data-goatcounter-click="nav-home">Home</a>
    <a href="/about" data-goatcounter-click="nav-about">About</a>
  </nav>

  <!-- GoatCounter script at the end of body -->
  <script data-goatcounter="https://coaiexist.goatcounter.com/count"
          async
          src="//gc.zgo.at/count.js"></script>

</body>
</html>
```

---

## Files Updated with GoatCounter Tracking

### Navigation Theme Files (navbars/themes/)
✅ Template theme - `navbars/themes/template/nav.js` + `config.js`
✅ Cyberpunk theme - `navbars/themes/cyberpunk/nav.js`
✅ Terminal theme - `navbars/themes/terminal/nav.js`
✅ Vaporwave theme - `navbars/themes/vaporwave/nav.js`

### Admin Navigation Files (admin/navbars/)
✅ `admin/navbars/win98-nav.html` - Windows 98 taskbar
✅ `admin/navbars/cyberpunk-nav.html` - Cyberpunk navigation
✅ `admin/navbars/terminal-nav.html` - Terminal style navigation
✅ `admin/navbars/vaporwave-nav.html` - Vaporwave aesthetic navigation
✅ `admin/navbars/enhenduanna-nav.html` - Ancient/divine themed navigation
✅ `admin/navbars/deepseek-nav.js` - Abyssal/deep sea navigation

---

## Testing Your Implementation

1. **Load your page** with the GoatCounter script
2. **Open browser console** and check for errors
3. **Click tracked links** and watch the network tab for requests to `coaiexist.goatcounter.com`
4. **Visit your dashboard** at https://coaiexist.goatcounter.com to see tracked events

---

## Advanced: Programmatic Event Tracking

If you need to track events without links (like JavaScript interactions):

```javascript
if (window.goatcounter) {
  window.goatcounter.count({
    path: function(p) { return 'custom-event-' + p },
    title: 'Custom Event Triggered',
    event: true
  });
}
```

---

## Dashboard Access

Visit your GoatCounter dashboard:
**https://coaiexist.goatcounter.com**

All tracked events and page views will appear there in real-time.

---

## Quick Reference

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `data-goatcounter-click` | Track link clicks | `nav-worlds` |
| `data-goatcounter-title` | Custom event description | `"Navigated to WORLDS"` |
| `data-goatcounter-referrer` | Override referrer | `"https://example.com"` |

---

**Last Updated:** 2025-01-14
**Site:** coaiexist.wtf
**GoatCounter Instance:** https://coaiexist.goatcounter.com
