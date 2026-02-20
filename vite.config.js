import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),

    // Vue API auto import
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: true,
      resolvers: [ElementPlusResolver()],
    }),

    // Element Plus components auto import
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],

  base: process.env.VITE_BASE_URL || '/',

  resolve: {
    extensions: ['.js', '.vue', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': resolve(__dirname, 'src'),
    },
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
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vue3
          'vue-vendor': ['vue', 'vue-router'],

          // Element Plus
          'element-plus': ['element-plus'],

          // Charts
          'charts': ['echarts', 'vue-echarts', 'zrender'],

          // Utils
          'utils': [
            'axios', 'lodash.clonedeep', 'lodash.get', 'lodash.throttle',
            'dayjs', 'js-yaml', 'validator', 'semver', 'change-case'
          ],

          'editor': ['prismjs', 'vue-prism-component'],

          'icons': [
            '@fortawesome/fontawesome-svg-core',
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/free-regular-svg-icons',
            '@fortawesome/free-brands-svg-icons',
            '@fortawesome/vue-fontawesome'
          ]
        }
      }
    }
  },

  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'process.env.LATER_COV': JSON.stringify(process.env.LATER_COV || false),
  },

  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'axios',
      'element-plus',
      'echarts',
      'vue-echarts'
    ]
  }
})