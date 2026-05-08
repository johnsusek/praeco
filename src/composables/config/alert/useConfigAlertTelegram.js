import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigAlertTelegram() {

  // store
  const store = useStore();

  // ===== telegramRoomId =====
  const telegramRoomId = computed({
    get: () => store.state.config.alert.telegramRoomId,
    set: (v) => store.commit('config/alert/UPDATE_TELEGRAM_ROOM_ID', v)
  });

  // ===== telegramProxy =====
  const telegramProxy = computed({
    get: () => store.state.config.alert.telegramProxy,
    set: (v) => store.commit('config/alert/UPDATE_TELEGRAM_PROXY', v)
  });

  // ===== telegramProxyLogin =====
  const telegramProxyLogin = computed({
    get: () => store.state.config.alert.telegramProxyLogin,
    set: (v) => store.commit('config/alert/UPDATE_TELEGRAM_PROXY_LOGIN', v)
  });

  // ===== telegramProxyPass =====
  const telegramProxyPass = computed({
    get: () => store.state.config.alert.telegramProxyPass,
    set: (v) => store.commit('config/alert/UPDATE_TELEGRAM_PROXY_PASS', v)
  });

  // ===== telegramParseMode =====
  const telegramParseMode = computed({
    get: () => store.state.config.alert.telegramParseMode,
    set: (v) => store.commit('config/alert/UPDATE_TELEGRAM_PARSE_MODE', v)
  });

  // ===== telegramThreadId =====
  const telegramThreadId = computed({
    get: () => store.state.config.alert.telegramThreadId,
    set: (v) => store.commit('config/alert/UPDATE_TELEGRAM_THREAD_ID', v)
  });

  // ===== return =====
  return {
    telegramRoomId,
    telegramProxy,
    telegramProxyLogin,
    telegramProxyPass,
    telegramParseMode,
    telegramThreadId
  };
}
