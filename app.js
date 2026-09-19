import {CLASSES,MONSTERS,ITEMS,QUESTS,SKILLS,PETS,RECIPES,DUNGEONS,BUILDINGS} from './data.js';

const SAVE_KEY='time4heroes_build_08';
const MIGRATION_KEYS=['georpg_build_07','georpg_build_06','georpg_build_05','georpg_build_04','georpg_build_03','georpg_build_02','georpg_build_01'];
const app=document.querySelector('#app');
const toastEl=document.querySelector('#toast');
let state=null;
let combat=null;
let dungeonRun=null;
let gpsWatch=null;
let currentTab='map';
let installPromptEvent=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPromptEvent=e;});
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const dist=(a,b)=>Math.hypot((a.x||0)-(b.x||0),(a.y||0)-(b.y||0));
const uid=()=>Math.random().toString(36).slice(2,10);
const daySeed=()=>Number(new Date().toISOString().slice(0,10).replaceAll('-',''));
const seeded=(seed)=>{const x=Math.sin(seed)*10000;return x-Math.floor(x)};
const fmt=n=>Math.round(n).toLocaleString('pl-PL');

function xpNeed(lvl){return Math.floor(110+60*lvl+20*lvl*lvl)}
function toast(msg){toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>toastEl.classList.remove('show'),2500)}
function save(){if(state)localStorage.setItem(SAVE_KEY,JSON.stringify(state))}
function rawLoad(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
function itemDef(id){return ITEMS[id]||{id,name:id,icon:'❓',type:'unknown',rarity:'common',value:0}}
function skillDef(id){return (SKILLS[state.player.class]||[]).find(s=>s.id===id)}
function petDef(id){return PETS[id]||null}
function itemName(inst){const d=itemDef(inst.id);return `${d.name}${(inst.upgrade||0)>0?` +${inst.upgrade}`:''}`}
function countItem(id){return state.player.inventory.filter(x=>x.id===id).reduce((a,x)=>a+(x.qty||1),0)}
function isStackable(id){return ['consumable','material'].includes(itemDef(id).type)}
function addItem(id,qty=1){if(isStackable(id)){const f=state.player.inventory.find(x=>x.id===id);if(f)f.qty=(f.qty||1)+qty;else state.player.inventory.push({id,qty});}else{for(let i=0;i<qty;i++)state.player.inventory.push({id,uid:uid(),upgrade:0});}checkQuestProgress('item',id);save()}
function removeItem(id,qty=1){let left=qty;for(let i=state.player.inventory.length-1;i>=0&&left>0;i--){const x=state.player.inventory[i];if(x.id!==id)continue;const q=x.qty||1;if(q>left){x.qty=q-left;left=0}else{left-=q;state.player.inventory.splice(i,1)}}save();return left===0}
function starterWeapon(cls){return cls==='mage'?'apprenticeStaff':cls==='hunter'||cls==='ranger'?'hunterBow':cls==='berserker'?'axe':'rustySword'}
function equippedInstance(slot){const e=state.player.equipped[slot];if(!e)return null;return state.player.inventory.find(x=>x.uid&&x.uid===e.uid)||e}
function equipmentStat(slot,key){const inst=equippedInstance(slot);if(!inst)return 0;const d=itemDef(inst.id),base=d[key]||0,up=inst.upgrade||0;if(!base)return 0;return base+(key==='crit'?up:up*2)}
function gearStat(key){return Object.keys(state.player.equipped||{}).reduce((sum,slot)=>sum+equipmentStat(slot,key),0)}
function climate(){
 const hour=state?.settings?.forceNight?1:new Date().getHours();
 const phase=hour>=6&&hour<18?'Dzień':hour>=18&&hour<22?'Zmierzch':'Noc';
 const bucket=Math.floor(new Date().getHours()/6);
 const options=[['☀️','Bezchmurnie'],['🌧️','Deszcz'],['🌫️','Mgła'],['⛈️','Burza'],['💨','Wiatr']];
 const w=options[Math.floor(seeded(daySeed()+bucket*47)*options.length)];
 return {icon:w[0],weather:w[1],phase,hour};
}

const BOUNTY_POOL=[
 {id:'wolf',name:'Wilczy trop',icon:'🐺',target:'wolf',need:3,xp:220,gold:45,rep:4},
 {id:'goblin',name:'Goblińskie zasadzki',icon:'👺',target:'goblin',need:4,xp:280,gold:55,rep:5},
 {id:'undead',name:'Kości nie spoczną',icon:'💀',target:'skeleton',need:3,xp:360,gold:70,rep:6},
 {id:'insects',name:'Plaga tkaczy',icon:'🕷️',target:'spider',need:4,xp:310,gold:60,rep:5},
 {id:'ogres',name:'Łowca olbrzymów',icon:'👹',target:'ogre',need:2,xp:520,gold:100,rep:8}
];
function makeDailyBounties(day){const pool=[...BOUNTY_POOL],out=[];for(let i=0;i<3;i++){const idx=Math.floor(seeded(day+711+i*83)*pool.length),b=pool.splice(idx,1)[0];out.push({...b,progress:0,claimed:false})}return out}
function ensureAdventureState(s=state){if(!s)return; s.adventure ||= {day:daySeed(),reputation:0,bounties:[],worldBossDay:0,achievements:{}};if(s.adventure.day!==daySeed()){s.adventure.day=daySeed();s.adventure.bounties=makeDailyBounties(daySeed())}if(!s.adventure.bounties?.length)s.adventure.bounties=makeDailyBounties(daySeed());s.adventure.achievements ||= {};s.adventure.reputation ||= 0;s.adventure.worldBossDay ||= 0}
function progressBounties(type,target,amount=1){if(type!=='kill')return;ensureAdventureState();for(const b of state.adventure.bounties){if(!b.claimed&&b.target===target)b.progress=Math.min(b.need,(b.progress||0)+amount)}updateAchievements()}
function updateAchievements(){if(!state?.adventure)return;const a=state.adventure.achievements,p=state.player;a.firstBlood ||= p.kills>=1;a.hunter ||= p.kills>=25;a.explorer ||= p.discovered.length>=6;a.delver ||= Object.values(p.dungeonClears||{}).reduce((x,y)=>x+y,0)>=3;a.veteran ||= p.level>=10;a.north ||= state.quests.done.includes('q15')}
function claimBounty(id){ensureAdventureState();const b=state.adventure.bounties.find(x=>x.id===id);if(!b||b.claimed||b.progress<b.need)return; b.claimed=true;state.player.gold+=b.gold;state.adventure.reputation+=b.rep;gainXp(b.xp);save();renderShell();toast(`Kontrakt wykonany: +${b.xp} XP • +${b.gold} 🪙 • +${b.rep} reputacji`)}
function worldBossDef(){const list=[MONSTERS.find(m=>m.id==='graveColossus'),MONSTERS.find(m=>m.id==='stormDrake')].filter(Boolean);return list[daySeed()%list.length]||MONSTERS.find(m=>m.id==='ogre')}
function startWorldBoss(){ensureAdventureState();if(state.adventure.worldBossDay===daySeed())return toast('Dzisiejszy boss świata został już pokonany.');if(state.player.level<8)return toast('Boss świata wymaga co najmniej 8 poziomu.');const m=worldBossDef(),e={id:`worldboss_${daySeed()}`,type:'monster',template:m.id,x:0,y:0,alive:true,elite:true,synthetic:true};startCombat(e,{level:Math.max(m.min,state.player.level+3),worldBoss:true})}

function normalizeState(s){
 if(!s)return null;
 s.version=8;
 s.player ||= {};
 s.player.stats ||= {str:5,agi:5,int:5,vit:5};
 s.player.inventory ||= [];
 for(const i of s.player.inventory){if(!isStackable(i.id)){i.uid ||= uid();i.upgrade ||= 0}}
 const oldEq=s.player.equipped||{};
 s.player.equipped={weapon:oldEq.weapon||null,helmet:oldEq.helmet||null,armor:oldEq.armor||null,gloves:oldEq.gloves||null,boots:oldEq.boots||null,amulet:oldEq.amulet||oldEq.trinket||null,ring1:oldEq.ring1||null,ring2:oldEq.ring2||null,offhand:oldEq.offhand||null};
 for(const slot of Object.keys(s.player.equipped)){const e=s.player.equipped[slot];if(e?.uid){const found=s.player.inventory.find(x=>x.uid===e.uid);if(found)s.player.equipped[slot]=found}}
 s.player.skills ||= [];
 s.player.skillPoints ??= 1;
 s.player.statPoints ??= 0;
 s.player.pets ||= [];
 s.player.petActive ??= null;
 s.player.bestiary ||= {};
 s.player.discovered ||= [];
 s.player.dungeons ||= [];
 s.player.dungeonClears ||= {};
 s.player.friends ||= [];
 s.player.guild ??= null;
 s.player.position ||= {x:0,y:0,lat:null,lng:null,gps:false};
 s.player.kills ||= 0;
 s.quests ||= {active:['q1'],done:[],progress:{}};
 s.quests.active ||= ['q1'];s.quests.done ||= [];s.quests.progress ||= {};
 s.world ||= {entities:generateWorld(),gpsOrigin:null};
 s.world.entities ||= generateWorld();
 s.world.gpsOrigin ??= null;
 s.settings ||= {};
 s.settings.demo ??= true;s.settings.forceNight ??= false;
 s.settings.mapFilters ||= {monster:true,poi:true,dungeon:true};
 s.settings.mapFilters.monster ??= true;s.settings.mapFilters.poi ??= true;s.settings.mapFilters.dungeon ??= true;
 s.adventure ||= {day:daySeed(),reputation:0,bounties:[],worldBossDay:0,achievements:{}};
 ensureAdventureState(s);
 if(['hunter','ranger'].includes(s.player.class)&&s.player.pets.length===0){s.player.pets.push({id:'youngWolf',level:1,xp:0});s.player.petActive='youngWolf'}
 return s;
}

function load(){
 const now=rawLoad(SAVE_KEY);if(now)return normalizeState(now);
 for(const key of MIGRATION_KEYS){const old=rawLoad(key);if(old){const migrated=normalizeState(old);localStorage.setItem(SAVE_KEY,JSON.stringify(migrated));return migrated}}
 return null;
}
function newGame(name,cls){
 const c=CLASSES[cls];
 const weapon={id:starterWeapon(cls),uid:uid(),upgrade:0};
 const armor={id:'leather',uid:uid(),upgrade:0};
 const boots={id:'trailBoots',uid:uid(),upgrade:0};
 const pets=['hunter','ranger'].includes(cls)?[{id:'youngWolf',level:1,xp:0}]:[];
 state={version:8,created:Date.now(),player:{name:name||'Wędrowiec',class:cls,level:1,xp:0,gold:55,hp:c.hp,maxHp:c.hp,mana:c.mana,maxMana:c.mana,stats:{...c.base},statPoints:0,skillPoints:1,skills:[],inventory:[weapon,armor,boots,{id:'potion',qty:3},{id:'herb',qty:3},{id:'scrap',qty:1}],equipped:{weapon,helmet:null,armor,gloves:null,boots,amulet:null,ring1:null,ring2:null,offhand:null},bestiary:{},discovered:[],dungeons:[],dungeonClears:{},position:{x:0,y:0,lat:null,lng:null,gps:false},kills:0,guild:null,friends:[],pets,petActive:pets.length?'youngWolf':null},quests:{active:['q1'],done:[],progress:{}},world:{entities:generateWorld(),gpsOrigin:null},settings:{demo:true,forceNight:false,mapFilters:{monster:true,poi:true,dungeon:true}},adventure:{day:daySeed(),reputation:0,bounties:makeDailyBounties(daySeed()),worldBossDay:0,achievements:{}}};
 save();render();
}
function rareZones(){const s=daySeed();return {yellow:{x:(seeded(s+1)-.5)*420,y:(seeded(s+2)-.5)*420,r:200},red:{x:(seeded(s+3)-.5)*560,y:(seeded(s+4)-.5)*560,r:100},black:{x:(seeded(s+5)-.5)*650,y:(seeded(s+6)-.5)*650,r:50}}}
function zoneAt(x,y){const z=rareZones();if(Math.hypot(x-z.black.x,y-z.black.y)<=z.black.r)return'black';if(Math.hypot(x-z.red.x,y-z.red.y)<=z.red.r)return'red';if(Math.hypot(x-z.yellow.x,y-z.yellow.y)<=z.yellow.r)return'yellow';return'green'}
function generateWorld(){
 const seed=daySeed(),ents=[];
 for(let i=0;i<30;i++){
  const angle=seeded(seed+i*31)*Math.PI*2,r=65+seeded(seed+i*73)*450,x=Math.cos(angle)*r,y=Math.sin(angle)*r,zone=zoneAt(x,y);
  let pool=MONSTERS.filter(m=>m.zone===zone||(zone!=='green'&&m.zone==='green'));if(!pool.length)pool=MONSTERS.filter(m=>m.zone==='green');
  const template=pool[Math.floor(seeded(seed+i*97)*pool.length)];
  ents.push({id:`m${seed}_${i}`,type:'monster',template:template.id,x,y,alive:true,respawn:0,elite:seeded(seed+i*111)>.91});
 }
 const poi=[
  {id:'pasture',name:'Opuszczone Pastwisko',icon:'🐑',x:95,y:55},{id:'wolfDen',name:'Wilcza Jama',icon:'🐾',x:165,y:80},{id:'oldRuins',name:'Stare Ruiny',icon:'🏚️',x:180,y:-112},{id:'watchPoint',name:'Punkt Obserwacyjny',icon:'👁️',x:145,y:-75},{id:'goblinCamp',name:'Gobliński Obóz',icon:'⛺',x:230,y:-95},{id:'hunterTrail',name:'Ślady Myśliwego',icon:'👣',x:-150,y:130},{id:'woundedHunter',name:'Ranny Myśliwy',icon:'🧔',x:-205,y:165},{id:'hermit',name:'Chata Pustelnika',icon:'🛖',x:-255,y:-75},{id:'nightGuest',name:'Nocny Punkt Obserwacji',icon:'🌙',x:245,y:-135},{id:'northCamp',name:'Obóz Północny',icon:'🏕️',x:430,y:210},{id:'brokenBridge',name:'Zerwany Most',icon:'🌉',x:485,y:80},{id:'coldShrine',name:'Mroźne Sanktuarium',icon:'❄️',x:520,y:-100}
 ];
 return [...ents,...DUNGEONS.map(d=>({...d,type:'dungeon'})),...poi.map(p=>({...p,type:'poi'}))];
}

function monsterTemplate(e){return MONSTERS.find(m=>m.id===e.template)||MONSTERS[0]}
function monsterLevel(m){const p=state?.player?.level||1;return clamp(p+rnd(-2,2),m.min,m.max)}
function attackPower(){const p=state.player;return Math.floor(5+p.stats.str*1.65+p.stats.agi*.55+p.stats.int*.25+gearStat('power'))}
function armorPower(){const p=state.player;return Math.floor(p.stats.vit*.55+gearStat('armor'))}
function critChance(){const p=state.player;const pet=p.petActive?petDef(p.petActive):null;return Math.min(65,5+p.stats.agi*.55+gearStat('crit')+(pet?.crit||0))}
function petInstance(){return state.player.pets.find(p=>p.id===state.player.petActive)||null}
function petPower(){const p=petInstance();if(!p)return 0;return (petDef(p.id)?.power||0)+p.level*2}

function gainXp(amount){
 const p=state.player;p.xp+=amount;let levels=0;
 while(p.xp>=xpNeed(p.level)&&p.level<100){p.xp-=xpNeed(p.level);p.level++;levels++;p.statPoints+=3;p.skillPoints+=1;const c=CLASSES[p.class];p.maxHp+=Math.floor(9+c.base.vit*.6);p.hp=p.maxHp;p.maxMana+=Math.floor(3+c.base.int*.3);p.mana=p.maxMana}
 if(levels)toast(`Awans! Poziom ${p.level}. +${levels*3} pkt statystyk i +${levels} pkt umiejętności.`);save();
}
function gainPetXp(amount){const p=petInstance();if(!p)return;p.xp+=Math.max(1,Math.floor(amount*.2));while(p.xp>=p.level*90){p.xp-=p.level*90;p.level++;toast(`${petDef(p.id).name} awansuje na poziom ${p.level}!`)}}
function rewardQuest(q){gainXp(q.xp);state.player.gold+=q.gold;if(!state.quests.done.includes(q.id))state.quests.done.push(q.id);state.quests.active=state.quests.active.filter(id=>id!==q.id);const idx=QUESTS.findIndex(x=>x.id===q.id),next=QUESTS[idx+1];if(next&&!state.quests.done.includes(next.id)&&!state.quests.active.includes(next.id))state.quests.active.push(next.id);if(q.id==='q13'&&!countItem('blackMedallion'))addItem('blackMedallion');toast(`Quest ukończony: ${q.name} • +${q.xp} XP • +${q.gold} 🪙`);save()}
function checkQuestProgress(type,target,amount=1){
 progressBounties(type,target,amount);
 for(const qid of [...state.quests.active]){const q=QUESTS.find(x=>x.id===qid);if(!q)continue;const prog=state.quests.progress[qid] ||= q.steps.map(()=>0);q.steps.forEach((s,i)=>{if(s.type!==type)return;if(type==='kill'&&(s.target==='any'||s.target===target))prog[i]=Math.min(s.count||1,prog[i]+amount);else if(type==='move')prog[i]=Math.max(prog[i],amount);else if(s.target===target)prog[i]=1});if(q.steps.every((s,i)=>prog[i]>=(s.count||1)))rewardQuest(q)}save();
}

function render(){if(!state){renderCreate();return}renderShell()}


function renderCreate(){
 let selected='knight';
 app.innerHTML=`<div class="boot mobile-boot"><section class="mobile-brand"><div class="brand-badge">BUILD 0.8 • MOBILE EDITION</div><h1 class="time4-logo"><span>TIME</span><strong>4</strong><span>HEROES</span></h1><p>Świat jest bliżej niż myślisz.</p><div class="hero-lineup">${classVisual('hunter','lineup side')}${classVisual('knight','lineup main')}${classVisual('mage','lineup side')}</div><div class="mobile-ready">📱 GPS RPG • gotowe na telefon • instalowalne jak aplikacja</div><button class="secondary install-cta" data-install-create>📲 Zainstaluj Time4Heroes</button></section><div class="card create create-mobile"><h2>Stwórz bohatera</h2><div class="form-row"><label>Imię</label><input id="heroName" maxlength="18" value="Krzysztof" autocomplete="off"></div><div class="class-grid">${Object.entries(CLASSES).map(([id,c])=>`<button class="class-btn ${id===selected?'active':''}" data-class="${id}"><span class="class-icon">${classVisual(id,'sprite-class-btn')}</span><b>${c.name}</b><div class="tiny">${c.desc}</div></button>`).join('')}</div><div id="classDesc" class="panel-item hero-preview" style="margin:12px 0"></div><button id="startGame" class="primary large">Rozpocznij przygodę</button></div></div>`;
 const desc=()=>{const c=CLASSES[selected];document.querySelector('#classDesc').innerHTML=`<div class="preview-avatar">${classVisual(selected,'sprite-preview')}</div><div><b>${c.name}</b><div class="muted">STR ${c.base.str} • AGI ${c.base.agi} • INT ${c.base.int} • VIT ${c.base.vit}</div><div>${c.desc}</div>${['hunter','ranger'].includes(selected)?'<div class="gold">🐺 Startujesz z chowańcem: Młody Wilk.</div>':''}</div>`};desc();
 document.querySelectorAll('[data-class]').forEach(b=>b.onclick=()=>{selected=b.dataset.class;document.querySelectorAll('[data-class]').forEach(x=>x.classList.toggle('active',x===b));desc()});
 document.querySelector('#startGame').onclick=()=>newGame(document.querySelector('#heroName').value.trim(),selected);
 document.querySelector('[data-install-create]')?.addEventListener('click',installPwa);
}
const GRAPHICS={
 classes:{knight:'assets/knight.png',mage:'assets/mage.png',hunter:'assets/hunter.png',berserker:'assets/berserker.png',ranger:'assets/ranger.png'},
 monsters:{wolf:'assets/wolf.png',goblin:'assets/goblin.png',skeleton:'assets/skeleton.png',spider:'assets/spider.png',elemental:'assets/elemental.png',shade:'assets/wolf.png',hellhound:'assets/wolf.png'},
 pets:{youngWolf:'assets/wolf.png'}
};
function sprite(path,alt,cls){return `<img src="${path}" alt="${alt}" class="pixel-sprite ${cls||''}">`}
function classVisual(id,cls='sprite-inline'){const c=CLASSES[id];const path=GRAPHICS.classes[id];return path?sprite(path,c?.name||id,cls):(c?.icon||'❓')}
function monsterVisual(id,cls='sprite-inline'){const m=MONSTERS.find(x=>x.id===id);const path=GRAPHICS.monsters[id];return path?sprite(path,m?.name||id,cls):(m?.icon||'❓')}
function petVisual(id,cls='sprite-inline'){const p=PETS[id];const path=GRAPHICS.pets[id]||GRAPHICS.monsters[id];return path?sprite(path,p?.name||id,cls):(p?.icon||'❓')}

function battleTheme(m){
  if(!m) return 'forest';
  if(['Nieumarli','Zjawy'].includes(m.family)) return 'crypt';
  if(['Demony'].includes(m.family)) return 'inferno';
  if(['Żywiołaki'].includes(m.family)) return 'ember';
  if(['Bestie'].includes(m.family)) return 'storm';
  return 'forest';
}
function npcCard(name, role, classId, text){
  return `<div class="npc-card"><div class="npc-portrait">${classVisual(classId,'sprite-npc')}</div><div><b>${name}</b><div class="muted">${role}</div><p>${text}</p></div></div>`;
}


function topbar(){
 const p=state.player,c=CLASSES[p.class],need=xpNeed(p.level),cl=climate(),pet=petInstance();
 return `<header class="topbar"><div class="identity"><div class="mini-avatar">${classVisual(p.class,'sprite-mini')}</div><div><b>${p.name}</b><div class="tiny">${c.name} • poziom ${p.level} <span class="build-chip">0.8</span></div></div></div><div class="bars"><div><div class="barwrap"><div class="bar hp" style="width:${100*p.hp/p.maxHp}%"></div><div class="barlabel">HP ${p.hp}/${p.maxHp}</div></div><div class="barwrap"><div class="bar xp" style="width:${100*p.xp/need}%"></div><div class="barlabel">XP ${p.xp}/${need}</div></div></div><div><div class="barwrap"><div class="bar mana" style="width:${100*p.mana/p.maxMana}%"></div><div class="barlabel">MANA ${p.mana}/${p.maxMana}</div></div><div class="tiny">ATK ${attackPower()} • Pancerz ${armorPower()} • Kryt ${critChance().toFixed(0)}%${pet?` • 🐾 lvl ${pet.level}`:''}</div></div></div><div class="resource"><span>🪙 <strong>${p.gold}</strong></span><span class="weather">${cl.icon} ${cl.weather} • ${cl.phase}</span></div></header>`;
}
function bottomNav(){const tabs=[['map','🗺️','Mapa'],['char','🧙','Postać'],['inv','🎒','Ekwipunek'],['quests','📜','Questy'],['adventure','🧭','Wyprawy'],['bestiary','📖','Bestiariusz'],['town','🍺','Miasto'],['social','👥','Gracze'],['more','⚙️','Więcej']];return `<nav class="bottom">${tabs.map(([id,ico,name])=>`<button class="navbtn ${id===currentTab?'active':''}" data-nav="${id}"><span>${ico}</span>${name}</button>`).join('')}</nav>`}
function renderShell(){app.innerHTML=`<div class="shell">${topbar()}<div class="main"><main class="viewport" id="viewport"></main><aside class="side" id="side"></aside></div>${bottomNav()}</div>`;document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>selectNav(b.dataset.nav));selectNav(currentTab,false)}
function selectNav(id,rebuild=true){currentTab=id;if(rebuild){document.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('active',b.dataset.nav===id))}const el=document.querySelector('#viewport'),side=document.querySelector('#side');if(!el||!side)return;({map:renderMap,char:renderCharacter,inv:renderInventory,quests:renderQuests,adventure:renderAdventure,bestiary:renderBestiary,town:renderTown,social:renderSocial,more:renderMore}[id]||renderMap)(el);renderSide(side,id)}
function refresh(){renderShell()}

