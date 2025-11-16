// ============================================
// PAGE LOADER & COMPONENT LIBRARY SYSTEM
// Load pages from embedded source files
// ============================================

// Page sources loaded from page-sources-embedded.js (164 HTML files!)
// Raw source HTML embedded - loads instantly, all elements editable

// PAGE_SOURCES dynamically populated from PAGE_SOURCE_HTML after it loads
let PAGE_SOURCES = [];

// Component Library Storage
let componentLibrary = [];

window.addEventListener('DOMContentLoaded', () => {
    // Populate PAGE_SOURCES from embedded HTML
    if (window.PAGE_SOURCE_HTML) {
        PAGE_SOURCES = Object.keys(window.PAGE_SOURCE_HTML).sort();
        console.log(`📦 Loaded ${PAGE_SOURCES.length} pages from embedded sources`);
    } else {
        console.error('❌ PAGE_SOURCE_HTML not loaded! Make sure page-sources-embedded.js is included.');
    }

    // Load saved components from localStorage
    loadComponentLibrary();

    // Initialize UI
    setupPageLoader();
    setupComponentLibrary();

    console.log('📚 Page Loader & Component Library initialized!');
});

// ============================================
// PAGE LOADER - Load from actual source files
// ============================================
function setupPageLoader() {
    // Add button to toolbar
    const toolbar = document.querySelector('.toolbar');
    if (toolbar && !document.getElementById('load-source-page-btn')) {
        const btn = document.createElement('button');
        btn.id = 'load-source-page-btn';
        btn.className = 'big-button';
        btn.innerHTML = '📁 Load from Source';
        btn.style.background = '#48c774';
        btn.style.color = '#fff';
        btn.addEventListener('click', () => {
            // Create/update modal when button is clicked
            createOrUpdatePageLoaderModal();
            if (window.openModal) {
                window.openModal('source-page-loader-modal');
            } else {
                document.getElementById('source-page-loader-modal').classList.add('active');
            }
        });
        toolbar.appendChild(btn);
    }
}

function createOrUpdatePageLoaderModal() {
    // Remove existing modal if present
    const existingModal = document.getElementById('source-page-loader-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = createPageLoaderModal();
    document.body.appendChild(modal);

    // Attach close button event listener
    const closeBtn = modal.querySelector('[data-close-modal]');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (window.closeModal) {
                window.closeModal('source-page-loader-modal');
            } else {
                modal.classList.remove('active');
            }
        });
    }
}

