const CACHE = 'vegas2026-v17';
const ASSETS = [
  './',
  './index.html',
  './cheap-eats.html',
  './buffets.html',
  './tips.html',
  './map.html',
  './off-strip.html',
  './transport.html',
  './tournament.html',
  './scorekeeping.html',
  './nav.js',
  './style.css',
  './leaflet.js',
  './leaflet.css',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Install — cache all core assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — serve from cache, fall back to network, cache map tiles too
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Cache OSM map tiles as they're viewed
  if (url.hostname.includes('tile.openstreetmap.org')) {
    e.respondWith(
      caches.open(CACHE).then(async cache => {
        const cached = await cache.match(e.request);
        if (cached) return cached;
        try {
          const resp = await fetch(e.request);
          if (resp.ok) cache.put(e.request, resp.clone());
          return resp;
        } catch {
          return new Response('', { status: 503 });
        }
      })
    );
    return;
  }

  // Everything else — cache first, then network
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (resp.ok) {
          caches.open(CACHE).then(c => c.put(e.request, resp.clone()));
        }
        return resp;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