function renderSide(el,id){
 const active=state.quests.active.map(q=>QUESTS.find(x=>x.id===q)).filter(Boolean).slice(0,3),cl=climate();
 el.innerHTML=`<h3>Świat</h3><div class="panel-list"><div class="panel-item"><b>${cl.icon} ${cl.weather}</b><div class="muted">${cl.phase}. Rzadkie strefy zmieniają pozycję każdego dnia.</div></div><div class="panel-item"><b>📍 Pozycja</b><div class="muted">x ${Math.round(state.player.position.x)} m • y ${Math.round(state.player.position.y)} m • ${state.player.position.gps?'GPS':'tryb testowy'}</div></div>${active.length?`<div class="panel-item"><b>📜 Aktywne zadania</b>${active.map(q=>`<div class="tiny" style="margin-top:6px">• ${q.name}</div>`).join('')}</div>`:''}${state.player.dungeons.length?`<div class="panel-item"><b>🕳️ Odkryte lochy</b>${state.player.dungeons.map(id=>{const d=DUNGEONS.find(x=>x.id===id);return d?`<button class="ghost" style="width:100%;margin-top:6px" data-home-dungeon="${id}">${d.icon} ${d.name}</button>`:''}).join('')}</div>`:''}</div>`;
 el.querySelectorAll('[data-home-dungeon]').forEach(b=>b.onclick=()=>startDungeon(DUNGEONS.find(d=>d.id===b.dataset.homeDungeon)));
}

