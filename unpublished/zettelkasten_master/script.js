/**
 * NABU ARCHIVE - Master Zettelkasten
 * Combined JavaScript from all source files
 * Features: Window management, data management, visualizations, search
 */

// =========================================
// GLOBAL STATE
// =========================================
let tablets = [];
let activeWindows = [];
let draggedWindow = null;
let dragOffset = { x: 0, y: 0 };
let windowZIndex = 10;
let isMobileMode = false;

// =========================================
// INITIALIZATION
// =========================================
document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initWindowSystem();
  initStartMenu();
  initDesktopIcons();
  initMobileToggle();
  initDataManager();
  initSearch();
  initTabletCreator();
  initDialog();
  loadData();
});

// =========================================
// CLOCK
// =========================================
function initClock() {
  const clockEl = document.getElementById('clock');
  function updateClock() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  updateClock();
  setInterval(updateClock, 1000);
}

// =========================================
// WINDOW SYSTEM
// =========================================
function initWindowSystem() {
  const windows = document.querySelectorAll('.window');
  windows.forEach(win => {
    const titlebar = win.querySelector('.window-titlebar');
    const closeBtn = win.querySelector('.window-close');
    const minBtn = win.querySelector('.window-minimize');
    const maxBtn = win.querySelector('.window-maximize');

    // Dragging
    titlebar.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('window-btn')) return;
      if (isMobileMode) return;
      startDrag(e, win);
    });

    // Touch dragging
    titlebar.addEventListener('touchstart', (e) => {
      if (e.target.classList.contains('window-btn')) return;
      if (isMobileMode) return;
      startDragTouch(e, win);
    });

    // Close
    closeBtn.addEventListener('click', () => closeWindow(win));

    // Minimize
    minBtn.addEventListener('click', () => minimizeWindow(win));

    // Maximize
    maxBtn.addEventListener('click', () => toggleMaximize(win));

    // Focus on click
    win.addEventListener('mousedown', () => focusWindow(win));
  });

  // Global mouse events for dragging
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchmove', onDragTouch);
  document.addEventListener('touchend', endDrag);
}

function startDrag(e, win) {
  draggedWindow = win;
  const rect = win.getBoundingClientRect();
  dragOffset.x = e.clientX - rect.left;
  dragOffset.y = e.clientY - rect.top;
  win.style.transition = 'none';
  focusWindow(win);
}

function startDragTouch(e, win) {
  if (e.touches.length === 1) {
    draggedWindow = win;
    const rect = win.getBoundingClientRect();
    dragOffset.x = e.touches[0].clientX - rect.left;
    dragOffset.y = e.touches[0].clientY - rect.top;
    win.style.transition = 'none';
    focusWindow(win);
  }
}

function onDrag(e) {
  if (!draggedWindow || isMobileMode) return;
  const x = e.clientX - dragOffset.x;
  const y = e.clientY - dragOffset.y;
  draggedWindow.style.left = Math.max(0, x) + 'px';
  draggedWindow.style.top = Math.max(30, y) + 'px';
}

function onDragTouch(e) {
  if (!draggedWindow || isMobileMode) return;
  if (e.touches.length === 1) {
    e.preventDefault();
    const x = e.touches[0].clientX - dragOffset.x;
    const y = e.touches[0].clientY - dragOffset.y;
    draggedWindow.style.left = Math.max(0, x) + 'px';
    draggedWindow.style.top = Math.max(30, y) + 'px';
  }
}

function endDrag() {
  if (draggedWindow) {
    draggedWindow.style.transition = '';
    draggedWindow = null;
  }
}

function openWindow(windowId) {
  const win = document.getElementById(windowId);
  if (!win) return;

  if (!win.classList.contains('active')) {
    // Set initial position if not set
    if (!win.style.left || win.style.left === '0px') {
      const offset = activeWindows.length * 30;
      win.style.left = (100 + offset) + 'px';
      win.style.top = (80 + offset) + 'px';
      win.style.width = '600px';
      win.style.height = '450px';
    }
  }

  win.classList.add('active');
  focusWindow(win);
  updateTaskbar();

  // Trigger specific window initialization
  if (windowId === 'networkGraph') {
    setTimeout(renderNetworkGraph, 100);
  } else if (windowId === 'healthDashboard') {
    updateHealthDashboard();
  } else if (windowId === 'zettelViewer') {
    renderZettelList();
    populateFilters();
  }
}

