// WASM Café — offline shell (the "works without internet" party trick)
const CACHE = "wasm-v1";
const SHELL = [
  "./",
  "./index.html",
  "./owner.html",
  "./assets/fonts/noto-kufi-arabic-arabic-500-normal.woff2",
  "./assets/fonts/noto-kufi-arabic-arabic-700-normal.woff2",
  "./assets/fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2",
  "./assets/fonts/ibm-plex-sans-arabic-arabic-600-normal.woff2",
  "./assets/fonts/ibm-plex-sans-arabic-latin-400-normal.woff2",
  "./assets/fonts/ibm-plex-sans-arabic-latin-600-normal.woff2"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((hit) => {
      const net = fetch(e.request)
        .then((res) => {
          if (res.ok && new URL(e.request.url).origin === location.origin) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});
