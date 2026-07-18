# Decision Matrix PWA

A sleek, responsive Eisenhower Matrix Personal Web Application (PWA) with offline-first support, Google Authentication, and real-time cloud synchronization.

Designed to help you prioritize tasks using the Eisenhower Matrix framework:
- **Do First** (Urgent & Important)
- **Schedule** (Important but Not Urgent)
- **Delegate** (Urgent but Not Important)
- **Don't Do** (Not Urgent & Not Important)

---

## Key Features

### 🔄 Real-Time Firebase Sync
Tasks are synchronized automatically with **Cloud Firestore** whenever you are logged in. 
* **Seamless Syncing**: Changes made on one device (adding, removing, or toggling tasks) reflect instantly on all other logged-in screens.
* **Debounced Writes**: Cloud writes are debounced (500ms delay) to save database write quotas and limit network requests.

### 📶 Offline-First Design
The app is built to work reliably even without an internet connection:
* **Local Fallback**: Tasks are saved to `localStorage` instantly before any network request is attempted.
* **Resilient Sync**: If you are offline while editing, tasks are cached locally. Sync automatically resumes as soon as you reconnect.

### 🔐 Google Authentication & Privacy
Built with Firebase Auth using `signInWithPopup` for broad browser compatibility (handling Cookie and storage restrictions):
* **Private and Secure**: Standard Cloud Firestore Security Rules ensure that your tasks are strictly isolated to your own Google account UID. Other users opening the application will only see their own empty tracker.
* **Zero-Configuration Client**: All API access security is verified server-side on Google's infrastructure.

### 📱 PWA Features
* **Installable**: Installs directly to your home screen on iOS, Android, or desktop.
* **Offline Access**: Uses a service worker to cache essential scripts and styles, making it load instantly in low-network conditions.

---

## Project Structure

```
decision-matrix/
├── index.html            # Core HTML5, CSS layout, and React components
├── manifest.json         # PWA Manifest for installation rules
├── service-worker.js     # Caches assets for offline-first support
├── FIREBASE_SETUP.md     # Detailed documentation on backend setup & GCP security
└── icon-*.png            # App launcher icons for multiple viewport sizes
```

---

## Technical Details

* **Frontend**: React 18 & Babel (served entirely client-side via CDN)
* **Styling**: Modern, responsive dark-themed HSL CSS
* **Backend**: Firebase Compatibility SDK (v12) for Authentication and Firestore

For detailed instructions on configuring the Firebase Console, deploying to GitHub Pages, or setting up API restrictions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).
