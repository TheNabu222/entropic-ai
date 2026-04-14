

// ============================================
// WYSIWYG ENHANCEMENTS: RTF TOOLBAR
// Robust implementation for iframe editing
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    const toolbar = document.getElementById('rtf-toolbar');
    if (!toolbar) return;

    // Helper to get the active iframe document
    const getDoc = () => {
        if (window.getCanvasDoc) return window.getCanvasDoc();
        const iframe = document.getElementById('canvas-frame');
        return iframe ? iframe.contentWindow.document : null;
    };

    // 1. Prevent toolbar from stealing focus generally
    toolbar.addEventListener('mousedown', (e) => {
        // We must allow interaction with inputs (color picker, selects), 
        // but prevent focus theft for buttons
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT' && e.target.tagName !== 'OPTION') {
            e.preventDefault();
        }
    });

    // 2. Execute Command Helper
    const exec = (cmd, val = null) => {
        const doc = getDoc();
        if (doc) {
            // CRITICAL FIX: Restore focus to the editable element before executing
            // This prevents "broken buttons" feeling where clicking the toolbar does nothing
            // because the iframe selection was lost (blurred).
            
            // Step A: Restore Range if tracked
            if(window.currentSelectionRange) {
                const sel = doc.getSelection();
                sel.removeAllRanges();
                sel.addRange(window.currentSelectionRange);
            }
            
            // Step B: Ensure Focus
            if(window.selectedEl && window.selectedEl.isContentEditable) {
                window.selectedEl.focus();
            } else if (doc.body && doc.body.isContentEditable) {
                doc.body.focus();
            }

            try {
                doc.execCommand(cmd, false, val);
                // Sync state to history
                if(window.saveState) window.saveState();
                // Update button states immediately
                updateButtonStates();
            } catch (e) {
                console.warn('ExecCommand failed:', e);
            }
        }
    };

    // 3. Bind Button Actions (Use mousedown for immediate execution without blur)
    toolbar.querySelectorAll('.rtf-btn').forEach(btn => {
        btn.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Double insurance against focus loss
            
            const action = btn.dataset.rtf;
            if (!action) return;

            switch (action) {
                case 'bold': exec('bold'); break;
                case 'italic': exec('italic'); break;
                case 'underline': exec('underline'); break;
                case 'alignLeft': exec('justifyLeft'); break;
                case 'alignCenter': exec('justifyCenter'); break;
                case 'alignRight': exec('justifyRight'); break;
                case 'link': 
                    const url = prompt('Enter Link URL:', 'https://');
                    if(url) exec('createLink', url);
                    break;
                case 'clearFormat': exec('removeFormat'); break;
            }
            
            if(window.playSound) window.playSound('boop');
        });
    });

    // 4. Color Picker Handling
    const colorPicker = document.getElementById('rtf-text-color');
    if (colorPicker) {
        // For color picker, we change on input
        colorPicker.addEventListener('input', (e) => {
            exec('foreColor', e.target.value);
        });
        // Prevent click propagation to avoid toolbar mousedown handler interference
        colorPicker.addEventListener('mousedown', (e) => e.stopPropagation());
    }

    // NEW: Font Family Dropdown
    const fontSelect = document.getElementById('rtf-font-name');
    if (fontSelect) {
        fontSelect.addEventListener('change', (e) => {
            exec('fontName', e.target.value);
        });
    }

    // NEW: Font Size Dropdown
    const sizeSelect = document.getElementById('rtf-font-size');
    if (sizeSelect) {
        sizeSelect.addEventListener('change', (e) => {
            exec('fontSize', e.target.value);
        });
    }

    // 5. State Synchronization (Highlight buttons based on selection)
    const updateButtonStates = () => {
        const doc = getDoc();
        if (!doc) return;

        try {
            // Map actions to commands
            const stateMap = {
                'bold': 'bold',
                'italic': 'italic',
                'underline': 'underline',
                'alignLeft': 'justifyLeft',
                'alignCenter': 'justifyCenter',
                'alignRight': 'justifyRight'
            };

            for (const [action, cmd] of Object.entries(stateMap)) {
                const btn = toolbar.querySelector(`[data-rtf="${action}"]`);
                if (btn) {
                    // queryCommandState works on the current selection in the document
                    if (doc.queryCommandState && doc.queryCommandState(cmd)) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                }
            }
        } catch (e) {
            // queryCommandState can throw if no selection
        }
    };

    // 6. Continuous State Monitoring
    // Since the iframe reloads and we can't easily bind 'selectionchange' permanently,
    // we poll for state changes when the toolbar is visible.
    setInterval(() => {
        if (toolbar.offsetParent !== null) { // Only update if visible
            updateButtonStates();
        }
    }, 250);

    console.log('✨ WYSIWYG Toolbar initialized: Ready for text formatting.');
});