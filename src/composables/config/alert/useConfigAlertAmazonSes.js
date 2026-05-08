import { ref, computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigAlertAmazonSes() {

  // store
  const store = useStore();

  // ===== data → ref =====
  const groupSes = ref(
    !store.state.config.alert.sesAwsProfile
      ? 'notProfile'
      : 'profile'
  );

  // ===== sesFromAddr =====
  const sesFromAddr = computed({
    get: () => store.state.config.alert.sesFromAddr,
    set: (v) => store.commit('config/alert/UPDATE_SES_FROM_ADDR', v)
  });

  // ===== sesEmailReplyTo =====
  const sesEmailReplyTo = computed({
    get: () => store.state.config.alert.sesEmailReplyTo,
    set: (v) => store.commit('config/alert/UPDATE_SES_EMAIL_REPLY_TO', v)
  });

  // ===== sesEmail =====
  const sesEmail = computed({
    get: () => store.state.config.alert.sesEmail,
    set: (v) => store.commit('config/alert/UPDATE_SES_EMAIL', v)
  });

  // ===== sesCc =====
  const sesCc = computed({
    get: () => store.state.config.alert.sesCc,
    set: (v) => store.commit('config/alert/UPDATE_SES_CC', v)
  });

  // ===== sesBcc =====
  const sesBcc = computed({
    get: () => store.state.config.alert.sesBcc,
    set: (v) => store.commit('config/alert/UPDATE_SES_BCC', v)
  });

  // ===== sesEmailFromField =====
  const sesEmailFromField = computed({
    get: () => store.state.config.alert.sesEmailFromField,
    set: (v) => store.commit('config/alert/UPDATE_SES_EMAIL_FROM_FIELD', v)
  });

  // ===== sesEmailAddDomain =====
  const sesEmailAddDomain = computed({
    get: () => store.state.config.alert.sesEmailAddDomain,
    set: (v) => store.commit('config/alert/UPDATE_SES_EMAIL_ADD_DOMAIN', v)
  });

  // ===== sesAwsAccessKeyId =====
  const sesAwsAccessKeyId = computed({
    get: () => store.state.config.alert.sesAwsAccessKeyId,
    set: (v) => store.commit('config/alert/UPDATE_SES_AWS_ACCESS_KEY_ID', v)
  });

  // ===== sesAwsSecretAccessKey =====
  const sesAwsSecretAccessKey = computed({
    get: () => store.state.config.alert.sesAwsSecretAccessKey,
    set: (v) =>
      store.commit('config/alert/UPDATE_SES_AWS_SECRET_ACCESS_KEY', v)
  });

  // ===== sesAwsRegion =====
  const sesAwsRegion = computed({
    get: () => store.state.config.alert.sesAwsRegion,
    set: (v) => store.commit('config/alert/UPDATE_SES_AWS_REGION', v)
  });

  // ===== sesAwsProfile =====
  const sesAwsProfile = computed({
    get: () => store.state.config.alert.sesAwsProfile,
    set: (v) => store.commit('config/alert/UPDATE_SES_AWS_PROFILE', v)
  });

  // ===== methods =====
  const changeSes = () => {
    sesAwsAccessKeyId.value = '';
    sesAwsSecretAccessKey.value = '';
    sesAwsRegion.value = '';
    sesAwsProfile.value = '';
  };

  // ===== return =====
  return {
    groupSes,
    sesFromAddr,
    sesEmailReplyTo,
    sesEmail,
    sesCc,
    sesBcc,
    sesEmailFromField,
    sesEmailAddDomain,
    sesAwsAccessKeyId,
    sesAwsSecretAccessKey,
    sesAwsRegion,
    sesAwsProfile,
    changeSes
  };
}
