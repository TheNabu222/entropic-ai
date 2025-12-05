
import os
import json
import sys
import hashlib
import datetime

# Base URL
BASE_URL = 'https://TheNabu222.github.io/entropic-ai/'

def get_file_stats(filepath):
    """Get size and modification time."""
    try:
        stats = os.stat(filepath)
        size_str = f"{stats.st_size / 1024:.1f}KB"
        mod_time = datetime.datetime.fromtimestamp(stats.st_mtime).strftime('%Y-%m-%d %H:%M')
        return size_str, mod_time
    except Exception:
        return "Unknown", "Unknown"

def get_file_content_and_hash(filepath):
    """Read file content and calculate MD5 hash."""
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        file_hash = hashlib.md5(content.encode('utf-8')).hexdigest()
        return content, file_hash
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return "", ""

def get_file_tree(start_path):
    tree = {}

    # Hash map to track duplicates: hash -> list of paths
    hash_map = {}

    print("Scanning files...")
    for root, dirs, files in os.walk(start_path):
        # Skip .git and unpublished (to avoid recursion)
        if '.git' in root or 'unpublished' in root:
            continue

        # Sort for consistent output
        dirs.sort()
        files.sort()

        # Get relative path from start_path
        rel_path = os.path.relpath(root, start_path)
        if rel_path == '.':
            rel_path_parts = []
        else:
            rel_path_parts = rel_path.split(os.sep)

        # Navigate/Create dictionary structure
        current_level = tree
        for part in rel_path_parts:
            if part not in current_level:
                current_level[part] = {'__type__': 'folder', '__children__': {}}
            current_level = current_level[part]['__children__']

        # Add files
        for f in files:
            if f.endswith('.html'):
                full_path = os.path.join(root, f)
                web_path = full_path
                # Normalize path separators for web
                if os.sep == '\\':
                    web_path = web_path.replace('\\', '/')
                if web_path.startswith('./'):
                    web_path = web_path[2:]

                content, f_hash = get_file_content_and_hash(full_path)
                size, mod_time = get_file_stats(full_path)

                # Track for duplicates
                if f_hash:
                    if f_hash not in hash_map:
                        hash_map[f_hash] = []
                    hash_map[f_hash].append(web_path)

                current_level[f] = {
                    '__type__': 'file',
                    'path': web_path,
                    'content': content,
                    'hash': f_hash,
                    'size': size,
                    'date': mod_time,
                    'duplicates': [] # Will populate later
                }

    # Second pass: Mark duplicates
    print("Marking duplicates...")
    def populate_duplicates(node):
        for key, item in node.items():
            if key == '__type__' or key == '__children__':
                continue

            if item.get('__type__') == 'folder':
                populate_duplicates(item['__children__'])
            elif item.get('__type__') == 'file':
                f_hash = item.get('hash')
                if f_hash and len(hash_map[f_hash]) > 1:
                    # List other files that are identical
                    others = [p for p in hash_map[f_hash] if p != item['path']]
                    item['duplicates'] = others

    populate_duplicates(tree)

    return tree

