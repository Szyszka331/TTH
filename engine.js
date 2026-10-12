import {SPAWN,GATE,safePosition} from './navigation.js?v=4.2.0';
import {CLASSES,ITEMS,ENEMIES,QUESTS,AFFIXES,ELITE_NAMES,TACTICS,HUNTS} from './data.js?v=4.2.0';
export const CAPACITY=36;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
let sequence=0;
const uid=()=>Date.now().toString(36)+'-'+(++sequence).toString(36);
export function createHero(cls='knight',now=Date.now()){
 if(!CLASSES[cls])cls='knight';const c=CLASSES[cls],weapon={uid:uid(),id:c.weapon+'0',qty:1,upgrade:0};
 const s={version:1,classId:cls,name:'Wędrowiec',level:1,xp:0,gold:60,hp:c.hp,mana:c.mana,inventory:[weapon,{uid:uid(),id:'potion',qty:3},{uid:uid(),id:'mana',qty:2}],equipped:{weapon:weapon.uid},skillPoints:0,skills:{[c.skills[0][0]]:1},kills:{},quest:0,questClaimed:[],questBaseline:{},chest:false,herbAt:0,rep:0,bounty:0,eliteKills:{},lootDry:0,hunts:[],trackedHunt:'supplies',position:{...SPAWN},combat:null,pending:null,lastSeen:now,visited:['inn'],log:[],gps:{distance:0,claimed:0},sound:false};
 if(cls==='knight'){const sh={uid:uid(),id:'shield',qty:1};s.inventory.push(sh);s.equipped.offhand=sh.uid;s.hp=stats(s).maxHp}return s;
}
export function itemInfo(i){
 if(!i)return null;const base=ITEMS[i.id];if(!base)return null;const affix=base.slot?AFFIXES[i.affix]:null,d={...base};
 for(const key of ['attack','armor','hp','maxMana','crit'])d[key]=(base[key]||0)+(affix?.[key]||0)+(key==='attack'&&base.type==='weapon'?(i.upgrade||0)*2:0);
 if(affix){d.name+=' · '+affix.name;d.desc+=' Bonus: '+affix.desc+'.';d.sell=(d.sell||0)+12;if(d.rarity==='common')d.rarity='uncommon';}return d;
}
export function stats(s){const c=CLASSES[s.classId];let attack=5+(s.level-1)*1.3,armor=c.armor+(s.level-1)*.5,maxHp=c.hp+(s.level-1)*10,maxMana=c.mana+(s.level-1)*5,crit=c.crit;for(const uid of Object.values(s.equipped||{})){const i=s.inventory.find(i=>i.uid===uid);if(!i)continue;const d=itemInfo(i);attack+=d.attack||0;armor+=d.armor||0;maxHp+=d.hp||0;maxMana+=d.maxMana||0;crit+=d.crit||0}return {attack:Math.round(attack),armor:Math.round(armor),maxHp,maxMana,crit:Math.min(.65,crit)};}
export function enemyInfo(c){const e=ENEMIES[c.id];return c.elite?{...e,name:ELITE_NAMES[c.id],level:e.level+3,hp:Math.round(e.hp*2.1),attack:Math.round(e.attack*1.35),armor:e.armor+3,xp:Math.round(e.xp*1.8),gold:Math.round(e.gold*1.8),elite:true}:e;}
export function eliteRequirement(s,id){const e=ENEMIES[id];if(!e)return 'Nieznany przeciwnik.';if(s.level<e.level+2)return 'Elita wymaga poziomu '+(e.level+2)+'.';if(s.quest<(e.boss?3:1))return e.boss?'Najpierw ukończ pierwszy rozdział.':'Najpierw ukończ zadanie Ślady na szlaku.';return null;}
export const xpNeed=level=>55+level*30;
export const count=(s,id)=>s.inventory.filter(i=>i.id===id).reduce((n,i)=>n+i.qty,0);
export function add(s,id,qty=1,details={}){if(!ITEMS[id]||!Number.isInteger(qty)||qty<1)return false;const d=ITEMS[id],stack=['material','consumable'].includes(d.type),existing=stack&&s.inventory.find(i=>i.id===id);if(!existing&&s.inventory.length+(stack?1:qty)>CAPACITY)return false;if(existing)existing.qty+=qty;else if(stack)s.inventory.push({uid:uid(),id,qty});else for(let k=0;k<qty;k++)s.inventory.push({uid:uid(),id,qty:1,upgrade:0,...(Object.hasOwn(AFFIXES,details.affix)?{affix:details.affix}:{})});return true;}
export function remove(s,id,qty){if(count(s,id)<qty)return false;for(const i of [...s.inventory]){if(i.id!==id)continue;const n=Math.min(qty,i.qty);i.qty-=n;qty-=n;if(!i.qty)s.inventory=s.inventory.filter(x=>x.uid!==i.uid);if(!qty)break}return true;}
export function gainXp(s,amount){s.xp+=amount;let levels=0;while(s.level<20&&s.xp>=xpNeed(s.level)){s.xp-=xpNeed(s.level);s.level++;s.skillPoints++;levels++}if(s.level===20)s.xp=0;if(levels){const a=stats(s);s.hp=a.maxHp;s.mana=a.maxMana}return levels;}
export function normalize(input,now=Date.now()){
 if(!input||input.version!==1||!Object.hasOwn(CLASSES,input.classId))return createHero('knight',now);
 const number=(v,min=0,max=1e9,fallback=0)=>Number.isFinite(Number(v))?clamp(Number(v),min,max):fallback;
 const record=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
 const counts=v=>Object.fromEntries(Object.keys(ENEMIES).map(k=>[k,Math.floor(number(record(v)[k]))]));
 const s={...createHero(input.classId,now),...structuredClone(input)},seen=new Set();
 s.name=typeof s.name==='string'?s.name.slice(0,18):'Wędrowiec';s.level=Math.floor(number(s.level,1,20,1));s.gold=Math.floor(number(s.gold));s.xp=s.level===20?0:Math.floor(number(s.xp,0,xpNeed(s.level)-1));s.skillPoints=Math.floor(number(s.skillPoints,0,19));
 s.inventory=(Array.isArray(s.inventory)?s.inventory:[]).filter(i=>i&&Object.hasOwn(ITEMS,i.id)&&typeof i.uid==='string'&&/^[a-zA-Z0-9-]{1,80}$/.test(i.uid)&&!seen.has(i.uid)&&seen.add(i.uid)&&Number.isInteger(i.qty)&&i.qty>0).slice(0,CAPACITY).map(i=>({uid:i.uid,id:i.id,qty:['material','consumable'].includes(ITEMS[i.id].type)?Math.min(i.qty,99999):1,upgrade:Math.floor(number(i.upgrade,0,3)),...(Object.hasOwn(AFFIXES,i.affix)&&ITEMS[i.id].slot?{affix:i.affix}:{})}));
 s.equipped=record(s.equipped);for(const [slot,u] of Object.entries(s.equipped)){const i=s.inventory.find(i=>i.uid===u),d=ITEMS[i?.id];if(!d||d.slot!==slot||(d.level||1)>s.level||d.classes&&!d.classes.includes(s.classId))delete s.equipped[slot]}
 s.skills=Object.fromEntries(CLASSES[s.classId].skills.map(([id])=>[id,Math.floor(number(record(s.skills)[id],0,3))]));s.kills=counts(s.kills);s.eliteKills=counts(s.eliteKills);s.lootDry=Math.floor(number(s.lootDry,0,3));s.hunts=Array.isArray(s.hunts)?s.hunts.filter(id=>HUNTS.some(h=>h.id===id)):[];s.trackedHunt=HUNTS.some(h=>h.id===s.trackedHunt)?s.trackedHunt:'supplies';s.questBaseline=counts(s.questBaseline);s.quest=Math.floor(number(s.quest,0,QUESTS.length));s.questClaimed=QUESTS.slice(0,s.quest).map(q=>q.id);
 s.visited=Array.isArray(s.visited)?s.visited.filter(v=>typeof v==='string').slice(0,12):[];s.log=Array.isArray(s.log)?s.log.filter(v=>typeof v==='string').slice(-20):[];s.rep=number(s.rep);s.bounty=Math.floor(number(s.bounty));s.chest=!!s.chest;s.herbAt=number(s.herbAt,0,now);s.sound=!!s.sound;
 s.gps={distance:number(record(s.gps).distance),claimed:Math.floor(number(record(s.gps).claimed))};s.position=safePosition({x:number(record(s.position).x,0,100,SPAWN.x),y:number(record(s.position).y,0,100,SPAWN.y)});
 if(s.combat){const c=record(s.combat),e=ENEMIES[c.id]&&enemyInfo(c);if(!e)s.combat=null;else s.combat={...c,hp:number(c.hp,1,e.hp,e.hp),elite:!!c.elite,exposed:!!c.exposed,ailment:['bleed','poison'].includes(c.ailment)?c.ailment:null,ailmentTurns:Math.floor(number(c.ailmentTurns,0,2)),turn:Math.floor(number(c.turn,1,1000,1)),intent:!!c.intent,dot:number(c.dot,0,1000),dotTurns:Math.floor(number(c.dotTurns,0,3)),hits:Math.floor(number(c.hits)),cooldowns:Object.fromEntries(CLASSES[s.classId].skills.map(([id])=>[id,number(record(c.cooldowns)[id],0,4)])),log:Array.isArray(c.log)?c.log.filter(v=>typeof v==='string').slice(-6):[]};}
 if(s.pending){const p=record(s.pending);if(!['victory','defeat'].includes(p.kind))s.pending=null;else{s.pending={...p,enemy:typeof p.enemy==='string'?p.enemy.slice(0,80):'Przeciwnik',gold:number(p.gold),xp:number(p.xp),levels:Math.floor(number(p.levels,0,19)),loot:(Array.isArray(p.loot)?p.loot:[]).filter(i=>i&&Object.hasOwn(ITEMS,i.id)&&Number.isInteger(i.qty)&&i.qty>0).slice(0,10).map(i=>({id:i.id,qty:Math.min(i.qty,99),...(Object.hasOwn(AFFIXES,i.affix)&&ITEMS[i.id].slot?{affix:i.affix}:{})}))};s.combat=null;}}
 s.hp=number(s.hp,0,stats(s).maxHp);s.mana=number(s.mana,0,stats(s).maxMana);s.lastSeen=number(s.lastSeen,0,now,now);s.hpRegenMs=number(s.hpRegenMs,0,14999);s.manaRegenMs=number(s.manaRegenMs,0,9999);applyOffline(s,now);return s;
}
export function applyOffline(s,now=Date.now()){const previous=Number(s.lastSeen)||now,elapsed=Math.max(0,Math.min(24*3600e3,now-previous));if(!s.combat&&!s.pending){const a=stats(s),hpTime=(s.hpRegenMs||0)+elapsed,manaTime=(s.manaRegenMs||0)+elapsed;s.hp=Math.min(a.maxHp,s.hp+Math.floor(hpTime/15000));s.mana=Math.min(a.maxMana,s.mana+Math.floor(manaTime/10000));s.hpRegenMs=s.hp>=a.maxHp?0:hpTime%15000;s.manaRegenMs=s.mana>=a.maxMana?0:manaTime%10000;}s.lastSeen=now;}
const blocked=s=>s.combat||s.pending;
export function equip(s,uid,slot=null){if(blocked(s))return 'Zakończ walkę i odbierz łupy.';const i=s.inventory.find(i=>i.uid===uid),d=ITEMS[i?.id];if(!d?.slot)return 'Tego przedmiotu nie można założyć.';if(slot&&slot!==d.slot)return 'Przeciągnij przedmiot do odpowiedniego pola.';if(d.classes&&!d.classes.includes(s.classId))return 'To wyposażenie innej klasy.';if((d.level||1)>s.level)return 'Za niski poziom bohatera.';s.equipped[d.slot]=i.uid;s.hp=Math.min(s.hp,stats(s).maxHp);s.mana=Math.min(s.mana,stats(s).maxMana);return null;}
export function buy(s,id,qty=1,shop='smith'){if(blocked(s))return 'Najpierw zakończ walkę.';const d=ITEMS[id];if(!d?.price||!Number.isInteger(qty)||qty<1||qty>99)return 'Nieprawidłowy zakup.';if(shop==='alchemist'&&d.type!=='consumable'||shop==='smith'&&!['weapon','armor','shield'].includes(d.type))return 'Ten sklep nie ma tego towaru.';if(d.classes&&!d.classes.includes(s.classId))return 'To przedmiot innej klasy.';if(s.gold<d.price*qty)return 'Brakuje złota.';if(!add(s,id,qty))return 'Plecak jest pełny.';s.gold-=d.price*qty;return null;}
export function sell(s,uid,qty=1){if(blocked(s))return 'Najpierw zakończ walkę.';const i=s.inventory.find(i=>i.uid===uid);if(!i||!Number.isInteger(qty)||qty<1||qty>i.qty)return 'Wybierz poprawną ilość.';if(Object.values(s.equipped).includes(uid))return 'Najpierw załóż inny przedmiot w tym miejscu.';s.gold+=(itemInfo(i).sell||0)*qty;i.qty-=qty;if(!i.qty)s.inventory=s.inventory.filter(x=>x.uid!==uid);return null;}
export function upgrade(s){if(blocked(s))return 'Najpierw zakończ walkę.';const i=s.inventory.find(i=>i.uid===s.equipped.weapon);if(!i)return 'Najpierw załóż broń.';if((i.upgrade||0)>=3)return 'Broń osiągnęła maksymalne ulepszenie +3.';const gold=25+25*(i.upgrade||0);if(s.gold<gold||count(s,'fang')<2)return 'Potrzebujesz 2 kłów i '+gold+' złota.';s.gold-=gold;remove(s,'fang',2);i.upgrade=(i.upgrade||0)+1;return null;}
export function brew(s){if(blocked(s))return 'Najpierw zakończ walkę.';if(count(s,'herb')<3||s.gold<6)return 'Potrzebujesz 3 ziół i 6 złota.';const copy=structuredClone(s);remove(copy,'herb',3);if(!add(copy,'potion'))return 'Plecak jest pełny.';s.inventory=copy.inventory;s.gold-=6;return null;}
export function rest(s){if(blocked(s))return 'Najpierw zakończ walkę i odbierz łupy.';const a=stats(s);if(s.hp===a.maxHp&&s.mana===a.maxMana)return 'Masz już pełne siły.';const cost=s.gold>=8?8:0;s.gold-=cost;s.hp=a.maxHp;s.mana=a.maxMana;return null;}
export function gather(s,now=Date.now()){if(blocked(s))return 'Najpierw zakończ walkę.';if(s.herbAt&&now-s.herbAt<60000)return 'Zioła odrosną za '+Math.ceil((60000-(now-s.herbAt))/1000)+' s.';if(!add(s,'herb',2))return 'Plecak jest pełny.';s.herbAt=now;return null;}
export function openChest(s){if(blocked(s))return 'Najpierw zakończ walkę.';if(s.chest)return 'Skrzynia jest już pusta.';const copy=structuredClone(s);if(!add(copy,'potion',2)||!add(copy,'fang',2))return 'Zwolnij dwa miejsca w plecaku.';s.inventory=copy.inventory;s.gold+=30;s.chest=true;return null;}
export function questProgress(s){const q=QUESTS[s.quest];return q?q.goals.map(([id,need,label])=>({id,need,label,value:id==='chest'?Number(s.chest):ITEMS[id]?.type==='material'?count(s,id):Math.max(0,(s.kills[id]||0)-(s.questBaseline[id]||0))})):[];}
export function questReady(s){const rows=questProgress(s);return !!rows.length&&rows.every(r=>r.value>=r.need);}
export function claimQuest(s){if(blocked(s))return {error:'Najpierw zakończ walkę.'};const q=QUESTS[s.quest];if(!q||s.questClaimed.includes(q.id)||!questReady(s))return {error:'Zadanie nie jest jeszcze ukończone.'};const copy=structuredClone(s);if(q.id==='q1')remove(copy,'pelt',2);if(q.id==='q3')remove(copy,'crystal',1);const reward=q.id==='q2'?CLASSES[s.classId].weapon+'1':q.id==='q3'?CLASSES[s.classId].weapon+'2':null;if(reward&&!add(copy,reward))return {error:'Zwolnij miejsce na broń w plecaku.'};s.inventory=copy.inventory;s.questClaimed.push(q.id);s.quest++;s.questBaseline={...s.kills};s.gold+=q.gold;s.rep+=15;const levels=gainXp(s,q.xp);return {reward,levels,gold:q.gold,xp:q.xp};}
export function claimBounty(s){if(blocked(s))return 'Najpierw zakończ walkę.';const total=Object.values(s.kills).reduce((a,b)=>a+b,0);if(total-s.bounty<5)return 'Pokonaj jeszcze '+(5-total+s.bounty)+' przeciwników.';s.bounty+=5;s.gold+=22;s.rep+=5;return null;}
export function learn(s,id){if(blocked(s))return 'Najpierw zakończ walkę.';const skill=CLASSES[s.classId].skills.find(x=>x[0]===id);if(!skill)return 'Nieznana umiejętność.';if(s.skillPoints<1)return 'Brakuje punktu umiejętności.';if((s.skills[id]||0)>=3)return 'Umiejętność ma już poziom 3.';s.skillPoints--;s.skills[id]=(s.skills[id]||0)+1;return null;}
export function usePotion(s,id){if(blocked(s))return 'Użyj mikstury z panelu walki.';return drink(s,id);}
function drink(s,id){const d=ITEMS[id],a=stats(s);if(!d||d.type!=='consumable'||!count(s,id))return 'Brakuje mikstury.';const key=d.heal?'hp':'mana',cap=d.heal?a.maxHp:a.maxMana;if(s[key]>=cap&&!(d.heal&&s.combat?.ailment))return 'Ten zasób jest już pełny.';remove(s,id,1);s[key]=Math.min(cap,s[key]+(d.heal||d.mana));return null;}
export function startFight(s,id,elite=false){
 if(blocked(s))return 'Dokończ obecne spotkanie.';if(!Object.hasOwn(ENEMIES,id))return 'Nieznany przeciwnik.';
 if(s.hp<=0)return 'Odpocznij w karczmie.';if(elite){const error=eliteRequirement(s,id);if(error)return error;}
 const e=enemyInfo({id,elite});s.combat={id,elite:!!elite,uid:uid(),hp:e.hp,turn:1,intent:false,dot:0,dotTurns:0,guard:false,retaliation:false,exposed:false,ailment:null,ailmentTurns:0,cooldowns:{},log:[e.name+' staje na Twojej drodze.'],hits:0};return null;
}
export function performAction(s,action,rng=Math.random){
 const c=s.combat;if(!c||s.pending)return {error:'Nie trwa żadna walka.'};
 const e=enemyInfo(c),tactic=TACTICS[c.id],a=stats(s),cls=CLASSES[s.classId],frames=[];
 let skill=null,damage=0,heal=0,crit=false,stun=false,note='',guard=false,guardScale=.30,newAilment=false;
 const frame=(phase,label,amount=0)=>frames.push({phase,label,amount,playerHp:s.hp,playerMana:s.mana,enemyHp:Math.max(0,c.hp),maxHp:a.maxHp,maxMana:a.maxMana,enemyMax:e.hp});
 if(action==='flee'){s.combat=null;s.position={...GATE};return {fled:true,note:'Wycofujesz się do bramy.'}}
 if(action.startsWith('potion:')){
  const id=action.split(':')[1],before=s.hp+s.mana,error=drink(s,id);if(error)return {error};heal=s.hp+s.mana-before;
  if(ITEMS[id].heal){c.ailment=null;c.ailmentTurns=0;}note=ITEMS[id].name+': +'+heal;
 }else if(action==='guard'){guard=true;note='Osłaniasz się przed kolejnym ciosem.';}
 else{
  if(action!=='attack'){
   skill=cls.skills.find(x=>x[0]===action);if(!skill||!s.skills[action])return {error:'Nie znasz tej umiejętności.'};
   if(c.cooldowns[action]>0)return {error:'Umiejętność jeszcze się odnawia.'};if(s.mana<skill[2])return {error:'Za mało many.'};
   if(skill[4]==='heal'&&s.hp>=a.maxHp)return {error:'Masz pełne życie.'};s.mana-=skill[2];c.cooldowns[action]=skill[4]==='stun'?3:skill[4]==='heal'?4:2;
  }
  const effect=skill?.[4],rank=s.skills[action]||1;
  if(effect==='heal'){heal=Math.min(a.maxHp-s.hp,Math.round(a.maxHp*(.26+.05*(rank-1))));s.hp+=heal;note='Uzdrowienie: +'+heal+' życia.';}
  else if(effect==='guard'){guard=true;guardScale=.22-.04*(rank-1);note=skill[1]+': mocniejsza osłona.';}
  else{
   const opening=c.exposed,mult=(skill?skill[3]*(1+.12*(rank-1)):1)*(s.classId==='berserker'?1+(1-s.hp/a.maxHp)*.5:1)*(c.retaliation?1.5:1)*(opening?1.35:1);c.retaliation=false;c.exposed=false;
   crit=rng()<a.crit+(effect==='crit'?.25:0);damage=Math.max(1,Math.round((a.attack*mult*(.92+rng()*.16)-e.armor)*(crit?1.65:1)));c.hp-=damage;c.hits++;
   note=(skill?.[1]||'Atak')+': '+damage+' obrażeń'+(crit?' — KRYTYK!':'.')+(opening?' Wykorzystujesz odsłonięcie!':'');
   if(['poison','burn','bleed'].includes(effect)){c.dot=Math.max(3,Math.round(a.attack*.25));c.dotTurns=3;}
   if(effect==='stun'){stun=true;if(c.intent){c.intent=false;c.exposed=true;note+=' Przerwanie! Następny atak +35%.';}}
   const weapon=s.inventory.find(i=>i.uid===s.equipped.weapon);if(ITEMS[weapon?.id]?.relic&&c.hits%3===0){heal=Math.min(7,a.maxHp-s.hp);s.hp+=heal;note+=' Relikt odnawia '+heal+' życia.';}
  }
 }
 c.log.push(note);frame('player',note,damage);
 if(c.hp<=0)return victory(s,rng,{damage,crit,heal,note,frames});
 if(c.dotTurns>0){c.hp-=c.dot;c.dotTurns--;const text='Efekt zadaje '+c.dot+' obrażeń.';c.log.push(text);frame('dot',text,c.dot);if(c.hp<=0)return victory(s,rng,{damage,crit,heal,note,frames});}
 let taken=0,enemyNote='';
 if(stun)enemyNote='Przeciwnik traci akcję.';
 else if(!c.intent&&c.turn%3===0){c.intent=true;enemyNote=e.intent+'. Przygotuj obronę!';}
 else{
  const heavy=c.intent;c.intent=false;const phase=e.boss&&c.hp<e.hp*.35?1.2:1;
  taken=Math.max(1,Math.round((e.attack*phase*(heavy?tactic.heavy:1)*(rng()*.16+.92)-a.armor)*(guard?guardScale:1)));
  if(s.classId==='ranger'&&rng()<.14)taken=0;s.hp=Math.max(0,s.hp-taken);enemyNote=taken?(heavy?'Mocny cios':'Cios przeciwnika')+': '+taken+' obrażeń.':'Unikasz ciosu.';
  if(guard&&heavy){c.exposed=true;enemyNote+=' Odsłonięcie: następny atak +35%!';}
  if(guard&&taken&&s.classId==='knight'&&s.equipped.offhand){c.retaliation=true;enemyNote+=' Odwet gotowy: +50% następnego ataku.';}
  if(heavy&&!guard&&taken){
   if(tactic.effect==='drain'){const drain=Math.min(10,s.mana);s.mana-=drain;enemyNote+=' Tracisz '+drain+' many.';}
   else if(tactic.effect){c.ailment=tactic.effect;c.ailmentTurns=2;newAilment=true;enemyNote+=' '+tactic.effectName+' przez 2 tury.';}
  }
 }
 c.log.push(enemyNote);frame('enemy',enemyNote,taken);
 if(c.ailmentTurns>0&&!newAilment){const amount=c.ailment==='poison'?4:3;s.hp=Math.max(0,s.hp-amount);c.ailmentTurns--;const text=(c.ailment==='poison'?'Trucizna':'Krwawienie')+': '+amount+' obrażeń.';c.log.push(text);frame('ailment',text,amount);if(!c.ailmentTurns)c.ailment=null;}
 c.log=c.log.slice(-8);c.turn++;for(const id of Object.keys(c.cooldowns))c.cooldowns[id]=Math.max(0,c.cooldowns[id]-1);
 if(!s.hp){s.combat=null;s.pending={kind:'defeat',enemy:e.name};return {lost:true,damage,taken,crit,note:enemyNote,frames};}
 return {damage,taken,crit,heal,note,enemyNote,frames};
}
function victory(s,rng,fx){
 const c=s.combat,e=enemyInfo(c),loot=e.loot.filter(([,chance])=>rng()<chance).map(([id])=>({id,qty:1}));
 const total=Object.values(s.kills).reduce((a,b)=>a+b,0);let discovery='';
 const chooseAffix=()=>Object.keys(AFFIXES)[Math.min(4,Math.floor(rng()*5))];
 if(!total){loot.push({id:CLASSES[s.classId].weapon+'0',qty:1,affix:'power'});discovery='Pierwsze trofeum: broń Mocy. Załóż ją, aby zyskać +3 ataku.';}
 if(c.elite){
  s.eliteKills[c.id]=(s.eliteKills[c.id]||0)+1;const guaranteed=s.lootDry>=3;
  if(guaranteed||rng()<.35){const tier=e.level>=7?2:1,id=rng()<.5?CLASSES[s.classId].weapon+tier:tier===2?'oathArmor':'scoutArmor';loot.push({id,qty:1,affix:chooseAffix()});s.lootDry=0;if(guaranteed)discovery='Wytrwałe polowanie: gwarantowane wyposażenie z bonusem!';}
  else s.lootDry++;
 }else if(total&&rng()<.12){const tier=e.level>=3?1:0;loot.push({id:rng()<.5?CLASSES[s.classId].weapon+tier:tier?'scoutArmor':'leather',qty:1,affix:chooseAffix()});}
 if(e.boss&&!s.kills.guardian)loot.push({id:CLASSES[s.classId].weapon+'1',qty:1});
 s.kills[c.id]=(s.kills[c.id]||0)+1;s.gold+=e.gold;const levels=gainXp(s,e.xp);
 s.pending={kind:'victory',uid:c.uid,enemyId:c.id,elite:!!c.elite,enemy:e.name,sprite:e.sprite,gold:e.gold,xp:e.xp,levels,loot,discovery,turns:c.turn};s.combat=null;return {...fx,won:true,levels};
}
export function claimLoot(s,discard=false,equipIndex=null){
 if(!s.pending)return 'Nie ma nagrody do odebrania.';
 if(s.pending.kind==='defeat'){s.hp=Math.max(1,Math.round(stats(s).maxHp*.4));s.mana=Math.max(s.mana,Math.round(stats(s).maxMana*.3));s.position={...SPAWN};s.pending=null;return null;}
 if(!discard){
  const copy=structuredClone(s);let equipUid=null;
  for(const [index,drop] of s.pending.loot.entries()){if(!add(copy,drop.id,drop.qty,drop))return 'Plecak jest pełny. Możesz zostawić łup; złoto i doświadczenie już otrzymano.';if(index===equipIndex&&ITEMS[drop.id].slot)equipUid=copy.inventory.at(-1).uid;}
  copy.pending=null;if(equipIndex!==null){if(!equipUid)return 'Wybierz wyposażenie z łupów.';const error=equip(copy,equipUid);if(error)return error;}
  s.inventory=copy.inventory;s.equipped=copy.equipped;s.hp=copy.hp;s.mana=copy.mana;
 }
 s.pending=null;return null;
}
export function recordGps(s,meters){if(!Number.isFinite(meters)||meters<=0||meters>300)return false;s.gps.distance+=meters;const parcels=Math.floor(s.gps.distance/250)-s.gps.claimed;if(parcels<=0)return false;const copy=structuredClone(s);if(!add(copy,'herb',parcels*3))return false;s.inventory=copy.inventory;s.gps.claimed+=parcels;s.gold+=parcels*12;return true;}

