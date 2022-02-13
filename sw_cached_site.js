const staticCache = 'static-v0';
const dynamicCache = 'dynamic-v0';
const assets = [
  '/',
  // '/manifest.json',
  '/index.html',
  '/fallback.html',
  'main.js',
  'style.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0',
  'https://fonts.gstatic.com/s/poppins/v15/pxiEyp8kv8JHgFVrJJfecnFHGPc.woff2',
  '/icons/icon-144x144.png',
];

//Cache Size Limiter
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete[keys[0]].then(limitCacheSize(name, size));
      }
    });
  });
};

//Install
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(staticCache).then((cache) => {
      cache.addAll(assets);
    })
  );
});

//Activate
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cache) => cache !== staticCache && cache !== dynamicCache)
          .map((cache) => caches.delete(cache))
      );
    })
  );
});

//Fetch
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches
      .match(e.request)
      .then((cacheRes) => {
        return (
          cacheRes ||
          fetch(e.request).then((fetchRes) => {
            return caches.open(dynamicCache).then((cache) => {
              cache.put(e.request.url, fetchRes.clone());
              limitCacheSize(dynamicCache, 15);
              return fetchRes;
            });
          })
        );
      })
      .catch(() => {
        if (e.request.url.indexOf('.html') > -1) {
          return caches.match('/fallback.html');
        }
      })

    // fetch(e.request)
    //   .then((res) => {
    //     const resClone = res.clone();
    //     caches.open(dynamicCache).then((cache) => {
    //       cache.put(e.request, resClone);
    //     });
    //     return res;
    //   })
    //   .catch((err) => caches.match(e.request).then((res) => res))
  );
});
