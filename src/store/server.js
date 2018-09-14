import axios from 'axios';

export default {
  namespaced: true,
  state: {
    version: '',
    status: ''
  },
  mutations: {
    FETCHED_VERSION(state, payload) {
      state.version = payload.version;
    },
    FETCHED_STATUS(state, payload) {
      state.status = payload.status;
    }
  },
  actions: {
    async fetchVersion({ commit }) {
      let res = await axios.get('/api/');
      commit('FETCHED_VERSION', res.data);
    },
    async fetchStatus({ commit }) {
      let res = await axios.get('/api/status');
      commit('FETCHED_STATUS', res.data);
    }
  }
};
