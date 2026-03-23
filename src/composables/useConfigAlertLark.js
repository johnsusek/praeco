import { computed, getCurrentInstance } from 'vue';

export function useConfigAlertLark() {
  const { proxy } = getCurrentInstance();

  // ===== computed (Vuex) =====
  const larkBotId = computed({
    get: () => proxy.$store.state.config.alert.larkBotId,
    set: (v) => proxy.$store.commit('config/alert/UPDATE_LARK_BOT_ID', v)
  });

  // ===== return =====
  return {
    larkBotId
  };
}
