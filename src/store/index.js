import { useStorage } from '@vueuse/core';
import { createStore } from 'vuex';
// TODO: error  Dependency cycle via @/lib/logger.js:7  import/no-cycle
import configs from './configs';
import server from './server';
import metadata from './metadata';
import appconfig from './appconfig';
import elastalert from './elastalert';
import config from './config';
import ui from './ui';

/**
 * Create a Vuex plugin using VueUse for state persistence
 *
 * This plugin uses VueUse's useStorage composable to automatically persist
 * and restore specified parts of the Vuex state to/from localStorage.
 *
 * @param {Object} options - Configuration options for the plugin
 * @param {string} options.key - The localStorage key to use for persisting state
 * @param {string[]} options.paths - Array of state module names to persist (e.g., ['ui', 'config'])
 * @returns {Function} A Vuex plugin function that can be added to the store's plugins array
 *
 * @example
 * const storagePlugin = createVueUseStoragePlugin({
 *   key: 'my-app-state',
 *   paths: ['ui', 'settings']
 * });
 *
 * const store = new Vuex.Store({
 *   modules: { ui, settings },
 *   plugins: [storagePlugin]
 * });
 */
export function createVueUseStoragePlugin(options) {
  return store => {
    const { key, paths } = options;

    // Initialize storage with current state or stored value
    // Note: Uses window.localStorage directly - this plugin is for browser-only usage
    const storedValue = useStorage(key, null, window.localStorage, {
      serializer: {
        read: (v) => {
          if (!v) return null;
          try {
            return JSON.parse(v);
          } catch (e) {
            // Handle corrupted localStorage data gracefully
            console.warn(`Failed to parse stored state from key "${key}":`, e);
            return null;
          }
        },
        write: (v) => JSON.stringify(v)
      }
    });

    // Restore state from storage on initialization
    if (storedValue.value) {
      store.replaceState(
        Object.assign({}, store.state, storedValue.value)
      );
    } else {
      // If no stored value exists, persist the initial state
      // This matches vuex-persist behavior of saving defaults on first load
      const stateToPersist = {};
      paths.forEach(path => {
        stateToPersist[path] = store.state[path];
      });
      storedValue.value = stateToPersist;
    }

    // Subscribe to mutations and persist specified paths
    store.subscribe((mutation, state) => {
      // Only persist if mutation affects one of the tracked paths
      // Assumes namespaced modules with mutation types like 'module/MUTATION_NAME'
      const mutationPath = mutation.type.split('/')[0];
      if (!paths.includes(mutationPath)) {
        return;
      }

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

export default createStore({
  modules: {
    configs,
    server,
    metadata,
    appconfig,
    elastalert,
    config,
    ui
  },
  plugins: [storagePlugin]
});