function mapPoint(x,y,radius=500){return {left:50+(x-state.player.position.x)/(radius*2)*100,top:50-(y-state.player.position.y)/(radius*2)*100}}
function renderMap(el){
 const p=state.player,z=rareZones(),radius=500,filters=state.settings.mapFilters;
 for(const e of state.world.entities)if(e.type==='monster'&&!e.alive&&e.respawn<=Date.now())e.alive=true;
 const entities=state.world.entities.filter(e=>e.type!=='monster'||e.alive).filter(e=>dist(e,p.position)<=radius*1.45).filter(e=>e.type==='monster'?filters.monster:e.type==='dungeon'?filters.dungeon:filters.poi);
 const rings=Object.entries(z).map(([name,a])=>{const pt=mapPoint(a.x,a.y,radius);return `<div class="zone-ring zone-${name}" style="left:${pt.left}%;top:${pt.top}%;width:${a.r/radius*100}%;height:${a.r/radius*100}%"></div>`}).join('');
 const activeQ=state.quests.active.map(id=>QUESTS.find(q=>q.id===id)).filter(Boolean)[0];
 el.innerHTML=`<div class="section-title"><div><h2>🗺️ Mapa świata</h2><div class="muted">Odkrywaj miejsca w terenie, wracaj do lochów z domu.</div></div><div><span class="pill ${zoneAt(p.position.x,p.position.y)}">strefa ${zoneAt(p.position.x,p.position.y)}</span></div></div><div class="map-toolbar"><button class="secondary" data-gps>${gpsWatch?'📍 Wyłącz GPS':'📍 Włącz GPS'}</button>${[['monster','👹 Potwory'],['poi','📌 Miejsca'],['dungeon','🕳️ Lochy']].map(([k,n])=>`<button class="filter-btn ${filters[k]?'active':''}" data-filter="${k}">${n}</button>`).join('')}</div>${activeQ?`<div class="quest-ribbon">📜 <b>${activeQ.name}</b> — ${activeQ.steps.find((s,i)=>(state.quests.progress[activeQ.id]?.[i]||0)<(s.count||1))?.label||'Cel ukończony'}</div>`:''}<div class="map v03-map"><div class="map-grid-glow"></div>${rings}${entities.map(e=>entityHTML(e,radius)).join('')}<div class="player-pin">${classVisual(p.class,'sprite-map-player')}<i></i></div><div class="move-pad"><button class="up" data-move="0,20">▲</button><button class="left" data-move="-20,0">◀</button><button class="down" data-move="0,-20">▼</button><button class="right" data-move="20,0">▶</button></div><div class="map-scale">100 m</div></div>`;
 el.querySelectorAll('[data-entity]').forEach(b=>b.onclick=()=>interactEntity(state.world.entities.find(e=>e.id===b.dataset.entity)));
 el.querySelectorAll('[data-move]').forEach(b=>b.onclick=()=>{const [dx,dy]=b.dataset.move.split(',').map(Number);moveDemo(dx,dy)});
 el.querySelector('[data-gps]').onclick=toggleGps;
 el.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{filters[b.dataset.filter]=!filters[b.dataset.filter];save();renderMap(el)});
}
function entityHTML(e,radius){const pt=mapPoint(e.x,e.y,radius),d=dist(e,state.player.position);if(pt.left<-10||pt.left>110||pt.top<-10||pt.top>110)return'';if(e.type==='monster'){const m=monsterTemplate(e);return `<button class="entity monster ${e.elite?'elite':''}" style="left:${pt.left}%;top:${pt.top}%" title="${m.name} • ${Math.round(d)} m" data-entity="${e.id}"><span class="entity-sprite">${e.elite?'<b class="elite-star">⭐</b>':''}${monsterVisual(m.id,'sprite-entity')}</span><small>${Math.round(d)}m</small></button>`}const discovered=state.player.discovered.includes(e.id)||state.player.dungeons.includes(e.id);const icon=e.type==='dungeon'&&!discovered?'❓':e.icon;return `<button class="entity ${e.type}" style="left:${pt.left}%;top:${pt.top}%" title="${discovered?e.name:'Nieznane miejsce'} • ${Math.round(d)} m" data-entity="${e.id}"><span class="entity-sprite">${icon}</span><small>${Math.round(d)}m</small></button>`}
function moveDemo(dx,dy){state.player.position.x+=dx;state.player.position.y+=dy;state.player.position.gps=false;const away=Math.hypot(state.player.position.x,state.player.position.y);checkQuestProgress('move',null,away);save();selectNav('map')}
function interactEntity(e){if(!e)return;const d=dist(e,state.player.position);if(e.type==='monster'){if(d>75)return toast(`Podejdź bliżej. ${Math.round(d)} m.`);startCombat(e);return}if(d>40&&!(e.type==='dungeon'&&state.player.dungeons.includes(e.id)))return toast(`Musisz podejść bliżej. ${Math.round(d)} m.`);if(e.type==='poi'){if(e.id==='nightGuest'&&climate().phase!=='Noc')return toast('To miejsce ma znaczenie nocą. Włącz symulację nocy w Więcej albo wróć później.');const fresh=!state.player.discovered.includes(e.id);if(fresh)state.player.discovered.push(e.id);checkQuestProgress('discover',e.id);save();toast(fresh?`Odkryto: ${e.name}`:e.name);selectNav('map');return}if(e.type==='dungeon'){if(!state.player.dungeons.includes(e.id)){state.player.dungeons.push(e.id);state.player.discovered.push(e.id);save();toast(`Odkryto loch: ${e.name}. Od teraz wejdziesz także z domu.`)}startDungeon(DUNGEONS.find(x=>x.id===e.id)||e)}}

