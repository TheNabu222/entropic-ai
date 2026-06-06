/* ===== EXPORT SYSTEM (Phase 3A Enhanced) ===== */
const GameExport = {
  init() {
    document.getElementById('btn-export').addEventListener('click', () => this.showModal());
    document.getElementById('btn-do-export').addEventListener('click', () => this.doExport());
  },

  showModal() {
    document.getElementById('modal-backdrop').hidden = false;
    document.getElementById('modal-export').hidden = false;
    document.getElementById('export-title').value = State.project.name || 'My Game';
    document.getElementById('export-width').value = State.project.canvasWidth;
    document.getElementById('export-height').value = State.project.canvasHeight;
  },

  doExport() {
    const title = document.getElementById('export-title').value || 'My Game';
    const width = parseInt(document.getElementById('export-width').value) || 800;
    const height = parseInt(document.getElementById('export-height').value) || 600;
    const inlineAssets = document.getElementById('export-inline-assets').checked;

    const html = this.generateHTML(title, width, height, inlineAssets);
    Utils.download(html, Utils.sanitizeName(title) + '.html', 'text/html');
    Project.closeModals();
  },

  generateHTML(title, width, height, inlineAssets) {
    const scenes = State.project.scenes;
    const assets = State.project.assets;
    const startScene = State.project.activeSceneId || (scenes[0] && scenes[0].id);

    // Build asset map
    const assetMap = {};
    for (const a of assets) {
      assetMap[a.id] = inlineAssets ? a.dataURL : `assets/${a.name}.png`;
    }

    // Build scene data for runtime
    const sceneData = scenes.map(s => ({
      id: s.id,
      name: s.name,
      bgColor: s.bgColor || 'transparent',
      transition: s.transition || { type: 'fade-black', duration: 0.5 },
      objects: s.objects.map(o => ({
        id: o.id,
        assetId: o.assetId,
        name: o.name,
        x: o.x, y: o.y,
        width: o.width, height: o.height,
        rotation: o.rotation,
        opacity: o.opacity,
        blendMode: o.blendMode,
        flipX: o.flipX, flipY: o.flipY,
        zIndex: o.zIndex,
        visible: o.visible,
        cursor: o.cursor,
        clickAction: o.clickAction,
        targetSceneId: o.targetSceneId,
        dialogueText: o.dialogueText,
        customJS: o.customJS,
        flavorText: o.flavorText,
        // Phase 3A
        dialogueTreeId: o.dialogueTreeId || '',
        giveItemId: o.giveItemId || '',
        requireItemId: o.requireItemId || '',
        requireItemFailText: o.requireItemFailText || '',
        setFlag: o.setFlag || null,
        checkFlag: o.checkFlag || null,
        flavorTexts: o.flavorTexts || [],
        flavorFlagConditions: o.flavorFlagConditions || [],
        // Phase 3B
        skillCheck: o.skillCheck || null,
        questAction: o.questAction || null,
        repChange: o.repChange || null,
        applyEffectId: o.applyEffectId || '',
        needChanges: o.needChanges || {},
        npcBehavior: o.npcBehavior || null,
      })),
      hitboxes: s.hitboxes.map(h => ({
        x: h.x, y: h.y,
        width: h.width, height: h.height,
        action: h.action || 'none',
        targetSceneId: h.targetSceneId || null,
      })),
    }));

    // Dialogue trees
    const dialogueTrees = (State.project.dialogueTrees || []).map(t => ({
      id: t.id,
      name: t.name,
      startNodeId: t.startNodeId,
      nodes: t.nodes.map(n => ({
        id: n.id,
        speaker: n.speaker,
        portrait: n.portrait,
        text: n.text,
        choices: (n.choices || []).map(c => ({
          text: c.text,
          nextNodeId: c.nextNodeId,
          flagAction: c.flagAction || null,
        })),
        nextNodeId: n.nextNodeId || null,
        flagCondition: n.flagCondition || null,
        flagAction: n.flagAction || null,
      })),
    }));

    // Inventory items
    const inventoryItems = (State.project.inventoryItems || []).map(item => ({
      id: item.id,
      name: item.name,
      icon: item.icon,
      description: item.description,
      examineText: item.examineText,
      stackable: item.stackable,
      maxStack: item.maxStack,
      combinations: item.combinations || [],
      category: item.category,
    }));

    // Flags
    const flags = (State.project.flags || []).map(f => ({
      name: f.name,
      type: f.type,
      defaultValue: f.defaultValue,
    }));

    const saveLoadSettings = State.project.saveLoadSettings || { autoSave: true, autoSaveOnTransition: true, maxSlots: 5, showSaveLoadUI: true };

    // Phase 3B data
    const rpgData = RPGSystems.getExportData();

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${this.escapeHTML(title)}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;background:#000;overflow:hidden;font-family:system-ui,sans-serif}
#game{position:relative;width:${width}px;height:${height}px;margin:auto;overflow:hidden;image-rendering:pixelated}
body{display:flex;align-items:center;justify-content:center;min-height:100vh}
.obj{position:absolute;user-select:none}
.obj img{width:100%;height:100%;pointer-events:none;image-rendering:pixelated;display:block}
.hitzone{position:absolute;cursor:pointer;z-index:9000}

/* Dialogue */
.dlg-box{position:absolute;bottom:20px;left:20px;right:20px;background:rgba(0,0,0,.92);border:2px solid rgba(124,92,252,.6);border-radius:10px;z-index:9999;backdrop-filter:blur(6px);overflow:hidden;animation:dlgSlide .3s ease-out}
@keyframes dlgSlide{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
.dlg-header{display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid rgba(255,255,255,.1)}
.dlg-portrait{width:48px;height:48px;border-radius:6px;background:rgba(255,255,255,.05);overflow:hidden;flex-shrink:0}
.dlg-portrait img{width:100%;height:100%;object-fit:cover;image-rendering:pixelated}
.dlg-speaker{font-size:14px;font-weight:700;color:#7c5cfc}
.dlg-text{padding:12px 16px;color:#e8e8ec;font-size:14px;line-height:1.6}
.dlg-choices{padding:8px 16px 12px;display:flex;flex-direction:column;gap:6px}
.dlg-choice{padding:8px 14px;background:rgba(124,92,252,.15);border:1px solid rgba(124,92,252,.4);border-radius:6px;color:#e8e8ec;font-size:13px;cursor:pointer;text-align:left;transition:all .15s}
.dlg-choice:hover{background:rgba(124,92,252,.3);border-color:rgba(124,92,252,.7)}
.dlg-continue{padding:6px 16px 10px;text-align:right;font-size:11px;color:rgba(255,255,255,.4);cursor:pointer}

/* Simple dialogue */
.dialogue{position:absolute;bottom:20px;left:20px;right:20px;background:rgba(0,0,0,.88);border:2px solid rgba(124,92,252,.6);border-radius:8px;padding:16px 20px;color:#e8e8ec;font-size:14px;line-height:1.5;z-index:9999;cursor:pointer;backdrop-filter:blur(4px)}

/* Inventory */
.inv-bar{position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,.85);border-top:1px solid rgba(124,92,252,.3);display:flex;align-items:center;gap:4px;padding:6px 12px;z-index:9990;min-height:48px;backdrop-filter:blur(4px)}
.inv-slot{width:40px;height:40px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:4px;display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;flex-shrink:0}
.inv-slot:hover{border-color:#7c5cfc}
.inv-slot.selected{border-color:#4ade80;box-shadow:0 0 6px rgba(74,222,128,.3)}
.inv-slot img{width:32px;height:32px;object-fit:contain;image-rendering:pixelated}
.inv-count{position:absolute;bottom:-2px;right:-2px;background:#7c5cfc;color:#fff;font-size:9px;font-weight:700;width:14px;height:14px;border-radius:7px;display:flex;align-items:center;justify-content:center}

/* Flavor tooltip */
.flavor-tip{position:absolute;padding:8px 12px;background:rgba(0,0,0,.9);border:1px solid rgba(124,92,252,.4);border-radius:6px;color:#e8e8ec;font-size:12px;z-index:9998;pointer-events:none;max-width:250px;animation:tipIn .2s ease}
@keyframes tipIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}

/* Save/Load */
.sl-btns{position:absolute;top:8px;right:8px;display:flex;gap:4px;z-index:9999}
.sl-btn{padding:4px 8px;background:rgba(0,0,0,.7);border:1px solid rgba(124,92,252,.4);border-radius:4px;color:#e8e8ec;cursor:pointer;font-size:14px}

/* Toast */
.game-toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.9);color:#e8e8ec;padding:8px 16px;border-radius:6px;font-size:13px;z-index:99999;border:1px solid rgba(124,92,252,.4)}

.fade-in{animation:fadeIn .4s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.rpg-hud{position:absolute;top:8px;left:8px;display:flex;flex-direction:column;gap:4px;z-index:9990;pointer-events:none}
</style>
</head>
<body>
<div id="game"></div>
<script>
// === ANZU GAME RUNTIME (Phase 3A) ===
const ASSETS=${JSON.stringify(assetMap)};
const SCENES=${JSON.stringify(sceneData)};
const DIALOGUES=${JSON.stringify(dialogueTrees)};
const ITEMS=${JSON.stringify(inventoryItems)};
const FLAGS_DEF=${JSON.stringify(flags)};
const SAVE_SETTINGS=${JSON.stringify(saveLoadSettings)};
const START_SCENE="${startScene}";
const RPG_DATA=${JSON.stringify(rpgData)};

let currentScene=null;
const game=document.getElementById("game");

// Runtime state
let runtimeFlags={};
let playerInventory=[];
let dialogueProgress={};
let objectStates={};
let selectedInvItem=null;

// Init flags
FLAGS_DEF.forEach(f=>{runtimeFlags[f.name]=f.defaultValue});

// Phase 3B Runtime State
let rpgNeeds={},rpgRep={},rpgQuests={},rpgSkills={skills:{},xp:{}},rpgTime={hour:8,minute:0,day:1,totalMinutes:480},rpgEffects=[],rpgNpcStates={};
(function initRPG(){
  const nd=RPG_DATA.rpgNeeds;if(nd&&nd.enabled){nd.needs.forEach(n=>{if(n.enabled)rpgNeeds[n.key]=n.defaultValue})}
  const npcs=RPG_DATA.rpgNPCs||[];npcs.forEach(n=>{rpgRep[n.id]={...n.relationships}});
  const qs=RPG_DATA.rpgQuests||[];qs.forEach(q=>{rpgQuests[q.id]={active:!q.hidden,completedMilestones:[],finished:false}});
  const sk=RPG_DATA.rpgSkills;if(sk&&sk.enabled){sk.skills.forEach(s=>{rpgSkills.skills[s.key]=s.defaultLevel;rpgSkills.xp[s.key]=0})}
  const dn=RPG_DATA.rpgDayNight;if(dn&&dn.enabled){rpgTime={hour:dn.startHour||8,minute:0,day:dn.startDay||1,totalMinutes:(dn.startHour||8)*60}}
})();

function advanceTime(mins){rpgTime.totalMinutes+=mins;rpgTime.minute=rpgTime.totalMinutes%60;rpgTime.hour=Math.floor(rpgTime.totalMinutes/60)%24;rpgTime.day=Math.floor(rpgTime.totalMinutes/(24*60))+1}
function formatTime(){return'Day '+rpgTime.day+' — '+String(rpgTime.hour).padStart(2,'0')+':'+String(rpgTime.minute).padStart(2,'0')}
function getDNOverlay(){const dn=RPG_DATA.rpgDayNight;if(!dn||!dn.enabled)return'rgba(0,0,0,0)';const h=rpgTime.hour;for(const p of dn.periods){if(p.hours[0]<=p.hours[1]){if(h>=p.hours[0]&&h<p.hours[1])return p.overlay}else{if(h>=p.hours[0]||h<p.hours[1])return p.overlay}}return'rgba(0,0,0,0)'}
function rollDice(d){return Math.floor(Math.random()*parseInt(d.replace('d','')))+1}
function skillCheck(key,diff){const sk=RPG_DATA.rpgSkills;const dice=sk?sk.defaultDice:'d20';const r=rollDice(dice);const lv=rpgSkills.skills[key]||0;const mod=Math.floor(lv/10);const tot=r+mod;return{roll:r,mod,total:tot,dc:diff,ok:tot>=diff}}
function awardXP(key,amt){rpgSkills.xp[key]=(rpgSkills.xp[key]||0)+amt;const xpNeeded=(RPG_DATA.rpgSkills||{}).xpPerLevel||100;while(rpgSkills.xp[key]>=xpNeeded){rpgSkills.xp[key]-=xpNeeded;rpgSkills.skills[key]=Math.min((rpgSkills.skills[key]||0)+1,100)}}
function applyNeedChange(changes){if(!changes)return;for(const[k,d]of Object.entries(changes)){if(rpgNeeds[k]!==undefined)rpgNeeds[k]=Math.max(0,Math.min(100,rpgNeeds[k]+d))}}
function applyRepChange(npcId,type,delta){if(!rpgRep[npcId])return;rpgRep[npcId][type]=Math.max(0,Math.min(100,(rpgRep[npcId][type]||0)+delta))}
function advanceQuest(qid,mid){if(!rpgQuests[qid])return;if(mid&&!rpgQuests[qid].completedMilestones.includes(mid))rpgQuests[qid].completedMilestones.push(mid);const qdef=(RPG_DATA.rpgQuests||[]).find(q=>q.id===qid);if(qdef&&rpgQuests[qid].completedMilestones.length>=qdef.milestones.length){rpgQuests[qid].finished=true;if(qdef.completionFlagName)runtimeFlags[qdef.completionFlagName]=true}}
function activateQuest(qid){if(rpgQuests[qid])rpgQuests[qid].active=true}
function applyStatusEffect(eid){const defs=RPG_DATA.rpgStatusEffects||[];const def=defs.find(e=>e.id===eid);if(!def)return;const ex=rpgEffects.find(e=>e.effectId===eid);if(ex){ex.remaining=def.duration}else{rpgEffects.push({effectId:eid,remaining:def.duration})}}

// === FLAG HELPERS ===
function evalCondition(c){
  if(!c||!c.flag)return true;
  const v=runtimeFlags[c.flag];
  switch(c.operator||c.op){
    case'==':return v==c.value;case'!=':return v!=c.value;
    case'>':return Number(v)>Number(c.value);case'<':return Number(v)<Number(c.value);
    case'>=':return Number(v)>=Number(c.value);case'<=':return Number(v)<=Number(c.value);
    case'truthy':return!!v;case'falsy':return!v;
    default:return true;
  }
}
function applyFlag(a){
  if(!a||!a.flag)return;
  switch(a.operation||a.op){
    case'set':runtimeFlags[a.flag]=a.value;break;
    case'toggle':runtimeFlags[a.flag]=!runtimeFlags[a.flag];break;
    case'increment':runtimeFlags[a.flag]=(Number(runtimeFlags[a.flag])||0)+(Number(a.value)||1);break;
    case'decrement':runtimeFlags[a.flag]=(Number(runtimeFlags[a.flag])||0)-(Number(a.value)||1);break;
  }
}
function evalAdvConditions(conditions){
  if(!conditions||!conditions.length)return true;
  for(const c of conditions){
    const t=c.type||'flag';
    if(t==='flag'){ if(!evalCondition(c)) return false; }
    else if(t==='inventory'){ const has=hasItem(c.itemId); if((c.operator||'has')==='has'&&!has)return false; if((c.operator||'has')==='not'&&has)return false; }
    else if(t==='reputation'){ const v=rpgRep[c.npcId]?.[c.stat||'Friendship']||0; const m=Number(c.value||0); const op=c.operator||'>='; if(op==='>='&&!(v>=m))return false; if(op==='<'&&!(v<m))return false; if(op==='>'&&!(v>m))return false; if(op==='=='&&!(v==m))return false; }
    else if(t==='skill'){ const v=rpgSkills.skills[c.skill]||0; if(v<Number(c.value||0)) return false; }
  }
  return true;
}
function applyConsequences(rules){
  if(!rules||!rules.length)return;
  for(const r of rules){
    const t=r.type||'flag';
    if(t==='flag')applyFlag(r);
    else if(t==='inventory'){ if(r.action==='add')addItem(r.itemId); if(r.action==='remove')removeItem(r.itemId,r.count||1); }
    else if(t==='reputation')applyRepChange(r.npcId,r.stat||'Friendship',Number(r.delta||0));
    else if(t==='quest'){ if(r.action==='activate')activateQuest(r.questId); if(r.action==='advance')advanceQuest(r.questId,r.milestoneId); }
    else if(t==='needs')applyNeedChange(r.changes||{});
  }
}

// === TRANSITION ===
function playTransition(type,dur,cb){
  if(!type||type==='none'){if(cb)cb();return}
  const o=document.createElement('div');
  o.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;z-index:10000;pointer-events:none';
  const ms=(dur||0.5)*1000;
  switch(type){
    case'fade-black':o.style.background='#000';o.animate([{opacity:0},{opacity:1,offset:.4},{opacity:1,offset:.6},{opacity:0}],{duration:ms,easing:'ease'});break;
    case'crossfade':o.style.background='rgba(0,0,0,.6)';o.animate([{opacity:0},{opacity:1,offset:.5},{opacity:0}],{duration:ms,easing:'ease'});break;
    case'flash':o.style.background='#fff';o.animate([{opacity:0},{opacity:1,offset:.3},{opacity:0}],{duration:Math.min(ms,500),easing:'ease'});break;
    default:if(type.startsWith('slide-')){o.style.background='#000';const d=type.replace('slide-','');const m={left:'translateX(-100%)',right:'translateX(100%)',up:'translateY(-100%)',down:'translateY(100%)'};const r={left:'right',right:'left',up:'down',down:'up'};o.animate([{transform:m[d]},{transform:'translate(0,0)',offset:.4},{transform:'translate(0,0)',offset:.6},{transform:m[r[d]]}],{duration:ms,easing:'ease-in-out'})}
  }
  game.appendChild(o);
  setTimeout(()=>{if(cb)cb()},ms*.45);
  setTimeout(()=>o.remove(),ms+100);
}

// === SAVE/LOAD ===
const SL={
  PREFIX:'anzu_game_',
  save(slot){
    const d={slot,timestamp:new Date().toISOString(),currentSceneId:currentScene?.id||START_SCENE,sceneName:currentScene?.name||'',inventory:[...playerInventory],flags:{...runtimeFlags},dialogueProgress:{...dialogueProgress},objectStates:{...objectStates},selectedInvItem,rpgNeeds:{...rpgNeeds},rpgRep:{...rpgRep},rpgQuests:{...rpgQuests},rpgSkills:JSON.parse(JSON.stringify(rpgSkills)),rpgTime:{...rpgTime},rpgEffects:JSON.parse(JSON.stringify(rpgEffects)),rpgNpcStates:JSON.parse(JSON.stringify(rpgNpcStates))};
    try{localStorage.setItem(this.PREFIX+'slot_'+slot,JSON.stringify(d));return true}catch(e){return false}
  },
  load(slot){
    try{const r=localStorage.getItem(this.PREFIX+'slot_'+slot);if(!r)return false;const d=JSON.parse(r);playerInventory=d.inventory||[];Object.assign(runtimeFlags,d.flags||{});Object.assign(dialogueProgress,d.dialogueProgress||{});Object.assign(objectStates,d.objectStates||{});selectedInvItem=d.selectedInvItem||null;Object.assign(rpgNeeds,d.rpgNeeds||{});Object.assign(rpgRep,d.rpgRep||{});Object.assign(rpgQuests,d.rpgQuests||{});if(d.rpgSkills)rpgSkills=d.rpgSkills;if(d.rpgTime)rpgTime=d.rpgTime;if(d.rpgEffects)rpgEffects=d.rpgEffects;if(d.rpgNpcStates)rpgNpcStates=d.rpgNpcStates;loadScene(d.currentSceneId);return true}catch(e){return false}
  },
  getInfo(slot){try{const r=localStorage.getItem(this.PREFIX+'slot_'+slot);return r?JSON.parse(r):null}catch(e){return null}},
  del(slot){localStorage.removeItem(this.PREFIX+'slot_'+slot)},
  autoSave(){this.save(0)},
  showUI(mode){
    const ex=document.getElementById('sl-modal');if(ex)ex.remove();
    const m=document.createElement('div');m.id='sl-modal';
    m.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:99999';
    let h='<div style="background:rgba(10,10,20,.95);border:2px solid rgba(124,92,252,.5);border-radius:10px;padding:20px;min-width:320px;backdrop-filter:blur(8px)">';
    h+='<div style="display:flex;justify-content:space-between;margin-bottom:12px"><h3 style="margin:0;color:#7c5cfc;font-size:16px">'+(mode==='save'?'💾 Save':'📂 Load')+'</h3><button id="sl-close" style="background:none;border:none;color:rgba(255,255,255,.5);font-size:18px;cursor:pointer">&times;</button></div>';
    for(let i=0;i<(SAVE_SETTINGS.maxSlots||5);i++){
      const info=this.getInfo(i);const label=i===0?'Auto-Save':'Slot '+i;
      h+='<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:6px;margin-bottom:6px">';
      if(info){h+='<div><div style="font-size:13px;color:#e8e8ec">'+label+'</div><div style="font-size:10px;color:rgba(255,255,255,.4)">'+(info.sceneName||'?')+' • '+new Date(info.timestamp).toLocaleString()+'</div></div><div style="display:flex;gap:4px">';
        if(mode==='save')h+='<button class="sl-a" data-a="save" data-s="'+i+'" style="padding:4px 8px;border-radius:4px;font-size:11px;cursor:pointer;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.05);color:#e8e8ec">Save</button>';
        if(mode==='load')h+='<button class="sl-a" data-a="load" data-s="'+i+'" style="padding:4px 8px;border-radius:4px;font-size:11px;cursor:pointer;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.05);color:#e8e8ec">Load</button>';
        h+='<button class="sl-a" data-a="del" data-s="'+i+'" style="padding:4px 8px;border-radius:4px;font-size:11px;cursor:pointer;border:1px solid rgba(239,68,68,.3);background:rgba(239,68,68,.1);color:#ef4444">✕</button></div>';
      }else{h+='<div style="font-size:12px;color:rgba(255,255,255,.3);font-style:italic">'+label+' — Empty</div>';
        if(mode==='save')h+='<button class="sl-a" data-a="save" data-s="'+i+'" style="padding:4px 8px;border-radius:4px;font-size:11px;cursor:pointer;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.05);color:#e8e8ec">Save</button>';
      }
      h+='</div>';
    }
    h+='</div>';m.innerHTML=h;document.body.appendChild(m);
    m.querySelector('#sl-close').onclick=()=>m.remove();
    m.onclick=e=>{if(e.target===m)m.remove();const b=e.target.closest('.sl-a');if(b){const s=+b.dataset.s,a=b.dataset.a;if(a==='save'){this.save(s);m.remove();gameToast('Saved!')}else if(a==='load'){this.load(s);m.remove();gameToast('Loaded!')}else if(a==='del'){this.del(s);this.showUI(mode)}}};
  }
};

function gameToast(msg){const t=document.createElement('div');t.className='game-toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>{t.style.opacity='0';t.style.transition='opacity .3s';setTimeout(()=>t.remove(),300)},2000)}

// === INVENTORY ===
function addItem(itemId,srcObjId){
  const def=ITEMS.find(i=>i.id===itemId);if(!def)return;
  const ex=playerInventory.find(i=>i.itemId===itemId);
  if(ex){if(def.stackable&&ex.count<(def.maxStack||99))ex.count++}
  else playerInventory.push({itemId,count:1});
  if(srcObjId){if(!objectStates[srcObjId])objectStates[srcObjId]={};objectStates[srcObjId].pickedUp=true}
  gameToast('Obtained: '+def.name);
  loadScene(currentScene.id);
}
function hasItem(id){return playerInventory.some(i=>i.itemId===id&&i.count>0)}
function removeItem(id,n){const i=playerInventory.findIndex(x=>x.itemId===id);if(i<0)return;playerInventory[i].count-=(n||1);if(playerInventory[i].count<=0)playerInventory.splice(i,1)}
function getUseRule(itemId,objName){const def=ITEMS.find(i=>i.id===itemId);if(!def||!def.usableOn)return null;return def.usableOn.find(r=>String(r.objectName||'').toLowerCase()===String(objName||'').toLowerCase())||null}
function tryCombine(aId,bId){
  const a=ITEMS.find(i=>i.id===aId),b=ITEMS.find(i=>i.id===bId);if(!a||!b)return false;
  const c1=(a.combinations||[]).find(c=>c.withItemId===bId&&c.resultItemId);
  const c2=(b.combinations||[]).find(c=>c.withItemId===aId&&c.resultItemId);
  const c=c1||c2;if(!c)return false;
  removeItem(aId,1);if(c.consumeBoth!==false)removeItem(bId,1);addItem(c.resultItemId,null);
  const r=ITEMS.find(i=>i.id===c.resultItemId);gameToast(r?('Combined into: '+r.name):'Items combined');
  return true;
}
function tryUseSelectedItemOnObject(obj){
  if(!selectedInvItem)return false;
  const def=ITEMS.find(i=>i.id===selectedInvItem);if(!def)return false;
  const rule=getUseRule(def.id,obj.name);
  if(rule){if(rule.consume)removeItem(def.id,1);if(rule.setFlag)applyFlag(rule.setFlag);if(rule.grantItemId)addItem(rule.grantItemId);selectedInvItem=null;renderInvBar();gameToast(rule.successText||('Used '+def.name+' on '+obj.name));return true}
  if(obj.giveItemId&&tryCombine(def.id,obj.giveItemId)){selectedInvItem=null;if(!objectStates[obj.id])objectStates[obj.id]={};objectStates[obj.id].pickedUp=true;loadScene(currentScene.id,true);return true}
  gameToast("Can't use "+def.name+" on "+obj.name);return true;
}
function renderInvBar(){
  const old=game.querySelector('.inv-bar');if(old)old.remove();
  if(!playerInventory.length)return;
  const ui=RPG_DATA.inventoryUI||{slotSize:40,position:'bottom'};
  const slotSize=Math.max(24,Number(ui.slotSize||40));
  const bar=document.createElement('div');bar.className='inv-bar';
  if(ui.position==='top'){bar.style.top='0';bar.style.bottom='auto';bar.style.borderTop='none';bar.style.borderBottom='1px solid rgba(124,92,252,.3)'}
  playerInventory.forEach(inv=>{
    const def=ITEMS.find(i=>i.id===inv.itemId);if(!def)return;
    const s=document.createElement('div');s.className='inv-slot'+(selectedInvItem===inv.itemId?' selected':'');s.style.width=slotSize+'px';s.style.height=slotSize+'px';
    const icon=def.icon?ASSETS[def.icon]:null;
    if(icon){const img=document.createElement('img');img.src=icon;img.title=def.name;img.style.width=Math.max(16,slotSize-8)+'px';img.style.height=Math.max(16,slotSize-8)+'px';s.appendChild(img)}else{s.textContent='📦';s.title=def.name}
    if(inv.count>1){const b=document.createElement('div');b.className='inv-count';b.textContent=inv.count;s.appendChild(b)}
    s.onclick=e=>{e.stopPropagation();if(selectedInvItem&&selectedInvItem!==inv.itemId){if(tryCombine(selectedInvItem,inv.itemId)){selectedInvItem=null;renderInvBar();return;}}if(selectedInvItem===inv.itemId){selectedInvItem=null;if(def.examineText)showSimpleDlg(def.examineText)}else selectedInvItem=inv.itemId;renderInvBar()};
    bar.appendChild(s);
  });
  game.appendChild(bar);
}

// === DIALOGUE TREE ===
function runDialogue(treeId){
  const tree=DIALOGUES.find(t=>t.id===treeId);if(!tree)return;
  const startId=dialogueProgress[treeId]||tree.startNodeId;
  const node=tree.nodes.find(n=>n.id===startId)||tree.nodes[0];
  showDlgNode(tree,node);
}
function showDlgNode(tree,node){
  if(!node)return;
  if(node.flagCondition&&node.flagCondition.flag&&!evalCondition(node.flagCondition)){
    if(node.nextNodeId){const nx=tree.nodes.find(n=>n.id===node.nextNodeId);if(nx)return showDlgNode(tree,nx)}return;
  }
  if(!evalAdvConditions(node.conditions||[])){
    if(node.nextNodeId){const nx=tree.nodes.find(n=>n.id===node.nextNodeId);if(nx)return showDlgNode(tree,nx)}return;
  }
  if(node.flagAction)applyFlag(node.flagAction);
  applyConsequences(node.consequences||[]);
  const old=game.querySelector('.dlg-box');if(old)old.remove();
  const d=document.createElement('div');d.className='dlg-box';
  let h='';
  if(node.speaker||node.portrait){
    const pSrc=node.portrait?ASSETS[node.portrait]:null;
    h+='<div class="dlg-header">'+(pSrc?'<div class="dlg-portrait"><img src="'+pSrc+'"/></div>':'')+'<div class="dlg-speaker">'+(node.speaker||'???')+'</div></div>';
  }
  h+='<div class="dlg-text">'+(node.text||'...')+'</div>';
  const choices=(node.choices||[]).filter(c=>evalAdvConditions(c.conditions||[]));
  if(choices.length){
    h+='<div class="dlg-choices">';choices.forEach((c,i)=>{h+='<button class="dlg-choice" data-i="'+i+'">'+(c.text||'...')+'</button>'});h+='</div>';
  }else{h+='<div class="dlg-continue">Click to continue...</div>'}
  d.innerHTML=h;
  if(choices.length){
    d.querySelectorAll('.dlg-choice').forEach(b=>{b.onclick=e=>{e.stopPropagation();const c=choices[+b.dataset.i];if(c.flagAction)applyFlag(c.flagAction);applyConsequences(c.consequences||[]);d.remove();if(c.nextNodeId){const nx=tree.nodes.find(n=>n.id===c.nextNodeId);if(nx){dialogueProgress[tree.id]=c.nextNodeId;showDlgNode(tree,nx)}}}})
  }else{d.onclick=()=>{d.remove();if(node.nextNodeId){const nx=tree.nodes.find(n=>n.id===node.nextNodeId);if(nx){dialogueProgress[tree.id]=node.nextNodeId;showDlgNode(tree,nx)}}}}
  game.appendChild(d);
}

// === FLAVOR TEXT ===
function getFlavorText(obj){
  if(obj.flavorFlagConditions&&obj.flavorFlagConditions.length){for(const c of obj.flavorFlagConditions){if(c.flag&&evalCondition(c))return c.text}}
  if(obj.flavorTexts&&obj.flavorTexts.length){const all=[obj.flavorText,...obj.flavorTexts].filter(t=>t);if(all.length)return all[Math.floor(Math.random()*all.length)]}
  return obj.flavorText||'';
}
let tipEl=null;
function showTip(obj,e){
  hideTip();const t=getFlavorText(obj);if(!t)return;
  tipEl=document.createElement('div');tipEl.className='flavor-tip';tipEl.textContent=t;
  const r=e.target.getBoundingClientRect(),gr=game.getBoundingClientRect();
  tipEl.style.left=(r.left-gr.left+r.width/2-60)+'px';tipEl.style.top=(r.top-gr.top-40)+'px';
  game.appendChild(tipEl);
}
function hideTip(){if(tipEl){tipEl.remove();tipEl=null}}

function showSimpleDlg(text){
  const old=game.querySelector('.dialogue');if(old)old.remove();
  const d=document.createElement('div');d.className='dialogue';d.textContent=text;
  d.onclick=()=>d.remove();game.appendChild(d);
}

// === SCENE LOADING ===
function loadScene(id,skipTransition){
  const scene=SCENES.find(s=>s.id===id);if(!scene)return;
  const prevId=currentScene?.id;
  currentScene=scene;

  const doRender=()=>{
    game.innerHTML="";game.style.background=scene.bgColor||"#16182a";
    const sorted=[...scene.objects].sort((a,b)=>a.zIndex-b.zIndex);
    sorted.forEach(obj=>{
      if(!obj.visible)return;
      if(objectStates[obj.id]&&objectStates[obj.id].pickedUp)return;
      if(obj.checkFlag&&obj.checkFlag.flag&&!evalCondition(obj.checkFlag))return;
      const src=ASSETS[obj.assetId];if(!src)return;
      const el=document.createElement("div");el.className="obj";el.dataset.objId=obj.id;
      const sx=obj.flipX?-1:1,sy=obj.flipY?-1:1;
      el.style.cssText=\`left:\${obj.x}px;top:\${obj.y}px;width:\${obj.width}px;height:\${obj.height}px;transform:rotate(\${obj.rotation}deg) scaleX(\${sx}) scaleY(\${sy});opacity:\${obj.opacity};mix-blend-mode:\${obj.blendMode};z-index:\${obj.zIndex};cursor:\${obj.cursor||"default"}\`;
      const img=document.createElement("img");img.src=src;img.draggable=false;
      el.appendChild(img);
      el.onmouseenter=e=>showTip(obj,e);
      el.onmouseleave=hideTip;
      el.onclick=()=>{hideTip();handleClick(obj)};
      game.appendChild(el);
    });
    scene.hitboxes.forEach(h=>{
      const z=document.createElement("div");z.className="hitzone";
      z.style.cssText=\`left:\${h.x}px;top:\${h.y}px;width:\${h.width}px;height:\${h.height}px\`;
      z.onclick=()=>{if(h.action==="scene-change"&&h.targetSceneId)loadScene(h.targetSceneId)};
      game.appendChild(z);
    });
    renderInvBar();
    renderRPGHud();
    // Day-night overlay
    if(RPG_DATA.rpgDayNight&&RPG_DATA.rpgDayNight.enabled){const dno=document.createElement('div');dno.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:8999;background:'+getDNOverlay()+';transition:background 2s ease';game.appendChild(dno)}
    ${saveLoadSettings.showSaveLoadUI ? `
    // Save/Load buttons
    const slDiv=document.createElement('div');slDiv.className='sl-btns';
    const sb=document.createElement('button');sb.className='sl-btn';sb.textContent='💾';sb.title='Save';sb.onclick=e=>{e.stopPropagation();SL.showUI('save')};
    const lb=document.createElement('button');lb.className='sl-btn';lb.textContent='📂';lb.title='Load';lb.onclick=e=>{e.stopPropagation();SL.showUI('load')};
    slDiv.appendChild(sb);slDiv.appendChild(lb);game.appendChild(slDiv);
    ` : ''}
  };

  const trans=scene.transition||{type:'none'};
  if(!skipTransition&&prevId&&prevId!==id&&trans.type!=='none'){
    ${saveLoadSettings.autoSaveOnTransition ? 'SL.autoSave();' : ''}
    playTransition(trans.type,trans.duration,doRender);
  }else{doRender()}
}

function renderRPGHud(){
  const old=game.querySelector('.rpg-hud');if(old)old.remove();
  const hud=document.createElement('div');hud.className='rpg-hud';
  hud.style.cssText='position:absolute;top:8px;left:8px;display:flex;flex-direction:column;gap:4px;z-index:9990;pointer-events:none';
  const dn=RPG_DATA.rpgDayNight;
  if(dn&&dn.enabled){const t=document.createElement('div');t.style.cssText='background:rgba(0,0,0,.7);padding:3px 8px;border-radius:4px;font-size:11px;color:#fbbf24;border:1px solid rgba(251,191,36,.3)';t.textContent=formatTime();hud.appendChild(t)}
  const nd=RPG_DATA.rpgNeeds;
  if(nd&&nd.enabled){const nb=document.createElement('div');nb.style.cssText='background:rgba(0,0,0,.7);padding:4px 8px;border-radius:4px;border:1px solid rgba(255,255,255,.1)';
    nd.needs.filter(n=>n.enabled).forEach(n=>{const v=rpgNeeds[n.key]||0;const low=v<=(nd.warningThreshold||25);
      nb.innerHTML+='<div style="display:flex;align-items:center;gap:4px;margin-bottom:2px"><span style="font-size:10px;width:14px">'+n.icon+'</span><div style="flex:1;height:6px;background:rgba(255,255,255,.1);border-radius:3px;min-width:60px;overflow:hidden"><div style="width:'+v+'%;height:100%;background:'+(low?'#ef4444':n.color)+';border-radius:3px"></div></div><span style="font-size:9px;color:'+(low?'#ef4444':'rgba(255,255,255,.5)')+';width:22px;text-align:right">'+Math.round(v)+'</span></div>'});
    hud.appendChild(nb)}
  if(rpgEffects.length){const ed=document.createElement('div');ed.style.cssText='display:flex;gap:2px';
    rpgEffects.forEach(a=>{const def=(RPG_DATA.rpgStatusEffects||[]).find(e=>e.id===a.effectId);if(!def)return;const b=document.createElement('span');b.style.cssText='background:rgba(0,0,0,.7);padding:2px 6px;border-radius:3px;font-size:10px;color:'+def.color+';border:1px solid '+def.color+'40';b.textContent=def.icon+(a.remaining>0?' '+a.remaining:'');ed.appendChild(b)});
    hud.appendChild(ed)}
  const qUI=RPG_DATA.questUI||{};
  if(qUI.showPanel){const list=(RPG_DATA.rpgQuests||[]).filter(q=>rpgQuests[q.id]?.active&&!rpgQuests[q.id]?.finished&&(rpgQuests[q.id]?.tracked!==false));
    if(list.length){const qd=document.createElement('div');qd.style.cssText='background:rgba(0,0,0,.7);padding:4px 8px;border-radius:4px;border:1px solid '+(qUI.accent||'#7c5cfc')+'55;max-width:230px';
      qd.innerHTML='<div style="font-size:10px;color:'+(qUI.accent||'#7c5cfc')+';margin-bottom:2px">QUEST LOG</div>'+list.slice(0,3).map(q=>'<div style="font-size:10px;color:#d9d9e0">• '+q.name+'</div>').join('');
      hud.appendChild(qd)} }
  game.appendChild(hud);
}

function getObjEl(id){return game.querySelector('.obj[data-obj-id="'+id+'"]')}
function npcTick(){
  if(!currentScene)return;
  const objs=currentScene.objects||[];
  for(const obj of objs){
    const b=obj.npcBehavior;if(!b||!b.enabled)continue;
    if(!rpgNpcStates[obj.id])rpgNpcStates[obj.id]={waypointIdx:0,wait:0,wanderTarget:null};
    const st=rpgNpcStates[obj.id];
    if(b.behavior==='schedule'&&b.schedule&&b.schedule.length){let t=b.schedule[0];for(const s of b.schedule){if(rpgTime.hour>=s.hour)t=s;}obj.x+=Math.sign((t.x||obj.x)-obj.x)*Math.min(Math.abs((t.x||obj.x)-obj.x),b.speed||2);obj.y+=Math.sign((t.y||obj.y)-obj.y)*Math.min(Math.abs((t.y||obj.y)-obj.y),b.speed||2)}
    else if((b.behavior==='patrol'||b.behavior==='follow-path')&&b.waypoints&&b.waypoints.length){if(st.wait>0){st.wait--;continue;}const wp=b.waypoints[st.waypointIdx%b.waypoints.length];const dx=wp.x-obj.x,dy=wp.y-obj.y,dist=Math.hypot(dx,dy)||1,sp=b.speed||2;if(dist<=sp){obj.x=wp.x;obj.y=wp.y;st.wait=(wp.waitTime||0)*10;st.waypointIdx=(st.waypointIdx+1)%(b.waypoints.length||1)}else{obj.x+=dx/dist*sp;obj.y+=dy/dist*sp}}
    const el=getObjEl(obj.id);if(el){el.style.left=obj.x+'px';el.style.top=obj.y+'px';}
  }
}

function handleClick(obj){
  if(tryUseSelectedItemOnObject(obj))return;
  // Check require item
  if(obj.requireItemId){if(!hasItem(obj.requireItemId)){showSimpleDlg(obj.requireItemFailText||"You need something to interact with this.");return}}
  // Phase 3B: Skill check
  if(obj.skillCheck&&obj.skillCheck.skill){const r=skillCheck(obj.skillCheck.skill,obj.skillCheck.difficulty||10);if(!r.ok){showSimpleDlg(obj.skillCheck.failText||'Skill check failed! ('+r.total+' vs DC '+r.dc+')');awardXP(obj.skillCheck.skill,5);return}awardXP(obj.skillCheck.skill,15);gameToast('✓ Check passed! ('+r.total+' vs DC '+r.dc+')')}
  // Apply flag
  if(obj.setFlag)applyFlag(obj.setFlag);
  // Phase 3B interactions
  if(obj.needChanges)applyNeedChange(obj.needChanges);
  if(obj.repChange&&obj.repChange.npcId)applyRepChange(obj.repChange.npcId,obj.repChange.type,obj.repChange.delta);
  if(obj.questAction&&obj.questAction.questId){if(obj.questAction.milestoneId){advanceQuest(obj.questAction.questId,obj.questAction.milestoneId);gameToast('📜 Quest updated!')}else{activateQuest(obj.questAction.questId);gameToast('📜 New quest!')}}
  if(obj.applyEffectId)applyStatusEffect(obj.applyEffectId);
  if(RPG_DATA.rpgDayNight&&RPG_DATA.rpgDayNight.enabled)advanceTime(RPG_DATA.rpgDayNight.minutesPerTick||15);
  renderRPGHud();
  switch(obj.clickAction){
    case"scene-change":if(obj.targetSceneId)loadScene(obj.targetSceneId);break;
    case"dialogue":showSimpleDlg(obj.dialogueText||"...");break;
    case"start-dialogue":if(obj.dialogueTreeId)runDialogue(obj.dialogueTreeId);break;
    case"give-item":if(obj.giveItemId)addItem(obj.giveItemId,obj.id);break;
    case"custom":try{new Function("flags","inventory",obj.customJS)(runtimeFlags,playerInventory)}catch(e){console.warn(e)}break;
  }
}

// Runtime engine module aliases (Phase 3 compatibility layer)
const DialogueEngine={run:runDialogue,showNode:showDlgNode};
const InventoryEngine={addItem,removeItem,hasItem,combine:tryCombine,render:renderInvBar};
const NeedsEngine={getState:()=>rpgNeeds,apply:applyNeedChange};
const RelationshipEngine={getState:()=>rpgRep,apply:applyRepChange};
const QuestEngine={getState:()=>rpgQuests,advance:advanceQuest,activate:activateQuest};
const StatsEngine={rollDice,skillCheck,awardXP,getState:()=>rpgSkills};
const TimeEngine={getState:()=>rpgTime,advance:advanceTime,format:formatTime};
const NPCEngine={getState:()=>rpgNpcStates};
const SaveLoadEngine=SL;

// Passive runtime loops: time, needs, status effects, NPC movement
setInterval(()=>{
  const dn=RPG_DATA.rpgDayNight;
  if(dn&&dn.enabled&&Number(dn.hoursPerRealSecond||0)>0){
    const mins=(Number(dn.hoursPerRealSecond)*60)/10;
    advanceTime(mins);
  }
  const nd=RPG_DATA.rpgNeeds;
  if(nd&&nd.enabled&&nd.decayEnabled){
    nd.needs.filter(n=>n.enabled).forEach(n=>{if(rpgNeeds[n.key]!==undefined)rpgNeeds[n.key]=Math.max(0,rpgNeeds[n.key]-((n.decayRate||0.1)*(nd.decayMultiplier||1)*0.1))});
  }
  if(rpgEffects.length){for(let i=rpgEffects.length-1;i>=0;i--){if(rpgEffects[i].remaining>0){rpgEffects[i].remaining--;if(rpgEffects[i].remaining<=0)rpgEffects.splice(i,1)}}}
  npcTick();
  if(currentScene)renderRPGHud();
},100);

// Try loading auto-save
${saveLoadSettings.autoSave ? `if(SL.getInfo(0)){const autoData=SL.getInfo(0);if(confirm('Continue from last save?')){SL.load(0)}else{loadScene(START_SCENE)}}else{loadScene(START_SCENE)}` : `loadScene(START_SCENE);`}
<\/script>
</body>
</html>`;
  },

  escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },
};
