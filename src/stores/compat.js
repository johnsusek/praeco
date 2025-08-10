// Transition helper to gradually migrate from Vuex to Pinia
// This allows components to work with both old and new systems during migration

import { 
  useAppconfigStore, 
  useUiStore, 
  useServerStore, 
  useElastalertStore, 
  useMetadataStore,
  useConfigsStore 
} from './index'

// Global store registry for Vue 2 compatibility
let storeRegistry = null

export function setupStoreRegistry() {
  if (storeRegistry) return storeRegistry
  
  storeRegistry = {
    appconfig: useAppconfigStore(),
    ui: useUiStore(),
    server: useServerStore(),
    elastalert: useElastalertStore(),
    metadata: useMetadataStore(),
    configs: useConfigsStore()
  }
  
  return storeRegistry
}

// Compatibility layer that mimics Vuex API for gradual migration
export const createVuexCompatLayer = () => {
  const stores = setupStoreRegistry()
  
  return {
    state: {
      get appconfig() { return { config: stores.appconfig.config } },
      get ui() { return { sidebarWidth: stores.ui.sidebarWidth } },
      get server() { return { version: stores.server.version, status: stores.server.status } },
      get elastalert() { return { bufferTime: stores.elastalert.bufferTime, runEvery: stores.elastalert.runEvery } },
      get metadata() { return { indices: stores.metadata.indices, mappings: stores.metadata.mappings } },
      get configs() { return { 
        templates: stores.configs.templates, 
        rules: stores.configs.rules, 
        tree: stores.configs.tree 
      }},
      // TODO: Add config store state when it's converted
    },
    
    getters: {
      // Metadata getters
      'metadata/fieldIsNumeric': (state) => (index, field) => stores.metadata.fieldIsNumeric(index, field),
      'metadata/typeForField': (state) => (index, field) => stores.metadata.typeForField(index, field),
      'metadata/suggestedIndices': (state) => stores.metadata.suggestedIndices,
      'metadata/textFieldsForCurrentConfig': (state) => stores.metadata.textFieldsForCurrentConfig,
      'metadata/numberFieldsForCurrentConfig': (state) => stores.metadata.numberFieldsForCurrentConfig,
      'metadata/dateFieldsForCurrentConfig': (state) => stores.metadata.dateFieldsForCurrentConfig,
      'metadata/templateFieldsForCurrentConfig': (state) => stores.metadata.templateFieldsForCurrentConfig,
      'metadata/fieldsForCurrentConfig': (state) => stores.metadata.fieldsForCurrentConfig,
      'metadata/aggFieldsForCurrentConfig': (state) => stores.metadata.aggFieldsForCurrentConfig,
      'metadata/typesForCurrentConfig': (state) => stores.metadata.typesForCurrentConfig,
      // TODO: Add config getters when config store is converted
    },
    
    commit(mutation, payload) {
      const [module, mutationName] = mutation.split('/')
      
      switch (mutation) {
        // Appconfig
        case 'appconfig/SET_APP_CONFIG':
          stores.appconfig.setAppConfig(payload)
          break
          
        // UI
        case 'ui/UPDATE_SIDEBAR_WIDTH':
          stores.ui.updateSidebarWidth(payload)
          break
          
        // Configs
        case 'configs/FETCHED_CONFIGS':
          stores.configs.fetchedConfigs(payload)
          break
        case 'configs/FETCHED_CONFIGS_TREE':
          stores.configs.fetchedConfigsTree(payload)
          break
        case 'configs/FETCHED_CONFIG':
          stores.configs.fetchedConfig(payload)
          break
        case 'configs/UPDATED_CONFIG':
          stores.configs.updatedConfig(payload)
          break
        case 'configs/DELETED_CONFIG':
          stores.configs.deletedConfig(payload)
          break
          
        // Metadata
        case 'metadata/FETCHED_INDICES':
          stores.metadata.setIndices(payload)
          break
        case 'metadata/FETCHED_MAPPINGS':
          stores.metadata.setMappings(payload)
          break
          
        // TODO: Add more mutations as stores are converted
        default:
          console.warn(`Unhandled mutation: ${mutation}`)
      }
    },
    
    async dispatch(action, payload) {
      const [module, actionName] = action.split('/')
      
      switch (action) {
        // Server
        case 'server/fetchVersion':
          return stores.server.fetchVersion()
        case 'server/fetchStatus':
          return stores.server.fetchStatus()
          
        // Elastalert
        case 'elastalert/fetchConfig':
          return stores.elastalert.fetchConfig()
          
        // Metadata
        case 'metadata/fetchIndices':
          return stores.metadata.fetchIndices()
        case 'metadata/fetchMappings':
          return stores.metadata.fetchMappings(payload)
          
        // Configs
        case 'configs/fetchConfig':
          return stores.configs.fetchConfig(payload)
        case 'configs/renameConfig':
          return stores.configs.renameConfig(payload)
        case 'configs/moveConfig':
          return stores.configs.moveConfig(payload)
        case 'configs/duplicateConfig':
          return stores.configs.duplicateConfig(payload)
        case 'configs/createConfig':
          return stores.configs.createConfig(payload)
        case 'configs/deleteConfig':
          return stores.configs.deleteConfig(payload)
        case 'configs/createFolder':
          return stores.configs.createFolder(payload)
        case 'configs/deleteFolder':
          return stores.configs.deleteFolder(payload)
        case 'configs/silenceRule':
          return stores.configs.silenceRule(payload)
        case 'configs/disableRule':
          return stores.configs.disableRule(payload)
        case 'configs/enableRule':
          return stores.configs.enableRule(payload)
          
        // TODO: Add more actions as stores are converted
        default:
          console.warn(`Unhandled action: ${action}`)
          return Promise.resolve()
      }
    }
  }
}