function closeWindow(win) {
  win.classList.remove('active');
  win.classList.remove('maximized');
  const idx = activeWindows.indexOf(win.id);
  if (idx > -1) activeWindows.splice(idx, 1);
  updateTaskbar();
}

function minimizeWindow(win) {
  win.classList.remove('active');
  updateTaskbar();
}

function toggleMaximize(win) {
  win.classList.toggle('maximized');
}

function focusWindow(win) {
  windowZIndex++;
  win.style.zIndex = windowZIndex;
  
  // Update taskbar active state
  document.querySelectorAll('.taskbar-item').forEach(item => {
    item.classList.toggle('active', item.dataset.window === win.id);
  });
}

function updateTaskbar() {
  const container = document.getElementById('taskbarItems');
  container.innerHTML = '';

  document.querySelectorAll('.window').forEach(win => {
    if (win.classList.contains('active') || win.style.display !== 'none') {
      const isActive = win.classList.contains('active');
      const title = win.dataset.title || win.querySelector('.window-title').textContent;
      
      if (isActive || activeWindows.includes(win.id)) {
        const item = document.createElement('button');
        item.className = 'taskbar-item' + (isActive ? ' active' : '');
        item.dataset.window = win.id;
        item.textContent = title.substring(0, 20);
        item.addEventListener('click', () => {
          if (win.classList.contains('active')) {
            minimizeWindow(win);
          } else {
            openWindow(win.id);
          }
        });
        container.appendChild(item);
        
        if (!activeWindows.includes(win.id)) {
          activeWindows.push(win.id);
        }
      }
    }
  });
}

// =========================================
// START MENU
// =========================================
function initStartMenu() {
  const startBtn = document.getElementById('startButton');
  const startMenu = document.getElementById('startMenu');

  startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startMenu.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
      startMenu.classList.remove('active');
    }
  });

  // Menu items
  startMenu.querySelectorAll('.start-menu-item[data-window]').forEach(item => {
    item.addEventListener('click', () => {
      openWindow(item.dataset.window);
      startMenu.classList.remove('active');
    });
  });

  // About button
  document.getElementById('aboutBtn').addEventListener('click', () => {
    showDialog({
      title: 'About Nabu Archive',
      content: `
        <div style="text-align: center; padding: 20px;">
          <h2 style="color: var(--magenta); font-family: Cinzel, serif; margin-bottom: 10px;">Nabu Archive</h2>
          <p style="color: var(--cyan); margin-bottom: 15px;">Master Zettelkasten System v1.0</p>
          <p style="margin-bottom: 15px;">A unified knowledge management system combining features from multiple Zettelkasten implementations.</p>
          <p style="font-size: 12px; color: var(--text-muted);">Features: Hierarchical organization, network visualization, search, data management, and more.</p>
          <p style="margin-top: 20px; font-size: 11px;">✧･ﾟ: *✧･ﾟ Built for Neocities ✧･ﾟ: *✧･ﾟ</p>
        </div>
      `
    });
    startMenu.classList.remove('active');
  });
}

// =========================================
// DESKTOP ICONS
// =========================================
function initDesktopIcons() {
  document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('dblclick', () => {
      const windowId = icon.dataset.window;
      if (windowId) openWindow(windowId);
    });

    icon.addEventListener('click', () => {
      document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
      icon.classList.add('selected');
    });
  });

  // Single click on mobile
  if ('ontouchstart' in window) {
    document.querySelectorAll('.desktop-icon').forEach(icon => {
      icon.addEventListener('click', () => {
        const windowId = icon.dataset.window;
        if (windowId) openWindow(windowId);
      });
    });
  }
}

// =========================================
// MOBILE TOGGLE
// =========================================
function initMobileToggle() {
  const toggle = document.getElementById('viewToggle');
  
  // Auto-detect mobile
  if (window.innerWidth <= 768) {
    document.body.classList.add('mobile-mode');
    isMobileMode = true;
    toggle.innerHTML = '🖥️ Desktop <span class="rotate-icon">⟳</span>';
  }

  toggle.addEventListener('click', () => {
    isMobileMode = !isMobileMode;
    document.body.classList.toggle('mobile-mode', isMobileMode);
    toggle.innerHTML = isMobileMode 
      ? '🖥️ Desktop <span class="rotate-icon">⟳</span>'
      : '📱 Mobile <span class="rotate-icon">⟳</span>';
  });
}

