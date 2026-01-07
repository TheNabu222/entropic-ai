const STORAGE_KEY = 'cavebot-save-v1';
const dom = {};

function defaultState() {
  return {
    currentScene: 'oasis',
    stats: { instinct: 2, signal: 2, resolve: 2 },
    inventory: new Set(),
    quests: new Set(),
    signalLog: [],
    completed: {},
    visited: new Set()
  };
}

const state = defaultState();

function $(id) {
  return document.getElementById(id);
}

function initGame() {
  dom.backdrop = $('backdrop');
  dom.character = $('character');
  dom.sceneTitle = $('scene-title');
  dom.hotspotLayer = $('hotspot-layer');
  dom.choices = $('choices');
  dom.speaker = $('speaker');
  dom.dialogue = $('dialogue-text');
  dom.inventoryGrid = $('inventory-grid');
  dom.questLog = $('quest-log');
  dom.signalLog = $('signal-log');
  dom.routes = $('map-routes');
  dom.clock = $('clock');
  dom.helpBtn = $('help-btn');
  dom.resetBtn = $('reset-btn');
  dom.helpOverlay = $('help-overlay');
  dom.closeHelp = $('close-help');
  dom.closeHelpFooter = $('close-help-footer');

  hydrateFromStorage();

  dom.helpBtn.addEventListener('click', toggleHelp.bind(null, true));
  dom.closeHelp.addEventListener('click', toggleHelp.bind(null, false));
  dom.closeHelpFooter.addEventListener('click', toggleHelp.bind(null, false));
  dom.helpOverlay.addEventListener('click', (e) => {
    if (e.target === dom.helpOverlay) toggleHelp(false);
  });
  dom.resetBtn.addEventListener('click', resetRun);

  updateClock();
  setInterval(updateClock, 15000);

  renderMapRoutes();
  setScene(state.currentScene);
  updateStats();
  renderInventory();
  renderQuestLog();
}

document.addEventListener('DOMContentLoaded', initGame);

function updateClock() {
  const now = new Date();
  dom.clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function setScene(sceneId) {
  const scene = SCENES[sceneId];
  if (!scene) return;
  state.currentScene = sceneId;

  dom.backdrop.style.backgroundImage = `url(${scene.background})`;
  dom.character.src = scene.sprite;
  dom.sceneTitle.textContent = scene.name;

  const firstVisit = !state.visited.has(sceneId);
  if (firstVisit) {
    addLog(scene.blurb || scene.intro);
    state.visited.add(sceneId);
  } else {
    addLog(`Returned to ${scene.name}.`);
  }

  setDialogue(scene.name, firstVisit ? scene.intro : scene.blurb || scene.intro);
  renderHotspots(scene);
  renderChoices(scene);
  renderMapRoutes();
  saveState();
}

function renderHotspots(scene) {
  dom.hotspotLayer.innerHTML = '';
  scene.hotspots.forEach((hotspot) => {
    const btn = document.createElement('button');
    btn.className = 'hotspot';
    btn.style.left = `${hotspot.position.x}%`;
    btn.style.top = `${hotspot.position.y}%`;
    btn.textContent = hotspot.label;
    if (state.completed[hotspot.id]) {
      btn.classList.add('completed');
    }
    btn.addEventListener('click', () => handleHotspot(scene, hotspot));
    dom.hotspotLayer.appendChild(btn);
  });
}

function handleHotspot(scene, hotspot) {
  const already = !!state.completed[hotspot.id];
  const requirementResult = checkRequirements(hotspot.requires);
  if (!requirementResult.ok) {
    setDialogue('SYSTEM', requirementResult.message);
    return;
  }

  const text = already && hotspot.repeatText ? hotspot.repeatText : hotspot.text;
  setDialogue(scene.name, text);

  if (!already) {
    state.completed[hotspot.id] = true;
    applyReward(hotspot.reward || {});
    renderHotspots(scene);
  }
}

function applyReward(reward) {
  if (reward.stat) {
    Object.entries(reward.stat).forEach(([key, delta]) => {
      state.stats[key] = Math.min(5, Math.max(0, (state.stats[key] || 0) + delta));
    });
    updateStats();
  }

  if (reward.item) {
    state.inventory.add(reward.item);
    addLog(`${ITEM_LIBRARY[reward.item]?.name || 'Item'} secured.`);
    renderInventory();
  }

  if (reward.quest) {
    state.quests.add(reward.quest);
    renderQuestLog();
  }

  if (reward.log) {
    addLog(reward.log);
  }

  saveState();
}

function renderInventory() {
  dom.inventoryGrid.innerHTML = '';
  state.inventory.forEach((itemId) => {
    const meta = ITEM_LIBRARY[itemId];
    const card = document.createElement('div');
    card.className = 'inventory-item';
    if (meta?.icon) {
      const img = document.createElement('img');
      img.src = meta.icon;
      img.alt = meta.name;
      card.appendChild(img);
    }
    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = meta?.name || itemId;
    card.title = meta?.description || '';
    card.appendChild(label);
    dom.inventoryGrid.appendChild(card);
  });
}

function renderQuestLog() {
  dom.questLog.innerHTML = '';
  Array.from(state.quests).forEach((quest) => {
    const row = document.createElement('div');
    row.className = 'log-entry';
    row.textContent = quest;
    dom.questLog.appendChild(row);
  });
}

function addLog(entry) {
  if (!entry) return;
  state.signalLog.unshift(entry);
  state.signalLog = state.signalLog.slice(0, 6);
  dom.signalLog.innerHTML = '';
  state.signalLog.forEach((line) => {
    const row = document.createElement('div');
    row.className = 'log-entry';
    row.textContent = line;
    dom.signalLog.appendChild(row);
  });
}

function setDialogue(speaker, text) {
  dom.speaker.textContent = speaker || 'NARRATOR';
  dom.dialogue.textContent = text || '';
}

function updateStats() {
  const max = 5;
  Object.entries(state.stats).forEach(([key, value]) => {
    const fill = document.querySelector(`.fill[data-stat="${key}"]`);
    if (fill) {
      fill.style.width = `${Math.min(100, (value / max) * 100)}%`;
    }
  });
}

function renderChoices(scene) {
  dom.choices.innerHTML = '';

  const travelIntro = document.createElement('div');
  travelIntro.className = 'log-entry';
  travelIntro.textContent = scene.blurb;
  dom.choices.appendChild(travelIntro);

  scene.travels.forEach((travel) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.textContent = travel.label;
    const canGo = checkRequirements(travel.requires);
    btn.disabled = !canGo.ok;
    btn.title = canGo.ok ? `Travel to ${travel.target}` : canGo.message;
    btn.addEventListener('click', () => setScene(travel.target));
    dom.choices.appendChild(btn);

    if (!canGo.ok && travel.requires) {
      const reqLine = document.createElement('div');
      reqLine.className = 'req-hint';
      reqLine.textContent = canGo.message;
      dom.choices.appendChild(reqLine);
    }
  });
}

