# Eisenhower Decision Matrix

A modern, fast, and responsive Eisenhower Matrix application. This app helps you prioritize your tasks by categorizing them into four quadrants based on urgency and importance.

## Features

- **Four Quadrants**: Categorize tasks into Do First, Schedule, Delegate, and Don't Do.
- **Real-time Sync**: Firebase Firestore integration keeps your tasks synced across devices instantly.
- **Authentication**: Secure Google Sign-In via Firebase Auth.
- **Smart Scheduling**: Seamless integration with Flatpickr for selecting due dates and times.
- **Push Notifications**: Native desktop and mobile push notifications for due tasks using Firebase Cloud Messaging.
- **Responsive Design**: Mobile-first design that looks great on all device sizes.

## Tech Stack

- **Frontend Framework**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend & Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Push Notifications**: [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- **Testing**: [Vitest](https://vitest.dev/) & React Testing Library
- **Styling**: Vanilla CSS for maximum flexibility

## Getting Started Locally

### Prerequisites
Make sure you have Node.js (v20+) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gunanithin/decision-matrix.git
   cd decision-matrix
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Development Server

Run the local Vite development server:
```bash
npm run dev
```
Your app will be available at `http://localhost:5173`.

### Testing

The project uses a **Test-Driven Development (TDD)** approach with Vitest and React Testing Library. 

In TDD, tests are written *before* the actual code. This ensures that every piece of logic is fully tested and robust by design. 

**TDD Workflow:**
1. Write a failing test for a new feature or component.
2. Run `npm run test` (watch mode) and see the test fail.
3. Write the minimal code necessary to make the test pass.
4. Refactor the code while ensuring tests remain green.

> [!IMPORTANT]
> The continuous integration pipeline strictly enforces a **95% code coverage threshold** (for lines, functions, branches, and statements). Any new code must maintain or exceed this coverage to pass the automated tests.

```bash
# Run tests in watch mode (ideal for the TDD loop)
npm run test

# Run tests once with a full coverage report (to check against the 95% threshold)
npm run test -- --run --coverage
```
