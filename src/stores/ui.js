import { defineStore } from 'pinia';

export const useUIStore = defineStore('ui', {
  state: () => ({
    sidebarWidth: [20, 80]
  }),

  actions: {
    updateSidebarWidth(payload) {
      this.sidebarWidth = payload;
    }
  },

  persist: {
    key: 'praeco-ui',
    storage: localStorage
  }
});