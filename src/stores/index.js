import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(createPersistedState({
  storage: localStorage,
  auto: true
}));

export default pinia;

export { useAppconfigStore } from './appconfig.js';
export { useUiStore } from './ui.js';
export { useServerStore } from './server.js';
export { useElastalertStore } from './elastalert.js';
export { useMetadataStore } from './metadata.js';
export { useConfigsStore } from './configs.js';
export { useConfigSettingsStore } from './config/settings.js';
export { useConfigQueryStore } from './config/query.js';
// Additional stores will be exported here as they are converted
