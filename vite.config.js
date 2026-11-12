import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// One HTML entry per page and language; the <html lang> attribute decides which content file loads.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        repositories: 'repozitare/index.html',
        en: 'en/index.html',
        enRepositories: 'en/repositories/index.html',
      },
    },
  },
})
