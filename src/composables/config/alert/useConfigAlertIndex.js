import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigAlertIndex() {

  // store
  const store = useStore();

  // ===== indexerAlertsName =====
  const indexerAlertsName = computed({
    get: () => store.state.config.alert.indexerAlertsName,
    set: (v) => store.commit('config/alert/UPDATE_INDEXER_ALERTS_NAME', v)
  });

  // ===== indexerConnectionEsHost =====
  const indexerConnectionEsHost = computed({
    get: () => store.state.config.alert.indexerConnectionEsHost,
    set: (v) => store.commit('config/alert/UPDATE_INDEXER_CONNECTION_ES_HOST', v)
  });

  // ===== indexerConnectionEsPort =====
  const indexerConnectionEsPort = computed({
    get: () => store.state.config.alert.indexerConnectionEsPort,
    set: (v) => store.commit('config/alert/UPDATE_INDEXER_CONNECTION_ES_PORT', v)
  });

  // ===== indexerConnectionEsUsername =====
  const indexerConnectionEsUsername = computed({
    get: () => store.state.config.alert.indexerConnectionEsUsername,
    set: (v) => store.commit('config/alert/UPDATE_INDEXER_CONNECTION_ES_USERNAME', v)
  });

  // ===== indexerConnectionEsPassword =====
  const indexerConnectionEsPassword = computed({
    get: () => store.state.config.alert.indexerConnectionEsPassword,
    set: (v) => store.commit('config/alert/UPDATE_INDEXER_CONNECTION_ES_PASSWORD', v)
  });

  // ===== indexerConnectionUseSsl =====
  const indexerConnectionUseSsl = computed({
    get: () => store.state.config.alert.indexerConnectionUseSsl,
    set: (v) => store.commit('config/alert/UPDATE_INDEXER_CONNECTION_USE_SSL', v)
  });

  // ===== indexerConnectionVerifyCerts =====
  const indexerConnectionVerifyCerts = computed({
    get: () => store.state.config.alert.indexerConnectionVerifyCerts,
    set: (v) => store.commit('config/alert/UPDATE_INDEXER_CONNECTION_VERIFY_CERTS', v)
  });

  // ===== indexerConnectionSslShowWarn =====
  const indexerConnectionSslShowWarn = computed({
    get: () => store.state.config.alert.indexerConnectionSslShowWarn,
    set: (v) => store.commit('config/alert/UPDATE_INDEXER_CONNECTION_SSL_SHOW_WARN', v)
  });

  // ===== indexerConfig =====
  const indexerConfig = computed({
    get: () => store.state.config.alert.indexerConfig,
    set: (v) => store.commit('config/alert/UPDATE_INDEXER_CONFIG', v)
  });

  // ===== indexerAlertConfigKeys =====
  const indexerAlertConfigKeys = computed({
    get: () => store.state.config.alert.indexerAlertConfigKeys,
    set: (v) => store.commit('config/alert/UPDATE_INDEXER_ALERT_CONFIG_KEYS', v)
  });

  // ===== indexerAlertConfigValues =====
  const indexerAlertConfigValues = computed({
    get: () => store.state.config.alert.indexerAlertConfigValues,
    set: (v) => store.commit('config/alert/UPDATE_INDEXER_ALERT_CONFIG_VALUES', v)
  });

  // ===== return =====
  return {
    indexerAlertsName,
    indexerConnectionEsHost,
    indexerConnectionEsPort,
    indexerConnectionEsUsername,
    indexerConnectionEsPassword,
    indexerConnectionUseSsl,
    indexerConnectionVerifyCerts,
    indexerConnectionSslShowWarn,
    indexerConfig,
    indexerAlertConfigKeys,
    indexerAlertConfigValues
  };
}
