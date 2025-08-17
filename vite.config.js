import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import { resolve } from 'path';

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
        rewrite: (path) => path.replace(/^\/api-app\/releases/, ''),
      },
      '/api-ws/test': {
        target: 'http://localhost:3333/',
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-ws\/test/, '/test'),
      },
      '/api': {
        target: 'http://localhost:3030/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Increase chunk size warning limit to 1MB to reduce noise
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // Manual chunks configuration for better code splitting
        manualChunks: (id) => {
          // Vue core libraries
          if (
            (id.includes('vue') && !id.includes('src/')) ||
            id.includes('vue-router') ||
            id.includes('vuex')
          ) {
            return 'vue-vendor';
          }
          // UI framework
          if (id.includes('element-ui')) {
            return 'element-ui';
          }
          // Charts and visualization
          if (
            id.includes('echarts') ||
            id.includes('vue-echarts') ||
            id.includes('zrender')
          ) {
            return 'charts';
          }
          // Utilities and other dependencies
          if (
            id.includes('axios') ||
            id.includes('lodash.clonedeep') ||
            id.includes('lodash.get') ||
            id.includes('lodash.throttle') ||
            id.includes('dayjs') ||
            id.includes('js-yaml') ||
            id.includes('validator') ||
            id.includes('semver') ||
            id.includes('change-case')
          ) {
            return 'utils';
          }
          // Editor and syntax highlighting
          if (id.includes('prismjs') || id.includes('vue-prism-component')) {
            return 'editor';
          }
          // Font icons
          if (
            id.includes('@fortawesome/fontawesome-svg-core') ||
            id.includes('@fortawesome/free-solid-svg-icons') ||
            id.includes('@fortawesome/free-regular-svg-icons') ||
            id.includes('@fortawesome/free-brands-svg-icons')
          ) {
            return 'icons';
          } // Separate specialized components
          if (
            id.includes('vue-json-pretty') ||
            id.includes('vue-at') ||
            id.includes('emoji-mart-vue-fast') ||
            id.includes('@vue-js-cron/light') ||
            id.includes('splitpanes')
          ) {
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
          if (
            id.includes('src/router.js') ||
            id.includes('src/main.js') ||
            id.includes('src/contrib.js') ||
            id.includes('src/registration.js')
          ) {
            return 'app-core';
          }
        },
      },
    },
  },

  // Environment variables - make process.env available for compatibility
  define: {
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || 'production'
    ),
    'process.env.LATER_COV': JSON.stringify(process.env.LATER_COV || false),
  },

  // CSS preprocessor options
  css: {
    preprocessorOptions: {
      scss: {
        // Silence deprecation warnings from element-ui and legacy Sass usage
        silenceDeprecations: [
          'legacy-js-api',
          'import',
          'global-builtin',
          'slash-div',
          'function-units',
          'bogus-combinators',
        ],
      },
    },
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
      'vue-echarts',
    ],
    // Exclude problematic packages that need special handling
    exclude: [],
  },
});
