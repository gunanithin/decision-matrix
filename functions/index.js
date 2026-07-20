const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Helper to parse timezone and get local time elements
function getLocalTimeElements(timezone) {
  const d = new Date();
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
    
    const parts = formatter.formatToParts(d).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    
    return {
      dateString: `${parts.year}-${parts.month}-${parts.day}`, // YYYY-MM-DD
      hour: parseInt(parts.hour, 10),
      minute: parseInt(parts.minute, 10),
      timestamp: d.getTime()
    };
  } catch (e) {
    console.error(`Invalid timezone "${timezone}", falling back to UTC`, e);
    return {
      dateString: d.toISOString().split("T")[0],
      hour: d.getUTCHours(),
      minute: d.getUTCMinutes(),
      timestamp: d.getTime()
    };
  }
}

exports.checkNotifications = functions.pubsub.schedule("every 5 minutes").onRun(async (context) => {
  const db = admin.firestore();
  const usersSnap = await db.collection("users").get();
  
  for (const userDoc of usersSnap.docs) {
    const userData = userDoc.data();
    const userTasks = userData.tasks || [];
    const userId = userDoc.id;
    const userTimezone = userData.timezone || "Asia/Kolkata";
    
    const local = getLocalTimeElements(userTimezone);
    const todayDateStr = local.dateString;
    
    let updatedTasks = false;
    const tasksToNotify = [];
    const doFirstUndoneTasks = [];
    
    userTasks.forEach((task) => {
      if (task.done) return;
      
      if (!task.notificationsScheduled) {
        task.notificationsScheduled = {};
      }
      
      // ─── Do First (Urgent & Important) ─────────────────────────
      if (task.quadrant === "do") {
        doFirstUndoneTasks.push(task);
      }
      
      // ─── Schedule (Important, Not Urgent) ──────────────────────
      if (task.quadrant === "decide" && task.dueDate && task.dueTime) {
        try {
          const [dueYr, dueMth, dueDay] = task.dueDate.split("-").map(Number);
          const [dueHr, dueMin] = task.dueTime.split(":").map(Number);
          
          const isToday = (task.dueDate === todayDateStr);
          const localMinutes = local.hour * 60 + local.minute;
          const dueMinutes = dueHr * 60 + dueMin;
          
          // 1. 15-minute warning:
          if (isToday && (dueMinutes - localMinutes >= 10 && dueMinutes - localMinutes <= 16)) {
            if (!task.notificationsScheduled.prior15m) {
              tasksToNotify.push({
                type: "Schedule: 15-min Warning",
                details: `Reminder: "${task.text}" starts in 15 minutes (at ${task.dueTime}).`
              });
              task.notificationsScheduled.prior15m = true;
              updatedTasks = true;
            }
          }
          
          // 2. On time notification:
          if (isToday && (localMinutes >= dueMinutes && localMinutes - dueMinutes < 10)) {
            if (!task.notificationsScheduled.onTime) {
              tasksToNotify.push({
                type: "Schedule: Due Now",
                details: `Alert: "${task.text}" is scheduled for now (${task.dueTime}).`
              });
              task.notificationsScheduled.onTime = true;
              updatedTasks = true;
            }
          }
          
          // 3. Overdue repeating notifications:
          const isOverdue = (task.dueDate < todayDateStr) || (isToday && localMinutes - dueMinutes >= 10);
          if (isOverdue) {
            if (local.hour === dueHr && local.minute < 10) {
              if (task.notificationsScheduled.lastDailyAlertDate !== todayDateStr) {
                tasksToNotify.push({
                  type: "Schedule: Overdue Reminder",
                  details: `Reminder: "${task.text}" is overdue. Scheduled: ${task.dueDate} at ${task.dueTime}.`
                });
                task.notificationsScheduled.lastDailyAlertDate = todayDateStr;
                updatedTasks = true;
              }
            }
          }
        } catch (e) {
          console.error(`Error processing scheduled task ${task.id}:`, e);
        }
      }
      
      // ─── Delegate (Urgent, Not Important) ──────────────────────
      if (task.quadrant === "delegate" && task.dueDate) {
        try {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const formatter = new Intl.DateTimeFormat("en-US", { timeZone: userTimezone, year: "numeric", month: "2-digit", day: "2-digit" });
          const parts = formatter.formatToParts(tomorrow).reduce((acc, part) => { acc[part.type] = part.value; return acc; }, {});
          const tomorrowDateStr = `${parts.year}-${parts.month}-${parts.day}`;
          
          const isTomorrow = (task.dueDate === tomorrowDateStr);
          if (isTomorrow && local.hour === 9 && local.minute < 10) {
            if (!task.notificationsScheduled.prior1d) {
              tasksToNotify.push({
                type: "Delegate: 1-Day Prior",
                details: `Reminder: "${task.text}" is due tomorrow (${task.dueDate}).`
              });
              task.notificationsScheduled.prior1d = true;
              updatedTasks = true;
            }
          }
          
          const isOverdue = (task.dueDate < todayDateStr);
          if (isOverdue && local.hour === 9 && local.minute < 10) {
            if (task.notificationsScheduled.lastDailyAlertDate !== todayDateStr) {
              tasksToNotify.push({
                type: "Delegate: Overdue Reminder",
                details: `Reminder: "${task.text}" is overdue. Due date was: ${task.dueDate}.`
              });
              task.notificationsScheduled.lastDailyAlertDate = todayDateStr;
              updatedTasks = true;
            }
          }
        } catch (e) {
          console.error(`Error processing delegated task ${task.id}:`, e);
        }
      }
    });
    
    // ─── Do First Daily 7:00 PM Summary ──────────────────────────
    if (local.hour === 19 && local.minute < 10) {
      if (userData.last7pmSummaryDate !== todayDateStr) {
        if (doFirstUndoneTasks.length > 0) {
          tasksToNotify.push({
            type: "Do First: Daily Digest",
            details: `You have ${doFirstUndoneTasks.length} pending "Do First" tasks remaining today:\n` + 
                     doFirstUndoneTasks.map(t => `- ${t.text}`).join("\n")
          });
        }
        await db.collection("users").doc(userDoc.id).set({
          last7pmSummaryDate: todayDateStr
        }, { merge: true });
      }
    }
    
    // ─── Send Push Notifications via FCM ──────────────────────────────
    if (tasksToNotify.length > 0) {
      let tokens = [];
      if (Array.isArray(userData.fcmTokens) && userData.fcmTokens.length > 0) {
        tokens = userData.fcmTokens;
      } else if (userData.fcmToken) {
        tokens = [userData.fcmToken];
      }

      if (tokens.length > 0) {
        for (const n of tasksToNotify) {
          for (const token of tokens) {
            try {
              await admin.messaging().send({
                token: token,
                notification: {
                  title: n.type,
                  body: n.details
                },
                webpush: {
                  fcmOptions: {
                    link: "https://gunanithin.github.io/decision-matrix/"
                  },
                  notification: {
                    icon: "https://gunanithin.github.io/decision-matrix/icon-192.png",
                    badge: "https://gunanithin.github.io/decision-matrix/icon-180.png"
                  }
                }
              });
              console.log(`Successfully sent FCM push notification "${n.type}" to user ${userId}`);
            } catch (pushErr) {
              console.error(`Error sending FCM push to token for user ${userId}:`, pushErr);
              if (pushErr.code === "messaging/invalid-registration-token" || 
                  pushErr.code === "messaging/registration-token-not-registered") {
                await db.collection("users").doc(userDoc.id).update({
                  fcmTokens: admin.firestore.FieldValue.arrayRemove(token),
                  fcmToken: admin.firestore.FieldValue.delete()
                }).catch(() => {});
              }
            }
          }
        }
      } else {
        console.log(`[NO FCM TOKENS] User ${userId} has no registered FCM Push tokens.`);
      }
    }
    
    // Save updated notification status flags
    if (updatedTasks) {
      await db.collection("users").doc(userDoc.id).set({
        tasks: userTasks,
        updatedAt: Date.now()
      }, { merge: true });
      console.log(`Updated notification state flags for user ${userId}`);
    }
  }
});
