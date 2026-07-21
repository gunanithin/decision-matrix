import { useEffect } from 'react';
import firebase, { isFirebaseReady } from '../firebase';

const VAPID_KEY = "BMKwflH9dYxByEVVgw6Xh4eD8Caj4g17LF-x0Qe6vE-CTEooIsXImL-81bBc5eu1A6HiiLZZ9A7YeyCLeaidvFw";

export function usePushNotifications(user) {
  useEffect(() => {
    if (!isFirebaseReady || !user) return;

    if ('Notification' in window && Notification.permission === 'granted' && firebase.messaging.isSupported()) {
      try {
        navigator.serviceWorker.register('/firebase-messaging-sw.js').then(swRegistration => {
          const messaging = firebase.messaging();
          const tokenOpts = {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: swRegistration
          };
          messaging.getToken(tokenOpts).then((token) => {
            if (token) {
              firebase.firestore().collection("users").doc(user.uid).set({
                fcmTokens: firebase.firestore.FieldValue.arrayUnion(token),
                fcmToken: token
              }, { merge: true });
            }

            if (!window.onMessageRegistered) {
              messaging.onMessage((payload) => {
                console.log("Foreground message received:", payload);
                if (payload.notification && document.visibilityState === 'visible') {
                  navigator.serviceWorker.ready.then(reg => {
                    reg.showNotification(payload.notification.title, {
                      body: payload.notification.body,
                      icon: "/assets/icon-192.png",
                      badge: "/assets/icon-180.png"
                    });
                  });
                }
              });
              window.onMessageRegistered = true;
            }
          }).catch(e => console.log("FCM Token fetch skipped/silent:", e));
        }).catch(e => console.log("FCM SW register skipped/silent:", e));
      } catch (e) { }
    }
  }, [user]);

  const enablePushNotifications = async () => {
    try {
      if (!('Notification' in window)) {
        alert("This browser does not support desktop notification");
        return;
      }

      let perm = Notification.permission;
      if (perm === 'default') {
        perm = await Notification.requestPermission();
      }

      if (perm === 'granted') {
        if (!firebase.messaging.isSupported()) {
          alert("Firebase Messaging is not supported in this browser.");
          return;
        }

        const messaging = firebase.messaging();
        let swRegistration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
        if (!swRegistration) {
          swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(e => {
            console.error("FCM SW register error:", e);
            return null;
          });
        }
        const tokenOptions = {
          vapidKey: VAPID_KEY,
          ...(swRegistration ? { serviceWorkerRegistration: swRegistration } : {})
        };
        const token = await messaging.getToken(tokenOptions).catch(err => {
          console.error("FCM Token Error:", err);
          alert("FCM Token Error: " + err.message);
          return null;
        });

        if (token) {
          await firebase.firestore().collection("users").doc(user.uid).set({
            fcmTokens: firebase.firestore.FieldValue.arrayUnion(token),
            fcmToken: token
          }, { merge: true });
          alert("Native Push Notifications enabled!");
        }

        if (!window.onMessageRegistered) {
          messaging.onMessage((payload) => {
            if (payload.notification && document.visibilityState === 'visible') {
              navigator.serviceWorker.ready.then(reg => {
                reg.showNotification(payload.notification.title, {
                  body: payload.notification.body,
                  icon: "/assets/icon-192.png",
                  badge: "/assets/icon-180.png"
                });
              });
            }
          });
          window.onMessageRegistered = true;
        }
      } else if (perm === 'denied') {
        alert("Notification permission was denied.");
      }
    } catch (err) {
      console.error("Error enabling push notifications:", err);
      alert("Error: " + err.message);
    }
  };

  return { enablePushNotifications };
}
