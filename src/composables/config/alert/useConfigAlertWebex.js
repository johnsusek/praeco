import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigAlertWebex() {

  // store
  const store = useStore();

  // ===== datadogApiKey =====
  const webexWebhookId = computed({
    get: () => store.state.config.alert.webexWebhookId,
    set: (v) => store.commit('config/alert/UPDATE_WEBEX_WEBHOOK_ID', v)
  });

  // ===== webexWebhookMsgtype =====
  const webexWebhookMsgtype = computed({
    get: () => store.state.config.alert.webexWebhookMsgtype,
    set: (v) => store.commit('config/alert/UPDATE_WEBEX_WEBHOOK_MSGTYPE', v)
  });

  // ===== return =====
  return {
    webexWebhookId,
    webexWebhookMsgtype
  };
}
