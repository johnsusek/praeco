import { computed, getCurrentInstance } from 'vue';

export function useConfigAlertExotel() {
  const { proxy } = getCurrentInstance();

  // ===== computed (Vuex) =====
  const exotelAccountSid = computed({
    get: () => proxy.$store.state.config.alert.exotelAccountSid,
    set: (v) => proxy.$store.commit('config/alert/UPDATE_EXOTEL_ACCOUNT_SID', v)
  });

  const exotelAuthToken = computed({
    get: () => proxy.$store.state.config.alert.exotelAuthToken,
    set: (v) => proxy.$store.commit('config/alert/UPDATE_EXOTEL_AUTH_TOKEN', v)
  });

  const exotelToNumber = computed({
    get: () => proxy.$store.state.config.alert.exotelToNumber,
    set: (v) => proxy.$store.commit('config/alert/UPDATE_EXOTEL_TO_NUMBER', v)
  });

  const exotelFromNumber = computed({
    get: () => proxy.$store.state.config.alert.exotelFromNumber,
    set: (v) => proxy.$store.commit('config/alert/UPDATE_EXOTEL_FROM_NUMBER', v)
  });

  const exotelMessageBody = computed({
    get: () => proxy.$store.state.config.alert.exotelMessageBody,
    set: (v) => proxy.$store.commit('config/alert/UPDATE_EXOTEL_MESSAGE_BODY', v)
  });

  // ===== return =====
  return {
    exotelAccountSid,
    exotelAuthToken,
    exotelToNumber,
    exotelFromNumber,
    exotelMessageBody
  };
}
