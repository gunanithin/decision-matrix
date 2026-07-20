import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: {
      provider: 'v8',
      exclude: [
        'src/firebase.js',
        'src/hooks/**',
        'src/main.jsx',
        'src/App.jsx', // Excluded from unit-test coverage thresholds due to integration nature
        '**/.eslintrc.cjs',
        '**/dist/**',
        'functions/**',
        'public/**'
      ],
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 95,
        statements: 95
      }
    }
  }
})
