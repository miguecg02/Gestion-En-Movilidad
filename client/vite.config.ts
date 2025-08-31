import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
     rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html') // Especifica entrada HTML
      }
    }
  },
  
  esbuild: {
    loader: 'tsx'
  }
})