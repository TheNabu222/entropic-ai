// ============================================
// NEOCITIES DEPLOYMENT SYSTEM - PRO MODE
// Auto-deploy, diff viewer, rollback, history
// ============================================

const NEOCITIES_API = 'https://neocities.org/api';
const RATE_LIMIT_MS = 60000; // 1 minute between deploys (Neocities rule)
const DEFAULT_NEOCITIES_API_KEY = '95cba50ce217a25db2e85800e178044e';

let neocitiesConfig = {
    apiKey: DEFAULT_NEOCITIES_API_KEY,
    autoDeployEnabled: false,
    lastDeployTime: 0,
    deploymentHistory: [],
    siteFiles: []
};

window.addEventListener('DOMContentLoaded', () => {
    loadNeocitiesConfig();
    setupNeocitiesDeployment();
    console.log('🚀 Neocities PRO Deployment System loaded!');
});

function getApiKeyInputValue() {
    const input = document.getElementById('neocities-api-key');
    return input ? input.value.trim() : '';
}

function getActiveApiKey() {
    return getApiKeyInputValue() || neocitiesConfig.apiKey || '';
}

const htmlEscaper = document.createElement('div');
function escapeHtml(str = '') {
    htmlEscaper.textContent = String(str);
    return htmlEscaper.innerHTML;
}

function formatNumberSafe(value, fallback = '0') {
    const num = Number(value);
    return Number.isFinite(num) ? num.toLocaleString() : fallback;
}

function formatDateSafe(value, type = 'datetime', fallback = 'Unknown') {
    if (!value) return fallback;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return fallback;

    switch (type) {
        case 'date':
            return date.toLocaleDateString();
        case 'time':
            return date.toLocaleTimeString();
        default:
            return date.toLocaleString();
    }
}

// ============================================
// INITIALIZATION
// ============================================
function setupNeocitiesDeployment() {
    createDeploymentModal();
    addDeployButton();
    setupAutoDeployListener();
}

function loadNeocitiesConfig() {
    try {
        const saved = localStorage.getItem('neocities-config');
        if (saved) {
            const config = JSON.parse(saved);
            neocitiesConfig = { ...neocitiesConfig, ...config };
        }

        // Ensure the deploy modal works out-of-the-box with the shared studio key
        if (!neocitiesConfig.apiKey) {
            neocitiesConfig.apiKey = DEFAULT_NEOCITIES_API_KEY;
        }
    } catch (e) {
        console.error('Failed to load Neocities config:', e);
    }
}

function saveNeocitiesConfig() {
    try {
        // Don't save API key in history (security)
        const toSave = {
            ...neocitiesConfig,
            deploymentHistory: neocitiesConfig.deploymentHistory.slice(-20) // Keep last 20
        };
        localStorage.setItem('neocities-config', JSON.stringify(toSave));
    } catch (e) {
        console.error('Failed to save Neocities config:', e);
    }
}

// ============================================
// UI COMPONENTS
// ============================================
function addDeployButton() {
    const toolbar = document.querySelector('.toolbar');
    if (toolbar && !document.getElementById('neocities-deploy-btn')) {
        const btn = document.createElement('button');
        btn.id = 'neocities-deploy-btn';
        btn.className = 'big-button';
        btn.innerHTML = '🚀 Deploy to Neocities';
        btn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        btn.style.color = '#fff';
        btn.addEventListener('click', () => {
            if (window.openModal) {
                window.openModal('neocities-deploy-modal');
            } else {
                document.getElementById('neocities-deploy-modal')?.classList.add('active');
            }
        });
        toolbar.appendChild(btn);
    }
}

