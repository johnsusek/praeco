import { defineStore } from 'pinia';

export const useAppconfigStore = defineStore('appconfig', {
  state: () => ({
    config: {}
  }),

  actions: {
    setAppConfig(payload) {
      this.config = payload;
    }
  }
});
