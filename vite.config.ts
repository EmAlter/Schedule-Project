import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true,
  },
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (['react', 'react-dom', 'react-router-dom', '@mui/material', 'firebase'].some(pkg => id.includes(`node_modules/${pkg}`))) {
            return 'vendor';
          }
          if (id.includes('node_modules/@react-pdf/renderer')) {
            return 'pdf';
          }
        }
      }
    }
  }
})
