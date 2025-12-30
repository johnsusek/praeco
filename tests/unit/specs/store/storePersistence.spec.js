import { expect } from 'chai';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import ui from '@/store/ui';
import { createVueUseStoragePlugin } from '@/store';

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

    // VueUse updates storage reactively, so we need to wait a bit longer
    setTimeout(() => {
      // Check that the state was persisted to localStorage
      const persistedDataStr = localStorage.getItem('test-praeco-vuex');
      const persistedData = persistedDataStr ? JSON.parse(persistedDataStr) : null;
      expect(persistedData).to.deep.equal({
        ui: {
          sidebarWidth: [30, 70]
        }
      });
      done();
    }, 100);
  });

  it('should restore ui state from localStorage on initialization', () => {
    // Pre-populate localStorage with state
    localStorage.setItem('test-praeco-vuex-restore', JSON.stringify({
      ui: {
        sidebarWidth: [15, 85]
      }
    }));

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

  it('should persist initial state when localStorage is empty', (done) => {
    // Ensure localStorage is empty
    localStorage.clear();
    
    // Verify localStorage is truly empty for this key
    expect(localStorage.getItem('test-praeco-vuex-initial')).to.be.null;

    const storagePlugin = createVueUseStoragePlugin({
      key: 'test-praeco-vuex-initial',
      paths: ['ui']
    });

    const store = new Vuex.Store({
      modules: {
        ui
      },
      plugins: [storagePlugin]
    });

    // Wait for VueUse to persist the initial state
    setTimeout(() => {
      // Verify the store still has the initial state
      expect(store.state.ui.sidebarWidth).to.deep.equal([20, 80]);
      
      // Check that the initial state was persisted to localStorage
      const persistedDataStr = localStorage.getItem('test-praeco-vuex-initial');
      const persistedData = persistedDataStr ? JSON.parse(persistedDataStr) : null;

      expect(persistedData).to.deep.equal({
        ui: {
          sidebarWidth: [20, 80] // Default initial state from ui.js
        }
      });
      done();
    }, 100);
  });
});
