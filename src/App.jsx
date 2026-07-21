import { useState, useEffect, useRef, useCallback } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/dark.css";
import firebase, { isFirebaseReady } from "./firebase";
import { useFirebaseSync } from "./hooks/useFirebaseSync";
import { usePushNotifications } from "./hooks/usePushNotifications";
import { QUADRANTS, nextQuadrant } from "./constants";
import { GoogleIcon } from "./components/Icons";
import TaskInput from "./components/TaskInput";
import Quadrant from "./components/Quadrant";

function DecisionMatrix() {
  const [text, setText] = useState("");
  const [picked, setPicked] = useState("do");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  
  const dateInputRef = useRef(null);
  const fpInstance = useRef(null);

  const { tasks, setTasks, user, setUser, syncStatus, writeRemote } = useFirebaseSync();
  const { enablePushNotifications } = usePushNotifications(user);

  useEffect(() => {
    if (dateInputRef.current) {
      fpInstance.current = flatpickr(dateInputRef.current, {
        enableTime: picked === "decide",
        dateFormat: picked === "decide" ? "Y-m-d H:i" : "Y-m-d",
        minDate: "today",
        defaultDate: picked === "decide" && dueDate && dueTime ? `${dueDate} ${dueTime}` : dueDate || null,
        onChange: (selectedDates) => {
          if (selectedDates.length > 0) {
            const date = selectedDates[0];
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            setDueDate(`${y}-${m}-${d}`);
            
            if (picked === "decide") {
              const hr = String(date.getHours()).padStart(2, '0');
              const mn = String(date.getMinutes()).padStart(2, '0');
              setDueTime(`${hr}:${mn}`);
            } else {
              setDueTime("");
            }
          } else {
            setDueDate("");
            setDueTime("");
          }
        }
      });
    }
    return () => {
      if (fpInstance.current) fpInstance.current.destroy();
    };
  }, [picked]);

  const signIn = () => {
    if (!isFirebaseReady) return;
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((result) => { setUser(result.user); })
      .catch((e) => console.error("popup sign-in error", e));
  };
  const signOutUser = () => firebase.auth().signOut();

  const addTask = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTasks((prev) => {
      if (editingTaskId) {
        const next = prev.map(t => {
          if (t.id === editingTaskId) {
            const updated = { ...t, text: trimmed, quadrant: picked };
            if (picked === "decide" || picked === "delegate") {
              if (dueDate) updated.dueDate = dueDate;
              else delete updated.dueDate;
              if (dueTime && picked === "decide") updated.dueTime = dueTime;
              else delete updated.dueTime;
            } else {
              delete updated.dueDate;
              delete updated.dueTime;
            }
            return updated;
          }
          return t;
        });
        writeRemote(next);
        return next;
      } else {
        const newTask = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          text: trimmed,
          quadrant: picked,
          done: false,
          notificationsScheduled: {}
        };
        if (picked === "decide" || picked === "delegate") {
          if (dueDate) newTask.dueDate = dueDate;
          if (dueTime && picked === "decide") newTask.dueTime = dueTime;
        }
        const next = [newTask, ...prev];
        writeRemote(next);
        return next;
      }
    });
    setText("");
    setDueDate("");
    setDueTime("");
    setEditingTaskId(null);
    if (fpInstance.current) {
      fpInstance.current.clear();
    }
  }, [text, picked, dueDate, dueTime, writeRemote, editingTaskId, setTasks]);

  const editTask = (id) => {
    const t = tasks.find(task => task.id === id);
    if (t) {
      setEditingTaskId(t.id);
      setText(t.text);
      setPicked(t.quadrant);
      setDueDate(t.dueDate || "");
      setDueTime(t.dueTime || "");
      
      if (fpInstance.current) {
        if (t.dueDate) {
          fpInstance.current.setDate(t.dueTime && t.quadrant === "decide" ? `${t.dueDate} ${t.dueTime}` : t.dueDate);
        } else {
          fpInstance.current.clear();
        }
      }
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const cancelEdit = () => {
    setEditingTaskId(null);
    setText("");
    setDueDate("");
    setDueTime("");
    setPicked("do");
    if (fpInstance.current) {
      fpInstance.current.clear();
    }
  };

  const toggleDone = (id) => setTasks((prev) => {
    const next = prev.map((t) => t.id === id ? { ...t, done: !t.done } : t);
    writeRemote(next); return next;
  });

  const removeTask = (id) => setTasks((prev) => {
    const next = prev.filter((t) => t.id !== id);
    writeRemote(next); return next;
  });

  const cycle = (id) => {
    const t = tasks.find(task => task.id === id);
    if (!t || t.done) return;
    const nextQ = nextQuadrant(t.quadrant);
    
    if ((nextQ === "decide" || nextQ === "delegate") && !t.dueDate) {
      setEditingTaskId(t.id);
      setText(t.text);
      setPicked(nextQ);
      setDueDate("");
      setDueTime("");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setTasks((prev) => {
      const next = prev.map((task) => task.id === id ? { ...task, quadrant: nextQ } : task);
      writeRemote(next); 
      return next;
    });
  };

  const clearDone = (qid) => setTasks((prev) => {
    const next = prev.filter((t) => !(t.quadrant === qid && t.done));
    writeRemote(next); return next;
  });

  return (
    <div className="app-wrapper">
      <div className="canva-top-bar" style={{ justifyContent: 'center' }}>
        <div className="dot-container">
          <span className="bar-dot"></span><span className="bar-dot"></span>
          <span className="bar-dot"></span><span className="bar-dot"></span>
        </div>
      </div>

      <div className="em-canvas">
        <header className="em-header">
          <h1>Decision Matrix</h1>

          <TaskInput
            text={text} setText={setText}
            picked={picked} setPicked={setPicked}
            setDueDate={setDueDate} setDueTime={setDueTime}
            addTask={addTask}
            editingTaskId={editingTaskId}
            cancelEdit={cancelEdit}
            dateInputRef={dateInputRef}
          />

          {isFirebaseReady && (
            <div className="em-authbar">
              {!user ? (
                <button className="em-signin-btn" onClick={signIn}>
                  <GoogleIcon /> Sign in with Google to sync
                </button>
              ) : (
                <div className="em-user">
                  {user.photoURL && <img className="em-avatar" src={user.photoURL} alt="" />}
                  <span className="em-user-email">{user.email}</span>
                  <button className="em-signout-btn" onClick={signOutUser}>sign out</button>
                  {'Notification' in window && (
                    <button className="em-signin-btn" style={{ padding: '4px 10px', fontSize: '11px', background: 'var(--badge-orange)', border: 'none' }} onClick={enablePushNotifications}>
                      {Notification.permission === 'granted' ? '🔔 Sync Alerts' : '🔔 Enable Alerts'}
                    </button>
                  )}
                </div>
              )}
              <div className={`em-status ${syncStatus === "synced" ? "is-synced" : syncStatus === "syncing" ? "is-syncing" : syncStatus === "error" ? "is-error" : ""}`}>
                <span className="em-status-dot" />
                {syncStatus === "synced" ? "synced" : syncStatus === "syncing" ? "saving…" : syncStatus === "error" ? "sync error" : "local only"}
              </div>
            </div>
          )}
        </header>

        <div className="matrix-wrapper">
          <div className="matrix-grid">
            {/* Top Row: X-axis labels */}
            <div className="axis-corner"></div>
            <div className="axis-label-x"><span className="axis-pill">URGENT</span></div>
            <div className="axis-label-x"><span className="axis-pill">NOT URGENT</span></div>

            {/* Middle Row: Important */}
            <div className="axis-label-y"><span className="axis-pill-y">IMPORTANT</span></div>
            <Quadrant q={QUADRANTS[0]} index={0} tasks={tasks} clearDone={clearDone} toggleDone={toggleDone} editTask={editTask} cycle={cycle} removeTask={removeTask} />
            <Quadrant q={QUADRANTS[1]} index={1} tasks={tasks} clearDone={clearDone} toggleDone={toggleDone} editTask={editTask} cycle={cycle} removeTask={removeTask} />

            {/* Bottom Row: Not Important */}
            <div className="axis-label-y"><span className="axis-pill-y">NOT IMPORTANT</span></div>
            <Quadrant q={QUADRANTS[2]} index={2} tasks={tasks} clearDone={clearDone} toggleDone={toggleDone} editTask={editTask} cycle={cycle} removeTask={removeTask} />
            <Quadrant q={QUADRANTS[3]} index={3} tasks={tasks} clearDone={clearDone} toggleDone={toggleDone} editTask={editTask} cycle={cycle} removeTask={removeTask} />
          </div>
        </div>

        <footer className="em-footer" style={{ justifyContent: 'center' }}>
          <div>{user ? `Synced to ${user.email}` : "Saved on this device"}</div>
        </footer>
      </div>
    </div>
  );
}

export default DecisionMatrix;