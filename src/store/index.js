import { useStorage } from '@vueuse/core';
import Vue from 'vue';
import Vuex from 'vuex';
// TODO: error  Dependency cycle via @/lib/logger.js:7  import/no-cycle
import configs from './configs';
import server from './server';
import metadata from './metadata';
import appconfig from './appconfig';
import elastalert from './elastalert';
import config from './config';
import ui from './ui';

Vue.use(Vuex);

// Create a Vuex plugin using VueUse for state persistence
function createVueUseStoragePlugin(options) {
  return store => {
    const { key, paths } = options;

    // Initialize storage with current state or stored value
    const storedValue = useStorage(key, null, window.localStorage, {
      serializer: {
        read: (v) => v ? JSON.parse(v) : null,
        write: (v) => JSON.stringify(v)
      }
    });

    // Restore state from storage on initialization
    if (storedValue.value) {
      store.replaceState(
        Object.assign({}, store.state, storedValue.value)
      );
    }

    // Subscribe to mutations and persist specified paths
    store.subscribe((mutation, state) => {
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
