import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigAlertLark() {

  // store
  const store = useStore();

  // ===== larkBotId =====
  const larkBotId = computed({
    get: () => store.state.config.alert.larkBotId,
    set: (v) => store.commit('config/alert/UPDATE_LARK_BOT_ID', v)
  });

  // ===== return =====
  return {
    larkBotId
  };
}
