export default {
  namespaced: true,
  state: {
    config: {}
  },
  mutations: {
    SET_CONFIG(state, payload) {
      state.config = payload;
    }
  }
};
