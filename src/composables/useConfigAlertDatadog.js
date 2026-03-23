import { computed, getCurrentInstance } from 'vue';

export function useConfigAlertDatadog() {
  const { proxy } = getCurrentInstance();

  // ===== computed (Vuex) =====
  const datadogApiKey = computed({
    get: () => proxy.$store.state.config.alert.datadogApiKey,
    set: (v) => proxy.$store.commit('config/alert/UPDATE_DATADOG_API_KEY', v)
  });

  const datadogAppKey = computed({
    get: () => proxy.$store.state.config.alert.datadogAppKey,
    set: (v) => proxy.$store.commit('config/alert/UPDATE_DATADOG_APP_KEY', v)
  });

  // ===== return =====
  return {
    datadogApiKey,
    datadogAppKey
  };
}
