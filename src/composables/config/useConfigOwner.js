import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigOwner() {

  // store
  const store = useStore();

  // ===== useOwner =====
  const useOwner = computed({
    get: () => {
      return store.state.config.alert.useOwner ||
            !!store.state.config.alert.configOwner;
    },
    set: (value) => {
      store.commit('config/alert/UPDATE_USE_OWNER', value);
    }
  });

  // ===== configOwner =====
  const configOwner = computed({
    get: () => store.state.config.alert.configOwner,
    set: (value) => store.commit('config/alert/UPDATE_OWNER', value)
  });

  // ===== return =====
  return {
    useOwner,
    configOwner
  };
}
