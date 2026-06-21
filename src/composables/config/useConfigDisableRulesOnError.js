import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigDisableRulesOnError() {

  // store
  const store = useStore();

  // ===== disableRulesOnError =====
  const disableRulesOnError = computed({
    get: () => store.state.config.alert.disableRulesOnError,
    set: (value) => store.commit('config/alert/UPDATE_DISABLE_RULES_ON_ERROR', value)
  });

  // ===== return =====
  return {
    disableRulesOnError
  };
}
