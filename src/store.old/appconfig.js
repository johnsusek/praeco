export default {
  namespaced: true,
  state: {
    config: {}
  },
  mutations: {
    SET_APP_CONFIG(state, payload) {
      state.config = payload;
    }
  }
};
