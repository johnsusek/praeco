import { ref, computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigAlertAmazonSns() {

  // store
  const store = useStore();

  // ===== groupSns (data → ref) =====
  const groupSns = ref(
    !store.state.config.alert.snsAwsProfile
      ? 'notProfile'
      : 'profile'
  );

  // ===== snsTopicArn =====
  const snsTopicArn = computed({
    get: () => store.state.config.alert.snsTopicArn,
    set: (value) =>
      store.commit('config/alert/UPDATE_SNS_TOPIC_ARN', value)
  });

  // ===== snsAwsAccessKeyId =====
  const snsAwsAccessKeyId = computed({
    get: () => store.state.config.alert.snsAwsAccessKeyId,
    set: (value) =>
      store.commit('config/alert/UPDATE_SNS_AWS_ACCESS_KEY_ID', value)
  });

  // ===== snsAwsSecretAccessKey =====
  const snsAwsSecretAccessKey = computed({
    get: () => store.state.config.alert.snsAwsSecretAccessKey,
    set: (value) =>
      store.commit('config/alert/UPDATE_SNS_AWS_SECRET_ACCESS_KEY', value)
  });

  // ===== snsAwsRegion =====
  const snsAwsRegion = computed({
    get: () => store.state.config.alert.snsAwsRegion,
    set: (value) =>
      store.commit('config/alert/UPDATE_SNS_AWS_REGION', value)
  });

  // ===== snsAwsProfile =====
  const snsAwsProfile = computed({
    get: () => store.state.config.alert.snsAwsProfile,
    set: (value) =>
      store.commit('config/alert/UPDATE_SNS_AWS_PROFILE', value)
  });

  // ===== methods =====
  const changeSns = () => {
    snsAwsAccessKeyId.value = '';
    snsAwsSecretAccessKey.value = '';
    snsAwsRegion.value = '';
    snsAwsProfile.value = '';
  };
  // ===== return =====
  return {
    groupSns,
    snsTopicArn,
    snsAwsAccessKeyId,
    snsAwsSecretAccessKey,
    snsAwsRegion,
    snsAwsProfile,
    changeSns
  };
}
