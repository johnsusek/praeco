import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigAlertLineMessageApi() {

  // store
  const store = useStore();

  // ===== lineChannelAccessToken =====
  const lineChannelAccessToken = computed({
    get: () => store.state.config.alert.lineChannelAccessToken,
    set: (v) => store.commit('config/alert/UPDATE_LINE_CHANNEL_ACCESS_TOKEN', v)
  });

  // ===== lineTo =====
  const lineTo = computed({
    get: () => store.state.config.alert.lineTo,
    set: (v) => store.commit('config/alert/UPDATE_LINE_TO', v)
  });

  // ===== return =====
  return {
    lineChannelAccessToken,
    lineTo
  };
}
