// ============================================
// PAGE LOADER & COMPONENT LIBRARY SYSTEM
// Load pages from embedded source files
// ============================================

// Page sources loaded from page-sources-embedded.js (164 HTML files!)
// Raw source HTML embedded - loads instantly, all elements editable

// PAGE_SOURCES dynamically populated from PAGE_SOURCE_HTML after it loads
let PAGE_SOURCES = [];

const populatePageSourcesFromEmbedded = () => {
    if (!window.PAGE_SOURCE_HTML) {
        return false;
    }
    const embeddedPages = Object.keys(window.PAGE_SOURCE_HTML);
    if (!embeddedPages.length) {
        return false;
    }
    PAGE_SOURCES = embeddedPages.sort();
    return true;
};

const PAGE_SOURCES_WAIT_LIMIT = 8000;

// Rendering helpers to keep the page loader responsive
const PAGE_LOADER_BATCH_SIZE = 24;
const pageLoaderRenderState = {
    handle: null
};

const scheduleFrame = (callback) => {
    return (window.requestAnimationFrame || window.setTimeout).call(window, callback, 16);
};

const cancelFrame = (handle) => {
    if (handle == null) return;
    if (window.cancelAnimationFrame) {
        window.cancelAnimationFrame(handle);
    } else {
        clearTimeout(handle);
    }
};

const cancelPendingPageLoaderRender = () => {
    if (pageLoaderRenderState.handle != null) {
        cancelFrame(pageLoaderRenderState.handle);
        pageLoaderRenderState.handle = null;
    }
};

// Component Library Storage
let componentLibrary = [];
const COMPONENT_STORAGE_KEY = 'coaiexist-component-library';
const LEGACY_COMPONENT_STORAGE_KEY = 'coaiexist-studio-components';

