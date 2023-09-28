<template>
  <div>
    <el-radio id="groupSes" v-model="groupSes" :disabled="viewOnly" label="profile" border @change="changeSes">
      Profile
    </el-radio>
    <el-radio id="groupSes" v-model="groupSes" :disabled="viewOnly" label="notProfile" border @change="changeSes">
      NotProfile
    </el-radio>

    <div v-if="groupSes === 'notProfile'">
      <praeco-form-item label="SesAwsAccessKeyId" prop="sesAwsAccessKeyId" required>
        <el-input id="sesAwsAccessKeyId" v-model="sesAwsAccessKeyId" :disabled="viewOnly" />
        <label>An access key to connect to Amazon SES with.</label>
      </praeco-form-item>
      <praeco-form-item label="SesAwsSecretAccessKey" prop="sesAwsSecretAccessKey" required>
        <el-input id="sesAwsSecretAccessKey" v-model="sesAwsSecretAccessKey" :disabled="viewOnly" />
        <label>The secret key associated with the access key.</label>
      </praeco-form-item>
      <praeco-form-item label="SesAwsRegion" prop="sesAwsRegion" required>
        <el-input id="sesAwsRegion" v-model="sesAwsRegion" :disabled="viewOnly" />
        <label>The AWS region in which the Amazon SES resource is located. For example, us-east-1</label>
      </praeco-form-item>
    </div>
    <div v-if="groupSes === 'profile'">
      <praeco-form-item label="SesAwsProfile" prop="sesAwsProfile" required>
        <el-input id="sesAwsProfile" v-model="sesAwsProfile" :disabled="viewOnly" />
        <label>The AWS profile to use. If none specified, the default will be used.</label>
      </praeco-form-item>
    </div>

    <praeco-form-item
      v-if="!viewOnly || sesFromAddr"
      :value="sesFromAddr"
      label="From address"
      prop="sesFromAddr">
      <el-input v-model="sesFromAddr" :disabled="viewOnly" />
      <label>
        This sets the From header in the email.
        By default, the from address is ElastAlert2@
        and the domain will be set by the smtp server.
      </label>
    </praeco-form-item>

    <praeco-form-item
      v-if="!viewOnly || sesEmailReplyTo"
      :value="sesEmailReplyTo"
      label="Reply to"
      prop="sesEmailReplyTo">
      <el-input v-model="sesEmailReplyTo" :disabled="viewOnly" />
      <label>
        This sets the Reply-To header in the email.
        By default, the from address is ElastAlert2@ and the
        domain will be set by the smtp server.
      </label>
    </praeco-form-item>

    <el-form-item label="To" prop="sesEmail" required>
      <el-input v-model="sesEmail" :disabled="viewOnly" />
      <label>Comma separated list of email addresses</label>
    </el-form-item>

    <el-form-item v-if="!viewOnly || sesCc" label="CC" prop="sesCc">
      <el-input v-model="sesCc" :disabled="viewOnly" />
      <label>Comma separated list of email addresses</label>
    </el-form-item>

    <el-form-item v-if="!viewOnly || sesBcc" label="BCC" prop="sesBcc">
      <el-input v-model="sesBcc" :disabled="viewOnly" />
      <label>Comma separated list of email addresses</label>
    </el-form-item>

    <el-form-item label="Email From Field" prop="sesEmailFromField">
      <el-input v-model="sesEmailFromField" :disabled="viewOnly" />
    </el-form-item>

    <el-form-item label="Email Add Domain" prop="sesEmailAddDomain">
      <el-input v-model="sesEmailAddDomain" :disabled="viewOnly" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: ['viewOnly'],

  data() {
    let groupSesValue = 'profile';
    if (typeof this.$store.state.config.alert.sesAwsProfile === 'undefined' || this.$store.state.config.alert.sesAwsProfile === '') {
      groupSesValue = 'notProfile';
    }
    return {
      groupSes: groupSesValue,
    };
  },

  computed: {
    sesFromAddr: {
      get() {
        return this.$store.state.config.alert.sesFromAddr;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SES_FROM_ADDR', value);
      }
    },

    sesEmailReplyTo: {
      get() {
        return this.$store.state.config.alert.sesEmailReplyTo;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SES_EMAIL_REPLY_TO', value);
      }
    },

    sesEmail: {
      get() {
        return this.$store.state.config.alert.sesEmail;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SES_EMAIL', value);
      }
    },

    sesCc: {
      get() {
        return this.$store.state.config.alert.sesCc;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SES_CC', value);
      }
    },

    sesBcc: {
      get() {
        return this.$store.state.config.alert.sesBcc;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SES_BCC', value);
      }
    },

    sesEmailFromField: {
      get() {
        return this.$store.state.config.alert.sesEmailFromField;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SES_EMAIL_FROM_FIELD', value);
      }
    },

    sesEmailAddDomain: {
      get() {
        return this.$store.state.config.alert.sesEmailAddDomain;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SES_EMAIL_ADD_DOMAIN', value);
      }
    },

    sesAwsAccessKeyId: {
      get() {
        return this.$store.state.config.alert.sesAwsAccessKeyId;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SES_AWS_ACCESS_KEY_ID',
          value
        );
      }
    },

    sesAwsSecretAccessKey: {
      get() {
        return this.$store.state.config.alert.sesAwsSecretAccessKey;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SES_AWS_SECRET_ACCESS_KEY',
          value
        );
      }
    },

    sesAwsRegion: {
      get() {
        return this.$store.state.config.alert.sesAwsRegion;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SES_AWS_REGION',
          value
        );
      }
    },

    sesAwsProfile: {
      get() {
        return this.$store.state.config.alert.sesAwsProfile;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SES_AWS_PROFILE',
          value
        );
      }
    }
  },

  methods: {
    changeSes() {
      this.sesAwsAccessKeyId = '';
      this.sesAwsSecretAccessKey = '';
      this.sesAwsRegion = '';
      this.sesAwsProfile = '';
    }
  }
};
</script>

<style lang="scss">

</style>
