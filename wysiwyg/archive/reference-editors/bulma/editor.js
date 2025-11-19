const repoPages = [
  {
    title: 'Homepage',
    path: 'index.html',
    tags: ['public', 'navigation'],
    notes: 'Primary landing page seen by visitors.'
  },
  {
    title: 'Hybrid desktop',
    path: 'index-hybrid-desktop.html',
    tags: ['experimental', 'layout'],
    notes: 'Hybrid desktop experience with windowed UI.'
  },
  {
    title: 'Guestbook',
    path: 'guestbook.html',
    tags: ['interactive', 'forms'],
    notes: 'Public guestbook interface visitors can sign.'
  },
  {
    title: 'Explore',
    path: 'explore.html',
    tags: ['gallery'],
    notes: 'Exploration hub; good for testing grid-heavy content.'
  },
  {
    title: 'Preview',
    path: 'preview.html',
    tags: ['dev-only'],
    notes: 'Preview harness for experiments and drafts.'
  },
  {
    title: 'Nav include',
    path: 'nav.html',
    tags: ['include', 'navigation'],
    notes: 'Reusable navigation markup. Keep structure intact when editing.'
  },
  {
    title: 'Admin · Personal updates',
    path: 'admin/personal-updates.html',
    tags: ['admin', 'cms'],
    notes: 'Admin surface for personal updates flow.'
  },
  {
    title: 'Admin · WYSIWYG',
    path: 'admin/wysiwyg-editorz/wysiwyg-coai.html',
    tags: ['admin', 'editor'],
    notes: 'Existing WYSIWYG instance for comparison.'
  }
];

const pageList = document.getElementById('pageList');
const pageFilter = document.getElementById('pageFilter');
const activePageLabel = document.getElementById('activePageLabel');
const pageNotes = document.getElementById('pageNotes');
const designEditor = document.getElementById('designEditor');
const sourceEditor = document.getElementById('sourceEditor');
const previewFrame = document.getElementById('previewFrame');

let currentPage = null;

const sanitizeHtml = (html) => html ?? '';

function renderPageList(filter = '') {
  const menuList = document.createElement('ul');
  menuList.classList.add('menu-list');

  const normalized = filter.trim().toLowerCase();

  repoPages
    .filter((page) =>
      !normalized ||
      page.title.toLowerCase().includes(normalized) ||
      page.path.toLowerCase().includes(normalized) ||
      page.tags.some((tag) => tag.toLowerCase().includes(normalized))
    )
    .forEach((page) => {
      const item = document.createElement('li');
      const card = document.createElement('a');
      card.className = 'page-card';
      card.innerHTML = `
        <strong>${page.title}</strong>
        <small class="has-text-grey">${page.path}</small>
        <div class="tags mt-2">
          ${page.tags.map((tag) => `<span class="tag is-light">${tag}</span>`).join('')}
        </div>
      `;

      card.addEventListener('click', () => loadPage(page));
      item.appendChild(card);
      menuList.appendChild(item);
    });

  pageList.innerHTML = '';
  pageList.appendChild(menuList);
}

async function loadPage(page) {
  currentPage = page;
  activePageLabel.textContent = `${page.title} (${page.path})`;
  pageNotes.innerHTML = `<p>${page.notes}</p>`;

  try {
    const response = await fetch(`/${page.path}`);
    const html = await response.text();
    sourceEditor.value = sanitizeHtml(html);
    hydrateDesignFromSource();
    updatePreview();
  } catch (error) {
    sourceEditor.value = `<!-- Unable to load ${page.path}: ${error.message} -->`;
    designEditor.innerHTML = '<p class="has-text-danger">Could not load the page. Check the path and try again.</p>';
  }
}

function hydrateDesignFromSource() {
  try {
    const parsed = new DOMParser().parseFromString(sourceEditor.value, 'text/html');
    designEditor.innerHTML = sanitizeHtml(parsed.body.innerHTML.trim());
  } catch (error) {
    designEditor.innerHTML = '<p class="has-text-danger">Design view could not parse the source HTML.</p>';
  }
}

function syncBodyIntoSource() {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(sourceEditor.value || '<!doctype html><html><body></body></html>', 'text/html');
  parsed.body.innerHTML = designEditor.innerHTML;
  const serialized = '<!DOCTYPE html>\n' + parsed.documentElement.outerHTML;
  sourceEditor.value = serialized;
  updatePreview();
}

function updatePreview() {
  previewFrame.srcdoc = sourceEditor.value;
}

function switchTab(tab) {
  document.querySelectorAll('.tabs li').forEach((el) => el.classList.remove('is-active'));
  document.querySelector(`.tabs li[data-tab="${tab}"]`).classList.add('is-active');

  document.getElementById('designPanel').classList.toggle('is-hidden', tab !== 'design');
  document.getElementById('sourcePanel').classList.toggle('is-hidden', tab !== 'source');
  document.getElementById('previewPanel').classList.toggle('is-hidden', tab !== 'preview');

  if (tab === 'preview') updatePreview();
}

function bindTabs() {
  document.querySelectorAll('.tabs li').forEach((tab) => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });
}

function bindToolbar() {
  document.querySelectorAll('.toolbar [data-command]').forEach((button) => {
    button.addEventListener('click', () => {
      const command = button.dataset.command;
      const value = button.dataset.value || null;

      if (command === 'createLink') {
        const url = prompt('Enter URL');
        if (!url) return;
        document.execCommand(command, false, url);
      } else {
        document.execCommand(command, false, value);
      }
      designEditor.focus();
    });
  });
}

function bindActions() {
  document.getElementById('refreshFromSource').addEventListener('click', hydrateDesignFromSource);
  document.getElementById('syncToSource').addEventListener('click', syncBodyIntoSource);
  document.getElementById('downloadHtml').addEventListener('click', () => {
    const blob = new Blob([sourceEditor.value], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const fileName = currentPage ? `${currentPage.title.toLowerCase().replace(/\s+/g, '-')}.html` : 'page.html';
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  });

  pageFilter.addEventListener('input', (event) => renderPageList(event.target.value));
}

function init() {
  renderPageList();
  bindTabs();
  bindToolbar();
  bindActions();
  designEditor.focus();
}

init();
