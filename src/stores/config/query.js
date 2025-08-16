import { defineStore } from 'pinia';
import { luceneSyntaxFromQueryBuilder } from '@/lib/luceneSyntaxBuilder.js';

function initialState() {
  return {
    tree: {
      logicalOperator: 'all',
      children: []
    },
    manual: '',
    type: 'tree'
  };
}

export const useConfigQueryStore = defineStore('config-query', {
  state: () => ({
    ...initialState()
  }),

  getters: {
    queryString(state) {
      if (state.type === 'manual') {
        return state.manual;
      }

      return luceneSyntaxFromQueryBuilder(state.tree);
    },

    // This returns the filter object used in the main config
    queryFilter() {
      const queryStr = this.queryString || 'timestamp:*';
      
      let qs = {
        query: queryStr
      };

      // For now, using generic filter structure
      // TODO: Add logic for different match types (new_term, etc.)
      return {
        filter: [
          {
            query: {
              query_string: qs
            }
          }
        ]
      };
    }
  },

  actions: {
    reset() {
      Object.assign(this, initialState());
    },

    updateTree(tree) {
      this.tree = tree;
    },

    updateManual(manual) {
      this.manual = manual;
    },

    updateType(type) {
      this.type = type;
    }
  }
});