function toggleGps(){if(gpsWatch!==null){navigator.geolocation?.clearWatch(gpsWatch);gpsWatch=null;toast('GPS wyłączony.');selectNav('map');return}if(!navigator.geolocation)return toast('Ta przeglądarka nie udostępnia GPS.');gpsWatch=navigator.geolocation.watchPosition(pos=>{const {latitude:lat,longitude:lng}=pos.coords;if(!state.world.gpsOrigin)state.world.gpsOrigin={lat,lng};const o=state.world.gpsOrigin,dy=(lat-o.lat)*111320,dx=(lng-o.lng)*111320*Math.cos(o.lat*Math.PI/180);state.player.position={x:dx,y:dy,lat,lng,gps:true};checkQuestProgress('move',null,Math.hypot(dx,dy));save();if(currentTab==='map')selectNav('map')},err=>{toast(`GPS: ${err.message}`);gpsWatch=null},{enableHighAccuracy:true,maximumAge:3000,timeout:12000});toast('Uruchamiam GPS…')}

function renderCharacter(el){
 const p=state.player,c=CLASSES[p.class],slots=[['helmet','Hełm','⛑️'],['amulet','Amulet','📿'],['weapon','Broń','⚔️'],['armor','Pancerz','🛡️'],['offhand','Druga ręka','🛡️'],['gloves','Rękawice','🧤'],['ring1','Pierścień I','💍'],['ring2','Pierścień II','💍'],['boots','Buty','🥾']];
 const branches=[...new Set((SKILLS[p.class]||[]).map(s=>s.branch||'Umiejętności'))];
 el.innerHTML=`<div class="section-title"><div><h2>${p.name}</h2><div class="muted">${c.name} • ${c.desc}</div></div><span class="pill">lvl ${p.level}</span></div><div class="character-layout"><div class="paperdoll"><div class="paperdoll-title">WYPOSAŻENIE</div><div class="paperdoll-grid">${slots.map(([slot,label,ico])=>equipmentSlotHTML(slot,label,ico)).join('')}<div class="hero-silhouette"><div class="hero-pixel">${classVisual(p.class,'sprite-hero')}</div><b>${p.name}</b><span>${c.name}</span></div></div></div><div class="character-stats"><h3>Statystyki</h3><div class="stat-grid">${Object.entries(p.stats).map(([k,v])=>`<div class="stat-card"><b>${k.toUpperCase()}</b><div class="stat-number">${v}</div>${p.statPoints?`<button class="secondary mini" data-stat="${k}">+1</button>`:''}</div>`).join('')}</div><div class="derived-grid"><div><b>${attackPower()}</b><span>Atak</span></div><div><b>${armorPower()}</b><span>Pancerz</span></div><div><b>${critChance().toFixed(0)}%</b><span>Krytyk</span></div><div><b>${p.skillPoints}</b><span>Pkt skilli</span></div></div></div></div><div class="skill-tree-head"><div><h3>🌳 Drzewko umiejętności</h3><div class="muted">Wybierz kierunek rozwoju. Umiejętności wymagają poprzednich w swojej ścieżce.</div></div><span class="pill gold">${p.skillPoints} pkt</span></div><div class="skill-branches">${branches.map(branch=>`<section class="skill-branch"><h4>${branch}</h4>${(SKILLS[p.class]||[]).filter(s=>(s.branch||'Umiejętności')===branch).map(s=>skillCard(s)).join('<div class="skill-link">↓</div>')}</section>`).join('')}</div><h3 style="margin-top:22px">🐾 Chowańce</h3>${petSection()}`;
 el.querySelectorAll('[data-stat]').forEach(b=>b.onclick=()=>{if(p.statPoints<=0)return;p.stats[b.dataset.stat]++;p.statPoints--;if(b.dataset.stat==='vit'){p.maxHp+=5;p.hp+=5}if(b.dataset.stat==='int'){p.maxMana+=4;p.mana+=4}save();refresh()});
 el.querySelectorAll('[data-learn]').forEach(b=>b.onclick=()=>learnSkill(b.dataset.learn));
 el.querySelectorAll('[data-pet]').forEach(b=>b.onclick=()=>{p.petActive=b.dataset.pet;save();refresh();toast(`Aktywny chowaniec: ${petDef(p.petActive).name}`)});
 el.querySelectorAll('[data-slot]').forEach(b=>b.onclick=()=>{currentTab='inv';selectNav('inv');toast(`Wybierz przedmiot do slotu: ${b.dataset.slot}`)});
} 
function equipmentSlotHTML(slot,label,ico){const i=equippedInstance(slot),d=i?itemDef(i.id):null;return `<button class="gear-slot ${i?`rarity-border-${d.rarity}`:'empty'}" data-slot="${slot}"><span>${d?d.icon:ico}</span><b>${label}</b><small>${d?itemName(i):'pusty'}</small></button>`}
function skillCard(s){const p=state.player,learned=p.skills.includes(s.id),reqSkill=s.requires,canLevel=p.level>=s.req,canPrev=!reqSkill||p.skills.includes(reqSkill),can=canLevel&&canPrev&&p.skillPoints>=s.cost;return `<div class="skill-node ${learned?'learned':!can?'locked':''}"><div class="skill-orb">${s.icon}</div><div class="skill-copy"><b>${s.name}</b><div class="tiny">lvl ${s.req} • ${s.cost} pkt • mana ${s.mana}</div><p>${s.desc}</p>${reqSkill&&!canPrev?`<div class="tiny danger-text">Wymaga: ${skillDef(reqSkill)?.name||reqSkill}</div>`:''}</div>${learned?'<span class="pill green">NAUCZONE</span>':`<button class="secondary" data-learn="${s.id}" ${can?'':'disabled'}>Odblokuj</button>`}</div>`}
function learnSkill(id){const p=state.player,s=(SKILLS[p.class]||[]).find(x=>x.id===id);if(!s||p.skills.includes(id))return;if(p.level<s.req)return toast(`Wymagany poziom ${s.req}.`);if(s.requires&&!p.skills.includes(s.requires))return toast(`Najpierw odblokuj: ${skillDef(s.requires)?.name||s.requires}.`);if(p.skillPoints<s.cost)return toast('Za mało punktów umiejętności.');p.skillPoints-=s.cost;p.skills.push(id);save();refresh();toast(`Odblokowano: ${s.name}`)}
function petSection(){const p=state.player;if(!['hunter','ranger'].includes(p.class))return `<div class="panel-item"><b>🔒 Chowańce bojowe</b><div class="muted">W 0.3 bojowe chowańce są specjalizacją Łowcy i Tropiciela.</div></div>`;if(!p.pets.length)return `<div class="panel-item">Nie masz jeszcze chowańca.</div>`;return `<div class="pet-grid">${p.pets.map(x=>{const d=petDef(x.id),need=x.level*90;return `<div class="pet-card-v03 ${p.petActive===x.id?'active':''}"><div class="pet-portrait">${d.icon}</div><div><b>${d.name} • lvl ${x.level}</b><div class="tiny">Aktywna: ${d.skill} • Pasywna: ${d.passive}</div><div class="muted">${d.desc}</div><div class="barwrap"><div class="bar petbar" style="width:${100*x.xp/need}%"></div><div class="barlabel">XP ${x.xp}/${need}</div></div></div><button class="secondary" data-pet="${x.id}" ${p.petActive===x.id?'disabled':''}>${p.petActive===x.id?'Aktywny':'Wybierz'}</button></div>`}).join('')}</div>`}
function renderInventory(el){
 const p=state.player,slots=['weapon','helmet','armor','gloves','boots','amulet','ring1','ring2','offhand'];
 el.innerHTML=`<div class="section-title"><div><h2>🎒 Ekwipunek</h2><div class="muted">Porównuj, zakładaj, sprzedawaj i rozbieraj sprzęt.</div></div><span class="pill">${p.inventory.length} wpisów</span></div><div class="equip-strip">${slots.map(slot=>{const i=equippedInstance(slot),d=i?itemDef(i.id):null;return `<div class="equip-chip"><span>${d?d.icon:'·'}</span><small>${slotLabel(slot)}</small><b>${d?itemName(i):'—'}</b></div>`}).join('')}</div><h3 style="margin-top:18px">Plecak</h3><div class="inventory-grid">${p.inventory.map((i,idx)=>inventoryCard(i,idx)).join('')}</div>`;
 el.querySelectorAll('[data-equip]').forEach(b=>b.onclick=()=>equipIndex(Number(b.dataset.equip)));
 el.querySelectorAll('[data-use]').forEach(b=>b.onclick=()=>useItem(b.dataset.use));
 el.querySelectorAll('[data-sell]').forEach(b=>b.onclick=()=>sellIndex(Number(b.dataset.sell)));
 el.querySelectorAll('[data-salvage]').forEach(b=>b.onclick=()=>salvageIndex(Number(b.dataset.salvage)));
}
function slotLabel(slot){return ({weapon:'Broń',helmet:'Hełm',armor:'Pancerz',gloves:'Rękawice',boots:'Buty',amulet:'Amulet',ring1:'Pierścień I',ring2:'Pierścień II',offhand:'Druga ręka',ring:'Pierścień'})[slot]||slot}
function inventoryCard(i,idx){const d=itemDef(i.id),eqSlot=Object.entries(state.player.equipped).find(([,x])=>x?.uid&&x.uid===i.uid)?.[0],eq=!!eqSlot,qty=i.qty||1,up=i.upgrade||0,details=[d.power?`ATK +${d.power+up*2}`:'',d.armor?`Pancerz +${d.armor+up*2}`:'',d.crit?`Kryt +${d.crit+up}%`:''].filter(Boolean).join(' • ');return `<div class="item-card rarity-card-${d.rarity}"><div class="item-top"><div class="item-icon">${d.icon}</div><div><b class="rarity-${d.rarity}">${itemName(i)}${qty>1?` ×${qty}`:''}</b><div class="tiny">${rarityName(d.rarity)} • ${d.slot?slotLabel(d.slot):d.type}${details?` • ${details}`:''}</div></div></div>${eq?`<div class="equipped-tag">ZAŁOŻONE: ${slotLabel(eqSlot)}</div>`:''}<div class="tabs" style="margin-top:8px">${d.slot?`<button class="secondary" data-equip="${idx}" ${eq?'disabled':''}>${eq?'Założone':'Załóż'}</button>`:''}${d.type==='consumable'?`<button class="secondary" data-use="${d.id}">Użyj</button>`:''}${d.value>0&&!eq?`<button class="ghost" data-sell="${idx}">Sprzedaj ${Math.max(1,Math.floor(d.value*.55))} 🪙</button>`:''}${d.slot&&!eq?`<button class="ghost" data-salvage="${idx}">♻️ Rozbierz</button>`:''}</div></div>`}
function rarityName(r){return ({common:'Zwykły',uncommon:'Niezwykły',rare:'Rzadki',epic:'Epicki',heroic:'Heroiczny',legendary:'Legendarny'})[r]||r}
function equipIndex(idx){const i=state.player.inventory[idx];if(!i)return;const d=itemDef(i.id);let slot=d.slot;if(!slot)return;if(slot==='ring')slot=!state.player.equipped.ring1?'ring1':!state.player.equipped.ring2?'ring2':'ring1';state.player.equipped[slot]=i;save();refresh();toast(`Założono: ${itemName(i)} • ${slotLabel(slot)}`)}
function salvageIndex(idx){const i=state.player.inventory[idx];if(!i)return;const equipped=Object.values(state.player.equipped).some(x=>x?.uid&&x.uid===i.uid);if(equipped)return toast('Najpierw zdejmij przedmiot.');const d=itemDef(i.id),yieldScrap=Math.max(1,1+(i.upgrade||0));state.player.inventory.splice(idx,1);addItem('scrap',yieldScrap);save();refresh();toast(`Rozebrano ${d.name}: +${yieldScrap} 🔩`)}
function useItem(id){const d=itemDef(id);if(!countItem(id))return;if(d.heal){state.player.hp=Math.min(state.player.maxHp,state.player.hp+d.heal);removeItem(id);toast(`+${d.heal} HP`)}else if(d.mana){state.player.mana=Math.min(state.player.maxMana,state.player.mana+d.mana);removeItem(id);toast(`+${d.mana} many`)}else return toast('Tego przedmiotu nie można teraz użyć.');save();refresh()}
function sellIndex(idx){const i=state.player.inventory[idx];if(!i)return;const d=itemDef(i.id);state.player.gold+=Math.max(1,Math.floor(d.value*.55));if(i.qty&&i.qty>1)i.qty--;else state.player.inventory.splice(idx,1);save();refresh();toast(`Sprzedano: ${d.name}`)}

