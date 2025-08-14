import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
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