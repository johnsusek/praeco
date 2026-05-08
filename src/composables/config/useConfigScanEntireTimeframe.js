import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigScanEntireTimeframe() {

  // store
  const store = useStore();

  // ===== scanEntireTimeframe =====
  const scanEntireTimeframe = computed({
    get: () => store.state.config.alert.scanEntireTimeframe,
    set: (value) => store.commit('config/alert/UPDATE_SCAN_ENTIRE_TIMEFRAME', value)
  });

  // ===== return =====
  return {
    scanEntireTimeframe
  };
}
