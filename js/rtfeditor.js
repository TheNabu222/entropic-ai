class RtfEditor {
  constructor(options) {
    this.editor = options.editor;
    this.toolbar = options.toolbar;
    this.status = options.status;
    this.propertyInput = options.propertyInput;
    this.valueInput = options.valueInput;
    this.propertyCatalog = options.propertyCatalog || [];
    this.bindToolbar();
  }

  bindToolbar() {
    if (!this.toolbar) return;
    this.toolbar.addEventListener('click', (event) => {
      const button = event.target.closest('[data-command]');
      if (!button) return;
      event.preventDefault();
      const command = button.dataset.command;
      const value = button.dataset.value || null;
      if (command === 'createLink') {
        const url = prompt('Enter the URL for the link:');
        if (url) this.runCommand(command, url);
        return;
      }
      this.runCommand(command, value);
    });
  }

  runCommand(command, value = null) {
    document.execCommand('styleWithCSS', false, true);
    document.execCommand(command, false, value);
    this.setStatus(`Applied ${command}${value ? ` (${value})` : ''}.`, 'is-link');
  }

  loadContent(html, sourceName = 'inline content') {
    this.editor.innerHTML = html;
    this.setStatus(`Loaded ${sourceName} into the editor.`, 'is-success');
  }

  getContent() {
    return this.editor.innerHTML;
  }

  applyStyle(property, value) {
    if (!property || !value) {
      this.setStatus('Choose a CSS property and value first.', 'is-warning');
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      this.setStatus('Select some content in the editor before applying styles.', 'is-warning');
      return;
    }

    const range = selection.getRangeAt(0);
    const wrapper = document.createElement('span');
    wrapper.style.setProperty(property, value);
    wrapper.appendChild(range.extractContents());
    range.insertNode(wrapper);
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(wrapper);
    selection.addRange(newRange);
    this.setStatus(`Applied ${property}: ${value} to the selection.`, 'is-success');
  }

  setStatus(message, modifier = 'is-info') {
    if (!this.status) return;
    this.status.className = `notification ${modifier}`;
    this.status.textContent = message;
  }
}

