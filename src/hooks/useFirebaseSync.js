import { useState, useEffect, useCallback, useRef } from 'react';
import firebase, { isFirebaseReady } from '../firebase';

export function useFirebaseSync() {
  const [tasks, setTasks] = useState(() => {
    try {
      const val = localStorage.getItem("decision_matrix_tasks");
      return val ? JSON.parse(val) : [];
    } catch (e) { return []; }
  });
  const [user, setUser] = useState(null);
  const [syncStatus, setSyncStatus] = useState("local");
  const syncTimeout = useRef(null);

  // Local storage backup sync
  useEffect(() => {
    try { localStorage.setItem("decision_matrix_tasks", JSON.stringify(tasks)); }
    catch (e) { console.error("localStorage save failed", e); }
  }, [tasks]);

  // Auth listener
  useEffect(() => {
    if (!isFirebaseReady) return;
    const unsub = firebase.auth().onAuthStateChanged((u) => {
      setUser(u);
    });
    return unsub;
  }, []);

  // Remote read listener
  useEffect(() => {
    if (!isFirebaseReady || !user) return;
    
    const profileRef = firebase.firestore().collection("users").doc(user.uid);
    profileRef.set({
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      timezoneOffset: new Date().getTimezoneOffset(),
      lastActive: Date.now()
    }, { merge: true }).catch(err => console.error("Error setting profile:", err));

    let seeded = false;
    const unsub = profileRef.onSnapshot(
      (snap) => {
        if (snap.exists) {
          setTasks(snap.data().tasks || []);
        } else if (!seeded) {
          profileRef.set({ tasks, updatedAt: Date.now() }, { merge: true });
          seeded = true;
        }
        setSyncStatus("synced");
      },
      (err) => { console.error("Firestore sync error", err); setSyncStatus("error"); }
    );
    return unsub;
  }, [user]);

  const writeRemote = useCallback((newTasks) => {
    if (!isFirebaseReady || !user) return;
    setSyncStatus("syncing");
    clearTimeout(syncTimeout.current);
    syncTimeout.current = setTimeout(() => {
      firebase.firestore().collection("users").doc(user.uid)
        .set({ tasks: newTasks, updatedAt: Date.now() }, { merge: true })
        .then(() => setSyncStatus("synced"))
        .catch((e) => { console.error("Firestore write failed", e); setSyncStatus("error"); });
    }, 500);
  }, [user]);

  return { tasks, setTasks, user, setUser, syncStatus, writeRemote };
}
