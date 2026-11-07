// نِدّ: التخزين المؤقت + تنبيهات OneSignal
try { importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js'); } catch (e) {}
var C = 'nidd-a0c7168f';
var CORE = ['/', '/manifest.webmanifest', '/config.js', '/icons/icon-192.png', '/icons/apple-touch-icon.png'];
self.addEventListener('install', function (e) { self.skipWaiting(); e.waitUntil(caches.open(C).then(function (c) { return c.addAll(CORE); }).catch(function () {})); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k.indexOf('nidd-') === 0 && k !== C; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  if (r.mode === 'navigate' || u.pathname === '/' || u.pathname === '/index.html' || u.pathname === '/config.js') {
    e.respondWith(fetch(r).then(function (res) { var cp = res.clone(); caches.open(C).then(function (c) { c.put(r.mode === 'navigate' ? '/' : r, cp); }); return res; })
      .catch(function () { return caches.match(r.mode === 'navigate' ? '/' : r); }));
    return;
  }
  e.respondWith(caches.match(r).then(function (hit) { return hit || fetch(r).then(function (res) { var cp = res.clone(); caches.open(C).then(function (c) { c.put(r, cp); }); return res; }); }));
});
