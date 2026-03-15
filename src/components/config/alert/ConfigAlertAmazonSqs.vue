<template>
  <div>
    <el-radio id="groupSqs" v-model="groupSqs" :disabled="viewOnly" label="profile" border @change="changeSns">
      Profile
    </el-radio>
    <el-radio id="groupSqs" v-model="groupSqs" :disabled="viewOnly" label="notProfile" border @change="changeSns">
      NotProfile
    </el-radio>

    <div v-if="groupSqs === 'notProfile'">
      <praeco-form-item label="sqs_queue_url" prop="sqsQueueUrl" required>
        <el-input id="sqsQueueUrl" :value="sqsQueueUrl" :disabled="viewOnly" @input="sqsQueueUrl = $event" />
      </praeco-form-item>
      <praeco-form-item label="sqs_aws_access_key_id" prop="sqsAwsAccessKeyId" required>
        <el-input id="sqsAwsAccessKeyId" :value="sqsAwsAccessKeyId" :disabled="viewOnly" @input="sqsAwsAccessKeyId = $event" />
      </praeco-form-item>
      <praeco-form-item label="sqs_aws_secret_access_key" prop="sqsAwsSecretAccessKey" required>
        <el-input id="sqsAwsSecretAccessKey" :value="sqsAwsSecretAccessKey" :disabled="viewOnly" @input="sqsAwsSecretAccessKey = $event" />
      </praeco-form-item>
      <praeco-form-item label="sqs_aws_region" prop="sqsAwsRegion" required>
        <el-input id="sqsAwsRegion" :value="sqsAwsRegion" :disabled="viewOnly" @input="sqsAwsRegion = $event" />
      </praeco-form-item>
    </div>
    <div v-if="groupSqs === 'profile'">
      <praeco-form-item label="sqs_queue_url" prop="sqsQueueUrl" required>
        <el-input id="sqsQueueUrl" :value="sqsQueueUrl" :disabled="viewOnly" @input="sqsQueueUrl = $event" />
      </praeco-form-item>
      <praeco-form-item label="sqs_aws_profile" prop="sqsAwsProfile" required>
        <el-input id="sqsAwsProfile" :value="sqsAwsProfile" :disabled="viewOnly" @input="sqsAwsProfile = $event" />
      </praeco-form-item>
    </div>
  </div>
</template>

<script>

export default {
  props: ['viewOnly'],

  data() {
    let groupSqsValue = 'profile';
    if (typeof this.$store.state.config.alert.sqsAwsProfile === 'undefined' || this.$store.state.config.alert.sqsAwsProfile === '') {
      groupSqsValue = 'notProfile';
    }
    return {
      groupSqs: groupSqsValue,
    };
  },

  computed: {
    sqsQueueUrl: {
      get() {
        return this.$store.state.config.alert.sqsQueueUrl;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SQS_QUEUE_URL',
          value
        );
      }
    },

    sqsAwsAccessKeyId: {
      get() {
        return this.$store.state.config.alert.sqsAwsAccessKeyId;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SQS_AWS_ACCESS_KEY_ID',
          value
        );
      }
    },

    sqsAwsSecretAccessKey: {
      get() {
        return this.$store.state.config.alert.sqsAwsSecretAccessKey;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SQS_AWS_SECRET_ACCESS_KEY',
          value
        );
      }
    },

    sqsAwsRegion: {
      get() {
        return this.$store.state.config.alert.sqsAwsRegion;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SQS_AWS_REGION',
          value
        );
      }
    },

    sqsAwsProfile: {
      get() {
        return this.$store.state.config.alert.sqsAwsProfile;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SQS_AWS_PROFILE',
          value
        );
      }
    }
  },

  methods: {
    changeSns() {
      this.sqsAwsAccessKeyId = '';
      this.sqsAwsSecretAccessKey = '';
      this.sqsAwsRegion = '';
      this.sqsAwsProfile = '';
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
