const CACHE_NAME = 'osaka-planner-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // 만약 별도의 css나 js, 아이콘 파일이 있다면 아래처럼 추가하세요.
  // '/style.css',
  // '/app.js',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// 1. 서비스 워커 설치 및 파일 캐싱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('캐시 디렉토리 오픈 완료');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. 네트워크 요청 가로채기 (오프라인일 때 캐시된 파일 보여주기)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에 파일이 있다면 캐시된 파일 반환, 없으면 네트워크 요청
        return response || fetch(event.request);
      })
  );
});