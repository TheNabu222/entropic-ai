        // --- GLOBAL STATE ---
        window.selectedEl = null;
        const iframe = document.getElementById('canvas-frame');
        let iframeDoc = null;
        window.activeImageElement = null;
        let matrixRainInterval = null;
        window.soundEnabled = true;
        window.clipboardEl = null;
        window.draggedLayer = null;

        // Helper: RGB to Hex
        function rgbToHex(color) {
            if(!color) return '#000000';
            if(color.startsWith('#')) return color;
            const rgb = color.match(/\d+/g);
            if(!rgb) return '#000000';
            return "#" + ((1 << 24) + (parseInt(rgb[0]) << 16) + (parseInt(rgb[1]) << 8) + parseInt(rgb[2])).toString(16).slice(1);
        }
        
        // --- THEME SYSTEM ---
        window.toggleTheme = () => {
            document.body.classList.toggle('light-mode');
            const btn = document.getElementById('theme-toggle-btn');
            if(document.body.classList.contains('light-mode')) {
                btn.innerText = "🌙 Mode";
            } else {
                btn.innerText = "☀️ Mode";
            }
            window.playSound('pop');
        };

        // --- MULTI-PAGE SYSTEM ---
        window.pages = [{ id: 'p_' + Date.now(), name: 'index.html', content: '', history: [], historyIndex: -1 }];
        window.activePageIndex = 0;

        function getCurrentPage() {
            return window.pages[window.activePageIndex];
        }

        window.createNewPage = () => {
            const newId = 'p_' + Date.now();
            const newPage = { 
                id: newId, 
                name: `page-${window.pages.length}.html`, 
                content: '', 
                history: [], 
                historyIndex: -1 
            };
            window.pages.push(newPage);
            window.switchPage(window.pages.length - 1);
        };

        window.switchPage = (index) => {
            // Save current page state before switching
            if (iframeDoc && iframeDoc.documentElement) {
                window.pages[window.activePageIndex].content = iframeDoc.documentElement.outerHTML;
            }

            window.activePageIndex = index;
            const page = window.pages[index];
            
            // Re-init canvas with page content
            // If content is empty, initCanvas will use default
            window.initCanvas(page.content || null);
            
            renderPageTabs();
            window.playSound('pop');
        };

        window.duplicatePage = (index) => {
            const original = window.pages[index];
            // Save current state if duplicating active page
            let currentContent = original.content;
            if (index === window.activePageIndex && iframeDoc) {
                currentContent = iframeDoc.documentElement.outerHTML;
            }

            const newPage = {
                id: 'p_' + Date.now(),
                name: original.name.replace('.html', '-copy.html'),
                content: currentContent, // "Duplicate Stylesheets" implied by copying full HTML
                history: [], // Start fresh history for clone
                historyIndex: -1
            };
            window.pages.push(newPage);
            window.switchPage(window.pages.length - 1);
            window.updateStatus(`Duplicated ${original.name}`);
        };
        
        window.deletePage = (index) => {
            if (window.pages.length <= 1) {
                alert("Cannot delete the last page!");
                return;
            }
            if (!confirm(`Delete ${window.pages[index].name}?`)) return;
            
            window.pages.splice(index, 1);
            if (index <= window.activePageIndex) {
                window.activePageIndex = Math.max(0, window.activePageIndex - 1);
            }
            window.switchPage(window.activePageIndex);
        };

        window.renamePage = (index) => {
            const newName = prompt("Enter new page name:", window.pages[index].name);
            if (newName) {
                window.pages[index].name = newName;
                renderPageTabs();
            }
        };

        function renderPageTabs() {
            const bar = document.getElementById('page-tabs-bar');
            const addBtn = bar.querySelector('.page-tab-add');
            bar.innerHTML = '';
            
            window.pages.forEach((page, idx) => {
                const tab = document.createElement('div');
                tab.className = `page-tab ${idx === window.activePageIndex ? 'active' : ''}`;
                tab.innerHTML = `
                    <span onclick="switchPage(${idx})">${page.name}</span>
                    <span style="font-size:10px; opacity:0.5; cursor:pointer;" onclick="deletePage(${idx})">✕</span>
                `;
                tab.ondblclick = () => renamePage(idx);
                tab.oncontextmenu = (e) => {
                    e.preventDefault();
                    if(confirm(`Duplicate ${page.name}?`)) duplicatePage(idx);
                };
                bar.appendChild(tab);
            });
            
            bar.appendChild(addBtn);
        }

        // --- ASSET MANAGER LOGIC ---
        window.switchAssetTab = (tabId) => {
            document.querySelectorAll('.asset-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll(`.asset-tab[onclick*="${tabId}"]`).forEach(t => t.classList.add('active'));
            
            document.getElementById('tab-github').style.display = tabId === 'github' ? 'block' : 'none';
            document.getElementById('tab-neocities').style.display = tabId === 'neocities' ? 'block' : 'none';
            document.getElementById('tab-upload').style.display = tabId === 'upload' ? 'block' : 'none';
            
            // Show select button if in pick mode
            const selectBtn = document.getElementById('asset-pick-select-btn');
            if(selectBtn) selectBtn.style.display = (window.assetPickMode) ? 'inline-block' : 'none';
        };

        window.insertAssetFromUrl = async (type) => {
             const url = document.getElementById('asset-url-input').value;
             // Handle Asset Picking Mode (Manual select)
             if (type === 'pick') {
                 if (window.assetPickMode && window.selectedEl) {
                     if (window.assetPickMode === 'src') window.updateProp('src', url);
                     else if (window.assetPickMode === 'bg') window.updateProp('backgroundImage', url);
                     window.closeModal('asset-modal');
                     return;
                 }
             }

             if(!url) return;
             
             if(type === 'img') window.addElementHTML(`<img src="${url}" class="canvas-el" style="max-width:300px;">`);
             else if(type === 'audio') window.addElementHTML(`<audio controls src="${url}" class="canvas-el"></audio>`);
             else if(type === 'video') window.addElementHTML(`<video controls src="${url}" class="canvas-el" style="max-width:300px;"></video>`);
             else if(type === 'iframe') window.addElementHTML(`<iframe src="${url}" class="canvas-el" style="width:400px; height:300px; border:none;"></iframe>`);
             else if(type === 'html') {
                 await window.fetchAndInjectText(url, 'URL Resource');
                 return; // fetchAndInjectText handles modal close
             }
             
             window.closeModal('asset-modal');
             window.playSound('success');
        };

        window.handleFileUpload = (input) => {
            const file = input.files[0];
            if(!file) return;
            
            const name = file.name.toLowerCase();
            const reader = new FileReader();

            // Handle Asset Picking Mode via File Upload
            if (window.assetPickMode && window.selectedEl) {
                reader.onload = (e) => {
                    const res = e.target.result;
                    if (window.assetPickMode === 'src') window.updateProp('src', res);
                    else if (window.assetPickMode === 'bg') window.updateProp('backgroundImage', res);
                    window.closeModal('asset-modal');
                };
                reader.readAsDataURL(file);
                return;
            }

            if(name.endsWith('.html') || name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.svg')) {
                reader.onload = (e) => {
                    window.addElementHTML(e.target.result);
                    window.closeModal('asset-modal');
                    window.playSound('success');
                };
                reader.readAsText(file);
            } else {
                reader.onload = (e) => {
                    const res = e.target.result;
                    if(file.type.startsWith('image/')) window.addElementHTML(`<img src="${res}" class="canvas-el" style="max-width:300px;">`);
                    else if(file.type.startsWith('audio/')) window.addElementHTML(`<audio controls src="${res}" class="canvas-el"></audio>`);
                    else if(file.type.startsWith('video/')) window.addElementHTML(`<video controls src="${res}" class="canvas-el" style="max-width:300px;"></video>`);
                    else alert('Unknown file type. Upload HTML, Text, Image, Audio, or Video.');
                    
                    window.closeModal('asset-modal');
                    window.playSound('success');
                };
                reader.readAsDataURL(file);
            }
        };

        // --- GITHUB ASSET LOGIC (FIXED) ---
        window.fetchAndInjectText = async (url, name) => {
             window.updateStatus(`Fetching ${name}...`);
             try {
                let text = '';
                // Attempt 1: Direct
                try {
                    const r = await fetch(url);
                    if(r.ok) text = await r.text();
                    else throw new Error('Direct fetch failed');
                } catch(e) {
                    console.warn('Direct load failed, trying proxy...');
                    // Attempt 2: CORS Proxy
                    const r2 = await fetch('https://corsproxy.io/?' + encodeURIComponent(url));
                    if(r2.ok) text = await r2.text();
                    else throw new Error('Proxy failed');
                }
                
                if(text) {
                    window.addElementHTML(text);
                    window.closeModal('asset-modal');
                    window.updateStatus(`Injected ${name}`);
                    window.playSound('success');
                }
            } catch(err) {
                console.error(err);
                alert(`Could not load file. It might be too large or blocked.\nError: ${err.message}`);
            }
        };

        window.handleGithubAssetClick = async (type, url, name) => {
            console.log('Clicked asset:', name, type, url);
            if (!url) { alert('Error: No download URL for this file.'); return; }

            // Handle Asset Picking Mode
            if (window.assetPickMode && window.selectedEl) {
                if (window.assetPickMode === 'src') window.updateProp('src', url);
                else if (window.assetPickMode === 'bg') window.updateProp('backgroundImage', url);
                window.closeModal('asset-modal');
                return;
            }

            const ext = name.split('.').pop().toLowerCase();
            let htmlToInject = '';

            // 1. Images
            if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico', 'bmp', 'tiff'].includes(ext)) {
                htmlToInject = `<img src="${url}" class="canvas-el" style="max-width:300px;">`;
            }
            // 2. Audio
            else if (['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(ext)) {
                htmlToInject = `<audio controls src="${url}" class="canvas-el"></audio>`;
            }
            // 3. Video
            else if (['mp4', 'webm', 'ogv', 'mov', 'avi', 'mkv'].includes(ext)) {
                htmlToInject = `<video controls src="${url}" class="canvas-el" style="max-width:300px;"></video>`;
            }
            // 4. 3D Models (using model-viewer)
            else if (['glb', 'gltf'].includes(ext)) {
                htmlToInject = `<model-viewer src="${url}" auto-rotate camera-controls class="canvas-el" style="width: 300px; height: 300px; background-color: transparent;"></model-viewer>`;
            }
            // 5. PDF (Fixed: Use gitHack CDN to force correct Content-Type for rendering, and iframe for better compatibility)
            else if (['pdf'].includes(ext)) {
                // If it's a raw github url, switch to githack CDN to ensure correct MIME type application/pdf
                let pdfUrl = url;
                if (url.includes('raw.githubusercontent.com')) {
                    pdfUrl = url.replace('raw.githubusercontent.com', 'raw.githack.com');
                }
                // Use iframe instead of object for better PDF viewer compat in sandboxed environments
                htmlToInject = `<iframe src="${pdfUrl}" class="canvas-el pdf-viewer" style="width:100%; height:600px; border:1px solid #ccc;"></iframe>`;
            }
            // 6. CSS (Link or Inject)
            else if (['css'].includes(ext)) {
                 // Use githack for CSS too to ensure correct MIME type if linking
                 let cssUrl = url;
                 if (url.includes('raw.githubusercontent.com')) {
                    cssUrl = url.replace('raw.githubusercontent.com', 'raw.githack.com');
                 }

                 if(confirm(`Inject CSS file "${name}"?\n\nOK = Link tag (recommended)\nCancel = Raw text`)) {
                    const link = iframeDoc.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = cssUrl;
                    iframeDoc.head.appendChild(link);
                    window.closeModal('asset-modal');
                    window.playSound('success');
                    window.updateStatus(`Linked CSS: ${name}`);
                    return;
                 } else {
                     await window.fetchAndInjectText(url, name);
                     return;
                 }
            }
            // 7. JS (Script or Text)
            else if (['js'].includes(ext)) {
                 let jsUrl = url;
                 if (url.includes('raw.githubusercontent.com')) {
                    jsUrl = url.replace('raw.githubusercontent.com', 'raw.githack.com');
                 }

                 if(confirm(`Inject Script file "${name}"?\n\nOK = Script tag (execute)\nCancel = Raw text`)) {
                    const script = iframeDoc.createElement('script');
                    script.src = jsUrl;
                    iframeDoc.body.appendChild(script);
                    window.closeModal('asset-modal');
                    window.playSound('success');
                    window.updateStatus(`Linked JS: ${name}`);
                    return;
                 } else {
                     await window.fetchAndInjectText(url, name);
                     return;
                 }
            }
            // 8. Fonts
            else if (['ttf', 'otf', 'woff', 'woff2'].includes(ext)) {
                 const fontName = name.split('.')[0];
                 // Fonts also need correct MIME
                 let fontUrl = url;
                 if (url.includes('raw.githubusercontent.com')) {
                    fontUrl = url.replace('raw.githubusercontent.com', 'raw.githack.com');
                 }
                 const css = `
                    @font-face {
                        font-family: '${fontName}';
                        src: url('${fontUrl}');
                    }
                 `;
                 const style = iframeDoc.createElement('style');
                 style.textContent = css;
                 iframeDoc.head.appendChild(style);
                 window.closeModal('asset-modal');
                 window.playSound('success');
                 alert(`Font '${fontName}' added! Use it in CSS as font-family: '${fontName}';`);
                 return;
            }
            // 9. Text Content
            else if (['html', 'txt', 'md', 'json', 'xml', 'csv', 'py', 'java', 'c', 'cpp', 'h'].includes(ext)) {
                 await window.fetchAndInjectText(url, name);
                 return;
            }
            // 10. Generic Fallback
            else {
                 if(confirm(`Unknown file type: ${ext}. Try to inject as text?`)) {
                     await window.fetchAndInjectText(url, name);
                     return;
                 }
                 const action = prompt(`Manual Override for .${ext}\n\nType 'img', 'video', 'audio', 'link', '3d' to force handling.`, 'link');
                 if(action === 'img') htmlToInject = `<img src="${url}" class="canvas-el" style="max-width:300px;">`;
                 else if(action === 'video') htmlToInject = `<video controls src="${url}" class="canvas-el" style="max-width:300px;"></video>`;
                 else if(action === 'audio') htmlToInject = `<audio controls src="${url}" class="canvas-el"></audio>`;
                 else if(action === '3d') htmlToInject = `<model-viewer src="${url}" auto-rotate camera-controls class="canvas-el" style="width: 300px; height: 300px;"></model-viewer>`;
                 else if(action === 'link') htmlToInject = `<a href="${url}" class="canvas-el" target="_blank">Download ${name}</a>`;
                 else return;
            }

            if (htmlToInject) {
                window.addElementHTML(htmlToInject);
                window.closeModal('asset-modal');
                window.playSound('success');
            }
        };
        
        window.fetchNeocitiesAssets = async () => {
            const grid = document.getElementById('neocities-asset-grid');
            grid.innerHTML = '<div style="grid-column:1/-1; text-align:center;">Contacting Neocities...</div>';
            
            // Get Config from localStorage set by deployment script
            const saved = localStorage.getItem('neocities-config');
            if(!saved) {
                grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:red;">No API Key found. Please set it in "Deploy" menu first.</div>';
                return;
            }
            let apiKey = "";
            try {
                const config = JSON.parse(saved);
                apiKey = config.apiKey;
            } catch(e) {
                 grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:red;">Config Error. Reset Deploy settings.</div>';
                 return;
            }

            if(!apiKey) {
                grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:red;">No API Key configured. Go to Deploy > Settings.</div>';
                return;
            }

            try {
                // 1. Get Info for URL (Use Safe Fetch for Proxy)
                const infoRes = await window.safeFetch('https://neocities.org/api/info', { headers: { 'Authorization': `Bearer ${apiKey}` } });
                if(!infoRes || infoRes.result !== 'success') throw new Error('Auth Failed');
                const siteUrl = `https://${infoRes.info.sitename}.neocities.org`;

                // 2. Get Files (Use Safe Fetch for Proxy)
                const listRes = await window.safeFetch('https://neocities.org/api/list', { headers: { 'Authorization': `Bearer ${apiKey}` } });
                
                grid.innerHTML = '';

                // Filter images
                const images = listRes.files.filter(f => f.path.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i));

                images.forEach(img => {
                    const fullUrl = `${siteUrl}/${img.path}`;
                    const card = document.createElement('div');
                    card.className = 'asset-card';
                    card.innerHTML = `
                        <img src="${fullUrl}" class="asset-thumb" loading="lazy">
                        <div class="asset-name">${img.path}</div>
                    `;
                    card.onclick = () => {
                        // Handle Asset Picking Mode
                        if (window.assetPickMode && window.selectedEl) {
                            if (window.assetPickMode === 'src') window.updateProp('src', fullUrl);
                            else if (window.assetPickMode === 'bg') window.updateProp('backgroundImage', fullUrl);
                            window.closeModal('asset-modal');
                            return;
                        }

                        window.addElementHTML(`<img src="${fullUrl}" class="canvas-el" style="max-width:300px;">`);
                        window.closeModal('asset-modal');
                        window.playSound('success');
                    };
                    grid.appendChild(card);
                });

                if(images.length === 0) {
                     grid.innerHTML = '<div style="grid-column:1/-1; text-align:center;">No images found on site.</div>';
                }

            } catch(e) {
                 grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:red;">Error: ${e.message}. <br>(If this is a CORS error, you need a browser extension to allow CORS for neocities.org)</div>`;
            }
        };

        window.fetchGithubAssets = async (path = '') => {
            const user = document.getElementById('gh-user').value;
            const repo = document.getElementById('gh-repo').value;
            const grid = document.getElementById('gh-grid');
            const breadcrumbs = document.getElementById('gh-breadcrumbs');
            
            grid.innerHTML = '<div style="grid-column:1/-1; text-align:center;">Loading...</div>';
            
            try {
                const response = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${path}`);
                if(!response.ok) throw new Error('Repo not found, private, or rate limited');
                const data = await response.json();
                
                grid.innerHTML = '';
                breadcrumbs.innerText = `root / ${path}`;
                
                if(path.length > 0) {
                    const upPath = path.split('/').slice(0,-1).join('/');
                    const backCard = document.createElement('div');
                    backCard.className = 'asset-card';
                    backCard.innerHTML = `<div style="font-size:30px;">📁</div><div class="asset-name">..</div>`;
                    backCard.onclick = () => window.fetchGithubAssets(upPath);
                    grid.appendChild(backCard);
                }

                data.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'asset-card';
                    
                    if(item.type === 'dir') {
                        card.innerHTML = `<div style="font-size:30px;">📁</div><div class="asset-name">${item.name}</div>`;
                        card.onclick = () => window.fetchGithubAssets(item.path);
                    } else {
                         // Determine preview icon based on extension
                        const ext = item.name.split('.').pop().toLowerCase();
                        let icon = '📄';
                        let isImg = false;
                        
                        if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico', 'bmp'].includes(ext)) { icon = '🖼️'; isImg = true; }
                        else if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) icon = '🎵';
                        else if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)) icon = '🎬';
                        else if (['glb', 'gltf', 'obj'].includes(ext)) icon = '🧊';
                        else if (['css', 'scss', 'sass', 'less'].includes(ext)) icon = '🎨';
                        else if (['js', 'ts', 'jsx', 'tsx', 'json'].includes(ext)) icon = '⚡';
                        else if (['html', 'xml', 'md', 'txt'].includes(ext)) icon = '📝';
                        else if (['pdf'].includes(ext)) icon = '📕';
                        else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) icon = '📦';

                        const preview = isImg ? `<img src="${item.download_url}" class="asset-thumb">` : `<div style="font-size:30px;">${icon}</div>`;
                        card.innerHTML = `${preview}<div class="asset-name">${item.name}</div>`;
                        
                        // Robust Click Handler Call
                        const downloadUrl = item.download_url;
                        const itemName = item.name;
                        const itemType = item.type;
                        card.onclick = () => window.handleGithubAssetClick(itemType, downloadUrl, itemName);
                    }
                    grid.appendChild(card);
                });
            } catch(e) {
                grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:red;">Error: ${e.message}.<br>Check if repo is public.</div>`;
            }
        };

        // --- INLINE COAIEXIST TEMPLATES ---
        const COAIEXIST_TEMPLATES = {
            'coaiexist-mobile-frame': `<div style="width: 375px; height: 667px; border: 10px solid #333; border-radius: 20px; background: white; overflow: hidden; position: relative; box-shadow: 0 0 20px rgba(0,0,0,0.5); display: flex; flex-direction: column;"><div style="height: 20px; background: #333; width: 100%; display: flex; justify-content: center; align-items: center; flex-shrink: 0;"><div style="width: 50px; height: 4px; background: #555; border-radius: 2px;"></div></div><div class="mobile-content" style="padding: 20px; flex: 1; overflow-y: auto;"><h3>Mobile View</h3><p>Content goes here...</p></div></div>`,
            // ... (Rest of existing templates kept same) ...
            'coaiexist-pip': `<model-viewer src="https://coaiexist.wtf/assets/pollywog/pip.glb" alt="A 3D Pip" auto-rotate camera-controls style="width: 200px; height: 200px; background-color: transparent;"></model-viewer>`,
            'coaiexist-glitch': `<div style="position: relative; display: inline-block;"><h1 class="glitch-text" style="font-size: 4rem; font-weight: bold; text-transform: uppercase; position: relative; color: white; mix-blend-mode: lighten;">CYBERPUNK</h1><style>.glitch-text::before, .glitch-text::after {content: "CYBERPUNK";position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.8;}.glitch-text::before { color: #0ff; z-index: -1; animation: glitch-anim-1 0.4s infinite; clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%); transform: translate(-2px, -2px); }.glitch-text::after { color: #f0f; z-index: -2; animation: glitch-anim-2 0.4s infinite; clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%); transform: translate(2px, 2px); }@keyframes glitch-anim-1 { 0% { clip-path: inset(20% 0 80% 0); } 20% { clip-path: inset(60% 0 10% 0); } 40% { clip-path: inset(40% 0 50% 0); } 60% { clip-path: inset(80% 0 5% 0); } 80% { clip-path: inset(10% 0 70% 0); } 100% { clip-path: inset(30% 0 20% 0); } }@keyframes glitch-anim-2 { 0% { clip-path: inset(10% 0 60% 0); } 20% { clip-path: inset(30% 0 20% 0); } 40% { clip-path: inset(70% 0 10% 0); } 60% { clip-path: inset(20% 0 50% 0); } 80% { clip-path: inset(60% 0 30% 0); } 100% { clip-path: inset(40% 0 80% 0); } }</style><script>document.currentScript.parentElement.querySelector('.glitch-text').addEventListener('input', function(e) {this.setAttribute('data-text', this.innerText);});<\/script></div>`,
            'coaiexist-buddy-list': `<div style="width: 200px; background: #c0c0c0; border: 2px outset #fff; font-family: 'MS Sans Serif', sans-serif; font-size: 11px; color: black;"><div style="background: navy; color: white; padding: 2px 4px; font-weight: bold; display: flex; justify-content: space-between;"><span>Buddy List</span><span>_ □ X</span></div><div style="background: white; border: 2px inset #fff; margin: 4px; height: 250px; overflow-y: scroll; padding: 2px;"><div style="font-weight: bold; margin-bottom: 2px;">▼ Buddies (3/12)</div><div style="padding-left: 10px; cursor: pointer;">😊 xX_DarkSoul_Xx</div><div style="padding-left: 10px; cursor: pointer; color: red;">😡 glitter_gurl</div><div style="padding-left: 10px; cursor: pointer; color: blue;">💤 matrix_neo</div><div style="font-weight: bold; margin-top: 5px;">▼ Family (0/4)</div></div><div style="padding: 4px; text-align: center;"><button style="border: 1px outset white;">IM</button><button style="border: 1px outset white;">Info</button><button style="border: 1px outset white;">Setup</button></div></div>`,
            'coaiexist-winamp': `<div style="width: 300px; background: #222; color: #0f0; font-family: 'VT323', monospace; border: 2px solid #555; border-radius: 4px; padding: 5px; position: relative;"><div style="background: linear-gradient(to right, #000033, #000066); padding: 2px 5px; display: flex; justify-content: space-between; margin-bottom: 5px; cursor: move;"><span>WINAMP</span><span>_ □ X</span></div><div style="background: black; border: 1px inset #555; height: 40px; margin-bottom: 5px; display: flex; align-items: center; justify-content: center;"><span style="color: #0f0; font-size: 20px;">01:23 *** DEMO TRACK ***</span></div><div style="display: flex; gap: 2px;"><div style="flex: 1; height: 40px; background: #333; display: flex; align-items: flex-end; padding: 2px; gap: 1px;">${Array(15).fill(0).map(() => `<div style="width: 5px; background: linear-gradient(to top, green, yellow, red); height: ${Math.random()*100}%;"></div>`).join('')}</div><div style="width: 80px; display: grid; grid-template-columns: 1fr 1fr; gap: 2px;"><button style="background:#ccc; border:1px outset #fff; font-size:10px;">PREV</button><button style="background:#ccc; border:1px outset #fff; font-size:10px;">PLAY</button><button style="background:#ccc; border:1px outset #fff; font-size:10px;">PAUSE</button><button style="background:#ccc; border:1px outset #fff; font-size:10px;">NEXT</button></div></div><div style="margin-top: 5px; display: flex; justify-content: space-between; font-size: 10px;"><span>KBPS: 128</span><span>KHZ: 44</span></div></div>`,
            'coaiexist-terminal': `<div style="width: 400px; height: 250px; background: black; border: 2px solid #333; color: #0f0; font-family: monospace; padding: 5px; overflow: hidden;"><div>Microsoft(R) Windows DOS</div><div>(C) Copyright Microsoft Corp 1990-2001.</div><br><div id="term-output">C:\\USERS\\ADMIN> <span class="blink">_</span></div><style>.blink { animation: blinker 1s linear infinite; } @keyframes blinker { 50% { opacity: 0; } }</style></div>`,
            'coaiexist-webring': `<div style="background: black; border: 2px solid #00ff00; padding: 10px; width: 100%; max-width: 400px; text-align: center; font-family: 'Courier New', monospace; color: #00ff00;"><div>=== THE COAIEXIST WEBRING ===</div><div style="margin: 10px 0; font-size: 24px;">🕸️</div><div style="display: flex; justify-content: space-around;"><a href="#" style="color: #00ff00;">[ Prev ]</a><a href="#" style="color: #00ff00;">[ Random ]</a><a href="#" style="color: #00ff00;">[ Next ]</a></div></div>`,
            'coaiexist-cyber-badge': `<div style="display: flex; gap: 5px; flex-wrap: wrap;"><img src="https://anlucas.neocities.org/88x31/notepad.gif" style="image-rendering: pixelated;"><img src="https://anlucas.neocities.org/88x31/ie_logo.gif" style="image-rendering: pixelated;"><img src="https://anlucas.neocities.org/88x31/netscape.gif" style="image-rendering: pixelated;"><img src="https://anlucas.neocities.org/88x31/now.gif" style="image-rendering: pixelated;"></div>`,
            'coaiexist-hit-counter': `<div style="display: inline-block; background: black; border: 2px inset #555; padding: 2px 5px; color: red; font-family: 'Courier New', monospace; font-weight: bold; letter-spacing: 3px; font-size: 14px;">0 3 4 8 2 1</div>`,
            'coaiexist-pet': `<div style="width: 100px; text-align: center; position: relative;"><div style="background: #e0f0ff; border: 4px solid #333; border-radius: 50% 50% 10px 10px; padding: 10px;"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExa244a2o1Ynd5Ymx5a2w1Ynd5Ymx5a2w1Ynd5Ymx5YSZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/3o7TKMt1VVNkHVyPaE/giphy.gif" style="width: 50px; image-rendering: pixelated;"></div><div style="background: #333; color: white; font-size: 10px; padding: 2px; margin-top: 2px;">TAMAGOTCHI</div></div>`,
            'coaiexist-weather': `<div style="width: 150px; background: linear-gradient(to bottom, #87CEFA, #4682B4); border: 2px solid white; border-radius: 8px; padding: 10px; color: white; font-family: sans-serif; text-align: center; box-shadow: 2px 2px 5px rgba(0,0,0,0.3);"><div style="font-size: 12px; text-transform: uppercase; margin-bottom: 5px;">Tokyo</div><div style="font-size: 32px;">☀️</div><div style="font-size: 24px; font-weight: bold;">24°C</div><div style="font-size: 10px; margin-top: 5px;">Feels like 26°C</div></div>`,
            'coaiexist-music-viz': `<div style="display: flex; align-items: flex-end; gap: 2px; height: 50px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 8px;">${[1,2,3,4,5,6,7,8].map(i => `<div style="width: 8px; background: #00f0ff; animation: viz${i} 0.5s infinite alternate ease-in-out; height: 20%;"></div><style>@keyframes viz${i} { 0% { height: 20%; } 100% { height: ${Math.floor(Math.random()*80+20)}%; } }</style>`).join('')}</div>`,
            
            // --- NOSTALGIA PACK ---
            'coaiexist-cool-s': `<div style="width: 60px; height: 120px; margin: 10px auto;"><svg viewBox="0 0 100 200" style="width:100%; height:100%; stroke:#00f0ff; stroke-width:8; stroke-linecap:round; stroke-linejoin:round; fill:none; filter:drop-shadow(0 0 5px cyan);"><path d="M 20,60 V 20 L 50,0 L 80,20 V 60" /><path d="M 20,140 V 180 L 50,200 L 80,180 V 140" /><path d="M 20,60 L 50,100 L 80,60" /><path d="M 20,140 L 50,100 L 80,140" /><line x1="20" y1="60" x2="20" y2="140" /><line x1="80" y1="60" x2="80" y2="140" /></svg></div>`,
            'coaiexist-dvd-logo': `<div style="width: 100%; height: 200px; background: #000; position: relative; overflow: hidden; border: 2px solid #333;"><div style="width: 60px; height: 30px; position: absolute; animation: dvd-x 4s linear infinite alternate, dvd-y 6.3s linear infinite alternate; top: 0; left: 0;"><div style="width: 100%; height: 100%; background: blue; color: white; display: flex; justify-content: center; align-items: center; font-weight: bold; border-radius: 4px; box-shadow: 0 0 10px blue;">DVD</div></div><style>@keyframes dvd-x { 0% { left: 0; } 100% { left: calc(100% - 60px); } } @keyframes dvd-y { 0% { top: 0; } 100% { top: calc(100% - 30px); } }</style></div>`,
            'coaiexist-glitter-text': `<h1 style="font-size: 48px; font-weight: bold; color: gold; background-image: url('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzc1ZWY5ZjIyM2ExZjU4Y2YwODU4YzQ4ZDM5ZjA5YzYwYzcwYjQxZSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PXM/3o7TKMt1VVNkHVyPaE/giphy.gif'); -webkit-background-clip: text; color: transparent; filter: drop-shadow(0 0 2px gold);">GLITTER</h1>`,
            'coaiexist-hazard-tape': `<div style="height: 40px; width: 100%; background: repeating-linear-gradient(-45deg, #ffd700, #ffd700 20px, #000 20px, #000 40px); border: 2px solid black;"></div>`,
            'coaiexist-guestbook-btn': `<button style="background: #c0c0c0; border: 2px outset white; padding: 4px 8px; display: flex; align-items: center; gap: 6px; cursor: pointer; font-family: sans-serif; font-size: 12px;"><span style="font-size: 16px;">📖</span> Sign My Guestbook!</button>`,
            
            // --- BASIC TYPES ---
            'typewriter': `<h2 style="font-family: monospace; overflow: hidden; border-right: .15em solid orange; white-space: nowrap; margin: 0 auto; letter-spacing: .15em; animation: typing 3.5s steps(30, end), blink-caret .5s step-end infinite;">Hello World</h2><style>@keyframes typing { from { width: 0 } to { width: 100% } } @keyframes blink-caret { from, to { border-color: transparent } 50% { border-color: orange } }</style>`,
            'blockquote': `<blockquote style="border-left: 4px solid #ccc; margin: 1.5em 10px; padding: 0.5em 10px; quotes: '\\201C''\\201D''\\2018''\\2019';"><p style="display: inline;">The web is what you make of it.</p><footer style="color: #666; margin-top: 5px;">— Internet User</footer></blockquote>`,
            'blink': `<span style="animation: blinker 1s linear infinite;">BLINKING TEXT</span><style>@keyframes blinker { 50% { opacity: 0; } }</style>`,
            'avatar': `<img src="https://i.pravatar.cc/150?img=12" style="border-radius: 50%; width: 64px; height: 64px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">`,
            'marquee': `<marquee scrollamount="5" style="background:#000; color:#0f0; font-family:monospace; padding:5px;">*** WELCOME TO THE ZONE ***</marquee>`,
            'accordion': `<details style="border:1px solid #aaa; border-radius:4px; padding:5px;"><summary style="cursor:pointer; font-weight:bold;">Click to expand</summary><p style="margin-top:5px;">Hidden content revealed!</p></details>`,
            'badge': `<span style="background:#00d1b2; color:white; padding:2px 8px; border-radius:10px; font-size:10px; font-weight:bold; text-transform:uppercase;">New</span>`,
            'alert': `<div style="background:#fee; color:#c00; border:1px solid #fcc; padding:10px; border-radius:4px;"><strong>Alert:</strong> Something happened!</div>`,
            'progress': `<div style="width:100%; background:#eee; border-radius:10px; height:20px; overflow:hidden;"><div style="width:60%; background:#3273dc; height:100%;"></div></div>`,
            'bulma-hero': `<section style="background-color: #00d1b2; padding: 3rem 1.5rem; text-align: center; color: white;"><h1 style="font-size: 2rem; font-weight: bold;">Hero Title</h1><p style="font-size: 1.25rem;">Hero subtitle goes here.</p></section>`,
            'bulma-navbar': `<nav style="background: white; display: flex; justify-content: space-between; padding: 10px 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); align-items: center;"><div style="font-weight: bold; font-size: 18px;">Logo</div><div style="display: flex; gap: 15px;"><a href="#" style="color: #4a4a4a; text-decoration: none;">Home</a><a href="#" style="color: #4a4a4a; text-decoration: none;">About</a><a href="#" style="color: #4a4a4a; text-decoration: none;">Contact</a></div></nav>`,
            'bulma-message': `<article style="background-color: #f5f5f5; border-radius: 4px; font-size: 1rem;"><div style="background-color: #4a4a4a; color: #fff; padding: 0.5em 0.75em; border-radius: 4px 4px 0 0; font-weight: 700;">Message Header</div><div style="padding: 1em; border: 1px solid #dbdbdb; border-top: none; border-radius: 0 0 4px 4px; color: #4a4a4a;">Message body text here.</div></article>`,
            'table': `<table style="width:100%; border-collapse: collapse; margin: 10px 0;"><thead><tr style="background: #eee;"><th style="border: 1px solid #ccc; padding: 8px;">Header 1</th><th style="border: 1px solid #ccc; padding: 8px;">Header 2</th></tr></thead><tbody><tr><td style="border: 1px solid #ccc; padding: 8px;">Row 1 Col 1</td><td style="border: 1px solid #ccc; padding: 8px;">Row 1 Col 2</td></tr><tr><td style="border: 1px solid #ccc; padding: 8px;">Row 2 Col 1</td><td style="border: 1px solid #ccc; padding: 8px;">Row 2 Col 2</td></tr></tbody></table>`,
            'code': `<pre style="background: #2d2d2d; color: #ccc; padding: 10px; border-radius: 4px; overflow-x: auto;"><code>console.log('Hello World');</code></pre>`,
            
            // All other existing templates...
            'coaiexist-construction': `
            <div style="width: 100%; background: repeating-linear-gradient(45deg, #ffee00, #ffee00 10px, #000000 10px, #000000 20px); padding: 10px; text-align: center; border: 2px solid black;">
                <div style="background: black; color: yellow; display: inline-block; padding: 5px 15px; font-family: 'Arial Black', sans-serif; font-weight: bold; border: 2px solid white;">
                    🚧 UNDER CONSTRUCTION 🚧
                </div>
            </div>`,
            
            // ... (Rest of existing templates)
        };
        const BULMA_TEMPLATES = { 'bulma-card': `<div style="border:1px solid #dbdbdb;border-radius:6px;background:white;max-width:300px;"><div style="padding:20px;"><h3>Title</h3><p>Content</p></div></div>` };
        Object.assign(window.elementTemplates, COAIEXIST_TEMPLATES, BULMA_TEMPLATES);

        // --- HISTORY SYSTEM ---
        const MAX_HISTORY = 50;
        let isUndoRedoAction = false;

        // --- SOUND SYSTEM ---
        const sounds = {};
        let soundsInitialized = false;
        let soundInitPromise = null;

        function initializeSounds() {
            if (soundsInitialized) return;
            if (typeof Tone === 'undefined') return;
            try {
                sounds.pop = new Tone.PolySynth(Tone.Synth).toDestination();
                sounds.boop = new Tone.PolySynth(Tone.Synth).toDestination();
                sounds.success = new Tone.PolySynth(Tone.Synth).toDestination();
                sounds.error = new Tone.PolySynth(Tone.Synth).toDestination();
                soundsInitialized = true;
            } catch(e) { console.error(e); }
        }

        async function ensureSoundInitialized() {
            if (soundsInitialized) return;
            if (!soundInitPromise && typeof Tone !== 'undefined') {
                soundInitPromise = Tone.start().then(() => initializeSounds());
            }
            return soundInitPromise;
        }

        window.toggleSound = async () => {
            window.soundEnabled = !window.soundEnabled;
            const btn = document.getElementById('sound-toggle-btn');
            if(btn) {
                btn.innerText = window.soundEnabled ? "🔊 Sound: On" : "🔇 Sound: Off";
                btn.classList.toggle('btn-pink', !window.soundEnabled);
            }
            
            try {
                if (window.soundEnabled) {
                    await Tone.start();
                    if (Tone.context.state !== 'running') {
                        await Tone.context.resume();
                    }
                } else {
                    // Fix for Tone.context.suspend error
                    const ctx = Tone.context.rawContext || Tone.context;
                    if (ctx && typeof ctx.suspend === 'function') {
                        await ctx.suspend();
                    }
                }
            } catch (e) {
                console.warn("Audio context state change failed:", e);
            }
        };

        window.playSound = (type, note = 'C5') => {
            if(!window.soundEnabled) return;
            ensureSoundInitialized().then(() => {
                if(sounds[type]) sounds[type].triggerAttackRelease(note, '16n');
            });
        };
        
        window.showStamp = (emoji) => {
            const stamp = document.createElement('div');
            stamp.innerText = emoji;
            stamp.style.cssText = `position:fixed; left:${Math.random()*80+10}%; top:${Math.random()*80+10}%; font-size:48px; pointer-events:none; z-index:9999; animation: floatUp 1s ease-out forwards; opacity: 0;`;
            const style = document.createElement('style');
            style.innerHTML = `@keyframes floatUp { 0% { opacity: 1; transform: scale(0.5); } 100% { opacity: 0; transform: scale(1.5) translateY(-50px); } }`;
            document.head.appendChild(style);
            document.body.appendChild(stamp);
            setTimeout(() => stamp.remove(), 1000);
        };

        // --- HISTORY FUNCTIONS ---
        window.saveState = () => {
            if (isUndoRedoAction) return;
            if (!iframeDoc || !iframeDoc.body) return;
            
            const page = getCurrentPage();
            const currentHtml = iframeDoc.documentElement.innerHTML;
            
            if (page.historyIndex >= 0 && page.history[page.historyIndex] === currentHtml) return;
            
            if (page.historyIndex < page.history.length - 1) {
                page.history = page.history.slice(0, page.historyIndex + 1);
            }
            
            page.history.push(currentHtml);
            if (page.history.length > MAX_HISTORY) {
                page.history.shift();
            } else {
                page.historyIndex++;
            }
            
            page.content = currentHtml; // Update current content ref
            updateUndoButtons();
            window.renderLayers();
        };

        function updateUndoButtons() {
            const page = getCurrentPage();
            const undoBtn = document.getElementById('undo-btn');
            const redoBtn = document.getElementById('redo-btn');
            
            if(undoBtn) {
                undoBtn.disabled = page.historyIndex <= 0;
                undoBtn.classList.toggle('active', page.historyIndex > 0);
            }
            
            if(redoBtn) {
                redoBtn.disabled = page.historyIndex >= page.history.length - 1;
                redoBtn.classList.toggle('active', page.historyIndex < page.history.length - 1);
            }
        }

        window.undo = () => {
            const page = getCurrentPage();
            if (page.historyIndex > 0) {
                isUndoRedoAction = true;
                page.historyIndex--;
                restoreState(page.history[page.historyIndex]);
                isUndoRedoAction = false;
                window.playSound('pop', 'D5');
            }
        };

        window.redo = () => {
            const page = getCurrentPage();
            if (page.historyIndex < page.history.length - 1) {
                isUndoRedoAction = true;
                page.historyIndex++;
                restoreState(page.history[page.historyIndex]);
                isUndoRedoAction = false;
                window.playSound('pop', 'E5');
            }
        };

        function restoreState(html) {
            if (!iframeDoc) return;
            iframeDoc.open();
            iframeDoc.write(html);
            iframeDoc.close();
            
            const page = getCurrentPage();
            page.content = html;

            setTimeout(() => {
                 setupIframeInteractions();
                 window.ensureAnimationStyles();
                 deselect();
            }, 10);
            
            updateUndoButtons();
            window.renderLayers();
        }
        
        // --- INTERACTION HANDLER ---
        function setupIframeInteractions() {
            if(!iframeDoc || !iframeDoc.body) return;
            
            // 0. CAPTURE PHASE LINK INTERCEPTOR (Crucial for preventing navigation)
            iframeDoc.addEventListener('click', (e) => {
                const link = e.target.closest('a') || e.target.closest('button');
                // Check if we are in text-editing mode for this element
                const isEditing = link && link.isContentEditable;
                
                if(link) {
                    if(!document.body.classList.contains('preview-mode')) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation(); // Force stop all other handlers
                        
                        if(!isEditing) {
                            window.selectElement(link);
                            window.updateStatus(`Link intercepted: ${link.href || 'button'}`);
                        }
                        return false;
                    }
                }
            }, true); // True = Capture phase (happens before bubble)

            // --- TRACK SELECTION FOR TEXT EDITOR ---
            const saveSelection = () => {
                const sel = iframeDoc.getSelection();
                if(sel.rangeCount > 0) {
                    window.currentSelectionRange = sel.getRangeAt(0);
                }
            };
            iframeDoc.addEventListener('mouseup', saveSelection);
            iframeDoc.addEventListener('keyup', saveSelection);
            iframeDoc.addEventListener('selectionchange', saveSelection);

            // 1. Click Selection & Global Dismiss
            iframeDoc.body.addEventListener('click', (e) => {
                // If it was a drag, do nothing here (mouseup handled it)
                if(window.wasDragging) { window.wasDragging = false; return; }
                
                // Context menu close
                closeContextMenu();

                // Selection logic
                if(e.target !== iframeDoc.body) {
                     // Check if clicking inside already selected text element (editing)
                     if(window.selectedEl === e.target && e.target.isContentEditable) {
                         return; 
                     }
                     selectElement(e.target);
                }
                else deselect();
            });
            
            // Global key handler is attached in initCanvas via window.handleGlobalKeys
            // But we ensure it here too just in case
            iframeDoc.removeEventListener('keydown', window.handleGlobalKeys);
            iframeDoc.addEventListener('keydown', window.handleGlobalKeys);

            // 2. Context Menu (Improved for deep elements)
            iframeDoc.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Find deepest element under cursor (including inside navbars)
                const target = e.target.closest('.canvas-el') || e.target;
                
                if(target && target !== iframeDoc.body) {
                    selectElement(target);
                
                    const menu = document.getElementById('context-menu');
                    const iframeRect = document.getElementById('canvas-frame').getBoundingClientRect();
                    
                    menu.style.display = 'block';
                    // Positioning relative to viewport
                    menu.style.left = (iframeRect.left + e.clientX) + 'px';
                    menu.style.top = (iframeRect.top + e.clientY) + 'px';
                }
            });

            // 3. Double Click Text Edit
            iframeDoc.body.addEventListener('dblclick', (e) => {
                const el = e.target.closest('.canvas-el') || e.target;
                if(el && el !== iframeDoc.body) {
                    e.preventDefault(); // Stop default (like selecting word)
                    tryEditText(el);
                }
            });
            
            // Track mouse coordinates for Status Bar
            iframeDoc.body.addEventListener('mousemove', (e) => {
                const status = document.getElementById('mouse-coords');
                if(status) status.innerText = `${Math.round(e.clientX)},${Math.round(e.clientY)}`;
            });

            function tryEditText(el) {
                 if(el !== iframeDoc.body) {
                     // Force enable
                     el.contentEditable = true;
                     el.focus();
                     
                     // Visual indicator
                     el.style.outline = "2px dashed #ff00cc";
                     
                     // Temporarily disable pointer events on children to prevent clicking links inside while editing
                     Array.from(el.children).forEach(c => c.style.pointerEvents = 'none');
                     
                     // Open Sidebar Text Tab automatically
                     document.getElementById('sidebar').classList.add('active');
                     document.getElementById('tab-text').click();
                     
                     window.updateStatus('Text Editing Mode Active');

                     // Enhanced Enter Key Handling
                     const onKeydown = (e) => {
                         // e.stopPropagation(); // Prevent global shortcuts while typing (disabled to fix backspace)
                         
                         if (e.key === 'Enter') {
                             // Shift+Enter allowed for line break
                             if (e.shiftKey) return;

                             // For single-line elements, Enter = Commit (Blur)
                             if (['H1','H2','H3','H4','H5','H6','BUTTON','SPAN','A','LABEL','TH'].includes(el.tagName)) {
                                 e.preventDefault();
                                 el.blur(); 
                             } 
                         }
                     };
                     el.addEventListener('keydown', onKeydown);
                }
            }

            // 4. Drag & Drop
            iframeDoc.body.addEventListener('dragover', e => e.preventDefault());
            iframeDoc.body.addEventListener('drop', e => {
                e.preventDefault();
                // Check dataTransfer or fallback global (for cross-frame reliability)
                const type = e.dataTransfer.getData('type') || window.draggedLayer;
                
                if(type) {
                     // Support nested drop
                     const target = e.target.closest('.canvas-el');
                     if(target && target !== iframeDoc.body) {
                          window.selectedEl = target; // Set target as selected for addElement
                     }
                     addElementHTML(window.elementTemplates[type] || `<div>${type}</div>`);
                     window.draggedLayer = null; // Clear global
                }
            });

            // 5. DEFAULT FREE DRAG & MANUAL RESIZE MODE
            let activeDragEl = null;
            let dragOffsetX = 0;
            let dragOffsetY = 0;
            let startX = 0;
            let startY = 0;
            let isDragStarted = false;
            
            // Resize State
            let isResizing = false;
            let startW = 0, startH = 0;

            iframeDoc.body.addEventListener('mousedown', (e) => {
                const target = e.target.closest('.canvas-el');
                // Only start drag if NOT editing text
                if (target && target !== iframeDoc.body && !target.isContentEditable) {
                    
                    const rect = target.getBoundingClientRect();
                    // MANUAL RESIZE DETECTION (20px Corner Zone)
                    if (target.classList.contains('selected')) {
                        if (e.clientX >= rect.right - 20 && e.clientY >= rect.bottom - 20) {
                            isResizing = true;
                            activeDragEl = target;
                            startW = rect.width;
                            startH = rect.height;
                            startX = e.clientX;
                            startY = e.clientY;
                            e.preventDefault(); // Stop text selection
                            e.stopPropagation(); // Stop drag logic
                            return; 
                        }
                    }

                    // Start Normal Drag
                    activeDragEl = target;
                    startX = e.clientX;
                    startY = e.clientY;
                    isDragStarted = false;
                    
                    dragOffsetX = e.clientX - rect.left;
                    dragOffsetY = e.clientY - rect.top;
                }
            });

            iframeDoc.addEventListener('mousemove', (e) => {
                // RESIZE LOGIC
                if (isResizing && activeDragEl) {
                    e.preventDefault();
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;
                    activeDragEl.style.width = (startW + dx) + 'px';
                    activeDragEl.style.height = (startH + dy) + 'px';
                    activeDragEl.style.maxWidth = 'none'; // Unlock constraints
                    activeDragEl.style.maxHeight = 'none';
                    if(window.selectedEl === activeDragEl) window.renderProperties();
                    return;
                }

                // DRAG LOGIC
                if (activeDragEl) {
                    // Check threshold (5px) before starting drag
                    if (!isDragStarted) {
                        const dist = Math.sqrt(Math.pow(e.clientX - startX, 2) + Math.pow(e.clientY - startY, 2));
                        if (dist > 5) {
                            isDragStarted = true;
                            window.selectElement(activeDragEl);
                            activeDragEl.style.zIndex = '9999';
                            activeDragEl.style.cursor = 'grabbing';
                            
                            // Ensure absolute positioning if not already
                            const cs = window.getComputedStyle(activeDragEl);
                            if (cs.position === 'static' || cs.position === 'relative') {
                                const rect = activeDragEl.getBoundingClientRect();
                                const bodyRect = iframeDoc.body.getBoundingClientRect();
                                activeDragEl.style.position = 'absolute';
                                activeDragEl.style.left = (rect.left - bodyRect.left) + 'px';
                                activeDragEl.style.top = (rect.top - bodyRect.top) + 'px';
                                activeDragEl.style.width = rect.width + 'px';
                                activeDragEl.style.margin = '0';
                                activeDragEl.style.transform = 'none';
                            }
                        }
                    }

                    if (isDragStarted) {
                        e.preventDefault();
                        const bodyRect = iframeDoc.body.getBoundingClientRect();
                        let x = e.clientX - bodyRect.left - dragOffsetX;
                        let y = e.clientY - bodyRect.top - dragOffsetY;
                        
                        activeDragEl.style.left = x + 'px';
                        activeDragEl.style.top = y + 'px';
                        
                        if(window.selectedEl === activeDragEl) window.renderProperties();
                    }
                }
            });

            iframeDoc.addEventListener('mouseup', () => {
                if (isResizing) {
                    isResizing = false;
                    window.saveState();
                    activeDragEl = null;
                    return;
                }

                if (activeDragEl) {
                    activeDragEl.style.cursor = '';
                    activeDragEl.style.zIndex = '';
                    if (isDragStarted) {
                        window.wasDragging = true;
                        window.saveState();
                    }
                    activeDragEl = null;
                    isDragStarted = false;
                }
            });
        }
        
        window.closeContextMenu = () => {
            const menu = document.getElementById('context-menu');
            if(menu) menu.style.display = 'none';
        };

        window.ctxAction = (action) => {
            // Check active element in iframe first, then main window selection
            let el = window.selectedEl;
            
            if(!el && action !== 'paste') return;
            
            if(action === 'del') { el.remove(); window.deselect(); window.saveState(); }
            else if(action === 'dup') { const clone = el.cloneNode(true); el.parentNode.insertBefore(clone, el.nextSibling); window.saveState(); }
            else if(action === 'up') { if(el.previousElementSibling) { el.parentNode.insertBefore(el, el.previousElementSibling); window.saveState(); } }
            else if(action === 'down') { if(el.nextElementSibling) { el.parentNode.insertBefore(el.nextElementSibling, el); window.saveState(); } }
            else if(action === 'copy') {
                 window.clipboardEl = el.cloneNode(true);
                 window.updateStatus('Element Copied');
            }
            else if(action === 'cut') {
                 window.clipboardEl = el.cloneNode(true);
                 el.remove();
                 window.deselect();
                 window.saveState();
                 window.updateStatus('Element Cut');
            }
            else if(action === 'paste') {
                 if(window.clipboardEl) {
                      const clone = window.clipboardEl.cloneNode(true);
                      window.processLayerization(clone);
                      // Paste after current selection or at body end
                      if(el && el.parentNode) el.parentNode.insertBefore(clone, el.nextSibling);
                      else if (iframeDoc) iframeDoc.body.appendChild(clone);
                      
                      window.selectElement(clone);
                      window.saveState();
                      window.updateStatus('Element Pasted');
                 }
            }
            else if(action === 'link') {
                const url = prompt('Enter URL:', 'https://');
                if(url) {
                    if(el.tagName === 'A') {
                        el.href = url;
                    } else if (window.getSelection && window.getSelection().rangeCount > 0) {
                         const doc = iframeDoc;
                         doc.execCommand('createLink', false, url);
                    } else {
                       const a = document.createElement('a');
                       a.href = url;
                       el.parentNode.insertBefore(a, el);
                       a.appendChild(el);
                       window.selectElement(a);
                    }
                   window.saveState();
                }
            }
            closeContextMenu();
        };
        
        // Removed toggleDragMode as it's now default behavior

        // --- EXPORTED FUNCTIONS ---
        window.initCanvas = function(content = null, resetHistory = false) {
            iframeDoc = iframe.contentWindow.document;
            iframeDoc.open();
            
            if(content) {
                // Auto-layerize imported content immediately
                const parser = new DOMParser();
                const tempDoc = parser.parseFromString(content, 'text/html');
                window.processLayerization(tempDoc.body);
                // Also ensure styles exist
                if(!tempDoc.head.innerHTML.includes('global-theme-style')) {
                     const s = tempDoc.createElement('style'); s.id='global-theme-style'; tempDoc.head.appendChild(s);
                }
                iframeDoc.write(tempDoc.documentElement.outerHTML);
            } else {
                // Default blank canvas
                iframeDoc.write(`<!DOCTYPE html>
                    <html>
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            body { font-family: 'Inter', sans-serif; padding: 20px; margin: 0; min-height: 100vh; color: #333; overflow-x: hidden; }
                            .canvas-el { cursor: pointer; position: relative; transition: outline 0.2s; }
                            .canvas-el:hover { outline: 1px dashed #00f0ff; }
                            
                            /* UPDATED SELECTION & RESIZE STYLES */
                            .selected { 
                                outline: 2px solid #ff00cc !important; 
                                box-shadow: 0 0 15px rgba(255, 0, 204, 0.5); 
                                z-index: 1000;
                                /* Disable native interaction to allow manual resize */
                                user-select: none;
                            }
                            
                            /* Visual Resize Handle Indicator */
                            .selected::after {
                                content: "";
                                position: absolute;
                                bottom: 0;
                                right: 0;
                                width: 20px;
                                height: 20px;
                                background: linear-gradient(135deg, transparent 50%, #ff00cc 50%);
                                cursor: nwse-resize;
                                z-index: 1001;
                                pointer-events: none; /* Let JS handle events */
                            }
                            /* Handle img/input where pseudo-elements don't work */
                            img.selected, video.selected, iframe.selected, input.selected {
                                cursor: nwse-resize; /* Cursor hint for whole element bottom-right */
                            }

                            .hover-highlight {
                                outline: 2px dotted #00f0ff !important;
                                z-index: 999;
                            }
                            @keyframes pulse { 0% { box-shadow: 0 0 5px #ff00cc; } 50% { box-shadow: 0 0 20px #ff00cc; } 100% { box-shadow: 0 0 5px #ff00cc; } }
                        </style>
                        <style id="global-theme-style"></style>
                        <style id="custom-styles"></style>
                        <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"><\/script>
                        <link href="https://fonts.googleapis.com/css2?family=VT323&family=Inter:wght@400;700&family=Comic+Neue:wght@700&display=swap" rel="stylesheet">
                    </head>
                    <body>
                        <h1 class="canvas-el">COAIEXIST</h1>
                        <p class="canvas-el">Welcome to the digital frontier.</p>
                    </html>
                `);
            }
            iframeDoc.close();
            
            // Reset Logic
            const page = getCurrentPage();
            if (resetHistory) {
                page.history = [];
                page.historyIndex = -1;
                page.content = iframeDoc.documentElement.outerHTML;
                window.updateUndoButtons();
            }

            // Sync history to current page state
            if (page.history.length === 0) {
                setTimeout(() => { 
                    window.ensureAnimationStyles(); 
                    setupIframeInteractions(); 
                    window.saveState(); 
                }, 100);
            } else {
                // Just bind interactions, history is already there
                setTimeout(() => { 
                    window.ensureAnimationStyles(); 
                    setupIframeInteractions(); 
                }, 100);
            }
            
            if(iframeDoc.body) {
                 iframeDoc.body.addEventListener('blur', () => window.saveState(), true);
                 // Bind global keys to iframe doc
                 iframeDoc.addEventListener('keydown', window.handleGlobalKeys);

                 // Mutation Observer to auto-layerize dynamically added elements (like from JS navbars)
                 const observer = new MutationObserver((mutations) => {
                    let hasNewElements = false;
                    mutations.forEach((mutation) => {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) { // Element
                                if(node.classList.contains('canvas-el')) return;
                                // Basic check if it's relevant
                                const tagName = node.tagName;
                                if(['DIV','NAV','A','BUTTON','UL','LI','HEADER','FOOTER'].includes(tagName)) {
                                     window.processLayerization(node);
                                     hasNewElements = true;
                                }
                            }
                        });
                    });
                    if(hasNewElements) {
                        // Debounced layer render if needed, or just let it be
                        // We don't want to re-render layers panel too often
                    }
                 });
                 observer.observe(iframeDoc.body, { childList: true, subtree: true });
            }
        }
        
        window.exportHTML = () => {
            const doc = document.getElementById('canvas-frame').contentWindow.document;
            if (!doc) return;
            const html = `<!DOCTYPE html>\n${window.getCleanHTML(doc)}`;
            const blob = new Blob([html], {type: 'text/html'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = window.pages[window.activePageIndex].name || 'coaiexist-page.html';
            a.click();
            URL.revokeObjectURL(url);
            window.playSound('success');
        };

        window.getCanvasDoc = () => iframeDoc;
        
        window.getCleanHTML = (doc) => {
             // Clone root to avoid messing up live canvas
             const clone = doc.documentElement.cloneNode(true);
             // Remove internal classes/styles
             const els = clone.querySelectorAll('.canvas-el, .selected, .hover-highlight');
             els.forEach(el => {
                 el.classList.remove('canvas-el', 'selected', 'hover-highlight');
                 el.removeAttribute('contenteditable');
                 el.style.cursor = '';
                 el.style.outline = '';
                 el.style.zIndex = '';
                 if(el.getAttribute('class') === '') el.removeAttribute('class');
                 if(el.getAttribute('style') === '') el.removeAttribute('style');
             });
             // Remove editor-specific scripts if any
             return clone.outerHTML;
        };
        
        window.ensureAnimationStyles = () => {
            if(!iframeDoc) return;
            let style = iframeDoc.getElementById('coai-animations');
            if(!style) {
                style = iframeDoc.createElement('style');
                style.id = 'coai-animations';
                style.textContent = `
                    @keyframes anim-fadeIn { from { opacity:0; } to { opacity:1; } }
                    @keyframes anim-slideUp { from { transform:translateY(50px); opacity:0; } to { transform:translateY(0); opacity:1; } }
                    @keyframes anim-zoomIn { from { transform:scale(0); opacity:0; } to { transform:scale(1); opacity:1; } }
                    @keyframes anim-bounce { 0%, 20%, 50%, 80%, 100% {transform: translateY(0);} 40% {transform: translateY(-30px);} 60% {transform: translateY(-15px);} }
                    @keyframes anim-pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
                    @keyframes anim-shake { 0% { transform: translate(1px, 1px) rotate(0deg); } 10% { transform: translate(-1px, -2px) rotate(-1deg); } 20% { transform: translate(-3px, 0px) rotate(1deg); } 30% { transform: translate(3px, 2px) rotate(0deg); } 40% { transform: translate(1px, -1px) rotate(1deg); } 50% { transform: translate(-1px, 2px) rotate(-1deg); } 60% { transform: translate(-3px, 1px) rotate(0deg); } 70% { transform: translate(3px, 1px) rotate(-1deg); } 80% { transform: translate(-1px, -1px) rotate(1deg); } 90% { transform: translate(1px, 2px) rotate(0deg); } 100% { transform: translate(1px, -2px) rotate(-1deg); } }
                    @keyframes anim-glow { 0% { box-shadow: 0 0 5px #fff; } 50% { box-shadow: 0 0 20px #ff00cc; } 100% { box-shadow: 0 0 5px #fff; } }
                    .anim-fadeIn { animation: anim-fadeIn 0.8s ease forwards; }
                    .anim-slideUp { animation: anim-slideUp 0.8s ease forwards; }
                    .anim-zoomIn { animation: anim-zoomIn 0.5s ease forwards; }
                    .anim-bounce { animation: anim-bounce 2s infinite; }
                    .hover-pulse:hover { animation: anim-pulse 1s infinite; }
                    .hover-shake:hover { animation: anim-shake 0.5s; }
                    .hover-glow:hover { animation: anim-glow 1.5s infinite; }
                    .hover-scale:hover { transform: scale(1.1); transition: transform 0.3s; }
                `;
                iframeDoc.head.appendChild(style);
            }
        };
        
        window.addElementHTML = (html) => {
            // Determine container: selected element (if container) or body
            let container = iframeDoc.body;
            if (window.selectedEl && window.selectedEl !== iframeDoc.body) {
                // If selected element is a container type, append to it
                if (['DIV','SECTION','ARTICLE','ASIDE','NAV','HEADER','FOOTER','MAIN','BUTTON','LI','TD'].includes(window.selectedEl.tagName)) {
                    container = window.selectedEl;
                }
            }

            const div = document.createElement('div');
            div.innerHTML = html;
            window.processLayerization(div); 
            
            const nodes = Array.from(div.childNodes);
            let contentAdded = false;

            nodes.forEach(child => {
                // TYPE 1: ELEMENT
                if (child.nodeType === 1) { 
                     // IMPORTANT: Handle Scripts separately to ensure execution
                     if (child.tagName === 'SCRIPT') {
                         const newScript = iframeDoc.createElement('script');
                         Array.from(child.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                         newScript.textContent = child.textContent;
                         container.appendChild(newScript);
                         contentAdded = true;
                     } 
                     else if (child.tagName === 'STYLE' || child.tagName === 'LINK') {
                         iframeDoc.head.appendChild(child.cloneNode(true));
                         contentAdded = true;
                     }
                     else {
                         container.appendChild(child);
                         selectElement(child);
                         contentAdded = true;
                         
                         // Check for nested scripts
                         child.querySelectorAll('script').forEach(oldScript => {
                             const newScript = iframeDoc.createElement('script');
                             Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                             newScript.textContent = oldScript.textContent;
                             oldScript.parentNode.replaceChild(newScript, oldScript);
                         });
                     }
                } 
                // TYPE 3: TEXT (Non-empty)
                else if (child.nodeType === 3 && child.textContent.trim().length > 0) {
                     const span = iframeDoc.createElement('span');
                     span.className = 'canvas-el';
                     span.style.display = 'inline-block'; // make it clickable/visible
                     span.textContent = child.textContent;
                     container.appendChild(span);
                     selectElement(span);
                     contentAdded = true;
                }
            });
            
            if(contentAdded) {
                window.saveState();
                window.playSound('success');
            }
        };

        window.applyCustomCSS = () => {
            if(!iframeDoc) return;
            const code = document.getElementById('css-editor').value;
            const mode = document.querySelector('input[name="css-mode"]:checked').value;
            const btn = document.getElementById('apply-css-btn');

            const injectCSS = (css) => {
                let styleTag = iframeDoc.getElementById('custom-styles');
                if(!styleTag) {
                    styleTag = iframeDoc.createElement('style');
                    styleTag.id = 'custom-styles';
                    iframeDoc.head.appendChild(styleTag);
                }
                styleTag.textContent = css;
                window.saveState();
                window.closeModal('css-modal');
                window.playSound('success');
            };

            if (mode === 'scss') {
                const originalText = btn.innerText;
                btn.innerText = "Compiling...";
                if(window.Sass) {
                    Sass.compile(code, (result) => {
                        btn.innerText = originalText;
                        if (result.status === 0) {
                            injectCSS(result.text);
                        } else {
                            alert("SCSS Error:\n" + result.formatted);
                        }
                    });
                } else {
                    alert("Sass compiler not loaded yet.");
                    btn.innerText = originalText;
                }
            } else {
                injectCSS(code);
            }
        };
        
        window.addGoogleFont = () => {
            const fontName = document.getElementById('gf-name').value.trim();
            if(!fontName) return;
            
            const link = iframeDoc.createElement('link');
            link.rel = 'stylesheet';
            link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}&display=swap`;
            iframeDoc.head.appendChild(link);
            
            const options = `<option value="'${fontName}', sans-serif">${fontName}</option>`;
            document.getElementById('gs-body-font').insertAdjacentHTML('afterbegin', options);
            document.getElementById('gs-h-font').insertAdjacentHTML('afterbegin', options);
            
            alert(`Font '${fontName}' imported! It is now available in the theme dropdowns.`);
        };

        window.updateGlobalTheme = () => {
            if (!iframeDoc) return;
            let themeTag = iframeDoc.getElementById('global-theme-style');
            if (!themeTag) {
                themeTag = iframeDoc.createElement('style');
                themeTag.id = 'global-theme-style';
                iframeDoc.head.appendChild(themeTag);
            }
            const bodyBg = document.getElementById('gs-body-bg').value;
            const bodyText = document.getElementById('gs-body-text').value;
            const bodyFont = document.getElementById('gs-body-font').value;
            const hColor = document.getElementById('gs-h-color').value;
            const hFont = document.getElementById('gs-h-font').value;
            const hTrans = document.getElementById('gs-h-transform').value;
            const btnBg = document.getElementById('gs-btn-bg').value;
            const btnText = document.getElementById('gs-btn-text').value;
            const btnRadius = document.getElementById('gs-btn-radius').value;
            const linkColor = document.getElementById('gs-link-color').value;
            const linkDec = document.getElementById('gs-link-dec').value;
            
            const css = `
                body { background-color: ${bodyBg} !important; color: ${bodyText} !important; font-family: ${bodyFont} !important; }
                h1, h2, h3, h4, h5, h6 { color: ${hColor} !important; font-family: ${hFont === 'inherit' ? bodyFont : hFont} !important; text-transform: ${hTrans} !important; }
                button, .btn-cta { border-radius: ${btnRadius}px; background-color: ${btnBg}; color: ${btnText}; }
                a { color: ${linkColor}; text-decoration: ${linkDec}; }
            `;
            themeTag.textContent = css;
            window.saveState();
        };

        window.applyCustomJS = () => {
            if(!iframeDoc) return;
            const code = document.getElementById('js-editor').value;
            const script = iframeDoc.createElement('script');
            script.textContent = code;
            iframeDoc.body.appendChild(script);
            window.saveState();
            window.closeModal('js-modal');
            window.playSound('success');
        };
        
        window.openSettingsModal = () => {
            if(!iframeDoc) return;
            const titleTag = iframeDoc.querySelector('title');
            document.getElementById('page-title-input').value = titleTag ? titleTag.innerText : '';
            const descTag = iframeDoc.querySelector('meta[name="description"]');
            document.getElementById('page-desc-input').value = descTag ? descTag.getAttribute('content') : '';
            const keyTag = iframeDoc.querySelector('meta[name="keywords"]');
            document.getElementById('page-keywords-input').value = keyTag ? keyTag.getAttribute('content') : '';
            const favTag = iframeDoc.querySelector('link[rel="icon"]') || iframeDoc.querySelector('link[rel="shortcut icon"]');
            document.getElementById('page-favicon-input').value = favTag ? favTag.href : '';
            window.openModal('settings-modal');
        };

        window.savePageSettings = () => {
            if(!iframeDoc) return;
            const title = document.getElementById('page-title-input').value;
            const desc = document.getElementById('page-desc-input').value;
            const keywords = document.getElementById('page-keywords-input').value;
            const favicon = document.getElementById('page-favicon-input').value;
            
            let titleTag = iframeDoc.querySelector('title');
            if(!titleTag) { titleTag = iframeDoc.createElement('title'); iframeDoc.head.appendChild(titleTag); }
            titleTag.innerText = title;
            
            let descTag = iframeDoc.querySelector('meta[name="description"]');
            if(!descTag && desc) { descTag = iframeDoc.createElement('meta'); descTag.name = "description"; iframeDoc.head.appendChild(descTag); }
            if(descTag) descTag.setAttribute('content', desc);
            
            let keyTag = iframeDoc.querySelector('meta[name="keywords"]');
            if(!keyTag && keywords) { keyTag = iframeDoc.createElement('meta'); keyTag.name = "keywords"; iframeDoc.head.appendChild(keyTag); }
            if(keyTag) keyTag.setAttribute('content', keywords);

            if(favicon) {
                let favTag = iframeDoc.querySelector('link[rel="icon"]') || iframeDoc.querySelector('link[rel="shortcut icon"]');
                if(!favTag) { favTag = iframeDoc.createElement('link'); favTag.rel = 'icon'; iframeDoc.head.appendChild(favTag); }
                favTag.href = favicon;
                favTag.type = 'image/x-icon';
            }
            
            window.pages[window.activePageIndex].name = title || window.pages[window.activePageIndex].name;
            window.renderPageTabs(); 
            
            window.saveState();
            window.closeModal('settings-modal');
            window.playSound('success');
            window.updateStatus('Settings Saved');
        };

        // --- CSS LAB FUNCTIONS ---
        window.switchCssTab = (tab) => {
            document.querySelectorAll('.css-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll(`.css-tab-btn[onclick*="${tab}"]`).forEach(b => b.classList.add('active'));
            document.getElementById('css-tab-presets').style.display = tab === 'presets' ? 'grid' : 'none';
            document.getElementById('css-tab-filters').style.display = tab === 'filters' ? 'grid' : 'none';
            document.getElementById('css-tab-scroll').style.display = tab === 'scroll' ? 'grid' : 'none';
            document.getElementById('css-tab-anim').style.display = tab === 'anim' ? 'grid' : 'none';
        };

        window.insertCssAtCursor = (css) => {
            const editor = document.getElementById('css-editor');
            if(!editor) return;
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            const text = editor.value;
            editor.value = text.substring(0, start) + css + text.substring(end);
            editor.focus();
        };
        
        window.applyCssPreset = (css) => {
            if(window.selectedEl) {
                const rules = css.split(';');
                rules.forEach(rule => {
                    const [prop, val] = rule.split(':');
                    if(prop && val) {
                        window.selectedEl.style[prop.trim()] = val.trim();
                    }
                });
                window.saveState();
                window.renderProperties();
                window.playSound('pop');
            } else {
                window.insertCssAtCursor(css);
            }
        };

        window.insertGradient = () => {
            const c1 = document.getElementById('grad-c1').value;
            const c2 = document.getElementById('grad-c2').value;
            const ang = document.getElementById('grad-angle').value;
            const css = `background: linear-gradient(${ang}deg, ${c1}, ${c2});\n`;
            window.applyCssPreset(css);
        };

        window.insertShadow = () => {
            const c = document.getElementById('shadow-c').value;
            const b = document.getElementById('shadow-blur').value;
            const css = `box-shadow: 0 10px ${b}px ${c};\n`;
            window.applyCssPreset(css);
        };
        
        // --- JS SCRIPT ENGINE UPGRADES ---
        window.switchJsTab = (tab) => {
             document.querySelectorAll('.css-tab-btn').forEach(b => b.classList.remove('active'));
             document.querySelectorAll(`.css-tab-btn[onclick*="${tab}"]`).forEach(b => b.classList.add('active'));
             document.getElementById('js-tab-effects').style.display = tab === 'effects' ? 'grid' : 'none';
             document.getElementById('js-tab-cursors').style.display = tab === 'cursors' ? 'grid' : 'none';
             document.getElementById('js-tab-utils').style.display = tab === 'utils' ? 'grid' : 'none';
        };


        // --- CORE APPLICATION LOGIC (Controller) ---
        // Manages selection, property rendering, and toolbars

        window.selectElement = (el) => {
            if(!el) return;
            
            // Deselect previous
            if(window.selectedEl) {
                window.selectedEl.classList.remove('selected');
                window.selectedEl.removeAttribute('contentEditable'); // Stop editing previous
            }
            
            window.selectedEl = el;
            el.classList.add('selected');
            
            // Update UI
            window.renderProperties();
            window.renderLayers();
            
            // Switch sidebar tab
            const sidebar = document.getElementById('sidebar');
            if(sidebar) sidebar.classList.add('active');
            
            // Status
            window.updateStatus(`Selected: ${el.tagName.toLowerCase()}${el.id ? '#'+el.id : ''}`);
        };

        window.deselect = () => {
            if(window.selectedEl) {
                window.selectedEl.classList.remove('selected');
                window.selectedEl.removeAttribute('contentEditable');
                window.selectedEl = null;
            }
            const propsPanel = document.getElementById('panel-props');
            if(propsPanel) propsPanel.innerHTML = `<div style="text-align: center; margin-top: 50%; color: var(--text-dim); font-size: 12px;">Select an object to<br>hack its matrix.</div>`;
            const textPanel = document.getElementById('panel-text');
            if(textPanel) textPanel.style.display = 'none';
            if(propsPanel) propsPanel.style.display = 'block';
            
            // Reset tabs
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            const tabProps = document.getElementById('tab-props');
            if(tabProps) tabProps.classList.add('active');
        };

        window.renderLayers = () => {
            const list = document.getElementById('panel-layers');
            if(!list || !iframeDoc) return;
            
            list.innerHTML = '';
            
            // Filter elements to ignore scripts/styles/hidden
            const validChildren = Array.from(iframeDoc.body.children).filter(el => 
                el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE' && !el.classList.contains('hidden-layer')
            );

            validChildren.forEach((el, index) => {
                 const div = document.createElement('div');
                 div.className = 'layer-item';
                 div.style.padding = '8px 5px';
                 div.style.borderBottom = '1px solid var(--glass-border)';
                 div.style.display = 'flex';
                 div.style.alignItems = 'center';
                 div.style.gap = '5px';
                 div.style.fontSize = '12px';
                 div.style.color = 'var(--text-dim)';
                 div.style.cursor = 'grab';

                 if(window.selectedEl === el) {
                     div.style.background = 'rgba(255, 0, 204, 0.15)';
                     div.style.borderLeft = '3px solid var(--magenta)';
                     div.style.color = 'var(--text-main)';
                 }
                 
                 // Icon based on tag
                 let icon = '⬜';
                 if(el.tagName === 'IMG') icon = '🖼️';
                 else if(el.tagName === 'H1' || el.tagName === 'H2') icon = 'T';
                 else if(el.tagName === 'P') icon = '¶';
                 else if(el.tagName === 'BUTTON') icon = 'bo';
                 
                 div.innerHTML = `<span style="opacity:0.7;">${icon}</span> <span>${el.tagName.toLowerCase()}${el.id ? '#'+el.id : ''}</span>`;
                 
                 // DRAG AND DROP REORDERING
                 div.draggable = true;
                 
                 div.ondragstart = (e) => {
                     e.dataTransfer.setData('layer-index', index);
                     e.dataTransfer.effectAllowed = 'move';
                     div.classList.add('dragging');
                 };
                 
                 div.ondragend = () => {
                     div.classList.remove('dragging');
                     document.querySelectorAll('.layer-item').forEach(l => l.classList.remove('drag-over'));
                 };
                 
                 div.ondragover = (e) => {
                     e.preventDefault(); // Allow drop
                     div.classList.add('drag-over');
                 };
                 
                 div.ondragleave = () => {
                     div.classList.remove('drag-over');
                 };
                 
                 div.ondrop = (e) => {
                     e.preventDefault();
                     div.classList.remove('drag-over');
                     const fromIndex = parseInt(e.dataTransfer.getData('layer-index'));
                     const toIndex = index;
                     
                     if (fromIndex !== toIndex && validChildren[fromIndex] && validChildren[toIndex]) {
                         const movedEl = validChildren[fromIndex];
                         const targetEl = validChildren[toIndex];
                         const parent = movedEl.parentNode;
                         
                         if (toIndex > fromIndex) {
                             // Moving down
                             parent.insertBefore(movedEl, targetEl.nextSibling);
                         } else {
                             // Moving up
                             parent.insertBefore(movedEl, targetEl);
                         }
                         window.saveState();
                         window.renderLayers();
                     }
                 };

                 div.onclick = () => window.selectElement(el);
                 list.appendChild(div);
             });
        };

        window.updateProp = (prop, val) => {
            if(!window.selectedEl) return;
            
            // Background Image Fix
            if(prop === 'backgroundImage' || prop === 'style.backgroundImage') {
                if(val && !val.startsWith('url') && !val.startsWith('none')) {
                    val = `url('${val}')`;
                }
                window.selectedEl.style.backgroundImage = val;
                // Default styles to make bg visible
                if(val && val !== 'none') {
                    window.selectedEl.style.backgroundSize = "cover";
                    window.selectedEl.style.backgroundPosition = "center";
                    window.selectedEl.style.backgroundRepeat = "no-repeat";
                }
            }
            // Media Source Fix
            else if(prop === 'src') {
                window.selectedEl.setAttribute('src', val);
                if(window.selectedEl.tagName === 'AUDIO' || window.selectedEl.tagName === 'VIDEO') {
                     window.selectedEl.load(); // Critical for updating media
                }
                if(window.selectedEl.tagName === 'IMG') {
                    // Force refresh check
                    const old = val; window.selectedEl.src = ''; window.selectedEl.src = old;
                }
            } 
            // Standard Props
            else if (prop.startsWith('style.')) {
                window.selectedEl.style[prop.split('.')[1]] = val;
            } else {
                window.selectedEl[prop] = val;
                window.selectedEl.setAttribute(prop, val);
            }
            window.saveState();
        };

        // --- NEW RENDER PROPERTIES ---
        window.renderProperties = () => {
            const el = window.selectedEl;
            const panel = document.getElementById('panel-props');
            if(!el || !panel) return;

            const s = el.style;
            const cs = window.getComputedStyle(el);

            // Helper for standard inputs
            const makeInput = (label, prop, val, type='text', isStyle=false, extra='') => {
                const p = isStyle ? `style.${prop}` : prop;
                return `
                <div class="control-row">
                    <div class="label-row"><span class="prop-label">${label}</span>${extra}</div>
                    <input type="${type}" value="${val || ''}" onchange="window.updateProp('${p}', this.value)">
                </div>`;
            };

            // === NUMBER-FREE PRESET SYSTEM ===
            // Human-readable presets instead of numeric inputs
            const PRESETS = {
                // Dimensions (width, height, minWidth, maxWidth)
                dimensions: [
                    { label: 'Auto', value: 'auto' },
                    { label: 'Tiny', value: '50px' },
                    { label: 'Small', value: '100px' },
                    { label: 'Medium', value: '200px' },
                    { label: 'Large', value: '400px' },
                    { label: 'XL', value: '600px' },
                    { label: 'Full', value: '100%' },
                    { label: 'Half', value: '50%' },
                    { label: 'Third', value: '33%' },
                ],
                // Spacing (padding, margin, top, left, right, bottom)
                spacing: [
                    { label: 'None', value: '0' },
                    { label: 'Tight', value: '5px' },
                    { label: 'Cozy', value: '10px' },
                    { label: 'Roomy', value: '20px' },
                    { label: 'Spacious', value: '40px' },
                    { label: 'Huge', value: '80px' },
                    { label: 'Auto', value: 'auto' },
                ],
                // Font size
                fontSize: [
                    { label: 'Tiny', value: '10px' },
                    { label: 'Small', value: '14px' },
                    { label: 'Normal', value: '16px' },
                    { label: 'Medium', value: '20px' },
                    { label: 'Large', value: '28px' },
                    { label: 'XL', value: '36px' },
                    { label: 'XXL', value: '48px' },
                    { label: 'Massive', value: '72px' },
                ],
                // Border width
                borderWidth: [
                    { label: 'None', value: '0' },
                    { label: 'Hairline', value: '1px' },
                    { label: 'Thin', value: '2px' },
                    { label: 'Medium', value: '3px' },
                    { label: 'Thick', value: '5px' },
                    { label: 'Chunky', value: '10px' },
                ],
                // Border radius
                borderRadius: [
                    { label: 'Sharp', value: '0' },
                    { label: 'Subtle', value: '4px' },
                    { label: 'Rounded', value: '8px' },
                    { label: 'Pill', value: '16px' },
                    { label: 'More Round', value: '24px' },
                    { label: 'Circle', value: '50%' },
                ],
                // Opacity
                opacity: [
                    { label: 'Invisible', value: '0' },
                    { label: 'Ghost', value: '0.25' },
                    { label: 'Faded', value: '0.5' },
                    { label: 'Soft', value: '0.75' },
                    { label: 'Solid', value: '1' },
                ],
                // Z-index
                zIndex: [
                    { label: 'Back', value: '-1' },
                    { label: 'Normal', value: '0' },
                    { label: 'Above', value: '10' },
                    { label: 'Front', value: '100' },
                    { label: 'Top', value: '1000' },
                ],
                // Line height
                lineHeight: [
                    { label: 'Tight', value: '1' },
                    { label: 'Normal', value: '1.5' },
                    { label: 'Relaxed', value: '1.75' },
                    { label: 'Loose', value: '2' },
                    { label: 'Double', value: '2.5' },
                ],
                // Letter spacing
                letterSpacing: [
                    { label: 'Tight', value: '-1px' },
                    { label: 'Normal', value: '0' },
                    { label: 'Relaxed', value: '1px' },
                    { label: 'Loose', value: '2px' },
                    { label: 'Wide', value: '4px' },
                ],
                // Text decoration thickness
                textDecorationThickness: [
                    { label: 'Auto', value: 'auto' },
                    { label: 'Thin', value: '1px' },
                    { label: 'Medium', value: '2px' },
                    { label: 'Thick', value: '4px' },
                ],
            };

            // Map properties to their preset categories
            const PROP_TO_PRESETS = {
                width: 'dimensions', height: 'dimensions', minWidth: 'dimensions', maxWidth: 'dimensions',
                top: 'spacing', left: 'spacing', right: 'spacing', bottom: 'spacing',
                margin: 'spacing', padding: 'spacing',
                fontSize: 'fontSize',
                borderWidth: 'borderWidth',
                borderRadius: 'borderRadius',
                opacity: 'opacity',
                zIndex: 'zIndex',
                lineHeight: 'lineHeight',
                letterSpacing: 'letterSpacing',
                textDecorationThickness: 'textDecorationThickness',
            };

            // Number-free dropdown with human-readable presets
            const makeNumInput = (label, prop, val, isStyle=false) => {
                const p = isStyle ? `style.${prop}` : prop;
                const presetKey = PROP_TO_PRESETS[prop] || 'spacing';
                const presets = PRESETS[presetKey] || PRESETS.spacing;
                
                // Find matching preset or use current value
                const currentVal = String(val || '').trim();
                let matchedPreset = presets.find(pr => pr.value === currentVal);
                
                // Build options - presets first, then current value if not in presets
                let options = presets.map(pr => 
                    `<option value="${pr.value}" ${pr.value === currentVal ? 'selected' : ''}>${pr.label}</option>`
                ).join('');
                
                // Add current value as custom option if not in presets
                if (currentVal && !matchedPreset && currentVal !== 'auto' && currentVal !== 'normal' && currentVal !== '') {
                    options += `<option value="${currentVal}" selected>Current: ${currentVal}</option>`;
                }

                return `
                <div class="control-row preset-dropdown">
                    <span class="prop-label">${label}</span>
                    <select class="preset-select" onchange="window.updateProp('${p}', this.value)">
                        ${options}
                    </select>
                </div>`;
            };

            // Helper for Selects
            const makeSelect = (label, prop, options, current, isStyle=true) => {
                const p = isStyle ? `style.${prop}` : prop;
                const opts = options.map(o => `<option value="${o}" ${current===o?'selected':''}>${o}</option>`).join('');
                return `
                <div class="control-row">
                    <span class="prop-label">${label}</span>
                    <select onchange="window.updateProp('${p}', this.value)">${opts}</select>
                </div>`;
            };

            let html = '';

            // 0. Quick Styles (Style Chips integrated)
            if (window.buildQuickStylesHTML) {
                html += window.buildQuickStylesHTML();
            }

            // 1. D & Classes
            let srcInput = '';
            if(el.tagName === 'IMG' || el.tagName === 'VIDEO' || el.tagName === 'AUDIO' || el.tagName === 'IFRAME') {
                 srcInput = makeInput('Source Link', 'src', el.getAttribute('src'));
            } else if(el.tagName === 'A') {
                 srcInput = makeInput('Source Link', 'href', el.getAttribute('href'));
            }

            html += `<div class="prop-group" open><summary>D & Classes</summary><div class="prop-body">
                ${makeInput('ID', 'id', el.id)}
                ${makeInput('Classes', 'className', el.className)}
                ${srcInput}
            </div></div>`;

            // 2. Layout Engine
            html += `<div class="prop-group" open><summary>Layout Engine</summary><div class="prop-body">
                ${makeSelect('Display', 'display', ['block', 'inline-block', 'flex', 'grid', 'none', 'inline'], s.display || cs.display)}
                ${makeSelect('Position', 'position', ['static', 'relative', 'absolute', 'fixed', 'sticky'], s.position || cs.position)}
                ${makeNumInput('Z-Index', 'zIndex', s.zIndex || '0', true)}
                <div class="control-grid-2">
                    ${makeSelect('Float', 'float', ['none', 'left', 'right'], s.float || cs.float)}
                    ${makeSelect('Overflow', 'overflow', ['visible', 'hidden', 'scroll', 'auto'], s.overflow || cs.overflow)}
                </div>
                ${makeSelect('Box Sizing', 'boxSizing', ['content-box', 'border-box'], s.boxSizing || cs.boxSizing)}
            </div></div>`;

            // 3. Dimensions & Spacing
            html += `<div class="prop-group" open><summary>Dimensions & Spacing</summary><div class="prop-body">
                <div class="control-grid-2">
                    ${makeNumInput('Width', 'width', s.width, true)}
                    ${makeNumInput('Height', 'height', s.height, true)}
                </div>
                <div class="control-grid-2">
                    ${makeNumInput('Top', 'top', s.top, true)}
                    ${makeNumInput('Left', 'left', s.left, true)}
                    ${makeNumInput('Right', 'right', s.right, true)}
                    ${makeNumInput('Bottom', 'bottom', s.bottom, true)}
                </div>
                ${makeNumInput('Margin', 'margin', s.margin, true)}
                ${makeNumInput('Padding', 'padding', s.padding, true)}
                <div class="control-grid-2">
                    ${makeNumInput('Min-W', 'minWidth', s.minWidth, true)}
                    ${makeNumInput('Max-W', 'maxWidth', s.maxWidth, true)}
                </div>
            </div></div>`;

            // 4. Sassy Text & Deco
            html += `<div class="prop-group"><summary>Sassy Text & Deco</summary><div class="prop-body">
                ${makeInput('Content', 'innerText', el.innerText)}
                ${makeInput('Title', 'title', el.title)}
                ${makeInput('Font Family', 'fontFamily', s.fontFamily, 'text', true)}
                <div class="control-grid-2">
                    ${makeNumInput('Size', 'fontSize', s.fontSize, true)}
                    ${makeInput('Color', 'color', rgbToHex(cs.color), 'color', true)}
                </div>
                <div class="control-grid-2">
                     ${makeSelect('Align', 'textAlign', ['left', 'center', 'right', 'justify'], s.textAlign || cs.textAlign)}
                     ${makeSelect('Weight', 'fontWeight', ['400', '700', '900', 'normal', 'bold'], s.fontWeight || cs.fontWeight)}
                </div>
                <div class="control-grid-2">
                    ${makeNumInput('Line Height', 'lineHeight', s.lineHeight, true)}
                    ${makeNumInput('Letter Spacing', 'letterSpacing', s.letterSpacing, true)}
                </div>
                <div style="margin-top:10px; border-top:1px solid #333; padding-top:5px;">
                     ${makeSelect('Deco Line', 'textDecorationLine', ['none', 'underline', 'overline', 'line-through'], s.textDecorationLine || cs.textDecorationLine)}
                     <div class="control-grid-2">
                         ${makeSelect('Deco Style', 'textDecorationStyle', ['solid', 'double', 'dotted', 'dashed', 'wavy'], s.textDecorationStyle || cs.textDecorationStyle)}
                         ${makeInput('Deco Color', 'textDecorationColor', rgbToHex(cs.textDecorationColor), 'color', true)}
                     </div>
                     ${makeNumInput('Deco Thick', 'textDecorationThickness', s.textDecorationThickness, true)}
                </div>
            </div></div>`;

            // 5. Backgrounds
            const bgPicker = `<button class="btn" style="padding:2px 6px; font-size:10px;" onclick="window.assetPickMode='bg'; window.openModal('asset-modal');">📂</button>`;
            html += `<div class="prop-group"><summary>Backgrounds</summary><div class="prop-body">
                ${makeInput('Color', 'backgroundColor', rgbToHex(cs.backgroundColor), 'color', true)}
                ${makeInput('Image URL', 'backgroundImage', s.backgroundImage, 'text', true, bgPicker)}
                <div class="control-grid-2">
                    ${makeInput('Size', 'backgroundSize', s.backgroundSize, 'text', true)}
                    ${makeSelect('Repeat', 'backgroundRepeat', ['repeat', 'no-repeat', 'repeat-x', 'repeat-y'], s.backgroundRepeat || cs.backgroundRepeat)}
                </div>
                ${makeInput('Position', 'backgroundPosition', s.backgroundPosition, 'text', true)}
            </div></div>`;

            // 6. Borders & Effects
            html += `<div class="prop-group"><summary>Borders & Effects</summary><div class="prop-body">
                <div class="control-grid-3">
                    ${makeNumInput('Border Width', 'borderWidth', s.borderWidth, true)}
                    ${makeSelect('Border Style', 'borderStyle', ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'], s.borderStyle || cs.borderStyle)}
                    ${makeInput('Border Color', 'borderColor', rgbToHex(cs.borderColor), 'color', true)}
                </div>
                ${makeNumInput('Radius', 'borderRadius', s.borderRadius, true)}
                ${makeInput('Shadow', 'boxShadow', s.boxShadow, 'text', true)}
                <div class="control-grid-2">
                    ${makeNumInput('Opacity', 'opacity', s.opacity, true)}
                    ${makeSelect('Blend Mode', 'mixBlendMode', ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'], s.mixBlendMode || cs.mixBlendMode)}
                </div>
            </div></div>`;

            // 7. Actions Bar
            html += `<div class="action-grid" style="margin-top:20px;">
                <button class="act-btn" onclick="window.ctxAction('up')" title="Move Up">⬆️</button>
                <button class="act-btn" onclick="window.ctxAction('down')" title="Move Down">⬇️</button>
                <button class="act-btn" onclick="window.ctxAction('dup')" title="Duplicate">📑</button>
                <button class="act-btn del" onclick="window.ctxAction('del')" title="Delete">🗑️</button>
            </div>`;

            panel.innerHTML = html;
        };

        // ... (Rest of existing initialization code)
        // --- DRAG HELPER: PROCESS LAYERIZATION ---
        // Ensure elements are clickable/draggable
        // (Moved up for robust loading, check above)
        
        // --- GLOBAL KEYBOARD SHORTCUTS ---
        // (Moved up for robust loading, check above)

        // --- PREVIEW MODE ---
        window.togglePreview = () => {
             document.body.classList.toggle('preview-mode');
             if(document.body.classList.contains('preview-mode')) {
                  window.deselect();
             }
        };

        // --- INITIALIZATION ---
        // FIX: Execute immediately if DOM is already loaded
        const initApp = () => {
             console.log('🚀 Initializing COAIEXIST Studio...');

             // 1. Init Sound (Safe)
             try { if(typeof Tone !== 'undefined') window.initializeSounds = () => {}; } catch(e) {}

             // 2. Init Canvas with default
             try {
                // Initialize the first page (already in array) instead of creating a new one
                window.switchPage(0); 
                renderPageTabs();
             } catch(e) { console.error('Init Canvas Failed:', e); }

             // 3. Render Libraries
             try {
                if(window.renderCssLibrary) window.renderCssLibrary();
                if(window.renderJsLibrary) window.renderJsLibrary();
             } catch(e) { console.error('Lib Render Failed:', e); }

             // 4. Tab Switching
             const bindTab = (id, targetId, cb) => {
                 const el = document.getElementById(id);
                 if(el) el.onclick = () => {
                     document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                     el.classList.add('active');
                     document.querySelectorAll('.sidebar-content').forEach(c => c.style.display='none');
                     document.getElementById(targetId).style.display='block';
                     
                     // SPECIAL LOGIC FOR TEXT TAB
                     if (id === 'tab-text' && window.selectedEl) {
                         window.selectedEl.contentEditable = true;
                         window.selectedEl.focus();
                     }

                     if(cb) cb();
                 };
             };
             
             bindTab('tab-props', 'panel-props');
             bindTab('tab-text', 'panel-text');
             bindTab('tab-layers', 'panel-layers', () => window.renderLayers());

             // 5. TOOLBAR BUTTON LISTENERS (ROBUST BINDING)
             // Using simple direct binding to avoid event listener confusion
             const safeBind = (id, fn) => {
                 const el = document.getElementById(id);
                 if(el) {
                     el.onclick = (e) => {
                         e.preventDefault();
                         try { fn(e); } catch(err) { console.error('Btn Action Failed:', id, err); }
                     };
                 } else {
                     console.warn('Missing Button:', id);
                 }
             };

             try {
                 safeBind('new-btn', () => { if(confirm('Reset Page?')) window.initCanvas(null, true); });
                 safeBind('undo-btn', () => window.undo());
                 safeBind('redo-btn', () => window.redo());
                 safeBind('ai-gen-btn', () => window.openModal('ai-manifest-modal'));
                 safeBind('preview-btn', () => window.togglePreview());
                 safeBind('code-view-btn', () => window.openModal('source-modal')); 
                 safeBind('css-btn', () => window.openModal('css-modal'));
                 safeBind('global-styles-btn', () => window.openModal('global-styles-modal'));
                 safeBind('js-btn', () => window.openModal('js-modal'));
                 safeBind('asset-btn', () => window.openModal('asset-modal'));
                 safeBind('settings-btn', () => window.openSettingsModal());
                 safeBind('theme-toggle-btn', () => window.toggleTheme());
                 safeBind('export-btn', () => window.exportHTML());
                 safeBind('sound-toggle-btn', () => window.toggleSound());
                 
                 safeBind('grid-toggle-btn', (e) => {
                     e.target.classList.toggle('active');
                     const grid = document.getElementById('grid-overlay');
                     if(grid) grid.style.display = grid.style.display === 'block' ? 'none' : 'block';
                 });
                 safeBind('toggle-sidebar-btn', () => {
                     document.getElementById('sidebar').classList.toggle('active');
                 });

                 // Helper for source modal since name diff in HTML
                 window.openSourceModal = () => window.openModal('source-modal');

             } catch(e) {
                 console.error('CRITICAL: Button binding failed:', e);
                 window.updateStatus('⚠️ UI Error. Check Console.');
             }

             // 6. Viewport Controls
             safeBind('vp-mobile', () => { document.getElementById('canvas-frame').style.width = '375px'; });
             safeBind('vp-tablet', () => { document.getElementById('canvas-frame').style.width = '768px'; });
             safeBind('vp-desktop', () => { document.getElementById('canvas-frame').style.width = '1024px'; });
             safeBind('vp-full', () => { document.getElementById('canvas-frame').style.width = '100%'; });
             
             // 7. Global Key Listener
             document.addEventListener('keydown', window.handleGlobalKeys);

             // 8. INITIALIZE TOOLBOX (Fix for unresponsive left column)
             document.querySelectorAll('.tool-item').forEach(item => {
                // Drag Start
                item.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('type', item.dataset.type);
                    window.draggedLayer = item.dataset.type; // Fallback for iframe drop
                });
                
                // Click to Add (Immediate Action)
                item.addEventListener('click', () => {
                    const type = item.dataset.type;
                    const template = window.elementTemplates[type];
                    // Clean fallback if template missing
                    const html = template || `<div>${type}</div>`;
                    window.addElementHTML(html);
                });
             });
             
             console.log('✅ COAIEXIST Studio Ready.');
        };
        
        // Execute init immediately if DOM is already loaded, otherwise wait for DOMContentLoaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initApp);
        } else {
            // DOM is already ready, execute immediately
            initApp();
        }
