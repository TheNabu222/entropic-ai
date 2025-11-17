# Pip Buddy Scripts

This folder stores versioned Pip Buddy scripts so you can drop Pip into any page without re-copying massive inline code blocks.

## Usage

```html
<!-- Include the import map once per page -->
<script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.163.0/examples/jsm/"
    }
  }
</script>
<script type="module">
  import { initPipBuddy } from './pip/pip-buddy.js';
  initPipBuddy({
    containerId: 'bonzi-container',
    receiptId: 'pip-receipt'
  });
</script>
```

By default `pip-buddy.js` re-exports the latest version inside `pip/scripts`. If you want to lock a page to a specific version, import it directly, e.g. `import { initPipBuddy } from './pip/scripts/pip-buddy-v1.js';`.

### Mobile mode

`initPipBuddy` automatically swaps to a static preview on viewports narrower than 768px (or when the user prefers reduced motion) so Pip is still visible. Pass `mobileBreakpoint`, `mobileFallbackImage`, or `mobileCaption` to customize the experience per page.

The initializer now returns a lightweight controller:

```js
const pip = initPipBuddy();
pip.refresh(); // force a mobile/desktop re-check
pip.destroy(); // remove listeners and clean up WebGL resources
```

Desktop/mobile detection automatically re-runs on resize/orientation changes, so Pip feels native on tablets without reloading.

### Extra hooks

- `idleAnimations`: swap the looped idle animation pool.
- `autoReceiptInterval`: auto-fire receipts (in ms) so Pip keeps talking even when visitors don't click.
- `onReceipt(message)`: callback fired with the currently displayed receipt text.
- `respectReducedMotion`: defaults to `true`, forcing the static preview for people who set OS-level reduced-motion preferences.

### Receipts and models

Override the `receipts` or `modelPaths` arrays if you want Pip to print custom receipts or use alternate GLB animations.
