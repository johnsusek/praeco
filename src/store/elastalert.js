import axios from 'axios';
import networkError from '../lib/networkError.js';

export default {
  namespaced: true,

  state: {
    bufferTime: null,
    runEvery: null
  },

  mutations: {
    FETCHED_CONFIG(state, payload) {
      state.bufferTime = payload.bufferTime;
      state.runEvery = payload.runEvery;
    }
  },

  actions: {
    async fetchConfig({ commit }) {
      try {
        let res = await axios.get('/api/config');
        commit('FETCHED_CONFIG', res.data);
      } catch (error) {
        networkError(error);
      }
    }
  }
};
