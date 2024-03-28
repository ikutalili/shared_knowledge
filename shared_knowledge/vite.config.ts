import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  optimizeDeps:{
    include:['quill']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server:{
    // 带选项写法：http://localhost:5173/api/bar -> http://jsonplaceholder.typicode.com/bar
    proxy:{
      '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
    }
    
  }
})
