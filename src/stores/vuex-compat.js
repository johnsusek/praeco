// Vuex-to-Pinia compatibility layer
// This provides a $store interface that maps Vuex calls to Pinia stores

import { 
  useConfigStore,
  useConfigSettingsStore,
  useConfigQueryStore,
  useConfigAlertStore,
  useUIStore,
  useServerStore,
  useMetadataStore,
  useAppConfigStore,
  useElastalertStore,
  useConfigsStore
} from './index.js';

export function createStoreCompat(app) {
  // Create store instances that will be reused
  let configStore, settingsStore, queryStore, alertStore, uiStore, serverStore, metadataStore, appConfigStore, elastalertStore, configsStore;

  // Initialize stores lazily to ensure Pinia is ready
  function getStores() {
    if (!configStore) {
      configStore = useConfigStore();
      settingsStore = useConfigSettingsStore();
      queryStore = useConfigQueryStore();
      alertStore = useConfigAlertStore();
      uiStore = useUIStore();
      serverStore = useServerStore();
      metadataStore = useMetadataStore();
      appConfigStore = useAppConfigStore();
      elastalertStore = useElastalertStore();
      configsStore = useConfigsStore();
    }
    
    return {
      configStore,
      settingsStore,
      queryStore,
      alertStore,
      uiStore,
      serverStore,
      metadataStore,
      appConfigStore,
      elastalertStore,
      configsStore
    };
  }

  return {
    // State getters - map to Pinia store state
    get state() {
      const stores = getStores();
      
      return {
        config: {
          path: stores.configStore.path,
          type: stores.configStore.type,
          valid: stores.configStore.valid,
          validating: stores.configStore.validating,
          validateError: stores.configStore.validateError,
          sampleResult: stores.configStore.sampleResult,
          settings: stores.settingsStore,
          query: stores.queryStore,
          alert: stores.alertStore
        },

        ui: stores.uiStore,
        server: stores.serverStore,
        metadata: stores.metadataStore,
        appconfig: stores.appConfigStore,
        elastalert: stores.elastalertStore,
        configs: stores.configsStore
      };
    },

    // Getters - map to Pinia getters
    getters: {
      'config/config': (forTest) => {
        const stores = getStores();
        return stores.configStore.config(forTest);
      },
      
      'config/yaml': (forTest) => {
        const stores = getStores();
        return stores.configStore.yaml(forTest);
      },

      // Query getters
      'config/query/queryString': () => {
        const stores = getStores();
        return stores.queryStore.queryString;
      },

      // Metadata getters
      'metadata/numberFieldsForCurrentConfig': () => {
        const stores = getStores();
        return stores.metadataStore.numberFieldsForCurrentConfig;
      },

      'metadata/dateFieldsForCurrentConfig': () => {
        const stores = getStores();
        return stores.metadataStore.dateFieldsForCurrentConfig;
      },

      'metadata/suggestedIndices': () => {
        const stores = getStores();
        return stores.metadataStore.suggestedIndices;
      },

      'metadata/typesForCurrentConfig': () => {
        const stores = getStores();
        return stores.metadataStore.typesForCurrentConfig;
      },

      'metadata/textFieldsForCurrentConfig': () => {
        const stores = getStores();
        return stores.metadataStore.textFieldsForCurrentConfig;
      },

      'metadata/fieldsForCurrentConfig': () => {
        const stores = getStores();
        return stores.metadataStore.fieldsForCurrentConfig;
      },

      'metadata/aggFieldsForCurrentConfig': () => {
        const stores = getStores();
        return stores.metadataStore.aggFieldsForCurrentConfig;
      },

      'metadata/templateFieldsForCurrentConfig': () => {
        const stores = getStores();
        return stores.metadataStore.templateFieldsForCurrentConfig;
      }
    },

    // Commit - map to Pinia actions
    commit(mutation, payload) {
      const [module, submodule, action] = mutation.split('/');
      const stores = getStores();
      
      if (module === 'config') {
        if (submodule === 'settings') {
          switch (action) {
            case 'UPDATE_NAME':
              stores.settingsStore.updateName(payload);
              break;
            case 'UPDATE_INDEX':
              stores.settingsStore.updateIndex(payload);
              break;
            case 'UPDATE_TIME_FIELD':
              stores.settingsStore.updateTimeField(payload);
              break;
            case 'UPDATE_ENABLED':
              stores.settingsStore.updateEnabled(payload);
              break;
            case 'UPDATE_DESCRIPTION':
              stores.settingsStore.updateDescription(payload);
              break;
            case 'UPDATE_TIME_TYPE':
              stores.settingsStore.updateTimeType(payload);
              break;
            // Add more settings mutations as needed
          }
        } else if (submodule === 'alert') {
          switch (action) {
            case 'UPDATE_ALERT':
              stores.alertStore.updateAlert(payload);
              break;
            case 'UPDATE_REALERT':
              stores.alertStore.updateRealert(payload);
              break;
            case 'UPDATE_AGGREGATION_SCHEDULE':
              stores.alertStore.updateAggregationSchedule(payload);
              break;
            case 'UPDATE_SUBJECT':
              stores.alertStore.updateSubject(payload);
              break;
            case 'UPDATE_BODY':
              stores.alertStore.updateBody(payload);
              break;
            // Add more alert mutations as needed
          }
        } else {
          // Direct config mutations
          switch (submodule) {
            case 'UPDATE_TYPE':
              stores.configStore.updateType(payload);
              break;
            case 'UPDATE_PATH':
              stores.configStore.updatePath(payload);
              break;
            // Add more config mutations as needed
          }
        }
      }
      
      // Add other module commits as needed
    },

    // Dispatch - map to Pinia actions
    async dispatch(action, payload) {
      const [module, actionName] = action.split('/');
      const stores = getStores();
      
      if (module === 'config') {
        switch (actionName) {
          case 'reset':
            return stores.configStore.reset();
          case 'load':
            return stores.configStore.load(payload);
          case 'save':
            return stores.configStore.save(payload);
          case 'validate':
            return stores.configStore.validate();
          case 'sample':
            return stores.configStore.sample();
        }
      }
      
      if (module === 'metadata') {
        switch (actionName) {
          case 'fetchMappings':
            return stores.metadataStore.fetchMappings(payload);
        }
      }
      
      // Add other module dispatches as needed
    }
  };
}