function renderQuests(el){const all=[...state.quests.active,...state.quests.done].map(id=>QUESTS.find(q=>q.id===id)).filter(Boolean);el.innerHTML=`<div class="section-title"><h2>📜 Dziennik zadań</h2><span class="pill">Cienie nad Doliną</span></div><div class="panel-list">${all.map(q=>questHTML(q)).join('')||'<div class="panel-item">Brak zadań.</div>'}</div>`}
function questHTML(q){const done=state.quests.done.includes(q.id),prog=state.quests.progress[q.id]||q.steps.map(()=>0);return `<div class="panel-item quest ${done?'done':''}"><b>${done?'✅':'📜'} ${q.name}</b><div class="tiny">Sugerowany poziom ${q.level} • ${q.xp} XP • ${q.gold} 🪙</div><p>${q.desc}</p>${q.steps.map((s,i)=>`<div class="quest-step"><span>${s.label}</span><b>${done?'✓':`${Math.min(prog[i]||0,s.count||1)}/${s.count||1}`}</b></div>`).join('')}</div>`}

function renderAdventure(el){ensureAdventureState();updateAchievements();const a=state.adventure,wb=worldBossDef(),bossDone=a.worldBossDay===daySeed();const ach=[['firstBlood','Pierwsza krew','Pokonaj pierwszego przeciwnika','⚔️'],['hunter','Łowca','Pokonaj 25 przeciwników','🏹'],['explorer','Kartograf','Odkryj 6 miejsc','🗺️'],['delver','Pogromca lochów','Ukończ 3 lochy','🕳️'],['veteran','Weteran','Osiągnij 10 poziom','⭐'],['north','Droga na północ','Ukończ pierwszy rozdział','🧭']];const north=state.quests.done.includes('q15');el.innerHTML=`<div class="section-title"><div><h2>🧭 Wyprawy</h2><div class="muted">Kontrakty odnawiają się codziennie. Reputacja: <b>${a.reputation}</b></div></div><span class="pill">SEZON 0.8</span></div><div class="adventure-grid"><section class="exp-card region-card"><div class="exp-kicker">REGIONY</div><h3>🌲 Dolina Kruka</h3><p>Region startowy • poziomy 1–10</p><div class="region-progress"><span style="width:${Math.min(100,state.player.level*10)}%"></span></div><div class="north-region ${north?'unlocked':'locked'}"><b>❄️ Północne Rubieże</b><small>${north?'ODBLOKOWANE • poziomy 11–20':'Ukończ „Drogę na północ”'}</small></div></section><section class="exp-card boss-card"><div class="exp-kicker">BOSS ŚWIATA • DZISIAJ</div><div class="world-boss-icon">${wb.icon}</div><h3>${wb.name}</h3><p>${wb.family} • rekomendowany lvl ${Math.max(8,state.player.level+2)}</p><button class="primary" data-world-boss ${bossDone?'disabled':''}>${bossDone?'✅ Pokonany dzisiaj':'⚔️ Rzuć wyzwanie'}</button></section></div><h3 class="subheading">📋 Codzienne kontrakty</h3><div class="bounty-grid">${a.bounties.map(b=>`<div class="bounty-card ${b.claimed?'claimed':''}"><div class="bounty-icon">${b.icon}</div><div><b>${b.name}</b><div class="muted">${b.progress||0}/${b.need} • ${b.xp} XP • ${b.gold} 🪙 • +${b.rep} rep.</div><div class="contract-bar"><span style="width:${Math.min(100,100*(b.progress||0)/b.need)}%"></span></div></div><button class="secondary" data-claim-bounty="${b.id}" ${b.claimed||b.progress<b.need?'disabled':''}>${b.claimed?'Odebrano':'Odbierz'}</button></div>`).join('')}</div><h3 class="subheading">🏆 Osiągnięcia</h3><div class="achievement-grid">${ach.map(([id,n,d,ico])=>`<div class="achievement ${a.achievements[id]?'done':''}"><span>${ico}</span><div><b>${n}</b><small>${d}</small></div><em>${a.achievements[id]?'✓':'•'}</em></div>`).join('')}</div>`;el.querySelector('[data-world-boss]')?.addEventListener('click',startWorldBoss);el.querySelectorAll('[data-claim-bounty]').forEach(b=>b.onclick=()=>claimBounty(b.dataset.claimBounty))}


function renderBestiary(el){
 const known=Object.entries(state.player.bestiary).sort((a,b)=>b[1]-a[1]);
 el.innerHTML=`<div class="section-title"><h2>📖 Bestiariusz</h2><span class="pill">zabicia ${state.player.kills}</span></div><div class="bestiary-grid">${known.length?known.map(([id,n])=>{const m=MONSTERS.find(x=>x.id===id);return `<button class="beast-card" data-beast="${m.id}"><div class="beast-art">${monsterVisual(m.id,'sprite-beast')}</div><div class="beast-copy"><b>${m.name}</b><div class="muted">${m.family} • strefa ${m.zone}</div><div class="tiny">Słabość: ${m.weak||'nieznana'}</div><div class="beast-kills">Pokonano <span>${n}×</span></div></div></button>`}).join(''):'<div class="panel-item">Pokonaj pierwszego potwora, aby dodać wpis.</div>'}</div>`;el.querySelectorAll('[data-beast]').forEach(b=>b.onclick=()=>openBestiaryEntry(b.dataset.beast))
}

function openBestiaryEntry(id){
 const m=MONSTERS.find(x=>x.id===id);if(!m)return;const n=state.player.bestiary[id]||0;
 openModal(`<div class="modal-head"><div><h2>${m.name}</h2><div class="muted">${m.family} • strefa ${m.zone}</div></div><button class="close" data-close>×</button></div><div class="bestiary-detail"><div class="bestiary-detail-art">${monsterVisual(m.id,'sprite-beast-big')}</div><div><div class="lore-box">${monsterLore(m)}</div><div class="derived-grid"><div><b>${m.min}–${m.max}</b><span>Poziom</span></div><div><b>${m.weak||'—'}</b><span>Słabość</span></div><div><b>${n}×</b><span>Pokonano</span></div><div><b>${m.family}</b><span>Rodzina</span></div></div></div></div>`)
}
function monsterLore(m){
 const lore={Natura:'Dziki mieszkaniec szlaków i lasów. Najczęściej atakuje samotnych wędrowców.',Owady:'Pancerz i jad czynią te stworzenia groźniejszymi, niż sugeruje ich rozmiar.',Nieumarli:'Pozostałość dawnych bitew. Magia utrzymuje ich kości w ruchu.',Zjawy:'Istoty związane z miejscami, w których śmierć zostawiła zbyt silny ślad.',Demony:'Przybysze z miejsc, w których ogień i gniew mają własną wolę.',Żywiołaki:'Skupiska pierwotnej energii związanej z kamieniem, ogniem i burzą.',Ludzie:'Bandytów i kultystów nie ogranicza natura — walczą z wyrachowaniem.',Bestie:'Rzadkie drapieżniki z najniebezpieczniejszych stref świata.'};return lore[m.family]||'Nieznane stworzenie świata Time4Heroes.'
}
function renderTown(el){const cl=climate();el.innerHTML=`<div class="section-title"><div><h2>🏘️ Wioska Startowa</h2><div class="muted">${cl.icon} ${cl.weather} • ${cl.phase}. Tutaj przygotowujesz się do kolejnych wypraw.</div></div><span class="pill">HUB 0.8</span></div><div class="town-scene"><div class="town-sky"></div><div class="town-banner"><b>WIOSKA POD KRUKIEM</b><span>Karczma • rzemieślnicy • handel • gildie</span></div><div class="town-grid v03-town">${BUILDINGS.map(b=>`<button class="building" data-building="${b.id}"><span class="building-icon">${b.icon}</span><b>${b.name}</b><div class="tiny">${b.tag||'Wejdź'}</div><em>WEJDŹ →</em></button>`).join('')}</div></div>`;el.querySelectorAll('[data-building]').forEach(b=>b.onclick=()=>openBuilding(b.dataset.building))}
function openBuilding(id){const map={tavern:['🍺 Karczma „Pod Krukiem”',tavernHTML,'tavern'],shop:['🛒 Sklep kupiecki',shopHTML,'shop'],smith:['⚒️ Kuźnia',smithHTML,'smith'],alchemist:['⚗️ Alchemik',alchemistHTML,'alchemist'],auction:['🏛️ Dom aukcyjny',auctionHTML,'auction'],guild:['🏰 Sala gildii',guildHTML,'guild']};const [title,fn,scene]=map[id]||map.tavern;openModal(`<div class="location-scene scene-${scene}"><div class="location-overlay"><div class="modal-head"><div><h2>${title}</h2><div class="muted">Wioska Startowa • Build 0.8</div></div><button class="close" data-close>×</button></div><div id="buildingBody">${fn()}</div></div></div>`);bindBuilding(id)}

