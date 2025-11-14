// TEMPLATE NAVIGATION BAR SCRIPT
// This generates the navigation bar dynamically based on config.js

function generateNavbar() {
    // Create navbar element
    const navbar = document.createElement('footer');
    navbar.className = 'custom-navbar';

    let html = '';

    // START button
    html += '<button class="nav-button start-button" onclick="toggleStartMenu()">⊞ START</button>';
    html += '<div class="nav-separator"></div>';

    // Back to main site button
    html += `<a href="${navConfig.mainSite}" class="nav-button back-button" data-goatcounter-click="nav-back-to-main">↩ MAIN SITE</a>`;
    html += '<div class="nav-separator"></div>';

    // Title badge
    html += `<div class="nav-title">${navConfig.title}</div>`;
    html += '<div class="nav-separator"></div>';

    // Main navigation links
    navConfig.links.forEach((link) => {
        const url = link.url.startsWith('http') ? link.url : navConfig.baseUrl + link.url;
        const gcAttr = link.goatCounterId ? ` data-goatcounter-click="${link.goatCounterId}"` : '';
        html += `<a href="${url}" class="nav-button"${gcAttr}>
            <span>${link.icon}</span>${link.title}
        </a>`;
    });

    // Extra links (if any)
    if (navConfig.extras && navConfig.extras.length > 0) {
        html += '<div class="nav-separator"></div>';
        navConfig.extras.forEach((extra) => {
            const url = extra.url.startsWith('http') ? extra.url : navConfig.baseUrl + extra.url;
            const gcAttr = extra.goatCounterId ? ` data-goatcounter-click="${extra.goatCounterId}"` : '';
            html += `<a href="${url}" class="nav-button extra-button"${gcAttr}>
                <span>${extra.icon}</span>${extra.title}
            </a>`;
        });
    }

    navbar.innerHTML = html;
    document.body.appendChild(navbar);

    // Highlight active page
    highlightActivePage();

    // Create START menu if configured
    if (navConfig.startMenu && navConfig.startMenu.length > 0) {
        createStartMenu();
    }
}

function highlightActivePage() {
    const currentPath = location.pathname.replace(/\/+$/, '');
    document.querySelectorAll('.custom-navbar a.nav-button').forEach((link) => {
        try {
            const linkPath = new URL(link.href).pathname.replace(/\/+$/, '');
            if (linkPath && linkPath === currentPath) {
                link.classList.add('active');
            }
        } catch (e) {
            // Ignore invalid URLs
        }
    });
}

function createStartMenu() {
    const menu = document.createElement('div');
    menu.className = 'start-menu';
    menu.id = 'start-menu';

    let html = `<div class="start-menu-title">${navConfig.title}</div>`;

    navConfig.startMenu.forEach((item, index) => {
        html += `<div class="start-menu-item" onclick="executeStartMenuAction(${index})">
            ${item.title}
        </div>`;
    });

    html += '<div class="start-menu-divider"></div>';
    html += `<div class="start-menu-item" onclick="window.location.href='${navConfig.mainSite}'">🗝️ Exit to Main Site</div>`;
    html += '<div class="start-menu-item" onclick="toggleStartMenu()">❌ Close</div>';

    menu.innerHTML = html;
    document.body.appendChild(menu);
}

function toggleStartMenu() {
    const menu = document.getElementById('start-menu');
    if (menu) {
        menu.classList.toggle('open');
    }
}

function executeStartMenuAction(index) {
    if (navConfig.startMenu[index] && navConfig.startMenu[index].action) {
        navConfig.startMenu[index].action();
    }
}

// Close start menu when clicking outside
document.addEventListener('click', function(e) {
    const menu = document.getElementById('start-menu');
    const startBtn = document.querySelector('.start-button');
    if (menu && menu.classList.contains('open') &&
        !menu.contains(e.target) && e.target !== startBtn) {
        menu.classList.remove('open');
    }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', generateNavbar);
} else {
    generateNavbar();
}
