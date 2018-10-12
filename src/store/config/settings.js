import Vue from 'vue';

export default {
  namespaced: true,

  state: {
    name: '',
    description: '',
    index: '',
    strftime: null
  },

  getters: {
    wildcardIndex(state) {
      return state.index.replace(/%[Ymd]/g, '*');
    }
  },

  mutations: {
    UPDATE_NAME(state, name) {
      state.name = name;
    },

    UPDATE_DESCRIPTION(state, description) {
      if (description) {
        state.description = description;
      } else {
        Vue.delete(state, 'description');
      }
    },

    UPDATE_INDEX(state, index) {
      state.index = index;
    },

    UPDATE_STRFTIME(state, strftime) {
      state.strftime = !!strftime;
    }
  }
};