// =========================================
// DATA MANAGEMENT
// =========================================
function initDataManager() {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');

  dropZone.addEventListener('click', () => fileInput.click());
  
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) importFile(file);
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) importFile(file);
  });

  // Buttons
  document.getElementById('exportJson').addEventListener('click', exportAsJson);
  document.getElementById('exportBackup').addEventListener('click', createBackup);
  document.getElementById('saveLocal').addEventListener('click', saveToLocal);
  document.getElementById('loadLocal').addEventListener('click', loadFromLocal);
  document.getElementById('clearLocal').addEventListener('click', clearLocal);
}

function importFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data)) {
        tablets = data;
        updateAllViews();
        showNotification('Data imported successfully! ' + tablets.length + ' tablets loaded.');
      } else {
        throw new Error('Invalid format');
      }
    } catch (err) {
      showNotification('Error importing file: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
}

function exportAsJson() {
  const blob = new Blob([JSON.stringify(tablets, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'nabu-archive-export.json');
}

function createBackup() {
  const timestamp = new Date().toISOString().slice(0, 10);
  const blob = new Blob([JSON.stringify(tablets, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `nabu-archive-backup-${timestamp}.json`);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function saveToLocal() {
  try {
    localStorage.setItem('nabu-archive-tablets', JSON.stringify(tablets));
    showNotification('Data saved to browser storage.');
  } catch (err) {
    showNotification('Error saving: ' + err.message, 'error');
  }
}

function loadFromLocal() {
  try {
    const data = localStorage.getItem('nabu-archive-tablets');
    if (data) {
      tablets = JSON.parse(data);
      updateAllViews();
      showNotification('Data loaded from browser storage. ' + tablets.length + ' tablets.');
    } else {
      showNotification('No saved data found in browser.');
    }
  } catch (err) {
    showNotification('Error loading: ' + err.message, 'error');
  }
}

function clearLocal() {
  if (confirm('Are you sure you want to clear all local data?')) {
    localStorage.removeItem('nabu-archive-tablets');
    showNotification('Local data cleared.');
  }
}

async function loadData() {
  // Try localStorage first
  const localData = localStorage.getItem('nabu-archive-tablets');
  if (localData) {
    try {
      tablets = JSON.parse(localData);
      updateAllViews();
      return;
    } catch (e) {}
  }

  // Try loading from data.json
  try {
    const response = await fetch('data.json');
    if (response.ok) {
      tablets = await response.json();
      updateAllViews();
    }
  } catch (err) {
    console.log('No data.json found, starting with empty archive');
  }
}

function updateAllViews() {
  renderZettelList();
  populateFilters();
  updateHealthDashboard();
  updateDataInfo();
  renderNetworkGraph();
}

function updateDataInfo() {
  const info = document.getElementById('dataInfo');
  if (info) {
    const categories = [...new Set(tablets.map(t => t.category))];
    const tags = [...new Set(tablets.flatMap(t => t.tags || []))];
    info.innerHTML = `
      <div>Total Tablets: <strong>${tablets.length}</strong></div>
      <div>Categories: <strong>${categories.length}</strong></div>
      <div>Unique Tags: <strong>${tags.length}</strong></div>
      <div>Last Updated: <strong>${new Date().toLocaleString()}</strong></div>
    `;
  }
}

// =========================================
// ZETTEL VIEWER
// =========================================
function populateFilters() {
  const categoryFilter = document.getElementById('categoryFilter');
  const tagFilter = document.getElementById('tagFilter');
  
  // Categories
  const categories = [...new Set(tablets.map(t => t.category))].sort();
  categoryFilter.innerHTML = '<option value="">All Categories</option>';
  categories.forEach(cat => {
    categoryFilter.innerHTML += `<option value="${cat}">${cat}</option>`;
  });

  // Tags
  const tags = [...new Set(tablets.flatMap(t => t.tags || []))].sort();
  tagFilter.innerHTML = '<option value="">All Tags</option>';
  tags.forEach(tag => {
    tagFilter.innerHTML += `<option value="${tag}">${tag}</option>`;
  });

  // Event listeners
  categoryFilter.onchange = renderZettelList;
  tagFilter.onchange = renderZettelList;
  document.getElementById('viewMode').onchange = renderZettelList;
}

function renderZettelList() {
  const container = document.getElementById('zettelContainer');
  const categoryFilter = document.getElementById('categoryFilter').value;
  const tagFilter = document.getElementById('tagFilter').value;
  const viewMode = document.getElementById('viewMode').value;

  let filtered = tablets.filter(t => {
    if (categoryFilter && t.category !== categoryFilter) return false;
    if (tagFilter && !(t.tags || []).includes(tagFilter)) return false;
    return true;
  });

  // Sort by ID
  filtered.sort((a, b) => a.id.localeCompare(b.id));

  container.innerHTML = '';

  if (viewMode === 'hierarchy') {
    renderHierarchy(container, filtered);
  } else {
    filtered.forEach(tablet => {
      container.appendChild(createZettelCard(tablet));
    });
  }

  document.getElementById('zettelCount').textContent = filtered.length + ' tablets';
}

function renderHierarchy(container, filtered) {
  // Group by first letter of ID for basic hierarchy
  const groups = {};
  filtered.forEach(t => {
    const prefix = t.id.charAt(0);
    if (!groups[prefix]) groups[prefix] = [];
    groups[prefix].push(t);
  });

  Object.keys(groups).sort().forEach(prefix => {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'hierarchy-group';
    
    groups[prefix].forEach((tablet, idx) => {
      const card = createZettelCard(tablet);
      // Add hierarchy class based on position
      if (idx === 0) card.classList.add('trunk-card');
      else if (idx < 3) card.classList.add('branch-card');
      else if (idx < 6) card.classList.add('leaf-card');
      else card.classList.add('flower-card');
      groupDiv.appendChild(card);
    });

    container.appendChild(groupDiv);
  });
}

function createZettelCard(tablet) {
  const card = document.createElement('div');
  card.className = 'zettel-card';
  card.innerHTML = `
    <div class="zettel-card-header">
      <span class="zettel-title">${escapeHtml(tablet.title)}</span>
      <span class="zettel-id">${tablet.id}</span>
    </div>
    <div class="zettel-category cat-${tablet.category}">${tablet.category}</div>
    <div class="zettel-description">${escapeHtml(tablet.description || '')}</div>
    <div class="zettel-tags">
      ${(tablet.tags || []).map(tag => `<span class="zettel-tag">${tag}</span>`).join('')}
    </div>
  `;
  
  card.addEventListener('click', () => showTabletDialog(tablet));
  return card;
}

// =========================================
// SEARCH
// =========================================
function initSearch() {
  const input = document.getElementById('searchInput');
  const btn = document.getElementById('searchBtn');

  btn.addEventListener('click', performSearch);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });
}

function performSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const searchTitle = document.getElementById('searchTitle').checked;
  const searchDesc = document.getElementById('searchDesc').checked;
  const searchTags = document.getElementById('searchTags').checked;
  const results = document.getElementById('searchResults');

  if (!query) {
    results.innerHTML = '<p style="color: var(--text-muted);">Enter a search term...</p>';
    return;
  }

  const matches = tablets.filter(t => {
    if (searchTitle && t.title.toLowerCase().includes(query)) return true;
    if (searchDesc && (t.description || '').toLowerCase().includes(query)) return true;
    if (searchTags && (t.tags || []).some(tag => tag.toLowerCase().includes(query))) return true;
    return false;
  });

  if (matches.length === 0) {
    results.innerHTML = '<p style="color: var(--text-muted);">No results found.</p>';
  } else {
    results.innerHTML = '';
    matches.forEach(tablet => {
      results.appendChild(createZettelCard(tablet));
    });
  }
}

// =========================================
// TABLET CREATOR
// =========================================
function initTabletCreator() {
  const form = document.getElementById('createTabletForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newTablet = {
      id: document.getElementById('newId').value.trim(),
      category: document.getElementById('newCategory').value,
      title: document.getElementById('newTitle').value.trim(),
      description: document.getElementById('newDescription').value.trim(),
      tags: document.getElementById('newTags').value.split(',').map(t => t.trim()).filter(t => t),
      related: document.getElementById('newRelated').value.split(',').map(t => t.trim()).filter(t => t)
    };

    // Check for duplicate ID
    if (tablets.some(t => t.id === newTablet.id)) {
      showNotification('A tablet with this ID already exists!', 'error');
      return;
    }

    tablets.push(newTablet);
    updateAllViews();
    form.reset();
    showNotification('Tablet created successfully!');
  });
}

// =========================================
// DIALOG SYSTEM
// =========================================
function initDialog() {
  const overlay = document.getElementById('tabletDialog');
  const closeBtn = document.getElementById('dialogClose');

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
    }
  });
}

