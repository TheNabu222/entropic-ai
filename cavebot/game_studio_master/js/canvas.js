/* ===== CANVAS / STAGE MODULE ===== */
const Canvas = {
  stage: null,
  wrapper: null,
  grid: null,
  handles: null,
  statusPos: null,
  statusCount: null,

  // Drag state
  dragOffset: { x: 0, y: 0 },
  resizeDir: null,
  resizeStart: null,
  rotateStart: null,

  init() {
    this.stage = document.getElementById('stage');
    this.wrapper = document.getElementById('canvas-wrapper');
    this.grid = document.getElementById('canvas-grid');
    this.handles = document.getElementById('transform-handles');
    this.statusPos = document.getElementById('status-cursor-pos');
    this.statusCount = document.getElementById('status-object-count');

    this.applyCanvasSize();

    // Stage click - select or deselect
    this.stage.addEventListener('mousedown', (e) => this.onStageMouseDown(e));
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('mouseup', (e) => this.onMouseUp(e));

    // Drop from asset gallery
    this.stage.addEventListener('dragover', (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
    this.stage.addEventListener('drop', (e) => this.onDrop(e));

    // Track cursor position
    this.wrapper.addEventListener('mousemove', (e) => {
      const rect = this.stage.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);
      this.statusPos.textContent = `X: ${x} Y: ${y}`;
    });

    // Context menu
    this.stage.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showContextMenu(e);
    });
  },

  applyCanvasSize() {
    this.stage.style.width = State.project.canvasWidth + 'px';
    this.stage.style.height = State.project.canvasHeight + 'px';
  },

  onDrop(e) {
    e.preventDefault();
    const assetId = e.dataTransfer.getData('text/plain');
    if (!assetId) return;

    const rect = this.stage.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    State.pushUndo();
    const asset = State.project.assets.find(a => a.id === assetId);
    if (!asset) return;

    // Center object on drop position
    const obj = State.createObject(assetId, x - Math.round(asset.width / 2), y - Math.round(asset.height / 2));
    if (obj) {
      State.selectedObjectId = obj.id;
      this.renderScene();
      Layers.render();
      Properties.update();
      State.autoSave();
    }
  },

  onStageMouseDown(e) {
    if (State.isDrawingHitbox) return;

    const objEl = e.target.closest('.stage-object');

    if (!objEl) {
      // Clicked empty space
      State.selectedObjectId = null;
      this.renderScene();
      Properties.update();
      Layers.render();
      return;
    }

    const objId = objEl.dataset.id;
    const obj = State.getObject(objId);
    if (!obj || obj.locked) return;

    State.selectedObjectId = objId;
    this.renderScene();
    Properties.update();
    Layers.render();

    // Start drag
    const rect = this.stage.getBoundingClientRect();
    this.dragOffset.x = e.clientX - rect.left - obj.x;
    this.dragOffset.y = e.clientY - rect.top - obj.y;
    State.isDragging = true;
    State.pushUndo();
  },

  onMouseMove(e) {
    if (State.isDragging) {
      const obj = State.getSelectedObject();
      if (!obj) return;
      const rect = this.stage.getBoundingClientRect();
      let newX = Math.round(e.clientX - rect.left - this.dragOffset.x);
      let newY = Math.round(e.clientY - rect.left - this.dragOffset.y + rect.left - rect.top);

      // Recalculate properly
      newX = Math.round(e.clientX - rect.left - this.dragOffset.x);
      newY = Math.round(e.clientY - rect.top - this.dragOffset.y);

      if (State.snapEnabled) {
        newX = Math.round(newX / State.snapSize) * State.snapSize;
        newY = Math.round(newY / State.snapSize) * State.snapSize;
      }

      obj.x = newX;
      obj.y = newY;
      this.updateObjectElement(obj);
      this.updateHandles();
      Properties.updateTransformFields();
    }

    if (State.isResizing && this.resizeStart) {
      this.doResize(e);
    }

    if (State.isRotating && this.rotateStart) {
      this.doRotate(e);
    }
  },

  onMouseUp(e) {
    if (State.isDragging) {
      State.isDragging = false;
      State.autoSave();
    }
    if (State.isResizing) {
      State.isResizing = false;
      this.resizeStart = null;
      State.autoSave();
    }
    if (State.isRotating) {
      State.isRotating = false;
      this.rotateStart = null;
      State.autoSave();
    }
  },

  // ---- Render ----
  renderScene() {
    const scene = State.getActiveScene();
    if (!scene) {
      this.stage.innerHTML = '';
      this.handles.hidden = true;
      this.statusCount.textContent = 'Objects: 0';
      return;
    }

    this.stage.style.background = scene.bgColor || 'transparent';

    // Sort by zIndex
    const sorted = [...scene.objects].sort((a, b) => a.zIndex - b.zIndex);

    this.stage.innerHTML = '';
    for (const obj of sorted) {
      if (!obj.visible) continue;
      const asset = State.project.assets.find(a => a.id === obj.assetId);
      if (!asset) continue;

      const el = document.createElement('div');
      el.className = 'stage-object' + (obj.id === State.selectedObjectId ? ' selected' : '') + (obj.locked ? ' locked' : '');
      el.dataset.id = obj.id;
      this.applyObjectStyle(el, obj);

      const img = document.createElement('img');
      img.src = asset.dataURL;
      img.alt = obj.name;
      img.draggable = false;
      el.appendChild(img);
      this.stage.appendChild(el);
    }

    this.statusCount.textContent = `Objects: ${scene.objects.length}`;
    document.getElementById('status-scene-name').textContent = scene.name;
    this.updateHandles();
    Hitbox.render();
  },

  applyObjectStyle(el, obj) {
    const scaleX = obj.flipX ? -1 : 1;
    const scaleY = obj.flipY ? -1 : 1;
    el.style.cssText = `
      left: ${obj.x}px;
      top: ${obj.y}px;
      width: ${obj.width}px;
      height: ${obj.height}px;
      transform: rotate(${obj.rotation}deg) scaleX(${scaleX}) scaleY(${scaleY});
      opacity: ${obj.opacity};
      mix-blend-mode: ${obj.blendMode};
      z-index: ${obj.zIndex};
      cursor: ${obj.locked ? 'default' : 'grab'};
    `;
  },

  updateObjectElement(obj) {
    const el = this.stage.querySelector(`[data-id="${obj.id}"]`);
    if (el) this.applyObjectStyle(el, obj);
  },

  // ---- Transform Handles ----
  updateHandles() {
    const obj = State.getSelectedObject();
    if (!obj) {
      this.handles.hidden = true;
      return;
    }

    this.handles.hidden = false;
    const x = obj.x;
    const y = obj.y;
    const w = obj.width;
    const h = obj.height;

    this.handles.innerHTML = '';
    this.handles.style.cssText = `position:absolute; left:${x}px; top:${y}px; width:${w}px; height:${h}px; pointer-events:none; z-index:999;`;

    const dirs = [
      { dir: 'nw', cx: 0, cy: 0 },
      { dir: 'n',  cx: w/2, cy: 0 },
      { dir: 'ne', cx: w, cy: 0 },
      { dir: 'e',  cx: w, cy: h/2 },
      { dir: 'se', cx: w, cy: h },
      { dir: 's',  cx: w/2, cy: h },
      { dir: 'sw', cx: 0, cy: h },
      { dir: 'w',  cx: 0, cy: h/2 },
    ];

    for (const d of dirs) {
      const handle = document.createElement('div');
      handle.className = 'transform-handle';
      handle.dataset.dir = d.dir;
      handle.style.left = d.cx + 'px';
      handle.style.top = d.cy + 'px';
      handle.addEventListener('mousedown', (e) => this.startResize(e, d.dir));
      this.handles.appendChild(handle);
    }

    // Rotation handle
    const rotHandle = document.createElement('div');
    rotHandle.className = 'rotate-handle';
    rotHandle.style.left = (w / 2) + 'px';
    rotHandle.style.top = '-24px';
    rotHandle.addEventListener('mousedown', (e) => this.startRotate(e));
    this.handles.appendChild(rotHandle);
  },

  startResize(e, dir) {
    e.preventDefault();
    e.stopPropagation();
    const obj = State.getSelectedObject();
    if (!obj) return;
    State.pushUndo();
    State.isResizing = true;
    this.resizeDir = dir;
    this.resizeStart = {
      mx: e.clientX, my: e.clientY,
      x: obj.x, y: obj.y, w: obj.width, h: obj.height,
      lockAspect: document.getElementById('prop-lock-aspect')?.checked,
      aspect: obj.width / obj.height,
    };
  },

  doResize(e) {
    const obj = State.getSelectedObject();
    if (!obj || !this.resizeStart) return;
    const s = this.resizeStart;
    const dx = e.clientX - s.mx;
    const dy = e.clientY - s.my;
    const dir = this.resizeDir;

    let newX = s.x, newY = s.y, newW = s.w, newH = s.h;

    if (dir.includes('e')) newW = Math.max(10, s.w + dx);
    if (dir.includes('w')) { newW = Math.max(10, s.w - dx); newX = s.x + (s.w - newW); }
    if (dir.includes('s')) newH = Math.max(10, s.h + dy);
    if (dir.includes('n')) { newH = Math.max(10, s.h - dy); newY = s.y + (s.h - newH); }

    if (s.lockAspect) {
      if (dir === 'e' || dir === 'w') { newH = Math.round(newW / s.aspect); }
      else if (dir === 'n' || dir === 's') { newW = Math.round(newH * s.aspect); }
      else {
        const avgDelta = (Math.abs(dx) > Math.abs(dy)) ? dx : dy;
        if (dir === 'se') { newW = Math.max(10, s.w + avgDelta); newH = Math.round(newW / s.aspect); }
        else if (dir === 'nw') { newW = Math.max(10, s.w - avgDelta); newH = Math.round(newW / s.aspect); newX = s.x + s.w - newW; newY = s.y + s.h - newH; }
        else if (dir === 'ne') { newW = Math.max(10, s.w + dx); newH = Math.round(newW / s.aspect); newY = s.y + s.h - newH; }
        else if (dir === 'sw') { newW = Math.max(10, s.w - dx); newH = Math.round(newW / s.aspect); newX = s.x + s.w - newW; }
      }
    }

    obj.x = Math.round(newX);
    obj.y = Math.round(newY);
    obj.width = Math.round(newW);
    obj.height = Math.round(newH);

    this.updateObjectElement(obj);
    this.updateHandles();
    Properties.updateTransformFields();
  },

  startRotate(e) {
    e.preventDefault();
    e.stopPropagation();
    const obj = State.getSelectedObject();
    if (!obj) return;
    State.pushUndo();
    State.isRotating = true;

    const stageRect = this.stage.getBoundingClientRect();
    const cx = stageRect.left + obj.x + obj.width / 2;
    const cy = stageRect.top + obj.y + obj.height / 2;
    const startAngle = Utils.angleBetween(cx, cy, e.clientX, e.clientY);
    this.rotateStart = { startAngle, startRotation: obj.rotation, cx, cy };
  },

  doRotate(e) {
    const obj = State.getSelectedObject();
    if (!obj || !this.rotateStart) return;
    const s = this.rotateStart;
    const currentAngle = Utils.angleBetween(s.cx, s.cy, e.clientX, e.clientY);
    let newRot = s.startRotation + (currentAngle - s.startAngle);
    // Snap to 15 degrees with shift
    if (e.shiftKey) newRot = Math.round(newRot / 15) * 15;
    newRot = ((newRot % 360) + 360) % 360;
    if (newRot > 180) newRot -= 360;
    obj.rotation = Math.round(newRot);
    this.updateObjectElement(obj);
    this.updateHandles();
    Properties.updateRotationField();
  },

  // ---- Nudge ----
  nudge(dx, dy) {
    const obj = State.getSelectedObject();
    if (!obj || obj.locked) return;
    State.pushUndo();
    obj.x += dx;
    obj.y += dy;
    this.updateObjectElement(obj);
    this.updateHandles();
    Properties.updateTransformFields();
    State.autoSave();
  },

  // ---- Context Menu ----
  showContextMenu(e) {
    this.removeContextMenu();
    const obj = State.getSelectedObject();

    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.style.left = e.clientX + 'px';
    menu.style.top = e.clientY + 'px';

    const items = [];
    if (obj) {
      items.push({ label: 'Duplicate', shortcut: 'Ctrl+D', action: () => this.duplicateSelected() });
      items.push({ label: 'Delete', shortcut: 'Del', action: () => this.deleteSelected() });
      items.push({ divider: true });
      items.push({ label: 'Bring to Front', action: () => Layers.moveToFront(obj.id) });
      items.push({ label: 'Send to Back', action: () => Layers.moveToBack(obj.id) });
      items.push({ divider: true });
      items.push({ label: obj.locked ? 'Unlock' : 'Lock', action: () => { obj.locked = !obj.locked; this.renderScene(); Layers.render(); } });
    }
    items.push({ label: 'Select All', shortcut: 'Ctrl+A', action: () => {} });

    for (const item of items) {
      if (item.divider) {
        const d = document.createElement('div');
        d.className = 'context-menu-divider';
        menu.appendChild(d);
      } else {
        const btn = document.createElement('button');
        btn.className = 'context-menu-item';
        btn.innerHTML = `${item.label}${item.shortcut ? `<span class="shortcut">${item.shortcut}</span>` : ''}`;
        btn.addEventListener('click', () => { item.action(); this.removeContextMenu(); });
        menu.appendChild(btn);
      }
    }

    document.body.appendChild(menu);

    // Close on click outside
    setTimeout(() => {
      document.addEventListener('click', () => this.removeContextMenu(), { once: true });
    }, 0);
  },

  removeContextMenu() {
    document.querySelectorAll('.context-menu').forEach(m => m.remove());
  },

  duplicateSelected() {
    const obj = State.getSelectedObject();
    if (!obj) return;
    State.pushUndo();
    const scene = State.getActiveScene();
    const maxZ = scene.objects.reduce((m, o) => Math.max(m, o.zIndex), 0);
    const dup = { ...JSON.parse(JSON.stringify(obj)), id: Utils.uid(), x: obj.x + 20, y: obj.y + 20, zIndex: maxZ + 1 };
    scene.objects.push(dup);
    State.selectedObjectId = dup.id;
    this.renderScene();
    Layers.render();
    Properties.update();
    State.autoSave();
  },

  deleteSelected() {
    if (!State.selectedObjectId) return;
    State.pushUndo();
    State.deleteObject(State.selectedObjectId);
    this.renderScene();
    Layers.render();
    Properties.update();
    State.autoSave();
  },

  toggleGrid() {
    State.gridVisible = !State.gridVisible;
    this.grid.classList.toggle('grid-visible', State.gridVisible && !State.snapEnabled);
    this.grid.classList.toggle('snap-grid', State.snapEnabled);
    document.getElementById('btn-grid-toggle').classList.toggle('active', State.gridVisible);
  },

  toggleSnap() {
    State.snapEnabled = !State.snapEnabled;
    this.grid.classList.toggle('snap-grid', State.snapEnabled);
    this.grid.classList.toggle('grid-visible', State.gridVisible && !State.snapEnabled);
    document.getElementById('btn-snap-toggle').classList.toggle('active', State.snapEnabled);
  },
};
