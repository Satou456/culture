import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  build: {
    // 启用代码压缩
    minify: 'terser',
    // 配置terser选项
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // 配置资源优化
    assetsDir: 'assets',
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 配置缓存策略
    rollupOptions: {
      output: {
        // 配置静态资源的缓存策略
        manualChunks: {
          // 将第三方库打包到单独的chunk中
          vendor: ['vue', 'vue-router', 'axios'],
          // 将Element Plus打包到单独的chunk中
          element: ['element-plus']
        },
        // 配置文件名哈希，用于缓存
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]'
      }
    }
  }
})
