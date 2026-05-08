import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigAlertAlertmanager() {

  // store
  const store = useStore();

  // ===== alertmanagerAlertSubjectLabelname =====
  const alertmanagerAlertSubjectLabelname = computed({
    get: () => store.state.config.alert.alertmanagerAlertSubjectLabelname,
    set: (v) => store.commit('config/alert/UPDATE_ALERTMANAGER_ALERT_SUBJECT_LABELNAME', v)
  });

  // ===== alertmanagerAlertTextLabelname =====
  const alertmanagerAlertTextLabelname = computed({
    get: () => store.state.config.alert.alertmanagerAlertTextLabelname,
    set: (v) => store.commit('config/alert/UPDATE_ALERTMANAGER_ALERT_TEXT_LABELNAME', v)
  });

  // ===== alertmanagerCaCerts =====
  const alertmanagerCaCerts = computed({
    get: () => store.state.config.alert.alertmanagerCaCerts,
    set: (v) => store.commit('config/alert/UPDATE_ALERTMANAGER_CA_CERTS', v)
  });

  // ===== alertmanagerIgnoreSslErrors =====
  const alertmanagerIgnoreSslErrors = computed({
    get: () => store.state.config.alert.alertmanagerIgnoreSslErrors,
    set: (v) => store.commit('config/alert/UPDATE_ALERTMANAGER_IGNORE_SSL_ERRORS', v)
  });

  // ===== alertmanagerTimeout =====
  const alertmanagerTimeout = computed({
    get: () => store.state.config.alert.alertmanagerTimeout,
    set: (v) => store.commit('config/alert/UPDATE_ALERTMANAGER_TIMEOUT', v)
  });

  // ===== alertmanagerProxy =====
  const alertmanagerProxy = computed({
    get: () => store.state.config.alert.alertmanagerProxyalertmanagerProxy,
    set: (v) => store.commit('config/alert/UPDATE_ALERTMANAGER_PROXY', v)
  });

  // ===== alertmanagerBasicAuthLogin =====
  const alertmanagerBasicAuthLogin = computed({
    get: () => store.state.config.alert.alertmanagerBasicAuthLogin,
    set: (v) => store.commit('config/alert/UPDATE_ALERTMANAGER_BASIC_AUTH_LOGIN', v)
  });

  // ===== alertmanagerBasicAuthPassword =====
  const alertmanagerBasicAuthPassword = computed({
    get: () => store.state.config.alert.alertmanagerBasicAuthPassword,
    set: (v) => store.commit('config/alert/UPDATE_ALERTMANAGER_BASIC_AUTH_PASSWORD', v)
  });

  // ===== return =====
  return {
    alertmanagerAlertSubjectLabelname,
    alertmanagerAlertTextLabelname,
    alertmanagerCaCerts,
    alertmanagerIgnoreSslErrors,
    alertmanagerTimeout,
    alertmanagerProxy,
    alertmanagerBasicAuthLogin,
    alertmanagerBasicAuthPassword
  };
}
