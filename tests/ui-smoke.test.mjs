// Controller tests with a minimal DOM double. These do not render a browser.
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import * as data from '../dist/data.js';
import * as E from '../dist/engine.js';
import {ATLAS} from '../dist/atlas.js';
const source=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8').replace(/^import .*;$/gm,'');
function boot(initial){
 const nodes=new Map(),events={},storage=new Map(),timers=new Map();let timer=0;
 if(initial){storage.set('time4heroes.pixel.active',initial.classId);storage.set('time4heroes.pixel.v1.'+initial.classId,JSON.stringify(initial));}
 const element=selector=>{
  if(nodes.has(selector))return nodes.get(selector);
  let html='';const e={style:{},dataset:{},hidden:selector==='#overlay',scrollTop:0,clientWidth:820,value:'1',classList:{add(){},remove(){},toggle(){}},addEventListener(){},focus(){},insertAdjacentHTML(_where,value){html+=value;},click(){}};
  Object.defineProperty(e,'innerHTML',{get:()=>html,set:v=>{html=v;if(selector==='#overlay')nodes.delete('.modal')}});
  nodes.set(selector,e);return e;
 };
 const document={querySelector:element,querySelectorAll:()=>[],body:element('body'),addEventListener:(type,fn)=>events[type]=fn,hidden:false};
 const context=vm.createContext({...data,E,ATLAS,document,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},navigator:{},window:{addEventListener(){}},matchMedia:()=>({matches:false}),structuredClone,URL,Blob,console,setTimeout:(fn)=>{timers.set(++timer,fn);return timer},clearTimeout:id=>timers.delete(id),setInterval(){},confirm:()=>true});
 vm.runInContext(source,context);
 return {element,storage,click:action=>events.click({target:{closest:()=>({dataset:{action},disabled:false})}}),read:()=>JSON.parse(storage.get('time4heroes.pixel.v1.'+storage.get('time4heroes.pixel.active'))),flush(){for(const [id,fn] of [...timers]){timers.delete(id);fn();}}};
}
test('initial page and all primary screens render through the controller',()=>{
 const app=boot();assert.match(app.element('#app').innerHTML,/Zielone Pogranicze/);
 for(const [view,title] of [['hero','Bohater i wyposażenie'],['quest','Zaginiony patrol'],['town','Osada Zielonej Straży'],['world','Zielone Pogranicze']]){app.click('nav:'+view);assert.ok(app.element('#app').innerHTML.includes(title));}
 for(const service of ['inn','smith','alchemist','guild']){app.click('service:'+service);assert.equal(app.element('#overlay').hidden,false);assert.match(app.element('#overlay').innerHTML,/role="dialog"/);app.click('close');}
 app.click('settings');assert.match(app.element('#overlay').innerHTML,/Pobierz ZIP/);
 app.click('close');app.click('classes');assert.match(app.element('#overlay').innerHTML,/Tropiciel/);
});
test('shop controller keeps modal scroll through quantity purchase and sale',()=>{
 const app=boot();app.click('service:alchemist');app.click('shopSelect:potion');app.element('.modal').scrollTop=310;app.element('#shopQty').value='2';
 app.click('buySelected');assert.equal(E.count(app.read(),'potion'),5);assert.equal(app.read().gold,24);assert.equal(app.element('.modal').scrollTop,310);
 app.click('shopTab:sell');const potion=app.read().inventory.find(i=>i.id==='potion');app.click('shopSelect:'+potion.uid);app.element('.modal').scrollTop=250;app.element('#shopQty').value='2';app.click('sellSelected');
 assert.equal(E.count(app.read(),'potion'),3);assert.equal(app.read().gold,34);assert.equal(app.element('.modal').scrollTop,250);
});
test('switching class cancels movement and retains separate inventories',()=>{
 const app=boot();const knight=app.read();app.click('location:guardian');app.click('classes');app.click('class:mage');app.flush();
 assert.equal(app.read().classId,'mage');assert.deepEqual(app.read().position,{x:31,y:58});assert.equal(E.count(app.read(),'staff0'),1);
 app.click('class:knight');assert.equal(app.read().equipped.weapon,knight.equipped.weapon);assert.equal(E.count(app.read(),'sword0'),1);
});
test('combat buttons cannot execute a second action during its animation',()=>{
 const app=boot();app.click('interact:guardian');assert.match(app.element('#overlay').innerHTML,/POZ. 5/);app.click('fight:attack');const state=app.read();app.click('fight:attack');assert.deepEqual(app.read(),state);
 app.flush();app.click('fight:flee');assert.equal(app.read().combat,null);assert.equal(app.element('#overlay').hidden,true);
});
test('hunting journal, bestiary and map targeting render their actual progression',()=>{
 const app=boot();app.click('journal:hunts');assert.match(app.element('#app').innerHTML,/Płaszcze na zimny szlak/);assert.match(app.element('#app').innerHTML,/Witalności/);
 app.click('huntTrack:alphas');assert.equal(app.read().trackedHunt,'alphas');
 app.click('journal:bestiary');assert.match(app.element('#app').innerHTML,/Przebudzony Strażnik/);assert.match(app.element('#app').innerHTML,/12%/);
 app.click('enemyGo:wolf');app.flush();assert.match(app.element('#location-card').innerHTML,/Elita · poz. 4/);
});
test('loot comparison renders the bonus and auto-equip uses it',()=>{
 const s=E.createHero();s.pending={kind:'victory',enemy:'Wilk',gold:8,xp:25,loot:[{id:'sword0',qty:1,affix:'power'}]};
 const app=boot(s);assert.match(app.element('#overlay').innerHTML,/Mocy/);assert.match(app.element('#overlay').innerHTML,/5 → 8/);
 app.click('lootEquip:0');assert.equal(E.stats(app.read()).attack,13);assert.equal(app.element('#overlay').hidden,true);
});
test('forging a chosen bonus keeps modal position and updates equipment',()=>{
 const s=E.createHero();s.quest=3;s.level=5;s.gold=100;E.add(s,'crystal',3);E.add(s,'fang',4);
 const app=boot(s);app.click('service:smith');assert.match(app.element('#overlay').innerHTML,/Nasycenie broni/);app.element('.modal').scrollTop=480;app.click('enchant:precision');
 assert.equal(app.element('.modal').scrollTop,480);assert.equal(app.read().inventory.find(i=>i.uid===app.read().equipped.weapon).affix,'precision');
});
test('ready hunting reward is shown and cannot be claimed twice',()=>{
 const s=E.createHero();s.level=2;E.add(s,'pelt',6);E.add(s,'herb',4);const app=boot(s);app.click('huntClaim:supplies');assert.match(app.element('#overlay').innerHTML,/Nagroda za wytrwałość/);const saved=app.read();app.click('huntClaim:supplies');assert.deepEqual(app.read(),saved);
});
