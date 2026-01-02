import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/",  
  plugins: [react()],
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
})
