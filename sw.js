const CACHE_NAME = 'montcode-v6';
const ASSETS = [
  'index.html',
  'activation.html',
  'bp.html',
  'glucose.html',
  'food.html',
  'logo.png.jpg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