function tavernHTML(){
 const next=QUESTS.find(q=>!state.quests.done.includes(q.id)&&!state.quests.active.includes(q.id)&&q.level<=state.player.level+1);
 return `${npcCard('Dorian','Karczmarz','knight','Pod dachem „Pod Krukiem” odpoczniesz, zbierzesz plotki i podejmiesz kolejne wyprawy.')}<div class="panel-list"><div class="panel-item"><b>🛏️ Odpoczynek</b><div class="muted">Pełne HP i mana za 10 🪙.</div><button class="secondary" data-rest>Odpocznij</button></div>${next?`<div class="panel-item"><b>📜 Tablica: ${next.name}</b><div>${next.desc}</div><button class="secondary" data-accept="${next.id}">Przyjmij</button></div>`:''}<div class="panel-item"><b>🗣️ Plotka dnia</b><div class="muted">„Rzadkie strefy przesuwają się o świcie. Wczorajsza droga może dziś prowadzić do czegoś zupełnie innego.”</div></div></div>`}


function shopHTML(){const ids=['potion','manaPotion','herb','scrap','leather','ironArmor'];return `${npcCard('Selma','Kupcowa','hunter','Najlepsze towary dla wędrowców: mikstury, materiały i prosty ekwipunek na start.')}<div class="panel-list">${ids.map(id=>{const i=itemDef(id);return `<div class="panel-item shoprow"><div><b>${i.icon} ${i.name}</b><div class="muted">${i.value} 🪙</div></div><button class="secondary" data-buy="${id}">Kup</button></div>`}).join('')}</div>`}


function smithHTML(){const gear=state.player.inventory.filter(i=>itemDef(i.id).slot);return `${npcCard('Ragor','Kowal','berserker','Przy ogniu i stali ulepszy twój ekwipunek nawet do +5.')}<p>Kowal ulepsza sprzęt maksymalnie do +5. Niepotrzebny sprzęt rozbierzesz w ekwipunku na złom.</p><div class="panel-list">${gear.map(i=>{const d=itemDef(i.id),up=i.upgrade||0,cost=20*(up+1),scrap=up===0?0:up;return `<div class="panel-item shoprow"><div><b>${d.icon} ${itemName(i)}</b><div class="muted">${rarityName(d.rarity)} • ${slotLabel(d.slot==='ring'?'ring1':d.slot)} • Ulepszenie: ${cost} 🪙${scrap?` + ${scrap}× 🔩`:''}</div></div><button class="secondary" data-upgrade="${i.uid}" ${up>=5?'disabled':''}>${up>=5?'MAX':'Ulepsz'}</button></div>`}).join('')}</div>`}


function alchemistHTML(){return `${npcCard('Ilyra','Alchemiczka','mage','Zna tajemnice ziół, jadu i runicznych odwarów.')}<div class="panel-list">${RECIPES.map(r=>`<div class="panel-item shoprow"><div><b>${itemDef(r.result).icon} ${r.name}</b><div class="muted">${Object.entries(r.ingredients).map(([id,q])=>`${q}× ${itemDef(id).icon} ${itemDef(id).name}`).join(' + ')}</div></div><button class="secondary" data-craft="${r.id}">Uwarz</button></div>`).join('')}</div>`}


function auctionHTML(){const offerIds=['blueBlade','forestBow','arcaneStaff','shadowRing','wolfCharm','ironHelm','emberRing'];const ids=[0,1,2,3].map(i=>offerIds[Math.floor(seeded(daySeed()+i*91)*offerIds.length)]);return `${npcCard('Varo','Licytator','ranger','Handel działa jeszcze lokalnie, ale codzienne oferty już rotują i dają klimat prawdziwego targu.')}<p class="muted">Lokalny rynek NPC. Oferty zmieniają się codziennie; prawdziwe aukcje graczy dojdą po backendzie.</p><div class="panel-list">${ids.map((id,i)=>{const d=itemDef(id),price=Math.floor(d.value*(.8+seeded(daySeed()+i*17)*.5));return `<div class="panel-item shoprow"><div><b class="rarity-${d.rarity}">${d.icon} ${d.name}</b><div class="muted">${rarityName(d.rarity)} • ${price} 🪙</div></div><button class="secondary" data-auction-buy="${id}" data-price="${price}">Kup</button></div>`}).join('')}</div>`}


function guildHTML(){return `${npcCard('Edrin','Mistrz Gildii','knight','Gildia to przyszłe centrum drużyn, rajdów i wspólnych kontraktów.')}<div class="panel-item"><b>🛡️ Gildia</b><p>${state.player.guild?`Należysz do gildii <b>${state.player.guild}</b>.`:'Nie należysz jeszcze do gildii.'}</p>${!state.player.guild?'<input id="guildName" placeholder="Nazwa gildii" style="width:100%"><button class="secondary" style="margin-top:8px" data-create-guild>Utwórz lokalną gildię demo</button>':'<div class="muted">Po podpięciu backendu pojawią się członkowie, czat, wspólne cele i gildyjne lochy.</div>'}</div>`}

function bindBuilding(id){
 document.querySelector('[data-rest]')?.addEventListener('click',()=>{if(state.player.gold<10)return toast('Za mało złota.');state.player.gold-=10;state.player.hp=state.player.maxHp;state.player.mana=state.player.maxMana;save();closeModal();refresh();toast('Odpoczynek zakończony.')});
 document.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>buyItem(b.dataset.buy,id));
 document.querySelectorAll('[data-upgrade]').forEach(b=>b.onclick=()=>upgradeItem(b.dataset.upgrade));
 document.querySelectorAll('[data-craft]').forEach(b=>b.onclick=()=>craftRecipe(b.dataset.craft));
 document.querySelectorAll('[data-auction-buy]').forEach(b=>b.onclick=()=>{const price=Number(b.dataset.price);if(state.player.gold<price)return toast('Za mało złota.');state.player.gold-=price;addItem(b.dataset.auctionBuy);save();openBuilding('auction');toast('Kupiono ofertę z rynku.')});
 document.querySelector('[data-accept]')?.addEventListener('click',e=>{if(!state.quests.active.includes(e.target.dataset.accept))state.quests.active.push(e.target.dataset.accept);save();closeModal();refresh();toast('Zadanie przyjęte.')});
 document.querySelector('[data-create-guild]')?.addEventListener('click',()=>{const n=document.querySelector('#guildName').value.trim();if(!n)return;state.player.guild=n;save();openBuilding('guild')});
}
function buyItem(id,building){const d=itemDef(id);if(state.player.gold<d.value)return toast('Za mało złota.');state.player.gold-=d.value;addItem(id);save();openBuilding(building);toast(`Kupiono: ${d.name}`)}
function upgradeItem(uidv){const i=state.player.inventory.find(x=>x.uid===uidv);if(!i)return;const up=i.upgrade||0;if(up>=5)return;const cost=20*(up+1),scrap=up===0?0:up;if(state.player.gold<cost)return toast(`Potrzebujesz ${cost} złota.`);if(countItem('scrap')<scrap)return toast(`Potrzebujesz ${scrap}× Żelazny złom.`);state.player.gold-=cost;if(scrap)removeItem('scrap',scrap);i.upgrade=up+1;save();openBuilding('smith');toast(`${itemDef(i.id).name} ulepszono do +${i.upgrade}`)}
function craftRecipe(id){const r=RECIPES.find(x=>x.id===id);if(!r)return;for(const [ing,q] of Object.entries(r.ingredients))if(countItem(ing)<q)return toast(`Brakuje: ${q}× ${itemDef(ing).name}`);for(const [ing,q] of Object.entries(r.ingredients))removeItem(ing,q);addItem(r.result,r.qty);save();openBuilding('alchemist');toast(`Uwarzono: ${r.name}`)}

function renderSocial(el){const fake=[{n:'Ardan',l:7,c:'knight',d:42},{n:'Mirael',l:6,c:'mage',d:88},{n:'Borvik',l:9,c:'berserker',d:135}];el.innerHTML=`<div class="section-title"><h2>👥 Gracze w pobliżu</h2><span class="pill">DEMO OFFLINE</span></div><p class="muted">Interfejs jest gotowy pod multiplayer. Te postacie są lokalną demonstracją.</p><div class="panel-list">${fake.map((x,i)=>`<button class="panel-item social-row" style="color:inherit;text-align:left" data-player="${i}"><div class="social-avatar">${classVisual(x.c,'sprite-social')}</div><div><b>${x.n}</b> • lvl ${x.l}<div class="muted">${CLASSES[x.c].name} • ${x.d} m od Ciebie</div></div></button>`).join('')}</div>`;el.querySelectorAll('[data-player]').forEach(b=>b.onclick=()=>openPlayer(fake[Number(b.dataset.player)]))}
function openPlayer(x){openModal(`<div class="modal-head"><div><h2>${x.n}</h2><div class="muted">${CLASSES[x.c].name} • lvl ${x.l}</div></div><button class="close" data-close>×</button></div><div class="tabs"><button class="secondary" data-social="party">➕ Drużyna</button><button class="secondary" data-social="pvp">⚔️ PvP</button><button class="secondary" data-social="trade">🤝 Handel</button><button class="secondary" data-social="profile">👤 Profil</button><button class="secondary" data-social="friend">⭐ Znajomy</button></div><p class="muted">Prawdziwa synchronizacja graczy będzie wymagała logowania i backendu realtime.</p>`);document.querySelectorAll('[data-social]').forEach(b=>b.onclick=()=>toast(`„${b.textContent.trim()}” — UI gotowe, backend jeszcze niepodłączony.`))}


