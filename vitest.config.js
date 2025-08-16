import { defineConfig } from 'vitest/config'
import { createVuePlugin } from 'vite-plugin-vue2'
import { resolve } from 'path'

export default defineConfig({
  plugins: [createVuePlugin()],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  
  // Test configuration for Vitest
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['tests/unit/setup.js'],
    include: ['tests/unit/specs/**/*.spec.js'],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.{js,vue}'],
      exclude: [
        'src/*.js',
        'src/router/index.js',
        'src/store/index.js'
      ]
    }
  }
})