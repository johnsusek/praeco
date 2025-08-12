// Example of how RuleView.vue would be updated to use Pinia stores

// BEFORE (Vuex):
// computed: {
//   rule() {
//     return this.$store.state.configs.rules[this.id] || {};
//   },
//   yaml() {
//     if (!this.name) return false;
//     return this.$store.getters['config/yaml']();
//   },
//   name() {
//     return this.$store.state.config.settings.name;
//   },
//   isEnabled() {
//     return this.$store.state.config.settings.isEnabled;
//   }
// },
// methods: {
//   async rename() {
//     let res = await this.$store.dispatch('configs/renameConfig', {
//       config: this.$store.getters['config/config'](),
//       newName: this.newName.trim(),
//       type: 'rules'
//     });
//   }
// }

// AFTER (Pinia):
import { useConfigsStore, useConfigSettingsStore } from '@/stores';
import { mapState, mapActions } from '@/stores/helpers';

export default {
  // ... other component options

  computed: {
    // Option 1: Using helper functions
    ...mapState(useConfigsStore, {
      rule(store) {
        return store.rules[this.id] || {};
      }
    }),
    ...mapState(useConfigSettingsStore, ['name', 'isEnabled']),

    // Option 2: Direct store access
    configsStore() {
      return useConfigsStore();
    },
    settingsStore() {
      return useConfigSettingsStore();
    },

    // Option 3: Individual computed properties
    yaml() {
      if (!this.name) return false;
      // This would need to be updated when config store with yaml getter is converted
      return this.configStore.getYaml?.() || '';
    }
  },

  methods: {
    // Option 1: Using helper functions
    ...mapActions(useConfigsStore, ['renameConfig']),

    // Option 2: Direct method calls
    async rename() {
      const configsStore = useConfigsStore();
      let res = await configsStore.renameConfig({
        config: this.configStore.getConfig?.() || {},
        newName: this.newName.trim(),
        type: 'rules'
      });
      // ... rest of the method
    }
  }
};
