/* ===== DAY-NIGHT CYCLE (Phase 3B) ===== */
const DayNight = {
  TIME_PERIODS: [
    { key: 'dawn', label: 'Dawn', hours: [5, 7], overlay: 'rgba(255,180,100,0.15)' },
    { key: 'day', label: 'Day', hours: [7, 17], overlay: 'rgba(0,0,0,0)' },
    { key: 'sunset', label: 'Sunset', hours: [17, 19], overlay: 'rgba(255,120,50,0.2)' },
    { key: 'night', label: 'Night', hours: [19, 5], overlay: 'rgba(10,10,40,0.45)' },
  ],

  init() { this._ensure(); },

  _ensure() {
    if (!State.project.rpgDayNight) {
      State.project.rpgDayNight = {
        enabled: false,
        startHour: 8,
        startDay: 1,
        minutesPerTick: 15, // how many game-minutes per interaction tick
        hoursPerRealSecond: 0, // 0 = manual advance only
        periods: this.TIME_PERIODS.map(p => ({ ...p })),
      };
    }
  },

  getConfig() { this._ensure(); return State.project.rpgDayNight; },

  createRuntimeState() {
    this._ensure();
    const cfg = State.project.rpgDayNight;
    return {
      hour: cfg.startHour,
      minute: 0,
      day: cfg.startDay,
      totalMinutes: cfg.startHour * 60,
    };
  },

  advanceTime(runtimeTime, minutes) {
    runtimeTime.totalMinutes += minutes;
    runtimeTime.minute = runtimeTime.totalMinutes % 60;
    runtimeTime.hour = Math.floor(runtimeTime.totalMinutes / 60) % 24;
    runtimeTime.day = Math.floor(runtimeTime.totalMinutes / (24 * 60)) + 1;
  },

  getCurrentPeriod(runtimeTime) {
    const cfg = this.getConfig();
    const h = runtimeTime.hour;
    for (const p of cfg.periods) {
      if (p.hours[0] <= p.hours[1]) {
        if (h >= p.hours[0] && h < p.hours[1]) return p;
      } else {
        // wraps midnight
        if (h >= p.hours[0] || h < p.hours[1]) return p;
      }
    }
    return cfg.periods[1]; // default day
  },

  getOverlayColor(runtimeTime) {
    const period = this.getCurrentPeriod(runtimeTime);
    return period ? period.overlay : 'rgba(0,0,0,0)';
  },

  formatTime(runtimeTime) {
    const h = String(runtimeTime.hour).padStart(2, '0');
    const m = String(runtimeTime.minute).padStart(2, '0');
    return `Day ${runtimeTime.day} — ${h}:${m}`;
  },

  render(container) {
    this._ensure();
    const cfg = State.project.rpgDayNight;
    container.innerHTML = `
      <div class="rpg-editor" style="padding:8px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <h4 style="margin:0;font-size:13px;color:var(--text-primary)">🌅 Day-Night Cycle</h4>
          <label style="font-size:11px;color:var(--text-dim);display:flex;align-items:center;gap:4px">
            <input type="checkbox" id="rpg-dn-enabled" ${cfg.enabled ? 'checked' : ''} /> Enabled
          </label>
        </div>
        <p style="font-size:11px;color:var(--text-dim);margin-bottom:8px">Time system with lighting overlays. Time advances on interactions or automatically.</p>
        <div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap">
          <div>
            <label style="font-size:10px;color:var(--text-dim)">START HOUR</label>
            <input type="number" id="rpg-dn-start" value="${cfg.startHour}" min="0" max="23" style="width:50px" />
          </div>
          <div>
            <label style="font-size:10px;color:var(--text-dim)">MIN/TICK</label>
            <input type="number" id="rpg-dn-tick" value="${cfg.minutesPerTick}" min="1" max="120" style="width:50px" />
          </div>
          <div>
            <label style="font-size:10px;color:var(--text-dim)">HR/SEC (0=manual)</label>
            <input type="number" id="rpg-dn-auto" value="${cfg.hoursPerRealSecond}" min="0" max="24" step="0.5" style="width:50px" />
          </div>
        </div>
        <div style="font-size:10px;color:var(--text-dim);margin-bottom:4px">TIME PERIODS</div>
        <div id="rpg-dn-periods">
          ${cfg.periods.map((p, i) => `
            <div style="display:flex;align-items:center;gap:4px;margin-bottom:3px" data-idx="${i}">
              <input type="text" class="period-label" value="${this._esc(p.label)}" style="width:55px;font-size:10px" />
              <input type="number" class="period-start" value="${p.hours[0]}" min="0" max="23" style="width:30px;font-size:10px" title="Start hour" />-
              <input type="number" class="period-end" value="${p.hours[1]}" min="0" max="23" style="width:30px;font-size:10px" title="End hour" />
              <input type="text" class="period-overlay" value="${p.overlay}" style="flex:1;font-size:9px" title="Overlay color (rgba)" />
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelector('#rpg-dn-enabled')?.addEventListener('change', e => { cfg.enabled = e.target.checked; State.autoSave(); });
    container.querySelector('#rpg-dn-start')?.addEventListener('change', e => { cfg.startHour = parseInt(e.target.value) || 8; State.autoSave(); });
    container.querySelector('#rpg-dn-tick')?.addEventListener('change', e => { cfg.minutesPerTick = parseInt(e.target.value) || 15; State.autoSave(); });
    container.querySelector('#rpg-dn-auto')?.addEventListener('change', e => { cfg.hoursPerRealSecond = parseFloat(e.target.value) || 0; State.autoSave(); });

    container.querySelectorAll('[data-idx]').forEach(row => {
      const i = parseInt(row.dataset.idx);
      row.querySelector('.period-label')?.addEventListener('change', e => { cfg.periods[i].label = e.target.value; State.autoSave(); });
      row.querySelector('.period-start')?.addEventListener('change', e => { cfg.periods[i].hours[0] = parseInt(e.target.value); State.autoSave(); });
      row.querySelector('.period-end')?.addEventListener('change', e => { cfg.periods[i].hours[1] = parseInt(e.target.value); State.autoSave(); });
      row.querySelector('.period-overlay')?.addEventListener('change', e => { cfg.periods[i].overlay = e.target.value; State.autoSave(); });
    });
  },

  _esc(s) { return String(s||'').replace(/"/g, '&quot;').replace(/</g, '&lt;'); },
};
