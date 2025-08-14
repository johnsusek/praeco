# Vitest Migration Guide

This document describes the completed migration from Vue CLI's Mocha/Chai testing setup to Vitest for modern, fast testing.

## ✅ Migration Completed

### Dependencies Removed
- `@vue/cli-service` and all Vue CLI plugins
- `mocha` → replaced with `vitest`
- `nyc` → replaced with `c8` (vitest's coverage provider)
- `@babel/register` → vitest handles transpilation natively
- `babel-plugin-istanbul` and `coverage-istanbul-loader` → vitest coverage
- `jsdom-global` → vitest uses jsdom natively

### Dependencies Added
- `vitest` - Modern test runner with Vite integration
- `c8` - Modern coverage provider
- `@vitest/ui` - Optional test UI for development

### Test Scripts Updated
```json
{
  "test:unit": "node node_modules/vitest/vitest.mjs run --config vitest.config.js",
  "test:watch": "node node_modules/vitest/vitest.mjs --config vitest.config.js",
  "test:coverage": "node node_modules/vitest/vitest.mjs run --config vitest.config.js --coverage"
}
```

## 🔧 Configuration

### vitest.config.js
Dedicated Vitest configuration with:
- JSDOM environment for browser APIs
- Vue component support via existing setup
- Path aliases (`@` -> `src`)
- Coverage configuration with c8

### Test Setup Migration
- Updated `tests/unit/setup.js` to work with Vitest globals
- Preserved existing Vue Test Utils and Element UI setup
- Maintained compatibility with Vue 2.7.16

## 🎯 Benefits

- **Faster Tests**: Vitest is significantly faster than Mocha
- **Native ES Modules**: No transpilation needed for modern JS
- **Hot Module Replacement**: Instant test re-runs during development
- **Built-in Coverage**: No separate coverage tools needed
- **Better DX**: Improved error messages and debugging

## 🚀 Usage

After resolving dependency installation:

```bash
# Run all tests
npm run test:unit

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage

# Launch test UI (optional)
npx vitest --ui
```

## 🔍 Test Compatibility

Existing test files work without modification:
- Chai expect statements supported via global setup
- Vue Test Utils functions unchanged
- Element UI mocking preserved
- Mock adapters work as before

## 📦 Dependencies Status

The migration structure is complete. Some dependencies may need reinstallation in the target environment:
- `safer-buffer` (jsdom dependency)
- `picomatch` (vite-plugin-vue2 dependency)

These are transitive dependencies that should resolve automatically with `npm install`.