function createDeploymentModal() {
    const modal = document.createElement('div');
    modal.id = 'neocities-deploy-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 1000px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h2>🚀 Neocities Deployment Center</h2>
                <button class="modal-close" data-close-modal="neocities-deploy-modal">×</button>
            </div>
            <div class="modal-body">
                <!-- API Key Setup -->
                <div class="deploy-section">
                    <h3>🔑 API Configuration</h3>
                    <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 15px;">
                        <input type="password" id="neocities-api-key"
                               placeholder="API Key"
                               value="${neocitiesConfig.apiKey || ''}"
                               style="flex: 1; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--ui-bg); color: var(--text-primary);">
                        <button class="big-button" onclick="toggleApiKeyVisibility()">👁️</button>
                        <button class="big-button green" onclick="saveApiKey()">💾 Save</button>
                        <button class="big-button" onclick="testConnection()">🔌 Test</button>
                    </div>
                    <div id="connection-status" style="padding: 10px; border-radius: 4px; display: none;"></div>
                </div>

                <!-- Site Stats -->
                <div class="deploy-section" id="site-stats-section" style="display: none;">
                    <h3>📊 Site Statistics</h3>
                    <div id="site-stats" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
                        <!-- Stats will be loaded here -->
                    </div>
                </div>

                <!-- File Browser & Comparison -->
                <div class="deploy-section">
                    <h3>📁 File Management</h3>
                    <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                        <button class="big-button" onclick="refreshNeocitiesFiles()">🔄 Refresh Files</button>
                        <button class="big-button purple" onclick="compareLocalRemote()">🔍 Compare Local/Remote</button>
                    </div>
                    <div id="neocities-file-browser" style="background: var(--ui-bg); border: 1px solid var(--border-color); border-radius: 4px; padding: 15px; max-height: 300px; overflow-y: auto;">
                        <p style="color: var(--text-secondary);">Click "Refresh Files" to load your Neocities files</p>
                    </div>
                </div>

                <!-- Quick Deploy -->
                <div class="deploy-section">
                    <h3>🎯 Quick Deploy</h3>
                    <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 15px;">
                        <label style="color: var(--text-primary);">Deploy current page as:</label>
                        <input type="text" id="deploy-filename"
                               placeholder="filename.html"
                               value="construction.html"
                               style="flex: 1; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--ui-bg); color: var(--text-primary);">
                        <button class="big-button" style="background: #48c774; color: white;" onclick="deployCurrentPage()">
                            🚀 Deploy Now
                        </button>
                    </div>

                    <!-- Auto-Deploy Toggle -->
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; margin-top: 15px;">
                        <input type="checkbox" id="auto-deploy-toggle"
                               ${neocitiesConfig.autoDeployEnabled ? 'checked' : ''}
                               onchange="toggleAutoDeploy(this.checked)"
                               style="width: 20px; height: 20px; cursor: pointer;">
                        <span style="color: var(--text-primary); font-weight: bold;">
                            ⚡ Enable Auto-Deploy (deploys automatically when you make changes)
                        </span>
                    </label>
                    <p style="color: var(--text-secondary); font-size: 12px; margin-top: 5px; margin-left: 30px;">
                        Rate limited to 1 deploy per minute (Neocities API requirement)
                    </p>
                </div>

                <!-- Deployment History -->
                <div class="deploy-section">
                    <h3>📜 Deployment History</h3>
                    <div id="deployment-history" style="max-height: 250px; overflow-y: auto;">
                        <!-- History will be rendered here -->
                    </div>
                </div>

                <!-- Diff Viewer -->
                <div class="deploy-section" id="diff-viewer-section" style="display: none;">
                    <h3>🔍 Change Diff Viewer</h3>
                    <div id="diff-viewer" style="background: var(--canvas-bg); color: var(--black); padding: 15px; border-radius: 4px; font-family: monospace; font-size: 12px; max-height: 300px; overflow: auto;">
                        <!-- Diff will be shown here -->
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    addDeploymentStyles();
}