const ensureComponentId = () => `comp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function normalizeComponent(component, index = 0) {
    const safeHtml = typeof component.html === 'string' ? component.html : '';
    return {
        id: component.id || ensureComponentId() + index,
        name: component.name || `Component ${index + 1}`,
        category: component.category || 'General',
        html: safeHtml,
        thumbnail: component.thumbnail || generateThumbnail(safeHtml),
        created: component.created || new Date().toISOString()
    };
}

function dedupeComponents(list) {
    if (!Array.isArray(list)) return [];
    const deduped = [];
    const idIndex = new Map();
    const signatureIndex = new Map();

    list.forEach((component) => {
        if (!component) return;
        const normalized = normalizeComponent(component, deduped.length);
        const signature = `${normalized.name}::${normalized.html}`;
        const existingIndex = idIndex.has(normalized.id)
            ? idIndex.get(normalized.id)
            : signatureIndex.get(signature);

        if (existingIndex != null) {
            const merged = {
                ...deduped[existingIndex],
                ...normalized,
                id: deduped[existingIndex].id || normalized.id,
            };
            deduped[existingIndex] = merged;
            idIndex.set(merged.id, existingIndex);
            signatureIndex.set(signature, existingIndex);
        } else {
            const idx = deduped.push(normalized) - 1;
            idIndex.set(normalized.id, idx);
            signatureIndex.set(signature, idx);
        }
    });

    return deduped;
}

function mergeWithStoredComponents(current = []) {
    try {
        const saved = localStorage.getItem(COMPONENT_STORAGE_KEY);
        if (!saved) return dedupeComponents(current);
        const parsed = JSON.parse(saved);
        return dedupeComponents([...(Array.isArray(parsed) ? parsed : []), ...current]);
    } catch (e) {
        console.warn('Component library merge failed, falling back to current snapshot.', e);
        return dedupeComponents(current);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // Populate PAGE_SOURCES from embedded HTML
    if (populatePageSourcesFromEmbedded()) {
        console.log(`📦 Loaded ${PAGE_SOURCES.length} pages from embedded sources`);
    } else {
        console.warn('⏳ PAGE_SOURCE_HTML not ready yet. Waiting for embedded sources to finish loading...');
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

    initializePageLoaderModal(modal);
}

function createPageLoaderModal() {
    console.log('Creating page loader modal with', PAGE_SOURCES.length, 'pages');

    const modal = document.createElement('div');
    modal.id = 'source-page-loader-modal';
    modal.className = 'modal';

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>📁 Load Page from Source Files</h2>
                <button class="modal-close" data-close-modal="source-page-loader-modal">×</button>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 15px; color: var(--text-secondary);">
                    Load pages directly from embedded source - no CORS issues! Each element becomes individually editable.
                </p>

                <div class="page-loader-controls">
                    <input type="search" id="page-loader-search" placeholder="Search ${PAGE_SOURCES.length} pages..." aria-label="Search source pages" />
                    <span id="page-loader-count" class="page-loader-count"></span>
                </div>

                <div id="page-grid" class="page-grid" role="list"></div>
                <div id="page-loader-empty" class="page-loader-empty" hidden>
                    <div style="font-size: 40px; margin-bottom: 10px;">🔍</div>
                    <p>No pages match your search.</p>
                </div>
            </div>
        </div>
    `;

    // Add styles once
    if (!document.getElementById('page-loader-modal-style')) {
        const style = document.createElement('style');
        style.id = 'page-loader-modal-style';
        style.textContent = `
            .page-loader-controls {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                align-items: center;
                margin-bottom: 15px;
            }
            #page-loader-search {
                flex: 1 1 240px;
                padding: 8px 12px;
                border-radius: var(--border-radius);
                border: 1px solid var(--border-color);
                background: var(--ui-bg);
                color: var(--text-primary);
                font-size: 14px;
            }
            #page-loader-search:focus {
                outline: none;
                border-color: var(--accent);
                box-shadow: 0 0 0 2px rgba(0, 255, 204, 0.2);
            }
            .page-loader-count {
                font-size: 13px;
                color: var(--text-secondary);
            }
            .page-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 15px;
            }
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
                width: 100%;
            }
            .page-card-actions button + button {
                margin-top: 6px;
            }
            .page-loader-empty {
                text-align: center;
                padding: 30px;
                color: var(--text-secondary);
            }
        `;
        document.head.appendChild(style);
    }

    return modal;
}

function initializePageLoaderModal(modal) {
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

    const searchInput = modal.querySelector('#page-loader-search');
    const countLabel = modal.querySelector('#page-loader-count');
    const grid = modal.querySelector('#page-grid');
    const emptyState = modal.querySelector('#page-loader-empty');

    if (emptyState && !emptyState.dataset.defaultMarkup) {
        emptyState.dataset.defaultMarkup = emptyState.innerHTML;
    }

    const setEmptyStateMessage = (icon, message) => {
        if (!emptyState) return;
        emptyState.innerHTML = `
            <div style="font-size: 40px; margin-bottom: 10px;">${icon}</div>
            <p>${message}</p>
        `;
        emptyState.hidden = false;
        if (grid) {
            grid.hidden = true;
        }
    };

    const resetEmptyStateMessage = () => {
        if (!emptyState || !emptyState.dataset.defaultMarkup) return;
        emptyState.innerHTML = emptyState.dataset.defaultMarkup;
    };

    const applyFilter = () => {
        const query = (searchInput?.value || '').trim().toLowerCase();
        const filteredPages = query
            ? PAGE_SOURCES.filter(name => name.toLowerCase().includes(query))
            : PAGE_SOURCES.slice();
        updatePageLoaderCount(countLabel, filteredPages.length);
        renderPageLoaderGrid(grid, emptyState, filteredPages);
    };

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            cancelPendingPageLoaderRender();
            pageLoaderRenderState.handle = scheduleFrame(applyFilter);
        });
    }

    if (grid) {
        grid.addEventListener('click', handlePageGridClick);
    }

    const startRendering = () => {
        resetEmptyStateMessage();
        applyFilter();
    };

    const waitForSourcesAndRender = () => {
        if (populatePageSourcesFromEmbedded()) {
            startRendering();
            return;
        }

        if (countLabel) {
            countLabel.textContent = 'Loading sources...';
        }
        if (grid) {
            grid.hidden = true;
        }
        setEmptyStateMessage('⏳', 'Preparing the embedded source list...');

        const startTime = performance.now();
        const poll = () => {
            if (!document.body.contains(modal)) {
                return;
            }
            if (populatePageSourcesFromEmbedded()) {
                startRendering();
                return;
            }
            if (performance.now() - startTime > PAGE_SOURCES_WAIT_LIMIT) {
                if (countLabel) {
                    countLabel.textContent = 'Sources still loading...';
                }
                setEmptyStateMessage('⚠️', 'Still waiting for embedded sources to finish loading. Please try again in a moment.');
                return;
            }
            scheduleFrame(poll);
        };

        scheduleFrame(poll);
    };

    waitForSourcesAndRender();
}

