import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigAlertFlashDuty() {

  // store
  const store = useStore();

  // ===== flashdutyIntegrationKey =====
  const flashdutyIntegrationKey = computed({
    get: () => store.state.config.alert.flashdutyIntegrationKey,
    set: (v) => store.commit('config/alert/UPDATE_FLASHDUTY_INTEGRATION_KEY', v)
  });

  // ===== flashdutyTitle =====
  const flashdutyTitle = computed({
    get: () => store.state.config.alert.flashdutyTitle,
    set: (v) => store.commit('config/alert/UPDATE_FLASHDUTY_TITLE', v)
  });

  // ===== flashdutyAlertKey =====
  const flashdutyAlertKey = computed({
    get: () => store.state.config.alert.flashdutyAlertKey,
    set: (v) => store.commit('config/alert/UPDATE_FLASHDUTY_ALERT_KEY', v)
  });

  // ===== flashdutyDescription =====
  const flashdutyDescription = computed({
    get: () => store.state.config.alert.flashdutyDescription,
    set: (v) => store.commit('config/alert/UPDATE_FLASHDUTY_DESCRIPTION', v)
  });

  // ===== flashdutyEventStatus =====
  const flashdutyEventStatus = computed({
    get: () => store.state.config.alert.flashdutyEventStatus,
    set: (v) => store.commit('config/alert/UPDATE_FLASHDUTY_EVENT_STATUS', v)
  });

  // ===== flashdutyCheck =====
  const flashdutyCheck = computed({
    get: () => store.state.config.alert.flashdutyCheck,
    set: (v) => store.commit('config/alert/UPDATE_FLASHDUTY_CHECK', v)
  });

  // ===== flashdutyService =====
  const flashdutyService = computed({
    get: () => store.state.config.alert.flashdutyService,
    set: (v) => store.commit('config/alert/UPDATE_FLASHDUTY_SERVICE', v)
  });

  // ===== flashdutyCluster =====
  const flashdutyCluster = computed({
    get: () => store.state.config.alert.flashdutyCluster,
    set: (v) => store.commit('config/alert/UPDATE_FLASHDUTY_CLUSTER', v)
  });

  // ===== flashdutyResource =====
  const flashdutyResource = computed({
    get: () => store.state.config.alert.flashdutyResource,
    set: (v) => store.commit('config/alert/UPDATE_FLASHDUTY_RESOURCE', v)
  });

  // ===== flashdutyMetric =====
  const flashdutyMetric = computed({
    get: () => store.state.config.alert.flashdutyMetric,
    set: (v) => store.commit('config/alert/UPDATE_FLASHDUTY_METRIC', v)
  });

  // ===== flashdutyGroup =====
  const flashdutyGroup = computed({
    get: () => store.state.config.alert.flashdutyGroup,
    set: (v) => store.commit('config/alert/UPDATE_FLASHDUTY_GROUP', v)
  });

  // ===== flashdutyEnv =====
  const flashdutyEnv = computed({
    get: () => store.state.config.alert.flashdutyEnv,
    set: (v) => store.commit('config/alert/UPDATE_FLASHDUTY_ENV', v)
  });

  // ===== flashdutyApp =====
  const flashdutyApp = computed({
    get: () => store.state.config.alert.flashdutyApp,
    set: (v) => store.commit('config/alert/UPDATE_FLASHDUTY_APP', v)
  });

  // ===== return =====
  return {
    flashdutyIntegrationKey,
    flashdutyTitle,
    flashdutyAlertKey,
    flashdutyDescription,
    flashdutyEventStatus,
    flashdutyCheck,
    flashdutyService,
    flashdutyCluster,
    flashdutyResource,
    flashdutyMetric,
    flashdutyGroup,
    flashdutyEnv,
    flashdutyApp
  };
}
