// نِدّ: التخزين المؤقت + تنبيهات OneSignal
// v3.1.1 (C8): النسخة المخزنة تنعرض فورًا وتتجدد بالخلفية · (W1): ما نخزّن إلا الردود السليمة (res.ok)
try { importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js'); } catch (e) {}
var V = 'b587110a', C = 'nidd-' + V;
var CORE = ['/', '/manifest.webmanifest', '/config.js', '/icons/icon-192.png', '/icons/apple-touch-icon.png'];
self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(C).then(function (c) { return c.addAll(CORE.map(function (u) { return new Request(u, { cache: 'reload' }); })); }).catch(function () {}));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k.indexOf('nidd-') === 0 && k !== C; }).map(function (k) { return caches.delete(k); })); })
    .then(function () { return self.clients.claim(); })
    .then(function () { return self.clients.matchAll({ type: 'window' }); })
    .then(function (cs) { cs.forEach(function (c) { c.postMessage({ nidd: 'updated', v: V }); }); }));
});
function keep(req, res) {
  if (!res || !res.ok || res.type === 'opaque') return res;
  var cp = res.clone();
  caches.open(C).then(function (c) { c.put(req, cp); });
  return res;
}
self.addEventListener('fetch', function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  var key = r.mode === 'navigate' || u.pathname === '/index.html' ? '/' : u.pathname === '/config.js' ? '/config.js' : null;
  if (key) {
    var net = fetch(r.mode === 'navigate' ? key : r, { cache: 'no-cache' }).then(function (res) { return keep(key, res); });
    e.waitUntil(net.catch(function () {}));
    e.respondWith(caches.match(key).then(function (hit) { return hit || net; }).catch(function () { return net; }));
    return;
  }
  e.respondWith(caches.match(r).then(function (hit) { return hit || fetch(r).then(function (res) { return keep(r, res); }); }));
});
