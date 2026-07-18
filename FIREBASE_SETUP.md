# Firebase Integration & Deployment Guide — Decision Matrix PWA

This document provides a complete summary of the setup, configuration, and troubleshooting steps taken to integrate Firebase authentication and real-time database sync into the Decision Matrix PWA.

---

## 1. Project Directory Structure
The local repository was scaffolded and initialized under:
`/Users/gunanithin/.gemini/antigravity-ide/scratch/decision-matrix`

```
decision-matrix/
├── index.html            # Main React + Babel PWA interface with Firebase Integration
├── manifest.json         # PWA Manifest configuration
├── service-worker.js     # Basic offline caching service worker
├── icon-180.png          # App icon (180x180)
├── icon-192.png          # App icon (192x192)
├── icon-512.png          # App icon (512x512)
├── icon-512-maskable.png # App icon maskable (512x512)
└── README.md             # Repository description
```

---

## 2. Firebase Console Setup

To configure the backend, the following steps were performed in the [Firebase Console](https://console.firebase.google.com/):

### A. Project Creation
- Created a project named `decision-matrix`.
- Disabled Google Analytics (as it is not required for this local/personal utility).

### B. Authentication Settings
- Enabled the **Google Sign-In** provider under **Build** → **Authentication** → **Sign-in method**.
- Configured **Authorized Domains** under **Authentication** → **Settings** → **Authorized domains**:
  - Added `gunanithin.github.io` to trust authentication requests originating from your GitHub Pages URL.
  - `localhost` is trusted by default for local testing.

### C. Cloud Firestore Database Setup
- Created a Firestore Database in **Production Mode**.
- Set up security rules (under the **Rules** tab) to ensure that users can only access their own data:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /users/{userId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
  ```

### D. Web App Registration
- Registered a Web App (`decision-matrix-web`) inside the project settings to acquire the SDK credentials (`FIREBASE_CONFIG`).

---

## 3. Implementation Details & Issue Resolution

### A. Firebase Config Placement
The keys retrieved from the console were replaced inside the `FIREBASE_CONFIG` object in `index.html`:
```js
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCT2PbLfaZpVy-MBU6S97yTkTnH_oD7yNo",
  authDomain: "eisenhower-decision-matrix.firebaseapp.com",
  projectId: "eisenhower-decision-matrix",
  storageBucket: "eisenhower-decision-matrix.firebasestorage.app",
  messagingSenderId: "1011365477842",
  appId: "1:1011365477842:web:089b2170eacee611589c0b",
  measurementId: "G-G77XP9E7Z9"
};
```

### B. Troubleshooting Sign-In: Redirect vs Popup
- **Issue**: Google Sign-In failed to persist credentials when using `signInWithRedirect`. After choosing an account, the user returned to the page still signed out.
- **Root Cause**: Modern browser security features (like Chrome's partitioned storage and cookie restrictions) prevent the session state from being successfully shared/retrieved after a full-page redirect unless complex first-party setup is done. Additionally, running on local `file://` protocols blocks redirect auth completely.
- **Resolution**: Updated the code to use **`signInWithPopup`** instead of `signInWithRedirect`.
  ```javascript
  const signIn = () => {
    if (!firebaseReady) return;
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((result) => {
        setUser(result.user);
      })
      .catch((e) => console.error("popup sign-in error", e));
  };
  ```

---

## 4. GitHub Deployment Commands

To deploy the app and update the live page, the following sequence was used:

```bash
# 1. Initialize remote origin (Done once)
git remote add origin https://github.com/gunanithin/decision-matrix.git
git branch -M main

# 2. Push initial files (Done once)
git push -u origin main

# 3. Commit and push the updated Firebase configuration & popup login patch
git add index.html
git commit -m "Switch to signInWithPopup for browser cookie compatibility"
git push
```

### Tracking the pipeline:
The live pipeline runs under the **Actions** tab of your GitHub repository. Once complete, the site is live at:
`https://gunanithin.github.io/decision-matrix/`

---

## 5. API Key Security Guidelines (Optional Enhancement)

Firebase API Keys are meant to be public, but to prevent unauthorized websites from consuming your Firebase quota, you can restrict your key:
1. Go to [GCP Credentials](https://console.cloud.google.com/apis/credentials).
2. Click your API key.
3. Under **Website restrictions**, set it to only allow referrers matching:
   - `https://gunanithin.github.io/*`
   - `http://localhost/*` (for testing)
4. Save the restriction.
