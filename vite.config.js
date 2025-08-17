import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Icons from 'unplugin-icons/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue(),
    Icons(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  root: '.',
  publicDir: 'public',
  base: process.env.VUE_APP_BASE_URL || '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  define: {
    'process.env.LATER_COV': 'false',
  },
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
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500, // Increase warning limit to 1.5MB (from default 500KB)
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separate Vue ecosystem
          if (id.includes('vue') && !id.includes('src/') || 
              id.includes('vue-router') || 
              id.includes('vuex')) {
            return 'vue-vendor';
          }
          
          // Separate Element Plus UI library
          if (id.includes('element-plus')) {
            return 'element-plus';
          }
          
          // Separate charts libraries (echarts is large)
          if (id.includes('echarts') || 
              id.includes('vue-echarts') || 
              id.includes('zrender')) {
            return 'charts';
          }
          
          // Separate FontAwesome (multiple icon packages)
          if (id.includes('@fortawesome/')) {
            return 'fontawesome';
          }
          
          // Separate utility libraries
          if (id.includes('lodash.clonedeep') ||
              id.includes('lodash.get') ||
              id.includes('lodash.throttle') ||
              id.includes('js-yaml') ||
              id.includes('dayjs') ||
              id.includes('axios') ||
              id.includes('semver') ||
              id.includes('validator')) {
            return 'utilities';
          }
          
          // Separate code editing/syntax highlighting
          if (id.includes('prismjs') || 
              id.includes('vue-prism-component')) {
            return 'editor';
          }
          
          // Separate specialized components
          if (id.includes('vue-json-pretty') ||
              id.includes('vue-at') ||
              id.includes('emoji-mart-vue-fast') ||
              id.includes('@vue-js-cron/light') ||
              id.includes('splitpanes')) {
            return 'components';
          }
          
          // Application-specific chunking
          // Separate main application views/pages
          if (id.includes('src/views/')) {
            return 'app-views';
          }
          
          // Separate config-related components (largest part of the app)
          if (id.includes('src/components/config/')) {
            return 'app-config';
          }
          
          // Separate Vuex store modules
          if (id.includes('src/store/')) {
            return 'app-store';
          }
          
          // Separate other common components
          if (id.includes('src/components/')) {
            return 'app-components';
          }
          
          // Keep router and main entry separate
          if (id.includes('src/router.js') || 
              id.includes('src/main.js')) {
            return 'app-core';
          }
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['tests/unit/setup.js']
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "sass:math";`
      }
    }
  }
});