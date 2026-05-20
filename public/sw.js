const CACHE_NAME = 'osaka-planner-v1';
const STATIC_ASSETS = ['/', '/index.html'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.url.includes('firebase') || event.request.url.includes('cloudinary') || event.request.url.includes('open-meteo') || event.request.url.includes('googleapis')) return;
  event.respondWith(fetch(event.request).then(response => { const clone = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone)); return response; }).catch(() => caches.match(event.request)));
});
