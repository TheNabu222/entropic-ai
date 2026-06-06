/* ===== APP INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  // Init all Phase 1 modules
  Assets.init();
  Canvas.init();
  Layers.init();
  Properties.init();
  Hitbox.init();
  Scenes.init();
  Project.init();
  Preview.init();
  GameExport.init();
  Shortcuts.init();

  // Init Phase 2 modules
  Toast.init();
  AIAnalysis.init();
  AssetManager.init();
  GitHubBridge.init();

  // Init Phase 3B modules
  RPGSystems.init();

  // Init Phase 3A modules
  GameFlags.init();
  Dialogue.init();
  Inventory.init();
  SaveLoad.init();
  Transitions.init();

  // Panel tab switching (both left and right panels)
  document.querySelectorAll('.panel-tabs').forEach(tabs => {
    tabs.querySelectorAll('.panel-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const panel = tabs.closest('.panel') || tabs.parentElement;
        const tabName = tab.dataset.tab;

        tabs.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        panel.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
        const target = panel.querySelector(`#tab-${tabName}`);
        if (target) target.classList.add('active');

        // Render Asset Manager when switching to Manager tab
        if (tabName === 'manager') {
          AssetManager.render();
        }

        // Phase 3A: Render tabs
        if (tabName === 'dialogue') {
          Dialogue.render(document.getElementById('dialogue-editor-container'));
        }
        if (tabName === 'inventory') {
          Inventory.render(document.getElementById('inventory-editor-container'));
        }
        if (tabName === 'flags') {
          GameFlags.render(document.getElementById('flags-editor-container'));
        }
        if (tabName === 'saveload') {
          SaveLoad.renderSettings(document.getElementById('saveload-settings-container'));
        }
        if (tabName === 'npcs') {
          RPGSystems.renderFocused(document.getElementById('npcs-editor-container'), 'npcs');
        }
        if (tabName === 'quests') {
          RPGSystems.renderFocused(document.getElementById('quests-editor-container'), 'quests');
        }
        if (tabName === 'systems') {
          RPGSystems.renderFocused(document.getElementById('systems-editor-container'), 'systems');
        }
        if (tabName === 'scenes') {
          // Render transition settings for active scene
          if (State.project.activeSceneId) {
            Transitions.renderSceneSettings(
              document.getElementById('scene-transition-settings'),
              State.project.activeSceneId
            );
          }
        }
      });
    });
  });

  // Undo/Redo buttons
  document.getElementById('btn-undo').addEventListener('click', () => {
    if (State.undo()) Project.refreshAll();
  });
  document.getElementById('btn-redo').addEventListener('click', () => {
    if (State.redo()) Project.refreshAll();
  });

  // Grid/Snap buttons
  document.getElementById('btn-grid-toggle').addEventListener('click', () => Canvas.toggleGrid());
  document.getElementById('btn-snap-toggle').addEventListener('click', () => Canvas.toggleSnap());

  // GitHub Bridge button
  document.getElementById('btn-github').addEventListener('click', () => GitHubBridge.show());

  // Asset Manager button (gear icon in Assets tab)
  document.getElementById('btn-asset-manager').addEventListener('click', () => {
    // Switch to Manager tab
    const leftPanel = document.getElementById('left-panel');
    leftPanel.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
    leftPanel.querySelector('.panel-tab[data-tab="manager"]').classList.add('active');
    leftPanel.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
    document.getElementById('tab-manager').classList.add('active');
    AssetManager.render();
  });

  // Try to load autosave, else create fresh project
  if (!State.loadAutoSave() || !State.project.scenes.length) {
    const scene = State.createScene('Scene 1');
    State.project.activeSceneId = scene.id;
  }
  if (!State.project.activeSceneId && State.project.scenes.length) {
    State.project.activeSceneId = State.project.scenes[0].id;
  }

  // Ensure Phase 3B data structures exist on loaded projects
  RPGSystems.ensureData();

  // Ensure Phase 3A data structures exist on loaded projects
  if (!State.project.dialogueTrees) State.project.dialogueTrees = [];
  if (!State.project.inventoryItems) State.project.inventoryItems = [];
  if (!State.project.flags) State.project.flags = [];
  if (!State.project.saveLoadSettings) {
    State.project.saveLoadSettings = { autoSave: true, autoSaveOnTransition: true, maxSlots: 5, showSaveLoadUI: true };
  }
  if (!State.project.inventoryUI) State.project.inventoryUI = { style: 'bar', slotSize: 40, position: 'bottom' };
  if (!State.project.questUI) State.project.questUI = { showPanel: true, pinTracked: true, accent: '#7c5cfc' };

  // Ensure scenes have transition data
  Transitions.ensureSceneTransitions();

  Project.refreshAll();

  // Auto-save every 30 seconds
  setInterval(() => State.autoSave(), 30000);

  console.log('⚔ Anzu Game Studio loaded. Phase 1 + Phase 2 + Phase 3A + Phase 3B ready.');
});
