import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigAlertExotel() {

  // store
  const store = useStore();

  // ===== exotelAccountSid =====
  const exotelAccountSid = computed({
    get: () => store.state.config.alert.exotelAccountSid,
    set: (v) => store.commit('config/alert/UPDATE_EXOTEL_ACCOUNT_SID', v)
  });

  // ===== exotelAuthToken =====
  const exotelAuthToken = computed({
    get: () => store.state.config.alert.exotelAuthToken,
    set: (v) => store.commit('config/alert/UPDATE_EXOTEL_AUTH_TOKEN', v)
  });

  // ===== exotelToNumber =====
  const exotelToNumber = computed({
    get: () => store.state.config.alert.exotelToNumber,
    set: (v) => store.commit('config/alert/UPDATE_EXOTEL_TO_NUMBER', v)
  });

  // ===== exotelFromNumber =====
  const exotelFromNumber = computed({
    get: () => store.state.config.alert.exotelFromNumber,
    set: (v) => store.commit('config/alert/UPDATE_EXOTEL_FROM_NUMBER', v)
  });

  // ===== exotelMessageBody =====
  const exotelMessageBody = computed({
    get: () => store.state.config.alert.exotelMessageBody,
    set: (v) => store.commit('config/alert/UPDATE_EXOTEL_MESSAGE_BODY', v)
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
