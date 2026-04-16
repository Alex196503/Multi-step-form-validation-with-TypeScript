import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server:{
    proxy:{
      '/confirm': 'http://localhost:3000'
    }
  }
})