import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
import {CLASSES,ITEMS,HUNTS,AFFIXES} from '../dist/data.js';
const fixed=()=>.8;
function win(s,id='wolf',elite=false,rng=fixed){assert.equal(E.startFight(s,id,elite),null);s.combat.hp=1;E.performAction(s,'attack',rng);assert.equal(s.pending.kind,'victory');}
test('first victory guarantees a class weapon with a real +3 attack bonus',()=>{
 for(const cls of Object.keys(CLASSES)){const s=E.createHero(cls),before=E.stats(s).attack;win(s);const index=s.pending.loot.findIndex(i=>i.affix==='power');assert.ok(index>=0);assert.equal(s.pending.loot[index].id,CLASSES[cls].weapon+'0');assert.equal(E.claimLoot(s,false,index),null);assert.equal(E.stats(s).attack,before+3);assert.ok(E.claimLoot(s));}
});
test('instance bonuses remain separate through save, equip, comparison data and sale',()=>{
 let s=E.createHero();E.add(s,'leather',1,{affix:'ward'});E.add(s,'leather',1,{affix:'vitality'});s=E.normalize(JSON.parse(JSON.stringify(s)));
 const [ward,vit]=s.inventory.filter(i=>i.id==='leather');assert.equal(E.itemInfo(ward).armor,5);assert.equal(E.itemInfo(vit).hp,24);assert.equal(E.itemInfo(ward).hp,8);
 const armor=E.stats(s).armor;E.equip(s,ward.uid);assert.equal(E.stats(s).armor,armor+5);const gold=s.gold;E.sell(s,vit.uid);assert.equal(s.gold,gold+24);
});
test('crit and mana bonuses affect actual character stats without double applying upgrades',()=>{
 const s=E.createHero('mage'),base=E.stats(s);E.add(s,'staff0',1,{affix:'focus'});const weapon=s.inventory.at(-1);weapon.upgrade=2;E.equip(s,weapon.uid);assert.equal(E.stats(s).maxMana,base.maxMana+12);assert.equal(E.stats(s).attack,base.attack+4);
 E.add(s,'leather',1,{affix:'precision'});E.equip(s,s.inventory.at(-1).uid);assert.equal(Math.round(E.stats(s).crit*100),14);
});
test('elite access checks story and level without starting an invalid fight',()=>{
 const s=E.createHero();assert.ok(E.startFight(s,'wolf',true));assert.equal(s.combat,null);s.level=3;assert.ok(E.startFight(s,'wolf',true));s.quest=1;assert.equal(E.startFight(s,'wolf',true),null);assert.equal(E.enemyInfo(s.combat).level,4);assert.ok(s.combat.hp>39);
});
test('every fourth dry elite kill gives bonus gear, persists and resets the guarantee',()=>{
 let s=E.createHero();s.level=7;s.quest=3;s.kills.wolf=1;
 for(let k=1;k<=4;k++){win(s,'wolf',true,()=>.99);const drops=s.pending.loot.filter(i=>i.affix);assert.equal(drops.length,k===4?1:0);assert.equal(s.lootDry,k===4?0:k);E.claimLoot(s);s=E.normalize(JSON.parse(JSON.stringify(s)));}
 assert.equal(s.eliteKills.wolf,4);assert.equal(s.kills.wolf,5);
});
test('escape and defeat cannot advance elite guarantees or grant hunt credit',()=>{
 const s=E.createHero();s.level=3;s.quest=1;E.startFight(s,'wolf',true);E.performAction(s,'flee');assert.equal(s.lootDry,0);assert.equal(s.eliteKills.wolf,undefined);
 E.startFight(s,'wolf',true);s.hp=1;E.performAction(s,'attack',fixed);assert.equal(s.pending.kind,'defeat');assert.equal(s.lootDry,0);assert.equal(s.eliteKills.wolf,undefined);
});
test('pending affixed loot survives reload and fails atomically when the bag is full',()=>{
 let s=E.createHero();win(s);s=E.normalize(JSON.parse(JSON.stringify(s)));const loot=s.pending.loot.find(i=>i.affix);assert.equal(loot.affix,'power');while(s.inventory.length<36)E.add(s,'leather');const before=JSON.stringify(s);assert.ok(E.claimLoot(s));assert.equal(JSON.stringify(s),before);
});
test('auto-equip rejects level-locked loot without claiming or discarding it',()=>{
 const s=E.createHero();s.pending={kind:'victory',loot:[{id:'sword2',qty:1,affix:'precision'}]};const before=JSON.stringify(s);assert.ok(E.claimLoot(s,false,0));assert.equal(JSON.stringify(s),before);assert.equal(E.claimLoot(s),null);assert.equal(s.inventory.at(-1).affix,'precision');
});
test('blocking a warned charge exposes the enemy for exactly one attack',()=>{
 const a=E.createHero('hunter'),b=E.createHero('hunter');E.startFight(a,'boar');E.startFight(b,'boar');a.combat.intent=true;E.performAction(a,'guard',fixed);assert.equal(a.combat.exposed,true);
 const boosted=E.performAction(a,'attack',fixed),normal=E.performAction(b,'attack',fixed);assert.ok(boosted.damage>normal.damage);assert.equal(a.combat.exposed,false);
});
test('a prepared interruption grants an opening and no enemy damage',()=>{
 const s=E.createHero();E.startFight(s,'guardian');s.combat.intent=true;const hp=s.hp;const r=E.performAction(s,'shield',fixed);assert.equal(s.hp,hp);assert.equal(s.combat.exposed,true);assert.equal(r.frames.at(-1).amount,0);
});
test('unguarded poison persists for two turns, guarding prevents it, potion cleanses it',()=>{
 const s=E.createHero();E.startFight(s,'goblin');s.combat.intent=true;E.performAction(s,'attack',fixed);assert.equal(s.combat.ailment,'poison');assert.equal(s.combat.ailmentTurns,2);
 E.performAction(s,'potion:potion',fixed);assert.equal(s.combat.ailment,null);assert.equal(s.combat.ailmentTurns,0);
 s.combat.intent=true;E.performAction(s,'guard',fixed);assert.equal(s.combat.ailment,null);
});
test('wisp drains mana only after an unguarded heavy attack',()=>{
 const a=E.createHero(),b=E.createHero();E.startFight(a,'wisp');E.startFight(b,'wisp');a.combat.intent=b.combat.intent=true;E.performAction(a,'attack',fixed);E.performAction(b,'guard',fixed);assert.equal(a.mana,22);assert.equal(b.mana,32);
});
test('rank upgrades improve healing and defensive abilities',()=>{
 const a=E.createHero('mage'),b=E.createHero('mage');a.hp=b.hp=10;a.skills.heal=1;b.skills.heal=3;E.startFight(a,'wolf');E.startFight(b,'wolf');assert.ok(E.performAction(b,'heal',fixed).heal>E.performAction(a,'heal',fixed).heal);
 const c=E.createHero('hunter'),d=E.createHero('hunter');c.skills.camouflage=1;d.skills.camouflage=3;E.startFight(c,'guardian');E.startFight(d,'guardian');assert.ok(E.performAction(d,'camouflage',fixed).taken<E.performAction(c,'camouflage',fixed).taken);
});
test('combat frames put player damage before retaliation and reflect actual health',()=>{
 const s=E.createHero();E.startFight(s,'guardian');const hp=s.hp;const r=E.performAction(s,'attack',fixed);assert.deepEqual(r.frames.map(f=>f.phase),['player','enemy']);assert.equal(r.frames[0].playerHp,hp);assert.equal(r.frames[1].playerHp,s.hp);assert.ok(r.frames[1].playerHp<r.frames[0].playerHp);
});
test('delivery contracts remove materials once and grant the named affixed reward',()=>{
 const s=E.createHero();s.level=2;E.add(s,'pelt',6);E.add(s,'herb',4);assert.equal(E.huntReady(s,'supplies'),true);const r=E.claimHunt(s,'supplies');assert.ok(!r.error);assert.equal(E.count(s,'pelt'),0);assert.equal(E.count(s,'herb'),0);assert.equal(s.inventory.at(-1).affix,'vitality');assert.ok(E.claimHunt(s,'supplies').error);
});
test('hunting credit uses elite victories and full-bag claims preserve progress',()=>{
 const s=E.createHero();s.level=3;s.kills.wolf=50;assert.equal(E.huntReady(s,'alphas'),false);s.eliteKills.wolf=2;assert.equal(E.huntReady(s,'alphas'),true);while(s.inventory.length<36)E.add(s,'leather');const before=JSON.stringify(s);assert.ok(E.claimHunt(s,'alphas').error);assert.equal(JSON.stringify(s),before);
});
test('chosen enchantment replaces the old bonus and retains upgrade rank',()=>{
 const s=E.createHero();s.level=5;s.quest=3;s.gold=100;E.add(s,'crystal',3);E.add(s,'fang',4);const weapon=s.inventory.find(i=>i.uid===s.equipped.weapon);weapon.affix='power';weapon.upgrade=2;const attack=E.stats(s).attack;
 assert.equal(E.enchant(s,'precision'),null);assert.equal(E.stats(s).attack,attack-3);assert.equal(weapon.upgrade,2);assert.equal(Math.round(E.stats(s).crit*100),12);assert.equal(s.gold,40);assert.equal(E.count(s,'crystal'),0);assert.equal(E.count(s,'fang'),0);assert.ok(E.enchant(s,'precision'));
});
test('enchantment shortages and locked progress never consume materials',()=>{
 const s=E.createHero();s.gold=100;E.add(s,'crystal',3);E.add(s,'fang',4);const before=JSON.stringify(s);assert.ok(E.enchant(s,'power'));assert.equal(JSON.stringify(s),before);s.level=5;s.quest=3;E.remove(s,'fang',1);const after=JSON.stringify(s);assert.ok(E.enchant(s,'power'));assert.equal(JSON.stringify(s),after);
});
test('4.0 saves keep equipment and progress while new progression gets safe defaults',()=>{
 for(const cls of Object.keys(CLASSES)){const old=E.createHero(cls);delete old.eliteKills;delete old.hunts;delete old.lootDry;delete old.trackedHunt;old.level=4;old.xp=20;old.quest=2;old.gold=250;const weapon=old.equipped.weapon;const loaded=E.normalize(JSON.parse(JSON.stringify(old)));assert.equal(loaded.equipped.weapon,weapon);assert.equal(loaded.gold,250);assert.equal(loaded.xp,20);assert.equal(loaded.quest,2);assert.equal(loaded.eliteKills.wolf,0);assert.deepEqual(loaded.hunts,[]);}
});
