# Pinia Migration Guide

## Overview

This guide helps migrate Praeco from Vuex to Pinia for state management. Pinia is the officially recommended state management library for Vue applications and is designed to work seamlessly with both Vue 2.7 and Vue 3.

Pinia is essentially Vuex 5, incorporating all the learnings from the Vue ecosystem:
- Simpler API with less boilerplate
- Better TypeScript support
- No mutations - actions can be sync or async
- Modular by design - each store is independent
- No nested modules - flat structure with composable stores
- Built-in devtools support
- Better tree-shaking and code splitting

## Why Migrate to Pinia?

### Benefits

- **Simpler API**: No more mutations, just actions. No `commit` vs `dispatch` confusion.
- **Better TypeScript Support**: Full type inference without manual type definitions
- **Smaller Bundle Size**: ~1KB (compared to Vuex's ~2KB) with better tree-shaking
- **Modular Design**: Each store is independent, no need for namespaces
- **Developer Experience**: Simpler mental model, easier to test
- **Future-Ready**: Official recommendation for Vue 3, maintained by Vue core team
- **Vue 2.7 Compatible**: Works with Vue 2.7 via `@pinia/compat`

### When to Migrate

**Migrate when:**
- Starting new features or major refactoring
- Preparing for eventual Vue 3 migration
- Team wants a simpler state management solution
- You need better TypeScript support

**Consider staying with Vuex when:**
- Project is stable with no major changes planned
- Team is not familiar with Pinia
- Migration effort outweighs benefits for your use case

**Important**: Pinia and Vuex can coexist during migration!

## Installation

For Vue 2.7, you need to install Pinia with the compatibility layer:

```bash
npm install pinia
```

For Vue 2.6 and below (not applicable to Praeco which uses Vue 2.7):
```bash
npm install pinia @pinia/compat
```

## Core Concepts Comparison

### Vuex vs Pinia

| Concept | Vuex | Pinia |
|---------|------|-------|
| Store | `new Vuex.Store({})` | `defineStore()` |
| State | `state: {}` | `state: () => ({})` |
| Getters | `getters: {}` | `getters: {}` |
| Mutations | `mutations: {}` | ❌ (use actions instead) |
| Actions | `actions: {}` | `actions: {}` |
| Modules | `modules: {}` | ❌ (use multiple stores) |
| Namespacing | `namespaced: true` | ❌ (not needed) |
| Accessing | `$store.state.module` | `store.property` |
| Committing | `commit('mutation')` | ❌ (call action directly) |
| Dispatching | `dispatch('action')` | `action()` (call directly) |

### Store Definition

**Vuex (old):**
```javascript
export default {
  namespaced: true,
  state: {
    sidebarWidth: [20, 80]
  },
  mutations: {
    UPDATE_SIDEBAR_WIDTH(state, payload) {
      state.sidebarWidth = payload;
    }
  },
  actions: {
    async fetchData({ commit }) {
      const data = await api.get();
      commit('SET_DATA', data);
    }
  },
  getters: {
    isExpanded: (state) => state.sidebarWidth[0] > 30
  }
};
```

**Pinia (new):**
```javascript
import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    sidebarWidth: [20, 80]
  }),
  
  getters: {
    isExpanded: (state) => state.sidebarWidth[0] > 30
  },
  
  actions: {
    updateSidebarWidth(payload) {
      this.sidebarWidth = payload;
    },
    
    async fetchData() {
      const data = await api.get();
      this.data = data;
    }
  }
});
```

## Setup

### Step 1: Install Pinia

```bash
npm install pinia
```

### Step 2: Create Pinia Instance

Create a new file `src/store/pinia.js`:

```javascript
import { createPinia } from 'pinia';

const pinia = createPinia();

export default pinia;
```

### Step 3: Add Pinia to Vue Instance

Update `src/main.js`:

```javascript
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Keep Vuex during migration
import pinia from './store/pinia'; // Add Pinia
import { PiniaVuePlugin } from 'pinia';

Vue.use(PiniaVuePlugin);

new Vue({
  router,
  store,  // Keep Vuex for now
  pinia,  // Add Pinia
  render: h => h(App)
}).$mount('#app');
```

## Migration Patterns

### Pattern 1: Simple State Module

**Before (Vuex - `src/store/ui.js`):**
```javascript
export default {
  namespaced: true,

  state: {
    sidebarWidth: [20, 80]
  },

  mutations: {
    UPDATE_SIDEBAR_WIDTH(state, payload) {
      state.sidebarWidth = payload;
    }
  }
};
```

**After (Pinia - `src/stores/ui.js`):**
```javascript
import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    sidebarWidth: [20, 80]
  }),
  
  actions: {
    updateSidebarWidth(payload) {
      this.sidebarWidth = payload;
    }
  }
});
```

### Pattern 2: Module with Getters

**Before (Vuex):**
```javascript
export default {
  namespaced: true,

  state: {
    configs: {},
    loading: false
  },

  getters: {
    configByPath: (state) => (path) => {
      return state.configs[path];
    },
    
    hasConfigs: (state) => {
      return Object.keys(state.configs).length > 0;
    }
  },

  mutations: {
    SET_CONFIG(state, { path, config }) {
      state.configs[path] = config;
    },
    
    SET_LOADING(state, loading) {
      state.loading = loading;
    }
  }
};
```

**After (Pinia):**
```javascript
import { defineStore } from 'pinia';

export const useConfigsStore = defineStore('configs', {
  state: () => ({
    configs: {},
    loading: false
  }),
  
  getters: {
    configByPath: (state) => (path) => {
      return state.configs[path];
    },
    
    hasConfigs: (state) => {
      return Object.keys(state.configs).length > 0;
    }
  },
  
  actions: {
    setConfig(path, config) {
      this.configs[path] = config;
    },
    
    setLoading(loading) {
      this.loading = loading;
    }
  }
});
```

### Pattern 3: Module with Async Actions

**Before (Vuex):**
```javascript
import axios from 'axios';

export default {
  namespaced: true,

  state: {
    version: null,
    status: null,
    error: null
  },

  mutations: {
    SET_VERSION(state, version) {
      state.version = version;
    },
    
    SET_STATUS(state, status) {
      state.status = status;
    },
    
    SET_ERROR(state, error) {
      state.error = error;
    }
  },

  actions: {
    async fetchVersion({ commit }) {
      try {
        const res = await axios.get('/api/version');
        commit('SET_VERSION', res.data);
      } catch (error) {
        commit('SET_ERROR', error);
      }
    },
    
    async fetchStatus({ commit }) {
      try {
        const res = await axios.get('/api/status');
        commit('SET_STATUS', res.data);
      } catch (error) {
        commit('SET_ERROR', error);
      }
    }
  }
};
```

**After (Pinia):**
```javascript
import { defineStore } from 'pinia';
import axios from 'axios';

export const useServerStore = defineStore('server', {
  state: () => ({
    version: null,
    status: null,
    error: null
  }),
  
  actions: {
    async fetchVersion() {
      try {
        const res = await axios.get('/api/version');
        this.version = res.data;
      } catch (error) {
        this.error = error;
      }
    },
    
    async fetchStatus() {
      try {
        const res = await axios.get('/api/status');
        this.status = res.data;
      } catch (error) {
        this.error = error;
      }
    }
  }
});
```

### Pattern 4: Module with Actions Calling Other Actions

**Before (Vuex):**
```javascript
export default {
  namespaced: true,

  state: {
    path: '',
    type: '',
    valid: true
  },

  mutations: {
    UPDATE_PATH(state, path) {
      state.path = path;
    },
    
    UPDATE_TYPE(state, type) {
      state.type = type;
    },
    
    UPDATE_VALID(state, valid) {
      state.valid = valid;
    }
  },

  actions: {
    reset({ commit }) {
      commit('UPDATE_PATH', '');
      commit('UPDATE_TYPE', '');
      commit('UPDATE_VALID', true);
    },
    
    async load({ dispatch, commit }, { type, path }) {
      commit('UPDATE_PATH', path);
      commit('UPDATE_TYPE', type);
      await dispatch('fetchData');
    },
    
    async fetchData({ commit }) {
      // fetch logic
    }
  }
};
```

**After (Pinia):**
```javascript
import { defineStore } from 'pinia';

export const useConfigStore = defineStore('config', {
  state: () => ({
    path: '',
    type: '',
    valid: true
  }),
  
  actions: {
    reset() {
      this.path = '';
      this.type = '';
      this.valid = true;
    },
    
    async load(type, path) {
      this.path = path;
      this.type = type;
      await this.fetchData();
    },
    
    async fetchData() {
      // fetch logic
    }
  }
});
```

### Pattern 5: Using Other Stores

**Before (Vuex - accessing other modules):**
```javascript
export default {
  namespaced: true,

  actions: {
    async load({ dispatch, commit, rootState }, { type, path }) {
      await dispatch('configs/fetchConfig', { type, path }, { root: true });
      let config = rootState.configs[type][path];
      
      commit('UPDATE_CONFIG', config);
    }
  }
};
```

**After (Pinia - accessing other stores):**
```javascript
import { defineStore } from 'pinia';
import { useConfigsStore } from './configs';

export const useConfigStore = defineStore('config', {
  actions: {
    async load(type, path) {
      const configsStore = useConfigsStore();
      await configsStore.fetchConfig(type, path);
      const config = configsStore.configs[type][path];
      
      this.config = config;
    }
  }
});
```

### Pattern 6: State Persistence with VueUse

**Before (Vuex with custom plugin):**
```javascript
// src/store/index.js
import { useStorage } from '@vueuse/core';
import Vuex from 'vuex';

export function createVueUseStoragePlugin(options) {
  return store => {
    const { key, paths } = options;
    
    const storedValue = useStorage(key, null, window.localStorage, {
      serializer: {
        read: (v) => v ? JSON.parse(v) : null,
        write: (v) => JSON.stringify(v)
      }
    });
    
    if (storedValue.value) {
      store.replaceState(
        Object.assign({}, store.state, storedValue.value)
      );
    }
    
    store.subscribe((mutation, state) => {
      const mutationPath = mutation.type.split('/')[0];
      if (!paths.includes(mutationPath)) return;
      
      const stateToPersist = {};
      paths.forEach(path => {
        stateToPersist[path] = state[path];
      });
      storedValue.value = stateToPersist;
    });
  };
}

const storagePlugin = createVueUseStoragePlugin({
  key: 'praeco-vuex',
  paths: ['ui']
});

export default new Vuex.Store({
  modules: { ui },
  plugins: [storagePlugin]
});
```

**After (Pinia with plugin):**
```javascript
// src/store/pinia.js
import { createPinia } from 'pinia';
import { useStorage } from '@vueuse/core';

/**
 * Create a Pinia plugin for state persistence using VueUse
 */
function createPersistencePlugin(options) {
  return ({ store }) => {
    const { key, stores } = options;
    
    // Only persist specified stores
    if (!stores.includes(store.$id)) return;
    
    const storageKey = `${key}-${store.$id}`;
    const storedValue = useStorage(storageKey, null, window.localStorage, {
      serializer: {
        read: (v) => {
          if (!v) return null;
          try {
            return JSON.parse(v);
          } catch (e) {
            console.warn(`Failed to parse stored state from key "${storageKey}":`, e);
            return null;
          }
        },
        write: (v) => JSON.stringify(v)
      }
    });
    
    // Restore state on initialization
    if (storedValue.value) {
      store.$patch(storedValue.value);
    } else {
      // Save initial state if nothing stored
      storedValue.value = store.$state;
    }
    
    // Persist state on changes
    store.$subscribe((mutation, state) => {
      storedValue.value = state;
    });
  };
}

const pinia = createPinia();

// Add persistence plugin
pinia.use(createPersistencePlugin({
  key: 'praeco-pinia',
  stores: ['ui'] // List store IDs to persist
}));

export default pinia;
```

**Alternative: Using pinia-plugin-persistedstate**

For a more feature-rich solution, use the official persistence plugin:

```bash
npm install pinia-plugin-persistedstate
```

```javascript
// src/store/pinia.js
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;
```

```javascript
// src/stores/ui.js
import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    sidebarWidth: [20, 80]
  }),
  
  // Enable persistence
  persist: true
});
```

## Component Integration

### Options API Components

**Before (Vuex with Options API):**
```vue
<script>
export default {
  computed: {
    sidebarWidth: {
      get() {
        return this.$store.state.ui.sidebarWidth;
      },
      set(value) {
        this.$store.commit('ui/UPDATE_SIDEBAR_WIDTH', value);
      }
    }
  },

  mounted() {
    this.$store.dispatch('server/fetchVersion');
    this.$store.dispatch('server/fetchStatus');
  }
};
</script>
```

**After (Pinia with Options API):**
```vue
<script>
import { useUiStore } from '@/stores/ui';
import { useServerStore } from '@/stores/server';

export default {
  computed: {
    sidebarWidth: {
      get() {
        const uiStore = useUiStore();
        return uiStore.sidebarWidth;
      },
      set(value) {
        const uiStore = useUiStore();
        uiStore.updateSidebarWidth(value);
      }
    }
  },

  mounted() {
    const serverStore = useServerStore();
    serverStore.fetchVersion();
    serverStore.fetchStatus();
  }
};
</script>
```

**Better approach with mapStores helper:**
```vue
<script>
import { mapStores } from 'pinia';
import { useUiStore } from '@/stores/ui';
import { useServerStore } from '@/stores/server';

export default {
  computed: {
    ...mapStores(useUiStore, useServerStore),
    
    sidebarWidth: {
      get() {
        return this.uiStore.sidebarWidth;
      },
      set(value) {
        this.uiStore.updateSidebarWidth(value);
      }
    }
  },

  mounted() {
    this.serverStore.fetchVersion();
    this.serverStore.fetchStatus();
  }
};
</script>
```

### Composition API Components

**Before (Vuex with Composition API):**
```vue
<script setup>
import { computed, onMounted, getCurrentInstance } from 'vue';

const instance = getCurrentInstance();
const store = instance.proxy.$store;

const sidebarWidth = computed({
  get() {
    return store.state.ui.sidebarWidth;
  },
  set(value) {
    store.commit('ui/UPDATE_SIDEBAR_WIDTH', value);
  }
});

onMounted(() => {
  store.dispatch('server/fetchVersion');
  store.dispatch('server/fetchStatus');
});
</script>
```

**After (Pinia with Composition API):**
```vue
<script setup>
import { computed, onMounted } from 'vue';
import { useUiStore } from '@/stores/ui';
import { useServerStore } from '@/stores/server';

const uiStore = useUiStore();
const serverStore = useServerStore();

const sidebarWidth = computed({
  get() {
    return uiStore.sidebarWidth;
  },
  set(value) {
    uiStore.updateSidebarWidth(value);
  }
});

onMounted(() => {
  serverStore.fetchVersion();
  serverStore.fetchStatus();
});
</script>
```

### Using mapState, mapGetters, mapActions

**Before (Vuex helpers):**
```vue
<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState('ui', ['sidebarWidth']),
    ...mapGetters('configs', ['hasConfigs', 'configByPath'])
  },
  
  methods: {
    ...mapActions('server', ['fetchVersion', 'fetchStatus'])
  },
  
  mounted() {
    this.fetchVersion();
    this.fetchStatus();
  }
};
</script>
```

**After (Pinia helpers):**
```vue
<script>
import { mapState, mapActions } from 'pinia';
import { useUiStore } from '@/stores/ui';
import { useConfigsStore } from '@/stores/configs';
import { useServerStore } from '@/stores/server';

export default {
  computed: {
    ...mapState(useUiStore, ['sidebarWidth']),
    ...mapState(useConfigsStore, ['hasConfigs', 'configByPath'])
  },
  
  methods: {
    ...mapActions(useServerStore, ['fetchVersion', 'fetchStatus'])
  },
  
  mounted() {
    this.fetchVersion();
    this.fetchStatus();
  }
};
</script>
```

## Practical Examples from Praeco

### Example 1: Migrating the UI Store

**Original (Vuex - `src/store/ui.js`):**
```javascript
export default {
  namespaced: true,

  state: {
    sidebarWidth: [20, 80]
  },

  mutations: {
    UPDATE_SIDEBAR_WIDTH(state, payload) {
      state.sidebarWidth = payload;
    }
  }
};
```

**Migrated (Pinia - `src/stores/ui.js`):**
```javascript
import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    sidebarWidth: [20, 80]
  }),
  
  actions: {
    updateSidebarWidth(payload) {
      this.sidebarWidth = payload;
    }
  },
  
  // Enable persistence
  persist: true
});
```

### Example 2: Migrating the Server Store

**Original (Vuex - `src/store/server.js`):**
```javascript
import axios from 'axios';

export default {
  namespaced: true,

  state: {
    version: null,
    status: null
  },

  mutations: {
    SET_VERSION(state, version) {
      state.version = version;
    },
    
    SET_STATUS(state, status) {
      state.status = status;
    }
  },

  actions: {
    async fetchVersion({ commit }) {
      try {
        const res = await axios.get('/api-app/version');
        commit('SET_VERSION', res.data);
      } catch (error) {
        console.error('Failed to fetch version:', error);
      }
    },
    
    async fetchStatus({ commit }) {
      try {
        const res = await axios.get('/api-app/status');
        commit('SET_STATUS', res.data);
      } catch (error) {
        console.error('Failed to fetch status:', error);
      }
    }
  }
};
```

**Migrated (Pinia - `src/stores/server.js`):**
```javascript
import { defineStore } from 'pinia';
import axios from 'axios';

export const useServerStore = defineStore('server', {
  state: () => ({
    version: null,
    status: null
  }),
  
  actions: {
    async fetchVersion() {
      try {
        const res = await axios.get('/api-app/version');
        this.version = res.data;
      } catch (error) {
        console.error('Failed to fetch version:', error);
      }
    },
    
    async fetchStatus() {
      try {
        const res = await axios.get('/api-app/status');
        this.status = res.data;
      } catch (error) {
        console.error('Failed to fetch status:', error);
      }
    }
  }
});
```

### Example 3: Migrating App.vue

**Original (Vuex):**
```vue
<template>
  <div id="app">
    <!-- template content -->
  </div>
</template>

<script>
export default {
  computed: {
    sidebarWidth: {
      get() {
        return this.$store.state.ui.sidebarWidth;
      },
      set(value) {
        this.$store.commit('ui/UPDATE_SIDEBAR_WIDTH', value);
      }
    }
  },

  mounted() {
    this.$store.dispatch('server/fetchVersion');
    this.$store.dispatch('server/fetchStatus');
    this.$store.dispatch('elastalert/fetchConfig');
  },

  methods: {
    onDragEnd(size) {
      this.sidebarWidth = size;
    }
  }
};
</script>
```

**Migrated (Pinia with Composition API):**
```vue
<template>
  <div id="app">
    <!-- template content -->
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useUiStore } from '@/stores/ui';
import { useServerStore } from '@/stores/server';
import { useElastalertStore } from '@/stores/elastalert';

const uiStore = useUiStore();
const serverStore = useServerStore();
const elastalertStore = useElastalertStore();

const sidebarWidth = computed({
  get: () => uiStore.sidebarWidth,
  set: (value) => uiStore.updateSidebarWidth(value)
});

function onDragEnd(size) {
  sidebarWidth.value = size;
}

onMounted(() => {
  serverStore.fetchVersion();
  serverStore.fetchStatus();
  elastalertStore.fetchConfig();
});
</script>
```

**Migrated (Pinia with Options API):**
```vue
<template>
  <div id="app">
    <!-- template content -->
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useUiStore } from '@/stores/ui';
import { useServerStore } from '@/stores/server';
import { useElastalertStore } from '@/stores/elastalert';

export default {
  computed: {
    ...mapStores(useUiStore, useServerStore, useElastalertStore),
    
    sidebarWidth: {
      get() {
        return this.uiStore.sidebarWidth;
      },
      set(value) {
        this.uiStore.updateSidebarWidth(value);
      }
    }
  },

  mounted() {
    this.serverStore.fetchVersion();
    this.serverStore.fetchStatus();
    this.elastalertStore.fetchConfig();
  },

  methods: {
    onDragEnd(size) {
      this.sidebarWidth = size;
    }
  }
};
</script>
```

### Example 4: Complex Store with Nested Modules

**Original (Vuex - `src/store/config/index.js`):**
```javascript
import settings from './settings';
import query from './query';
import match from './match';
import alert from './alert';

export default {
  namespaced: true,

  modules: {
    settings,
    query,
    match,
    alert
  },

  state: {
    path: '',
    type: '',
    valid: true
  },

  mutations: {
    UPDATE_PATH(state, path) {
      state.path = path;
    },
    
    UPDATE_TYPE(state, type) {
      state.type = type;
    }
  },

  actions: {
    reset({ commit }) {
      commit('settings/RESET');
      commit('query/RESET');
      commit('match/RESET');
      commit('alert/RESET');
    },

    async load({ dispatch, commit, rootState }, { type, path }) {
      await dispatch('configs/fetchConfig', { type, path }, { root: true });
      let config = rootState.configs[type][path];
      
      if (config) {
        dispatch('reset');
        commit('UPDATE_PATH', path);
        commit('settings/UPDATE_NAME', config.name);
        // ... more commits
      }
    }
  }
};
```

**Migrated (Pinia - separate stores):**

```javascript
// src/stores/config.js
import { defineStore } from 'pinia';
import { useConfigsStore } from './configs';
import { useSettingsStore } from './settings';
import { useQueryStore } from './query';
import { useMatchStore } from './match';
import { useAlertStore } from './alert';

export const useConfigStore = defineStore('config', {
  state: () => ({
    path: '',
    type: '',
    valid: true
  }),
  
  actions: {
    updatePath(path) {
      this.path = path;
    },
    
    updateType(type) {
      this.type = type;
    },
    
    reset() {
      const settingsStore = useSettingsStore();
      const queryStore = useQueryStore();
      const matchStore = useMatchStore();
      const alertStore = useAlertStore();
      
      settingsStore.reset();
      queryStore.reset();
      matchStore.reset();
      alertStore.reset();
    },

    async load(type, path) {
      const configsStore = useConfigsStore();
      await configsStore.fetchConfig(type, path);
      const config = configsStore.configs[type][path];
      
      if (config) {
        this.reset();
        this.updatePath(path);
        
        const settingsStore = useSettingsStore();
        settingsStore.updateName(config.name);
        // ... more updates
      }
    }
  }
});
```

```javascript
// src/stores/settings.js
import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    name: '',
    description: '',
    index: ''
  }),
  
  actions: {
    updateName(name) {
      this.name = name;
    },
    
    updateDescription(description) {
      this.description = description;
    },
    
    updateIndex(index) {
      this.index = index;
    },
    
    reset() {
      this.name = '';
      this.description = '';
      this.index = '';
    }
  }
});
```

## Testing Pinia Stores

### Unit Testing

**Vuex tests (before):**
```javascript
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import ui from '@/store/ui';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('ui store', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        ui
      }
    });
  });

  it('updates sidebar width', () => {
    store.commit('ui/UPDATE_SIDEBAR_WIDTH', [30, 70]);
    expect(store.state.ui.sidebarWidth).toEqual([30, 70]);
  });
});
```

**Pinia tests (after):**
```javascript
import { setActivePinia, createPinia } from 'pinia';
import { useUiStore } from '@/stores/ui';

describe('ui store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('updates sidebar width', () => {
    const store = useUiStore();
    store.updateSidebarWidth([30, 70]);
    expect(store.sidebarWidth).toEqual([30, 70]);
  });
});
```

### Component Testing

**Vuex component test (before):**
```javascript
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import App from '@/App.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('App.vue', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        ui: {
          namespaced: true,
          state: { sidebarWidth: [20, 80] },
          mutations: {
            UPDATE_SIDEBAR_WIDTH(state, payload) {
              state.sidebarWidth = payload;
            }
          }
        }
      }
    });
  });

  it('renders with store', () => {
    const wrapper = mount(App, { store, localVue });
    expect(wrapper.vm.$store.state.ui.sidebarWidth).toEqual([20, 80]);
  });
});
```

**Pinia component test (after):**
```javascript
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import App from '@/App.vue';
import { useUiStore } from '@/stores/ui';

describe('App.vue', () => {
  let pinia;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  it('renders with store', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [pinia]
      }
    });
    
    const uiStore = useUiStore();
    expect(uiStore.sidebarWidth).toEqual([20, 80]);
  });
});
```

## Migration Strategy

### Incremental Approach (Recommended)

Migrate gradually to minimize risk and maintain a working application throughout:

1. **Install Pinia alongside Vuex** (both can coexist)
2. **Migrate one module at a time** (start with simple ones)
3. **Update components using that module**
4. **Test thoroughly**
5. **Repeat for next module**
6. **Remove Vuex when all modules are migrated**

### Step-by-Step Migration Plan

#### Phase 1: Setup (Week 1)

1. Install Pinia: `npm install pinia`
2. Create `src/store/pinia.js` with Pinia instance
3. Add Pinia to `src/main.js` (keep Vuex)
4. Create `src/stores/` directory for Pinia stores

#### Phase 2: Migrate Simple Stores (Week 2-3)

Priority order for Praeco:

1. **ui** - Simplest store, only state and one mutation
2. **server** - Simple async actions, good learning case
3. **metadata** - Standalone store with no dependencies
4. **appconfig** - Similar to server store

For each store:
- Create new Pinia store in `src/stores/`
- Update all components using that store
- Test thoroughly
- Commit changes

#### Phase 3: Migrate Complex Stores (Week 4-5)

5. **configs** - More complex with multiple actions
6. **elastalert** - Similar to configs
7. **config** - Most complex, has nested modules

For nested modules (like config):
- Break into separate flat stores
- Create stores for: settings, query, match, alert
- Update main config store to use other stores
- Update all components

#### Phase 4: Testing & Cleanup (Week 6)

1. Run full test suite
2. Update all tests to use Pinia
3. Remove Vuex from `package.json`
4. Remove Vuex from `src/main.js`
5. Delete `src/store/` directory
6. Update documentation

### Migration Checklist

For each store module:

- [ ] Create new Pinia store file
- [ ] Convert state (add arrow function)
- [ ] Convert getters (keep as-is)
- [ ] Convert mutations to actions
- [ ] Convert actions (remove context, use `this`)
- [ ] Update action calls to other stores
- [ ] Add persistence if needed
- [ ] Update all components using this store
- [ ] Update all tests
- [ ] Verify functionality
- [ ] Remove old Vuex module

## Best Practices

### 1. Store Naming

```javascript
// ✅ Good - use descriptive names with "use" prefix
export const useUiStore = defineStore('ui', { /* ... */ });
export const useUserStore = defineStore('user', { /* ... */ });

// ❌ Bad - inconsistent naming
export const UiStore = defineStore('ui', { /* ... */ });
export default defineStore('ui', { /* ... */ });
```

### 2. Action Naming

```javascript
// ✅ Good - clear, descriptive action names
actions: {
  updateSidebarWidth(width) {},
  async fetchUserData() {},
  resetForm() {}
}

// ❌ Bad - vague or mutation-style names
actions: {
  setSidebar(width) {},  // Sounds like a mutation
  getData() {},           // Too vague
  reset() {}              // What does it reset?
}
```

### 3. State Initialization

```javascript
// ✅ Good - state as a function returning initial state
state: () => ({
  users: [],
  loading: false,
  error: null
})

// ❌ Bad - state as an object (Vue 2 pattern, avoid in Pinia)
state: {
  users: [],
  loading: false,
  error: null
}
```

### 4. Getter Functions vs. Computed

```javascript
// ✅ Good - getters for derived state
getters: {
  // Simple derived state
  hasUsers: (state) => state.users.length > 0,
  
  // Getter returning a function (can accept parameters)
  getUserById: (state) => (id) => {
    return state.users.find(user => user.id === id);
  }
}

// ✅ Good - use in components
const store = useUserStore();
const hasUsers = computed(() => store.hasUsers);
const user = computed(() => store.getUserById(123));
```

### 5. Avoid Direct State Mutation Outside Actions

```javascript
// ✅ Good - modify state through actions
actions: {
  addUser(user) {
    this.users.push(user);
  }
}

// In component
userStore.addUser(newUser);

// ❌ Bad - direct mutation (works but breaks devtools and best practices)
userStore.users.push(newUser);
```

### 6. Group Related Actions

```javascript
// ✅ Good - organized by feature
actions: {
  // User CRUD
  async fetchUsers() {},
  async createUser(user) {},
  async updateUser(id, user) {},
  async deleteUser(id) {},
  
  // User auth
  async login(credentials) {},
  async logout() {},
  async refreshToken() {}
}
```

### 7. Handle Errors Consistently

```javascript
// ✅ Good - consistent error handling
actions: {
  async fetchData() {
    this.loading = true;
    this.error = null;
    
    try {
      const res = await api.get('/data');
      this.data = res.data;
    } catch (error) {
      this.error = error.message;
      console.error('Failed to fetch data:', error);
      // Optionally re-throw for component handling
      throw error;
    } finally {
      this.loading = false;
    }
  }
}
```

### 8. Use TypeScript for Better DX (Optional)

```typescript
import { defineStore } from 'pinia';

interface User {
  id: number;
  name: string;
  email: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    loading: false,
    error: null as string | null
  }),
  
  getters: {
    userCount: (state): number => state.users.length
  },
  
  actions: {
    async fetchUsers(): Promise<void> {
      this.loading = true;
      try {
        const res = await api.get<User[]>('/users');
        this.users = res.data;
      } catch (error) {
        this.error = error instanceof Error ? error.message : String(error);
      } finally {
        this.loading = false;
      }
    }
  }
});
```

## Common Gotchas

### 1. Forgetting `this` in Actions

```javascript
// ❌ Wrong
actions: {
  updateUser(user) {
    state.user = user; // state is undefined!
  }
}

// ✅ Correct
actions: {
  updateUser(user) {
    this.user = user;
  }
}
```

### 2. Destructuring Store Properties

```javascript
const store = useUserStore();

// ❌ Wrong - loses reactivity
const { name, email } = store;

// ✅ Correct - maintains reactivity
import { storeToRefs } from 'pinia';
const { name, email } = storeToRefs(store);

// ✅ Also correct - use computed
const name = computed(() => store.name);
const email = computed(() => store.email);

// ✅ Actions can be destructured directly (they're already bound)
const { updateUser, deleteUser } = store;
```

### 3. Store Not Available During Setup

```javascript
// ❌ Wrong - store may not be ready
const store = useUserStore();
console.log(store.user); // May be undefined

// ✅ Correct - wait for onMounted
onMounted(() => {
  const store = useUserStore();
  console.log(store.user);
});
```

### 4. Using Store in Router Guards

```javascript
// router.js
import Vue from 'vue';
import Router from 'vue-router';
import { useAuthStore } from '@/stores/auth';

Vue.use(Router);

const router = new Router({ /* ... */ });
// ❌ Wrong - Pinia not yet installed when file loads
const authStore = useAuthStore();
router.beforeEach((to, from, next) => {
  if (authStore.isAuthenticated) {
    next();
  }
});

// ✅ Correct - call useStore inside the guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (authStore.isAuthenticated) {
    next();
  } else {
    next('/login');
  }
});
```

### 5. Persistence Not Working

```javascript
// ❌ Wrong - persistence plugin not installed
const pinia = createPinia();
// Missing: pinia.use(piniaPluginPersistedstate);

export const useStore = defineStore('main', {
  state: () => ({ data: [] }),
  persist: true  // Won't work without plugin
});

// ✅ Correct - install plugin first
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
```

### 6. Calling Actions from Actions

```javascript
// ❌ Wrong - trying to dispatch like Vuex
actions: {
  async loadData() {
    await this.dispatch('fetchUser');  // Error!
  }
}

// ✅ Correct - call directly
actions: {
  async loadData() {
    await this.fetchUser();
  },
  
  async fetchUser() {
    // ...
  }
}
```

### 7. State Reset

```javascript
// ❌ Wrong - trying to mutate state directly to initial state
actions: {
  reset() {
    this.$state = { users: [], loading: false };  // Doesn't fully work
  }
}

// ✅ Correct - use $reset or manual reset
actions: {
  reset() {
    this.$reset();  // Resets to initial state
  }
}

// ✅ Also correct - manual reset for more control
actions: {
  reset() {
    this.$patch({
      users: [],
      loading: false,
      error: null
    });
  }
}
```

## Additional Resources

- [Pinia Documentation](https://pinia.vuejs.org/)
- [Pinia API Reference](https://pinia.vuejs.org/api/)
- [Pinia Cookbook](https://pinia.vuejs.org/cookbook/)
- [Vue 2 Plugin (@pinia/compat)](https://github.com/vuejs/pinia/tree/v2/packages/compat)
- [Pinia Plugin Persistence](https://github.com/prazdevs/pinia-plugin-persistedstate)
- [Vuex to Pinia Migration Tool](https://github.com/vuejs/pinia/discussions/1161)

## Comparison Table: Praeco Store Modules

| Module | Complexity | Dependencies | Migration Priority | Estimated Time |
|--------|-----------|--------------|-------------------|----------------|
| ui | Low | None | 1 (Start here) | 1 hour |
| server | Low | axios | 2 | 2 hours |
| metadata | Medium | None | 3 | 3 hours |
| appconfig | Medium | axios | 4 | 3 hours |
| configs | High | axios | 5 | 6 hours |
| elastalert | High | axios, logger | 6 | 6 hours |
| config | Very High | All above + nested modules | 7 (Last) | 12 hours |

**Total estimated migration time: ~33 hours** (including testing and updates)

## Conclusion

Migrating from Vuex to Pinia provides a simpler, more maintainable state management solution. The key benefits are:

- **Simpler API**: No mutations, just actions
- **Better developer experience**: More intuitive and less boilerplate
- **Smaller bundle**: Better tree-shaking
- **Type-safe**: Excellent TypeScript support
- **Modular**: Each store is independent

Remember:
- Both libraries can coexist during migration
- Migrate incrementally, one store at a time
- Start with simple stores to learn the patterns
- Test thoroughly after each migration
- Update documentation as you go

Happy migrating! 🚀
