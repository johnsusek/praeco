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

export const useConfigQueryStore = defineStore('configQuery', {
  state: () => ({
    ...initialState()
  }),

  getters: {
    queryString(state) {
      if (state.type === 'manual') {
        return state.manual;
      }

      return luceneSyntaxFromQueryBuilder(state.tree);
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
