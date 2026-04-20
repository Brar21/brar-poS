const CACHE_NAME = "brar-pos-v2"; // 🔥 CHANGE VERSION WHEN YOU UPDATE

const urlsToCache = [
  "/",
];

// INSTALL
self.addEventListener("install", (event) => {
  self.skipWaiting(); // 🔥 activate immediately

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// ACTIVATE (DELETE OLD CACHE)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim(); // 🔥 take control immediately
});

// FETCH
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});