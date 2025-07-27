import { defineStore } from 'pinia';
import axios from 'axios';
import networkError from '../lib/networkError.js';

export const useServerStore = defineStore('server', {
  state: () => ({
    version: '',
    status: ''
  }),

  actions: {
    fetchedVersion(payload) {
      this.version = payload.version;
    },

    fetchedStatus(payload) {
      this.status = payload.status;
    },

    async fetchVersion() {
      try {
        let res = await axios.get('/api');
        this.fetchedVersion(res.data);
      } catch (error) {
        networkError(error);
      }
    },

    async fetchStatus() {
      try {
        let res = await axios.get('/api/status');
        this.fetchedStatus(res.data);
      } catch (error) {
        networkError(error);
      }
    }
  }
});