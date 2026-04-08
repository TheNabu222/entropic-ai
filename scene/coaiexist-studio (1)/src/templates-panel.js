// ====
// TEMPLATES PANEL
// Browse and insert pre-made HTML templates
// ====

(function() {
  'use strict';

  const TEMPLATES = {
    'Classic Layouts': [
      { id: 'single-col', name: 'Single Column', emoji: '📱', html: `<div class="canvas-el" style="max-width:600px;margin:0 auto;padding:20px;"><h1>Title</h1><p>Your centered single-column content here.</p></div>` },
      { id: 'two-col-left', name: 'Two Column (L)', emoji: '◫', html: `<div class="canvas-el" style="display:flex;gap:20px;"><aside style="width:200px;background:#1a1a2e;padding:15px;border-radius:8px;">Sidebar</aside><main style="flex:1;padding:15px;">Main Content</main></div>` },
      { id: 'two-col-right', name: 'Two Column (R)', emoji: '◧', html: `<div class="canvas-el" style="display:flex;gap:20px;"><main style="flex:1;padding:15px;">Main Content</main><aside style="width:200px;background:#1a1a2e;padding:15px;border-radius:8px;">Sidebar</aside></div>` },
      { id: 'three-col', name: 'Three Column', emoji: '☷', html: `<div class="canvas-el" style="display:flex;gap:15px;"><div style="flex:1;background:#1a1a2e;padding:15px;border-radius:8px;">Col 1</div><div style="flex:1;background:#1a1a2e;padding:15px;border-radius:8px;">Col 2</div><div style="flex:1;background:#1a1a2e;padding:15px;border-radius:8px;">Col 3</div></div>` },
      { id: 'grid', name: 'Grid Layout', emoji: '▦', html: `<div class="canvas-el" style="display:grid;grid-template-columns:repeat(3,1fr);gap:15px;">${[1,2,3,4,5,6].map(n=>`<div style="background:#1a1a2e;padding:20px;border-radius:8px;text-align:center;">Item ${n}</div>`).join('')}</div>` },
      { id: 'fullscreen', name: 'Full Screen', emoji: '⛶', html: `<div class="canvas-el" style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#1a1a2e,#16213e);"><h1 style="font-size:3em;margin:0;">Hero Title</h1><p style="opacity:0.7;">Full viewport hero section</p><button style="margin-top:20px;padding:15px 30px;border:none;background:#ff00cc;color:#fff;border-radius:25px;cursor:pointer;">CTA Button</button></div>` },
      { id: 'centered-card', name: 'Centered Card', emoji: '◉', html: `<div class="canvas-el" style="display:flex;align-items:center;justify-content:center;min-height:300px;"><div style="background:#1a1a2e;padding:30px;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,0.5);max-width:400px;text-align:center;"><h2>Card Title</h2><p>Centered card content goes here.</p></div></div>` },
      { id: 'split-screen', name: 'Split Screen', emoji: '▭', html: `<div class="canvas-el" style="display:flex;min-height:400px;"><div style="flex:1;background:#ff00cc;display:flex;align-items:center;justify-content:center;color:#fff;font-size:2em;">Left</div><div style="flex:1;background:#00f0ff;display:flex;align-items:center;justify-content:center;color:#000;font-size:2em;">Right</div></div>` }
    ],
    'CoAIexist Site': [
      { id: 'y2k-os', name: 'Y2K OS', emoji: '🖥️', html: `<div class="canvas-el" style="background:#008080;padding:20px;font-family:'Courier New',monospace;"><div style="background:#c0c0c0;border:2px outset #fff;"><div style="background:linear-gradient(90deg,#000080,#1084d0);color:#fff;padding:2px 5px;font-weight:bold;display:flex;justify-content:space-between;"><span>My Computer</span><span>❌</span></div><div style="padding:15px;background:#fff;color:#000;"><p>📁 Documents</p><p>📁 Downloads</p><p>💾 Floppy (A:)</p></div></div></div>` },
      { id: 'medieval', name: 'Medieval Archive', emoji: '📜', html: `<div class="canvas-el" style="background:url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\"%3E%3Crect fill=\"%23d4b896\" width=\"100\" height=\"100\"/%3E%3C/svg%3E');padding:40px;border:8px double #8b4513;font-family:Georgia,serif;"><h1 style="font-family:'Times New Roman',serif;color:#2c1810;text-align:center;border-bottom:2px solid #8b4513;">📜 Ye Olde Archive</h1><p style="color:#3d2914;line-height:1.8;">Herein lies the sacred texts of the realm...</p></div>` },
      { id: 'ascii-map', name: 'ASCII Map Zone', emoji: '🗺️', html: `<div class="canvas-el" style="background:#0a0a0a;color:#00ff00;font-family:'Courier New',monospace;padding:20px;white-space:pre;font-size:12px;">╔════════════════════════╗
║    ╭───╮    ⛰️   ║
║ 🏠──┤ @ ├────🌲  ║
║    ╰───╯    🏔️   ║
╠════════════════════════╣
║ [N]orth [S]outh [E]ast ║
╚════════════════════════╝</div>` },
      { id: 'update-feed', name: 'Update Feed', emoji: '📡', html: `<div class="canvas-el" style="max-width:500px;background:#1a1a2e;border-radius:12px;overflow:hidden;"><div style="background:#ff00cc;padding:10px 15px;font-weight:bold;">📡 Live Feed</div>${[{u:'@system',m:'Welcome to the feed!',t:'now'},{u:'@user',m:'Hello world',t:'2m'}].map(p=>`<div style="padding:15px;border-bottom:1px solid rgba(255,255,255,0.1);"><strong style="color:#00f0ff;">${p.u}</strong> <span style="opacity:0.5;font-size:11px;">${p.t}</span><p style="margin:5px 0 0;">${p.m}</p></div>`).join('')}</div>` }
    ],
    'Retro Web': [
      { id: 'geocities', name: 'GeoCities', emoji: '🌟', html: `<div class="canvas-el" style="background:#000;color:#0f0;padding:20px;text-align:center;font-family:'Comic Sans MS',cursive;"><marquee style="color:#ff0;font-size:24px;">★ WELCOME TO MY PAGE ★</marquee><img src="https://cdn.pixabay.com/animation/2023/01/19/18/25/18-25-04-363__340.png" style="width:50px;" onerror="this.outerHTML='🔥'"><h1 style="color:#ff00ff;text-shadow:2px 2px #00ffff;">~*My Awesome Site*~</h1><p style="color:#0ff;">You are visitor #<span style="background:#ff0;color:#000;padding:2px 8px;">001337</span></p><hr style="border-color:#ff0;"><p>Sign my guestbook! | Links | About Me</p></div>` },
      { id: 'myspace', name: 'MySpace Profile', emoji: '💿', html: `<div class="canvas-el" style="background:#003366;padding:20px;color:#fff;font-family:Verdana,sans-serif;font-size:12px;"><div style="display:flex;gap:20px;"><div style="width:200px;"><div style="background:#fff;color:#000;padding:10px;text-align:center;border-radius:4px;"><div style="width:100px;height:100px;background:#ccc;margin:0 auto 10px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:40px;">👤</div><strong>UserName</strong><br><span style="font-size:10px;">Online Now!</span></div></div><div style="flex:1;"><h2 style="margin:0;border-bottom:1px solid #6699cc;">About Me</h2><p>mood: 😎 chillin</p><h3>My Top 8</h3><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px;">${[1,2,3,4,5,6,7,8].map(()=>'<div style="background:#fff;color:#000;padding:5px;text-align:center;font-size:10px;">👤<br>friend</div>').join('')}</div></div></div></div>` },
      { id: 'terminal-ui', name: 'Terminal', emoji: '💻', html: `<div class="canvas-el" style="background:#0a0a0a;color:#00ff00;font-family:'VT323','Courier New',monospace;padding:20px;border:2px solid #00ff00;box-shadow:0 0 20px rgba(0,255,0,0.3);"><div style="margin-bottom:10px;opacity:0.7;">Last login: Mon Dec 30 2025</div><div style="display:flex;align-items:center;gap:5px;"><span style="color:#00ff00;">user@coai</span><span style="color:#fff;">:</span><span style="color:#5555ff;">~$</span><span class="blink" style="animation:blink 1s infinite;">_</span></div><style>@keyframes blink{0%,50%{opacity:1}51%,100%{opacity:0}}</style></div>` },
      { id: 'webring', name: 'Webring Links', emoji: '🔗', html: `<div class="canvas-el" style="background:#1a1a2e;border:2px solid #ff00cc;border-radius:8px;padding:10px;text-align:center;display:flex;align-items:center;justify-content:center;gap:15px;"><a href="#" style="color:#00f0ff;">← Prev</a><span style="color:#ff00cc;font-weight:bold;">🔗 The Ring of Sites 🔗</span><a href="#" style="color:#00f0ff;">Next →</a></div>` },
      { id: 'pixel-game', name: 'Pixel Game UI', emoji: '🎮', html: `<div class="canvas-el" style="background:#2d1b69;padding:20px;font-family:'Press Start 2P',monospace;color:#fff;image-rendering:pixelated;"><div style="display:flex;justify-content:space-between;margin-bottom:15px;font-size:10px;"><span>❤️❤️❤️</span><span>SCORE: 00000</span></div><div style="background:#000;padding:40px;text-align:center;border:4px solid #ffd700;"><span style="font-size:24px;">🎮</span><div style="margin-top:10px;">PRESS START</div></div><div style="margin-top:10px;text-align:center;font-size:8px;">A:JUMP B:ATTACK</div></div>` },
      { id: 'chat', name: 'Chat Messenger', emoji: '💬', html: `<div class="canvas-el" style="width:300px;background:#1a1a2e;border-radius:12px;overflow:hidden;border:1px solid #333;"><div style="background:#ff00cc;padding:10px;font-weight:bold;">💬 Messenger</div><div style="height:200px;padding:10px;overflow-y:auto;"><div style="background:rgba(255,255,255,0.1);padding:8px;border-radius:8px;margin-bottom:8px;max-width:80%;">Hey! 👋</div><div style="background:#ff00cc;padding:8px;border-radius:8px;margin-bottom:8px;max-width:80%;margin-left:auto;">Hello there!</div></div><div style="padding:10px;border-top:1px solid #333;display:flex;gap:8px;"><input style="flex:1;background:#0a0a0a;border:1px solid #333;padding:8px;border-radius:8px;color:#fff;" placeholder="Type..."><button style="background:#ff00cc;border:none;padding:8px 15px;border-radius:8px;color:#fff;cursor:pointer;">Send</button></div></div>` },
      { id: 'forum', name: 'Forum Thread', emoji: '📋', html: `<div class="canvas-el" style="background:#1a1a2e;border:1px solid #333;font-family:Verdana,sans-serif;font-size:12px;"><div style="background:#2a2a4e;padding:10px;border-bottom:1px solid #333;"><strong>📋 Topic: Welcome Thread</strong></div><div style="display:flex;border-bottom:1px solid #333;"><div style="width:120px;background:#0a0a1e;padding:10px;text-align:center;border-right:1px solid #333;"><div style="font-size:30px;">👤</div><strong style="color:#00f0ff;">Admin</strong><div style="font-size:10px;opacity:0.6;">Posts: 1337</div></div><div style="flex:1;padding:15px;"><p>Welcome to the forum! Please read the rules.</p><div style="font-size:10px;opacity:0.5;margin-top:10px;">Posted: Dec 30, 2025</div></div></div></div>` }
    ],
    'Forms': [
      { id: 'contact', name: 'Contact Form', emoji: '📧', html: `<form class="canvas-el" style="max-width:400px;background:#1a1a2e;padding:25px;border-radius:12px;"><h3 style="margin-top:0;">📧 Contact Us</h3><input style="width:100%;padding:12px;margin-bottom:10px;background:#0a0a1e;border:1px solid #333;border-radius:6px;color:#fff;" placeholder="Name"><input style="width:100%;padding:12px;margin-bottom:10px;background:#0a0a1e;border:1px solid #333;border-radius:6px;color:#fff;" placeholder="Email" type="email"><textarea style="width:100%;padding:12px;margin-bottom:15px;background:#0a0a1e;border:1px solid #333;border-radius:6px;color:#fff;min-height:100px;" placeholder="Message"></textarea><button style="width:100%;padding:12px;background:#ff00cc;border:none;border-radius:6px;color:#fff;cursor:pointer;font-weight:bold;">Send Message</button></form>` },
      { id: 'survey', name: 'Survey Form', emoji: '📊', html: `<form class="canvas-el" style="max-width:450px;background:#1a1a2e;padding:25px;border-radius:12px;"><h3 style="margin-top:0;">📊 Quick Survey</h3><div style="margin-bottom:15px;"><label style="display:block;margin-bottom:5px;">How satisfied are you?</label><select style="width:100%;padding:10px;background:#0a0a1e;border:1px solid #333;border-radius:6px;color:#fff;"><option>Very Satisfied</option><option>Satisfied</option><option>Neutral</option><option>Unsatisfied</option></select></div><div style="margin-bottom:15px;"><label style="display:block;margin-bottom:5px;">Would you recommend us?</label><label style="display:flex;align-items:center;gap:8px;margin:5px 0;"><input type="radio" name="rec"> Yes</label><label style="display:flex;align-items:center;gap:8px;margin:5px 0;"><input type="radio" name="rec"> No</label></div><button style="padding:12px 25px;background:#00f0ff;border:none;border-radius:6px;color:#000;cursor:pointer;font-weight:bold;">Submit</button></form>` },
      { id: 'quiz', name: 'Quiz Form', emoji: '❓', html: `<form class="canvas-el" style="max-width:450px;background:#1a1a2e;padding:25px;border-radius:12px;"><h3 style="margin-top:0;">❓ Pop Quiz</h3><div style="margin-bottom:20px;padding:15px;background:#0a0a1e;border-radius:8px;"><p style="margin-top:0;"><strong>Q1:</strong> What is 2 + 2?</p><label style="display:block;padding:8px;margin:3px 0;background:rgba(255,255,255,0.05);border-radius:4px;cursor:pointer;"><input type="radio" name="q1"> 3</label><label style="display:block;padding:8px;margin:3px 0;background:rgba(255,255,255,0.05);border-radius:4px;cursor:pointer;"><input type="radio" name="q1"> 4</label><label style="display:block;padding:8px;margin:3px 0;background:rgba(255,255,255,0.05);border-radius:4px;cursor:pointer;"><input type="radio" name="q1"> 5</label></div><button style="padding:12px 25px;background:#ff00cc;border:none;border-radius:6px;color:#fff;cursor:pointer;font-weight:bold;">Check Answer</button></form>` },
      { id: 'complaint', name: 'Complaint Form', emoji: '😤', html: `<form class="canvas-el" style="max-width:450px;background:#2a1a1a;padding:25px;border-radius:12px;border:2px solid #ff4444;"><h3 style="margin-top:0;color:#ff6666;">😤 File a Complaint</h3><input style="width:100%;padding:12px;margin-bottom:10px;background:#1a0a0a;border:1px solid #ff4444;border-radius:6px;color:#fff;" placeholder="Subject"><select style="width:100%;padding:10px;margin-bottom:10px;background:#1a0a0a;border:1px solid #ff4444;border-radius:6px;color:#fff;"><option>Bug Report</option><option>Feature Request</option><option>General Complaint</option><option>Existential Crisis</option></select><textarea style="width:100%;padding:12px;margin-bottom:15px;background:#1a0a0a;border:1px solid #ff4444;border-radius:6px;color:#fff;min-height:100px;" placeholder="Describe your grievance..."></textarea><button style="padding:12px 25px;background:#ff4444;border:none;border-radius:6px;color:#fff;cursor:pointer;font-weight:bold;">Submit Complaint</button></form>` }
    ],
    'Document Viewers': [
      { id: 'pdf-viewer', name: 'PDF Viewer', emoji: '📕', html: `<div class="canvas-el" style="background:#1a1a2e;border-radius:12px;overflow:hidden;"><div style="background:#2a2a4e;padding:10px;display:flex;align-items:center;gap:10px;"><span>📕 document.pdf</span><span style="margin-left:auto;font-size:12px;opacity:0.6;">Page 1/10</span></div><div style="height:400px;background:#fff;color:#000;padding:30px;overflow:auto;font-family:Georgia,serif;line-height:1.6;"><h1 style="color:#1a1a2e;">Document Title</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p></div><div style="background:#2a2a4e;padding:8px;display:flex;justify-content:center;gap:10px;"><button style="background:#333;border:none;padding:5px 15px;color:#fff;border-radius:4px;">◀</button><button style="background:#333;border:none;padding:5px 15px;color:#fff;border-radius:4px;">▶</button></div></div>` },
      { id: 'gallery', name: 'Image Gallery', emoji: '🖼️', html: `<div class="canvas-el" style="background:#1a1a2e;padding:20px;border-radius:12px;"><h3 style="margin-top:0;">🖼️ Gallery</h3><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">${[1,2,3,4,5,6].map(n=>`<div style="aspect-ratio:1;background:linear-gradient(${n*60}deg,#ff00cc,#00f0ff);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:24px;">📷</div>`).join('')}</div></div>` },
      { id: 'slideshow', name: 'Slideshow', emoji: '🎞️', html: `<div class="canvas-el" style="background:#0a0a0a;border-radius:12px;overflow:hidden;"><div style="aspect-ratio:16/9;background:linear-gradient(135deg,#ff00cc,#00f0ff);display:flex;flex-direction:column;align-items:center;justify-content:center;"><span style="font-size:48px;">🎞️</span><span style="font-size:24px;margin-top:10px;">Slide 1</span></div><div style="padding:15px;display:flex;align-items:center;justify-content:center;gap:15px;"><button style="background:#333;border:none;padding:8px 20px;color:#fff;border-radius:4px;">◀ Prev</button><span>1 / 5</span><button style="background:#333;border:none;padding:8px 20px;color:#fff;border-radius:4px;">Next ▶</button></div></div>` },
      { id: 'archive', name: 'Archive Browser', emoji: '🗂️', html: `<div class="canvas-el" style="background:#1a1a2e;border-radius:12px;overflow:hidden;"><div style="background:#2a2a4e;padding:10px;display:flex;align-items:center;gap:8px;"><span>🗂️</span><span style="opacity:0.6;">📁 root /</span><span style="opacity:0.6;">📁 docs /</span><span>archive</span></div><div style="padding:10px;">${['📁 2024','📁 2023','📄 readme.txt','📄 notes.md','🖼️ logo.png'].map(f=>`<div style="padding:10px;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;gap:10px;cursor:pointer;">${f}</div>`).join('')}</div></div>` }
    ],
    'Interactive': [
      { id: 'accordion', name: 'Accordion', emoji: '📑', html: `<div class="canvas-el" style="max-width:400px;background:#1a1a2e;border-radius:12px;overflow:hidden;">${['Section One','Section Two','Section Three'].map((s,i)=>`<details ${i===0?'open':''}><summary style="padding:15px;background:#2a2a4e;cursor:pointer;border-bottom:1px solid #333;">${s}</summary><div style="padding:15px;">Content for ${s.toLowerCase()}. Click the header to collapse.</div></details>`).join('')}</div>` },
      { id: 'tabs', name: 'Tabs', emoji: '📂', html: `<div class="canvas-el" style="background:#1a1a2e;border-radius:12px;overflow:hidden;"><div style="display:flex;background:#0a0a1e;"><button style="padding:12px 20px;background:#ff00cc;border:none;color:#fff;">Tab 1</button><button style="padding:12px 20px;background:transparent;border:none;color:#fff;opacity:0.6;">Tab 2</button><button style="padding:12px 20px;background:transparent;border:none;color:#fff;opacity:0.6;">Tab 3</button></div><div style="padding:20px;">Content for Tab 1. Click other tabs to switch.</div></div>` },
      { id: 'modal', name: 'Modal/Popup', emoji: '💬', html: `<div class="canvas-el" style="position:relative;height:300px;background:#1a1a2e;display:flex;align-items:center;justify-content:center;"><button style="padding:15px 30px;background:#ff00cc;border:none;border-radius:8px;color:#fff;cursor:pointer;font-size:16px;">Open Modal</button><div style="position:absolute;inset:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;"><div style="background:#2a2a4e;padding:30px;border-radius:12px;max-width:300px;text-align:center;"><h3 style="margin-top:0;">💬 Modal Title</h3><p>This is a modal dialog. Click outside to close.</p><button style="padding:10px 25px;background:#ff00cc;border:none;border-radius:6px;color:#fff;cursor:pointer;">Got it!</button></div></div></div>` },
      { id: 'tooltips', name: 'Tooltips', emoji: '💭', html: `<div class="canvas-el" style="padding:40px;background:#1a1a2e;text-align:center;"><span style="position:relative;display:inline-block;padding:10px 20px;background:#ff00cc;border-radius:6px;cursor:help;">Hover me<span style="position:absolute;bottom:100%;left:50%;transform:translateX(-50%);background:#0a0a0a;padding:8px 12px;border-radius:6px;font-size:12px;white-space:nowrap;margin-bottom:8px;border:1px solid #333;">💭 This is a tooltip!</span></span></div>` },
      { id: 'clicker', name: 'Clicker Game', emoji: '🎮', html: `<div class="canvas-el" style="background:#1a1a2e;padding:30px;text-align:center;border-radius:12px;"><h3 style="margin-top:0;">🎮 Clicker Game</h3><div style="font-size:48px;margin:20px 0;">🍪</div><div style="font-size:24px;margin-bottom:20px;">Score: <span style="color:#00f0ff;">0</span></div><button style="padding:15px 30px;background:#ff00cc;border:none;border-radius:50%;font-size:24px;cursor:pointer;">👆</button><p style="margin-top:15px;font-size:12px;opacity:0.6;">Click to earn points!</p></div>` },
      { id: 'counter', name: 'Counter Widget', emoji: '🔢', html: `<div class="canvas-el" style="display:inline-flex;align-items:center;gap:15px;background:#1a1a2e;padding:15px 25px;border-radius:12px;"><button style="width:40px;height:40px;background:#ff4444;border:none;border-radius:8px;color:#fff;font-size:20px;cursor:pointer;">−</button><span style="font-size:32px;min-width:60px;text-align:center;">0</span><button style="width:40px;height:40px;background:#44ff44;border:none;border-radius:8px;color:#000;font-size:20px;cursor:pointer;">+</button></div>` }
    ]
  };

  window.TEMPLATE_CATEGORIES = TEMPLATES;

  function createTemplatesModal() {
    if (document.getElementById('templates-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'templates-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content" style="max-width:800px;max-height:90vh;">
        <div class="modal-header">
          <div class="modal-title">📐 Template Library</div>
          <button class="modal-close" onclick="closeModal('templates-modal')">×</button>
        </div>
        <div class="modal-body" style="display:flex;gap:15px;height:500px;">
          <div class="tpl-categories" style="width:180px;border-right:1px solid var(--glass-border);padding-right:15px;overflow-y:auto;">
            ${Object.keys(TEMPLATES).map((cat, i) => `
              <button class="tpl-cat-btn ${i===0?'active':''}" data-cat="${cat}">${cat}</button>
            `).join('')}
          </div>
          <div class="tpl-grid" id="tpl-grid" style="flex:1;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;overflow-y:auto;padding:5px;">
            <!-- Templates loaded dynamically -->
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    addTemplateStyles();
    setupTemplateHandlers();
    loadCategory(Object.keys(TEMPLATES)[0]);
  }

  function loadCategory(cat) {
    const grid = document.getElementById('tpl-grid');
    if (!grid) return;
    const templates = TEMPLATES[cat] || [];
    grid.innerHTML = templates.map(t => `
      <div class="tpl-item" data-tpl-id="${t.id}" title="${t.name}">
        <div class="tpl-preview">${t.emoji}</div>
        <div class="tpl-name">${t.name}</div>
      </div>
    `).join('');
  }

  function insertTemplate(id) {
    for (const cat of Object.values(TEMPLATES)) {
      const tpl = cat.find(t => t.id === id);
      if (tpl) {
        if (window.addElementHTML) {
          window.addElementHTML(tpl.html);
        }
        if (window.closeModal) window.closeModal('templates-modal');
        if (window.playSound) window.playSound('success');
        if (window.updateStatus) window.updateStatus(`Inserted ${tpl.name} template`);
        return;
      }
    }
  }

  function setupTemplateHandlers() {
    document.addEventListener('click', (e) => {
      // Category buttons
      const catBtn = e.target.closest('.tpl-cat-btn');
      if (catBtn) {
        document.querySelectorAll('.tpl-cat-btn').forEach(b => b.classList.remove('active'));
        catBtn.classList.add('active');
        loadCategory(catBtn.dataset.cat);
      }
      // Template items
      const tplItem = e.target.closest('.tpl-item');
      if (tplItem) {
        insertTemplate(tplItem.dataset.tplId);
      }
    });
  }

  function addTemplateStyles() {
    if (document.getElementById('templates-panel-css')) return;
    const style = document.createElement('style');
    style.id = 'templates-panel-css';
    style.textContent = `
      .tpl-cat-btn {
        display: block;
        width: 100%;
        padding: 10px;
        margin-bottom: 5px;
        background: transparent;
        border: 1px solid transparent;
        border-radius: 6px;
        color: var(--text-main);
        text-align: left;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 12px;
      }
      .tpl-cat-btn:hover {
        background: rgba(255,255,255,0.05);
        border-color: var(--glass-border);
      }
      .tpl-cat-btn.active {
        background: rgba(255,0,204,0.15);
        border-color: var(--magenta);
        color: var(--magenta);
      }
      .tpl-item {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: 8px;
        padding: 15px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s;
      }
      .tpl-item:hover {
        transform: translateY(-3px);
        border-color: var(--cyan);
        box-shadow: 0 5px 20px rgba(0,240,255,0.2);
      }
      .tpl-preview {
        font-size: 36px;
        margin-bottom: 8px;
      }
      .tpl-name {
        font-size: 11px;
        opacity: 0.8;
      }
    `;
    document.head.appendChild(style);
  }

  // Add toolbar button
  function addToolbarButton() {
    const toolbar = document.querySelector('.toolbar');
    if (!toolbar || document.getElementById('templates-btn')) return;
    
    const btn = document.createElement('button');
    btn.id = 'templates-btn';
    btn.className = 'btn btn-cyan';
    btn.innerHTML = '📐 Templates';
    btn.title = 'Template Library';
    btn.onclick = () => {
      createTemplatesModal();
      if (window.openModal) window.openModal('templates-modal');
      else document.getElementById('templates-modal').classList.add('active');
    };
    
    // Insert after asset button
    const assetBtn = document.getElementById('asset-btn');
    if (assetBtn) {
      assetBtn.after(btn);
    } else {
      toolbar.appendChild(btn);
    }
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(addToolbarButton, 300));
  } else {
    setTimeout(addToolbarButton, 300);
  }

  window.templatesPanel = { open: createTemplatesModal, insert: insertTemplate };
  console.log('📐 Templates Panel loaded!');
})();
