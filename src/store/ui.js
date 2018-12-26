export default {
  namespaced: true,

  state: {
    sidebarWidth: '200px'
  },

  mutations: {
    UPDATE_SIDEBAR_WIDTH(state, payload) {
      state.sidebarWidth = payload;
    }
  }
};
