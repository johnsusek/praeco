<template>
  <div>
    <el-radio v-model="groupSqs" :disabled="viewOnly" label="profile" border @change="changeSqs">
      Profile
    </el-radio>
    <el-radio v-model="groupSqs" :disabled="viewOnly" label="notProfile" border @change="changeSqs">
      NotProfile
    </el-radio>

    <div v-if="groupSqs === 'notProfile'">
      <praeco-form-item label="sqs_queue_url" prop="sqsQueueUrl" required>
        <el-input v-model="sqsQueueUrl" :disabled="viewOnly" />
        <label>The URL of the SQS queue. For example, https://sqs.us-east-1.amazonaws.com/123456789/mysqs</label>
      </praeco-form-item>
      <praeco-form-item label="sqs_aws_access_key_id" prop="sqsAwsAccessKeyId" required>
        <el-input v-model="sqsAwsAccessKeyId" :disabled="viewOnly" />
        <label>An access key to connect to Amazon SQS with.</label>
      </praeco-form-item>
      <praeco-form-item label="sqs_aws_secret_access_key" prop="sqsAwsSecretAccessKey" required>
        <el-input v-model="sqsAwsSecretAccessKey" :disabled="viewOnly" />
        <label>The secret key associated with the access key.</label>
      </praeco-form-item>
      <praeco-form-item label="sqs_aws_region" prop="sqsAwsRegion" required>
        <el-input v-model="sqsAwsRegion" :disabled="viewOnly" />
        <label>The AWS region in which the Amazon SQS resource is located. For example, us-east-1</label>
      </praeco-form-item>
    </div>
    <div v-if="groupSqs === 'profile'">
      <praeco-form-item label="sqs_queue_url" prop="sqsQueueUrl" required>
        <el-input v-model="sqsQueueUrl" :disabled="viewOnly" />
        <label>The URL of the Amazon SQS queue. For example, https://sqs.us-east-1.amazonaws.com/123456789/mysqs</label>
      </praeco-form-item>
      <praeco-form-item label="sqs_aws_profile" prop="sqsAwsProfile" required>
        <el-input v-model="sqsAwsProfile" :disabled="viewOnly" />
        <label>The AWS profile to use. If none specified, the default will be used.</label>
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
    changeSqs() {
      this.SqsAwsAccessKeyId = '';
      this.SqsAwsSecretAccessKey = '';
      this.SqsAwsRegion = '';
      this.SqsAwsProfile = '';
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
