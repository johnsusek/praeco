
<template>
  <div>
    <el-radio id="groupSns" v-model="groupSns" :disabled="viewOnly" label="profile" border @change="changeSns">
      Profile
    </el-radio>
    <el-radio id="groupSns" v-model="groupSns" :disabled="viewOnly" label="notProfile" border @change="changeSns">
      NotProfile
    </el-radio>

    <div v-if="groupSns === 'notProfile'">
      <praeco-form-item label="TopicArn" prop="snsTopicArn" required>
        <el-input id="snsTopicArn" v-model="snsTopicArn" :disabled="viewOnly" @update:model-value="snsTopicArn = $event" />
        <label>The SNS topic’s ARN. For example, arn:aws:sns:us-east-1:123456789:somesnstopic</label>
      </praeco-form-item>
      <praeco-form-item label="SnsAwsAccessKeyId" prop="snsAwsAccessKeyId" required>
        <el-input id="snsAwsAccessKeyId" v-model="snsAwsAccessKeyId" :disabled="viewOnly" @update:model-value="snsAwsAccessKeyId = $event" />
        <label>An access key to connect to Amazon SNS with.</label>
      </praeco-form-item>
      <praeco-form-item label="SnsAwsSecretAccessKey" prop="snsAwsSecretAccessKey" required>
        <el-input id="snsAwsSecretAccessKey" v-model="snsAwsSecretAccessKey" :disabled="viewOnly" @update:model-value="snsAwsSecretAccessKey = $event" />
        <label>The secret key associated with the access key.</label>
      </praeco-form-item>
      <praeco-form-item label="SnsAwsRegion" prop="snsAwsRegion" required>
        <el-input id="snsAwsRegion" v-model="snsAwsRegion" :disabled="viewOnly" @update:model-value="snsAwsRegion = $event" />
        <label>The AWS region in which the Amazon SNS resource is located. For example, us-east-1</label>
      </praeco-form-item>
    </div>
    <div v-if="groupSns === 'profile'">
      <praeco-form-item label="TopicArn" prop="snsTopicArn" required>
        <el-input id="snsTopicArn" v-model="snsTopicArn" :disabled="viewOnly" @update:model-value="snsTopicArn = $event" />
        <label>The Amazon SNS topic’s ARN. For example, arn:aws:sns:us-east-1:123456789:somesnstopic</label>
      </praeco-form-item>
      <praeco-form-item label="SnsAwsProfile" prop="snsAwsProfile" required>
        <el-input id="snsAwsProfile" v-model="snsAwsProfile" :disabled="viewOnly" @update:model-value="snsAwsProfile = $event" />
        <label>The AWS profile to use. If none specified, the default will be used.</label>
      </praeco-form-item>
    </div>
  </div>
</template>

<script>

export default {
  props: ['viewOnly'],

  data() {
    let groupSnsValue = 'profile';
    if (typeof this.$store.state.config.alert.snsAwsProfile === 'undefined' || this.$store.state.config.alert.snsAwsProfile === '') {
      groupSnsValue = 'notProfile';
    }
    return {
      groupSns: groupSnsValue,
    };
  },

  computed: {
    snsTopicArn: {
      get() {
        return this.$store.state.config.alert.snsTopicArn;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SNS_TOPIC_ARN',
          value
        );
      }
    },

    snsAwsAccessKeyId: {
      get() {
        return this.$store.state.config.alert.snsAwsAccessKeyId;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SNS_AWS_ACCESS_KEY_ID',
          value
        );
      }
    },

    snsAwsSecretAccessKey: {
      get() {
        return this.$store.state.config.alert.snsAwsSecretAccessKey;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SNS_AWS_SECRET_ACCESS_KEY',
          value
        );
      }
    },

    snsAwsRegion: {
      get() {
        return this.$store.state.config.alert.snsAwsRegion;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SNS_AWS_REGION',
          value
        );
      }
    },

    snsAwsProfile: {
      get() {
        return this.$store.state.config.alert.snsAwsProfile;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SNS_AWS_PROFILE',
          value
        );
      }
    }
  },

  methods: {
    changeSns() {
      this.snsAwsAccessKeyId = '';
      this.snsAwsSecretAccessKey = '';
      this.snsAwsRegion = '';
      this.snsAwsProfile = '';
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
