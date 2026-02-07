import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // Forward everything starting with /api to your backend
      '/api': {
        target: 'http://localhost:5000',   // ← CHANGE THIS to your real backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // ────────────────────────────────────────────────
})