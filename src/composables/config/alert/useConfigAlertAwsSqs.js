import { ref, computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigAlertAwsSqs() {

  // store
  const store = useStore();

  // ===== groupSqs (data → ref) =====
  const groupSqs = ref(
    !store.state.config.alert.sqsAwsProfile
      ? 'notProfile'
      : 'profile'
  );

  // ===== sqsQueueUrl =====
  const sqsQueueUrl = computed({
    get: () => store.state.config.alert.sqsQueueUrl,
    set: (value) =>
      store.commit('config/alert/UPDATE_SQS_QUEUE_URL', value)
  });

  // ===== sqsAwsAccessKeyId =====
  const sqsAwsAccessKeyId = computed({
    get: () => store.state.config.alert.sqsAwsAccessKeyId,
    set: (value) =>
      store.commit('config/alert/UPDATE_SQS_AWS_ACCESS_KEY_ID', value)
  });

  // ===== sqsAwsSecretAccessKey =====
  const sqsAwsSecretAccessKey = computed({
    get: () => store.state.config.alert.sqsAwsSecretAccessKey,
    set: (value) =>
      store.commit('config/alert/UPDATE_SQS_AWS_SECRET_ACCESS_KEY', value)
  });

  // ===== sqsAwsRegion =====
  const sqsAwsRegion = computed({
    get: () => store.state.config.alert.sqsAwsRegion,
    set: (value) =>
      store.commit('config/alert/UPDATE_SQS_AWS_REGION', value)
  });

  // ===== sqsAwsProfile =====
  const sqsAwsProfile = computed({
    get: () => store.state.config.alert.sqsAwsProfile,
    set: (value) =>
      store.commit('config/alert/UPDATE_SQS_AWS_PROFILE', value)
  });

  // ===== methods =====
  const changeSqs = () => {
    sqsAwsAccessKeyId.value = '';
    sqsAwsSecretAccessKey.value = '';
    sqsAwsRegion.value = '';
    sqsAwsProfile.value = '';
  };

  // ===== return =====
  return {
    groupSqs,
    sqsQueueUrl,
    sqsAwsAccessKeyId,
    sqsAwsSecretAccessKey,
    sqsAwsRegion,
    sqsAwsProfile,
    changeSqs
  };
}
