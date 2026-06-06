/* ===== NPC NAVIGATION & AI (Phase 3B) ===== */
const NPCAI = {
  init() { this._ensure(); },

  _ensure() {
    // NPC behaviors are stored per-object in scene, not globally
    // This module provides helpers for NPC movement patterns
  },

  BEHAVIORS: ['idle', 'patrol', 'wander', 'follow-path', 'schedule'],
  STATES: ['idle', 'walking', 'talking', 'waiting'],

  // Create default NPC behavior for an object
  createBehavior() {
    return {
      enabled: false,
      behavior: 'idle', // idle, patrol, wander, follow-path, schedule
      state: 'idle',
      speed: 2, // pixels per frame
      waypoints: [], // [{ x, y, waitTime }]
      schedule: [], // [{ hour, x, y, action }]
      patrolLoop: true,
      currentWaypointIndex: 0,
    };
  },

  // Runtime: update NPC position based on behavior
  updateNPC(obj, npcState, runtimeTime, deltaMs) {
    if (!obj.npcBehavior || !obj.npcBehavior.enabled) return;
    const b = obj.npcBehavior;
    const speed = b.speed * (deltaMs / 16.67); // normalize to ~60fps

    switch (b.behavior) {
      case 'patrol':
      case 'follow-path':
        this._moveToWaypoint(obj, npcState, b, speed);
        break;
      case 'wander':
        this._wander(obj, npcState, b, speed);
        break;
      case 'schedule':
        if (runtimeTime) {
          this._followSchedule(obj, npcState, b, runtimeTime, speed);
        }
        break;
    }
  },

  _moveToWaypoint(obj, npcState, behavior, speed) {
    const wps = behavior.waypoints;
    if (!wps || !wps.length) return;

    if (!npcState.waypointIdx) npcState.waypointIdx = 0;
    if (npcState.waiting) {
      npcState.waitTimer -= 1;
      if (npcState.waitTimer <= 0) npcState.waiting = false;
      return;
    }

    const target = wps[npcState.waypointIdx];
    const dx = target.x - obj.x;
    const dy = target.y - obj.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < speed) {
      obj.x = target.x; obj.y = target.y;
      if (target.waitTime > 0) {
        npcState.waiting = true;
        npcState.waitTimer = target.waitTime * 60; // frames
      }
      npcState.waypointIdx++;
      if (npcState.waypointIdx >= wps.length) {
        npcState.waypointIdx = behavior.patrolLoop ? 0 : wps.length - 1;
      }
    } else {
      obj.x += (dx / dist) * speed;
      obj.y += (dy / dist) * speed;
    }
  },

  _wander(obj, npcState, behavior, speed) {
    if (!npcState.wanderTarget || npcState.wanderTimer <= 0) {
      // Pick new random target near current position
      npcState.wanderTarget = {
        x: obj.x + (Math.random() - 0.5) * 200,
        y: obj.y + (Math.random() - 0.5) * 200,
      };
      npcState.wanderTimer = 120 + Math.random() * 180; // frames
    }

    const dx = npcState.wanderTarget.x - obj.x;
    const dy = npcState.wanderTarget.y - obj.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < speed) {
      npcState.wanderTimer = 0;
    } else {
      obj.x += (dx / dist) * speed;
      obj.y += (dy / dist) * speed;
      npcState.wanderTimer--;
    }
  },

  _followSchedule(obj, npcState, behavior, runtimeTime, speed) {
    const schedule = behavior.schedule;
    if (!schedule || !schedule.length) return;

    // Find current target based on time
    let target = schedule[0];
    for (const entry of schedule) {
      if (runtimeTime.hour >= entry.hour) target = entry;
    }

    const dx = target.x - obj.x;
    const dy = target.y - obj.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > speed) {
      obj.x += (dx / dist) * speed;
      obj.y += (dy / dist) * speed;
    }
  },

  createRuntimeState() {
    return {}; // { objectId: { waypointIdx, waiting, waitTimer, wanderTarget, wanderTimer } }
  },

  // Render NPC behavior editor in properties panel
  renderBehaviorEditor(container, obj) {
    if (!obj) { container.innerHTML = ''; return; }
    if (!obj.npcBehavior) obj.npcBehavior = this.createBehavior();
    const b = obj.npcBehavior;

    container.innerHTML = `
      <div style="padding:4px 0">
        <label style="font-size:11px;color:var(--text-dim);display:flex;align-items:center;gap:4px;margin-bottom:4px">
          <input type="checkbox" id="npc-enabled" ${b.enabled ? 'checked' : ''} /> NPC AI Enabled
        </label>
        <div class="prop-row">
          <label>Behavior</label>
          <select id="npc-behavior">
            ${this.BEHAVIORS.map(bh => `<option value="${bh}" ${b.behavior === bh ? 'selected' : ''}>${bh}</option>`).join('')}
          </select>
        </div>
        <div class="prop-row">
          <label>Speed</label>
          <input type="number" id="npc-speed" value="${b.speed}" min="0.1" max="20" step="0.5" style="width:60px" />
        </div>
        <div style="margin-top:4px">
          <span style="font-size:10px;color:var(--text-dim)">WAYPOINTS (${b.waypoints.length})</span>
          <div id="npc-waypoints">
            ${b.waypoints.map((wp, i) => `
              <div style="display:flex;align-items:center;gap:3px;margin-bottom:2px" data-wi="${i}">
                <span style="font-size:9px;color:var(--accent)">${i + 1}</span>
                <input type="number" class="wp-x" value="${wp.x}" style="width:50px;font-size:9px" title="X" />
                <input type="number" class="wp-y" value="${wp.y}" style="width:50px;font-size:9px" title="Y" />
                <input type="number" class="wp-wait" value="${wp.waitTime || 0}" min="0" style="width:30px;font-size:9px" title="Wait (s)" />
                <button class="wp-del" style="background:none;border:none;color:var(--text-dim);cursor:pointer;font-size:9px">✕</button>
              </div>
            `).join('')}
          </div>
          <button class="p3-btn" id="npc-add-wp" style="font-size:9px;padding:2px 6px;margin-top:2px">+ Waypoint</button>
        </div>

        <div style="margin-top:6px">
          <span style="font-size:10px;color:var(--text-dim)">SCHEDULE (${(b.schedule || []).length})</span>
          <div id="npc-schedule">
            ${(b.schedule || []).map((s, i) => `
              <div style="display:flex;align-items:center;gap:3px;margin-bottom:2px" data-si="${i}">
                <input type="number" class="sc-hour" value="${s.hour ?? 8}" min="0" max="23" style="width:30px;font-size:9px" title="Hour" />
                <input type="number" class="sc-x" value="${s.x ?? obj.x}" style="width:45px;font-size:9px" title="X" />
                <input type="number" class="sc-y" value="${s.y ?? obj.y}" style="width:45px;font-size:9px" title="Y" />
                <input type="text" class="sc-action" value="${s.action || 'idle'}" style="flex:1;font-size:9px" title="Action" />
                <button class="sc-del" style="background:none;border:none;color:var(--text-dim);cursor:pointer;font-size:9px">✕</button>
              </div>
            `).join('')}
          </div>
          <button class="p3-btn" id="npc-add-schedule" style="font-size:9px;padding:2px 6px;margin-top:2px">+ Schedule Row</button>
        </div>
      </div>
    `;

    container.querySelector('#npc-enabled')?.addEventListener('change', e => { b.enabled = e.target.checked; State.autoSave(); });
    container.querySelector('#npc-behavior')?.addEventListener('change', e => { b.behavior = e.target.value; State.autoSave(); });
    container.querySelector('#npc-speed')?.addEventListener('change', e => { b.speed = parseFloat(e.target.value) || 2; State.autoSave(); });
    container.querySelector('#npc-add-wp')?.addEventListener('click', () => {
      b.waypoints.push({ x: obj.x + 100, y: obj.y, waitTime: 0 });
      State.autoSave(); this.renderBehaviorEditor(container, obj);
    });
    container.querySelectorAll('[data-wi]').forEach(row => {
      const i = parseInt(row.dataset.wi);
      row.querySelector('.wp-x')?.addEventListener('change', e => { b.waypoints[i].x = parseInt(e.target.value); State.autoSave(); });
      row.querySelector('.wp-y')?.addEventListener('change', e => { b.waypoints[i].y = parseInt(e.target.value); State.autoSave(); });
      row.querySelector('.wp-wait')?.addEventListener('change', e => { b.waypoints[i].waitTime = parseFloat(e.target.value); State.autoSave(); });
      row.querySelector('.wp-del')?.addEventListener('click', () => { b.waypoints.splice(i, 1); State.autoSave(); this.renderBehaviorEditor(container, obj); });
    });

    container.querySelector('#npc-add-schedule')?.addEventListener('click', () => {
      if (!b.schedule) b.schedule = [];
      b.schedule.push({ hour: 8, x: obj.x, y: obj.y, action: 'idle' });
      State.autoSave();
      this.renderBehaviorEditor(container, obj);
    });

    container.querySelectorAll('[data-si]').forEach(row => {
      const i = parseInt(row.dataset.si);
      row.querySelector('.sc-hour')?.addEventListener('change', e => { b.schedule[i].hour = Math.max(0, Math.min(23, parseInt(e.target.value) || 0)); State.autoSave(); });
      row.querySelector('.sc-x')?.addEventListener('change', e => { b.schedule[i].x = parseInt(e.target.value) || 0; State.autoSave(); });
      row.querySelector('.sc-y')?.addEventListener('change', e => { b.schedule[i].y = parseInt(e.target.value) || 0; State.autoSave(); });
      row.querySelector('.sc-action')?.addEventListener('change', e => { b.schedule[i].action = e.target.value || 'idle'; State.autoSave(); });
      row.querySelector('.sc-del')?.addEventListener('click', () => { b.schedule.splice(i, 1); State.autoSave(); this.renderBehaviorEditor(container, obj); });
    });
  },
};
