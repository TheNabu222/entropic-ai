/* ===== PROPERTIES PANEL ===== */
const Properties = {
  fields: {},
  emptyState: null,
  panel: null,

  init() {
    this.emptyState = document.getElementById('props-empty');
    this.panel = document.getElementById('props-panel');

    this.fields = {
      x: document.getElementById('prop-x'),
      y: document.getElementById('prop-y'),
      w: document.getElementById('prop-w'),
      h: document.getElementById('prop-h'),
      rotation: document.getElementById('prop-rotation'),
      lockAspect: document.getElementById('prop-lock-aspect'),
      opacity: document.getElementById('prop-opacity'),
      blend: document.getElementById('prop-blend'),
      flipX: document.getElementById('prop-flip-x'),
      flipY: document.getElementById('prop-flip-y'),
      cursor: document.getElementById('prop-cursor'),
      clickAction: document.getElementById('prop-click-action'),
      targetScene: document.getElementById('prop-target-scene'),
      dialogueText: document.getElementById('prop-dialogue-text'),
      customJS: document.getElementById('prop-custom-js'),
      flavor: document.getElementById('prop-flavor'),
      // Phase 3A fields
      dialogueTree: document.getElementById('prop-dialogue-tree'),
      giveItem: document.getElementById('prop-give-item'),
      requireItem: document.getElementById('prop-require-item'),
      requireItemFail: document.getElementById('prop-require-item-fail'),
      setFlagName: document.getElementById('prop-set-flag-name'),
      setFlagOp: document.getElementById('prop-set-flag-op'),
      setFlagVal: document.getElementById('prop-set-flag-val'),
      checkFlagName: document.getElementById('prop-check-flag-name'),
      checkFlagOp: document.getElementById('prop-check-flag-op'),
      checkFlagVal: document.getElementById('prop-check-flag-val'),
    };

    // Value display
    this.valRotation = document.getElementById('val-rotation');
    this.valOpacity = document.getElementById('val-opacity');

    // Bind change handlers
    this.fields.x.addEventListener('change', () => this.applyTransform());
    this.fields.y.addEventListener('change', () => this.applyTransform());
    this.fields.w.addEventListener('change', () => this.applyTransform());
    this.fields.h.addEventListener('change', () => this.applyTransform());

    this.fields.rotation.addEventListener('input', () => {
      this.valRotation.textContent = this.fields.rotation.value + '°';
      this.applyRotation();
    });

    this.fields.opacity.addEventListener('input', () => {
      this.valOpacity.textContent = Math.round(this.fields.opacity.value * 100) + '%';
      this.applyAppearance();
    });

    this.fields.blend.addEventListener('change', () => this.applyAppearance());

    this.fields.flipX.addEventListener('click', () => {
      const obj = State.getSelectedObject();
      if (obj) { State.pushUndo(); obj.flipX = !obj.flipX; Canvas.updateObjectElement(obj); Canvas.updateHandles(); State.autoSave(); }
    });

    this.fields.flipY.addEventListener('click', () => {
      const obj = State.getSelectedObject();
      if (obj) { State.pushUndo(); obj.flipY = !obj.flipY; Canvas.updateObjectElement(obj); Canvas.updateHandles(); State.autoSave(); }
    });

    this.fields.cursor.addEventListener('change', () => this.applyInteraction());
    this.fields.clickAction.addEventListener('change', () => {
      this.updateActionParams();
      this.applyInteraction();
    });
    this.fields.targetScene?.addEventListener('change', () => this.applyInteraction());
    this.fields.dialogueText?.addEventListener('input', () => this.applyInteraction());
    this.fields.customJS?.addEventListener('input', () => this.applyInteraction());
    this.fields.flavor?.addEventListener('input', () => this.applyInteraction());

    // Phase 3A field bindings
    this.fields.dialogueTree?.addEventListener('change', () => this.applyInteraction());
    this.fields.giveItem?.addEventListener('change', () => this.applyInteraction());
    this.fields.requireItem?.addEventListener('change', () => this.applyInteraction());
    this.fields.requireItemFail?.addEventListener('input', () => this.applyInteraction());

    // Flag set/check bindings
    ['setFlagName', 'setFlagOp', 'setFlagVal', 'checkFlagName', 'checkFlagOp', 'checkFlagVal'].forEach(key => {
      this.fields[key]?.addEventListener('change', () => this.applyInteraction());
    });

    // Phase 3B fields
    this.fields.skillCheckSkill = document.getElementById('prop-skill-check-skill');
    this.fields.skillCheckDiff = document.getElementById('prop-skill-check-diff');
    this.fields.skillCheckFail = document.getElementById('prop-skill-check-fail');
    this.fields.questActionQuest = document.getElementById('prop-quest-action-quest');
    this.fields.questActionMs = document.getElementById('prop-quest-action-ms');
    this.fields.repNPC = document.getElementById('prop-rep-npc');
    this.fields.repType = document.getElementById('prop-rep-type');
    this.fields.repDelta = document.getElementById('prop-rep-delta');
    this.fields.applyEffect = document.getElementById('prop-apply-effect');

    // Phase 3B bindings
    ['skillCheckSkill', 'skillCheckDiff', 'skillCheckFail', 'questActionQuest', 'questActionMs',
     'repNPC', 'repType', 'repDelta', 'applyEffect'].forEach(key => {
      this.fields[key]?.addEventListener('change', () => this.applyInteraction());
    });

    // Quest milestone depends on quest selection
    this.fields.questActionQuest?.addEventListener('change', () => {
      const qid = this.fields.questActionQuest.value;
      if (typeof QuestTracker !== 'undefined' && this.fields.questActionMs) {
        QuestTracker.populateMilestoneSelect(this.fields.questActionMs, qid, '');
      }
    });

    // Flavor text variants
    document.getElementById('btn-add-flavor-variant')?.addEventListener('click', () => this.addFlavorVariant());
  },

  update() {
    const obj = State.getSelectedObject();
    if (!obj) {
      this.emptyState.hidden = false;
      this.panel.hidden = true;
      return;
    }

    this.emptyState.hidden = true;
    this.panel.hidden = false;

    this.fields.x.value = obj.x;
    this.fields.y.value = obj.y;
    this.fields.w.value = obj.width;
    this.fields.h.value = obj.height;
    this.fields.rotation.value = obj.rotation;
    this.valRotation.textContent = obj.rotation + '°';
    this.fields.opacity.value = obj.opacity;
    this.valOpacity.textContent = Math.round(obj.opacity * 100) + '%';
    this.fields.blend.value = obj.blendMode;
    this.fields.cursor.value = obj.cursor;
    this.fields.clickAction.value = obj.clickAction;
    this.fields.flavor.value = obj.flavorText || '';
    this.fields.dialogueText.value = obj.dialogueText || '';
    this.fields.customJS.value = obj.customJS || '';

    // Populate target scene dropdown
    this.populateSceneTargets();
    this.fields.targetScene.value = obj.targetSceneId || '';

    // Phase 3A: populate dialogue tree select
    if (this.fields.dialogueTree && typeof Dialogue !== 'undefined') {
      Dialogue.populateTreeSelect(this.fields.dialogueTree, obj.dialogueTreeId || '');
    }

    // Populate item selects
    if (this.fields.giveItem && typeof Inventory !== 'undefined') {
      Inventory.populateItemSelect(this.fields.giveItem, obj.giveItemId || '');
    }
    if (this.fields.requireItem && typeof Inventory !== 'undefined') {
      Inventory.populateItemSelect(this.fields.requireItem, obj.requireItemId || '');
    }
    if (this.fields.requireItemFail) {
      this.fields.requireItemFail.value = obj.requireItemFailText || '';
    }

    // Flag set
    if (this.fields.setFlagName && typeof GameFlags !== 'undefined') {
      GameFlags.populateFlagSelect(this.fields.setFlagName, obj.setFlag?.flag || '');
      if (this.fields.setFlagOp) this.fields.setFlagOp.value = obj.setFlag?.operation || 'set';
      if (this.fields.setFlagVal) this.fields.setFlagVal.value = obj.setFlag?.value || '';
    }

    // Flag check
    if (this.fields.checkFlagName && typeof GameFlags !== 'undefined') {
      GameFlags.populateFlagSelect(this.fields.checkFlagName, obj.checkFlag?.flag || '');
      if (this.fields.checkFlagOp) this.fields.checkFlagOp.value = obj.checkFlag?.operator || '==';
      if (this.fields.checkFlagVal) this.fields.checkFlagVal.value = obj.checkFlag?.value || '';
    }

    // Phase 3B: Populate RPG fields
    if (this.fields.skillCheckSkill && typeof DiceEngine !== 'undefined') {
      DiceEngine.populateSkillSelect(this.fields.skillCheckSkill, obj.skillCheck?.skill || '');
    }
    if (this.fields.skillCheckDiff) this.fields.skillCheckDiff.value = obj.skillCheck?.difficulty || 10;
    if (this.fields.skillCheckFail) this.fields.skillCheckFail.value = obj.skillCheck?.failText || '';

    if (this.fields.questActionQuest && typeof QuestTracker !== 'undefined') {
      QuestTracker.populateQuestSelect(this.fields.questActionQuest, obj.questAction?.questId || '');
      if (this.fields.questActionMs && obj.questAction?.questId) {
        QuestTracker.populateMilestoneSelect(this.fields.questActionMs, obj.questAction.questId, obj.questAction?.milestoneId || '');
      }
    }

    if (this.fields.repNPC && typeof Reputation !== 'undefined') {
      Reputation.populateNPCSelect(this.fields.repNPC, obj.repChange?.npcId || '');
    }
    if (this.fields.repType) this.fields.repType.value = obj.repChange?.type || '';
    if (this.fields.repDelta) this.fields.repDelta.value = obj.repChange?.delta || 0;

    if (this.fields.applyEffect && typeof StatusEffects !== 'undefined') {
      StatusEffects.populateEffectSelect(this.fields.applyEffect, obj.applyEffectId || '');
    }

    // Need changes
    this._renderNeedChanges(obj);

    // NPC Behavior
    const npcContainer = document.getElementById('prop-npc-behavior-container');
    if (npcContainer && typeof NPCAI !== 'undefined') {
      NPCAI.renderBehaviorEditor(npcContainer, obj);
    }

    // Flavor text variants
    this.renderFlavorVariants(obj);

    this.updateActionParams();
  },

  _renderNeedChanges(obj) {
    const container = document.getElementById('prop-need-changes-container');
    if (!container || typeof NeedsTracker === 'undefined') return;
    if (!obj.needChanges) obj.needChanges = {};
    const cfg = NeedsTracker.getConfig();
    if (!cfg || !cfg.needs) { container.innerHTML = '<span style="font-size:10px;color:var(--text-dim)">Enable needs in RPG tab first</span>'; return; }

    container.innerHTML = cfg.needs.filter(n => n.enabled).map(n => `
      <div style="display:flex;align-items:center;gap:4px;margin-bottom:2px">
        <span style="font-size:11px;width:20px">${n.icon}</span>
        <span style="font-size:10px;color:var(--text-dim);width:60px">${n.label}</span>
        <input type="number" class="need-change-val" data-key="${n.key}" value="${obj.needChanges[n.key] || 0}" min="-50" max="50" style="width:50px;font-size:10px" />
      </div>
    `).join('');

    container.querySelectorAll('.need-change-val').forEach(input => {
      input.addEventListener('change', () => {
        const key = input.dataset.key;
        const val = parseInt(input.value) || 0;
        if (val === 0) { delete obj.needChanges[key]; }
        else { obj.needChanges[key] = val; }
        State.autoSave();
      });
    });
  },

  updateTransformFields() {
    const obj = State.getSelectedObject();
    if (!obj) return;
    this.fields.x.value = obj.x;
    this.fields.y.value = obj.y;
    this.fields.w.value = obj.width;
    this.fields.h.value = obj.height;
  },

  updateRotationField() {
    const obj = State.getSelectedObject();
    if (!obj) return;
    this.fields.rotation.value = obj.rotation;
    this.valRotation.textContent = obj.rotation + '°';
  },

  applyTransform() {
    const obj = State.getSelectedObject();
    if (!obj) return;
    State.pushUndo();
    obj.x = parseInt(this.fields.x.value) || 0;
    obj.y = parseInt(this.fields.y.value) || 0;
    obj.width = Math.max(1, parseInt(this.fields.w.value) || 1);
    obj.height = Math.max(1, parseInt(this.fields.h.value) || 1);
    Canvas.updateObjectElement(obj);
    Canvas.updateHandles();
    State.autoSave();
  },

  applyRotation() {
    const obj = State.getSelectedObject();
    if (!obj) return;
    obj.rotation = parseInt(this.fields.rotation.value) || 0;
    Canvas.updateObjectElement(obj);
    Canvas.updateHandles();
  },

  applyAppearance() {
    const obj = State.getSelectedObject();
    if (!obj) return;
    State.pushUndo();
    obj.opacity = parseFloat(this.fields.opacity.value);
    obj.blendMode = this.fields.blend.value;
    Canvas.updateObjectElement(obj);
    State.autoSave();
  },

  applyInteraction() {
    const obj = State.getSelectedObject();
    if (!obj) return;
    obj.cursor = this.fields.cursor.value;
    obj.clickAction = this.fields.clickAction.value;
    obj.targetSceneId = this.fields.targetScene?.value || null;
    obj.dialogueText = this.fields.dialogueText?.value || '';
    obj.customJS = this.fields.customJS?.value || '';
    obj.flavorText = this.fields.flavor?.value || '';

    // Phase 3A
    obj.dialogueTreeId = this.fields.dialogueTree?.value || '';
    obj.giveItemId = this.fields.giveItem?.value || '';
    obj.requireItemId = this.fields.requireItem?.value || '';
    obj.requireItemFailText = this.fields.requireItemFail?.value || '';

    // Set flag
    const sfFlag = this.fields.setFlagName?.value;
    if (sfFlag) {
      obj.setFlag = {
        flag: sfFlag,
        operation: this.fields.setFlagOp?.value || 'set',
        value: this.fields.setFlagVal?.value || '',
      };
    } else {
      obj.setFlag = null;
    }

    // Check flag
    const cfFlag = this.fields.checkFlagName?.value;
    if (cfFlag) {
      obj.checkFlag = {
        flag: cfFlag,
        operator: this.fields.checkFlagOp?.value || '==',
        value: this.fields.checkFlagVal?.value || '',
      };
    } else {
      obj.checkFlag = null;
    }

    // Phase 3B: Skill check
    const skSkill = this.fields.skillCheckSkill?.value;
    if (skSkill) {
      obj.skillCheck = {
        skill: skSkill,
        difficulty: parseInt(this.fields.skillCheckDiff?.value) || 10,
        failText: this.fields.skillCheckFail?.value || '',
      };
    } else {
      obj.skillCheck = null;
    }

    // Quest action
    const qaQuest = this.fields.questActionQuest?.value;
    if (qaQuest) {
      obj.questAction = {
        questId: qaQuest,
        milestoneId: this.fields.questActionMs?.value || '',
      };
    } else {
      obj.questAction = null;
    }

    // Reputation change
    const repNPC = this.fields.repNPC?.value;
    const repType = this.fields.repType?.value;
    if (repNPC && repType) {
      obj.repChange = {
        npcId: repNPC,
        type: repType,
        delta: parseInt(this.fields.repDelta?.value) || 0,
      };
    } else {
      obj.repChange = null;
    }

    // Status effect
    obj.applyEffectId = this.fields.applyEffect?.value || '';

    State.autoSave();
  },

  updateActionParams() {
    const action = this.fields.clickAction.value;
    const showParams = action !== 'none';
    document.getElementById('click-action-params').hidden = !showParams;

    // Hide all param sections first
    ['param-scene-target', 'param-dialogue', 'param-dialogue-tree', 'param-custom-js', 'param-give-item'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.hidden = true;
    });

    // Show only the relevant one
    const paramMap = {
      'scene-change': 'param-scene-target',
      'dialogue': 'param-dialogue',
      'start-dialogue': 'param-dialogue-tree',
      'give-item': 'param-give-item',
      'custom': 'param-custom-js',
    };
    if (paramMap[action]) {
      const el = document.getElementById(paramMap[action]);
      if (el) el.hidden = false;
    }
  },

  populateSceneTargets() {
    const select = this.fields.targetScene;
    const current = select.value;
    select.innerHTML = '<option value="">-- Select Scene --</option>';
    for (const scene of State.project.scenes) {
      const opt = document.createElement('option');
      opt.value = scene.id;
      opt.textContent = scene.name;
      select.appendChild(opt);
    }
    select.value = current;
  },

  // Flavor text variants
  renderFlavorVariants(obj) {
    const container = document.getElementById('flavor-variants-container');
    if (!container) return;
    if (!obj.flavorTexts) obj.flavorTexts = [];

    let html = '';
    obj.flavorTexts.forEach((text, i) => {
      html += `
        <div class="flavor-variant-row" data-idx="${i}">
          <input type="text" value="${this._esc(text)}" class="flavor-variant-input" placeholder="Variant ${i + 1}..." />
          <button class="flavor-variant-del" title="Remove">✕</button>
        </div>
      `;
    });
    container.innerHTML = html;

    container.querySelectorAll('.flavor-variant-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.closest('.flavor-variant-row').dataset.idx);
        obj.flavorTexts[idx] = e.target.value;
        State.autoSave();
      });
    });

    container.querySelectorAll('.flavor-variant-del').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.closest('.flavor-variant-row').dataset.idx);
        obj.flavorTexts.splice(idx, 1);
        State.autoSave();
        this.renderFlavorVariants(obj);
      });
    });
  },

  addFlavorVariant() {
    const obj = State.getSelectedObject();
    if (!obj) return;
    if (!obj.flavorTexts) obj.flavorTexts = [];
    obj.flavorTexts.push('');
    State.autoSave();
    this.renderFlavorVariants(obj);
  },

  _esc(str) {
    return String(str || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },
};