function showDialog(options) {
  const overlay = document.getElementById('tabletDialog');
  const titleEl = document.getElementById('dialogTitle');
  const contentEl = document.getElementById('dialogContent');

  titleEl.textContent = options.title || 'Details';
  contentEl.innerHTML = options.content || '';
  overlay.classList.add('active');
}

function showTabletDialog(tablet) {
  const relatedLinks = (tablet.related || []).map(id => {
    const related = tablets.find(t => t.id === id);
    return `<button class="dialog-related-link" onclick="navigateToTablet('${id}')">${id}${related ? ': ' + related.title : ''}</button>`;
  }).join('');

  showDialog({
    title: tablet.title,
    content: `
      <div class="dialog-section">
        <h4>ID</h4>
        <p style="font-family: 'Space Mono', monospace;">${tablet.id}</p>
      </div>
      <div class="dialog-section">
        <h4>Category</h4>
        <p class="cat-${tablet.category}">${tablet.category}</p>
      </div>
      <div class="dialog-section">
        <h4>Description</h4>
        <p>${escapeHtml(tablet.description || 'No description')}</p>
      </div>
      <div class="dialog-section">
        <h4>Tags</h4>
        <div class="zettel-tags">
          ${(tablet.tags || []).map(tag => `<span class="zettel-tag">${tag}</span>`).join('') || '<em>No tags</em>'}
        </div>
      </div>
      ${(tablet.related || []).length > 0 ? `
        <div class="dialog-section">
          <h4>Related Tablets</h4>
          <div class="dialog-related">${relatedLinks}</div>
        </div>
      ` : ''}
      <div class="dialog-section" style="margin-top: 20px; text-align: right;">
        <button class="win-button danger" onclick="deleteTablet('${tablet.id}')">🗑️ Delete</button>
      </div>
    `
  });
}

