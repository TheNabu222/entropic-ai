/* ===== PREVIEW MODE (Phase 3A Enhanced) ===== */
const Preview = {
  overlay: null,
  previewStage: null,
  currentSceneId: null,
  dialogueEl: null,

  // Phase 3A runtime state
  runtimeFlags: {},
  playerInventory: [],   // [{ itemId, count }]
  dialogueProgress: {},  // { treeId: lastNodeId }
  objectStates: {},      // { objectId: { pickedUp, used } }
  selectedInvItem: null,

  // Phase 3B runtime state
  rpgState: null, // { needs, reputation, quests, skills, time, statusEffects, npcStates }
  _timeInterval: null,

  init() {
    this.overlay = document.getElementById('preview-overlay');
    this.previewStage = document.getElementById('preview-stage');

    document.getElementById('btn-preview').addEventListener('click', () => this.enter());
    document.getElementById('btn-exit-preview').addEventListener('click', () => this.exit());
  },

  enter() {
    State.isPreviewMode = true;
    this.overlay.hidden = false;
    this.currentSceneId = State.project.activeSceneId;

    // Initialize Phase 3A runtime
    this.runtimeFlags = GameFlags.createRuntimeState();
    this.playerInventory = [];
    this.dialogueProgress = {};
    this.objectStates = {};
    this.selectedInvItem = null;

    // Initialize Phase 3B runtime
    this.rpgState = RPGSystems.createRuntimeState();

    // Start time auto-advance if enabled
    this._startTimeLoop();

    this.renderPreviewScene(this.currentSceneId);
  },

  exit() {
    State.isPreviewMode = false;
    this.overlay.hidden = true;
    this.previewStage.innerHTML = '';
    this.dialogueEl = null;
    this.selectedInvItem = null;
    if (this._timeInterval) { clearInterval(this._timeInterval); this._timeInterval = null; }
  },

  _startTimeLoop() {
    if (this._timeInterval) clearInterval(this._timeInterval);
    const dnCfg = DayNight.getConfig();
    if (!dnCfg.enabled || !dnCfg.hoursPerRealSecond) return;
    const minsPerSecond = dnCfg.hoursPerRealSecond * 60;
    this._timeInterval = setInterval(() => {
      if (!this.rpgState) return;
      DayNight.advanceTime(this.rpgState.time, minsPerSecond / 10); // 10fps update
      // Decay needs
      const warnings = NeedsTracker.decayNeeds(this.rpgState.needs, 0.1);
      // Tick status effects
      StatusEffects.tickEffects(this.rpgState.statusEffects, this.rpgState.needs, this.rpgState.skills);
      // Update HUD
      this._updateRPGHUD();
    }, 100);
  },

  renderPreviewScene(sceneId, transitionType, transitionDuration) {
    const scene = State.project.scenes.find(s => s.id === sceneId);
    if (!scene) return;

    const prevSceneId = this.currentSceneId;
    this.currentSceneId = sceneId;

    // Determine transition
    const trans = transitionType || scene.transition?.type || 'none';
    const dur = transitionDuration || scene.transition?.duration || 0.5;

    if (trans !== 'none' && prevSceneId !== sceneId) {
      this._doTransition(trans, dur, () => this._renderScene(scene));
    } else {
      this._renderScene(scene);
    }
  },

  _doTransition(type, duration, callback) {
    const container = this.previewStage;
    const overlay = document.createElement('div');
    overlay.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;z-index:10001;pointer-events:none;`;
    const dur = duration * 1000;

    switch (type) {
      case 'fade-black':
        overlay.style.background = '#000';
        overlay.animate([{opacity:0},{opacity:1,offset:0.4},{opacity:1,offset:0.6},{opacity:0}], {duration:dur, easing:'ease'});
        break;
      case 'crossfade':
        overlay.style.background = 'rgba(0,0,0,0.6)';
        overlay.animate([{opacity:0},{opacity:1,offset:0.5},{opacity:0}], {duration:dur, easing:'ease'});
        break;
      case 'flash':
        overlay.style.background = '#fff';
        overlay.animate([{opacity:0},{opacity:1,offset:0.3},{opacity:0}], {duration:Math.min(dur,500), easing:'ease'});
        break;
      default:
        if (type.startsWith('slide-')) {
          overlay.style.background = '#000';
          const d = type.replace('slide-','');
          const m = {left:'translateX(-100%)',right:'translateX(100%)',up:'translateY(-100%)',down:'translateY(100%)'};
          const mo = {left:'right',right:'left',up:'down',down:'up'};
          overlay.animate([{transform:m[d]},{transform:'translate(0,0)',offset:0.4},{transform:'translate(0,0)',offset:0.6},{transform:m[mo[d]]}], {duration:dur, easing:'ease-in-out'});
        }
    }

    container.appendChild(overlay);
    setTimeout(() => { if (callback) callback(); }, dur * 0.45);
    setTimeout(() => overlay.remove(), dur + 100);
  },

  _renderScene(scene) {
    this.previewStage.innerHTML = '';
    const canvas = document.createElement('div');
    canvas.className = 'preview-canvas';
    canvas.style.width = State.project.canvasWidth + 'px';
    canvas.style.height = State.project.canvasHeight + 'px';
    canvas.style.background = scene.bgColor || '#16182a';
    canvas.style.position = 'relative';
    canvas.style.overflow = 'hidden';

    const sorted = [...scene.objects].sort((a, b) => a.zIndex - b.zIndex);

    for (const obj of sorted) {
      if (!obj.visible) continue;
      // Check if object was picked up
      if (this.objectStates[obj.id]?.pickedUp) continue;

      const asset = State.project.assets.find(a => a.id === obj.assetId);
      if (!asset) continue;

      // Check flag condition
      if (obj.checkFlag && obj.checkFlag.flag) {
        if (!GameFlags.evaluateCondition(obj.checkFlag, this.runtimeFlags)) {
          continue; // Skip this object - condition not met
        }
      }

      const el = document.createElement('div');
      const scaleX = obj.flipX ? -1 : 1;
      const scaleY = obj.flipY ? -1 : 1;
      el.style.cssText = `
        position: absolute;
        left: ${obj.x}px; top: ${obj.y}px;
        width: ${obj.width}px; height: ${obj.height}px;
        transform: rotate(${obj.rotation}deg) scaleX(${scaleX}) scaleY(${scaleY});
        opacity: ${obj.opacity};
        mix-blend-mode: ${obj.blendMode};
        z-index: ${obj.zIndex};
        cursor: ${obj.cursor || 'default'};
        user-select: none;
      `;

      const img = document.createElement('img');
      img.src = asset.dataURL;
      img.style.cssText = 'width:100%;height:100%;pointer-events:none;image-rendering:pixelated;';
      img.draggable = false;
      el.appendChild(img);

      // Hover flavor text (with variants support)
      el.addEventListener('mouseenter', (e) => this._showFlavorText(obj, e, canvas));
      el.addEventListener('mouseleave', () => this._hideFlavorText(canvas));

      // Click interaction
      el.addEventListener('click', (e) => {
        this._hideFlavorText(canvas);
        this.handleClick(obj);
      });

      canvas.appendChild(el);
    }

    // Render hitboxes as clickable zones
    for (const hb of scene.hitboxes) {
      const zone = document.createElement('div');
      zone.style.cssText = `
        position: absolute;
        left: ${hb.x}px; top: ${hb.y}px;
        width: ${hb.width}px; height: ${hb.height}px;
        cursor: pointer;
        z-index: 9000;
      `;
      zone.addEventListener('click', () => {
        if (hb.action === 'scene-change' && hb.targetSceneId) {
          this.transitionTo(hb.targetSceneId);
        }
      });
      canvas.appendChild(zone);
    }

    // Day-night overlay
    if (this.rpgState && DayNight.getConfig().enabled) {
      const overlay = document.createElement('div');
      overlay.className = 'preview-dn-overlay';
      overlay.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:8999;
        background:${DayNight.getOverlayColor(this.rpgState.time)};transition:background 2s ease`;
      canvas.appendChild(overlay);
    }

    this.previewStage.appendChild(canvas);

    // Render inventory bar
    this._renderInventoryBar(canvas);

    // Save/Load button
    if (State.project.saveLoadSettings?.showSaveLoadUI) {
      this._renderSaveLoadButtons(canvas);
    }

    // RPG HUD
    this._renderRPGHUD(canvas);
  },

  _renderRPGHUD(canvas) {
    // Remove existing
    canvas.querySelectorAll('.preview-rpg-hud').forEach(h => h.remove());
    if (!this.rpgState) return;

    const hud = document.createElement('div');
    hud.className = 'preview-rpg-hud';
    hud.style.cssText = 'position:absolute;top:8px;left:8px;display:flex;flex-direction:column;gap:4px;z-index:9990;pointer-events:none';

    // Time display
    if (DayNight.getConfig().enabled) {
      const timeDiv = document.createElement('div');
      timeDiv.className = 'rpg-hud-time';
      timeDiv.style.cssText = 'background:rgba(0,0,0,0.7);padding:3px 8px;border-radius:4px;font-size:11px;color:#fbbf24;border:1px solid rgba(251,191,36,0.3)';
      timeDiv.textContent = DayNight.formatTime(this.rpgState.time);
      hud.appendChild(timeDiv);
    }

    // Needs bars
    const needsCfg = NeedsTracker.getConfig();
    if (needsCfg.enabled && this.rpgState.needs) {
      const needsDiv = document.createElement('div');
      needsDiv.className = 'rpg-hud-needs';
      needsDiv.style.cssText = 'background:rgba(0,0,0,0.7);padding:4px 8px;border-radius:4px;border:1px solid rgba(255,255,255,0.1)';
      for (const n of needsCfg.needs) {
        if (!n.enabled) continue;
        const val = this.rpgState.needs[n.key] || 0;
        const isLow = val <= needsCfg.warningThreshold;
        needsDiv.innerHTML += `<div style="display:flex;align-items:center;gap:4px;margin-bottom:2px">
          <span style="font-size:10px;width:14px">${n.icon}</span>
          <div style="flex:1;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;min-width:60px;overflow:hidden">
            <div style="width:${val}%;height:100%;background:${isLow ? '#ef4444' : n.color};border-radius:3px;transition:width 0.3s"></div>
          </div>
          <span style="font-size:9px;color:${isLow ? '#ef4444' : 'rgba(255,255,255,0.5)'};width:22px;text-align:right">${Math.round(val)}</span>
        </div>`;
      }
      hud.appendChild(needsDiv);
    }

    // Status effects
    if (this.rpgState.statusEffects && this.rpgState.statusEffects.length > 0) {
      const effDiv = document.createElement('div');
      effDiv.style.cssText = 'display:flex;gap:2px';
      for (const active of this.rpgState.statusEffects) {
        const def = StatusEffects.getEffect(active.effectId);
        if (!def) continue;
        const badge = document.createElement('span');
        badge.style.cssText = `background:rgba(0,0,0,0.7);padding:2px 6px;border-radius:3px;font-size:10px;color:${def.color};border:1px solid ${def.color}40`;
        badge.textContent = def.icon + (active.remainingDuration > 0 ? ` ${active.remainingDuration}` : '');
        badge.title = def.name;
        effDiv.appendChild(badge);
      }
      hud.appendChild(effDiv);
    }

    // Quest log mini-panel
    const questUI = State.project.questUI || {};
    if (questUI.showPanel && this.rpgState?.quests) {
      const qDiv = document.createElement('div');
      qDiv.style.cssText = `background:rgba(0,0,0,0.7);padding:4px 8px;border-radius:4px;border:1px solid ${questUI.accent || '#7c5cfc'}55;max-width:230px`;
      const quests = State.project.rpgQuests || [];
      const tracked = quests.filter(q => this.rpgState.quests[q.id]?.active && !this.rpgState.quests[q.id]?.finished && (this.rpgState.quests[q.id]?.tracked !== false));
      if (tracked.length) {
        qDiv.innerHTML = `<div style="font-size:10px;color:${questUI.accent || '#7c5cfc'};margin-bottom:2px">QUEST LOG</div>` + tracked.slice(0, 3).map(q => `<div style="font-size:10px;color:#d9d9e0">• ${this._esc(q.name)}</div>`).join('');
        hud.appendChild(qDiv);
      }
    }

    canvas.appendChild(hud);
  },

  _updateRPGHUD() {
    const canvas = this.previewStage?.querySelector('.preview-canvas');
    if (!canvas) return;
    // Update time
    const timeEl = canvas.querySelector('.rpg-hud-time');
    if (timeEl && this.rpgState) timeEl.textContent = DayNight.formatTime(this.rpgState.time);
    // Update day-night overlay
    const dnOverlay = canvas.querySelector('.preview-dn-overlay');
    if (dnOverlay && this.rpgState) dnOverlay.style.background = DayNight.getOverlayColor(this.rpgState.time);
  },

  // ---- Flavor Text with variants ----
  _showFlavorText(obj, event, canvas) {
    this._hideFlavorText(canvas);

    let text = '';

    // Check context-aware flavor texts first
    if (obj.flavorFlagConditions && obj.flavorFlagConditions.length > 0) {
      for (const cond of obj.flavorFlagConditions) {
        if (cond.flag && GameFlags.evaluateCondition(cond, this.runtimeFlags)) {
          text = cond.text;
          break;
        }
      }
    }

    // If no context-aware text matched, use variants or default
    if (!text) {
      if (obj.flavorTexts && obj.flavorTexts.length > 0) {
        // Random selection from variants + default
        const all = [obj.flavorText, ...obj.flavorTexts].filter(t => t && t.trim());
        if (all.length > 0) {
          text = all[Math.floor(Math.random() * all.length)];
        }
      } else {
        text = obj.flavorText || '';
      }
    }

    if (!text) return;

    const tooltip = document.createElement('div');
    tooltip.className = 'flavor-tooltip';
    tooltip.textContent = text;

    // Position near the object
    const rect = event.target.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    tooltip.style.left = (rect.left - canvasRect.left + rect.width / 2 - 60) + 'px';
    tooltip.style.top = (rect.top - canvasRect.top - 40) + 'px';

    canvas.appendChild(tooltip);
  },

  _hideFlavorText(canvas) {
    canvas?.querySelectorAll('.flavor-tooltip').forEach(t => t.remove());
  },

  _evaluateAdvConditions(conditions = []) {
    if (!conditions || !conditions.length) return true;
    for (const c of conditions) {
      const type = c.type || 'flag';
      if (type === 'flag') {
        if (!GameFlags.evaluateCondition(c, this.runtimeFlags)) return false;
      } else if (type === 'inventory') {
        const has = this.hasItem(c.itemId);
        if ((c.operator || 'has') === 'has' && !has) return false;
        if ((c.operator || 'has') === 'not' && has) return false;
      } else if (type === 'reputation') {
        const val = this.rpgState?.reputation?.[c.npcId]?.[c.stat || 'Friendship'] || 0;
        const tgt = Number(c.value || 0);
        const op = c.operator || '>=';
        if (op === '>=' && !(val >= tgt)) return false;
        if (op === '<=' && !(val <= tgt)) return false;
        if (op === '>' && !(val > tgt)) return false;
        if (op === '<' && !(val < tgt)) return false;
        if (op === '==' && !(val == tgt)) return false;
      } else if (type === 'skill') {
        const val = this.rpgState?.skills?.skills?.[c.skill] || 0;
        const tgt = Number(c.value || 0);
        if (val < tgt) return false;
      }
    }
    return true;
  },

  _applyConsequences(consequences = []) {
    if (!consequences || !consequences.length) return;
    for (const r of consequences) {
      const type = r.type || 'flag';
      if (type === 'flag') {
        GameFlags.applyAction(r, this.runtimeFlags);
      } else if (type === 'inventory') {
        if (r.action === 'add') this.giveItem(r.itemId);
        if (r.action === 'remove') this.removeItem(r.itemId, r.count || 1);
      } else if (type === 'reputation') {
        Reputation.applyRepChange(this.rpgState.reputation, r.npcId, r.stat || 'Friendship', Number(r.delta || 0));
      } else if (type === 'quest') {
        if (r.action === 'activate') QuestTracker.activateQuest(this.rpgState.quests, r.questId);
        if (r.action === 'advance') QuestTracker.advanceMilestone(this.rpgState.quests, r.questId, r.milestoneId, this.runtimeFlags);
      } else if (type === 'needs') {
        NeedsTracker.applyNeedChange(this.rpgState.needs, r.changes || {});
      }
    }
  },

  _tryUseSelectedItemOnObject(obj) {
    if (!this.selectedInvItem) return false;
    const item = Inventory.getItem(this.selectedInvItem);
    if (!item) return false;

    const rule = Inventory.getUseRule(item.id, obj.name);
    if (rule) {
      if (rule.consume) this.removeItem(item.id, 1);
      if (rule.setFlag?.flag) GameFlags.applyAction(rule.setFlag, this.runtimeFlags);
      if (rule.grantItemId) this.giveItem(rule.grantItemId);
      this.selectedInvItem = null;
      this._showPreviewToast(rule.successText || `${item.name} used on ${obj.name}`);
      const canvas = this.previewStage?.querySelector('.preview-canvas');
      if (canvas) this._renderInventoryBar(canvas);
      return true;
    }

    // Try combination with give-item objects
    if (obj.giveItemId) {
      const combo = Inventory.getCombinationResult(item.id, obj.giveItemId);
      if (combo && combo.resultItemId) {
        this.removeItem(item.id, 1);
        if (combo.consumeBoth) this.objectStates[obj.id] = { pickedUp: true };
        this.giveItem(combo.resultItemId);
        this.selectedInvItem = null;
        this._showPreviewToast('Combined items successfully!');
        this.renderPreviewScene(this.currentSceneId, 'none');
        return true;
      }
    }

    this._showPreviewToast(`Can't use ${item.name} on ${obj.name}`);
    return true;
  },

  // ---- Click Handling ----
  handleClick(obj) {
    // Inventory interaction first: use selected item on object or attempt item combination
    if (this._tryUseSelectedItemOnObject(obj)) return;

    // Check if item is required
    if (obj.requireItemId) {
      const hasItem = this.playerInventory.find(i => i.itemId === obj.requireItemId);
      if (!hasItem) {
        const failText = obj.requireItemFailText || "You need something to interact with this.";
        this.showDialogue(failText);
        return;
      }
    }

    // Phase 3B: Skill check gate
    if (obj.skillCheck && obj.skillCheck.skill && this.rpgState) {
      const result = DiceEngine.skillCheck(this.rpgState.skills, obj.skillCheck.skill, obj.skillCheck.difficulty);
      if (!result.success) {
        const skillDef = DiceEngine.getConfig().skills.find(s => s.key === obj.skillCheck.skill);
        const skillName = skillDef ? skillDef.label : obj.skillCheck.skill;
        const failMsg = obj.skillCheck.failText || `Skill check failed! (${skillName}: rolled ${result.rollResult}+${result.modifier}=${result.total} vs DC ${result.difficulty})`;
        this.showDialogue(failMsg);
        // Award some XP for trying
        DiceEngine.awardXP(this.rpgState.skills, obj.skillCheck.skill, 5);
        return;
      }
      // Success - award XP
      DiceEngine.awardXP(this.rpgState.skills, obj.skillCheck.skill, 15);
      this._showPreviewToast(`✓ ${DiceEngine.getConfig().skills.find(s => s.key === obj.skillCheck.skill)?.label || 'Skill'} check passed! (${result.total} vs DC ${result.difficulty})`);
    }

    // Apply flag action
    if (obj.setFlag && obj.setFlag.flag) {
      GameFlags.applyAction(obj.setFlag, this.runtimeFlags);
    }

    // Phase 3B: Apply need changes
    if (obj.needChanges && this.rpgState) {
      NeedsTracker.applyNeedChange(this.rpgState.needs, obj.needChanges);
    }

    // Phase 3B: Apply reputation change
    if (obj.repChange && obj.repChange.npcId && this.rpgState) {
      Reputation.applyRepChange(this.rpgState.reputation, obj.repChange.npcId, obj.repChange.type, obj.repChange.delta);
    }

    // Phase 3B: Quest milestone advance
    if (obj.questAction && obj.questAction.questId && this.rpgState) {
      if (obj.questAction.milestoneId) {
        QuestTracker.advanceMilestone(this.rpgState.quests, obj.questAction.questId, obj.questAction.milestoneId, this.runtimeFlags);
        this._showPreviewToast('📜 Quest updated!');
      } else {
        QuestTracker.activateQuest(this.rpgState.quests, obj.questAction.questId);
        this._showPreviewToast('📜 New quest!');
      }
    }

    // Phase 3B: Apply status effect
    if (obj.applyEffectId && this.rpgState) {
      StatusEffects.applyEffect(this.rpgState.statusEffects, obj.applyEffectId);
      const eff = StatusEffects.getEffect(obj.applyEffectId);
      if (eff) this._showPreviewToast(`${eff.icon} ${eff.name} applied!`);
    }

    // Phase 3B: Advance time on interaction
    if (this.rpgState && DayNight.getConfig().enabled) {
      DayNight.advanceTime(this.rpgState.time, DayNight.getConfig().minutesPerTick || 15);
    }

    // Refresh HUD
    const canvas = this.previewStage?.querySelector('.preview-canvas');
    if (canvas) this._renderRPGHUD(canvas);

    // Handle click action
    switch (obj.clickAction) {
      case 'scene-change':
        if (obj.targetSceneId) this.transitionTo(obj.targetSceneId);
        break;
      case 'dialogue':
        this.showDialogue(obj.dialogueText || '...');
        break;
      case 'start-dialogue':
        if (obj.dialogueTreeId) this.runDialogueTree(obj.dialogueTreeId);
        break;
      case 'give-item':
        if (obj.giveItemId) this.giveItem(obj.giveItemId, obj);
        break;
      case 'custom':
        try {
          const fn = new Function('flags', 'inventory', 'preview', obj.customJS);
          fn(this.runtimeFlags, this.playerInventory, this);
        } catch (e) { console.warn('Custom JS error:', e); }
        break;
    }
  },

  // ---- Dialogue Tree Runtime ----
  runDialogueTree(treeId) {
    const tree = Dialogue.getTree(treeId);
    if (!tree || !tree.nodes.length) return;

    const startId = this.dialogueProgress[treeId] || tree.startNodeId;
    const node = tree.nodes.find(n => n.id === startId) || tree.nodes[0];
    this._showDialogueNode(tree, node);
  },

  _showDialogueNode(tree, node) {
    if (!node) return;

    // Check node conditions (legacy + advanced)
    if (node.flagCondition && node.flagCondition.flag) {
      if (!GameFlags.evaluateCondition(node.flagCondition, this.runtimeFlags)) {
        if (node.nextNodeId) {
          const next = tree.nodes.find(n => n.id === node.nextNodeId);
          if (next) return this._showDialogueNode(tree, next);
        }
        return;
      }
    }
    if (!this._evaluateAdvConditions(node.conditions || [])) {
      if (node.nextNodeId) {
        const next = tree.nodes.find(n => n.id === node.nextNodeId);
        if (next) return this._showDialogueNode(tree, next);
      }
      return;
    }

    // Apply node consequences
    if (node.flagAction && node.flagAction.flag) GameFlags.applyAction(node.flagAction, this.runtimeFlags);
    this._applyConsequences(node.consequences || []);

    const canvas = this.previewStage.querySelector('.preview-canvas');
    if (!canvas) return;

    // Remove existing dialogue
    canvas.querySelectorAll('.preview-dialogue-box').forEach(d => d.remove());

    const dlg = document.createElement('div');
    dlg.className = 'preview-dialogue-box';

    // Header with portrait and speaker
    let headerHTML = '';
    if (node.speaker || node.portrait) {
      const portraitAsset = node.portrait ? State.project.assets.find(a => a.id === node.portrait) : null;
      headerHTML = `<div class="dlg-header">
        ${portraitAsset ? `<div class="dlg-portrait"><img src="${portraitAsset.dataURL}" alt="" /></div>` : ''}
        <div class="dlg-speaker">${this._esc(node.speaker || 'Unknown')}</div>
      </div>`;
    }

    // Text
    const textHTML = `<div class="dlg-text">${this._esc(node.text || '...')}</div>`;

    // Choices or continue
    let choicesHTML = '';
    const availableChoices = (node.choices || []).filter(c => this._evaluateAdvConditions(c.conditions || []));
    if (availableChoices.length > 0) {
      choicesHTML = '<div class="dlg-choices">';
      availableChoices.forEach((choice, i) => {
        choicesHTML += `<button class="dlg-choice-btn" data-idx="${i}">${this._esc(choice.text || 'Choice ' + (i + 1))}</button>`;
      });
      choicesHTML += '</div>';
    } else {
      choicesHTML = '<div class="dlg-continue">Click to continue...</div>';
    }

    dlg.innerHTML = headerHTML + textHTML + choicesHTML;

    // Bind events
    if (availableChoices.length > 0) {
      dlg.querySelectorAll('.dlg-choice-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.dataset.idx);
          const choice = availableChoices[idx];

          if (choice.flagAction && choice.flagAction.flag) GameFlags.applyAction(choice.flagAction, this.runtimeFlags);
          this._applyConsequences(choice.consequences || []);

          dlg.remove();

          if (choice.nextNodeId) {
            const nextNode = tree.nodes.find(n => n.id === choice.nextNodeId);
            if (nextNode) {
              this.dialogueProgress[tree.id] = choice.nextNodeId;
              this._showDialogueNode(tree, nextNode);
            }
          }
        });
      });
    } else {
      dlg.addEventListener('click', () => {
        dlg.remove();
        // Continue to next node
        if (node.nextNodeId) {
          const nextNode = tree.nodes.find(n => n.id === node.nextNodeId);
          if (nextNode) {
            this.dialogueProgress[tree.id] = node.nextNodeId;
            this._showDialogueNode(tree, nextNode);
          }
        }
      });
    }

    canvas.appendChild(dlg);
  },

  // ---- Inventory Runtime ----
  giveItem(itemId, sourceObj) {
    const itemDef = Inventory.getItem(itemId);
    if (!itemDef) return;

    const existing = this.playerInventory.find(i => i.itemId === itemId);
    if (existing) {
      if (itemDef.stackable && existing.count < (itemDef.maxStack || 99)) {
        existing.count++;
      }
    } else {
      this.playerInventory.push({ itemId, count: 1 });
    }

    // Mark source object as picked up if applicable
    if (sourceObj) {
      if (!this.objectStates[sourceObj.id]) this.objectStates[sourceObj.id] = {};
      this.objectStates[sourceObj.id].pickedUp = true;
    }

    // Show toast
    this._showPreviewToast(`Obtained: ${itemDef.name}`);

    // Re-render
    const canvas = this.previewStage.querySelector('.preview-canvas');
    if (canvas) {
      // Remove the source object visually
      if (sourceObj) {
        this.renderPreviewScene(this.currentSceneId, 'none');
      }
      this._renderInventoryBar(canvas);
    }
  },

  removeItem(itemId, count = 1) {
    const idx = this.playerInventory.findIndex(i => i.itemId === itemId);
    if (idx === -1) return;
    this.playerInventory[idx].count -= count;
    if (this.playerInventory[idx].count <= 0) {
      this.playerInventory.splice(idx, 1);
    }
  },

  hasItem(itemId) {
    return this.playerInventory.some(i => i.itemId === itemId && i.count > 0);
  },

  _tryCombineItems(itemAId, itemBId) {
    const itemA = Inventory.getItem(itemAId);
    const itemB = Inventory.getItem(itemBId);
    if (!itemA || !itemB) return false;

    const comboFromA = (itemA.combinations || []).find(c => c.withItemId === itemBId && c.resultItemId);
    const comboFromB = (itemB.combinations || []).find(c => c.withItemId === itemAId && c.resultItemId);
    const combo = comboFromA || comboFromB;
    if (!combo) return false;

    // consume both, add result
    this.removeItem(itemAId, 1);
    this.removeItem(itemBId, 1);
    this.giveItem(combo.resultItemId, null);

    const resultItem = Inventory.getItem(combo.resultItemId);
    this._showPreviewToast(resultItem ? `Combined into: ${resultItem.name}` : 'Items combined!');
    return true;
  },

  _renderInventoryBar(canvas) {
    // Remove existing
    canvas.querySelectorAll('.preview-inventory-bar').forEach(b => b.remove());

    if (this.playerInventory.length === 0) return;

    const bar = document.createElement('div');
    bar.className = 'preview-inventory-bar';
    const invUI = State.project.inventoryUI || { slotSize: 40, position: 'bottom' };
    if (invUI.position === 'top') {
      bar.style.top = '0';
      bar.style.bottom = 'auto';
      bar.style.borderTop = 'none';
      bar.style.borderBottom = '1px solid rgba(124,92,252,0.3)';
    }
    const slotSize = Math.max(24, Number(invUI.slotSize || 40));

    for (const inv of this.playerInventory) {
      const itemDef = Inventory.getItem(inv.itemId);
      if (!itemDef) continue;

      const slot = document.createElement('div');
      slot.className = 'preview-inv-slot' + (this.selectedInvItem === inv.itemId ? ' selected' : '');
      slot.style.width = slotSize + 'px';
      slot.style.height = slotSize + 'px';

      const iconAsset = itemDef.icon ? State.project.assets.find(a => a.id === itemDef.icon) : null;
      if (iconAsset) {
        const img = document.createElement('img');
        img.src = iconAsset.dataURL;
        img.alt = itemDef.name;
        img.title = itemDef.name + (itemDef.description ? '\n' + itemDef.description : '');
        const iconSize = Math.max(16, slotSize - 8);
        img.style.width = iconSize + 'px';
        img.style.height = iconSize + 'px';
        slot.appendChild(img);
      } else {
        slot.textContent = '📦';
        slot.title = itemDef.name;
      }

      if (inv.count > 1) {
        const badge = document.createElement('div');
        badge.className = 'inv-count';
        badge.textContent = inv.count;
        slot.appendChild(badge);
      }

      slot.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.selectedInvItem && this.selectedInvItem !== inv.itemId) {
          if (this._tryCombineItems(this.selectedInvItem, inv.itemId)) {
            this.selectedInvItem = null;
            this._renderInventoryBar(canvas);
            return;
          }
        }

        if (this.selectedInvItem === inv.itemId) {
          this.selectedInvItem = null;
          // Show examine text
          if (itemDef.examineText) {
            this.showDialogue(itemDef.examineText);
          }
        } else {
          this.selectedInvItem = inv.itemId;
        }
        this._renderInventoryBar(canvas);
      });

      bar.appendChild(slot);
    }

    canvas.appendChild(bar);
  },

  // ---- Save/Load buttons in preview ----
  _renderSaveLoadButtons(canvas) {
    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = 'position:absolute;top:8px;right:8px;display:flex;gap:4px;z-index:9999';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = '💾';
    saveBtn.title = 'Save';
    saveBtn.style.cssText = 'padding:4px 8px;background:rgba(0,0,0,0.7);border:1px solid rgba(124,92,252,0.4);border-radius:4px;color:#e8e8ec;cursor:pointer;font-size:14px';
    saveBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this._showSaveLoadModal('save');
    });

    const loadBtn = document.createElement('button');
    loadBtn.textContent = '📂';
    loadBtn.title = 'Load';
    loadBtn.style.cssText = saveBtn.style.cssText;
    loadBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this._showSaveLoadModal('load');
    });

    btnContainer.appendChild(saveBtn);
    btnContainer.appendChild(loadBtn);
    canvas.appendChild(btnContainer);
  },

  _showSaveLoadModal(mode) {
    const canvas = this.previewStage.querySelector('.preview-canvas');
    if (!canvas) return;

    canvas.querySelectorAll('.save-load-modal').forEach(m => m.remove());

    const modal = document.createElement('div');
    modal.className = 'save-load-modal';

    const maxSlots = State.project.saveLoadSettings?.maxSlots || 5;
    const prefix = 'anzu_preview_';

    let html = `
      <button class="sl-modal-close">&times;</button>
      <h3>${mode === 'save' ? '💾 Save Game' : '📂 Load Game'}</h3>
    `;

    for (let i = 0; i < maxSlots; i++) {
      const raw = localStorage.getItem(prefix + 'slot_' + i);
      const info = raw ? JSON.parse(raw) : null;
      const label = i === 0 ? 'Auto-Save' : 'Slot ' + i;

      if (info) {
        const date = new Date(info.timestamp).toLocaleString();
        html += `
          <div class="save-slot" data-slot="${i}">
            <div class="slot-info">
              <div class="slot-name">${label}</div>
              <div class="slot-meta">${info.sceneName || 'Unknown'} • ${date}</div>
            </div>
            <div class="slot-actions">
              ${mode === 'save' ? `<button class="sl-save-btn" data-slot="${i}">Save</button>` : `<button class="sl-load-btn" data-slot="${i}">Load</button>`}
              <button class="delete-slot sl-del-btn" data-slot="${i}">✕</button>
            </div>
          </div>
        `;
      } else {
        html += `
          <div class="save-slot" data-slot="${i}">
            <div class="slot-info"><div class="slot-empty">${label} — Empty</div></div>
            ${mode === 'save' ? `<div class="slot-actions"><button class="sl-save-btn" data-slot="${i}">Save</button></div>` : ''}
          </div>
        `;
      }
    }

    modal.innerHTML = html;

    // Bind events
    modal.querySelector('.sl-modal-close').addEventListener('click', () => modal.remove());

    modal.querySelectorAll('.sl-save-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const slot = parseInt(btn.dataset.slot);
        this._previewSave(slot);
        modal.remove();
        this._showPreviewToast('Saved to ' + (slot === 0 ? 'Auto-Save' : 'Slot ' + slot));
      });
    });

    modal.querySelectorAll('.sl-load-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const slot = parseInt(btn.dataset.slot);
        if (this._previewLoad(slot)) {
          modal.remove();
          this._showPreviewToast('Loaded from ' + (slot === 0 ? 'Auto-Save' : 'Slot ' + slot));
        }
      });
    });

    modal.querySelectorAll('.sl-del-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const slot = parseInt(btn.dataset.slot);
        localStorage.removeItem('anzu_preview_slot_' + slot);
        this._showSaveLoadModal(mode);
      });
    });

    canvas.appendChild(modal);
  },

  _previewSave(slot) {
    const scene = State.project.scenes.find(s => s.id === this.currentSceneId);
    const data = {
      slot,
      timestamp: new Date().toISOString(),
      currentSceneId: this.currentSceneId,
      sceneName: scene?.name || 'Unknown',
      inventory: JSON.parse(JSON.stringify(this.playerInventory)),
      flags: JSON.parse(JSON.stringify(this.runtimeFlags)),
      dialogueProgress: JSON.parse(JSON.stringify(this.dialogueProgress)),
      objectStates: JSON.parse(JSON.stringify(this.objectStates)),
      rpgState: JSON.parse(JSON.stringify(this.rpgState || null)),
      selectedInvItem: this.selectedInvItem || null,
    };
    localStorage.setItem('anzu_preview_slot_' + slot, JSON.stringify(data));
  },

  _previewLoad(slot) {
    try {
      const raw = localStorage.getItem('anzu_preview_slot_' + slot);
      if (!raw) return false;
      const data = JSON.parse(raw);
      this.playerInventory = data.inventory || [];
      this.runtimeFlags = data.flags || {};
      this.dialogueProgress = data.dialogueProgress || {};
      this.objectStates = data.objectStates || {};
      if (data.rpgState) this.rpgState = data.rpgState;
      this.selectedInvItem = data.selectedInvItem || null;
      this.renderPreviewScene(data.currentSceneId, 'none');
      return true;
    } catch (e) {
      console.warn('Preview load failed:', e);
      return false;
    }
  },

  _showPreviewToast(msg) {
    const canvas = this.previewStage.querySelector('.preview-canvas');
    if (!canvas) return;
    const toast = document.createElement('div');
    toast.style.cssText = 'position:absolute;top:8px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.9);color:#e8e8ec;padding:6px 14px;border-radius:6px;font-size:12px;z-index:10002;border:1px solid rgba(124,92,252,0.4);pointer-events:none';
    toast.textContent = msg;
    canvas.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 1500);
  },

  transitionTo(sceneId) {
    // Auto-save on transition
    if (State.project.saveLoadSettings?.autoSaveOnTransition) {
      this._previewSave(0);
    }
    this.renderPreviewScene(sceneId);
  },

  showDialogue(text) {
    // Remove existing
    const existing = this.previewStage.querySelector('.preview-dialogue');
    if (existing) existing.remove();

    const canvas = this.previewStage.querySelector('.preview-canvas');
    if (!canvas) return;

    const dlg = document.createElement('div');
    dlg.className = 'preview-dialogue';
    dlg.style.cssText = `
      position: absolute;
      bottom: 20px; left: 20px; right: 20px;
      background: rgba(0,0,0,0.85);
      border: 2px solid rgba(124,92,252,0.6);
      border-radius: 8px;
      padding: 16px 20px;
      color: #e8e8ec;
      font-size: 14px;
      line-height: 1.5;
      z-index: 9999;
      cursor: pointer;
      backdrop-filter: blur(4px);
    `;
    dlg.textContent = text;
    dlg.addEventListener('click', () => dlg.remove());
    canvas.appendChild(dlg);
  },

  // Test a dialogue tree directly from the editor
  testDialogueTree(treeId) {
    // Create a temporary preview-like overlay
    const tree = Dialogue.getTree(treeId);
    if (!tree) { Toast.show('Dialogue tree not found', 'error'); return; }

    this.runtimeFlags = GameFlags.createRuntimeState();
    this.dialogueProgress = {};

    // Use current preview overlay
    State.isPreviewMode = true;
    this.overlay.hidden = false;
    this.currentSceneId = State.project.activeSceneId;

    this.renderPreviewScene(this.currentSceneId, 'none');

    // Start dialogue after render
    setTimeout(() => this.runDialogueTree(treeId), 300);
  },

  _esc(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },
};
