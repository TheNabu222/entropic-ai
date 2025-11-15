// ============================================
// WYSIWYG ENHANCEMENTS: BULMA + RTF
// Simple interface, maximum power
// ============================================

// Add Bulma component templates
window.addEventListener('DOMContentLoaded', () => {
    // Add Bulma templates to existing elementTemplates
    if (window.elementTemplates) {
        Object.assign(window.elementTemplates, {
            // ===== BULMA COMPONENTS =====
            'bulma-hero': `<section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 60px 20px; text-align: center;">
                <h1 style="font-size: 3em; margin-bottom: 20px; font-weight: bold;">Hero Title</h1>
                <p style="font-size: 1.5em; margin-bottom: 30px;">Hero subtitle - edit me!</p>
                <button style="background: white; color: #667eea; border: none; padding: 15px 40px; font-size: 1.2em; border-radius: 6px; cursor: pointer; font-weight: bold;">Call to Action</button>
            </section>`,

            'bulma-navbar': `<nav style="background: #363636; color: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 1.5em; font-weight: bold;">Brand</div>
                <div style="display: flex; gap: 20px;">
                    <a href="#" style="color: white; text-decoration: none;">Home</a>
                    <a href="#" style="color: white; text-decoration: none;">About</a>
                    <a href="#" style="color: white; text-decoration: none;">Contact</a>
                </div>
            </nav>`,

            'bulma-columns': `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 20px;">
                <div style="background: #f5f5f5; padding: 20px; border-radius: 6px;"><h3>Column 1</h3><p>Content here...</p></div>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 6px;"><h3>Column 2</h3><p>Content here...</p></div>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 6px;"><h3>Column 3</h3><p>Content here...</p></div>
            </div>`,

            'bulma-notification': `<div style="background: #00d1b2; color: white; padding: 20px; border-radius: 6px; position: relative; max-width: 500px;">
                <button style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; color: white; font-size: 20px; cursor: pointer;">×</button>
                <strong>Notification!</strong> This is a Bulma notification box.
            </div>`,

            'bulma-message': `<article style="border: 1px solid #dbdbdb; border-radius: 6px; max-width: 500px;">
                <div style="background: #363636; color: white; padding: 12px 16px; font-weight: bold; border-radius: 6px 6px 0 0;">Message Header</div>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 0 0 6px 6px;">
                    This is a message body. You can use this for important information or callouts.
                </div>
            </article>`,

            'bulma-card': `<div style="border: 1px solid #dbdbdb; border-radius: 6px; overflow: hidden; max-width: 300px; background: white;">
                <div style="padding: 0;"><img src="https://bulma.io/images/placeholders/1280x960.png" style="width: 100%; display: block;"></div>
                <div style="padding: 20px;">
                    <h3 style="font-size: 1.5em; margin-bottom: 10px;">Card Title</h3>
                    <p style="color: #4a4a4a; margin-bottom: 15px;">Card content goes here. This is a Bulma-style card component.</p>
                    <button style="background: #00d1b2; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Learn More</button>
                </div>
            </div>`,

            'bulma-media': `<article style="display: flex; gap: 15px; padding: 15px; border-bottom: 1px solid #dbdbdb;">
                <figure style="flex-shrink: 0;"><img src="https://bulma.io/images/placeholders/128x128.png" style="width: 64px; height: 64px; border-radius: 50%;"></figure>
                <div style="flex-grow: 1;">
                    <strong>Username</strong> <small style="color: #7a7a7a;">@handle · 3h</small>
                    <p style="margin-top: 8px; color: #4a4a4a;">This is a media object, perfect for comments, posts, or user content!</p>
                </div>
            </article>`,

            'bulma-box': `<div style="background: white; border-radius: 6px; box-shadow: 0 0.5em 1em -0.125em rgba(10,10,10,0.1); padding: 1.25rem; max-width: 500px;">
                <p>This is a Bulma box component. It's great for containing content with a clean, elevated appearance.</p>
            </div>`,

            'bulma-tags': `<div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <span style="background: #00d1b2; color: white; padding: 4px 12px; border-radius: 4px; font-size: 0.9em;">Tag 1</span>
                <span style="background: #3273dc; color: white; padding: 4px 12px; border-radius: 4px; font-size: 0.9em;">Tag 2</span>
                <span style="background: #48c774; color: white; padding: 4px 12px; border-radius: 4px; font-size: 0.9em;">Tag 3</span>
                <span style="background: #ffdd57; color: rgba(0,0,0,0.7); padding: 4px 12px; border-radius: 4px; font-size: 0.9em;">Tag 4</span>
            </div>`,

            'bulma-breadcrumb': `<nav style="padding: 15px 0;">
                <ul style="display: flex; list-style: none; padding: 0; gap: 10px; align-items: center;">
                    <li><a href="#" style="color: #3273dc; text-decoration: none;">Home</a></li>
                    <li style="color: #b5b5b5;">/</li>
                    <li><a href="#" style="color: #3273dc; text-decoration: none;">Documentation</a></li>
                    <li style="color: #b5b5b5;">/</li>
                    <li style="color: #4a4a4a;">Components</li>
                </ul>
            </nav>`,

            'bulma-pagination': `<nav style="display: flex; justify-content: center; gap: 5px; padding: 20px;">
                <button style="background: white; border: 1px solid #dbdbdb; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Previous</button>
                <button style="background: #3273dc; color: white; border: 1px solid #3273dc; padding: 8px 12px; border-radius: 4px; cursor: pointer;">1</button>
                <button style="background: white; border: 1px solid #dbdbdb; padding: 8px 12px; border-radius: 4px; cursor: pointer;">2</button>
                <button style="background: white; border: 1px solid #dbdbdb; padding: 8px 12px; border-radius: 4px; cursor: pointer;">3</button>
                <button style="background: white; border: 1px solid #dbdbdb; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Next</button>
            </nav>`,

            'bulma-tabs': `<div>
                <div style="border-bottom: 2px solid #f5f5f5; display: flex; gap: 0;">
                    <button style="background: white; border: none; border-bottom: 2px solid #3273dc; padding: 12px 20px; cursor: pointer; font-weight: bold; color: #3273dc;">Tab 1</button>
                    <button style="background: white; border: none; border-bottom: 2px solid transparent; padding: 12px 20px; cursor: pointer; color: #4a4a4a;">Tab 2</button>
                    <button style="background: white; border: none; border-bottom: 2px solid transparent; padding: 12px 20px; cursor: pointer; color: #4a4a4a;">Tab 3</button>
                </div>
                <div style="padding: 20px; background: white;">
                    <p>Tab content goes here. Click the tabs above to switch content!</p>
                </div>
            </div>`,

            'bulma-progress': `<div style="max-width: 400px;">
                <progress value="75" max="100" style="width: 100%; height: 1rem; border-radius: 290486px; background-color: #ededed;"></progress>
                <p style="margin-top: 10px; color: #4a4a4a; font-size: 0.9em;">Task is 75% complete</p>
            </div>`,

            'bulma-table': `<div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; background: white;">
                    <thead>
                        <tr style="background: #f5f5f5;">
                            <th style="border: 1px solid #dbdbdb; padding: 12px; text-align: left;">Name</th>
                            <th style="border: 1px solid #dbdbdb; padding: 12px; text-align: left;">Email</th>
                            <th style="border: 1px solid #dbdbdb; padding: 12px; text-align: left;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid #dbdbdb;">
                            <td style="border: 1px solid #dbdbdb; padding: 12px;">John Doe</td>
                            <td style="border: 1px solid #dbdbdb; padding: 12px;">john@example.com</td>
                            <td style="border: 1px solid #dbdbdb; padding: 12px;"><span style="background: #48c774; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.85em;">Active</span></td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #dbdbdb; padding: 12px;">Jane Smith</td>
                            <td style="border: 1px solid #dbdbdb; padding: 12px;">jane@example.com</td>
                            <td style="border: 1px solid #dbdbdb; padding: 12px;"><span style="background: #ffdd57; color: rgba(0,0,0,0.7); padding: 2px 8px; border-radius: 4px; font-size: 0.85em;">Pending</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>`,

            'bulma-modal': `<div style="position: fixed; inset: 0; background: rgba(10,10,10,0.86); display: flex; align-items: center; justify-content: center; z-index: 9999;">
                <div style="background: white; border-radius: 6px; max-width: 500px; width: 90%; max-height: 90vh; overflow: auto;">
                    <header style="background: #f5f5f5; padding: 20px; border-radius: 6px 6px 0 0; position: relative;">
                        <p style="font-size: 1.5em; font-weight: bold;">Modal Title</p>
                        <button style="position: absolute; top: 20px; right: 20px; background: transparent; border: none; font-size: 24px; cursor: pointer;">×</button>
                    </header>
                    <section style="padding: 20px;">
                        <p>This is modal content. Click the X or outside to close.</p>
                    </section>
                    <footer style="background: #f5f5f5; padding: 20px; border-radius: 0 0 6px 6px; display: flex; justify-content: flex-end; gap: 10px;">
                        <button style="background: white; border: 1px solid #dbdbdb; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Cancel</button>
                        <button style="background: #3273dc; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Confirm</button>
                    </footer>
                </div>
            </div>`,

            'bulma-dropdown': `<div style="position: relative; display: inline-block;">
                <button style="background: white; border: 1px solid #dbdbdb; padding: 10px 35px 10px 15px; border-radius: 4px; cursor: pointer; position: relative;">
                    Dropdown
                    <span style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%);">▼</span>
                </button>
                <div style="position: absolute; top: 100%; left: 0; background: white; border: 1px solid #dbdbdb; border-radius: 4px; min-width: 150px; box-shadow: 0 2px 8px rgba(10,10,10,0.1); margin-top: 4px; display: none;">
                    <a href="#" style="display: block; padding: 10px 15px; color: #4a4a4a; text-decoration: none; border-bottom: 1px solid #f5f5f5;">Option 1</a>
                    <a href="#" style="display: block; padding: 10px 15px; color: #4a4a4a; text-decoration: none; border-bottom: 1px solid #f5f5f5;">Option 2</a>
                    <a href="#" style="display: block; padding: 10px 15px; color: #4a4a4a; text-decoration: none;">Option 3</a>
                </div>
            </div>`,

            // ===== BULMA FORM COMPONENTS =====
            'bulma-input': `<div style="margin-bottom: 1rem;">
                <label style="display: block; font-weight: bold; margin-bottom: 0.5rem; color: #363636;">Input Label</label>
                <input type="text" placeholder="Enter text..." style="width: 100%; padding: 10px 12px; border: 1px solid #dbdbdb; border-radius: 4px; font-size: 1rem;">
            </div>`,

            'bulma-textarea': `<div style="margin-bottom: 1rem;">
                <label style="display: block; font-weight: bold; margin-bottom: 0.5rem; color: #363636;">Textarea Label</label>
                <textarea placeholder="Enter your message..." style="width: 100%; padding: 10px 12px; border: 1px solid #dbdbdb; border-radius: 4px; font-size: 1rem; min-height: 120px; resize: vertical;"></textarea>
            </div>`,

            'bulma-select': `<div style="margin-bottom: 1rem;">
                <label style="display: block; font-weight: bold; margin-bottom: 0.5rem; color: #363636;">Select Option</label>
                <div style="position: relative; display: inline-block; width: 100%;">
                    <select style="width: 100%; padding: 10px 12px; border: 1px solid #dbdbdb; border-radius: 4px; font-size: 1rem; background: white; cursor: pointer;">
                        <option>Select an option</option>
                        <option>Option 1</option>
                        <option>Option 2</option>
                        <option>Option 3</option>
                    </select>
                </div>
            </div>`,

            'bulma-checkbox': `<label style="display: flex; align-items: center; gap: 8px; cursor: pointer; margin-bottom: 0.5rem;">
                <input type="checkbox" style="width: 18px; height: 18px; cursor: pointer;">
                <span>I agree to the terms and conditions</span>
            </label>`,

            'bulma-radio': `<div>
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; margin-bottom: 0.5rem;">
                    <input type="radio" name="option" style="width: 18px; height: 18px; cursor: pointer;">
                    <span>Option 1</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; margin-bottom: 0.5rem;">
                    <input type="radio" name="option" style="width: 18px; height: 18px; cursor: pointer;">
                    <span>Option 2</span>
                </label>
            </div>`,

            'bulma-button': `<button style="background: #00d1b2; color: white; border: none; padding: 12px 24px; border-radius: 4px; font-size: 1rem; font-weight: bold; cursor: pointer; transition: background 0.2s;">
                Click Me!
            </button>`,

            'bulma-file-upload': `<div style="border: 2px dashed #dbdbdb; padding: 40px; text-align: center; border-radius: 6px; background: #f5f5f5;">
                <input type="file" style="display: none;" id="file-upload">
                <label for="file-upload" style="cursor: pointer;">
                    <div style="font-size: 3em; margin-bottom: 10px;">📁</div>
                    <div style="color: #4a4a4a; font-weight: bold;">Click to upload or drag and drop</div>
                    <div style="color: #7a7a7a; font-size: 0.9em; margin-top: 5px;">SVG, PNG, JPG or GIF (max. 800x400px)</div>
                </label>
            </div>`,

            'bulma-field-group': `<div style="display: flex; gap: 10px; margin-bottom: 1rem;">
                <div style="flex: 1;">
                    <label style="display: block; font-weight: bold; margin-bottom: 0.5rem; color: #363636;">First Name</label>
                    <input type="text" placeholder="John" style="width: 100%; padding: 10px 12px; border: 1px solid #dbdbdb; border-radius: 4px;">
                </div>
                <div style="flex: 1;">
                    <label style="display: block; font-weight: bold; margin-bottom: 0.5rem; color: #363636;">Last Name</label>
                    <input type="text" placeholder="Doe" style="width: 100%; padding: 10px 12px; border: 1px solid #dbdbdb; border-radius: 4px;">
                </div>
            </div>`
        });
    }

    // ===== RTF TOOLBAR FUNCTIONALITY =====
    const rtfToolbar = document.querySelector('.rtf-toolbar');
    if (rtfToolbar) {
        // RTF formatting functions
        const rtfActions = {
            bold: () => applyRTFStyle('fontWeight', 'bold', 'normal'),
            italic: () => applyRTFStyle('fontStyle', 'italic', 'normal'),
            underline: () => applyRTFStyle('textDecoration', 'underline', 'none'),
            strikethrough: () => applyRTFStyle('textDecoration', 'line-through', 'none'),
            alignLeft: () => applyRTFStyle('textAlign', 'left'),
            alignCenter: () => applyRTFStyle('textAlign', 'center'),
            alignRight: () => applyRTFStyle('textAlign', 'right'),
            alignJustify: () => applyRTFStyle('textAlign', 'justify'),
            bulletList: () => convertToList('ul'),
            numberList: () => convertToList('ol'),
            indent: () => applyRTFStyle('paddingLeft', '40px'),
            outdent: () => applyRTFStyle('paddingLeft', '0px'),
            link: () => insertLink(),
            image: () => insertImage(),
            code: () => insertCodeBlock(),
            table: () => insertTable(),
            clearFormat: () => clearFormatting()
        };

        function applyRTFStyle(property, value, toggleValue = null) {
            const selected = getSelectedElement();
            if (!selected) return;

            const currentValue = selected.style[property];
            if (toggleValue && currentValue === value) {
                selected.style[property] = toggleValue;
            } else {
                selected.style[property] = value;
            }
            saveState && saveState();
        }

        function getSelectedElement() {
            const doc = getCanvasDoc && getCanvasDoc();
            if (!doc) return null;
            return doc.querySelector('.selected');
        }

        function convertToList(type) {
            const selected = getSelectedElement();
            if (!selected) return;

            const list = document.createElement(type);
            list.innerHTML = '<li>Item 1</li><li>Item 2</li><li>Item 3</li>';
            list.className = 'canvas-element';
            selected.parentNode.replaceChild(list, selected);
            saveState && saveState();
        }

        function insertLink() {
            const url = prompt('Enter URL:');
            if (!url) return;
            const text = prompt('Enter link text:', 'Click here');
            if (window.addElementHTML) {
                addElementHTML(`<a href="${url}" style="color: #0000FF; text-decoration: underline;">${text || url}</a>`);
            }
        }

        function insertImage() {
            const url = prompt('Enter image URL:');
            if (url && window.addElementHTML) {
                addElementHTML(`<img src="${url}" alt="Image" style="max-width: 100%; height: auto;">`);
            }
        }

        function insertCodeBlock() {
            if (window.addElementHTML) {
                addElementHTML(`<pre style="background: #f5f5f5; border: 1px solid #ddd; padding: 15px; border-radius: 4px; overflow-x: auto; font-family: monospace;"><code>// Your code here</code></pre>`);
            }
        }

        function insertTable() {
            if (window.addElementHTML) {
                addElementHTML(`<table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
                    <tr><th style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;">Header 1</th><th style="border: 1px solid #ddd; padding: 8px; background: #f5f5f5;">Header 2</th></tr>
                    <tr><td style="border: 1px solid #ddd; padding: 8px;">Cell 1</td><td style="border: 1px solid #ddd; padding: 8px;">Cell 2</td></tr>
                </table>`);
            }
        }

        function clearFormatting() {
            const selected = getSelectedElement();
            if (!selected) return;
            selected.removeAttribute('style');
            saveState && saveState();
        }

        // Attach RTF button event listeners
        document.querySelectorAll('[data-rtf]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = btn.dataset.rtf;
                if (rtfActions[action]) {
                    rtfActions[action]();
                    btn.classList.toggle('active');
                    playSound && playSound('pop');
                }
            });
        });

        // Font family and size dropdowns
        document.getElementById('rtf-font-family')?.addEventListener('change', (e) => {
            applyRTFStyle('fontFamily', e.target.value);
        });

        document.getElementById('rtf-font-size')?.addEventListener('change', (e) => {
            applyRTFStyle('fontSize', e.target.value);
        });

        // Color pickers
        document.getElementById('rtf-text-color')?.addEventListener('input', (e) => {
            applyRTFStyle('color', e.target.value);
        });

        document.getElementById('rtf-bg-color')?.addEventListener('input', (e) => {
            applyRTFStyle('backgroundColor', e.target.value);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'b') {
                    e.preventDefault();
                    rtfActions.bold();
                } else if (e.key === 'i') {
                    e.preventDefault();
                    rtfActions.italic();
                } else if (e.key === 'u') {
                    e.preventDefault();
                    rtfActions.underline();
                }
            }
        });
    }

    console.log('✨ WYSIWYG Enhancements loaded! Bulma components + RTF toolbar ready.');
});