function updatePageLoaderCount(target, count) {
    if (!target) return;
    const label = count === 1 ? 'page' : 'pages';
    target.textContent = `${count} ${label}`;
}

function renderPageLoaderGrid(grid, emptyState, pages) {
    if (!grid || !emptyState) return;
    cancelPendingPageLoaderRender();
    grid.innerHTML = '';

    if (!pages.length) {
        grid.hidden = true;
        emptyState.hidden = false;
        return;
    }

    grid.hidden = false;
    emptyState.hidden = true;

    let index = 0;
    const renderChunk = () => {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < PAGE_LOADER_BATCH_SIZE && index < pages.length; i += 1, index += 1) {
            fragment.appendChild(createPageCard(pages[index]));
        }
        grid.appendChild(fragment);

        if (index < pages.length) {
            pageLoaderRenderState.handle = scheduleFrame(renderChunk);
        } else {
            pageLoaderRenderState.handle = null;
        }
    };

    applyFilter();
}

function updatePageLoaderCount(target, count) {
    if (!target) return;
    const label = count === 1 ? 'page' : 'pages';
    target.textContent = `${count} ${label}`;
}

function renderPageLoaderGrid(grid, emptyState, pages) {
    if (!grid || !emptyState) return;
    cancelPendingPageLoaderRender();
    grid.innerHTML = '';

    if (!pages.length) {
        grid.hidden = true;
        emptyState.hidden = false;
        return;
    }

    grid.hidden = false;
    emptyState.hidden = true;

    let index = 0;
    const renderChunk = () => {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < PAGE_LOADER_BATCH_SIZE && index < pages.length; i += 1, index += 1) {
            fragment.appendChild(createPageCard(pages[index]));
        }
        grid.appendChild(fragment);

        if (index < pages.length) {
            pageLoaderRenderState.handle = scheduleFrame(renderChunk);
        } else {
            pageLoaderRenderState.handle = null;
        }
    };

    renderChunk();
}

function createPageCard(pageName) {
    const card = document.createElement('div');
    card.className = 'page-card';
    card.dataset.page = pageName;
    card.setAttribute('role', 'listitem');

    const header = document.createElement('div');
    header.className = 'page-card-header';
    const title = document.createElement('strong');
    title.textContent = pageName;
    header.appendChild(title);

    const actions = document.createElement('div');
    actions.className = 'page-card-actions';

    const fullBtn = document.createElement('button');
    fullBtn.className = 'big-button load-full-btn';
    fullBtn.dataset.pageName = pageName;
    fullBtn.type = 'button';
    fullBtn.textContent = '📖 Full (HTML+CSS+JS)';

    const bodyBtn = document.createElement('button');
    bodyBtn.className = 'big-button load-body-btn';
    bodyBtn.dataset.pageName = pageName;
    bodyBtn.type = 'button';
    bodyBtn.textContent = '🎯 Body Only';

    actions.appendChild(fullBtn);
    actions.appendChild(bodyBtn);

    card.appendChild(header);
    card.appendChild(actions);

    return card;
}

