import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // Use 'jsdom' as the test environment
    environment: 'jsdom',
    // Enable globals like 'describe' and 'it' so you don't have to import them
    globals: true,
    // A setup file to run before each test file
    setupFiles: './test/setupTests.js',
     include: ['test/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },
});