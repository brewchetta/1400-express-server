import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      context: "/src/context",
      assets: "/src/assets",
      async: "/src/async",
      data: "/src/data",
      hooks: "/src/hooks",
      'router-pages': "/src/router-pages",
      shared: "/src/shared",
      style: "/src/style",
      utilities: "/src/utilities",
      utils: "/src/utils"
    }
  },
  server: {
    proxy: {
      '/api': "http://localhost:5000"
    },
  }
})
