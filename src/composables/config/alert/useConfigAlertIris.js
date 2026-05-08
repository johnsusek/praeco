import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigAlertIris() {

  // store
  const store = useStore();

  // ===== irisHost =====
  const irisHost = computed({
    get: () => store.state.config.alert.x,
    set: (v) => store.commit('config/alert/UPDATE_IRIS_HOST', v)
  });

  // ===== irisApiToken =====
  const irisApiToken = computed({
    get: () => store.state.config.alert.irisApiToken,
    set: (v) => store.commit('config/alert/UPDATE_IRIS_API_TOKEN', v)
  });

  // ===== irisCustomerId =====
  const irisCustomerId = computed({
    get: () => store.state.config.alert.irisCustomerId,
    set: (v) => store.commit('config/alert/UPDATE_IRIS_CUSTOMER_ID', v)
  });

  // ===== irisIgnoreSslErrors =====
  const irisIgnoreSslErrors = computed({
    get: () => store.state.config.alert.irisIgnoreSslErrors,
    set: (v) => store.commit('config/alert/UPDATE_IRIS_IGNORE_SSL_ERRORS', v)
  });

  // ===== irisCaCert =====
  const irisCaCert = computed({
    get: () => store.state.config.alert.irisCaCert,
    set: (v) => store.commit('config/alert/UPDATE_IRIS_CA_CERT', v)
  });

  // ===== irisDescription =====
  const irisDescription = computed({
    get: () => store.state.config.alert.irisDescription,
    set: (v) => store.commit('config/alert/UPDATE_IRIS_DESCRIPTION', v)
  });

  // ===== irisOverwriteTimestamp =====
  const irisOverwriteTimestamp = computed({
    get: () => store.state.config.alert.irisOverwriteTimestamp,
    set: (v) => store.commit('config/alert/UPDATE_IRIS_OVERWRITE_TIMESTAMP', v)
  });

  // ===== irisType =====
  const irisType = computed({
    get: () => store.state.config.alert.irisType,
    set: (v) => store.commit('config/alert/UPDATE_IRIS_TYPE', v)
  });

  // ===== irisCaseTemplateId =====
  const irisCaseTemplateId = computed({
    get: () => store.state.config.alert.irisCaseTemplateId,
    set: (v) => store.commit('config/alert/UPDATE_IRIS_CASE_TEMPLATE_ID', v)
  });

  // ===== irisAlertNote =====
  const irisAlertNote = computed({
    get: () => store.state.config.alert.irisAlertNote,
    set: (v) => store.commit('config/alert/UPDATE_IRIS_ALERT_NOTE', v)
  });

  // ===== irisAlertTags =====
  const irisAlertTags = computed({
    get: () => store.state.config.alert.irisAlertTags,
    set: (v) => store.commit('config/alert/UPDATE_IRIS_ALERT_TAGS', v)
  });

  // ===== irisAlertStatusId =====
  const irisAlertStatusId = computed({
    get: () => store.state.config.alert.irisAlertStatusId,
    set: (v) => store.commit('config/alert/UPDATE_IRIS_ALERT_STATUS_ID', v)
  });

  // ===== irisAlertSourceLink =====
  const irisAlertSourceLink = computed({
    get: () => store.state.config.alert.irisAlertSourceLink,
    set: (v) => store.commit('config/alert/UPDATE_IRIS_ALERT_SOURCE_LINK', v)
  });

  // ===== irisAlertSeverityId =====
  const irisAlertSeverityId = computed({
    get: () => store.state.config.alert.irisAlertSeverityId,
    set: (v) => store.commit('config/alert/UPDATE_IRIS_ALERT_SEVERITY_ID', v)
  });

  // ===== return =====
  return {
    irisHost,
    irisApiToken,
    irisCustomerId,
    irisIgnoreSslErrors,
    irisCaCert,
    irisDescription,
    irisOverwriteTimestamp,
    irisType,
    irisCaseTemplateId,
    irisAlertNote,
    irisAlertTags,
    irisAlertStatusId,
    irisAlertSourceLink,
    irisAlertSeverityId
  };
}