function handlePageGridClick(event) {
    const button = event.target.closest('button[data-page-name]');
    if (!button) {
        return;
    }
    event.preventDefault();
    const pageName = button.dataset.pageName;
    const bodyOnly = button.classList.contains('load-body-btn');
    window.loadPageFromSource(pageName, bodyOnly);
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

        const assetRoot = window.DEFAULT_BASE_HREF || 'https://coaiexist.wtf/assets/';
        const fallbackSiteRoot = (() => {
            try {
                const assetUrl = new URL(assetRoot);
                return `${assetUrl.origin}/`;
            } catch (err) {
                console.warn('Falling back to default site root – could not parse asset root', err);
                return 'https://coaiexist.wtf/';
            }
        })();
        const siteRoot = window.COAISOURCE_ROOT || fallbackSiteRoot;
        let derivedBase = assetRoot;
        try {
            const pageUrl = new URL(pageName, siteRoot);
            derivedBase = new URL('.', pageUrl).href;
        } catch (err) {
            console.warn('Unable to derive base for', pageName, err);
        }

        if (bodyOnly) {
            // Just load body content - ignore CSS/JS
            if (window.initCanvas) {
                window.initCanvas(bodyContent, { baseHref: derivedBase });
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
                window.initCanvas(bodyContent, { baseHref: derivedBase });
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
        renderComponentLibrary();

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

    renderComponentToolbox();
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

function saveSelectedComponent() {
    const doc = getCanvasDoc && getCanvasDoc();
    if (!doc) return;

    const selected = doc.querySelector('.canvas-element.selected');
    if (!selected) {
        alert('Please select an element first!');
        return;
    }

    const name = prompt('Enter a name for this component:', 'My Component');
    if (!name) return;

    const category = prompt('Enter a category (optional):', 'General') || 'General';

    const html = selected.innerHTML.trim();
    if (!html) {
        alert('Nothing to save. Try selecting a richer element.');
        return;
    }

    // Create component object
    const component = normalizeComponent({
        id: ensureComponentId(),
        name,
        category,
        html,
        thumbnail: generateThumbnail(html),
        created: new Date().toISOString()
    }, componentLibrary.length);

    // Add to library
    componentLibrary.push(component);
    componentLibrary = dedupeComponents(componentLibrary);
    saveComponentLibrary();
    renderComponentLibrary();
    renderComponentToolbox();

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

    if (!grid || !empty) {
        return;
    }

    if (componentLibrary.length === 0) {
        grid.style.display = 'none';
        empty.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    empty.style.display = 'none';

    // Escape HTML to prevent XSS
    const escapeHtml = (str) => {
        const div = document.createElement('div');
        div.textContent = str || '';
        return div.innerHTML;
    };

    grid.innerHTML = componentLibrary.map(comp => {
        const escapedId = escapeHtml(comp.id);
        const escapedName = escapeHtml(comp.name);
        const escapedCategory = escapeHtml(comp.category);
        return `
        <div class="component-card" data-component-id="${escapedId}">
            <div class="component-card-header">
                <strong>${escapedName}</strong>
                <span class="component-category">${escapedCategory}</span>
            </div>
            <div class="component-preview">
                ${comp.thumbnail}
            </div>
            <div class="component-actions">
                <button class="big-button insert-comp-btn" data-comp-id="${escapedId}" style="flex: 1;">
                    ➕ Insert
                </button>
                <button class="big-button delete-comp-btn" data-comp-id="${escapedId}" style="background: #ff3860; color: white;">
                    🗑️
                </button>
            </div>
        </div>
    `;
    }).join('');

    // Attach event listeners to buttons
    grid.querySelectorAll('.insert-comp-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const compId = e.currentTarget.dataset.compId;
            window.insertComponent(compId);
        });
    });
    grid.querySelectorAll('.delete-comp-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const compId = e.currentTarget.dataset.compId;
            window.deleteComponent(compId);
        });
    });

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

