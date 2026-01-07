self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("impostor-cache").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./script.js",
        "./style.css",
        "./sonido.mp3"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
