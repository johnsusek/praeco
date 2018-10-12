import { luceneSyntaxFromQueryBuilder } from '@/lib/luceneSyntaxBuilder.js';

export default {
  namespaced: true,

  state: {
    tree: {
      logicalOperator: 'all',
      children: []
    }
  },

  mutations: {
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
