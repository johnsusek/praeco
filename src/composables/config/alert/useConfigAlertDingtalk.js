import { ref, computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigAlertDingtalk() {

  // store
  const store = useStore();

  // ===== groupDingtalk (data → ref) =====
  const groupDingtalk = ref(
    store.state.config.alert.dingtalkMsgtype || 'text'
  );

  // ===== dingtalkAccessToken =====
  const dingtalkAccessToken = computed({
    get: () => store.state.config.alert.dingtalkAccessToken,
    set: (v) =>
      store.commit('config/alert/UPDATE_DINGTALK_ACCESS_TOKEN', v)
  });

  // ===== dingtalkMsgtype =====
  const dingtalkMsgtype = computed({
    get: () => store.state.config.alert.dingtalkMsgtype,
    set: (v) =>
      store.commit('config/alert/UPDATE_DINGTALK_MSGTYPE', v)
  });

  // ===== dingtalkSingleTitle =====
  const dingtalkSingleTitle = computed({
    get: () => store.state.config.alert.dingtalkSingleTitle,
    set: (v) =>
      store.commit('config/alert/UPDATE_DINGTALK_SINGLE_TITLE', v)
  });

  // ===== dingtalkSingleUrl =====
  const dingtalkSingleUrl = computed({
    get: () => store.state.config.alert.dingtalkSingleUrl,
    set: (v) =>
      store.commit('config/alert/UPDATE_DINGTALK_SINGLE_URL', v)
  });

  // ===== dingtalkBtnOrientation =====
  const dingtalkBtnOrientation = computed({
    get: () => store.state.config.alert.dingtalkBtnOrientation,
    set: (v) =>
      store.commit('config/alert/UPDATE_DINGTALK_BTN_ORIENTATION', v)
  });

  // ===== dingtalkSign =====
  const dingtalkSign = computed({
    get: () => store.state.config.alert.dingtalkSign,
    set: (v) =>
      store.commit('config/alert/UPDATE_DINGTALK_SIGN', v)
  });

  // ===== return =====
  return {
    groupDingtalk,
    dingtalkAccessToken,
    dingtalkMsgtype,
    dingtalkSingleTitle,
    dingtalkSingleUrl,
    dingtalkBtnOrientation,
    dingtalkSign
  };
}
