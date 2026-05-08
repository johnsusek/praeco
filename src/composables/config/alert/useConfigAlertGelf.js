import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigAlertGelf() {

  // store
  const store = useStore();

  // ===== gelfType =====
  const gelfType = computed({
    get: () => store.state.config.alert.gelfType,
    set: (v) => store.commit('config/alert/UPDATE_GELF_TYPE', v)
  });

  // ===== gelfEndpoint =====
  const gelfEndpoint = computed({
    get: () => store.state.config.alert.gelfEndpoint,
    set: (v) => store.commit('config/alert/UPDATE_GELF_ENDPOINT', v)
  });

  // ===== gelfHttpIgnoreSslErrors =====
  const gelfHttpIgnoreSslErrors = computed({
    get: () => store.state.config.alert.gelfHttpIgnoreSslErrors,
    set: (v) => store.commit('config/alert/UPDATE_GELF_HTTP_IGNORE_SSL_ERRORS', v)
  });

  // ===== gelfHost =====
  const gelfHost = computed({
    get: () => store.state.config.alert.gelfHost,
    set: (v) => store.commit('config/alert/UPDATE_GELF_HOST', v)
  });

  // ===== gelfPort =====
  const gelfPort = computed({
    get: () => store.state.config.alert.gelfPort,
    set: (v) => store.commit('config/alert/UPDATE_GELF_PORT', v)
  });

  // ===== gelfLogLevel =====
  const gelfLogLevel = computed({
    get: () => store.state.config.alert.gelfLogLevel,
    set: (v) => store.commit('config/alert/UPDATE_GELF_LOG_LEVEL', v)
  });

  // ===== gelfCaCert =====
  const gelfCaCert = computed({
    get: () => store.state.config.alert.gelfCaCert,
    set: (v) => store.commit('config/alert/UPDATE_GELF_CA_CERT', v)
  });

  // ===== gelfTimeout =====
  const gelfTimeout = computed({
    get: () => store.state.config.alert.gelfTimeout,
    set: (v) => store.commit('config/alert/UPDATE_GELF_TIMEOUT', v)
  });

  // ===== return =====
  return {
    gelfType,
    gelfEndpoint,
    gelfHttpIgnoreSslErrors,
    gelfHost,
    gelfPort,
    gelfLogLevel,
    gelfCaCert,
    gelfTimeout
  };
}
