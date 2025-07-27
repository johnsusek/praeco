import { defineStore } from 'pinia';

export const useAppConfigStore = defineStore('appconfig', {
  state: () => ({
    config: {}
  }),

  actions: {
    setAppConfig(payload) {
      this.config = payload;
    }
  }
});