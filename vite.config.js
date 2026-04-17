import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import {resolve} from 'path'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build:{
    rollupOptions:{
      input:{
        main: resolve(__dirname, 'index.html'),
        success: resolve(__dirname, 'success.html'),
        cancel: resolve(__dirname, 'cancel.html'),
        orders: resolve(__dirname, 'orders.html')
      }
    }
  },
  server:{
    proxy:{
      '/confirm': 'http://localhost:3000'
    }
  }
})