# Fixed Navigation Iframe Embed Code

## The Problem
The mobile menu was appearing under page content because it's trapped inside an iframe with fixed 50px height.

## The Solution
The nav now sends messages to the parent window to dynamically resize the iframe when the menu opens/closes.

## Updated Iframe Embed Code

Replace your current iframe embed with this:

```html
<!-- Nav iframe at bottom -->
<iframe id="nav-iframe" src="/nav.html"
    style="position:fixed;bottom:0;left:0;width:100%;height:50px;border:none;z-index:9999;">
</iframe>

<script>
// Listen for nav menu open/close events and resize iframe
window.addEventListener('message', function(e) {
  var navFrame = document.getElementById('nav-iframe');
  if (!navFrame) return;

  if (e.data.type === 'navMenuOpen') {
    // Expand iframe to show full menu
    navFrame.style.height = e.data.height + 'px';
    navFrame.style.transition = 'height 0.2s ease';
  } else if (e.data.type === 'navMenuClose') {
    // Collapse iframe back to taskbar height
    navFrame.style.height = '50px';
  }
});
</script>
```

## What Changed

### In nav.html and win98-nav.html:
1. Mobile menu z-index increased to `2147483647 !important`
2. JavaScript sends `postMessage` to parent window when menu opens/closes
3. Menu height is calculated and sent to parent

### In your page HTML:
1. Iframe needs an `id="nav-iframe"`
2. Script listens for messages from iframe
3. Dynamically adjusts iframe height when menu opens

## Pages That Need Updating

Search your codebase for iframe embeds and update them with the new code:
- cosmos.html
- construction.html
- cavebot.html
- nabu222/zettelkasten_interface.html
- nexus/profile.html
- And any other pages using the nav iframe
