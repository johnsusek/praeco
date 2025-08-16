import { defineStore } from 'pinia';
import yaml from 'js-yaml';
import { useConfigSettingsStore } from './settings.js';
import { useConfigQueryStore } from './query.js';
import { useConfigAlertStore } from './alert-basic.js';
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

    // Essential configuration builder - this recreates the complex logic from Vuex
    config() {
      return (forTest = false) => {
        const settingsStore = useConfigSettingsStore();
        const queryStore = useConfigQueryStore();
        
        let config = {
          ...queryStore.queryFilter
        };

        if (forTest) {
          config.import = '../../rules/BaseRule.config';
        } else {
          let dots;

          if (!this.path) {
            dots = '';
          } else {
            dots = '../';
          }

          let path = this.path;

          if (path.endsWith('/')) {
            path = path.slice(0, -1);
          }

          for (let i = 1; i < path.split('/').length; i++) {
            dots += '../';
          }

          config.import = `${dots}BaseRule.config`;
        }

        if (this.path) {
          config.__praeco_full_path = `${this.path}/${settingsStore.name}`;
        } else {
          config.__praeco_full_path = settingsStore.name;
        }

        // if the user is using a manual query, then don't save this to the config,
        // so we know when loading it is manual
        if (queryStore.type === 'tree') {
          config.__praeco_query_builder = JSON.stringify({ query: queryStore.tree });
        }

        if (settingsStore.name) {
          config.name = settingsStore.name;
        }

        if (settingsStore.index) {
          config.index = settingsStore.index;
        }

        if (settingsStore.timeField) {
          config.timestamp_field = settingsStore.timeField;
        }

        if (settingsStore.timeType) {
          config.timestamp_type = settingsStore.timeType;
        }

        config.is_enabled = !!settingsStore.isEnabled;

        config.use_strftime_index = settingsStore.strftime;

        // TODO: Add match, alert, and other complex configuration logic
        // This is a starting point - the full logic needs to be ported from the original Vuex store
        
        return config;
      };
    },

    // Essential yaml functionality for tests
    yaml() {
      return (forTest = false) => {
        return yaml.dump(this.config(forTest), { quotingType: '"', forceQuotes: true });
      };
    }
  },

  actions: {
    updateType(type) {
      this.type = type;
    },

    updatePath(path) {
      this.path = path;
    },

    reset() {
      this.path = '';
      this.type = '';
      this.valid = true;
      this.validating = false;
      this.validateError = null;
      this.sampleResult = null;
      
      // Reset sub-stores
      const settingsStore = useConfigSettingsStore();
      const queryStore = useConfigQueryStore();
      const alertStore = useConfigAlertStore();
      settingsStore.reset();
      queryStore.reset();
      alertStore.reset();
    },

    async load({ type, path }) {
      const configsStore = useConfigsStore();
      await configsStore.fetchConfig({ type, path });
      
      this.type = type;
      this.path = path.split('/').slice(0, -1).join('/'); // Remove filename, keep folder
      
      const config = configsStore[type]?.[path];
      if (config) {
        // Load into sub-stores
        const settingsStore = useConfigSettingsStore();
        const queryStore = useConfigQueryStore();
        
        if (config.name) settingsStore.updateName(config.name);
        if (config.index) settingsStore.updateIndex(config.index);
        if (config.description) settingsStore.updateDescription(config.description);
        if (config.timestamp_field) settingsStore.updateTimeField(config.timestamp_field);
        if (config.is_enabled !== undefined) settingsStore.updateEnabled(config.is_enabled);
        
        // Load query data
        if (config.__praeco_query_builder) {
          try {
            const queryData = JSON.parse(config.__praeco_query_builder);
            queryStore.updateTree(queryData.query);
            queryStore.updateType('tree');
          } catch {
            // If parsing fails, fall back to manual query
            queryStore.updateType('manual');
          }
        }
      }
    },

    async save(payload) {
      const configsStore = useConfigsStore();
      return configsStore.saveConfig({
        config: this.config(false),
        ...payload
      });
    },

    async validate() {
      this.validateError = null;
      this.validating = true;

      try {
        const axios = (await import('axios')).default;
        let res = await axios.post('/api/test', {
          rule: this.yaml(true),
          options: {
            testType: 'schemaOnly',
            days: 1,
            alert: false,
            format: 'json'
          }
        });
        
        if (res.data) {
          this.valid = true;
        } else {
          this.valid = false;
          this.validateError = 'Invalid config. Make sure all required fields are filled out.';
        }
      } catch (error) {
        this.valid = false;
        this.validateError = error.toString();
        console.error(error);
        return false;
      } finally {
        this.validating = false;
      }
    },

    async sample() {
      this.sampleResult = null;

      const settingsStore = useConfigSettingsStore();
      const queryStore = useConfigQueryStore();

      let search = {
        query: {
          bool: {
            must: [
              {
                query_string: { 
                  query: queryStore.queryString || `${settingsStore.timeField}:*` 
                }
              }
            ]
          }
        },
        sort: [{ [settingsStore.timeField]: { order: 'desc' } }],
        size: 1
      };

      try {
        const axios = (await import('axios')).default;
        let res = await axios.post(`/api/search/${settingsStore.wildcardIndex}`, search);
        
        if (res.data && res.data.hits && res.data.hits.hits[0] && res.data.hits.hits[0]._source) {
          this.sampleResult = res.data.hits.hits[0]._source;
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
});