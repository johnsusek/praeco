import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigAlertPagerTree() {

  // store
  const store = useStore();

  // ===== pagertreeIntegrationUrl =====
  const pagertreeIntegrationUrl = computed({
    get: () => store.state.config.alert.pagertreeIntegrationUrl,
    set: (v) => store.commit('config/alert/UPDATE_PAGERTREE_INTEGRATION_URL', v)
  });

  // ===== pagertreeProxy =====
  const pagertreeProxy = computed({
    get: () => store.state.config.alert.pagertreeProxy,
    set: (v) => store.commit('config/alert/UPDATE_PAGERTREE_PROXY', v)
  });

  // ===== return =====
  return {
    pagertreeIntegrationUrl,
    pagertreeProxy
  };
}
