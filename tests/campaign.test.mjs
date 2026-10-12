import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
import {CLASSES,ITEMS} from '../dist/data.js';

function random(seed){return ()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296}}
function prepare(s){
 for(const skill of CLASSES[s.classId].skills){if(s.skillPoints&&!s.skills[skill[0]])E.learn(s,skill[0]);}
 while(s.skillPoints&&(s.skills[CLASSES[s.classId].skills[0][0]]||0)<3)E.learn(s,CLASSES[s.classId].skills[0][0]);
 for(const slot of ['weapon','armor']){
  const options=s.inventory.filter(i=>ITEMS[i.id].slot===slot&&(ITEMS[i.id].level||1)<=s.level);
  options.sort((a,b)=>(ITEMS[b.id].attack||ITEMS[b.id].armor||0)-(ITEMS[a.id].attack||ITEMS[a.id].armor||0));
  if(options[0])E.equip(s,options[0].uid);
 }
 if(!s.equipped.armor&&s.gold>=42){E.buy(s,'leather',1,'smith');E.equip(s,s.inventory.find(i=>i.id==='leather').uid);}
 while(E.count(s,'fang')>=2&&s.gold>=60&&!E.upgrade(s)){}
 while(!E.claimBounty(s)){}
 E.rest(s);
}
function action(s){
 const c=s.combat,a=E.stats(s),ready=CLASSES[s.classId].skills.filter(k=>s.skills[k[0]]&&!c.cooldowns[k[0]]&&s.mana>=k[2]);
 const stop=ready.find(k=>k[4]==='stun');
 if(c.intent)return stop?stop[0]:'guard';
 if(s.hp<a.maxHp*.40&&E.count(s,'potion'))return 'potion:potion';
 const heal=ready.find(k=>k[4]==='heal');if(s.hp<a.maxHp*.45&&heal)return heal[0];
 const hits=ready.filter(k=>!['guard','heal'].includes(k[4])).sort((a,b)=>b[3]-a[3]);
 if(hits[0])return hits[0][0];
 if(s.mana<8&&E.count(s,'mana')&&c.hp>35)return 'potion:mana';
 return 'attack';
}
function encounter(s,id,rng){
 assert.equal(E.startFight(s,id),null);let turns=0;
 while(s.combat){const r=E.performAction(s,action(s),rng);assert.ok(!r.error,r.error);assert.ok(++turns<100,'Fight must resolve');}
 const won=s.pending.kind==='victory';assert.equal(E.claimLoot(s),null);return {won,turns};
}
for(const cls of Object.keys(CLASSES))test('first chapter is completable with '+cls+' using earned resources',()=>{
 for(let seed=1;seed<=10;seed++){
  let s=E.createHero(cls),battles=0,losses=0,turns=0;const rng=random(seed);
  while(s.quest<3&&battles<50){
   prepare(s);
   if(s.quest===1&&!s.chest)assert.equal(E.openChest(s),null);
   if(E.questReady(s)){assert.ok(!E.claimQuest(s).error);continue;}
   const enemy=s.quest===0?'wolf':s.quest===1?'goblin':s.level<5?'wisp':'guardian';
   const r=encounter(s,enemy,rng);battles++;turns+=r.turns;if(!r.won)losses++;
   s=E.normalize(JSON.parse(JSON.stringify(s)));
  }
  assert.equal(s.quest,3,`seed ${seed}, lvl ${s.level}, losses ${losses}`);
  assert.ok(s.inventory.some(i=>ITEMS[i.id].relic));assert.ok(s.level>=5);
  assert.ok(losses<8,`Too many failed fights: ${losses}`);
  assert.ok(turns<350,`Too many turns: ${turns}`);
 }
});
test('partial or malformed saves are repaired without breaking stat and quest screens',()=>{
 const s=E.normalize({version:1,classId:'mage',level:Infinity,gold:-50,inventory:[null,{id:'potion',uid:'<img>',qty:1}],skills:[],kills:[],quest:'bad',position:null,gps:[],combat:{id:'unknown'}});
 assert.equal(s.level,1);assert.equal(s.gold,0);assert.deepEqual(s.inventory,[]);assert.equal(s.combat,null);
 assert.ok(Number.isFinite(E.stats(s).maxHp));assert.equal(E.questProgress(s).length,2);
});
test('the final story reward consumes its crystal and cannot repeat',()=>{
 const s=E.createHero();s.quest=2;s.kills.guardian=1;assert.equal(E.questReady(s),false);
 E.add(s,'crystal');assert.equal(E.questReady(s),true);assert.ok(!E.claimQuest(s).error);assert.equal(E.count(s,'crystal'),0);assert.ok(E.claimQuest(s).error);
});
