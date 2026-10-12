import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync,existsSync} from 'node:fs';
const source=readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8');
function worker(){const listeners={},files=[],cached={from:'cache'},fresh={ok:true,from:'network'};let skipped=false,offline=false;vm.runInNewContext(source,{URL,self:{location:{origin:'https://game.test'},addEventListener:(name,fn)=>listeners[name]=fn,skipWaiting:()=>{skipped=true},clients:{claim(){}}},caches:{open:async()=>({addAll:async list=>files.push(...list)}),match:async()=>cached,keys:async()=>[],delete:async()=>{}},fetch:async()=>{if(offline)throw Error('offline');return fresh}});return {listeners,files,get skipped(){return skipped},set offline(v){offline=v}};}
test('all offline cache resources exist and new code imports use the current version',async()=>{
 const w=worker();let install;w.listeners.install({waitUntil:p=>install=p});await install;assert.equal(w.skipped,true);
 for(const file of w.files){const name=file==='./'?'index.html':file.slice(2).split('?')[0];assert.ok(existsSync(new URL('../dist/'+name,import.meta.url)),file);}
 const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');assert.match(html,/app.js\?v=4.1.0/);
 for(const file of ['app.js','engine.js']){const text=readFileSync(new URL('../dist/'+file,import.meta.url),'utf8');for(const match of text.matchAll(/from '(\.\/[^']+)'/g))assert.ok(match[1].endsWith('?v=4.1.0'),match[1]);}
});
test('navigation fetches the current app while offline navigation falls back to cache',async()=>{
 const w=worker(),request={url:'https://game.test/',method:'GET',mode:'navigate'};let response;w.listeners.fetch({request,respondWith:p=>response=p});assert.equal((await response).from,'network');w.offline=true;w.listeners.fetch({request,respondWith:p=>response=p});assert.equal((await response).from,'cache');
});
