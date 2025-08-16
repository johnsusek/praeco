export default {
  namespaced: true,

  state: {
    sidebarWidth: [20, 80]
  },

  mutations: {
    UPDATE_SIDEBAR_WIDTH(state, payload) {
      state.sidebarWidth = payload;
    }
  }
};