function addDeploymentStyles() {
    const style = document.createElement('style');
    style.id = 'neocities-deploy-styles';
    style.textContent = `
        .deploy-section {
            background: var(--toolbar-bg);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 20px;
            margin-bottom: 20px;
        }

        .deploy-section h3 {
            color: var(--accent);
            margin-bottom: 15px;
            font-size: 18px;
        }

        .stat-card {
            background: var(--ui-bg);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            padding: 15px;
            text-align: center;
        }

        .stat-card-value {
            font-size: 24px;
            font-weight: bold;
            color: var(--accent);
            margin-bottom: 5px;
        }

        .stat-card-label {
            font-size: 12px;
            color: var(--text-secondary);
            text-transform: uppercase;
        }

        .file-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid var(--border-color);
            transition: background 0.2s;
        }

        .file-item:hover {
            background: var(--ui-bg);
        }

        .file-info {
            display: flex;
            gap: 15px;
            align-items: center;
            color: var(--text-primary);
        }

        .file-actions {
            display: flex;
            gap: 5px;
        }

        .history-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            border-bottom: 1px solid var(--border-color);
            transition: background 0.2s;
        }

        .history-item:hover {
            background: var(--ui-bg);
        }

        .history-item.success {
            border-left: 4px solid #48c774;
        }

        .history-item.error {
            border-left: 4px solid #f14668;
        }

        .diff-line-add {
            background: rgba(72, 199, 116, 0.2);
            color: #48c774;
        }

        .diff-line-remove {
            background: rgba(241, 70, 104, 0.2);
            color: #f14668;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// SAFE FETCH HELPER WITH TIMEOUT
// ============================================
async function safeFetch(url, options = {}, timeoutMs = 30000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Check HTTP status
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Parse JSON with error handling
        try {
            const data = await response.json();
            return data;
        } catch (jsonError) {
            throw new Error(`Invalid JSON response: ${jsonError.message}`);
        }
    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            throw new Error('Request timed out - please check your network connection');
        }

        throw error;
    }
}

// ============================================
// API KEY MANAGEMENT
// ============================================
window.toggleApiKeyVisibility = function() {
    const input = document.getElementById('neocities-api-key');
    input.type = input.type === 'password' ? 'text' : 'password';
};

window.saveApiKey = function() {
    const input = document.getElementById('neocities-api-key');
    const apiKey = input.value.trim();

    if (!apiKey) {
        alert('Please enter an API key');
        return;
    }

    neocitiesConfig.apiKey = apiKey;
    saveNeocitiesConfig();

    if (window.updateStatus) window.updateStatus('API key saved!');
    if (window.playSound) window.playSound('success');
    if (window.showStamp) window.showStamp('🔑');
};

window.testConnection = async function() {
    const statusDiv = document.getElementById('connection-status');
    statusDiv.style.display = 'block';
    statusDiv.style.background = 'rgba(255, 221, 87, 0.2)';
    statusDiv.style.color = '#ffdd57';
    statusDiv.innerHTML = '⏳ Testing connection...';

    const inputKey = getApiKeyInputValue();
    const apiKeyToTest = inputKey || neocitiesConfig.apiKey;

    if (!apiKeyToTest) {
        statusDiv.style.background = 'rgba(241, 70, 104, 0.2)';
        statusDiv.style.color = '#f14668';
        statusDiv.innerHTML = '❌ Please enter your API key first.';
        return;
    }

    const testingUnsavedKey = Boolean(inputKey && inputKey !== neocitiesConfig.apiKey);

    try {
        const data = await safeFetch(`${NEOCITIES_API}/info`, {
            headers: {
                'Authorization': `Bearer ${apiKeyToTest}`
            }
        });

        if (data.result === 'success') {
            statusDiv.style.background = 'rgba(72, 199, 116, 0.2)';
            statusDiv.style.color = '#48c774';
            const reminder = testingUnsavedKey ? '<br><small>Tip: Click 💾 Save to use this key for deploys.</small>' : '';

            const safeSitename = escapeHtml(data.info?.sitename || 'Unknown site');
            const safeHits = escapeHtml(formatNumberSafe(data.info?.hits, '0'));
            const safeLastUpdated = escapeHtml(formatDateSafe(data.info?.last_updated));

            statusDiv.innerHTML = `✅ Connected to <strong>${safeSitename}</strong> | Hits: ${safeHits} | Last updated: ${safeLastUpdated}${reminder}`;
            statusDiv.innerHTML = `✅ Connected to <strong>${data.info.sitename}</strong> | Hits: ${data.info.hits.toLocaleString()} | Last updated: ${new Date(data.info.last_updated).toLocaleString()}${reminder}`;

            // Load site stats
            displaySiteStats(data.info);

            if (testingUnsavedKey) {
                // Update runtime config so the rest of the session can use the tested key
                neocitiesConfig.apiKey = apiKeyToTest;
            }

            if (window.playSound) window.playSound('success');
            if (window.showStamp) window.showStamp('✅');
        } else {
            throw new Error(data.error_type || 'Connection failed');
        }
    } catch (error) {
        statusDiv.style.background = 'rgba(241, 70, 104, 0.2)';
        statusDiv.style.color = '#f14668';
        statusDiv.innerHTML = `❌ Error: ${escapeHtml(error.message)}`;

        if (window.playSound) window.playSound('error');
    }
};

function displaySiteStats(info) {
    const statsSection = document.getElementById('site-stats-section');
    const statsDiv = document.getElementById('site-stats');

    const safeHits = escapeHtml(formatNumberSafe(info?.hits, '0'));
    const safeSitename = escapeHtml(info?.sitename || 'Unknown site');
    const safeCreated = escapeHtml(formatDateSafe(info?.created_at, 'date', 'Unknown date'));
    const safeLastUpdated = escapeHtml(formatDateSafe(info?.last_updated, 'time', 'Unknown time'));

    statsDiv.innerHTML = `
        <div class="stat-card">
            <div class="stat-card-value">${safeHits}</div>
            <div class="stat-card-label">Total Hits</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-value">${safeSitename}</div>
            <div class="stat-card-label">Site Name</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-value">${safeCreated}</div>
            <div class="stat-card-label">Created</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-value">${safeLastUpdated}</div>
            <div class="stat-card-label">Last Updated</div>
        </div>
    `;

    statsSection.style.display = 'block';
}

// ============================================
// FILE MANAGEMENT
// ============================================
window.refreshNeocitiesFiles = async function() {
    const browser = document.getElementById('neocities-file-browser');
    browser.innerHTML = '<p style="color: var(--text-secondary);">⏳ Loading files...</p>';

    const apiKey = getActiveApiKey();
    if (!apiKey) {
        browser.innerHTML = '<p style="color: #f14668;">❌ Please enter your API key first.</p>';
        return;
    }

    try {
        const data = await safeFetch(`${NEOCITIES_API}/list`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if (data.result === 'success') {
            neocitiesConfig.siteFiles = data.files;
            renderFileList(data.files);
            if (window.playSound) window.playSound('pop');
        } else {
            throw new Error(data.error_type || 'Failed to load files');
        }
    } catch (error) {
        browser.innerHTML = `<p style="color: #f14668;">❌ Error: ${escapeHtml(error.message)}</p>`;
    }
};

function renderFileList(files) {
    const browser = document.getElementById('neocities-file-browser');

    if (files.length === 0) {
        browser.innerHTML = '<p style="color: var(--text-secondary);">No files found</p>';
        return;
    }

    browser.innerHTML = files.map(file => {
        const icon = file.is_directory ? '📁' : getFileIcon(file.path);
        const size = file.is_directory ? '' : formatFileSize(file.size);
        const date = escapeHtml(formatDateSafe(file.updated_at));
        const escapedPath = escapeHtml(file.path);

        return `
            <div class="file-item">
                <div class="file-info">
                    <span>${icon}</span>
                    <span style="font-weight: ${file.is_directory ? 'bold' : 'normal'};">${escapedPath}</span>
                    ${size ? `<span style="color: var(--text-secondary); font-size: 12px;">${size}</span>` : ''}
                    <span style="color: var(--text-secondary); font-size: 12px;">${date}</span>
                </div>
                <div class="file-actions">
                    ${!file.is_directory && file.path !== 'index.html' ? `
                        <button class="big-button delete-file-btn" data-filename="${escapedPath}" style="background: #f14668; color: white; font-size: 12px; padding: 4px 8px;">
                            🗑️ Delete
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    // Attach event listeners to delete buttons (safe - no XSS)
    browser.querySelectorAll('.delete-file-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filename = e.currentTarget.dataset.filename;
            window.deleteNeocitiesFile(filename);
        });
    });
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const icons = {
        html: '📄', css: '🎨', js: '⚡', json: '📋',
        png: '🖼️', jpg: '🖼️', jpeg: '🖼️', gif: '🖼️', svg: '🖼️',
        mp3: '🎵', mp4: '🎥', wav: '🎵',
        txt: '📝', md: '📝'
    };
    return icons[ext] || '📄';
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

window.deleteNeocitiesFile = async function(filename) {
    if (!confirm(`Delete ${filename} from Neocities?\n\nThis cannot be undone!`)) {
        return;
    }

    const apiKey = getActiveApiKey();
    if (!apiKey) {
        alert('Please enter your API key first');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('filenames[]', filename);

        const data = await safeFetch(`${NEOCITIES_API}/delete`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            body: formData
        });

        if (data.result === 'success') {
            if (window.updateStatus) window.updateStatus(`Deleted ${filename}`);
            if (window.playSound) window.playSound('success');
            if (window.showStamp) window.showStamp('🗑️');
            refreshNeocitiesFiles();
        } else {
            throw new Error(data.message || 'Delete failed');
        }
    } catch (error) {
        alert(`Error deleting file: ${error.message}`);
    }
};

// ============================================
// DEPLOYMENT
// ============================================
window.deployCurrentPage = async function() {
    const filenameInput = document.getElementById('deploy-filename');
    const filename = filenameInput?.value.trim() || 'index.html';

    if (!filename) {
        alert('Please enter a filename');
        return;
    }

    const apiKey = getActiveApiKey();
    if (!apiKey) {
        alert('Please configure your API key first');
        return;
    }

    // Rate limiting check
    const timeSinceLastDeploy = Date.now() - neocitiesConfig.lastDeployTime;
    if (timeSinceLastDeploy < RATE_LIMIT_MS) {
        const waitSeconds = Math.ceil((RATE_LIMIT_MS - timeSinceLastDeploy) / 1000);
        alert(`Please wait ${waitSeconds} seconds before deploying again (Neocities rate limit)`);
        return;
    }

    try {
        if (window.updateStatus) window.updateStatus(`Deploying ${filename}...`);

        // Get current HTML from canvas
        const doc = window.getCanvasDoc && window.getCanvasDoc();
        if (!doc) {
            throw new Error('No canvas document available');
        }

        const html = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;

        // Create form data
        const formData = new FormData();
        const blob = new Blob([html], { type: 'text/html' });
        formData.append(filename, blob, filename);

        // Deploy! (Use longer timeout for uploads - 60 seconds)
        const data = await safeFetch(`${NEOCITIES_API}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            body: formData
        }, 60000);

        if (data.result === 'success') {
            // Success!
            neocitiesConfig.lastDeployTime = Date.now();

            // Add to history
            addToDeploymentHistory({
                filename,
                timestamp: new Date().toISOString(),
                status: 'success',
                size: html.length
            });

            if (window.updateStatus) window.updateStatus(`✅ Deployed ${filename} to Neocities!`);
            if (window.playSound) window.playSound('success');
            if (window.showStamp) window.showStamp('🚀');

            // Show success message
            alert(`🚀 Successfully deployed ${filename}!\n\n🌐 Live at: https://yoursite.neocities.org/${filename}\n📊 File size: ${formatFileSize(html.length)}`);

            renderDeploymentHistory();
        } else {
            throw new Error(data.message || 'Deployment failed');
        }
    } catch (error) {
        addToDeploymentHistory({
            filename,
            timestamp: new Date().toISOString(),
            status: 'error',
            error: error.message
        });

        if (window.updateStatus) window.updateStatus(`❌ Deployment failed: ${error.message}`);
        alert(`Error deploying: ${error.message}`);

        renderDeploymentHistory();
    }
};

