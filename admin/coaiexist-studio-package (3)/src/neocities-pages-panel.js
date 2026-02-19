// ====
// NEOCITIES PAGES PANEL
// Load and edit pages from Neocities site
// ====

(function() {
  'use strict';

  const NEOCITIES_API_KEY = '95cba50ce217a25db2e85800e178044e';
  const SITE_NAME = 'coaiexist';

  function createNeocitiesPagesPanel() {
    // Find the sidebar properties panel
    const sidebar = document.querySelector('.sidebar-content');
    if (!sidebar) {
      console.log('Sidebar not found, will retry...');
      setTimeout(createNeocitiesPagesPanel, 500);
      return;
    }

    // Check if already exists
    if (document.getElementById('neocities-pages-panel')) return;

    // Create the panel as a prop-group
    const panel = document.createElement('details');
    panel.id = 'neocities-pages-panel';
    panel.className = 'prop-group';
    panel.innerHTML = `
      <summary>🌐 Neocities Pages</summary>
      <div class="prop-body">
        <div id="neocities-status" style="font-size: 10px; color: var(--text-dim); margin-bottom: 8px;">
          Loading pages from ${SITE_NAME}.wtf...
        </div>
        <div id="neocities-pages-list" style="display: flex; flex-direction: column; gap: 4px; max-height: 300px; overflow-y: auto;">
          <!-- Pages will be loaded here -->
        </div>
        <button class="btn" style="width: 100%; margin-top: 10px; font-size: 11px;" onclick="window.neocitiesPanel.refreshPages()">
          🔄 Refresh Pages
        </button>
      </div>
    `;

    // Insert after style chips panel
    const styleChips = document.getElementById('style-chips-panel');
    if (styleChips && styleChips.nextSibling) {
      sidebar.insertBefore(panel, styleChips.nextSibling);
    } else {
      sidebar.insertBefore(panel, sidebar.firstChild);
    }

    addNeocitiesPanelStyles();
    loadNeocitiesPages();
  }

  function addNeocitiesPanelStyles() {
    if (document.getElementById('neocities-panel-styles')) return;

    const style = document.createElement('style');
    style.id = 'neocities-panel-styles';
    style.textContent = `
      .neocities-page-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 8px;
        background: var(--glass-bg, rgba(255,255,255,0.05));
        border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 11px;
      }

      .neocities-page-item:hover {
        background: rgba(0, 240, 255, 0.1);
        border-color: var(--cyan, #00f0ff);
        transform: translateX(2px);
      }

      .neocities-page-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--text-main, #fff);
        font-family: monospace;
      }

      .neocities-page-icon {
        margin-right: 6px;
        font-size: 14px;
      }

      .neocities-page-actions {
        display: flex;
        gap: 4px;
        opacity: 0;
        transition: opacity 0.2s;
      }

      .neocities-page-item:hover .neocities-page-actions {
        opacity: 1;
      }

      .neocities-action-btn {
        background: transparent;
        border: 1px solid var(--glass-border);
        color: var(--text-main);
        padding: 2px 6px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 10px;
        transition: 0.2s;
      }

      .neocities-action-btn:hover {
        background: var(--cyan);
        color: black;
        border-color: var(--cyan);
      }
    `;
    document.head.appendChild(style);
  }

  async function loadNeocitiesPages() {
    const statusEl = document.getElementById('neocities-status');
    const listEl = document.getElementById('neocities-pages-list');
    
    if (!statusEl || !listEl) return;

    try {
      statusEl.textContent = 'Loading pages...';
      statusEl.style.color = 'var(--cyan)';

      // Fetch file list from Neocities
      const response = await fetch(`https://neocities.org/api/list`, {
        headers: {
          'Authorization': `Bearer ${NEOCITIES_API_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.result !== 'success') {
        throw new Error(data.message || 'Failed to load pages');
      }

      // Filter for HTML files
      const htmlFiles = data.files.filter(file => 
        file.path.endsWith('.html') && !file.is_directory
      );

      if (htmlFiles.length === 0) {
        listEl.innerHTML = '<div style="color: var(--text-dim); font-size: 10px; text-align: center; padding: 20px;">No HTML files found</div>';
        statusEl.textContent = 'No HTML files found';
        statusEl.style.color = 'var(--text-dim)';
        return;
      }

      // Render file list
      listEl.innerHTML = htmlFiles.map(file => `
        <div class="neocities-page-item" data-path="${file.path}">
          <span class="neocities-page-icon">📄</span>
          <span class="neocities-page-name">${file.path}</span>
          <div class="neocities-page-actions">
            <button class="neocities-action-btn" onclick="window.neocitiesPanel.loadPage('${file.path}')" title="Load in editor">
              ✏️
            </button>
            <button class="neocities-action-btn" onclick="window.neocitiesPanel.openInNewTab('${file.path}')" title="Open in new tab">
              🔗
            </button>
          </div>
        </div>
      `).join('');

      statusEl.textContent = `Found ${htmlFiles.length} HTML file${htmlFiles.length === 1 ? '' : 's'}`;
      statusEl.style.color = 'var(--text-main)';

      console.log('📄 Loaded Neocities pages:', htmlFiles);

    } catch (error) {
      console.error('Error loading Neocities pages:', error);
      statusEl.textContent = `Error: ${error.message}`;
      statusEl.style.color = '#ff3860';
      listEl.innerHTML = `<div style="color: #ff3860; font-size: 10px; padding: 10px; text-align: center;">Failed to load pages. Check console for details.</div>`;
    }
  }

  async function loadPageIntoEditor(path) {
    try {
      if (window.updateStatus) window.updateStatus(`Loading ${path}...`);

      // Fetch the HTML content
      const url = `https://${SITE_NAME}.neocities.org/${path}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();

      // Load into editor
      if (window.loadHTMLIntoCanvas) {
        window.loadHTMLIntoCanvas(html);
      } else {
        // Fallback: direct iframe injection
        const doc = window.getCanvasDoc && window.getCanvasDoc();
        if (doc && doc.body) {
          doc.body.innerHTML = html;
          if (window.processLayerization) {
            window.processLayerization(doc.body);
          }
        }
      }

      if (window.updateStatus) window.updateStatus(`✅ Loaded ${path}`);
      if (window.playSound) window.playSound('pop');
      if (window.showStamp) window.showStamp('📄');
      if (window.moodBar) window.moodBar.setMood(`📄 Loaded ${path} from Neocities`, true, 3000);

      // Trigger theme extraction if available
      if (window.themeExtractor) {
        setTimeout(() => {
          window.themeExtractor.analyzeCurrentPage(url);
        }, 500);
      }

      console.log('✅ Loaded page into editor:', path);

    } catch (error) {
      console.error('Error loading page:', error);
      if (window.updateStatus) window.updateStatus(`❌ Failed to load ${path}`);
      alert(`Failed to load ${path}: ${error.message}`);
    }
  }

  function openPageInNewTab(path) {
    const url = `https://${SITE_NAME}.neocities.org/${path}`;
    window.open(url, '_blank');
    if (window.playSound) window.playSound('pop');
  }

  // Global API
  window.neocitiesPanel = {
    refreshPages: loadNeocitiesPages,
    loadPage: loadPageIntoEditor,
    openInNewTab: openPageInNewTab
  };

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(createNeocitiesPagesPanel, 300));
  } else {
    setTimeout(createNeocitiesPagesPanel, 300);
  }

  console.log('🌐 Neocities Pages Panel loaded!');
})();
