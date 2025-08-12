import { defineStore } from 'pinia';
import axios from 'axios';
import networkError from '../lib/networkError.js';

export const useElastalertStore = defineStore('elastalert', {
  state: () => ({
    bufferTime: null,
    runEvery: null
  }),

  actions: {
    async fetchConfig() {
      try {
        let res = await axios.get('/api/config');
        this.bufferTime = res.data.bufferTime;
        this.runEvery = res.data.runEvery;
      } catch (error) {
        networkError(error);
      }
    }
  }
});
