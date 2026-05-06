const CACHE_NAME = 'nexca-v23';
const STATIC_ASSETS = [
  '/nexca/',
  '/nexca/index.html',
  '/nexca/nexca-v2.js',
  '/nexca/nexca-town.css',
  '/nexca/nexca-town-data.js',
  '/nexca/nexca-town.js',
  '/nexca/organizer.html',
  '/nexca/organizer-v2.js',
  '/nexca/admin.html',
  '/nexca/manifest.json',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(STATIC_ASSETS).catch(function(err) {
        console.warn('SW cache failed for some assets:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  // Supabase API calls: network only
  if (e.request.url.includes('supabase.co')) {
    return;
  }
  // Font requests: cache first
  if (e.request.url.includes('fonts.googleapis.com') || e.request.url.includes('fonts.gstatic.com')) {
    e.respondWith(
      caches.match(e.request).then(function(cached) {
        return cached || fetch(e.request).then(function(response) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) { cache.put(e.request, clone); });
          return response;
        });
      })
    );
    return;
  }
  // HTML/assets: network first, cache fallback
  e.respondWith(
    fetch(e.request).then(function(response) {
      if (response.ok) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) { cache.put(e.request, clone); });
      }
      return response;
    }).catch(function() {
      return caches.match(e.request).then(function(cached) {
        return cached || caches.match('/nexca/index.html');
      });
    })
  );
});
