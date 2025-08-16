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
        manualChunks: {
          // Separate Vue ecosystem
          'vue-vendor': ['vue', 'vue-router', 'vuex'],
          
          // Separate Element Plus UI library
          'element-plus': ['element-plus'],
          
          // Separate charts libraries (echarts is large)
          'charts': ['echarts', 'vue-echarts', 'zrender'],
          
          // Separate FontAwesome (multiple icon packages)
          'fontawesome': [
            '@fortawesome/fontawesome-svg-core',
            '@fortawesome/free-brands-svg-icons', 
            '@fortawesome/free-regular-svg-icons',
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/vue-fontawesome'
          ],
          
          // Separate utility libraries
          'utilities': [
            'lodash.clonedeep',
            'lodash.get', 
            'lodash.throttle',
            'js-yaml',
            'dayjs',
            'axios',
            'semver',
            'validator'
          ],
          
          // Separate code editing/syntax highlighting
          'editor': ['prismjs', 'vue-prism-component'],
          
          // Separate specialized components
          'components': [
            'vue-json-pretty',
            'vue-at',
            'emoji-mart-vue-fast',
            '@vue-js-cron/light',
            'splitpanes'
          ]
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