const propertyCatalog = [
  { name: 'align-content', category: 'flexbox' },
  { name: 'align-items', category: 'flexbox' },
  { name: 'align-self', category: 'flexbox' },
  { name: 'animation-delay', category: 'animations' },
  { name: 'animation-direction', category: 'animations' },
  { name: 'animation-duration', category: 'animations' },
  { name: 'animation-fill-mode', category: 'animations' },
  { name: 'animation-iteration-count', category: 'animations' },
  { name: 'animation-name', category: 'animations' },
  { name: 'animation-play-state', category: 'animations' },
  { name: 'animation-timing-function', category: 'animations' },
  { name: 'animation', category: 'animations' },
  { name: 'background-attachment', category: 'backgrounds' },
  { name: 'background-clip', category: 'backgrounds' },
  { name: 'background-color', category: 'backgrounds' },
  { name: 'background-image', category: 'backgrounds' },
  { name: 'background-origin', category: 'backgrounds' },
  { name: 'background-position', category: 'backgrounds' },
  { name: 'background-repeat', category: 'backgrounds' },
  { name: 'background-size', category: 'backgrounds' },
  { name: 'background', category: 'backgrounds' },
  { name: 'border-bottom-color', category: 'box-model' },
  { name: 'border-bottom-left-radius', category: 'box-model' },
  { name: 'border-bottom-right-radius', category: 'box-model' },
  { name: 'border-bottom-style', category: 'box-model' },
  { name: 'border-bottom-width', category: 'box-model' },
  { name: 'border-bottom', category: 'box-model' },
  { name: 'border-collapse', category: 'box-model' },
  { name: 'border-color', category: 'box-model' },
  { name: 'border-left-color', category: 'box-model' },
  { name: 'border-left-style', category: 'box-model' },
  { name: 'border-left-width', category: 'box-model' },
  { name: 'border-left', category: 'box-model' },
  { name: 'border-radius', category: 'box-model' },
  { name: 'border-right-color', category: 'box-model' },
  { name: 'border-right-style', category: 'box-model' },
  { name: 'border-right-width', category: 'box-model' },
  { name: 'border-right', category: 'box-model' },
  { name: 'border-style', category: 'box-model' },
  { name: 'border-top-color', category: 'box-model' },
  { name: 'border-top-left-radius', category: 'box-model' },
  { name: 'border-top-right-radius', category: 'box-model' },
  { name: 'border-top-style', category: 'box-model' },
  { name: 'border-top-width', category: 'box-model' },
  { name: 'border-top', category: 'box-model' },
  { name: 'border-width', category: 'box-model' },
  { name: 'border', category: 'box-model' },
  { name: 'bottom', category: 'positioning' },
  { name: 'box-shadow', category: 'box-model' },
  { name: 'box-sizing', category: 'box-model' },
  { name: 'clear', category: 'layout' },
  { name: 'color', category: 'typography' },
  { name: 'column-count', category: 'layout' },
  { name: 'column-gap', category: 'layout' },
  { name: 'column-width', category: 'layout' },
  { name: 'content', category: 'layout' },
  { name: 'cursor', category: 'interaction' },
  { name: 'display', category: 'layout' },
  { name: 'flex-basis', category: 'flexbox' },
  { name: 'flex-direction', category: 'flexbox' },
  { name: 'flex-flow', category: 'flexbox' },
  { name: 'flex-grow', category: 'flexbox' },
  { name: 'flex-shrink', category: 'flexbox' },
  { name: 'flex-wrap', category: 'flexbox' },
  { name: 'float', category: 'layout' },
  { name: 'font-family', category: 'typography' },
  { name: 'font-size', category: 'typography' },
  { name: 'font-style', category: 'typography' },
  { name: 'font-variant', category: 'typography' },
  { name: 'font-weight', category: 'typography' },
  { name: 'font', category: 'typography' },
  { name: 'grid-area', category: 'css-grid' },
  { name: 'grid-auto-columns', category: 'css-grid' },
  { name: 'grid-auto-flow', category: 'css-grid' },
  { name: 'grid-auto-rows', category: 'css-grid' },
  { name: 'grid-column-end', category: 'css-grid' },
  { name: 'grid-column-gap', category: 'css-grid' },
  { name: 'grid-column-start', category: 'css-grid' },
  { name: 'grid-column', category: 'css-grid' },
  { name: 'grid-gap', category: 'css-grid' },
  { name: 'grid-row-end', category: 'css-grid' },
  { name: 'grid-row-gap', category: 'css-grid' },
  { name: 'grid-row-start', category: 'css-grid' },
  { name: 'grid-row', category: 'css-grid' },
  { name: 'grid-template-areas', category: 'css-grid' },
  { name: 'grid-template-columns', category: 'css-grid' },
  { name: 'grid-template-rows', category: 'css-grid' },
  { name: 'grid-template', category: 'css-grid' },
  { name: 'grid', category: 'css-grid' },
  { name: 'height', category: 'box-model' },
  { name: 'justify-content', category: 'flexbox' },
  { name: 'left', category: 'positioning' },
  { name: 'letter-spacing', category: 'typography' },
  { name: 'line-height', category: 'typography' },
  { name: 'list-style-image', category: 'typography' },
  { name: 'list-style-position', category: 'typography' },
  { name: 'list-style-type', category: 'typography' },
  { name: 'list-style', category: 'typography' },
  { name: 'margin-bottom', category: 'box-model' },
  { name: 'margin-left', category: 'box-model' },
  { name: 'margin-right', category: 'box-model' },
  { name: 'margin-top', category: 'box-model' },
  { name: 'margin', category: 'box-model' },
  { name: 'max-height', category: 'box-model' },
  { name: 'max-width', category: 'box-model' },
  { name: 'min-height', category: 'box-model' },
  { name: 'min-width', category: 'box-model' },
  { name: 'mix-blend-mode', category: 'effects' },
  { name: 'opacity', category: 'effects' },
  { name: 'order', category: 'flexbox' },
  { name: 'outline-color', category: 'box-model' },
  { name: 'outline-style', category: 'box-model' },
  { name: 'outline-width', category: 'box-model' },
  { name: 'outline', category: 'box-model' },
  { name: 'overflow-wrap', category: 'box-model' },
  { name: 'overflow-x', category: 'box-model' },
  { name: 'overflow-y', category: 'box-model' },
  { name: 'overflow', category: 'box-model' },
  { name: 'padding-bottom', category: 'box-model' },
  { name: 'padding-left', category: 'box-model' },
  { name: 'padding-right', category: 'box-model' },
  { name: 'padding-top', category: 'box-model' },
  { name: 'padding', category: 'box-model' },
  { name: 'pointer-events', category: 'interaction' },
  { name: 'position', category: 'positioning' },
  { name: 'resize', category: 'interaction' },
  { name: 'right', category: 'positioning' },
  { name: 'text-align', category: 'typography' },
  { name: 'text-decoration', category: 'typography' },
  { name: 'text-indent', category: 'typography' },
  { name: 'text-overflow', category: 'typography' },
  { name: 'text-shadow', category: 'typography' },
  { name: 'text-transform', category: 'typography' },
  { name: 'top', category: 'positioning' },
  { name: 'transform-origin', category: 'transform' },
  { name: 'transform', category: 'transform' },
  { name: 'transition-delay', category: 'transitions' },
  { name: 'transition-duration', category: 'transitions' },
  { name: 'transition-property', category: 'transitions' },
  { name: 'transition-timing-function', category: 'transitions' },
  { name: 'transition', category: 'transitions' },
  { name: 'vertical-align', category: 'typography' },
  { name: 'white-space', category: 'typography' },
  { name: 'width', category: 'box-model' },
  { name: 'will-change', category: 'performance' },
  { name: 'word-break', category: 'typography' },
  { name: 'word-spacing', category: 'typography' },
  { name: 'z-index', category: 'positioning' },
];

