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

export default {
  namespaced: true,

  state: {
    ...initialState()
  },

  mutations: {
    /*eslint-disable */
    RESET(state) {
      /* eslint-enable */
      state = Object.assign(state, initialState());
    },

    UPDATE_TREE(state, tree) {
      state.tree = tree;
    },

    UPDATE_MANUAL(state, manual) {
      state.manual = manual;
    },

    UPDATE_TYPE(state, type) {
      state.type = type;
    }
  },

  getters: {
    queryString(state) {
      if (state.type === 'manual') {
        return state.manual;
      }

      return luceneSyntaxFromQueryBuilder(state.tree);
    }
  }
};
