# Vuex to Pinia Migration Guide for Praeco

This document outlines the completed and remaining work for migrating from Vuex to Pinia in the Praeco project.

## ✅ Completed Work

### 1. Package Dependencies
- [x] Updated `package.json` to replace `vuex` + `vuex-persist` with `pinia` + `pinia-plugin-persistedstate`

### 2. Core Store Infrastructure
- [x] Created `src/stores/` directory structure
- [x] Implemented core Pinia stores:
  - `useAppconfigStore` - Application configuration
  - `useUiStore` - UI state with persistence (sidebar width)
  - `useServerStore` - Server version/status API calls
  - `useElastalertStore` - Elastalert configuration
  - `useMetadataStore` - Elasticsearch indices/mappings with getters
  - `useConfigsStore` - Complex CRUD operations for rules/templates
  - `useConfigSettingsStore` - Config settings management
  - `useConfigQueryStore` - Query builder state

### 3. Vue 2 Compatibility
- [x] Setup `PiniaVuePlugin` for Vue 2 compatibility in `main.js`
- [x] Created compatibility layer (`stores/compat.js`) that mimics Vuex API
- [x] Helper functions (`stores/helpers.js`) for Options API compatibility
- [x] Updated `main.js` to use Pinia with compatibility layer

### 4. Persistence
- [x] Configured `pinia-plugin-persistedstate` for localStorage persistence
- [x] Migrated UI state persistence (sidebar width) to Pinia

## 🚧 Remaining Work

### 1. Complete Config Store Migration
The original `store/config/` module has several submodules that need conversion:
- [ ] Convert `store/config/match.js` to `stores/config/match.js`
- [ ] Convert `store/config/alert.js` to `stores/config/alert.js`  
- [ ] Create main `useConfigStore` that combines all config submodules
- [ ] Update the large `config/index.js` with all getters and actions

### 2. Component Migration
Components can be migrated gradually using the compatibility layer:

**Priority 1 (Core components):**
- [ ] `src/App.vue` - Main app component (example provided)
- [ ] `src/views/RuleView.vue` - Rule management
- [ ] `src/views/ConfigBuilder.vue` - Config builder interface

**Priority 2 (Frequently used):**
- [ ] Navigation components that use configs/metadata stores
- [ ] Alert configuration components
- [ ] Query builder components

### 3. Remove Compatibility Layer (Optional)
Once all components are migrated:
- [ ] Remove `stores/compat.js`
- [ ] Update components to use pure Pinia (no `this.$store`)
- [ ] Remove Vuex-style helpers if not needed

## 🔧 Migration Patterns

### For Simple State Access
```js
// Before
computed: {
  sidebarWidth() {
    return this.$store.state.ui.sidebarWidth
  }
}

// After  
import { useUiStore } from '@/stores'
computed: {
  sidebarWidth() {
    return useUiStore().sidebarWidth
  }
}
```

### For Actions
```js
// Before
methods: {
  async fetchData() {
    await this.$store.dispatch('server/fetchVersion')
  }
}

// After
import { useServerStore } from '@/stores'
methods: {
  async fetchData() {
    await useServerStore().fetchVersion()
  }
}
```

### For Getters
```js
// Before
computed: {
  filteredData() {
    return this.$store.getters['metadata/suggestedIndices']
  }
}

// After
import { useMetadataStore } from '@/stores'
computed: {
  filteredData() {
    return useMetadataStore().suggestedIndices
  }
}
```

## 🧪 Testing Migration

1. **Install Dependencies:**
   ```bash
   npm install pinia@^2.0.36 pinia-plugin-persistedstate@^3.2.0
   npm uninstall vuex vuex-persist
   ```

2. **Verify Store Functionality:**
   - Test that persistence works (UI sidebar state)
   - Test API calls work (server status, elastalert config)
   - Test complex operations (rule creation, metadata fetching)

3. **Component Testing:**
   - Start with `App.vue` conversion
   - Test sidebar resize functionality
   - Verify server status display
   - Test navigation components

## 📝 Notes

- The compatibility layer allows gradual migration - existing components continue working
- Pinia stores are more TypeScript-friendly if that's needed in the future
- The new structure is more modular and easier to test
- All persistence behavior is preserved with the new plugin

## 🎯 Benefits After Migration

1. **Simplified State Management:** No more namespaced modules
2. **Better Developer Experience:** Direct store access, no magic strings
3. **Tree Shaking:** Better bundle optimization
4. **TypeScript Ready:** If migrating to TypeScript later
5. **Modern Standards:** Pinia is the official state management for Vue 3+
6. **Easier Testing:** Stores can be tested independently