function createPageLoaderModal() {
    console.log('Creating page loader modal with', PAGE_SOURCES.length, 'pages');

    const modal = document.createElement('div');
    modal.id = 'source-page-loader-modal';
    modal.className = 'modal';

    const pageGridHTML = PAGE_SOURCES.length > 0
        ? PAGE_SOURCES.map(pageName => `
                        <div class="page-card" data-page="${pageName}">
                            <div class="page-card-header">
                                <strong>${pageName}</strong>
                            </div>
                            <div class="page-card-actions">
                                <button class="big-button" onclick="loadPageFromSource('${pageName}', false)" style="width: 100%; margin-bottom: 5px;">
                                    📖 Full (HTML+CSS+JS)
                                </button>
                                <button class="big-button" onclick="loadPageFromSource('${pageName}', true)" style="width: 100%;">
                                    🎯 Body Only
                                </button>
                            </div>
                        </div>
                    `).join('')
        : '<p style="color: var(--text-secondary); padding: 20px;">❌ No pages loaded! page-sources-embedded.js may not have loaded.</p>';

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>📁 Load Page from Source Files (${PAGE_SOURCES.length} pages)</h2>
                <button class="modal-close" data-close-modal="source-page-loader-modal">×</button>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 15px; color: var(--text-secondary);">
                    Load pages directly from embedded source - no CORS issues! Each element becomes individually editable.
                </p>

                <div id="page-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
                    ${pageGridHTML}
                </div>
            </div>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .page-card {
            background: var(--ui-bg);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 15px;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .page-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 255, 204, 0.3);
        }
        .page-card-header {
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--border-color);
            color: var(--accent);
        }
        .page-card-actions button {
            font-size: 13px;
            padding: 8px 12px;
        }
    `;
    document.head.appendChild(style);

    return modal;
}

window.loadPageFromSource = function(pageName, bodyOnly = false) {
    try {
        // Get HTML from embedded sources
        const html = window.PAGE_SOURCE_HTML && window.PAGE_SOURCE_HTML[pageName];
        if (!html) {
            alert(`Page ${pageName} not found in embedded sources!`);
            console.error('Available pages:', window.PAGE_SOURCE_HTML ? Object.keys(window.PAGE_SOURCE_HTML) : 'PAGE_SOURCE_HTML not loaded');
            return;
        }

        if (window.updateStatus) window.updateStatus(`Loading ${pageName} from source...`);

        // Parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Extract body content (always needed for canvas)
        const bodyContent = doc.body.innerHTML;

        if (bodyOnly) {
            // Just load body content - ignore CSS/JS
            if (window.initCanvas) {
                window.initCanvas(bodyContent);
            }
            if (window.updateStatus) window.updateStatus(`Loaded body from ${pageName}`);
        } else {
            // Load full page with CSS and JS
            // Extract CSS from <style> tags
            const cssContent = Array.from(doc.querySelectorAll('style'))
                .map(s => s.textContent)
                .join('\n\n');

            // Extract JS from inline <script> tags (not external ones)
            const jsContent = Array.from(doc.querySelectorAll('script:not([src])'))
                .map(s => s.textContent)
                .join('\n\n');

            // Load CSS into editor
            const cssEditor = document.getElementById('css-editor');
            if (cssEditor && cssContent) {
                cssEditor.value = cssContent;
            }

            // Load JS into editor
            const jsEditor = document.getElementById('js-editor');
            if (jsEditor && jsContent) {
                jsEditor.value = jsContent;
            }

            // Load body content into canvas
            if (window.initCanvas) {
                window.initCanvas(bodyContent);
            }

            // Apply the CSS and JS
            if (window.applyCustomCSS) window.applyCustomCSS();
            if (window.applyCustomJS) window.applyCustomJS();

            if (window.updateStatus) window.updateStatus(`Loaded full page: ${pageName}`);
        }

        if (window.closeModal) window.closeModal('source-page-loader-modal');
        if (window.playSound) window.playSound('success');
        if (window.showStamp) window.showStamp('📁');

    } catch (error) {
        console.error('Error loading page:', error);
        alert(`Error loading ${pageName}: ${error.message}`);
        if (window.updateStatus) window.updateStatus(`Failed to load ${pageName}`);
    }
};

// ============================================
// COMPONENT LIBRARY - Save & Reuse Components
// ============================================
function setupComponentLibrary() {
    // Create component library modal
    const existingModal = document.getElementById('component-library-modal');
    if (!existingModal) {
        const modal = createComponentLibraryModal();
        document.body.appendChild(modal);

        // Attach close button event listener
        const closeBtn = modal.querySelector('[data-close-modal]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (window.closeModal) {
                    window.closeModal('component-library-modal');
                } else {
                    modal.classList.remove('active');
                }
            });
        }
    }

    // Add button to toolbar
    const toolbar = document.querySelector('.toolbar');
    if (toolbar && !document.getElementById('component-library-btn')) {
        const btn = document.createElement('button');
        btn.id = 'component-library-btn';
        btn.className = 'big-button purple';
        btn.innerHTML = '💎 Components';
        btn.addEventListener('click', () => {
            renderComponentLibrary();
            if (window.openModal) {
                window.openModal('component-library-modal');
            } else {
                document.getElementById('component-library-modal')?.classList.add('active');
            }
        });
        toolbar.appendChild(btn);
    }

    // Add "Save Component" button to sidebar when element is selected
    enhanceElementSelection();
}

function createComponentLibraryModal() {
    const modal = document.createElement('div');
    modal.id = 'component-library-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px;">
            <div class="modal-header">
                <h2>💎 Component Library</h2>
                <button class="modal-close" data-close-modal="component-library-modal">×</button>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 15px; color: var(--text-secondary);">
                    Save components from your pages and reuse them anywhere!
                </p>

                <div id="component-library-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">
                    <!-- Components will be rendered here -->
                </div>

                <div id="component-library-empty" style="text-align: center; padding: 40px; color: var(--text-secondary); display: none;">
                    <div style="font-size: 48px; margin-bottom: 15px;">📦</div>
                    <p>No saved components yet!</p>
                    <p style="font-size: 14px; margin-top: 10px;">Select an element in the canvas and click "Save Component" to add it to your library.</p>
                </div>
            </div>
        </div>
    `;

    return modal;
}

function enhanceElementSelection() {
    // Add save component button to properties panel
    const checkAndAddButton = setInterval(() => {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && !document.getElementById('save-component-btn')) {
            const panel = document.getElementById('properties-panel');
            if (panel) {
                const btn = document.createElement('button');
                btn.id = 'save-component-btn';
                btn.className = 'big-button purple';
                btn.innerHTML = '💾 Save as Component';
                btn.style.width = '100%';
                btn.style.marginTop = '15px';
                btn.addEventListener('click', saveSelectedComponent);

                // Insert at top of properties panel
                panel.insertBefore(btn, panel.firstChild);
                clearInterval(checkAndAddButton);
            }
        }
    }, 500);
}

