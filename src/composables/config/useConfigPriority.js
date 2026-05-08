import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigPriority() {

  // store
  const store = useStore();

  // ===== usePriority =====
  const usePriority = computed({
    get: () => {
      return store.state.config.alert.usePriority ||
            !!store.state.config.alert.configPriority;
    },
    set: (value) => {
      store.commit('config/alert/UPDATE_USE_PRIORITY', value);
    }
  });

  // ===== configPriority =====
  const configPriority = computed({
    get: () => store.state.config.alert.configPriority,
    set: (value) => store.commit('config/alert/UPDATE_PRIORITY', value)
  });

  // ===== return =====
  return {
    usePriority,
    configPriority
  };
}