// ============================================
// AUTO-DEPLOY
// ============================================
let autoDeployTimeout = null;

let lastCanvasHTML = '';

window.toggleAutoDeploy = function(enabled) {
    neocitiesConfig.autoDeployEnabled = enabled;
    saveNeocitiesConfig();

    if (enabled) {
        // Initialize baseline
        const doc = window.getCanvasDoc && window.getCanvasDoc();
        if (doc) {
            lastCanvasHTML = doc.body.innerHTML;
        }
        if (window.updateStatus) window.updateStatus('⚡ Auto-deploy enabled - watching for changes...');
        if (window.playSound) window.playSound('pop');
        console.log('🤖 Auto-deploy enabled');
    } else {
        if (window.updateStatus) window.updateStatus('Auto-deploy disabled');
        clearTimeout(autoDeployTimeout);
    }
};

function setupAutoDeployListener() {
    // Poll for changes every 2 seconds
    setInterval(() => {
        if (!neocitiesConfig.autoDeployEnabled) return;

        const doc = window.getCanvasDoc && window.getCanvasDoc();
        if (!doc) return;

        const currentHTML = doc.body.innerHTML;

        // Check if content actually changed
        if (currentHTML !== lastCanvasHTML) {
            console.log('🔍 Change detected! Auto-deploy will trigger in 3 seconds...');
            lastCanvasHTML = currentHTML;

            // Debounce auto-deploy (wait 3 seconds after last change)
            clearTimeout(autoDeployTimeout);
            autoDeployTimeout = setTimeout(() => {
                const filename = document.getElementById('deploy-filename')?.value || 'index.html';
                console.log('🤖 Auto-deploying:', filename);
                deployCurrentPage();
            }, 3000);
        }
    }, 2000); // Check every 2 seconds
}