function checkRequirements(requirements) {
  if (!requirements) return { ok: true };
  if (requirements.item && !state.inventory.has(requirements.item)) {
    const itemName = ITEM_LIBRARY[requirements.item]?.name || requirements.item;
    return { ok: false, message: `${itemName} required.` };
  }
  if (requirements.items) {
    const missing = requirements.items.filter((id) => !state.inventory.has(id));
    if (missing.length) {
      const names = missing.map((id) => ITEM_LIBRARY[id]?.name || id).join(', ');
      return { ok: false, message: `Missing: ${names}` };
    }
  }
  if (requirements.stats) {
    const failing = Object.entries(requirements.stats).find(([key, min]) => (state.stats[key] || 0) < min);
    if (failing) {
      return { ok: false, message: `${failing[0]} needs to be ${failing[1]}+` };
    }
  }
  return { ok: true };
}

function renderMapRoutes() {
  dom.routes.innerHTML = '';
  const currentRoutes = SCENES[state.currentScene]?.travels || [];

  Object.values(SCENES).forEach((scene) => {
    const btn = document.createElement('button');
    btn.className = 'route';
    btn.textContent = scene.name;
    btn.title = scene.blurb;
    const isCurrent = state.currentScene === scene.id;
    const routeFromCurrent = currentRoutes.find((t) => t.target === scene.id);
    const isReachable =
      isCurrent ||
      state.visited.has(scene.id) ||
      (routeFromCurrent ? checkRequirements(routeFromCurrent.requires).ok : false);

    btn.disabled = !isReachable;
    if (isCurrent) btn.classList.add('active');
    btn.addEventListener('click', () => setScene(scene.id));
    dom.routes.appendChild(btn);
  });
}

function hydrateFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    state.currentScene = parsed.currentScene || state.currentScene;
    state.stats = { ...state.stats, ...parsed.stats };
    state.inventory = new Set(parsed.inventory || []);
    state.quests = new Set(parsed.quests || []);
    state.signalLog = parsed.signalLog || [];
    state.completed = parsed.completed || {};
    state.visited = new Set(parsed.visited || []);
  } catch (err) {
    console.warn('Failed to load save state', err);
  }
}

function saveState() {
  const payload = {
    ...state,
    inventory: Array.from(state.inventory),
    quests: Array.from(state.quests),
    visited: Array.from(state.visited)
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('Could not persist state', err);
  }
}

function resetRun() {
  const fresh = defaultState();
  Object.assign(state, fresh);
  state.signalLog = [];
  saveState();
  renderInventory();
  renderQuestLog();
  updateStats();
  setScene(state.currentScene);
  addLog('Run reset. The river waits.');
}

function toggleHelp(open) {
  dom.helpOverlay.classList.toggle('visible', open);
}
