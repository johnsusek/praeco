import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigAlertDatadog() {

  // store
  const store = useStore();

  // ===== datadogApiUrl =====
  const datadogApiUrl = computed({
    get: () => store.state.config.alert.datadogApiUrl,
    set: (v) => store.commit('config/alert/UPDATE_DATADOG_API_URL', v)
  });

  // ===== datadogApiKey =====
  const datadogApiKey = computed({
    get: () => store.state.config.alert.datadogApiKey,
    set: (v) => store.commit('config/alert/UPDATE_DATADOG_API_KEY', v)
  });

  // ===== datadogAppKey =====
  const datadogAppKey = computed({
    get: () => store.state.config.alert.datadogAppKey,
    set: (v) => store.commit('config/alert/UPDATE_DATADOG_APP_KEY', v)
  });

  // ===== return =====
  return {
    datadogApiUrl,
    datadogApiKey,
    datadogAppKey
  };
}
