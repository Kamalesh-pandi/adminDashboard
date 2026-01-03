import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://16.171.10.128:8081',
        changeOrigin: true,
        secure: false,
        headers: {
          Origin: 'http://16.171.10.128:8081',
        },
      },
    },
  },
  preview: {
    port: 4173,
    strictPort: false,
  },
})
