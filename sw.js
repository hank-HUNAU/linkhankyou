/* 中国文化概况 · Service Worker（v1）
   策略：导航＝网络优先（失败回缓存/离线页）；静态资源＝缓存优先＋后台更新；音频不缓存 */
const CACHE = 'lhk-v1';
const CORE = ['./', './offline.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.endsWith('.mp3')) return;                 // 音频体积大，暂不缓存
  var isNav = req.mode === 'navigate' || (req.headers.get('accept') || '').indexOf('text/html') >= 0;
  if (isNav) {
    e.respondWith(
      fetch(req).then(function (r) {
        var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, cp); });
        return r;
      }).catch(function () {
        return caches.match(req).then(function (r) { return r || caches.match('./offline.html'); });
      })
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(function (hit) {
      var net = fetch(req).then(function (r) {
        if (r && r.status === 200) { var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, cp); }); }
        return r;
      }).catch(function () { return hit; });
      return hit || net;
    })
  );
});