function isStandalone(){return window.matchMedia?.('(display-mode: standalone)').matches||window.navigator.standalone===true}
function isIos(){return /iphone|ipad|ipod/i.test(navigator.userAgent)}
async function installPwa(){
 if(isStandalone())return toast('Time4Heroes jest już uruchomione jako aplikacja.');
 if(installPromptEvent){installPromptEvent.prompt();const r=await installPromptEvent.userChoice;installPromptEvent=null;if(r.outcome==='accepted')toast('Time4Heroes zostało dodane do telefonu.');return}
 if(isIos()){openModal(`<div class="modal-head"><div><h2>📲 Zainstaluj Time4Heroes</h2><div class="muted">iPhone / iPad</div></div><button class="close" data-close>×</button></div><div class="install-steps"><div><b>1</b><span>Otwórz grę w Safari.</span></div><div><b>2</b><span>Naciśnij ikonę <strong>Udostępnij</strong>.</span></div><div><b>3</b><span>Wybierz <strong>Do ekranu początkowego</strong>.</span></div><div><b>4</b><span>Potwierdź „Dodaj”.</span></div></div>`);return}
 openModal(`<div class="modal-head"><div><h2>📲 Zainstaluj Time4Heroes</h2><div class="muted">Android / Chrome</div></div><button class="close" data-close>×</button></div><p>Jeżeli przycisk instalacji nie pojawił się automatycznie, otwórz menu przeglądarki <b>⋮</b> i wybierz <b>Dodaj do ekranu głównego</b> albo <b>Zainstaluj aplikację</b>.</p>`)
}


