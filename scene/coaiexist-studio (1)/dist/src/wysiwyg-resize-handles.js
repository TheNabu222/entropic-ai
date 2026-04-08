// ====
// WYSIWYG ENHANCEMENTS: RESIZE HANDLES & INLINE EDITING
// Drag-resize handles + contenteditable integration
// ====

(function() {
  'use strict';

  let activeHandle = null;
  let startX, startY, startWidth, startHeight, startLeft, startTop;
  let resizeTarget = null;

  function createResizeHandles(element) {
    if (!element || element.querySelector('.resize-handles')) return;

    const handles = document.createElement('div');
    handles.className = 'resize-handles';
    handles.innerHTML = `
      <div class="resize-handle nw" data-handle="nw"></div>
      <div class="resize-handle n" data-handle="n"></div>
      <div class="resize-handle ne" data-handle="ne"></div>
      <div class="resize-handle e" data-handle="e"></div>
      <div class="resize-handle se" data-handle="se"></div>
      <div class="resize-handle s" data-handle="s"></div>
      <div class="resize-handle sw" data-handle="sw"></div>
      <div class="resize-handle w" data-handle="w"></div>
    `;
    element.appendChild(handles);
  }

  function removeResizeHandles(element) {
    if (!element) return;
    const handles = element.querySelector('.resize-handles');
    if (handles) handles.remove();
  }

  function initResizeHandlers(doc) {
    if (!doc) return;

    // Add resize handle styles to iframe
    if (!doc.getElementById('resize-handle-styles')) {
      const style = doc.createElement('style');
      style.id = 'resize-handle-styles';
      style.textContent = `
        .resize-handles {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
        }

        .resize-handle {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #00f0ff;
          border: 2px solid #fff;
          border-radius: 50%;
          pointer-events: all;
          z-index: 10000;
          box-shadow: 0 0 5px rgba(0, 240, 255, 0.5);
          transition: transform 0.1s, background 0.1s;
        }

        .resize-handle:hover {
          background: #ff00cc;
          transform: scale(1.3);
          box-shadow: 0 0 10px rgba(255, 0, 204, 0.7);
        }

        .resize-handle.nw { top: -5px; left: -5px; cursor: nw-resize; }
        .resize-handle.n { top: -5px; left: 50%; transform: translateX(-50%); cursor: n-resize; }
        .resize-handle.ne { top: -5px; right: -5px; cursor: ne-resize; }
        .resize-handle.e { top: 50%; right: -5px; transform: translateY(-50%); cursor: e-resize; }
        .resize-handle.se { bottom: -5px; right: -5px; cursor: se-resize; }
        .resize-handle.s { bottom: -5px; left: 50%; transform: translateX(-50%); cursor: s-resize; }
        .resize-handle.sw { bottom: -5px; left: -5px; cursor: sw-resize; }
        .resize-handle.w { top: 50%; left: -5px; transform: translateY(-50%); cursor: w-resize; }

        .resize-handle.n:hover, .resize-handle.s:hover { transform: translateX(-50%) scale(1.3); }
        .resize-handle.e:hover, .resize-handle.w:hover { transform: translateY(-50%) scale(1.3); }

        /* Inline editing styles */
        .canvas-el[contenteditable="true"] {
          outline: 2px dashed #ff00cc !important;
          outline-offset: 2px;
          cursor: text !important;
        }

        .canvas-el[contenteditable="true"]:focus {
          outline: 2px solid #ff00cc !important;
          box-shadow: 0 0 15px rgba(255, 0, 204, 0.3);
        }
      `;
      doc.head.appendChild(style);
    }

    // Handle resize start
    doc.addEventListener('mousedown', (e) => {
      const handle = e.target.closest('.resize-handle');
      if (!handle) return;

      e.preventDefault();
      e.stopPropagation();

      activeHandle = handle.dataset.handle;
      resizeTarget = handle.closest('.canvas-el');

      if (!resizeTarget) return;

      const rect = resizeTarget.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startWidth = rect.width;
      startHeight = rect.height;
      startLeft = resizeTarget.offsetLeft;
      startTop = resizeTarget.offsetTop;

      doc.addEventListener('mousemove', handleResize);
      doc.addEventListener('mouseup', stopResize);
    });

    // Enable inline editing on double-click
    doc.addEventListener('dblclick', (e) => {
      const el = e.target.closest('.canvas-el');
      if (!el) return;

      // Only enable for text-containing elements
      const isTextElement = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'DIV', 'BLOCKQUOTE', 'LI'].includes(el.tagName);
      if (!isTextElement && !el.textContent.trim()) return;

      enableInlineEditing(el);
    });
  }

  function handleResize(e) {
    if (!activeHandle || !resizeTarget) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let newWidth = startWidth;
    let newHeight = startHeight;
    let newLeft = startLeft;
    let newTop = startTop;

    switch (activeHandle) {
      case 'e':
        newWidth = Math.max(20, startWidth + dx);
        break;
      case 'w':
        newWidth = Math.max(20, startWidth - dx);
        newLeft = startLeft + dx;
        break;
      case 's':
        newHeight = Math.max(20, startHeight + dy);
        break;
      case 'n':
        newHeight = Math.max(20, startHeight - dy);
        newTop = startTop + dy;
        break;
      case 'se':
        newWidth = Math.max(20, startWidth + dx);
        newHeight = Math.max(20, startHeight + dy);
        break;
      case 'sw':
        newWidth = Math.max(20, startWidth - dx);
        newLeft = startLeft + dx;
        newHeight = Math.max(20, startHeight + dy);
        break;
      case 'ne':
        newWidth = Math.max(20, startWidth + dx);
        newHeight = Math.max(20, startHeight - dy);
        newTop = startTop + dy;
        break;
      case 'nw':
        newWidth = Math.max(20, startWidth - dx);
        newLeft = startLeft + dx;
        newHeight = Math.max(20, startHeight - dy);
        newTop = startTop + dy;
        break;
    }

    resizeTarget.style.width = newWidth + 'px';
    resizeTarget.style.height = newHeight + 'px';

    if (resizeTarget.style.position === 'absolute') {
      resizeTarget.style.left = newLeft + 'px';
      resizeTarget.style.top = newTop + 'px';
    }
  }

  function stopResize() {
    if (resizeTarget) {
      // Save state
      if (window.saveState) window.saveState();
      if (window.coaiexistStore) {
        window.coaiexistStore.updateActivePage({});
      }
    }

    activeHandle = null;
    resizeTarget = null;

    const doc = window.getCanvasDoc && window.getCanvasDoc();
    if (doc) {
      doc.removeEventListener('mousemove', handleResize);
      doc.removeEventListener('mouseup', stopResize);
    }
  }

  function enableInlineEditing(el) {
    if (!el) return;

    // Remove resize handles while editing
    removeResizeHandles(el);

    el.contentEditable = 'true';
    el.focus();

    // Select all text
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = el.ownerDocument.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    // Blur handler to sync
    const handleBlur = () => {
      el.contentEditable = 'false';
      el.removeEventListener('blur', handleBlur);

      // Re-add resize handles if still selected
      if (el.classList.contains('selected')) {
        createResizeHandles(el);
      }

      // Save state
      if (window.saveState) window.saveState();
      if (window.coaiexistStore) {
        window.coaiexistStore.updateActivePage({});
      }

      if (window.moodBar) {
        window.moodBar.setMood('✏️ Text updated.', false, 2000);
      }
    };

    el.addEventListener('blur', handleBlur);

    // Handle Escape to cancel
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        el.blur();
      }
    });
  }

  // Hook into selection system
  function hookIntoSelection() {
    // Override or extend selectElement function
    const originalSelectEl = window.selectElement;
    window.selectElement = function(el) {
      // Remove handles from previously selected
      const doc = window.getCanvasDoc && window.getCanvasDoc();
      if (doc) {
        doc.querySelectorAll('.resize-handles').forEach(h => h.remove());
      }

      // Call original
      if (originalSelectEl) originalSelectEl(el);

      // Add handles to new selection
      if (el && el.classList.contains('canvas-el')) {
        // Ensure element is positioned
        const computed = window.getComputedStyle(el);
        if (computed.position === 'static') {
          el.style.position = 'relative';
        }
        createResizeHandles(el);
      }
    };
  }

  // Initialize when iframe loads
  function init() {
    const iframe = document.getElementById('canvas-frame');
    if (!iframe) {
      setTimeout(init, 500);
      return;
    }

    iframe.addEventListener('load', () => {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      initResizeHandlers(doc);
    });

    // Initialize for current document
    if (iframe.contentDocument) {
      initResizeHandlers(iframe.contentDocument);
    }

    hookIntoSelection();
  }

  // Global API
  window.resizeHandles = {
    create: createResizeHandles,
    remove: removeResizeHandles,
    enableEditing: enableInlineEditing
  };

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('📐 WYSIWYG Resize Handles loaded!');
})();
