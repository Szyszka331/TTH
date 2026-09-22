const CACHE='time4heroes-3070';
const CORE=[
  './','./index.html','./styles.css?v=3070','./app.js?v=3070','./data.js?v=3070','./manifest.webmanifest',
  './assets/icon-192.png','./assets/icon-512.png','./assets/tavern-scene-desktop.png','./assets/tavern-scene-mobile.png','./assets/smith-scene-desktop.jpg','./assets/smith-scene-mobile.jpg','./assets/alchemist-scene-desktop.jpg','./assets/alchemist-scene-mobile.jpg','./assets/shop-scene-desktop.jpg','./assets/shop-scene-mobile.jpg','./assets/guild-scene-desktop.jpg','./assets/guild-scene-mobile.jpg','./assets/auction-scene-desktop.jpg','./assets/auction-scene-mobile.jpg','./assets/interior-questboard.png','./assets/interior-forge.png','./assets/interior-alchemist.png','./assets/interior-shop.png','./assets/interior-guild.png','./assets/interior-auction.png'
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