function renderComponentToolbox() {
    const libraryContainer = document.getElementById('components-library');
    if (!libraryContainer) return;

    libraryContainer.innerHTML = '';

    if (componentLibrary.length === 0) {
        libraryContainer.innerHTML = '<div style="font-size: 12px; color: #666; text-align: center;">Save elements as components!</div>';
        return;
    }

    const items = componentLibrary.map((comp) => {
        const item = document.createElement('div');
        item.className = 'tool-item';
        item.textContent = `💾 ${comp.name}`;
        item.title = `Add ${comp.name}`;
        item.dataset.componentHtml = comp.html;
        item.draggable = true;
        return item;
    });

    libraryContainer.append(...items);
    if (window.attachToolItemListeners) {
        window.attachToolItemListeners(items);
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

window.saveSelectedComponent = saveSelectedComponent;

window.deleteComponent = function(componentId) {
    const component = componentLibrary.find(c => c.id === componentId);
    if (!component) return;

    if (confirm(`Delete component "${component.name}"?`)) {
        componentLibrary = componentLibrary.filter(c => c.id !== componentId);
        saveComponentLibrary();
        renderComponentLibrary();
        renderComponentToolbox();
        if (window.playSound) window.playSound('pop');
        if (window.updateStatus) window.updateStatus(`Deleted: ${component.name}`);
    }
};

// ============================================
// PERSISTENCE
// ============================================
function saveComponentLibrary() {
    try {
        componentLibrary = mergeWithStoredComponents(componentLibrary);
        localStorage.setItem(COMPONENT_STORAGE_KEY, JSON.stringify(componentLibrary));
        // Keep legacy storage in sync so older flows remain functional
        const legacyPayload = componentLibrary.map(comp => ({ name: comp.name, html: comp.html }));
        localStorage.setItem(LEGACY_COMPONENT_STORAGE_KEY, JSON.stringify(legacyPayload));
    } catch (e) {
        console.error('Failed to save component library:', e);
    }
}

function loadComponentLibrary() {
    try {
        const saved = localStorage.getItem(COMPONENT_STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            componentLibrary = Array.isArray(parsed) ? parsed.map(normalizeComponent) : [];
            console.log(`Loaded ${componentLibrary.length} components from library`);
        } else {
            const legacy = localStorage.getItem(LEGACY_COMPONENT_STORAGE_KEY);
            if (legacy) {
                const parsedLegacy = JSON.parse(legacy);
                componentLibrary = Array.isArray(parsedLegacy) ? parsedLegacy.map((comp, idx) => normalizeComponent({
                    name: comp.name,
                    category: comp.category || 'Legacy',
                    html: comp.html,
                }, idx)) : [];
                saveComponentLibrary();
                console.log(`Migrated ${componentLibrary.length} legacy components`);
            }
        }
    } catch (e) {
        console.error('Failed to load component library:', e);
        componentLibrary = [];
    }

    componentLibrary = dedupeComponents(componentLibrary);
    renderComponentToolbox();
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
                const normalized = Array.isArray(imported) ? imported.map((comp, idx) => normalizeComponent(comp, idx)) : [];
                const beforeCount = componentLibrary.length;
                componentLibrary = dedupeComponents([...componentLibrary, ...normalized]);
                saveComponentLibrary();
                renderComponentLibrary();
                renderComponentToolbox();
                const added = componentLibrary.length - beforeCount;
                const statusMessage = added === imported.length
                    ? `Imported ${imported.length} components!`
                    : `Imported ${added} of ${imported.length} components (duplicates skipped).`;
                if (window.updateStatus) window.updateStatus(statusMessage);
                if (window.playSound) window.playSound('success');
            } catch (err) {
                alert('Failed to import: Invalid JSON file');
            }
        };
        reader.readAsText(file);
    });
    input.click();
};
