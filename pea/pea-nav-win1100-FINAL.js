// WINDOWS 1100 AD - MEDIEVAL OS TASKBAR - SINGLE LINE EDITION
// Maximum Windows 95 energy with medieval flavor!

const peaNav = {
    mainSite: 'https://coaiexist.wtf/',
    baseUrl: 'https://coaiexist.wtf/pea/',
    pages: [
        { title: 'Main Story', url: 'p345.html', icon: '📜' },
        { title: 'Complaint Form', url: 'complaint-form.html', icon: '📋' },
        { title: 'Mantis Shrimp Radio', url: 'msicc.html', icon: '🦐️' },
        { title: 'The Deepstate', url: 'deepstate.html', icon: '🎙' },
        { title: 'The Shallowcommons', url: 'left_foot.html', icon: '📚' },
        { title: 'Royal Documentation', url: 'royal_ridicuments.html', icon: '📄' },
        { title: 'Which-Doctor Quiz', url: 'which-dr_quiz.html', icon: '⚕️' },
        { title: 'Floating Peas', url: 'pod.html', icon: '🫛' },
        { title: 'News Ticker', url: 'news_ticker-offer.html', icon: '📺' },
        { title: 'Princess Exe', url: 'princessexe.html', icon: '👑' },
        { title: '/p/ Board', url: 'p.html', icon: '💬' }
    ],
    pips: [
        { title: 'Pip #1', url: 'pips/pip_1', icon: '🐸' },
        { title: 'Pip #2', url: 'pips/pip_2', icon: '🐸' },
        { title: 'Pip #3', url: 'pips/pip_3', icon: '🐸' }
    ]
};

function generateMedievalTaskbar() {
    // Create taskbar
    const bar = document.createElement('footer');
    bar.className = 'medieval-taskbar';

    let html = '';
    // START button
    html += '<button class="start-btn" onclick="toggleStartMenu()">START</button>';
    html += '<div class="divider"></div>';

    // Back to main site
    html += `<a href="${peaNav.mainSite}" class="back-main"><span class="icon">↩</span>COAIEXIST.WTF</a>`;
    html += '<div class="divider"></div>';

    // Title badge
    html += '<div class="nav-title">🫛 PEA PRINCESS PARABLE 👑</div>';
    html += '<div class="divider"></div>';

    // Pages
    peaNav.pages.forEach((pg) => {
        html += `<a href="${peaNav.baseUrl}${pg.url}" class="nav-link">
            <span class="icon">${pg.icon}</span>${pg.title}
        </a>`;
    });

    html += '<div class="divider"></div>';

    // Pips
    peaNav.pips.forEach((pip) => {
        html += `<a href="${peaNav.baseUrl}${pip.url}" class="pip-link">
            <span class="icon">${pip.icon}</span>${pip.title}
        </a>`;
    });

    bar.innerHTML = html;
    document.body.appendChild(bar);

    // Create START menu popup
    createStartMenu();
}

function createStartMenu() {
    const menu = document.createElement('div');
    menu.className = 'start-menu';
    menu.id = 'start-menu';

    let html = '<div class="start-menu-title">🏰 Windows 1100 AD</div>';

    html += '<div class="start-menu-item" onclick="alert(\'👑 Princess is AFK (Forgotten Name)\\n\\nPlease try again in 3-5 business lifetimes.\')">👑 Royal Status</div>';
    html += '<div class="start-menu-item" onclick="alert(\'📄 Documentation Level: PALIMPSEST\\n\\nThoroughly documented for 3,200 years.\')">📄 Documentation Stats</div>';
    html += '<div class="start-menu-item" onclick="alert(\'🫛 Pea Status: Still There\\n\\nNot pea-brain. Pea ON brain.\')">🫛 Pea Diagnostics</div>';
    html += '<div class="start-menu-divider"></div>';
    html += '<div class="start-menu-item" onclick="alert(\'🦐 Census Result: 47 or 89 (Disputed)\\n\\nUnauthorized resident #48 detected.\')">🦐 Census Data</div>';
    html += '<div class="start-menu-item" onclick="alert(\'⚕️ Which-Doctor Status: Confused\\n\\nNone of them know which one you saw.\')">⚕️ Medical Records</div>';
    html += '<div class="start-menu-divider"></div>';
    html += `<div class="start-menu-item" onclick="window.location.href='${peaNav.mainSite}'">🗝️ Exit to Main Site</div>`;
    html += '<div class="start-menu-item" onclick="toggleStartMenu()">❌ Close</div>';

    menu.innerHTML = html;
    document.body.appendChild(menu);
}

function toggleStartMenu() {
    const menu = document.getElementById('start-menu');
    menu.classList.toggle('open');
}

// Close start menu if clicking outside
document.addEventListener('click', function(e) {
    const menu = document.getElementById('start-menu');
    const startBtn = document.querySelector('.start-btn');
    if (menu && menu.classList.contains('open') && 
        !menu.contains(e.target) && e.target !== startBtn) {
        menu.classList.remove('open');
    }
});

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', generateMedievalTaskbar);
} else {
    generateMedievalTaskbar();
}
