const staticCacheName = 'site-static-new';
const dynamicCacheName = 'site-dynamic-new';
const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/database.js',
  '/js/router.js',
  '/services/data.json',
  '/services/Utils.js',
  '/views/components/app-shell.js',
  '/views/pages/Error404.js',
  '/views/pages/home.js',
  '/views/pages/mdp.js',
  '/views/pages/mlp.js',
  '/css/banner.css',
  '/css/footer.css',
  '/css/global.css',
  '/css/header.css',
  '/css/main.css',
  '/css/mdp.css',
  '/css/mlp.css',
  '/css/sliders.css',
  '/css/styles.css'
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener('install', evt => {
  console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      // cache.addAll(assets);
      assets.map(asset => cache.add(asset))
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch events
self.addEventListener('fetch', evt => {
  if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
    evt.respondWith(
      caches.match(evt.request).then(cacheRes => {
        return cacheRes || fetch(evt.request).then(fetchRes => {
          return caches.open(dynamicCacheName).then(cache => {
            cache.put(evt.request.url, fetchRes.clone());
            // check cached items size
            limitCacheSize(dynamicCacheName, 50);
            return fetchRes;
          })
        });
      }).catch(() => {
        if(evt.request.url.indexOf('.html') > -1){
          return caches.match('/pages/fallback.html');
        }
      })
    );
  }
});