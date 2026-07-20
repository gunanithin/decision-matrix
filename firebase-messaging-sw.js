importScripts('https://www.gstatic.com/firebasejs/12.3.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.3.0/firebase-messaging-compat.js');

// Initialize Firebase inside Service Worker
firebase.initializeApp({
  apiKey: "AIzaSyDummyKeyForServiceWorker",
  authDomain: "eisenhower-decision-matrix.firebaseapp.com",
  projectId: "eisenhower-decision-matrix",
  messagingSenderId: "1011365477842",
  appId: "1:1011365477842:web:c0b892a0614138e82ef6ec"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || "Decision Matrix Alert";
  const options = {
    body: (payload.notification && payload.notification.body) || "You have a task reminder.",
    icon: "./icon-192.png",
    badge: "./icon-180.png",
    data: {
      url: (payload.webpush && payload.webpush.fcmOptions && payload.webpush.fcmOptions.link) || "./"
    }
  };
  self.registration.showNotification(title, options);
});
