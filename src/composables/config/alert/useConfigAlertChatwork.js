import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigAlertChatwork() {

  // store
  const store = useStore();

  // ===== chatworkApikey =====
  const chatworkApikey = computed({
    get: () => store.state.config.alert.chatworkApikey,
    set: (v) => store.commit('config/alert/UPDATE_CHATWORK_API_KEY', v)
  });

  // ===== chatworkRoomId =====
  const chatworkRoomId = computed({
    get: () => store.state.config.alert.chatworkRoomId,
    set: (v) => store.commit('config/alert/UPDATE_CHATWORK_ROOM_ID', v)
  });

  // ===== chatworkProxy =====
  const chatworkProxy = computed({
    get: () => store.state.config.alert.chatworkProxy,
    set: (v) => store.commit('config/alert/UPDATE_CHATWORK_PROXY', v)
  });

  // ===== chatworkProxyLogin =====
  const chatworkProxyLogin = computed({
    get: () => store.state.config.alert.chatworkProxyLogin,
    set: (v) => store.commit('config/alert/UPDATE_CHATWORK_PROXY_LOGIN', v)
  });

  // ===== chatworkProxyPass =====
  const chatworkProxyPass = computed({
    get: () => store.state.config.alert.chatworkProxyPass,
    set: (v) => store.commit('config/alert/UPDATE_CHATWORK_PROXY_PASS', v)
  });

  // ===== return =====
  return {
    chatworkApikey,
    chatworkRoomId,
    chatworkProxy,
    chatworkProxyLogin,
    chatworkProxyPass
  };
}
