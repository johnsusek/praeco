import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
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

  //base: process.env.VITE_BASE_URL || '/',
  base: env.VITE_BASE_URL || '/',
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
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          // Vue
          if (id.includes('vue-router')) return 'vue-router'
          if (id.includes('vue')) return 'vue'

          // Element Plus
          if (id.includes('element-plus')) return 'element-plus'

          // Charts
          if (
            id.includes('echarts') ||
            id.includes('vue-echarts') ||
            id.includes('zrender')
          ) {
            return 'charts'
          }

          // Utils
          if (
            id.includes('axios') ||
            id.includes('lodash') ||
            id.includes('dayjs') ||
            id.includes('js-yaml') ||
            id.includes('validator') ||
            id.includes('semver') ||
            id.includes('change-case')
          ) {
            return 'utils'
          }

          // Editor
          if (
            id.includes('prismjs') ||
            id.includes('vue-prism-component')
          ) {
            return 'editor'
          }

          // FontAwesome
          if (id.includes('@fortawesome')) {
            return 'icons'
          }

          return 'vendor'
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
}})