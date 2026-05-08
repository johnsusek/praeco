import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigAlertYzj() {

  // store
  const store = useStore();

  // ===== yzjToken =====
  const yzjToken = computed({
    get: () => store.state.config.alert.yzjToken,
    set: (v) => store.commit('config/alert/UPDATE_YZJ_TOKEN', v)
  });

  // ===== yzjProxy =====
  const yzjProxy = computed({
    get: () => store.state.config.alert.yzjProxy,
    set: (v) => store.commit('config/alert/UPDATE_YZJ_PROXY', v)
  });

  // ===== yzjCustomLoc =====
  const yzjCustomLoc = computed({
    get: () => store.state.config.alert.yzjCustomLoc,
    set: (v) => store.commit('config/alert/UPDATE_YZJ_CUSTOM_LOC', v)
  });

  // ===== return =====
  return {
    yzjToken,
    yzjProxy,
    yzjCustomLoc
  };
}
