self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("impostor-cache-v2").then(cache => {
      return cache.addAll([
        "/Impostor-Anime/",
        "/Impostor-Anime/index.html",
        "/Impostor-Anime/script.js",
        "/Impostor-Anime/styles.css",
        "/Impostor-Anime/suspense-248067.mp3",
        "/Impostor-Anime/icon-192.png",
        "/Impostor-Anime/icon-512.png"
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
