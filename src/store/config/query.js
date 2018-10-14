import { luceneSyntaxFromQueryBuilder } from '@/lib/luceneSyntaxBuilder.js';

function initialState() {
  return {
    tree: {
      logicalOperator: 'all',
      children: []
    }
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
    }
  },

  getters: {
    queryString(state) {
      return luceneSyntaxFromQueryBuilder(state.tree);
    }
  }
};
