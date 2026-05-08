import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigDescription() {

  // store
  const store = useStore();

  // ===== useDescription =====
  const useDescription = computed({
    get: () => {
      return store.state.config.alert.useDescription ||
            !!store.state.config.alert.configDescription;
    },
    set: (value) => {
      store.commit('config/alert/UPDATE_USE_DESCRIPTION', value);
    }
  });

  // ===== configDescription =====
  const configDescription = computed({
    get: () => store.state.config.alert.configDescription,
    set: (value) => store.commit('config/alert/UPDATE_DESCRIPTION', value)
  });

  // ===== return =====
  return {
    useDescription,
    configDescription
  };
}
