import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Redirect all 404s back to index.html for client-side routing (SPA fallback)
    historyApiFallback: true,
  }
})
