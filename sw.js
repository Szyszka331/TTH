const CACHE='time4heroes-3800';
const CORE=[
  './','./index.html','./styles.css?v=3800','./app.js?v=3800','./data.js?v=3800','./manifest.webmanifest',
  './assets/icon-192.png','./assets/icon-512.png',
  './assets/tavern-scene-desktop.png','./assets/tavern-scene-mobile.png',
  './assets/backgrounds/battle-meadow-380.webp','./assets/backgrounds/battle-forest-380.webp','./assets/backgrounds/battle-ruins-380.webp','./assets/backgrounds/battle-marsh-380.webp','./assets/backgrounds/battle-highlands-380.webp',
  './assets/backgrounds/interior-shop-380.webp','./assets/backgrounds/interior-smith-380.webp','./assets/backgrounds/interior-alchemist-380.webp','./assets/backgrounds/interior-auction-380.webp','./assets/backgrounds/interior-guild-380.webp',
  './assets/npcs/npc-selma-cutout-380.webp','./assets/npcs/npc-ragor-cutout-380.webp','./assets/npcs/npc-ilyra-cutout-380.webp','./assets/npcs/npc-varo-cutout-380.webp','./assets/npcs/npc-edrin-cutout-380.webp',
  './assets/interior-questboard.png','./assets/interior-forge.png','./assets/interior-alchemist.png','./assets/interior-shop.png','./assets/interior-guild.png','./assets/interior-auction.png',
  './assets/atlases/item-atlas-320.png','./assets/atlases/monster-atlas-core-320.png','./assets/atlases/monster-atlas-new-320.png','./assets/atlases/archive-monsters-1-330.png','./assets/atlases/archive-monsters-2-330.png','./assets/atlases/archive-monsters-3-330.png','./assets/atlases/archive-monsters-4-330.png'
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
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
          const copy=res.clone();
          caches.open(CACHE).then(c=>c.put(event.request,copy));
          return res;
        })
        .catch(()=>caches.match(event.request).then(hit=>hit||caches.match('./index.html')))
    );
    return;
  }

  // Cache-first is fine for heavy immutable-ish art/audio assets.
  event.respondWith(
    caches.match(event.request).then(hit=>hit||fetch(event.request).then(res=>{
      const copy=res.clone();
      caches.open(CACHE).then(c=>c.put(event.request,copy));
      return res;
    }))
  );
});
