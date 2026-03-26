import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    base: env.VITE_BASE_PATH || '/',
    build: {
      outDir: env.VITE_BUILD_OUT_DIR || 'dist',
    },
    server: {
      port: Number(env.VITE_DEV_PORT) || 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8001',
          changeOrigin: true,
        },
      },
    },
  }
})
