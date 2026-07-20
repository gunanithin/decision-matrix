importScripts('https://www.gstatic.com/firebasejs/12.3.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.3.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCT2PbLfaZpVy-MBU6S97yTkTnH_oD7yNo",
  authDomain: "eisenhower-decision-matrix.firebaseapp.com",
  projectId: "eisenhower-decision-matrix",
  storageBucket: "eisenhower-decision-matrix.firebasestorage.app",
  messagingSenderId: "1011365477842",
  appId: "1:1011365477842:web:089b2170eacee611589c0b",
  measurementId: "G-G77XP9E7Z9"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Forcefully show notification to bypass Firebase SDK silent failures on Mac Chrome
  const title = (payload.notification && payload.notification.title) || (payload.data && payload.data.title) || "Decision Matrix Alert";
  const options = {
    body: (payload.notification && payload.notification.body) || (payload.data && payload.data.body) || "You have a task reminder.",
    icon: "./icon-192.png",
    badge: "./icon-180.png",
    data: {
      url: (payload.fcmOptions && payload.fcmOptions.link) || "https://gunanithin.github.io/decision-matrix/"
    }
  };
  
  self.registration.showNotification(title, options);
});