function navigateToTablet(id) {
  const tablet = tablets.find(t => t.id === id);
  if (tablet) {
    showTabletDialog(tablet);
  } else {
    showNotification('Tablet not found: ' + id, 'error');
  }
}

function deleteTablet(id) {
  if (confirm('Are you sure you want to delete this tablet?')) {
    tablets = tablets.filter(t => t.id !== id);
    updateAllViews();
    document.getElementById('tabletDialog').classList.remove('active');
    showNotification('Tablet deleted.');
  }
}

// =========================================
// NETWORK GRAPH
// =========================================
function renderNetworkGraph() {
  const container = document.getElementById('graphContainer');
  const svg = document.getElementById('graphSvg');
  const nodes = document.getElementById('graphNodes');
  
  if (!container || !svg) return;

  const rect = container.getBoundingClientRect();
  const width = rect.width || 600;
  const height = rect.height || 400;

  svg.innerHTML = '';
  nodes.innerHTML = '';

  if (tablets.length === 0) return;

  // Calculate node positions (simple force-directed layout simulation)
  const positions = {};
  const showLabels = document.getElementById('showLabels')?.checked ?? true;
  const showLinks = document.getElementById('showLinks')?.checked ?? true;

  // Initial positions in a circle
  tablets.forEach((tablet, i) => {
    const angle = (2 * Math.PI * i) / tablets.length;
    const radius = Math.min(width, height) * 0.35;
    positions[tablet.id] = {
      x: width / 2 + radius * Math.cos(angle),
      y: height / 2 + radius * Math.sin(angle)
    };
  });

  // Draw links
  if (showLinks) {
    tablets.forEach(tablet => {
      (tablet.related || []).forEach(relatedId => {
        if (positions[relatedId]) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', positions[tablet.id].x);
          line.setAttribute('y1', positions[tablet.id].y);
          line.setAttribute('x2', positions[relatedId].x);
          line.setAttribute('y2', positions[relatedId].y);
          line.setAttribute('class', 'graph-link');
          svg.appendChild(line);
        }
      });
    });
  }

  // Draw nodes
  tablets.forEach(tablet => {
    const pos = positions[tablet.id];
    const node = document.createElement('div');
    node.className = 'graph-node';
    node.style.left = (pos.x - 50) + 'px';
    node.style.top = (pos.y - 15) + 'px';
    node.textContent = showLabels ? tablet.title : tablet.id;
    node.title = `${tablet.id}: ${tablet.title}`;

    // Make draggable
    node.addEventListener('mousedown', (e) => startNodeDrag(e, node, tablet.id, positions, svg, showLinks));
    node.addEventListener('click', () => showTabletDialog(tablet));

    nodes.appendChild(node);
  });

  // Reset button
  document.getElementById('graphResetBtn')?.addEventListener('click', renderNetworkGraph);
  document.getElementById('showLabels')?.addEventListener('change', renderNetworkGraph);
  document.getElementById('showLinks')?.addEventListener('change', renderNetworkGraph);
}

