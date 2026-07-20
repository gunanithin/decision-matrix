# Decision Matrix PWA

A sleek, modern Eisenhower Matrix Progressive Web Application (PWA) built with modern UI styling, offline-first support, Google Authentication, real-time Cloud Firestore sync, and scheduled Web Push notifications.

Designed to help you prioritize tasks using the Eisenhower Matrix framework:
- **Do First** (Urgent & Important)
- **Schedule** (Important, Not Urgent)
- **Delegate** (Urgent, Not Important)
- **Don't Do** (Neither Urgent Nor Important)

---

## 🚀 Key Features

### 📅 Task Scheduling & Date/Time Pickers
* **Dynamic Fields:** Optional Date and Time pickers for **Schedule** and **Delegate** tasks.
* **Metadata Badges:** Visual calendar indicators (`📅 YYYY-MM-DD ⏰ HH:MM`) rendered on scheduled task cards.
* **Timezone Synchronization:** Automatically captures your device's timezone (e.g., `Asia/Kolkata`) and syncs it to Firestore so reminders trigger at your exact local time.

### 🔔 Native Web Push Notifications (Firebase Cloud Messaging)
* **Zero Passwords & 100% Free:** Completely passwordless Web Push architecture using Firebase Cloud Messaging (FCM).
* **Scheduled Worker:** A background 5-minute Cloud Function (`checkNotifications`) evaluates task deadlines and delivers native push notifications to your phone or desktop even when the app is closed.
* **Smart Alert Triggers:**
  * **Schedule Tasks:** 15-minute prior warning, on-time alert, and daily repeating overdue reminders.
  * **Delegate Tasks:** 1-day prior warning and daily repeating overdue reminders.
  * **Do First Tasks:** Daily 7:00 PM summary digest of uncompleted tasks.

### 🔄 Real-Time Firebase Sync
* **Instant Cloud Sync:** Tasks sync with **Cloud Firestore** whenever you are logged in.
* **Debounced Writes:** Cloud writes are debounced (500ms delay) to save database write quotas.

### 📶 Offline-First & Privacy
* **Local Fallback:** Tasks are saved to `localStorage` instantly before any network request.
* **Privacy & Isolation:** Firestore Security Rules ensure that your tasks are strictly isolated to your own Google account UID.

### 📱 PWA Features
* **Installable:** Installs directly to your home screen on iOS, Android, or desktop.
* **Service Worker Caching:** Caches essential scripts, styles, and push notification handlers for instant loading offline.

---

## 🛠️ Project Structure

```
decision-matrix/
├── index.html            # UI layout, React components, and FCM token handler
├── manifest.json         # PWA Manifest for installation rules
├── service-worker.js     # Service worker caching and background push listener
├── package.json          # Root scripts (npm start / npm run dev)
├── firebase.json         # Firebase Cloud Functions configuration
├── .firebaserc           # Active Firebase project reference
├── .gitignore            # Excludes node_modules and debug logs
└── functions/            # Scheduled Cloud Function codebase
    ├── index.js          # 5-minute scheduled checkNotifications function
    └── package.json      # Node.js 20/22 Cloud Function dependencies
```

---

## 💻 Local Development

Start the local preview server:

```bash
npm start
# or
npm run dev
```

Then open your browser at **`http://localhost:8000`**.

---

## ☁️ Deploying Cloud Functions

To deploy the background notification worker:

```bash
# 1. Log in to Firebase CLI
npx -y firebase-tools@latest login

# 2. Deploy Cloud Functions
npx -y firebase-tools@latest deploy --only functions
```
