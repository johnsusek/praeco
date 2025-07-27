import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

const pinia = createPinia();

// Add persistence plugin
pinia.use(createPersistedState({
  storage: localStorage,
  key: id => `praeco-${id}`
}));

export default pinia;

// Export stores for easy importing
export { useUIStore } from './ui.js';
export { useServerStore } from './server.js';
export { useMetadataStore } from './metadata.js';
export { useAppConfigStore } from './appconfig.js';
export { useElastalertStore } from './elastalert.js';
export { useConfigsStore } from './configs.js';
export { useConfigStore } from './config.js';