def generate_html(file_tree):
    # HTML Content with embedded JSON
    # using json.dumps with default ensures proper escaping of content strings

    # We will use a separate script tag for data to avoid parsing issues in template string
    # We must also escape </script> tags to prevent early termination of the script block

    html_template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CoAIexist Master Dashboard [CMD CENTER]</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --neon: #00ff88;
            --neon-dim: rgba(0, 255, 136, 0.2);
            --bg-dark: #050505;
            --panel-bg: rgba(0, 0, 0, 0.95);
            --border: 1px solid var(--neon);
            --text-main: #00ff88;
            --text-file: #00ffff;
            --text-folder: #ff00ff;
            --text-warn: #ffff00;
        }

        body {
            font-family: 'VT323', monospace;
            background: #000;
            color: var(--text-main);
            height: 100vh;
            overflow: hidden;
            display: flex;
        }

        /* LAYOUT */
        .sidebar {
            width: 350px;
            min-width: 250px;
            max-width: 600px;
            border-right: var(--border);
            display: flex;
            flex-direction: column;
            background: var(--panel-bg);
            z-index: 10;
        }

        .resizer {
            width: 5px;
            cursor: col-resize;
            background: #111;
            border-left: 1px solid #333;
        }

        .main-stage {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: #111;
            position: relative;
        }

        /* SIDEBAR COMPONENTS */
        .sidebar-header {
            padding: 10px;
            border-bottom: var(--border);
            background: rgba(0, 255, 136, 0.05);
            text-align: center;
        }

        .sidebar-header h1 { font-size: 1.8em; letter-spacing: 2px; text-shadow: 0 0 5px var(--neon); }

        .search-box {
            padding: 8px;
            border-bottom: 1px dashed var(--neon);
            display: flex;
            gap: 5px;
        }

        .search-input {
            flex: 1;
            background: #000;
            border: 1px solid #333;
            color: white;
            padding: 4px;
            font-family: inherit;
            font-size: 1em;
        }

        .search-input:focus { border-color: var(--neon); outline: none; }

        .toggle-btn {
            background: #000; color: #666; border: 1px solid #333; cursor: pointer; padding: 2px 6px;
            font-family: inherit;
        }
        .toggle-btn.active { background: var(--neon); color: black; border-color: var(--neon); }

        .tree-container {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
        }

        .workspace-actions {
            border-top: var(--border);
            padding: 10px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 5px;
        }

        .ws-btn {
            background: #000; color: var(--neon); border: 1px solid var(--neon);
            cursor: pointer; padding: 5px; font-family: inherit; transition: 0.2s;
        }
        .ws-btn:hover { background: var(--neon); color: black; }

        /* TREE STYLES */
        ul { list-style: none; padding-left: 15px; }
        .tree-item { margin: 2px 0; white-space: nowrap; }

        .folder { color: var(--text-folder); cursor: pointer; font-weight: bold; }
        .folder::before { content: '📁 '; }
        .folder.expanded::before { content: '📂 '; }

        .file { color: var(--text-file); cursor: pointer; opacity: 0.8; }
        .file:hover { opacity: 1; text-decoration: underline; }
        .file::before { content: '📄 '; opacity: 0.5; }

        .nested { display: none; margin-left: 8px; border-left: 1px dotted #333; }
        .nested.active { display: block; }

        .meta-tag { font-size: 0.8em; color: #666; margin-left: 5px; }
        .dup-tag { color: #ff0055; font-weight: bold; margin-left: 5px; cursor: help; }

        .search-highlight { background: #333; border: 1px solid #ffff00; }

        /* MAIN STAGE */
        .stage-toolbar {
            height: 40px;
            border-bottom: var(--border);
            display: flex;
            align-items: center;
            padding: 0 10px;
            justify-content: space-between;
            background: #000;
        }

        .mode-switch { display: flex; gap: 10px; }
        .mode-btn {
            background: transparent; color: #666; border: none; font-family: inherit; font-size: 1.2em; cursor: pointer;
        }
        .mode-btn.active { color: var(--neon); text-shadow: 0 0 5px var(--neon); }

        .stage-content {
            flex: 1;
            position: relative;
            overflow: hidden;
            display: flex;
        }

        /* MULTI MODE STYLES */
        .multi-container {
            width: 100%;
            height: 100%;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 10px;
        }

        .multi-container.grid-view {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
            grid-auto-rows: 400px;
        }

        .multi-container.grid-view .preview-panel {
            min-height: 0;
            height: 100%;
        }

        /* PREVIEW PANELS */
        .preview-panel {
            background: #fff; border: 1px solid #00ff88;
            display: flex; flex-direction: column; min-height: 600px;
            animation: slideIn 0.3s ease;
            position: relative;
        }

        .panel {
            flex: 1;
            display: flex;
            flex-direction: column;
            border-right: 1px solid #333;
            background: #fff;
            position: relative;
        }

        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .panel-header {
            background: #111; color: var(--neon); padding: 5px 10px; font-size: 0.9em;
            display: flex; justify-content: space-between; border-bottom: 1px solid #333;
            height: 30px; align-items: center;
        }

        iframe { width: 100%; height: 100%; border: none; }

        /* COMPARE MODE */
        .compare-container {
            display: flex;
            width: 100%;
            height: 100%;
        }

        .diff-viewer {
            width: 100%;
            height: 100%;
            background: #1e1e1e;
            color: #d4d4d4;
            overflow: auto;
            font-family: monospace;
            font-size: 14px;
            padding: 10px;
        }

        .diff-line { display: flex; }
        .ln { width: 40px; color: #858585; text-align: right; padding-right: 10px; user-select: none; }
        .lc { white-space: pre-wrap; flex: 1; }

        .diff-added { background: rgba(0, 255, 0, 0.1); }
        .diff-removed { background: rgba(255, 0, 0, 0.1); }
        .diff-changed { background: rgba(255, 255, 0, 0.1); }

        .empty-slot {
            display: flex; align-items: center; justify-content: center;
            height: 100%; background: #000; color: #333; font-size: 1.5em;
            flex-direction: column; text-align: center;
        }

        .drop-target {
            border: 2px dashed var(--neon);
            background: var(--neon-dim);
            color: var(--neon);
        }

    </style>
</head>
<body>

<div class="sidebar">
    <div class="sidebar-header">
        <h1>ARCHIVE CMD</h1>
        <div style="font-size: 0.8em; color: #666;">v3.0 // MULTI-VIEW</div>
    </div>

    <div class="search-box">
        <input type="text" id="searchInput" class="search-input" placeholder="Search..." onkeyup="handleSearch(event)">
        <button id="searchModeBtn" class="toggle-btn" onclick="toggleSearchMode()">NAME</button>
    </div>

    <div class="tree-container" id="treeRoot"></div>

    <div class="workspace-actions">
        <button class="ws-btn" onclick="saveSession()">SAVE</button>
        <button class="ws-btn" onclick="restoreSession()">LOAD</button>
        <button class="ws-btn" onclick="setMode('multi')">MULTI</button>
        <button class="ws-btn" onclick="setMode('compare')">COMPARE</button>
    </div>
</div>

<div class="resizer" id="dragMe"></div>

<div class="main-stage">
    <div class="stage-toolbar">
        <div class="mode-switch">
            <button class="mode-btn" id="btn-multi" onclick="setMode('multi')">MULTI</button>
            <button class="mode-btn" id="btn-compare" onclick="setMode('compare')">COMPARE</button>
        </div>

        <!-- Controls for Multi Mode -->
        <div id="multi-toggles" style="display:none; gap: 10px;">
            <button class="toggle-btn" id="btn-grid" onclick="toggleGrid()">GRID</button>
            <button class="toggle-btn" onclick="clearMulti()">CLEAR ALL</button>
        </div>

        <!-- Controls for Compare Mode -->
        <div id="compare-toggles" style="display:none; gap: 10px;">
            <button class="toggle-btn active" id="btn-vis" onclick="setCompareType('visual')">VISUAL</button>
            <button class="toggle-btn" id="btn-code" onclick="setCompareType('code')">CODE</button>
        </div>

        <div id="status-bar" style="font-size: 0.9em; color: #888;">Ready</div>
    </div>

    <div class="stage-content" id="stage">
        <!-- Content Injected via JS -->
    </div>
</div>

<!-- DATA INJECTION -->
<script id="tree-data" type="application/json">
    __TREE_JSON_PLACEHOLDER__
</script>

<script>
    const BASE_URL = 'https://TheNabu222.github.io/entropic-ai/';
    let fileData = {}; // Flat map for easy access: path -> node
    let rawTree = {};

    // State
    let appState = {
        mode: 'multi', // 'multi' or 'compare'
        compareType: 'visual', // 'visual' or 'code'
        searchContent: false,
        // Compare Mode State
        slotA: null, // path
        slotB: null, // path
        activeSlot: 'A', // Which slot to load into next
        // Multi Mode State
        openFiles: [], // list of paths
        isGrid: false
    };

    // --- INIT ---
    window.onload = function() {
        try {
            rawTree = JSON.parse(document.getElementById('tree-data').textContent);
            const root = document.getElementById('treeRoot');
            renderTree(rawTree, root);
            flattenData(rawTree);
            restoreSession();
            renderStage();
        } catch(e) {
            console.error("Init error", e);
            document.getElementById('status-bar').textContent = "Error loading data. See console.";
        }

        // Resizer
        const resizer = document.getElementById('dragMe');
        const sidebar = document.querySelector('.sidebar');

        resizer.addEventListener('mousedown', (e) => {
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
        });

        function resize(e) {
            sidebar.style.width = e.pageX + 'px';
        }

        function stopResize() {
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
        }
    };

    // --- DATA HANDLING ---
    function flattenData(node) {
        Object.keys(node).forEach(key => {
            if (key.startsWith('__')) return;
            const item = node[key];
            if (item.__type__ === 'file') {
                fileData[item.path] = item;
            } else {
                flattenData(item.__children__);
            }
        });
    }

    // --- RENDER TREE ---
    function renderTree(node, container, pathStr = '') {
        const ul = document.createElement('ul');
        if (!pathStr) ul.className = 'nested active';
        else ul.className = 'nested';

        const keys = Object.keys(node).sort((a, b) => {
            const tA = node[a].__type__;
            const tB = node[b].__type__;
            if (tA !== tB) return tA === 'folder' ? -1 : 1;
            return a.localeCompare(b);
        });

        keys.forEach(key => {
            if (key.startsWith('__')) return;
            const item = node[key];
            const li = document.createElement('li');
            li.className = 'tree-item';

            if (item.__type__ === 'folder') {
                const label = document.createElement('span');
                label.className = 'folder';
                label.textContent = key;
                label.onclick = () => {
                    label.classList.toggle('expanded');
                    label.nextElementSibling.classList.toggle('active');
                };
                li.appendChild(label);
                renderTree(item.__children__, li, pathStr + '/' + key);
            } else {
                const label = document.createElement('span');
                label.className = 'file';
                label.textContent = key;
                label.dataset.path = item.path;

                // Metadata
                if (item.size) {
                    const meta = document.createElement('span');
                    meta.className = 'meta-tag';
                    meta.textContent = `[${item.size}]`;
                    li.appendChild(meta);
                }

                // Duplicate Warning
                if (item.duplicates && item.duplicates.length > 0) {
                    const dup = document.createElement('span');
                    dup.className = 'dup-tag';
                    dup.textContent = '[DUP]';
                    dup.title = 'Identical to: ' + item.duplicates.join(', ');
                    li.appendChild(dup);
                }

                label.onclick = () => loadFile(item.path);
                li.prepend(label); // Prepend so meta tags are after
            }
            ul.appendChild(li);
        });
        container.appendChild(ul);
    }

    // --- ACTIONS ---
    function setMode(mode) {
        appState.mode = mode;
        document.getElementById('btn-multi').classList.toggle('active', mode === 'multi');
        document.getElementById('btn-compare').classList.toggle('active', mode === 'compare');

        document.getElementById('multi-toggles').style.display = mode === 'multi' ? 'flex' : 'none';
        document.getElementById('compare-toggles').style.display = mode === 'compare' ? 'flex' : 'none';

        renderStage();
    }

    function setCompareType(type) {
        appState.compareType = type;
        document.getElementById('btn-vis').classList.toggle('active', type === 'visual');
        document.getElementById('btn-code').classList.toggle('active', type === 'code');
        renderStage();
    }

    function toggleGrid() {
        appState.isGrid = !appState.isGrid;
        document.getElementById('btn-grid').classList.toggle('active', appState.isGrid);
        renderStage();
    }

    function clearMulti() {
        appState.openFiles = [];
        renderStage();
    }

    function loadFile(path) {
        if (appState.mode === 'multi') {
            // Add to list if not present, then move to top
            appState.openFiles = appState.openFiles.filter(p => p !== path);
            appState.openFiles.unshift(path);
            renderStage();
        } else {
            // Compare mode: Fill empty slot or cycle
            if (!appState.slotA) appState.slotA = path;
            else if (!appState.slotB) appState.slotB = path;
            else {
                // Replace whichever was focused last, default to B for ping-ponging
                if (appState.activeSlot === 'A') appState.slotA = path;
                else appState.slotB = path;
            }
            renderStage();
        }
        document.getElementById('status-bar').textContent = `Loaded: ${path}`;
    }

    function closeFile(path) {
        appState.openFiles = appState.openFiles.filter(p => p !== path);
        renderStage();
    }

    // --- STAGE RENDERER ---
    function renderStage() {
        const stage = document.getElementById('stage');
        stage.innerHTML = '';

        if (appState.mode === 'multi') {
            // MULTI VIEW
            if (appState.openFiles.length === 0) {
                 stage.innerHTML = '<div class="empty-state"><div class="empty-slot">Select files to open</div></div>';
                 return;
            }

            const container = document.createElement('div');
            container.className = 'multi-container';
            if (appState.isGrid) container.classList.add('grid-view');

            appState.openFiles.forEach(path => {
                const p = document.createElement('div');
                p.className = 'preview-panel';
                renderPreviewPanel(p, path, true, true); // true=mini(not really), true=hasClose
                container.appendChild(p);
            });

            stage.appendChild(container);

        } else {
            // COMPARE MODE
            const container = document.createElement('div');
            container.className = 'compare-container';

            // Left Panel (A)
            const left = document.createElement('div');
            left.className = 'panel';
            left.style.borderRight = '2px solid #00ff88'; // Divider
            left.onclick = () => { appState.activeSlot = 'A'; document.getElementById('status-bar').textContent = 'Active Slot: LEFT'; };

            // Right Panel (B)
            const right = document.createElement('div');
            right.className = 'panel';
            right.onclick = () => { appState.activeSlot = 'B'; document.getElementById('status-bar').textContent = 'Active Slot: RIGHT'; };

            container.appendChild(left);
            container.appendChild(right);
            stage.appendChild(container);

            if (appState.compareType === 'visual') {
                if (appState.slotA) renderPreviewPanel(left, appState.slotA, true, false);
                else renderEmptySlot(left, 'A');

                if (appState.slotB) renderPreviewPanel(right, appState.slotB, true, false);
                else renderEmptySlot(right, 'B');
            } else {
                // CODE DIFF
                if (appState.slotA && appState.slotB) {
                    renderCodeDiff(container, appState.slotA, appState.slotB);
                } else {
                    left.innerHTML = '<div class="empty-slot">Select two files to compare code</div>';
                    right.style.display = 'none';
                    left.style.width = '100%';
                }
            }
        }
    }

    function renderPreviewPanel(container, path, isMini, hasClose) {
        const url = BASE_URL + path;

        let headerHTML = `<div class="panel-header">
            <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${path}</span>
            <div>
                <button onclick="window.open('${url}', '_blank')">🔗</button>
                ${hasClose ? `<button onclick="closeFile('${path}')">✕</button>` : ''}
            </div>
        </div>`;

        let contentHTML = `<iframe src="${url}"></iframe>`;

        container.innerHTML = headerHTML + contentHTML;
    }

    function renderEmptySlot(container, slotName) {
        container.innerHTML = `<div class="empty-slot ${appState.activeSlot === slotName ? 'drop-target' : ''}">
            <div>SLOT ${slotName}</div>
            <div style="font-size:0.5em; margin-top:10px;">Click file to load</div>
        </div>`;
    }

    // --- DIFF ENGINE ---
    function renderCodeDiff(container, pathA, pathB) {
        container.innerHTML = ''; // Clear split

        const contentA = fileData[pathA].content || '';
        const contentB = fileData[pathB].content || '';

        const linesA = contentA.split('\\n');
        const linesB = contentB.split('\\n');

        const diffView = document.createElement('div');
        diffView.className = 'diff-viewer';

        let html = `<h3>Comparing: ${pathA} vs ${pathB}</h3><br>`;

        const maxLen = Math.max(linesA.length, linesB.length);

        for (let i = 0; i < maxLen; i++) {
            const lineA = linesA[i] || '';
            const lineB = linesB[i] || '';

            if (lineA === lineB) {
                html += `<div class="diff-line"><div class="ln">${i+1}</div><div class="lc">${escapeHtml(lineA)}</div></div>`;
            } else {
                if (lineA && !lineB) {
                    html += `<div class="diff-line diff-removed"><div class="ln">${i+1}</div><div class="lc">- ${escapeHtml(lineA)}</div></div>`;
                } else if (!lineA && lineB) {
                    html += `<div class="diff-line diff-added"><div class="ln">${i+1}</div><div class="lc">+ ${escapeHtml(lineB)}</div></div>`;
                } else {
                    html += `<div class="diff-line diff-changed"><div class="ln">${i+1}</div><div class="lc">! ${escapeHtml(lineA)} <br> <span style="color:var(--neon)">> ${escapeHtml(lineB)}</span></div></div>`;
                }
            }
        }

        diffView.innerHTML = html;
        container.appendChild(diffView);
    }

    function escapeHtml(text) {
        return text.replace(/&/g, "&amp;")
                   .replace(/</g, "&lt;")
                   .replace(/>/g, "&gt;")
                   .replace(/"/g, "&quot;")
                   .replace(/'/g, "&#039;");
    }

    // --- SEARCH ---
    function toggleSearchMode() {
        appState.searchContent = !appState.searchContent;
        const btn = document.getElementById('searchModeBtn');
        btn.textContent = appState.searchContent ? 'CONTENT' : 'NAME';
        btn.classList.toggle('active');

        const input = document.getElementById('searchInput');
        if (input.value) handleSearch({target: input});
    }

    function handleSearch(e) {
        const query = e.target.value.toLowerCase();
        const items = document.querySelectorAll('.tree-item');

        if (!query) {
            items.forEach(el => el.classList.remove('search-highlight'));
            return;
        }

        document.querySelectorAll('.file, .folder').forEach(el => el.style.opacity = '0.3');

        let foundCount = 0;

        Object.keys(fileData).forEach(path => {
            const item = fileData[path];
            let match = false;

            if (appState.searchContent) {
                if (item.content && item.content.toLowerCase().includes(query)) match = true;
            } else {
                if (path.toLowerCase().includes(query)) match = true;
            }

            if (match) {
                foundCount++;
                const el = document.querySelector(`.file[data-path="${path}"]`);
                if (el) {
                    el.style.opacity = '1';
                    el.style.color = '#fff';
                    let parent = el.closest('ul.nested');
                    while(parent) {
                        parent.classList.add('active');
                        if (parent.previousElementSibling) parent.previousElementSibling.classList.add('expanded');
                        parent = parent.parentElement.closest('ul.nested');
                    }
                }
            }
        });

        document.getElementById('status-bar').textContent = `Found ${foundCount} matches`;
    }

    // --- SESSION ---
    function saveSession() {
        const data = {
            slotA: appState.slotA,
            slotB: appState.slotB,
            mode: appState.mode,
            openFiles: appState.openFiles,
            isGrid: appState.isGrid
        };
        localStorage.setItem('coai_audit_v3', JSON.stringify(data));
        alert('Saved!');
    }

    function restoreSession() {
        const saved = localStorage.getItem('coai_audit_v3');
        if (saved) {
            const data = JSON.parse(saved);
            appState.mode = data.mode || 'multi';
            appState.slotA = data.slotA;
            appState.slotB = data.slotB;
            appState.openFiles = data.openFiles || [];
            appState.isGrid = data.isGrid || false;

            setMode(appState.mode);
            if(appState.isGrid) document.getElementById('btn-grid').classList.add('active');
        }
    }

</script>
</body>
</html>
"""

    # Embed the JSON data safely
    # We replace the placeholder
    json_str = json.dumps(file_tree)
    # Escape </script> to prevent breaking the HTML parser
    json_str = json_str.replace('</script>', '<\\/script>')

    final_html = html_template.replace('__TREE_JSON_PLACEHOLDER__', json_str)

    return final_html

if __name__ == '__main__':
    # Increase recursion limit
    sys.setrecursionlimit(2000)

    print('Starting Audit Previewer Generation...')
    print(f'Base Path: {os.getcwd()}')

    file_tree = get_file_tree('.')

    print('Generating HTML (this may take a moment due to file embedding)...')
    html_content = generate_html(file_tree)

    output_path = 'unpublished/audit_previewer_jules.html'

    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

    print(f'Done! Created {output_path}')
