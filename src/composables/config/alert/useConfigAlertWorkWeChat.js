import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigAlertWorkWeChat() {

  // store
  const store = useStore();

  // ===== workWechatBotId =====
  const workWechatBotId = computed({
    get: () => store.state.config.alert.workWechatBotId,
    set: (v) => store.commit('config/alert/UPDATE_WORK_WECHAT_BOT_ID', v)
  });

  // ===== workWechatMsgtype =====
  const workWechatMsgtype = computed({
    get: () => store.state.config.alert.workWechatMsgtype,
    set: (v) => store.commit('config/alert/UPDATE_WORK_WECHAT_MSGTYPE', v)
  });

  // ===== return =====
  return {
    workWechatBotId,
    workWechatMsgtype
  };
}
