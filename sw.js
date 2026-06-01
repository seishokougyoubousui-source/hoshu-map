const CACHE_NAME = 'hoshu-map-v1';
const FILES_TO_CACHE = [
  './hoshu_map.html',
  './manifest.json'
];

// インストール時にキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// リクエスト時：キャッシュ優先、なければネットワーク
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => {
        // オフライン時はメインHTMLを返す
        return caches.match('./hoshu_map.html');
      });
    })
  );
});
