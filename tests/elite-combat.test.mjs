import test from 'node:test';
import assert from 'node:assert/strict';
import {CLASSES} from '../dist/data.js';
import * as E from '../dist/engine.js';
function rng(seed){return ()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296}}
function choose(s){
 const c=s.combat,a=E.stats(s),skills=CLASSES[s.classId].skills.filter(k=>s.skills[k[0]]&&!c.cooldowns[k[0]]&&s.mana>=k[2]);
 if(c.intent)return skills.find(k=>k[4]==='stun')?.[0]||'guard';
 if(s.hp<a.maxHp*.45&&E.count(s,'strongPotion'))return 'potion:strongPotion';
 const heal=skills.find(k=>k[4]==='heal');if(s.hp<a.maxHp*.55&&heal)return heal[0];
 if(s.mana<12&&E.count(s,'mana')&&c.hp>60)return 'potion:mana';
 return skills.filter(k=>!['heal','guard'].includes(k[4])).sort((a,b)=>b[3]-a[3])[0]?.[0]||'attack';
}
for(const cls of Object.keys(CLASSES))test('a prepared level-7 '+cls+' can defeat the awakened guardian',()=>{
 let wins=0,totalTurns=0;
 for(let seed=1;seed<=20;seed++){
  const s=E.createHero(cls);s.level=7;s.quest=3;s.skillPoints=6;
  for(const [id] of CLASSES[cls].skills)if(!s.skills[id])E.learn(s,id);
  while(s.skillPoints)E.learn(s,CLASSES[cls].skills[s.skillPoints===1?1:0][0]);
  E.add(s,CLASSES[cls].weapon+'2');E.equip(s,s.inventory.at(-1).uid);s.inventory.at(-1).upgrade=2;
  E.add(s,'oathArmor');E.equip(s,s.inventory.at(-1).uid);E.add(s,'strongPotion',3);E.add(s,'mana',3);E.rest(s);
  assert.equal(E.startFight(s,'guardian',true),null);let turns=0;const random=rng(seed);
  while(s.combat&&turns++<60){const result=E.performAction(s,choose(s),random);assert.ok(!result.error,result.error)}
  assert.ok(s.pending,'Fight must resolve');if(s.pending.kind==='victory')wins++;totalTurns+=turns;
 }
 assert.ok(wins>=16,cls+': '+wins+'/20 wins; mean '+(totalTurns/20).toFixed(1)+' turns');
});
