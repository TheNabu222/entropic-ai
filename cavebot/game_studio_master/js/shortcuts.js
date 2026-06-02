/* ===== KEYBOARD SHORTCUTS ===== */
const Shortcuts = {
  init() {
    document.addEventListener('keydown', (e) => this.handle(e));
  },

  handle(e) {
    // Don't handle if typing in an input
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (State.isPreviewMode) {
      if (e.key === 'Escape') { Preview.exit(); e.preventDefault(); }
      return;
    }

    const ctrl = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;

    // Ctrl+S - Save
    if (ctrl && e.key === 's') {
      e.preventDefault();
      Project.saveProject();
      return;
    }

    // Ctrl+Z - Undo
    if (ctrl && !shift && e.key === 'z') {
      e.preventDefault();
      if (State.undo()) Project.refreshAll();
      return;
    }

    // Ctrl+Shift+Z or Ctrl+Y - Redo
    if ((ctrl && shift && e.key === 'z') || (ctrl && e.key === 'y')) {
      e.preventDefault();
      if (State.redo()) Project.refreshAll();
      return;
    }

    // Ctrl+D - Duplicate
    if (ctrl && e.key === 'd') {
      e.preventDefault();
      Canvas.duplicateSelected();
      return;
    }

    // Delete / Backspace
    if (e.key === 'Delete' || e.key === 'Backspace') {
      Canvas.deleteSelected();
      return;
    }

    // Arrow keys - Nudge
    const nudgeAmt = shift ? 10 : 1;
    if (e.key === 'ArrowLeft') { e.preventDefault(); Canvas.nudge(-nudgeAmt, 0); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); Canvas.nudge(nudgeAmt, 0); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); Canvas.nudge(0, -nudgeAmt); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); Canvas.nudge(0, nudgeAmt); return; }

    // G - Toggle grid
    if (e.key === 'g' || e.key === 'G') { Canvas.toggleGrid(); return; }

    // P - Preview
    if (e.key === 'p' || e.key === 'P') { Preview.enter(); return; }

    // Escape - Deselect / Cancel hitbox
    if (e.key === 'Escape') {
      if (State.isDrawingHitbox) { Hitbox.cancelDraw(); }
      else {
        State.selectedObjectId = null;
        Canvas.renderScene();
        Properties.update();
        Layers.render();
      }
      return;
    }

    // [ / ] - Layer order
    if (e.key === '[') { const obj = State.getSelectedObject(); if (obj) Layers.moveDown(obj.id); Canvas.renderScene(); Layers.render(); }
    if (e.key === ']') { const obj = State.getSelectedObject(); if (obj) Layers.moveUp(obj.id); Canvas.renderScene(); Layers.render(); }
  },
};
