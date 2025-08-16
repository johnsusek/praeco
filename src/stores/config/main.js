import { defineStore } from 'pinia';
import yaml from 'js-yaml';
import { useConfigSettingsStore } from './settings.js';
import { useConfigQueryStore } from './query.js';
import { useConfigsStore } from '../configs.js';

// Simplified main config store that provides essential functionality
// This is a temporary minimal implementation to get tests working
// The full conversion of config/index.js will be done incrementally
export const useConfigStore = defineStore('config', {
  state: () => ({
    path: '',
    type: '',
    valid: true,
    validating: false,
    validateError: null,
    sampleResult: null
  }),

  getters: {
    // Provide access to sub-stores
    settings: () => useConfigSettingsStore(),
    query: () => useConfigQueryStore(),

    // Essential yaml functionality for tests
    yaml() {
      return (forTest = false) => {
        // This is a simplified version that will be expanded
        // For now, just return the loaded configuration 
        const configsStore = useConfigsStore();
        const settingsStore = useConfigSettingsStore();
        
        let config = {};
        
        if (this.type && this.path) {
          const loadedConfig = configsStore[this.type]?.[this.path] || {};
          config = { ...loadedConfig };
        }
        
        // Add basic configuration from sub-stores
        if (settingsStore.name) {
          config.name = settingsStore.name;
        }
        if (settingsStore.index) {
          config.index = settingsStore.index;
        }
        
        // Use the original yaml dump options from Vuex
        return yaml.dump(config, { quotingType: '"', forceQuotes: true });
      };
    }
  },

  actions: {
    reset() {
      this.sampleResult = null;
      this.settings?.reset?.();
      this.query?.reset?.();
    },

    async load({ type, path }) {
      const configsStore = useConfigsStore();
      await configsStore.fetchConfig({ type, path });
      
      this.type = type;
      this.path = path.split('/').slice(0, -1).join('/'); // Remove filename, keep folder
      
      const config = configsStore[type]?.[path];
      if (config) {
        this.reset();
        
        // Load into sub-stores
        const settingsStore = useConfigSettingsStore();
        if (config.name) settingsStore.updateName(config.name);
        if (config.index) settingsStore.updateIndex(config.index);
        if (config.description) settingsStore.updateDescription(config.description);
      }
    }
  }
});