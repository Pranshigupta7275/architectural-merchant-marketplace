import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // 🔥 This tells Vite to forward API requests to your Express backend
      '/api': {
        target: 'http://localhost:5000', // Change 5000 if your backend uses a different port!
        changeOrigin: true,
      },
      // If you serve uploaded images from your backend, you might need this too:
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})