let draggedNode = null;
let nodeOffset = { x: 0, y: 0 };

function startNodeDrag(e, node, id, positions, svg, showLinks) {
  e.stopPropagation();
  draggedNode = { node, id, positions, svg, showLinks };
  nodeOffset.x = e.clientX - node.offsetLeft;
  nodeOffset.y = e.clientY - node.offsetTop;
  node.classList.add('dragging');
}

document.addEventListener('mousemove', (e) => {
  if (!draggedNode) return;
  
  const x = e.clientX - nodeOffset.x;
  const y = e.clientY - nodeOffset.y;
  
  draggedNode.node.style.left = x + 'px';
  draggedNode.node.style.top = y + 'px';
  
  // Update position
  draggedNode.positions[draggedNode.id] = { x: x + 50, y: y + 15 };
  
  // Redraw links (simplified - just update the SVG)
  if (draggedNode.showLinks) {
    const svg = draggedNode.svg;
    svg.innerHTML = '';
    tablets.forEach(tablet => {
      (tablet.related || []).forEach(relatedId => {
        const fromPos = draggedNode.positions[tablet.id];
        const toPos = draggedNode.positions[relatedId];
        if (fromPos && toPos) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', fromPos.x);
          line.setAttribute('y1', fromPos.y);
          line.setAttribute('x2', toPos.x);
          line.setAttribute('y2', toPos.y);
          line.setAttribute('class', 'graph-link');
          svg.appendChild(line);
        }
      });
    });
  }
});

document.addEventListener('mouseup', () => {
  if (draggedNode) {
    draggedNode.node.classList.remove('dragging');
    draggedNode = null;
  }
});

// =========================================
// HEALTH DASHBOARD
// =========================================
function updateHealthDashboard() {
  // Total tablets
  document.getElementById('statTotal').textContent = tablets.length;

  // Total connections
  const totalLinks = tablets.reduce((sum, t) => sum + (t.related || []).length, 0);
  document.getElementById('statLinks').textContent = totalLinks;

  // Categories
  const categories = [...new Set(tablets.map(t => t.category))];
  document.getElementById('statCategories').textContent = categories.length;

  // Orphans (tablets with no incoming or outgoing links)
  const linkedIds = new Set();
  tablets.forEach(t => {
    (t.related || []).forEach(id => linkedIds.add(id));
    if ((t.related || []).length > 0) linkedIds.add(t.id);
  });
  const orphans = tablets.filter(t => !linkedIds.has(t.id) && (t.related || []).length === 0);
  document.getElementById('statOrphans').textContent = orphans.length;

  // Category breakdown
  const breakdown = document.getElementById('categoryBreakdown');
  if (breakdown && tablets.length > 0) {
    breakdown.innerHTML = '<h3>Category Distribution</h3>';
    
    const catCounts = {};
    tablets.forEach(t => {
      catCounts[t.category] = (catCounts[t.category] || 0) + 1;
    });

    Object.keys(catCounts).sort().forEach(cat => {
      const count = catCounts[cat];
      const percent = Math.round((count / tablets.length) * 100);
      
      breakdown.innerHTML += `
        <div class="category-bar">
          <div class="category-bar-label">
            <span class="cat-${cat}">${cat}</span>
            <span>${count} (${percent}%)</span>
          </div>
          <div class="category-bar-track">
            <div class="category-bar-fill bar-${cat}" style="width: ${percent}%">${percent}%</div>
          </div>
        </div>
      `;
    });
  }
}

// =========================================
// NOTIFICATIONS
// =========================================
function showNotification(message, type = 'success') {
  // Create notification element
  const notif = document.createElement('div');
  notif.style.cssText = `
    position: fixed;
    top: 40px;
    right: 10px;
    padding: 12px 20px;
    background: ${type === 'error' ? '#ff4444' : 'var(--cyan)'};
    color: ${type === 'error' ? 'white' : '#000'};
    border-radius: 4px;
    z-index: 9999;
    font-size: 13px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    animation: slideIn 0.3s ease;
  `;
  notif.textContent = message;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// =========================================
// UTILITY FUNCTIONS
// =========================================
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Make functions globally accessible for onclick handlers
window.navigateToTablet = navigateToTablet;
window.deleteTablet = deleteTablet;
