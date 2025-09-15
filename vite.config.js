import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { resolve } from 'path'

export default defineConfig({
  plugins: [createVuePlugin()],
  
  // Equivalent to publicPath in vue.config.js
  base: process.env.VITE_BASE_URL || '/',
  
  resolve: {
    extensions: ['.js', '.vue', '.jsx', 'tsx', '.json'],
    alias: {
      '@': resolve(__dirname, 'src'),
       "vue": "vue/dist/vue.runtime.esm.js",
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
    // Increase chunk size warning limit to 1MB to reduce noise
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunks configuration for better code splitting
        manualChunks: {
          // Vue core libraries
          'vue-vendor': ['vue', 'vue-router', 'vuex'],
          // UI framework
          'element-ui': ['element-ui'],
          // Charts and visualization
          'charts': ['echarts', 'vue-echarts', 'zrender'],
          // Utilities and other dependencies
          'utils': [
            'axios', 'lodash.clonedeep', 'lodash.get', 'lodash.throttle',
            'dayjs', 'js-yaml', 'validator', 'semver', 'change-case'
          ],
          // Editor and syntax highlighting
          'editor': ['prismjs', 'vue-prism-component'],
          // Font icons
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
  
  // Environment variables - make process.env available for compatibility
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'process.env.LATER_COV': JSON.stringify(process.env.LATER_COV || false),
  },
  
  // CSS preprocessor options
  css: {
    preprocessorOptions: {
      scss: {
        // Silence deprecation warnings from element-ui and legacy Sass usage
        silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'slash-div', 'function-units', 'bogus-combinators']
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