import { expect } from 'chai';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import ui from '@/store/ui';
import { useStorage } from '@vueuse/core';

describe('Store Persistence with VueUse', () => {
  let localVue;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should persist ui state to localStorage using VueUse', (done) => {
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
      key: 'test-praeco-vuex',
      paths: ['ui']
    });

    const store = new Vuex.Store({
      modules: {
        ui
      },
      plugins: [storagePlugin]
    });

    // Commit a mutation to update the ui state
    store.commit('ui/UPDATE_SIDEBAR_WIDTH', [30, 70]);

    // Give VueUse time to persist
    setTimeout(() => {
      // Check that the state was persisted to localStorage
      const persistedData = JSON.parse(localStorage.getItem('test-praeco-vuex'));
      expect(persistedData).to.deep.equal({
        ui: {
          sidebarWidth: [30, 70]
        }
      });
      done();
    }, 50);
  });

  it('should restore ui state from localStorage on initialization', () => {
    // Pre-populate localStorage with state
    localStorage.setItem('test-praeco-vuex-restore', JSON.stringify({
      ui: {
        sidebarWidth: [15, 85]
      }
    }));

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
      key: 'test-praeco-vuex-restore',
      paths: ['ui']
    });

    const store = new Vuex.Store({
      modules: {
        ui
      },
      plugins: [storagePlugin]
    });

    // Check that the state was restored from localStorage
    expect(store.state.ui.sidebarWidth).to.deep.equal([15, 85]);
  });
});