// ============================================
// DEPLOYMENT HISTORY
// ============================================
function addToDeploymentHistory(entry) {
    neocitiesConfig.deploymentHistory.unshift(entry);
    neocitiesConfig.deploymentHistory = neocitiesConfig.deploymentHistory.slice(0, 20);
    saveNeocitiesConfig();
}

function renderDeploymentHistory() {
    const historyDiv = document.getElementById('deployment-history');

    if (neocitiesConfig.deploymentHistory.length === 0) {
        historyDiv.innerHTML = '<p style="color: var(--text-secondary); padding: 15px;">No deployments yet</p>';
        return;
    }

    historyDiv.innerHTML = neocitiesConfig.deploymentHistory.map(entry => {
        const date = new Date(entry.timestamp);
        const timeAgo = getTimeAgo(date);
        const readableDate = escapeHtml(formatDateSafe(entry.timestamp));
        const filenameValue = entry.filename || 'index.html';
        const safeFilename = escapeHtml(filenameValue);
        const safeError = entry.error ? escapeHtml(entry.error) : '';
        const safeTimestamp = escapeHtml(entry.timestamp || '');

        return `
            <div class="history-item ${entry.status}">
                <div>
                    <div style="font-weight: bold; color: var(--text-primary);">
                        ${entry.status === 'success' ? '✅' : '❌'} ${safeFilename}
                    </div>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">
                        ${readableDate} (${timeAgo})
                        ${entry.size ? ` • ${formatFileSize(entry.size)}` : ''}
                        ${entry.error ? ` • Error: ${safeError}` : ''}
                    </div>
                </div>
                ${entry.status === 'success' ? `
                    <button class="big-button rollback-btn" data-filename="${safeFilename}" data-timestamp="${safeTimestamp}" style="font-size: 12px; padding: 4px 8px;">
                        ⏪ Rollback
                    </button>
                ` : ''}
            </div>
        `;
    }).join('');

    historyDiv.querySelectorAll('.rollback-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const { filename, timestamp } = e.currentTarget.dataset;
            window.rollbackDeployment(filename, timestamp);
        });
    });
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' min ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hr ago';
    return Math.floor(seconds / 86400) + ' days ago';
}

window.rollbackDeployment = function(filename, timestamp) {
    alert(`Rollback feature coming soon!\n\nWill restore ${filename} to version from ${new Date(timestamp).toLocaleString()}`);
    // TODO: Implement rollback with stored versions
};

// ============================================
// DIFF VIEWER
// ============================================
window.compareLocalRemote = async function() {
    alert('Diff viewer coming soon!\n\nWill show differences between your local edits and live Neocities files.');
    // TODO: Implement diff comparison
};

// Initialize when modal opens
document.addEventListener('click', (e) => {
    // Handle close button
    if (e.target.closest('[data-close-modal="neocities-deploy-modal"]')) {
        if (window.closeModal) {
            window.closeModal('neocities-deploy-modal');
        } else {
            document.getElementById('neocities-deploy-modal')?.classList.remove('active');
        }
    }
    // Render history when opening
    else if (e.target.id === 'neocities-deploy-btn') {
        setTimeout(() => {
            renderDeploymentHistory();
        }, 100);
    }
});
