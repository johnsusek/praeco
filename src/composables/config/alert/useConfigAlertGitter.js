import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigAlertGitter() {

  // store
  const store = useStore();

  // ===== gitterWebhookUrl =====
  const gitterWebhookUrl = computed({
    get: () => store.state.config.alert.gitterWebhookUrl,
    set: (v) => store.commit('config/alert/UPDATE_GITTER_WEBHOOK_URL', v)
  });

  // ===== gitterMsgLevel =====
  const gitterMsgLevel = computed({
    get: () => store.state.config.alert.gitterMsgLevel,
    set: (v) => store.commit('config/alert/UPDATE_GITTER_MSG_LEVEL', v)
  });

  // ===== gitterProxy =====
  const gitterProxy = computed({
    get: () => store.state.config.alert.gitterProxy,
    set: (v) => store.commit('config/alert/UPDATE_GITTER_PROXY', v)
  });

  // ===== return =====
  return {
    gitterWebhookUrl,
    gitterMsgLevel,
    gitterProxy
  };
}
