import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true, // Impedisce a Vite di cambiare porta se la 5173 è occupata
  },
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Raggruppa gli strumenti di base per un avvio rapido dell'app
          if (['react', 'react-dom', 'react-router-dom', '@mui/material', 'firebase'].some(pkg => id.includes(`node_modules/${pkg}`))) {
            return 'vendor';
          }
          // Isola il generatore PDF in un file separato e indipendente
          if (id.includes('node_modules/@react-pdf/renderer')) {
            return 'pdf';
          }
        }
      }
    }
  }
})
