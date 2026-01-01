import { createPinia } from 'pinia';
import { useStorage } from '@vueuse/core';

/**
 * Create a Pinia plugin for state persistence using VueUse
 *
 * This plugin uses VueUse's useStorage composable to automatically persist
 * and restore specified parts of the Pinia state to/from localStorage.
 *
 * @param {Object} options - Configuration options for the plugin
 * @param {string} options.key - The localStorage key to use for persisting state
 * @param {string[]} options.stores - Array of store IDs to persist (e.g., ['ui', 'config'])
 * @returns {Function} A Pinia plugin function
 */
export function createPiniaStoragePlugin(options) {
  return ({ store }) => {
    const { key, stores } = options;

    // Only persist specified stores
    if (!stores.includes(store.$id)) {
      return;
    }

    // Initialize storage with current state or stored value
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

    // Restore state from storage on initialization
    if (storedValue.value) {
      store.$patch(storedValue.value);
    } else {
      // If no stored value exists, persist the initial state
      storedValue.value = store.$state;
    }

    // Subscribe to state changes and persist
    store.$subscribe((mutation, state) => {
      storedValue.value = state;
    });
  };
}

const pinia = createPinia();

// Add persistence plugin for UI store
const storagePlugin = createPiniaStoragePlugin({
  key: 'praeco-pinia',
  stores: ['ui']
});

pinia.use(storagePlugin);

export default pinia;