function renderMore(el){el.innerHTML=`<div class="section-title"><h2>⚙️ Ustawienia</h2><span class="pill">Build 0.8</span></div><div class="panel-list"><div class="panel-item mobile-install-card"><b>📲 Time4Heroes na telefonie</b><div class="muted">Zainstaluj grę na ekranie głównym. Uruchamia się wtedy jak osobna aplikacja, bez paska przeglądarki.</div><button class="primary" data-install-app>${isStandalone()?'✅ Aplikacja zainstalowana':'Zainstaluj na telefonie'}</button></div><div class="panel-item"><b>💾 Zapis gry</b><div class="muted">Build 0.8 automatycznie przejmuje zapis z wersji 0.7 i starszych buildów. Zapis działa lokalnie w przeglądarce.</div><div class="tabs" style="margin-top:8px"><button class="secondary" data-export>Eksportuj</button><button class="secondary" data-import>Importuj</button><input type="file" id="saveFile" accept="application/json" hidden></div></div><div class="panel-item"><b>🌙 Symulacja nocy</b><div class="muted">Przydatna do testowania questów zależnych od pory dnia.</div><button class="secondary" data-night>${state.settings.forceNight?'Wyłącz symulację':'Włącz noc'}</button></div><div class="panel-item"><b>🧪 Tryb testowy mapy</b><div class="muted">Strzałki przesuwają bohatera o 20 m bez GPS.</div></div><div class="panel-item"><b>🆕 Co nowego w 0.8</b><div class="muted">Nowa nazwa Time4Heroes, pełny układ mobilny, większe cele dotykowe, przebudowana walka na telefonie i instalacja PWA.</div></div><div class="panel-item"><b>🔄 Reset</b><div class="muted">Usuwa zapis Time4Heroes Build 0.8.</div><button class="danger" data-reset>Usuń zapis</button></div></div>`;
 el.querySelector('[data-export]').onclick=exportSave;el.querySelector('[data-import]').onclick=()=>document.querySelector('#saveFile').click();document.querySelector('#saveFile').onchange=importSave;el.querySelector('[data-night]').onclick=()=>{state.settings.forceNight=!state.settings.forceNight;save();refresh()};el.querySelector('[data-install-app]')?.addEventListener('click',installPwa);el.querySelector('[data-reset]').onclick=()=>{if(confirm('Na pewno usunąć zapis?')){localStorage.removeItem(SAVE_KEY);state=null;render()}};
}
function openShowcase(){openModal(`<div class="modal-head"><div><h2>Time4Heroes</h2><div class="muted">Build 0.8 • Mobile Edition</div></div><button class="close" data-close>×</button></div><p>Gra została przebudowana pod telefon i nową markę Time4Heroes.</p>`)}
function exportSave(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='time4heroes-build-0.8-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function importSave(e){const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{state=normalizeState(JSON.parse(r.result));save();refresh();toast('Zapis zaimportowany.')}catch{toast('Nieprawidłowy plik zapisu.')}};r.readAsText(f)}

function startCombat(entity,opts={}){
 const m=monsterTemplate(entity),lvl=opts.level||monsterLevel(m),scale=.66+lvl*.075,maxHp=Math.max(24,Math.floor(m.hp*scale)),atk=Math.max(4,Math.floor(m.atk*(.62+lvl*.045)));
 combat={entity,monster:m,level:lvl,maxHp,hp:maxHp,atk,log:[`${m.name} staje do walki.`],guard:0,debuff:0,debuffTurns:0,poison:0,poisonTurns:0,mark:0,dungeon:opts.dungeon||null,worldBoss:!!opts.worldBoss};openCombat();
}
function openCombat(){const c=combat,p=state.player;if(!c)return;const cl=climate(),pet=petInstance();app.innerHTML=`<div class="battle-screen ${c.dungeon?'dungeon-battle':''} theme-${battleTheme(c.monster)}"><div class="battle-top"><div><span class="build-chip">WALKA 0.8</span><h2>${c.worldBoss?'🌍 Boss świata':c.dungeon?'🕳️ Komnata lochu':'⚔️ Spotkanie w świecie'}</h2></div><div>${cl.icon} ${cl.weather} • ${cl.phase}</div></div><div class="battle-arena"><div class="arena-layer layer-back"></div><div class="combatant hero-side"><div class="combat-name"><b>${p.name}</b><span>${CLASSES[p.class].name} • lvl ${p.level}</span></div><div class="battle-bars"><div class="barwrap bigbar"><div class="bar hp" style="width:${100*p.hp/p.maxHp}%"></div><div class="barlabel">HP ${p.hp}/${p.maxHp}</div></div><div class="barwrap bigbar"><div class="bar mana" style="width:${100*p.mana/p.maxMana}%"></div><div class="barlabel">MANA ${p.mana}/${p.maxMana}</div></div></div><div class="battle-sprite hero-sprite"><div>${classVisual(p.class,'sprite-battle')}</div><span class="shadow"></span></div>${pet?`<div class="battle-pet"><span>${petVisual(pet.id,'sprite-pet')}</span><small>${petDef(pet.id).name} lvl ${pet.level}</small></div>`:''}</div><div class="battle-center"><div class="versus">VS</div><div class="turn-indicator">TURA GRACZA</div></div><div class="combatant enemy-side"><div class="combat-name"><b>${c.entity.elite?'⭐ ':''}${c.monster.name}</b><span>${c.monster.family} • lvl ${c.level}</span></div><div class="battle-bars"><div class="barwrap bigbar"><div class="bar hp enemyhp" style="width:${100*Math.max(0,c.hp)/c.maxHp}%"></div><div class="barlabel">HP ${Math.max(0,c.hp)}/${c.maxHp}</div></div><div class="status-row">${c.poisonTurns?`<span>☠️ Trucizna ${c.poisonTurns}</span>`:''}${c.debuffTurns?`<span>⬇️ Osłabienie ${c.debuffTurns}</span>`:''}${c.markTurns?`<span>🎯 Znak ${c.markTurns}</span>`:''}</div></div><div class="battle-sprite enemy-sprite"><div>${monsterVisual(c.monster.id,'sprite-battle')}</div><span class="shadow"></span></div><div class="enemy-meta">ATK ${c.atk} • słabość: ${c.monster.weak||'nieznana'}</div></div></div><div class="battle-bottom"><div class="combat-log"><b>Dziennik walki</b>${c.log.slice(-6).map(x=>`<div>› ${x}</div>`).join('')}</div><div class="skill-hotbar"><button class="battle-skill basic" data-attack><span>⚔️</span><b>Atak</b><small>0 many</small></button>${p.skills.map(id=>skillDef(id)).filter(Boolean).map(s=>`<button class="battle-skill" data-skill="${s.id}" ${p.mana<s.mana?'disabled':''}><span>${s.icon}</span><b>${s.name}</b><small>${s.mana} many</small></button>`).join('')}<button class="battle-skill potion-skill" data-combat-potion ${countItem('potion')?'':'disabled'}><span>🧪</span><b>Mikstura</b><small>${countItem('potion')} szt.</small></button><button class="battle-skill flee-skill" data-flee><span>🏃</span><b>Ucieczka</b><small>${c.dungeon?'zablokowana':'70%'}</small></button></div></div></div>`;
 document.querySelector('[data-attack]').onclick=()=>playerAction(null);document.querySelectorAll('[data-skill]').forEach(b=>b.onclick=()=>playerAction(skillDef(b.dataset.skill)));document.querySelector('[data-combat-potion]')?.addEventListener('click',combatPotion);document.querySelector('[data-flee]').onclick=fleeCombat;
}
function logCombat(t){combat.log.push(t)}
function hitDamage(mult=1,critBonus=0){const crit=Math.random()*100<critChance()+combat.mark+critBonus,base=attackPower()*mult*(.88+Math.random()*.24),dmg=Math.max(1,Math.floor(base*(crit?1.65:1)));return {dmg,crit}}
function playerAction(skill){
 if(!combat)return;if(skill&&state.player.mana<skill.mana)return toast('Za mało many.');if(skill)state.player.mana-=skill.mana;
 if(!skill){const h=hitDamage();combat.hp-=h.dmg;logCombat(`Atakujesz za ${h.dmg}${h.crit?' (KRYTYK)':''}.`)}else if(skill.kind==='damage'){const h=hitDamage(skill.mult,skill.critBonus||0);combat.hp-=h.dmg;logCombat(`${skill.name}: ${h.dmg}${h.crit?' (KRYTYK)':''}.`);if(skill.debuff){combat.debuff=Math.max(combat.debuff,skill.debuff);combat.debuffTurns=3}}else if(skill.kind==='multi'){let total=0,crits=0;for(let i=0;i<skill.hits;i++){const h=hitDamage(skill.mult);total+=h.dmg;if(h.crit)crits++}combat.hp-=total;logCombat(`${skill.name}: ${total} obrażeń w ${skill.hits} trafieniach${crits?` • krytyki ${crits}`:''}.`)}else if(skill.kind==='guard'){combat.guard=skill.turns;logCombat(`${skill.name}: wzmacniasz obronę na ${skill.turns} tury.`)}else if(skill.kind==='debuff'){combat.debuff=Math.max(combat.debuff,skill.debuff);combat.debuffTurns=3;logCombat(`${skill.name}: przeciwnik zostaje osłabiony.`)}else if(skill.kind==='mark'){combat.mark=25;combat.markTurns=skill.turns;logCombat(`${skill.name}: oznaczasz cel.`)}else if(skill.kind==='poison'){const h=hitDamage(skill.mult);combat.hp-=h.dmg;combat.poison=Math.max(4,Math.floor(attackPower()*.24));combat.poisonTurns=skill.turns;logCombat(`${skill.name}: ${h.dmg} obrażeń i trucizna.`)}else if(skill.kind==='pet'){const h=hitDamage(skill.mult);combat.hp-=h.dmg;logCombat(`${skill.name}: ${h.dmg} obrażeń.`);petAttack(true)}else if(skill.kind==='rage'){const missing=1-state.player.hp/state.player.maxHp,mult=1.2+missing*.7,h=hitDamage(mult);combat.hp-=h.dmg;logCombat(`${skill.name}: ${h.dmg} obrażeń.`)}
 if(skill?.kind!=='pet')petAttack(false);if(combat.hp<=0)return winCombat();enemyTurn();
}
function petAttack(force){const p=petInstance();if(!p)return;if(!force&&Math.random()>.35)return;const dmg=Math.max(2,Math.floor(petPower()*(.8+Math.random()*.4)));combat.hp-=dmg;logCombat(`${petDef(p.id).icon} ${petDef(p.id).name} atakuje za ${dmg}.`)}
function enemyTurn(){if(combat.hp<=0)return winCombat();if(combat.poisonTurns>0){combat.hp-=combat.poison;combat.poisonTurns--;logCombat(`☠️ Trucizna zadaje ${combat.poison}.`);if(combat.hp<=0)return winCombat()}const reduction=armorPower()*.42,mult=(1-combat.debuff)*(combat.guard>0?.55:1),dmg=Math.max(1,Math.floor((combat.atk*(.85+Math.random()*.3)-reduction)*mult));state.player.hp=Math.max(0,state.player.hp-dmg);logCombat(`${combat.monster.name} zadaje Ci ${dmg}.`);if(combat.guard>0)combat.guard--;if(combat.debuffTurns>0&&--combat.debuffTurns===0)combat.debuff=0;if(combat.markTurns>0&&--combat.markTurns===0)combat.mark=0;if(state.player.hp<=0)return loseCombat();save();openCombat()}
function combatPotion(){if(!countItem('potion'))return;removeItem('potion');state.player.hp=Math.min(state.player.maxHp,state.player.hp+55);logCombat('Wypijasz Miksturę życia (+55 HP).');enemyTurn()}
function fleeCombat(){if(combat?.dungeon)return toast('Nie możesz uciec z tej komnaty lochu.');if(Math.random()<.7){combat=null;renderShell();toast('Udało Ci się uciec.')}else{logCombat('Nie udało się uciec!');enemyTurn()}}
function winCombat(){
 const c=combat,m=c.monster,e=c.entity,xp=Math.floor(m.xp*(.65+.055*c.level)*(e.elite?1.75:1)),gold=rnd(...m.gold)*(e.elite?2:1);
 state.player.gold+=gold;state.player.kills++;state.player.bestiary[m.id]=(state.player.bestiary[m.id]||0)+1;if(!e.synthetic){e.alive=false;e.respawn=Date.now()+5*60*1000}checkQuestProgress('kill',m.id);if(m.id==='wolf'&&Math.random()<.65)addItem('wolfPelt');if(m.family==='Nieumarli'&&Math.random()<.6)addItem('bone');if(Math.random()<.18)addItem('herb');if(Math.random()<.10)addItem('scrap');if(Math.random()<.05)addItem('crystal');if(Math.random()<.035)addItem(pick(['scoutHood','leatherGloves','trailBoots','woodenShield','oldTalisman']));if(e.elite&&Math.random()<.38)addItem(pick(['blueBlade','forestBow','arcaneStaff','wolfCharm','ironHelm','emberRing']));gainXp(xp);gainPetXp(xp);if(c.worldBoss){state.adventure.worldBossDay=daySeed();state.adventure.reputation+=25;state.player.gold+=180;addItem('titanShard');if(Math.random()<.35)addItem(pick(['stormCrown','cryptHeart']));toast('Boss świata pokonany! +25 reputacji • +180 🪙 • Odłamek Tytana')}updateAchievements();const dungeonInfo=c.dungeon;combat=null;save();if(dungeonInfo){renderShell();advanceDungeonAfterCombat(dungeonInfo);return}renderShell();toast(`Zwycięstwo! +${xp} XP • +${gold} 🪙`);
}
function loseCombat(){state.player.hp=Math.max(1,Math.floor(state.player.maxHp*.35));state.player.mana=Math.floor(state.player.maxMana*.35);state.player.gold=Math.max(0,state.player.gold-Math.min(25,state.player.gold));combat=null;dungeonRun=null;save();renderShell();toast('Porażka. Budzisz się w wiosce i tracisz część złota.')}
function startDungeon(d){if(!d)return;if(!state.player.dungeons.includes(d.id))return toast('Najpierw odkryj ten loch w świecie GPS.');dungeonRun={id:d.id,stage:0};openDungeonStage()}
function dungeonPath(){return ['Wejście','Wydarzenie','Strażnik','Boss']}
function pathHTML(){return `<div class="room-path">${dungeonPath().map((r,i)=>`<div class="room-dot ${i<dungeonRun.stage?'done':i===dungeonRun.stage?'current':''}">${i+1}. ${r}</div>`).join('')}</div>`}
function openDungeonStage(){
 const d=DUNGEONS.find(x=>x.id===dungeonRun.id),s=dungeonRun.stage;
 if(s===0){openModal(`<div class="modal-head"><div><h2>${d.icon} ${d.name}</h2><div class="muted">Sugerowany poziom ${d.min}</div></div><button class="close" data-abandon>×</button></div>${pathHTML()}<p>${d.desc}</p><div class="panel-item">Kamienne schody prowadzą w ciemność. Zapisujesz drogę — ten loch pozostanie dostępny z domu.</div><button class="primary" style="margin-top:10px" data-next-room>Wejdź głębiej</button>`);document.querySelector('[data-next-room]').onclick=()=>{dungeonRun.stage=1;openDungeonStage()};document.querySelector('[data-abandon]').onclick=abandonDungeon;return}
 if(s===1){openModal(`<div class="modal-head"><div><h2>${d.icon} ${d.name}</h2><div class="muted">Komnata wydarzenia</div></div><button class="close" data-abandon>×</button></div>${pathHTML()}<p>Rozwidlenie. Po lewej widać stare runy. Po prawej leży zamknięta skrzynia.</p><div class="tabs"><button class="secondary" data-choice="runes">✨ Zbadaj runy</button><button class="secondary" data-choice="chest">📦 Otwórz skrzynię</button></div>`);document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>dungeonChoice(b.dataset.choice));document.querySelector('[data-abandon]').onclick=abandonDungeon;return}
 if(s===2){openModal(`<div class="modal-head"><div><h2>${d.icon} ${d.name}</h2><div class="muted">Strażnik</div></div></div>${pathHTML()}<div class="panel-item"><b>Coś porusza się w ciemności.</b><div class="muted">Przed komnatą bossa czeka strażnik.</div></div><button class="primary" style="margin-top:10px" data-fight-room>Walcz</button>`);document.querySelector('[data-fight-room]').onclick=()=>startDungeonFight(false);return}
 if(s===3){openModal(`<div class="modal-head"><div><h2>${d.icon} ${d.name}</h2><div class="muted">Komnata bossa</div></div></div>${pathHTML()}<div class="panel-item"><b>🔥 Boss lochu</b><div class="muted">Po tej walce otrzymasz nagrodę za ukończenie wyprawy.</div></div><button class="primary" style="margin-top:10px" data-fight-boss>Rozpocznij walkę</button>`);document.querySelector('[data-fight-boss]').onclick=()=>startDungeonFight(true)}
}
function dungeonChoice(choice){if(choice==='runes'){state.player.mana=Math.min(state.player.maxMana,state.player.mana+30);gainXp(35);toast('Runy przywracają 30 many i dają 35 XP.')}else{if(Math.random()<.35){const dmg=Math.max(5,Math.floor(state.player.maxHp*.12));state.player.hp=Math.max(1,state.player.hp-dmg);toast(`Pułapka! -${dmg} HP.`)}else{addItem(pick(['herb','moonHerb','crystal','potion']));toast('W skrzyni znalazłeś przedmiot.')}}save();dungeonRun.stage=2;openDungeonStage()}
function startDungeonFight(boss){const d=DUNGEONS.find(x=>x.id===dungeonRun.id);let id=boss?d.boss:pick(d.id==='oldCrypt'?['skeleton','goblin']:d.id==='forgottenTower'?['cultist','ghost']:['demon','hellhound']);const m=MONSTERS.find(x=>x.id===id)||MONSTERS[0];const e={id:`d_${Date.now()}`,type:'monster',template:m.id,x:0,y:0,alive:true,elite:boss,synthetic:true};closeModal();startCombat(e,{level:clamp(state.player.level+(boss?2:0),m.min,m.max),dungeon:{boss}})}
function advanceDungeonAfterCombat(info){if(!dungeonRun)return refresh();if(info.boss){completeDungeon();return}dungeonRun.stage=3;openDungeonStage()}
function completeDungeon(){const d=DUNGEONS.find(x=>x.id===dungeonRun.id),bonus=220+state.player.level*35,gold=55+state.player.level*4;gainXp(bonus);state.player.gold+=gold;state.player.dungeonClears[d.id]=(state.player.dungeonClears[d.id]||0)+1;checkQuestProgress('dungeon',d.id);if(Math.random()<.45)addItem('crystal');if(Math.random()<.28)addItem('moonHerb');updateAchievements();dungeonRun=null;save();refresh();toast(`${d.name} ukończona! +${bonus} XP • +${gold} 🪙`)}
function abandonDungeon(){dungeonRun=null;closeModal();toast('Opuszczasz loch.')}

function openModal(html){let wrap=document.querySelector('.modal-back');if(!wrap){wrap=document.createElement('div');wrap.className='modal-back';document.body.appendChild(wrap)}wrap.innerHTML=`<div class="modal">${html}</div>`;wrap.onclick=e=>{if(e.target===wrap&&combat===null&&dungeonRun===null)closeModal()};wrap.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeModal)}
function closeModal(){document.querySelector('.modal-back')?.remove()}

state=load();
if(state?.world?.entities){for(const e of state.world.entities)if(e.type==='monster'&&!e.alive&&e.respawn<=Date.now())e.alive=true}
render();
