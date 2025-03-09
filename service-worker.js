const CACHE_NAME = 'tv-remote-pwa-cache-v1'; // Güncel sürümü belirtmek için sürüm numarası ekledim.

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/tr/index.html',
          '/en/index.html',
          '/assets/css/modal.css',
          '/assets/css/remote-style-homepage.css',
          '/assets/css/remote-style.css',
          '/assets/fonts/Inter/Inter-VariableFont_slnt,wght.ttf',
          '/assets/fonts/Nunito/Nunito-VariableFont_wght.ttf',
          '/assets/images/menu-shape-light.svg',
          '/assets/images/menu-shape.svg',
          '/assets/images/moon.svg',
          '/assets/images/sun.svg',
          '/assets/js/dark-light-mode.js',
          '/assets/js/jquery-3.7.1.min.js',
          '/assets/js/kumanda-komutlari.js',
          '/assets/js/modalsettings.js',
          'lite/assets/css/remote-style-lite.css',
          'lite/assets/js/dark-light-mode.js',
          'lite/en/index.html',
          'lite/tr/index.html'
        ]);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
