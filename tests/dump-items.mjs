import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const data=await import('data:text/javascript;base64,'+Buffer.from(fs.readFileSync(path.join(root,'data.js'))).toString('base64'));
const noop=()=>{};
const node=()=>({innerHTML:'',textContent:'',style:{setProperty:noop},classList:{add:noop,remove:noop,toggle:noop},dataset:{},addEventListener:noop,querySelector:()=>node(),querySelectorAll:()=>[],appendChild:noop,before:noop,prepend:noop,insertAdjacentHTML:noop,focus:noop,remove:noop,getAttribute:()=>null,setAttribute:noop,click:noop});
const nodes=new Map();
const storage=new Map();let callbacks=[],intervals=[];const writes=[];
const ctx=vm.createContext({...data,assert,console,Date,Math,JSON,Map,Set,Number,Object,Array,String,Infinity,URL,Blob,structuredClone,
 document:{querySelector:q=>{if(!nodes.has(q))nodes.set(q,node());return nodes.get(q)},querySelectorAll:()=>[],body:node(),addEventListener:noop,createElement:()=>node(),createTreeWalker:()=>({nextNode:()=>null}),hidden:false},
 navigator:{onLine:true,geolocation:{getCurrentPosition(fn){ctx.gpsCallback=fn},watchPosition(fn){ctx.gpsCallback=fn;return 1},clearWatch:noop}},
 window:{addEventListener:noop,matchMedia:()=>({matches:false}),navigator:{},location:{},innerWidth:390},location:{reload:noop},
 MutationObserver:class{observe(){}},NodeFilter:{SHOW_TEXT:4},performance:{now:()=>Date.now()},
 localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>{storage.set(k,v);writes.push([k,v])},removeItem:k=>storage.delete(k)},
 setTimeout:(fn,delay)=>{callbacks.push({fn,delay});return callbacks.length},clearTimeout:noop,setInterval:(fn,delay)=>{intervals.push(fn);return intervals.length},clearInterval:noop,
 requestAnimationFrame:noop,cancelAnimationFrame:noop,confirm:()=>true});
let src=fs.readFileSync(path.join(root,'app.js'),'utf8').replace(/^import[^\n]+\n/,'');
src=src.slice(0,src.lastIndexOf('state=load();restoreSession();'));
vm.runInContext(src,ctx);
fs.writeFileSync(process.argv[2],vm.runInContext('JSON.stringify(ITEMS)',ctx));
