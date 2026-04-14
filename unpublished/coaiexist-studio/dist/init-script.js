        // GLOBAL ERROR HANDLER
        window.onerror = function(msg, url, line, col, error) {
            const status = document.getElementById('status-msg');
            if(status) status.innerText = `⚠️ Error: ${msg}`;
            console.error('Global Error:', msg, error);
            return false;
        };

        window.PAGE_SOURCE_HTML = window.PAGE_SOURCE_HTML || {};
        window.elementTemplates = window.elementTemplates || {};
        
        // Global Helper stub for external scripts
        window.openModal = (id) => {
             const m = document.getElementById(id);
             if(m) { 
                 m.classList.add('active'); 
                 if(window.playSound) window.playSound('pop'); 
             }
        };
        window.closeModal = (id) => {
            document.getElementById(id)?.classList.remove('active');
            // Reset modal state
            if(id === 'asset-modal') {
                 window.assetPickMode = null; // Reset pick mode on close
                 document.getElementById('asset-pick-select-btn').style.display = 'none';
            }
        };
        window.updateStatus = (msg) => { 
            const el = document.getElementById('status-msg'); 
            if(el) el.innerText = msg; 
        };
        // Sound and stamp placeholders to be overwritten by module
        window.playSound = () => {};
        window.showStamp = () => {};
        window.saveState = () => {}; // Will be overwritten
        window.draggedLayer = null;
        window.clipboardEl = null; // for copy/paste
        window.assetPickMode = null; // 'src' | 'bg' | null
        window.renderLayers = () => {}; // Stub for layer rendering
        window.currentSelectionRange = null; // Stores iframe text selection
        
        // --- HELPER FUNCTION: PROCESS LAYERIZATION ---
        // Ensure elements are clickable/draggable and properly initialized as 'canvas-el'
        window.processLayerization = (el) => {
            if(!el) return;
            if(el.nodeType !== 1) return; // Only process elements
            
            // Add editor class if not present
            if(!el.classList.contains('canvas-el')) {
                el.classList.add('canvas-el');
            }
            
            // Recursively process children
            Array.from(el.children).forEach(child => window.processLayerization(child));
        };

        // --- HELPER FUNCTION: HANDLE GLOBAL KEYS ---
        // Manages keyboard shortcuts for Undo, Redo, Copy, Paste, Delete
        window.handleGlobalKeys = (e) => {
            // Ignore keys if user is typing in an input or textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
            
            // CTRL/CMD Shortcuts
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') { e.preventDefault(); window.undo(); }
                if (e.key === 'y') { e.preventDefault(); window.redo(); }
                if (e.key === 'c') { if(window.ctxAction) window.ctxAction('copy'); }
                if (e.key === 'v') { if(window.ctxAction) window.ctxAction('paste'); }
                if (e.key === 'x') { if(window.ctxAction) window.ctxAction('cut'); }
                if (e.key === 'd') { e.preventDefault(); if(window.ctxAction) window.ctxAction('dup'); }
            }
            
            // Delete / Backspace Shortcuts
            if (e.key === 'Delete' || e.key === 'Backspace') {
                 if(window.selectedEl && !window.selectedEl.isContentEditable) {
                     if(window.ctxAction) window.ctxAction('del');
                 }
            }
        };
