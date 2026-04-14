// ====
// THEME EXTRACTOR PANEL
// Analyze pages and extract color palettes, fonts, and styles
// ====

(function() {
  'use strict';

  let extractedTheme = null;

  function createThemeExtractorPanel() {
    // Find the sidebar properties panel
    const sidebar = document.querySelector('.sidebar-content');
    if (!sidebar) {
      console.log('Sidebar not found, will retry...');
      setTimeout(createThemeExtractorPanel, 500);
      return;
    }

    // Check if already exists
    if (document.getElementById('theme-extractor-panel')) return;

    // Create the panel as a prop-group
    const panel = document.createElement('details');
    panel.id = 'theme-extractor-panel';
    panel.className = 'prop-group';
    panel.innerHTML = `
      <summary>🎨 Theme Extractor</summary>
      <div class="prop-body">
        <div style="font-size: 10px; color: var(--text-dim); margin-bottom: 8px;">
          Extract colors, fonts, and styles from any page
        </div>
        
        <!-- URL Input -->
        <div style="margin-bottom: 10px;">
          <input type="text" id="theme-url-input" placeholder="Enter URL to analyze..." 
            style="width: 100%; font-size: 11px; margin-bottom: 4px;">
          <button class="btn" style="width: 100%; font-size: 11px;" onclick="window.themeExtractor.analyzeURL()">
            🔍 Analyze URL
          </button>
        </div>

        <div style="border-top: 1px solid var(--glass-border); padding-top: 10px; margin-top: 10px;">
          <button class="btn" style="width: 100%; font-size: 11px; margin-bottom: 8px;" onclick="window.themeExtractor.analyzeCurrentPage()">
            🎯 Analyze Current Canvas
          </button>
        </div>

        <!-- Extracted Theme Preview -->
        <div id="theme-preview-container" style="display: none; margin-top: 10px;">
          <div style="font-size: 10px; font-weight: 700; color: var(--cyan); margin-bottom: 6px; text-transform: uppercase;">
            Extracted Theme
          </div>
          
          <!-- Color Palette -->
          <div id="theme-colors" style="margin-bottom: 10px;"></div>
          
          <!-- Fonts -->
          <div id="theme-fonts" style="margin-bottom: 10px;"></div>
          
          <!-- Actions -->
          <div style="display: flex; gap: 4px;">
            <button class="btn btn-cyan" style="flex: 1; font-size: 10px; padding: 6px;" onclick="window.themeExtractor.applyTheme()">
              ✨ Apply Theme
            </button>
            <button class="btn btn-pink" style="flex: 1; font-size: 10px; padding: 6px;" onclick="window.themeExtractor.saveAsPreset()">
              💾 Save Preset
            </button>
          </div>
        </div>
      </div>
    `;

    // Insert after neocities panel
    const neocitiesPanel = document.getElementById('neocities-pages-panel');
    if (neocitiesPanel && neocitiesPanel.nextSibling) {
      sidebar.insertBefore(panel, neocitiesPanel.nextSibling);
    } else {
      sidebar.insertBefore(panel, sidebar.firstChild);
    }

    addThemeExtractorStyles();
  }

  function addThemeExtractorStyles() {
    if (document.getElementById('theme-extractor-styles')) return;

    const style = document.createElement('style');
    style.id = 'theme-extractor-styles';
    style.textContent = `
      .theme-color-swatch {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        margin-right: 6px;
        margin-bottom: 6px;
      }

      .theme-color-box {
        width: 32px;
        height: 32px;
        border-radius: 6px;
        border: 1px solid var(--glass-border);
        cursor: pointer;
        transition: transform 0.2s;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }

      .theme-color-box:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      }

      .theme-color-label {
        font-size: 8px;
        color: var(--text-dim);
        font-family: monospace;
      }

      .theme-font-item {
        padding: 4px 8px;
        background: rgba(0,0,0,0.2);
        border-radius: 4px;
        font-size: 10px;
        margin-bottom: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .theme-font-name {
        font-family: monospace;
        color: var(--text-main);
      }

      .theme-font-sample {
        font-size: 12px;
        color: var(--text-dim);
      }

      .theme-comp-item {
        padding: 6px 8px;
        background: rgba(0,0,0,0.2);
        border-radius: 4px;
        font-size: 10px;
        margin-bottom: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        transition: all 0.2s;
      }

      .theme-comp-item:hover {
        background: rgba(255,0,204,0.15);
        border-left: 2px solid var(--magenta);
      }

      .comp-copy-btn {
        background: transparent;
        border: none;
        cursor: pointer;
        opacity: 0.6;
        font-size: 12px;
      }

      .comp-copy-btn:hover {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }

  async function analyzeURL() {
    const input = document.getElementById('theme-url-input');
    const url = input.value.trim();
    
    if (!url) {
      alert('Please enter a URL to analyze');
      return;
    }

    try {
      if (window.updateStatus) window.updateStatus(`Analyzing ${url}...`);

      // Fetch the page (using CORS proxy if needed)
      let html;
      try {
        const response = await fetch(url);
        html = await response.text();
      } catch (corsError) {
        // Try CORS proxy
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const proxyResponse = await fetch(proxyUrl);
        const proxyData = await proxyResponse.json();
        html = proxyData.contents;
      }

      analyzeHTML(html, url);

    } catch (error) {
      console.error('Error analyzing URL:', error);
      alert(`Failed to analyze URL: ${error.message}`);
      if (window.updateStatus) window.updateStatus(`❌ Failed to analyze URL`);
    }
  }

  function analyzeCurrentPage(sourceUrl = 'Current Canvas') {
    const doc = window.getCanvasDoc && window.getCanvasDoc();
    if (!doc) {
      alert('No canvas document available');
      return;
    }

    if (window.updateStatus) window.updateStatus('Analyzing current page...');

    const html = doc.documentElement.outerHTML;
    analyzeHTML(html, sourceUrl);
  }

  function analyzeHTML(html, source) {
    try {
      // Parse HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Extract colors
      const colors = extractColors(doc);
      
      // Extract fonts
      const fonts = extractFonts(doc);

      // Extract components
      const components = extractComponents(doc);

      // Store extracted theme
      extractedTheme = {
        source,
        colors,
        fonts,
        components,
        timestamp: new Date().toISOString()
      };

      // Display theme
      displayExtractedTheme();

      if (window.playSound) window.playSound('pop');
      if (window.showStamp) window.showStamp('🎨');
      if (window.updateStatus) window.updateStatus('✅ Theme extracted!');
      if (window.moodBar) window.moodBar.setMood('🎨 Theme extracted successfully', true, 3000);

      console.log('🎨 Extracted theme:', extractedTheme);

    } catch (error) {
      console.error('Error analyzing HTML:', error);
      alert(`Failed to analyze: ${error.message}`);
    }
  }

  function extractColors(doc) {
    const colorSet = new Set();
    const elements = doc.querySelectorAll('*');

    elements.forEach(el => {
      const computed = window.getComputedStyle ? null : null; // Can't compute in parsed doc
      const inline = el.style;

      // Extract from inline styles
      if (inline.color) colorSet.add(normalizeColor(inline.color));
      if (inline.backgroundColor) colorSet.add(normalizeColor(inline.backgroundColor));
      if (inline.borderColor) colorSet.add(normalizeColor(inline.borderColor));

      // Extract from style attributes
      const styleAttr = el.getAttribute('style');
      if (styleAttr) {
        const colorMatches = styleAttr.match(/#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)/g);
        if (colorMatches) {
          colorMatches.forEach(color => colorSet.add(normalizeColor(color)));
        }
      }
    });

    // Extract from stylesheets
    const styles = doc.querySelectorAll('style');
    styles.forEach(style => {
      const colorMatches = style.textContent.match(/#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)/g);
      if (colorMatches) {
        colorMatches.forEach(color => colorSet.add(normalizeColor(color)));
      }
    });

    // Remove transparent/invalid colors and limit to top colors
    const validColors = Array.from(colorSet)
      .filter(color => color && !color.includes('transparent') && color !== '#000000' && color !== '#ffffff')
      .slice(0, 8);

    return validColors.length > 0 ? validColors : ['#ff00cc', '#00f0ff', '#ccff00']; // Fallback colors
  }

  function extractFonts(doc) {
    const fontSet = new Set();
    
    // Extract from style elements
    const styles = doc.querySelectorAll('style');
    styles.forEach(style => {
      const fontMatches = style.textContent.match(/font-family:\s*([^;}\n]+)/gi);
      if (fontMatches) {
        fontMatches.forEach(match => {
          const font = match.replace(/font-family:\s*/i, '').trim().split(',')[0].replace(/['"]/g, '');
          if (font && font !== 'inherit') fontSet.add(font);
        });
      }
    });

    // Extract from inline styles
    const elements = doc.querySelectorAll('[style*="font-family"]');
    elements.forEach(el => {
      const font = el.style.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
      if (font && font !== 'inherit') fontSet.add(font);
    });

    const fonts = Array.from(fontSet).slice(0, 5);
    return fonts.length > 0 ? fonts : ['Inter', 'Arial', 'sans-serif'];
  }

  function normalizeColor(color) {
    if (!color) return null;
    
    // Convert rgb/rgba to hex
    if (color.startsWith('rgb')) {
      const values = color.match(/\d+/g);
      if (values && values.length >= 3) {
        const r = parseInt(values[0]);
        const g = parseInt(values[1]);
        const b = parseInt(values[2]);
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      }
    }
    
    return color.toLowerCase();
  }

  function extractComponents(doc) {
    const components = [];
    
    // Find buttons
    const buttons = doc.querySelectorAll('button, .btn, [class*="button"]');
    buttons.forEach((btn, i) => {
      if (i < 3 && btn.outerHTML.length < 1000) {
        components.push({ type: 'Button', emoji: '🔘', html: btn.outerHTML });
      }
    });
    
    // Find cards
    const cards = doc.querySelectorAll('.card, [class*="card"], article');
    cards.forEach((card, i) => {
      if (i < 2 && card.outerHTML.length < 2000) {
        components.push({ type: 'Card', emoji: '📋', html: card.outerHTML });
      }
    });
    
    // Find headers
    const headers = doc.querySelectorAll('header, nav, .header, .nav');
    headers.forEach((h, i) => {
      if (i < 1 && h.outerHTML.length < 2000) {
        components.push({ type: 'Header', emoji: '📌', html: h.outerHTML });
      }
    });
    
    // Find forms
    const forms = doc.querySelectorAll('form');
    forms.forEach((f, i) => {
      if (i < 1 && f.outerHTML.length < 3000) {
        components.push({ type: 'Form', emoji: '📝', html: f.outerHTML });
      }
    });
    
    return components.slice(0, 6);
  }

  function displayExtractedTheme() {
    const container = document.getElementById('theme-preview-container');
    const colorsDiv = document.getElementById('theme-colors');
    const fontsDiv = document.getElementById('theme-fonts');

    if (!container || !extractedTheme) return;

    // Show container
    container.style.display = 'block';

    // Display source
    let html = `<div style="font-size:9px;color:var(--cyan);margin-bottom:8px;">📍 Extracted from: ${extractedTheme.source.slice(0,40)}...</div>`;

    // Display colors
    colorsDiv.innerHTML = html + `
      <div style="font-size: 9px; font-weight: 700; color: var(--text-dim); margin-bottom: 6px; text-transform: uppercase;">
        Color Palette (${extractedTheme.colors.length})
      </div>
      <div style="display: flex; flex-wrap: wrap;">
        ${extractedTheme.colors.map(color => `
          <div class="theme-color-swatch" title="Click to copy: ${color}">
            <div class="theme-color-box" style="background: ${color};" onclick="navigator.clipboard.writeText('${color}');window.updateStatus&&window.updateStatus('Copied ${color}')"></div>
            <span class="theme-color-label">${color.slice(0, 7)}</span>
          </div>
        `).join('')}
      </div>
    `;

    // Display fonts
    fontsDiv.innerHTML = `
      <div style="font-size: 9px; font-weight: 700; color: var(--text-dim); margin-bottom: 6px; text-transform: uppercase;">
        Fonts (${extractedTheme.fonts.length})
      </div>
      ${extractedTheme.fonts.map(font => `
        <div class="theme-font-item" onclick="navigator.clipboard.writeText('${font}');window.updateStatus&&window.updateStatus('Copied ${font}')" style="cursor:pointer;">
          <span class="theme-font-name">${font}</span>
          <span class="theme-font-sample" style="font-family: '${font}', sans-serif;">Aa</span>
        </div>
      `).join('')}
    `;

    // Display components if any
    if (extractedTheme.components && extractedTheme.components.length > 0) {
      const compsDiv = document.getElementById('theme-components') || createComponentsDiv();
      compsDiv.innerHTML = `
        <div style="font-size: 9px; font-weight: 700; color: var(--text-dim); margin-bottom: 6px; text-transform: uppercase;">
          Components (${extractedTheme.components.length})
        </div>
        ${extractedTheme.components.map((comp, i) => `
          <div class="theme-comp-item" data-comp-idx="${i}" title="Click to copy/insert">
            <span>${comp.emoji} ${comp.type}</span>
            <button class="comp-copy-btn" onclick="event.stopPropagation();window.themeExtractor.copyComponent(${i})">📋</button>
          </div>
        `).join('')}
      `;
    }
  }

  function createComponentsDiv() {
    const fontsDiv = document.getElementById('theme-fonts');
    const div = document.createElement('div');
    div.id = 'theme-components';
    div.style.marginBottom = '10px';
    fontsDiv.after(div);
    return div;
  }

  function copyComponent(idx) {
    if (!extractedTheme || !extractedTheme.components[idx]) return;
    const comp = extractedTheme.components[idx];
    navigator.clipboard.writeText(comp.html);
    if (window.updateStatus) window.updateStatus(`Copied ${comp.type} component to clipboard`);
    if (window.playSound) window.playSound('pop');
  }

  function applyTheme() {
    if (!extractedTheme) {
      alert('No theme extracted yet!');
      return;
    }

    const doc = window.getCanvasDoc && window.getCanvasDoc();
    if (!doc) {
      alert('No canvas document available');
      return;
    }

    // Apply colors to CSS variables if they exist
    if (doc.body) {
      const [primary, secondary, accent] = extractedTheme.colors;
      if (primary) doc.body.style.setProperty('--primary-color', primary);
      if (secondary) doc.body.style.setProperty('--secondary-color', secondary);
      if (accent) doc.body.style.setProperty('--accent-color', accent);
    }

    // Apply first font to body
    if (extractedTheme.fonts[0]) {
      doc.body.style.fontFamily = extractedTheme.fonts[0];
    }

    if (window.saveState) window.saveState();
    if (window.playSound) window.playSound('pop');
    if (window.showStamp) window.showStamp('✨');
    if (window.updateStatus) window.updateStatus('✅ Theme applied!');
    if (window.moodBar) window.moodBar.setMood('✨ Theme applied to canvas', true, 3000);

    alert('Theme applied! Colors and fonts have been set.');
  }

  function saveAsPreset() {
    if (!extractedTheme) {
      alert('No theme extracted yet!');
      return;
    }

    const presetName = prompt('Enter a name for this style preset:', extractedTheme.source.replace(/https?:\/\//, '').slice(0, 20));
    if (!presetName) return;

    // Create a new style preset
    const newPreset = {
      id: `extracted-${Date.now()}`,
      name: presetName,
      emoji: '🎨',
      styles: {
        background: extractedTheme.colors[0] || '#1a1a1a',
        color: extractedTheme.colors[1] || '#ffffff',
        fontFamily: extractedTheme.fonts[0] || 'Inter',
        border: `2px solid ${extractedTheme.colors[2] || '#333'}`,
        borderRadius: '8px',
        padding: '15px'
      }
    };

    // Add to style chips if available
    if (window.styleChips) {
      window.styleChips.presets.push(newPreset);
      // Trigger re-render of style chips
      const panel = document.getElementById('style-chips-panel');
      if (panel) {
        panel.remove();
        if (window.createStyleChipsPanel) {
          setTimeout(() => window.createStyleChipsPanel(), 100);
        }
      }
    }

    if (window.playSound) window.playSound('pop');
    if (window.showStamp) window.showStamp('💾');
    if (window.updateStatus) window.updateStatus('✅ Preset saved!');
    if (window.moodBar) window.moodBar.setMood('💾 Style preset saved', true, 3000);

    alert(`✅ "${presetName}" saved as a style preset!`);
    console.log('💾 Saved theme preset:', newPreset);
  }

  // Global API
  window.themeExtractor = {
    analyzeURL,
    analyzeCurrentPage,
    applyTheme,
    saveAsPreset,
    copyComponent,
    getExtractedTheme: () => extractedTheme
  };

  // Convenience function for auto-extraction when loading pages
  window.extractThemeFromCanvas = function() {
    analyzeCurrentPage('Loaded Page');
    // Open the theme extractor panel
    const panel = document.getElementById('theme-extractor-panel');
    if (panel && !panel.open) {
      panel.open = true;
    }
  };

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(createThemeExtractorPanel, 400));
  } else {
    setTimeout(createThemeExtractorPanel, 400);
  }

  console.log('🎨 Theme Extractor Panel loaded!');
})();