function populatePropertyDatalist(datalist) {
  datalist.innerHTML = '';
  propertyCatalog.forEach((prop) => {
    const option = document.createElement('option');
    option.value = prop.name;
    option.label = `${prop.name} (${prop.category})`;
    datalist.appendChild(option);
  });
}

function renderPropertyCatalog(target) {
  const grouped = propertyCatalog.reduce((bucket, prop) => {
    bucket[prop.category] = bucket[prop.category] || [];
    bucket[prop.category].push(prop.name);
    return bucket;
  }, {});

  target.innerHTML = '';
  Object.entries(grouped).forEach(([category, properties]) => {
    const box = document.createElement('div');
    box.className = 'box';

    const title = document.createElement('p');
    title.className = 'title is-6';
    title.textContent = `${category} (${properties.length})`;

    const tagContainer = document.createElement('div');
    tagContainer.className = 'tags';
    properties.sort().forEach((name) => {
      const tag = document.createElement('span');
      tag.className = 'tag is-info is-light';
      tag.textContent = name;
      tagContainer.appendChild(tag);
    });

    box.appendChild(title);
    box.appendChild(tagContainer);
    target.appendChild(box);
  });
}

function renderFileList(container, files, filter = '') {
  const lowerFilter = filter.toLowerCase();
  container.innerHTML = '';
  files
    .filter((path) => path.toLowerCase().includes(lowerFilter))
    .forEach((path) => {
      const item = document.createElement('a');
      item.className = 'panel-block file-item';
      item.dataset.path = path;
      item.textContent = path.replace('./', '');
      container.appendChild(item);
    });
}

function normalizePath(path) {
  return path.replace(/^\.\//, '');
}

function attachEditorUI() {
  const editorElement = document.getElementById('rtf-editor');
  const toolbar = document.getElementById('rtf-toolbar');
  const status = document.getElementById('rtf-status');
  const propertyInput = document.getElementById('css-property');
  const valueInput = document.getElementById('css-value');

  const editor = new RtfEditor({
    editor: editorElement,
    toolbar,
    status,
    propertyInput,
    valueInput,
    propertyCatalog,
  });

  const datalist = document.getElementById('css-property-list');
  populatePropertyDatalist(datalist);

  const propertyBrowser = document.getElementById('property-browser');
  renderPropertyCatalog(propertyBrowser);

  const fileListContainer = document.getElementById('file-list');
  const fileSearch = document.getElementById('file-search');
  const fileCount = document.getElementById('file-count');
  const loadButton = document.getElementById('load-file');
  const downloadButton = document.getElementById('download-html');
  let selectedPath = null;
  let files = [];

  fetch('./html-files.json')
    .then((response) => {
      if (!response.ok) throw new Error('Failed to fetch html-files.json');
      return response.json();
    })
    .then((data) => {
      files = data;
      fileCount.textContent = `${files.length} HTML files detected`;
      renderFileList(fileListContainer, files);
    })
    .catch(() => {
      fileCount.textContent = 'Unable to load html-files.json';
    });

  fileSearch.addEventListener('input', (event) => {
    renderFileList(fileListContainer, files, event.target.value);
  });

  fileListContainer.addEventListener('click', (event) => {
    const item = event.target.closest('.file-item');
    if (!item) return;
    fileListContainer.querySelectorAll('.is-active').forEach((el) => el.classList.remove('is-active'));
    item.classList.add('is-active');
    selectedPath = item.dataset.path;
    loadButton.disabled = false;
  });

  loadButton.addEventListener('click', async () => {
    if (!selectedPath) return;
    const normalized = normalizePath(selectedPath);
    try {
      const response = await fetch(`../${normalized}`);
      if (!response.ok) throw new Error(`Unable to load ${normalized}`);
      const html = await response.text();
      editor.loadContent(html, normalized);
    } catch (error) {
      editor.setStatus(error.message, 'is-danger');
    }
  });

  downloadButton.addEventListener('click', () => {
    const blob = new Blob([editor.getContent()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const fileName = selectedPath ? normalizePath(selectedPath).split('/').pop() : 'edited.html';
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  });

  const applyStyleButton = document.getElementById('apply-style');
  applyStyleButton.addEventListener('click', () => {
    editor.applyStyle(propertyInput.value.trim(), valueInput.value.trim());
  });
}

document.addEventListener('DOMContentLoaded', attachEditorUI);
