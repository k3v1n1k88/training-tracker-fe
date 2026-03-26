import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        // target: 'https://e1d2-1-53-255-147.ngrok-free.app',
        changeOrigin: true,
      },
    },
  },
})
