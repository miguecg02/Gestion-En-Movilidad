import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  root: path.resolve(__dirname, 'client'), // Set root to client directory
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, 'dist'), // Output to root/dist
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'client/index.html') // Correct HTML path
      }
    }
  }
})