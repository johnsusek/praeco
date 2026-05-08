import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigAlertZabbix() {

  // store
  const store = useStore();

  // ===== zbxSenderHost =====
  const zbxSenderHost = computed({
    get: () => store.state.config.alert.zbxSenderHost,
    set: (v) => store.commit('config/alert/UPDATE_ZBX_SENDER_HOST', v)
  });

  // ===== zbxSenderPort =====
  const zbxSenderPort = computed({
    get: () => store.state.config.alert.zbxSenderPort,
    set: (v) => store.commit('config/alert/UPDATE_ZBX_SENDER_PORT', v)
  });

  // ===== zbxHost =====
  const zbxHost = computed({
    get: () => store.state.config.alert.zbxHost,
    set: (v) => store.commit('config/alert/UPDATE_ZBX_HOST', v)
  });

  // ===== zbxKey =====
  const zbxKey = computed({
    get: () => store.state.config.alert.zbxKey,
    set: (v) => store.commit('config/alert/UPDATE_ZBX_KEY', v)
  });

  // ===== zbxHostFromField =====
  const zbxHostFromField = computed({
    get: () => store.state.config.alert.zbxHostFromField,
    set: (v) => store.commit('config/alert/UPDATE_ZBX_HOST_FROM_FIELD', v)
  });

  // ===== return =====
  return {
    zbxSenderHost,
    zbxSenderPort,
    zbxHost,
    zbxKey,
    zbxHostFromField
  };
}
