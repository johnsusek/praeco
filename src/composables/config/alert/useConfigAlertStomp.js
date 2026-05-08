import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigAlertStomp() {

  // store
  const store = useStore();

  // ===== stompHostname =====
  const stompHostname = computed({
    get: () => store.state.config.alert.stompHostname,
    set: (v) => store.commit('config/alert/UPDATE_STOMP_HOSTNAME', v)
  });

  // ===== stompHostport =====
  const stompHostport = computed({
    get: () => store.state.config.alert.stompHostport,
    set: (v) => store.commit('config/alert/UPDATE_STOMP_HOSTPORT', v)
  });

  // ===== stompLogin =====
  const stompLogin = computed({
    get: () => store.state.config.alert.stompLogin,
    set: (v) => store.commit('config/alert/UPDATE_STOMP_LOGIN', v)
  });

  // ===== stompPassword =====
  const stompPassword = computed({
    get: () => store.state.config.alert.stompPassword,
    set: (v) => store.commit('config/alert/UPDATE_STOMP_PASSWORD', v)
  });

  // ===== stompDestination =====
  const stompDestination = computed({
    get: () => store.state.config.alert.stompDestination,
    set: (v) => store.commit('config/alert/UPDATE_STOMP_DESTINATION', v)
  });

  // ===== return =====
  return {
    stompHostname,
    stompHostport,
    stompLogin,
    stompPassword,
    stompDestination
  };
}
