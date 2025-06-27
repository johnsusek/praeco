import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { resolve } from 'path'

export default defineConfig({
  plugins: [createVuePlugin()],
  
  // Equivalent to publicPath in vue.config.js
  base: process.env.VITE_BASE_URL || '/',
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  
  // Development server configuration
  server: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api-app/releases': {
        target: 'https://api.github.com/repos/johnsusek/praeco/releases',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-app\/releases/, '')
      },
      '/api-ws/test': {
        target: 'http://localhost:3333/',
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-ws\/test/, '/test')
      },
      '/api': {
        target: 'http://localhost:3030/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      // Handle externals and globals if needed
    }
  },
  
  // Environment variables - make process.env available for compatibility
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'process.env.LATER_COV': JSON.stringify(process.env.LATER_COV || false),
  },
  
  // CSS preprocessor options
  css: {
    preprocessorOptions: {
      scss: {
        // Remove additionalData if variables.scss doesn't exist
      }
    }
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'vuex',
      'axios',
      'element-ui',
      'echarts',
      'vue-echarts'
    ],
    // Exclude problematic packages that need special handling
    exclude: []
  }
})