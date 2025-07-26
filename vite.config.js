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