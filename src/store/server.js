import axios from 'axios';
import networkError from '../lib/networkError.js';

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
      try {
        let res = await axios.get('/api');
        commit('FETCHED_VERSION', res.data);
      } catch (error) {
        networkError(error);
      }
    },
    async fetchStatus({ commit }) {
      try {
        let res = await axios.get('/api/status');
        commit('FETCHED_STATUS', res.data);
      } catch (error) {
        networkError(error);
      }
    }
  }
};