function saveSelectedComponent() {
    const doc = getCanvasDoc && getCanvasDoc();
    if (!doc) return;

    const selected = doc.querySelector('.selected');
    if (!selected) {
        alert('Please select an element first!');
        return;
    }

    const name = prompt('Enter a name for this component:', 'My Component');
    if (!name) return;

    const category = prompt('Enter a category (optional):', 'General') || 'General';

    // Clone the element and get its HTML
    const clone = selected.cloneNode(true);
    clone.classList.remove('selected');
    const html = clone.outerHTML;

    // Create component object
    const component = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        name: name,
        category: category,
        html: html,
        thumbnail: generateThumbnail(html),
        created: new Date().toISOString()
    };

    // Add to library
    componentLibrary.push(component);
    saveComponentLibrary();

    if (window.playSound) window.playSound('success');
    if (window.showStamp) window.showStamp('💾');
    if (window.updateStatus) window.updateStatus(`Saved component: ${name}`);

    alert(`Component "${name}" saved to library!`);
}

function generateThumbnail(html) {
    // Extract text preview
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = temp.textContent.trim().substring(0, 50);
    return text || 'Component';
}

function renderComponentLibrary() {
    const grid = document.getElementById('component-library-grid');
    const empty = document.getElementById('component-library-empty');

    if (componentLibrary.length === 0) {
        grid.style.display = 'none';
        empty.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    empty.style.display = 'none';

    grid.innerHTML = componentLibrary.map(comp => `
        <div class="component-card" data-component-id="${comp.id}">
            <div class="component-card-header">
                <strong>${comp.name}</strong>
                <span class="component-category">${comp.category}</span>
            </div>
            <div class="component-preview">
                ${comp.thumbnail}
            </div>
            <div class="component-actions">
                <button class="big-button" onclick="insertComponent('${comp.id}')" style="flex: 1;">
                    ➕ Insert
                </button>
                <button class="big-button" onclick="deleteComponent('${comp.id}')" style="background: #ff3860; color: white;">
                    🗑️
                </button>
            </div>
        </div>
    `).join('');

    // Add styles
    if (!document.getElementById('component-card-styles')) {
        const style = document.createElement('style');
        style.id = 'component-card-styles';
        style.textContent = `
            .component-card {
                background: var(--ui-bg);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius);
                padding: 15px;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .component-card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 10px;
                border-bottom: 1px solid var(--border-color);
            }
            .component-category {
                font-size: 12px;
                background: var(--accent);
                color: var(--black);
                padding: 2px 8px;
                border-radius: 3px;
            }
            .component-preview {
                background: var(--canvas-bg);
                color: var(--black);
                padding: 10px;
                border-radius: 4px;
                min-height: 60px;
                font-size: 12px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .component-actions {
                display: flex;
                gap: 5px;
            }
            .component-actions button {
                font-size: 13px;
                padding: 6px 10px;
            }
        `;
        document.head.appendChild(style);
    }
}

window.insertComponent = function(componentId) {
    const component = componentLibrary.find(c => c.id === componentId);
    if (!component) return;

    if (window.addElementHTML) {
        window.addElementHTML(component.html);
    }

    if (window.closeModal) window.closeModal('component-library-modal');
    if (window.playSound) window.playSound('pop');
    if (window.showStamp) window.showStamp('✨');
    if (window.updateStatus) window.updateStatus(`Inserted: ${component.name}`);
};

window.deleteComponent = function(componentId) {
    const component = componentLibrary.find(c => c.id === componentId);
    if (!component) return;

    if (confirm(`Delete component "${component.name}"?`)) {
        componentLibrary = componentLibrary.filter(c => c.id !== componentId);
        saveComponentLibrary();
        renderComponentLibrary();
        if (window.playSound) window.playSound('pop');
        if (window.updateStatus) window.updateStatus(`Deleted: ${component.name}`);
    }
};

// ============================================
// PERSISTENCE
// ============================================
function saveComponentLibrary() {
    try {
        localStorage.setItem('coaiexist-component-library', JSON.stringify(componentLibrary));
    } catch (e) {
        console.error('Failed to save component library:', e);
    }
}

function loadComponentLibrary() {
    try {
        const saved = localStorage.getItem('coaiexist-component-library');
        if (saved) {
            componentLibrary = JSON.parse(saved);
            console.log(`Loaded ${componentLibrary.length} components from library`);
        }
    } catch (e) {
        console.error('Failed to load component library:', e);
        componentLibrary = [];
    }
}

// ============================================
// EXPORT COMPONENT LIBRARY
// ============================================
window.exportComponentLibrary = function() {
    const json = JSON.stringify(componentLibrary, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'component-library.json';
    a.click();
    URL.revokeObjectURL(url);
    if (window.updateStatus) window.updateStatus('Component library exported!');
};

window.importComponentLibrary = function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                componentLibrary = [...componentLibrary, ...imported];
                saveComponentLibrary();
                renderComponentLibrary();
                if (window.updateStatus) window.updateStatus(`Imported ${imported.length} components!`);
                if (window.playSound) window.playSound('success');
            } catch (err) {
                alert('Failed to import: Invalid JSON file');
            }
        };
        reader.readAsText(file);
    });
    input.click();
};
