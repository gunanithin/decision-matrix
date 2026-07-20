const CACHE_NAME = 'decision-matrix-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './firebase-messaging-sw.js',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// ─── Native Web Push Notification Handler ───────────────────────────
self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch(e) {
      data = { notification: { title: "Decision Matrix Alert", body: event.data.text() } };
    }
  }
  const title = (data.notification && data.notification.title) || "Decision Matrix Alert";
  const options = {
    body: (data.notification && data.notification.body) || "You have a task reminder.",
    icon: './icon-192.png',
    badge: './icon-180.png',
    data: {
      url: (data.webpush && data.webpush.fcmOptions && data.webpush.fcmOptions.link) || './'
    }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || './')
  );
});
