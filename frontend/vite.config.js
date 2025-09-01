import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()
  ],
  server: {
    proxy: {
      // String shorthand: http://localhost:5173/api -> http://localhost:5000/api
      '/api': 'http://localhost:5000',
    }
  },
  test: {
    environment: "jsdom",          // Simulates browser DOM
    globals: true,                 // Use global `test`, `expect`, etc.
    setupFiles: "./src/components/__tests__/BestSellers.js", // Run before each test
  },


})
