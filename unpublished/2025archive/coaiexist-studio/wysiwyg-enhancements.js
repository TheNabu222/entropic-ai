
// ============================================
// WYSIWYG ENHANCEMENTS: RTF TOOLBAR
// Robust implementation for iframe editing
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    const toolbar = document.getElementById('rtf-toolbar');
    if (!toolbar) return;

    // Helper to get the active iframe document
    const getDoc = () => window.getCanvasDoc ? window.getCanvasDoc() : null;

    // 1. Prevent toolbar from stealing focus generally
    toolbar.addEventListener('mousedown', (e) => {
        // We must allow interaction with inputs (color picker), 
        // but prevent focus theft for buttons
        if (e.target.tagName !== 'INPUT') {
            e.preventDefault();
        }
    });

    // 2. Execute Command Helper
    const exec = (cmd, val = null) => {
        const doc = getDoc();
        if (doc && doc.body.isContentEditable === false) {
            // If strictly nothing is editable, execCommand might fail or do nothing.
            // In our app, specific elements are contentEditable.
            // We assume the user has selected text inside a contentEditable element.
        }
        
        if (doc) {
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
                    if (doc.queryCommandState(cmd)) {
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
        if (toolbar.classList.contains('active')) {
            updateButtonStates();
        }
    }, 250);

    console.log('✨ WYSIWYG Toolbar initialized: Ready for text formatting.');
});
