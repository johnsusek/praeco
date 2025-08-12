import { defineStore } from 'pinia';

function initialState() {
  return {
    name: '',
    description: '',
    index: '',
    isEnabled: true,
    timeField: '',
    timeType: 'iso'
  };
}

export const useConfigSettingsStore = defineStore('configSettings', {
  state: () => ({
    ...initialState()
  }),

  getters: {
    wildcardIndex(state) {
      if (!state.index) return '';
      return state.index.replace(/%[Ymd]/g, '*');
    },

    strftime(state) {
      return state.index.includes('%Y') || state.index.includes('%m') || state.index.includes('%d');
    }
  },

  actions: {
    reset() {
      Object.assign(this, initialState());
    },

    updateName(name) {
      this.name = name;
    },

    updateDescription(description) {
      if (description) {
        this.description = description;
      } else {
        delete this.description;
      }
    },

    updateIndex(index) {
      this.index = index;
    },

    updateTimeField(timeField) {
      this.timeField = timeField;
    },

    updateTimeType(timeType) {
      this.timeType = timeType;
    },

    updateEnabled(isEnabled) {
      this.isEnabled = isEnabled;
    }
  }
});
