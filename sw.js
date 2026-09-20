const CACHE='time4heroes-v114-ux';
const CORE=[
  './','./index.html','./styles.css?v=1140','./app.js?v=1140','./data.js?v=1140','./manifest.webmanifest',
  './assets/icon-192.png','./assets/icon-512.png'
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
