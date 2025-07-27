import { defineStore } from 'pinia';
import axios from 'axios';
import networkError from '../lib/networkError.js';

export const useElastalertStore = defineStore('elastalert', {
  state: () => ({
    bufferTime: null,
    runEvery: null
  }),

  actions: {
    fetchedConfig(payload) {
      this.bufferTime = payload.bufferTime;
      this.runEvery = payload.runEvery;
    },

    async fetchConfig() {
      try {
        let res = await axios.get('/api/config');
        this.fetchedConfig(res.data);
      } catch (error) {
        networkError(error);
      }
    }
  }
});