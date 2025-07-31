import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  root: resolve(__dirname, 'client'), // Point to client directory
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, 'client/dist'), // Full path to dist
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'client/index.html') // Full path to HTML
      }
    }
  }
})