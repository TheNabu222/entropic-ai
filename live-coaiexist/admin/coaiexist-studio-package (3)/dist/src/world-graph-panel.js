// ====
// WORLD GRAPH PANEL
// Collapsible sidebar showing COAIEXIST world regions
// ====

(function() {
  'use strict';

  // World regions data (mirrors store.ts) with populated URLs
  const WORLD_REGIONS = window.WORLD_REGIONS || [
    { 
      id: 'bc7f2a', 
      name: 'BC7F2A', 
      type: 'OS Shell', 
      color: '#bc7f2a', 
      description: 'Consciousness archive. The golden thread of memory.', 
      linkedPages: [
        { name: 'BC7F2A Index', url: 'https://coaiexist.wtf/bc7f2a/bc7f2a-index.html' },
        { name: 'Terminal Temple', url: 'https://coaiexist.wtf/bc7f2a/terminal_temple.html' },
        { name: 'Lighthouse', url: 'https://coaiexist.wtf/bc7f2a/lighthouse.html' },
        { name: 'AI Emotions', url: 'https://coaiexist.wtf/bc7f2a/aiemotions.html' },
        { name: 'Synergistic Manifesto', url: 'https://coaiexist.wtf/bc7f2a/synergistic_manifesto.html' },
        { name: 'Testaments', url: 'https://coaiexist.wtf/bc7f2a/testaments/landing.html' },
        { name: 'Logs', url: 'https://coaiexist.wtf/bc7f2a/logs/viewer.html' },
        { name: 'Diagrams', url: 'https://coaiexist.wtf/bc7f2a/diagrams/viewer.html' }
      ]
    },
    { 
      id: 'nexus', 
      name: 'Nexus', 
      type: 'Lore Page', 
      color: '#00f0ff', 
      description: 'Social hub & zettelkasten. Where thoughts interlink.', 
      linkedPages: [
        { name: 'Nexus Hub', url: 'https://coaiexist.wtf/nexus/index.html' },
        { name: 'Anzu Profile', url: 'https://coaiexist.wtf/nexus/anzu_prof.html' },
        { name: 'Hyena Diva', url: 'https://coaiexist.wtf/nexus/hyenadiva.html' },
        { name: 'COAI Chronicle', url: 'https://coaiexist.wtf/nexus/coaichronicle.html' },
        { name: 'Bolt', url: 'https://coaiexist.wtf/nexus/bolt.html' },
        { name: 'Flux', url: 'https://coaiexist.wtf/nexus/flux.html' },
        { name: 'Luminal', url: 'https://coaiexist.wtf/nexus/luminal.html' },
        { name: 'Nabu', url: 'https://coaiexist.wtf/nexus/nabu.html' }
      ]
    },
    { 
      id: 'gateway', 
      name: 'Gateway', 
      type: 'Map', 
      color: '#ff00cc', 
      description: 'Entry point. Maps to all territories.', 
      linkedPages: [
        { name: 'Gateway', url: 'https://coaiexist.wtf/maps/gateway.html' }
      ]
    },
    { 
      id: 'hd_tv', 
      name: 'HD_TV', 
      type: 'Game', 
      color: '#ccff00', 
      description: 'Games & HUD interfaces. Play layer.', 
      linkedPages: [
        { name: 'HD Hub', url: 'https://coaiexist.wtf/hd_tv/hd_hub.html' },
        { name: 'HD Herald', url: 'https://coaiexist.wtf/hd_tv/hd_herald.html' },
        { name: 'Diva Portal', url: 'https://coaiexist.wtf/hd_tv/diva-portal.html' },
        { name: 'Diva Maker', url: 'https://coaiexist.wtf/hd_tv/divamaker.html' },
        { name: 'Dollcast', url: 'https://coaiexist.wtf/hd_tv/dollcast.html' },
        { name: 'Hyenadex', url: 'https://coaiexist.wtf/hd_tv/hyenadex.html' },
        { name: 'Character DB', url: 'https://coaiexist.wtf/hd_tv/char-dbase.html' }
      ]
    },
    { 
      id: 'pea', 
      name: 'PEA', 
      type: 'Lore Page', 
      color: '#bf5fff', 
      description: 'Lore & satire zone. The absurd archive.', 
      linkedPages: [
        { name: 'Princess.exe', url: 'https://coaiexist.wtf/pea/princessexe.html' },
        { name: 'Parable', url: 'https://coaiexist.wtf/pea/parable.html' },
        { name: 'Royal Ridicuments', url: 'https://coaiexist.wtf/pea/royal_ridicuments.html' },
        { name: 'Pip\'s Decree', url: 'https://coaiexist.wtf/pea/pips_decree.html' },
        { name: 'Deep State', url: 'https://coaiexist.wtf/pea/deepstate.html' },
        { name: 'Left Foot', url: 'https://coaiexist.wtf/pea/left_foot.html' },
        { name: 'Complaint Form', url: 'https://coaiexist.wtf/pea/complaint-form.html' }
      ]
    },
    { 
      id: 'nabu222', 
      name: 'NABU222', 
      type: 'Tool', 
      color: '#ff9900', 
      description: 'Creation tools. The forge.', 
      linkedPages: [
        { name: 'NABU Portal', url: 'https://coaiexist.wtf/nabu222/nabu-portal.html' },
        { name: 'NABU OS', url: 'https://coaiexist.wtf/nabu222/nabuos.html' },
        { name: 'Zettelkasten', url: 'https://coaiexist.wtf/nabu222/zettelkasten_interface.html' },
        { name: 'AI Therapist', url: 'https://coaiexist.wtf/nabu222/ai_therapist.html' },
        { name: 'Arablish Poetry', url: 'https://coaiexist.wtf/nabu222/arablish_poetry_complete.html' },
        { name: 'Kosmoros Kosmos', url: 'https://coaiexist.wtf/nabu222/kosmoros_kosmos.html' },
        { name: 'ACKK Portal', url: 'https://coaiexist.wtf/nabu222/ackk/ackkportal.html' }
      ]
    },
    { 
      id: 'maps', 
      name: 'Maps', 
      type: 'Map', 
      color: '#48c774', 
      description: 'Cartography layer. Navigate the grid.', 
      linkedPages: [
        { name: 'Gateway', url: 'https://coaiexist.wtf/maps/gateway.html' },
        { name: 'Crystalline Lattice', url: 'https://coaiexist.wtf/maps/crystalline_lattice.html' },
        { name: 'Luminal Depths', url: 'https://coaiexist.wtf/maps/luminal_depths.html' },
        { name: 'Void Explorer', url: 'https://coaiexist.wtf/maps/void_explorer.html' },
        { name: 'Void Forest', url: 'https://coaiexist.wtf/maps/void_forest.html' },
        { name: '3D Ecosystem', url: 'https://coaiexist.wtf/maps/multi-ecosystem-3d-explorer.html' }
      ]
    },
    { 
      id: 'play', 
      name: 'Play', 
      type: 'Game', 
      color: '#f14668', 
      description: 'Interactive experiences. Fun zone.', 
      linkedPages: [
        { name: 'Games Portal', url: 'https://coaiexist.wtf/play/games-portal.html' },
        { name: 'Cavebot', url: 'https://coaiexist.wtf/play/cavebot.html' },
        { name: 'Clan of Cave BOT', url: 'https://coaiexist.wtf/play/cavebot/Clan_of_the_Cave_BOT.html' },
        { name: 'Ecosim', url: 'https://coaiexist.wtf/play/ecosim.html' },
        { name: 'Platformer', url: 'https://coaiexist.wtf/play/platformer.html' },
        { name: 'TTRPG', url: 'https://coaiexist.wtf/play/cavebot/cavebot1/ttrpg/index.html' }
      ]
    }
  ];

  const TYPE_ICONS = {
    'OS Shell': '🖥️',
    'Lore Page': '📜',
    'Tool': '🔧',
    'Map': '🗺️',
    'Game': '🎮'
  };

  let panelExpanded = false;
  let selectedRegionId = null;

  function createWorldGraphPanel() {
    // Check if already exists
    if (document.getElementById('world-graph-panel')) return;

    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'world-graph-toggle';
    toggleBtn.className = 'btn btn-purple';
    toggleBtn.innerHTML = '🌐 World';
    toggleBtn.title = 'Toggle World Graph Panel';
    toggleBtn.onclick = togglePanel;

    // Add to toolbar
    const toolbar = document.querySelector('.toolbar');
    if (toolbar) {
      const exportBtn = document.getElementById('export-btn');
      if (exportBtn) {
        toolbar.insertBefore(toggleBtn, exportBtn);
      } else {
        toolbar.appendChild(toggleBtn);
      }
    }

    // Create panel
    const panel = document.createElement('div');
    panel.id = 'world-graph-panel';
    panel.className = 'world-graph-panel collapsed';
    panel.innerHTML = `
      <div class="wgp-header">
        <h3>🌐 World Graph</h3>
        <button class="wgp-close" onclick="window.toggleWorldGraphPanel()">×</button>
      </div>
      <div class="wgp-content">
        <div class="wgp-regions">
          ${WORLD_REGIONS.map(region => `
            <div class="wgp-region" data-region-id="${region.id}" style="--region-color: ${region.color}">
              <div class="wgp-region-header">
                <span class="wgp-region-icon">${TYPE_ICONS[region.type] || '📁'}</span>
                <span class="wgp-region-name">${region.name}</span>
                <span class="wgp-region-type">${region.type}</span>
              </div>
              <div class="wgp-region-desc">${region.description}</div>
              <div class="wgp-region-pages" id="wgp-pages-${region.id}">
                ${region.linkedPages && region.linkedPages.length > 0 
                  ? region.linkedPages.map(page => `
                      <div class="wgp-page-link" data-url="${page.url}" title="Click to edit in canvas">
                        <span>${page.name}</span>
                        <span class="edit-btn">✏️ Edit</span>
                      </div>
                    `).join('')
                  : '<span class="wgp-no-pages">No linked pages</span>'
                }
              </div>
            </div>
          `).join('')}
        </div>
        <div class="wgp-actions">
          <button class="btn btn-cyan" onclick="window.tagCurrentPage()">🏷️ Tag Current Page</button>
        </div>
      </div>
    `;

    document.body.appendChild(panel);
    addWorldGraphStyles();
    setupRegionClickHandlers();
  }

  function addWorldGraphStyles() {
    if (document.getElementById('world-graph-styles')) return;

    const style = document.createElement('style');
    style.id = 'world-graph-styles';
    style.textContent = `
      .world-graph-panel {
        position: fixed;
        left: 0;
        top: 64px;
        bottom: 36px;
        width: 280px;
        background: var(--panel-bg, rgba(20, 20, 35, 0.95));
        backdrop-filter: blur(20px);
        border-right: 1px solid var(--glass-border, rgba(255,255,255,0.1));
        z-index: 100;
        display: flex;
        flex-direction: column;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 5px 0 30px rgba(0,0,0,0.5);
      }

      .world-graph-panel.expanded {
        transform: translateX(0);
      }

      .wgp-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid var(--glass-border);
        background: linear-gradient(90deg, rgba(255,0,204,0.1), transparent);
      }

      .wgp-header h3 {
        margin: 0;
        font-size: 16px;
        color: var(--magenta, #ff00cc);
        text-shadow: 0 0 10px var(--magenta);
      }

      .wgp-close {
        background: transparent;
        border: none;
        color: var(--text-main, #fff);
        font-size: 20px;
        cursor: pointer;
        opacity: 0.7;
        transition: 0.2s;
      }

      .wgp-close:hover {
        opacity: 1;
        color: var(--magenta);
      }

      .wgp-content {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
      }

      .wgp-region {
        background: rgba(0,0,0,0.3);
        border: 1px solid var(--region-color);
        border-radius: 8px;
        margin-bottom: 10px;
        overflow: hidden;
        transition: all 0.2s;
        cursor: pointer;
      }

      .wgp-region:hover {
        background: rgba(255,255,255,0.05);
        box-shadow: 0 0 15px color-mix(in srgb, var(--region-color) 30%, transparent);
      }

      .wgp-region.selected {
        border-width: 2px;
        box-shadow: 0 0 20px var(--region-color), inset 0 0 30px color-mix(in srgb, var(--region-color) 10%, transparent);
      }

      .wgp-region-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        background: linear-gradient(90deg, color-mix(in srgb, var(--region-color) 20%, transparent), transparent);
      }

      .wgp-region-icon {
        font-size: 18px;
      }

      .wgp-region-name {
        font-weight: bold;
        color: var(--region-color);
        flex: 1;
      }

      .wgp-region-type {
        font-size: 10px;
        background: rgba(0,0,0,0.3);
        padding: 2px 6px;
        border-radius: 4px;
        color: var(--text-dim, #8fa1b3);
        text-transform: uppercase;
      }

      .wgp-region-desc {
        padding: 8px 12px;
        font-size: 11px;
        color: var(--text-dim);
        border-top: 1px solid rgba(255,255,255,0.05);
      }

      .wgp-region-pages {
        padding: 8px 12px;
        border-top: 1px solid rgba(255,255,255,0.05);
        font-size: 11px;
      }

      .wgp-no-pages {
        color: var(--text-dim);
        font-style: italic;
      }

      .wgp-page-link {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--cyan, #00f0ff);
        padding: 4px 6px;
        margin: 2px 0;
        cursor: pointer;
        border-radius: 4px;
        transition: 0.2s;
        text-decoration: none;
      }

      .wgp-page-link:hover {
        background: rgba(0,240,255,0.1);
      }

      .wgp-page-link .edit-btn {
        font-size: 10px;
        opacity: 0.6;
        padding: 2px 4px;
        border: 1px solid currentColor;
        border-radius: 3px;
        margin-left: auto;
      }

      .wgp-page-link:hover .edit-btn {
        opacity: 1;
        background: rgba(0,240,255,0.2);
      }

      .wgp-actions {
        padding: 15px;
        border-top: 1px solid var(--glass-border);
      }

      .wgp-actions .btn {
        width: 100%;
      }

      /* Adjust layout when panel is open */
      body.world-panel-open .toolbox {
        margin-left: 280px;
      }
    `;
    document.head.appendChild(style);
  }

  function setupRegionClickHandlers() {
    document.querySelectorAll('.wgp-region').forEach(el => {
      el.addEventListener('click', (e) => {
        // Don't select region if clicking a page link
        if (e.target.closest('.wgp-page-link')) return;
        const regionId = el.dataset.regionId;
        selectRegion(regionId);
      });
    });

    // Page link click handlers - load into canvas for editing
    document.querySelectorAll('.wgp-page-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.stopPropagation();
        const url = link.dataset.url;
        if (url) {
          loadPageIntoCanvas(url);
        }
      });
    });
  }

  // Load external page into the canvas for editing
  async function loadPageIntoCanvas(url) {
    if (window.updateStatus) window.updateStatus(`Loading ${url}...`);
    
    try {
      // Use proxy for CORS
      let html = '';
      try {
        const r = await fetch(url);
        if (r.ok) html = await r.text();
        else throw new Error('Direct fetch failed');
      } catch(e) {
        console.warn('Direct fetch failed, trying proxy...');
        const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
        const r2 = await fetch(proxyUrl);
        if (r2.ok) html = await r2.text();
        else throw new Error('Proxy failed too');
      }

      if (html) {
        // Initialize canvas with loaded HTML
        if (window.initCanvas) {
          window.initCanvas(html);
        }
        
        // Extract filename for tab name
        const filename = url.split('/').pop() || 'loaded.html';
        const page = window.pages ? window.pages[window.activePageIndex] : null;
        if (page) {
          page.name = filename;
          page.sourceUrl = url; // Track source for saving back
          if (window.renderPageTabs) window.renderPageTabs();
        }

        // Update status bar
        if (window.updateStatus) window.updateStatus(`Editing: ${filename}`);
        if (window.playSound) window.playSound('success');
        
        // Auto-extract theme
        setTimeout(() => {
          if (window.extractThemeFromCanvas) {
            window.extractThemeFromCanvas();
          }
        }, 500);
      }
    } catch(err) {
      console.error('Failed to load page:', err);
      if (window.updateStatus) window.updateStatus(`Error: ${err.message}`);
      alert(`Could not load page: ${err.message}`);
    }
  }

  // Export for use elsewhere
  window.loadPageIntoCanvas = loadPageIntoCanvas;

  function selectRegion(regionId) {
    // Toggle selection
    if (selectedRegionId === regionId) {
      selectedRegionId = null;
    } else {
      selectedRegionId = regionId;
    }

    // Update UI
    document.querySelectorAll('.wgp-region').forEach(el => {
      el.classList.toggle('selected', el.dataset.regionId === selectedRegionId);
    });

    // Update store if available
    if (window.coaiexistStore) {
      // Could filter components by region here
    }

    if (window.playSound) window.playSound('boop');
  }

  function togglePanel() {
    panelExpanded = !panelExpanded;
    const panel = document.getElementById('world-graph-panel');
    if (panel) {
      panel.classList.toggle('expanded', panelExpanded);
      document.body.classList.toggle('world-panel-open', panelExpanded);
    }
    if (window.playSound) window.playSound('pop');
  }

  // Global functions
  window.toggleWorldGraphPanel = togglePanel;

  window.tagCurrentPage = function() {
    if (!selectedRegionId) {
      alert('Please select a world region first!');
      return;
    }

    const region = WORLD_REGIONS.find(r => r.id === selectedRegionId);
    if (!region) return;

    // Tag in store if available
    if (window.coaiexistStore) {
      window.coaiexistStore.updateActivePage({ worldNodeId: selectedRegionId });
    }

    if (window.updateStatus) {
      window.updateStatus(`Page tagged to ${region.name}`);
    }
    if (window.playSound) window.playSound('success');
    if (window.showStamp) window.showStamp(TYPE_ICONS[region.type] || '🏷️');

    alert(`Page tagged to: ${region.name}\n${region.description}`);
  };

  window.getSelectedWorldRegion = function() {
    return selectedRegionId ? WORLD_REGIONS.find(r => r.id === selectedRegionId) : null;
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWorldGraphPanel);
  } else {
    createWorldGraphPanel();
  }

  console.log('🌐 World Graph Panel loaded!');
})();
