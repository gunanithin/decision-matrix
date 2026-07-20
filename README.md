# Eisenhower Decision Matrix

A modern, fast, and responsive Eisenhower Matrix application built with **React**, **Vite**, and **Firebase**. 
This app helps you prioritize your tasks by categorizing them into four quadrants based on urgency and importance.

## Features

- **Four Quadrants**: Do First, Schedule, Delegate, and Don't Do.
- **Real-time Sync**: Firebase Firestore integration keeps your tasks synced across devices instantly.
- **Smart Scheduling**: Seamless integration with Flatpickr for selecting due dates and times.
- **Modern Stack**: Built with Vite for ultra-fast HMR and optimized production builds.
- **Comprehensive Testing**: Enforced 95% test coverage using Vitest and React Testing Library.
- **Automated CI/CD**: Vercel handles all deployments automatically via GitHub integration.

## Getting Started

### Prerequisites
Make sure you have Node.js (v20+) installed.

### Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### Development Server
Run the local Vite development server:
```bash
npm run dev
```
Your app will be available at `http://localhost:5173`.

### Testing (TDD)
We use Vitest for unit and integration testing. The CI pipeline strictly enforces a **95% coverage threshold**.
```bash
# Run tests in watch mode (ideal for TDD)
npm run test

# Run tests once with a full coverage report
npm run test -- --run --coverage
```

## Deployment
This app is designed to be deployed to **Vercel** for optimal performance, robust security, and free global hosting.

1. Create a free account at [Vercel.com](https://vercel.com/).
2. Click **Add New... > Project** and link your GitHub account.
3. Select this repository from the list.
4. Vercel will automatically detect that this is a **Vite** project. Leave the default settings (Build command: `npm run build`, Output directory: `dist`).
5. Click **Deploy**.

Vercel will automatically provision a secure `.vercel.app` domain with an SSL certificate. Whenever you push to the `main` branch, Vercel will auto-deploy your updates instantly.
