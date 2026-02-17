function initialState() {
  return {
    name: '',
    description: '',
    index: '',
    isEnabled: true,
    timeField: '',
    timeType: 'iso'
  };
}

export default {
  namespaced: true,

  state: {
    ...initialState()
  },

  getters: {
    wildcardIndex(state) {
      if (!state.index) return '';
      return state.index.replace(/%[Ymd]/g, '*');
    },

    strftime(state) {
      return state.index.includes('%Y') || state.index.includes('%m') || state.index.includes('%d');
    }
  },

  mutations: {

    RESET(state) {

      state = Object.assign(state, initialState()); // eslint-disable-line no-unused-vars
    },

    UPDATE_NAME(state, name) {
      state.name = name;
    },

    UPDATE_DESCRIPTION(state, description) {
      if (description) {
        state.description = description;
      } else {
        delete state['description'];
      }
    },

    UPDATE_INDEX(state, index) {
      state.index = index;
    },

    UPDATE_TIME_FIELD(state, timeField) {
      state.timeField = timeField;
    },

    UPDATE_TIME_TYPE(state, timeType) {
      state.timeType = timeType;
    },

    UPDATE_ENABLED(state, isEnabled) {
      state.isEnabled = isEnabled;
    }
  }
};
