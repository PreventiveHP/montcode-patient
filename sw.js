 const CACHE_NAME = 'montcode-glucose-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png.jpg'  // Nombre exacto según tu GitHub
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
