/* ===== UTILS ===== */
const Utils = {
  uid: () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8),

  clamp: (val, min, max) => Math.max(min, Math.min(max, val)),

  debounce(fn, ms = 150) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  },

  fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  },

  download(content, filename, type = 'application/json') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  sanitizeName(name) {
    return name.replace(/[^a-zA-Z0-9_\- ]/g, '').trim() || 'unnamed';
  },

  // Angle from center of element to mouse position
  angleBetween(cx, cy, mx, my) {
    return Math.atan2(my - cy, mx - cx) * (180 / Math.PI);
  }
};
