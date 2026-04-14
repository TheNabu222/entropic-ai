class RtfEditor {
  constructor({ editorId, toolbarSelector, statusSelector }) {
    this.editor = document.getElementById(editorId);
    this.toolbar = document.querySelector(toolbarSelector);
    this.statusEl = document.querySelector(statusSelector);
    this._registerCommands();
  }

  _registerCommands() {
    if (!this.toolbar) return;
    this.toolbar.querySelectorAll('[data-command]').forEach((button) => {
      button.addEventListener('click', () => {
        const { command, value, prompt: requiresPrompt } = button.dataset;
        if (requiresPrompt) {
          const userValue = window.prompt(button.dataset.promptLabel || 'Enter value');
          if (!userValue) return;
          document.execCommand(command, false, userValue);
        } else {
          document.execCommand(command, false, value || null);
        }
        this._flashStatus(`${command} applied`);
      });
    });

    const headingPicker = document.getElementById('headingPicker');
    if (headingPicker) {
      headingPicker.addEventListener('change', (event) => {
        const level = event.target.value;
        document.execCommand('formatBlock', false, level === 'p' ? 'p' : `h${level}`);
        this._flashStatus(`Heading ${level} set`);
      });
    }

    const fontPicker = document.getElementById('fontPicker');
    if (fontPicker) {
      fontPicker.addEventListener('change', (event) => {
        document.execCommand('fontName', false, event.target.value);
        this._flashStatus(`Font set to ${event.target.value}`);
      });
    }

    const fontSizePicker = document.getElementById('fontSizePicker');
    if (fontSizePicker) {
      fontSizePicker.addEventListener('change', (event) => {
        document.execCommand('fontSize', false, event.target.value);
        this._flashStatus(`Font size ${event.target.value}`);
      });
    }

    const colorPicker = document.getElementById('colorPicker');
    if (colorPicker) {
      colorPicker.addEventListener('input', (event) => {
        document.execCommand('foreColor', false, event.target.value);
        this._flashStatus(`Color ${event.target.value}`);
      });
    }
  }

  setContent(html) {
    this.editor.innerHTML = html;
  }

  getContent() {
    return this.editor.innerHTML;
  }

  clear() {
    this.setContent('');
    this._flashStatus('Editor cleared');
  }

  copyHtml() {
    const html = this.getContent();
    navigator.clipboard.writeText(html).then(() => {
      this._flashStatus('HTML copied to clipboard');
    });
  }

  downloadHtml(filename = 'snippet.html') {
    const blob = new Blob([this.getContent()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
    this._flashStatus(`Downloaded ${filename}`);
  }

  _flashStatus(message) {
    if (!this.statusEl) return;
    this.statusEl.textContent = message;
    this.statusEl.classList.add('has-text-link');
    setTimeout(() => {
      this.statusEl.textContent = 'Ready';
      this.statusEl.classList.remove('has-text-link');
    }, 1800);
  }
}

export { RtfEditor };
