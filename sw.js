const CACHE='time4heroes-3998-quests9';
const CORE=[
  './','./index.html','./styles.css?v=3998-quests9','./app.js?v=3998-quests9','./data.js?v=3998-quests9','./manifest.webmanifest',
  './assets/icon-192.png','./assets/icon-512.png','./assets/characters/heroes-directions-391.png',
  './assets/characters/battle-backs/knight-back.png','./assets/characters/battle-backs/mage-back.png','./assets/characters/battle-backs/hunter-back.png','./assets/characters/battle-backs/berserker-back.png','./assets/characters/battle-backs/ranger-back.png',
  './assets/tavern-scene-desktop.png','./assets/tavern-scene-mobile.png','./assets/backgrounds/city-map-3995.webp',
  './assets/backgrounds/battle-meadow-3998.webp','./assets/backgrounds/battle-forest-3998.webp','./assets/backgrounds/battle-ruins-3998.webp','./assets/backgrounds/battle-marsh-3998.webp','./assets/backgrounds/battle-highlands-3998.webp',
  './assets/story/nessa-3998.webp','./assets/story/eldran-3998.webp','./assets/story/taren-3998.webp','./assets/story/toren-3998.webp',
  './assets/backgrounds/interior-shop-3997.webp','./assets/backgrounds/interior-smith-3997.webp','./assets/backgrounds/interior-alchemist-3997.webp','./assets/backgrounds/interior-auction-3997.webp','./assets/backgrounds/interior-guild-3998.webp',
  
  './assets/interior-questboard.png','./assets/interior-forge.png','./assets/interior-alchemist.png','./assets/interior-shop.png','./assets/interior-guild.png','./assets/interior-auction.png',
  './assets/atlases/item-atlas-320.png','./assets/atlases/monster-atlas-core-320.png','./assets/atlases/monster-atlas-new-320.png','./assets/atlases/archive-monsters-1-330.png','./assets/atlases/archive-monsters-2-330.png','./assets/atlases/archive-monsters-3-330.png','./assets/atlases/archive-monsters-4-330.png',
  './assets/icons/classgear/berserker-amulet.png',
  './assets/icons/classgear/berserker-armor.png',
  './assets/icons/classgear/berserker-boots.png',
  './assets/icons/classgear/berserker-gloves.png',
  './assets/icons/classgear/berserker-helmet.png',
  './assets/icons/classgear/berserker-ring.png',
  './assets/icons/classgear/berserker-shield.png',
  './assets/icons/classgear/hunter-amulet.png',
  './assets/icons/classgear/hunter-armor.png',
  './assets/icons/classgear/hunter-boots.png',
  './assets/icons/classgear/hunter-gloves.png',
  './assets/icons/classgear/hunter-helmet.png',
  './assets/icons/classgear/hunter-offhand.png',
  './assets/icons/classgear/hunter-ring.png',
  './assets/icons/classgear/hunter-shield.png',
  './assets/icons/classgear/knight-amulet.png',
  './assets/icons/classgear/knight-armor.png',
  './assets/icons/classgear/knight-boots.png',
  './assets/icons/classgear/knight-gloves.png',
  './assets/icons/classgear/knight-helmet.png',
  './assets/icons/classgear/knight-offhand.png',
  './assets/icons/classgear/knight-ring.png',
  './assets/icons/classgear/knight-shield.png',
  './assets/icons/classgear/mage-amulet.png',
  './assets/icons/classgear/mage-armor.png',
  './assets/icons/classgear/mage-boots.png',
  './assets/icons/classgear/mage-gloves.png',
  './assets/icons/classgear/mage-helmet.png',
  './assets/icons/classgear/mage-offhand.png',
  './assets/icons/classgear/mage-ring.png',
  './assets/icons/classgear/mage-shield.png',
  './assets/icons/classgear/ranger-amulet.png',
  './assets/icons/classgear/ranger-armor.png',
  './assets/icons/classgear/ranger-boots.png',
  './assets/icons/classgear/ranger-gloves.png',
  './assets/icons/classgear/ranger-helmet.png',
  './assets/icons/classgear/ranger-offhand.png',
  './assets/icons/classgear/ranger-ring.png',
  './assets/icons/classgear/ranger-shield.png'
];

// Installation is complete only when the app and all five class portraits are available.
const REQUIRED=CORE.slice(0,9);
async function fetchGameResource(request){
 const res=await fetch(request,{cache:'no-store'});
 if(!res.ok)throw new Error('HTTP '+res.status);
 const url=new URL(typeof request==='string'?request:request.url,self.location.href);
 if(/\.(png|webp|jpe?g|svg)$/.test(url.pathname)&&/text\/html/i.test(res.headers.get('content-type')||''))throw new Error('Image returned HTML');
 return res;
}
async function installGame(){
 const cache=await caches.open(CACHE);
 // A failed shell download must keep the previous working worker active.
 await Promise.all(REQUIRED.map(async url=>{const res=await fetchGameResource(url);await cache.put(url,res)}));
 await Promise.allSettled(CORE.filter(url=>!REQUIRED.includes(url)).map(async url=>{const res=await fetchGameResource(url);await cache.put(url,res)}));
}
self.addEventListener('install',event=>event.waitUntil(installGame()));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_GAME_UPDATE')event.waitUntil(self.skipWaiting())});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('time4heroes-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
async function cacheFirst(request){
 const cache=await caches.open(CACHE),hit=await cache.match(request);if(hit)return hit;
 const response=await fetchGameResource(request);await cache.put(request,response.clone());return response;
}
async function networkFirst(request){
 const cache=await caches.open(CACHE);
 try{const response=await fetchGameResource(request);await cache.put(request,response.clone());return response}
 catch{const hit=await cache.match(request);return hit||(request.mode==='navigate'?await cache.match('./index.html'):null)||Response.error()}
}
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;
 const isCode=event.request.mode==='navigate'||/\.(html|js|css)$/.test(url.pathname);
 // Keep versioned application modules together; navigation still checks for a new release.
 const versionedCore=CORE.some(path=>new URL(path,self.location.href).href===url.href)&&url.searchParams.has('v');
 event.respondWith(isCode&&!versionedCore?networkFirst(event.request):cacheFirst(event.request).catch(()=>Response.error()));
});
