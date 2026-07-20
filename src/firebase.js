import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/messaging';

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCT2PbLfaZpVy-MBU6S97yTkTnH_oD7yNo",
  authDomain: "eisenhower-decision-matrix.firebaseapp.com",
  projectId: "eisenhower-decision-matrix",
  storageBucket: "eisenhower-decision-matrix.firebasestorage.app",
  messagingSenderId: "1011365477842",
  appId: "1:1011365477842:web:089b2170eacee611589c0b",
  measurementId: "G-G77XP9E7Z9"
};

let firebaseReady = false;
try {
  if (FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY" && !firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG);
    firebaseReady = true;
  } else if (firebase.apps.length > 0) {
    firebaseReady = true;
  }
} catch (e) {
  console.error("Firebase init failed", e);
}

export const isFirebaseReady = firebaseReady;
export default firebase;
