const CACHE='time4heroes-3967';
const CORE=[
  './','./index.html','./styles.css?v=3967','./app.js?v=3967','./data.js?v=3967','./manifest.webmanifest',
  './assets/icon-192.png','./assets/icon-512.png','./assets/characters/heroes-directions-391.png',
  './assets/characters/battle-backs/knight-back.png','./assets/characters/battle-backs/mage-back.png','./assets/characters/battle-backs/hunter-back.png','./assets/characters/battle-backs/berserker-back.png','./assets/characters/battle-backs/ranger-back.png',
  './assets/tavern-scene-desktop.png','./assets/tavern-scene-mobile.png',
  './assets/backgrounds/battle-meadow-380.webp','./assets/backgrounds/battle-forest-380.webp','./assets/backgrounds/battle-ruins-380.webp','./assets/backgrounds/battle-marsh-380.webp','./assets/backgrounds/battle-highlands-380.webp',
  './assets/backgrounds/interior-shop-380.webp','./assets/backgrounds/interior-smith-380.webp','./assets/backgrounds/interior-alchemist-380.webp','./assets/backgrounds/interior-auction-380.webp','./assets/backgrounds/interior-guild-380.webp',
  
  './assets/interior-questboard.png','./assets/interior-forge.png','./assets/interior-alchemist.png','./assets/interior-shop.png','./assets/interior-guild.png','./assets/interior-auction.png',
  './assets/atlases/item-atlas-320.png','./assets/atlases/monster-atlas-core-320.png','./assets/atlases/monster-atlas-new-320.png','./assets/atlases/archive-monsters-1-330.png','./assets/atlases/archive-monsters-2-330.png','./assets/atlases/archive-monsters-3-330.png','./assets/atlases/archive-monsters-4-330.png'
];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>Promise.allSettled(CORE.map(async url=>{
        try{
          const res=await fetch(url,{cache:'no-store'});
          if(!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
          await cache.put(url,res.clone());
        }catch(err){
          console.warn('[T4H SW] Pominięto zasób podczas precache:',url,err);
        }
      })))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k.startsWith('time4heroes-')&&k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;

  const isCode = event.request.mode==='navigate' || /\.(?:html|js|css)$/.test(url.pathname);

  if(isCode){
    // Network first for code so GitHub Pages updates cannot mix old JS/CSS with a new index.html.
    event.respondWith(
      fetch(event.request,{cache:'no-store'})
        .then(res=>{
          if(!res.ok)throw new Error('HTTP '+res.status);const copy=res.clone();
          caches.open(CACHE).then(c=>c.put(event.request,copy));
          return res;
        })
        .catch(()=>caches.match(event.request).then(hit=>hit||(event.request.mode==='navigate'?caches.match('./index.html'):Response.error())))
    );
    return;
  }

  // Cache-first is fine for heavy immutable-ish art/audio assets.
  event.respondWith(
    caches.match(event.request).then(hit=>hit||fetch(event.request).then(res=>{
      if(!res.ok)throw new Error('HTTP '+res.status);const copy=res.clone();
      caches.open(CACHE).then(c=>c.put(event.request,copy));
      return res;
    }))
  );
});