export function huntProgress(s,id){const h=HUNTS.find(h=>h.id===id);return h?h.goals.map(([key,need,label])=>({key,need,label,value:key.startsWith('elite:')?(s.eliteKills[key.split(':')[1]]||0):count(s,key)})):[];}
export function huntReady(s,id){const h=HUNTS.find(h=>h.id===id);return !!h&&s.level>=h.level&&!s.hunts.includes(id)&&huntProgress(s,id).every(g=>g.value>=g.need);}
export function huntReward(s,h){return {id:h.reward==='class1'?CLASSES[s.classId].weapon+'1':h.reward,qty:1,affix:h.affix};}
export function claimHunt(s,id){
 if(blocked(s))return {error:'Najpierw zakończ walkę.'};if(!huntReady(s,id))return {error:'Warunki zlecenia nie są jeszcze spełnione.'};
 const h=HUNTS.find(h=>h.id===id),copy=structuredClone(s),reward=huntReward(s,h);
 for(const [key,need] of h.goals)if(!key.startsWith('elite:'))remove(copy,key,need);
 if(!add(copy,reward.id,1,reward))return {error:'Zwolnij miejsce na nagrodę w plecaku.'};
 s.inventory=copy.inventory;s.hunts.push(id);s.gold+=h.gold;s.rep+=20;const levels=gainXp(s,h.xp);
 if(s.trackedHunt===id)s.trackedHunt=HUNTS.find(h=>!s.hunts.includes(h.id))?.id||null;
 return {reward,levels,gold:h.gold,xp:h.xp};
}
export function enchant(s,affix){
 if(blocked(s))return 'Najpierw zakończ walkę.';if(!Object.hasOwn(AFFIXES,affix))return 'Wybierz właściwy bonus.';
 if(s.quest<3||s.level<5)return 'Nasycanie odblokujesz po ukończeniu rozdziału i osiągnięciu poziomu 5.';
 const weapon=s.inventory.find(i=>i.uid===s.equipped.weapon);if(!weapon)return 'Najpierw załóż broń.';if(weapon.affix===affix)return 'Broń ma już ten bonus.';
 if(count(s,'crystal')<3||count(s,'fang')<4||s.gold<60)return 'Potrzebujesz 3 odłamków, 4 kłów i 60 złota.';
 remove(s,'crystal',3);remove(s,'fang',4);s.gold-=60;weapon.affix=affix;s.hp=Math.min(s.hp,stats(s).maxHp);s.mana=Math.min(s.mana,stats(s).maxMana);return null;
}
