<template>
  <div>
    <praeco-form-item
      v-if="!viewOnly || fromAddr"
      :value="fromAddr"
      label="From address"
      prop="fromAddr">
      <el-input v-model="fromAddr" :disabled="viewOnly" />
      <label>
        This sets the From header in the email.
        By default, the from address is ElastAlert2@
        and the domain will be set by the smtp server.
      </label>
    </praeco-form-item>

    <praeco-form-item
      v-if="!viewOnly || replyTo"
      :value="replyTo"
      label="Reply to"
      prop="replyTo">
      <el-input v-model="replyTo" :disabled="viewOnly" />
      <label>
        This sets the Reply-To header in the email.
        By default, the from address is ElastAlert2@ and the
        domain will be set by the smtp server.
      </label>
    </praeco-form-item>

    <el-form-item label="To" prop="email" required>
      <el-input v-model="email" :disabled="viewOnly" />
      <label>Comma separated list of email addresses</label>
    </el-form-item>

    <el-form-item v-if="!viewOnly || cc" label="CC" prop="cc">
      <el-input v-model="cc" :disabled="viewOnly" />
      <label>Comma separated list of email addresses</label>
    </el-form-item>

    <el-form-item v-if="!viewOnly || bcc" label="BCC" prop="bcc">
      <el-input v-model="bcc" :disabled="viewOnly" />
      <label>Comma separated list of email addresses</label>
    </el-form-item>

    <el-form-item label="SMTP SSL" prop="smtpSsl">
      <el-switch
        id="smtpSsl"
        v-model="smtpSsl"
        :disabled="viewOnly"
        @change="changeSmtpSsl" />
      <label>
        Connect the SMTP host using TLS, defaults to false.
        If smtp_ssl is not used, ElastAlert 2 will still attempt STARTTLS.
      </label>
    </el-form-item>

    <el-form-item label="SMTP Host" prop="smtpHost">
      <el-input v-model="smtpHost" :disabled="viewOnly" />
      <label>The SMTP host to use, defaults to localhost.</label>
    </el-form-item>

    <el-form-item label="SMTP Port" prop="smtpPort">
      <el-input-number id="smtpPort" v-model="smtpPort" :disabled="viewOnly" />
      <label>The port to use. Default is 25.</label>
    </el-form-item>

    <el-form-item label="SMTP Auth File" prop="smtpAuthFile">
      <el-input v-model="smtpAuthFile" :disabled="viewOnly" />
      <label>
        The path to a file which contains SMTP authentication credentials.
        The path can be either absolute or relative to the given rule.
        It should be YAML formatted and contain two fields, user and password.
        If this is not present, no authentication will be attempted.
      </label>
    </el-form-item>

    <el-form-item label="SMTP Key File" prop="smtpKeyFile">
      <el-input v-model="smtpKeyFile" :disabled="viewOnly" />
      <label>Connect the SMTP host using the given path to a TLS key file, default to None.</label>
    </el-form-item>

    <el-form-item label="SMTP Cert File" prop="smtpCertFile">
      <el-input v-model="smtpCertFile" :disabled="viewOnly" />
      <label> Connect the SMTP host using the given path to a TLS certificate file, default to None.</label>
    </el-form-item>

    <el-form-item label="Email From Field" prop="emailFromField">
      <el-input v-model="emailFromField" :disabled="viewOnly" />
    </el-form-item>

    <el-form-item label="Email Add Domain" prop="emailAddDomain">
      <el-input v-model="emailAddDomain" :disabled="viewOnly" />
    </el-form-item>
  </div>
</template>

<script>
import isEmail from 'validator/lib/isEmail';

let validateEmail = (rule, value, callback) => {
  if (!value || isEmail(value)) {
    callback();
  } else {
    callback(new Error('Invalid email address'));
  }
};

let validateEmailCommaSeparated = (rule, value, callback) => {
  let emails = [];

  if (value) emails = value.split(',');

  emails.forEach(email => {
    if (
      email
      && !isEmail(email.trim())
    ) {
      return callback(new Error('Invalid email address'));
    }
  });

  return callback();
};

export default {
  components: {
  },

  props: {
    viewOnly: Boolean
  },

  data() {
    return {
      rules: {
        fromAddr: [
          {
            validator: validateEmail,
            trigger: 'change'
          }
        ],
        replyTo: [
          {
            validator: validateEmail,
            trigger: 'change'
          }
        ],
        email: [
          {
            validator: validateEmailCommaSeparated,
            trigger: 'change'
          }
        ],
        cc: [
          {
            validator: validateEmailCommaSeparated,
            trigger: 'change'
          }
        ],
        bcc: [
          {
            validator: validateEmailCommaSeparated,
            trigger: 'change'
          }
        ]
      }
    };
  },

  computed: {
    fromAddr: {
      get() {
        return this.$store.state.config.alert.fromAddr;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_FROM_ADDR', value);
      }
    },

    replyTo: {
      get() {
        return this.$store.state.config.alert.replyTo;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_REPLY_TO', value);
      }
    },

    email: {
      get() {
        return this.$store.state.config.alert.email;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_EMAIL', value);
      }
    },

    cc: {
      get() {
        return this.$store.state.config.alert.cc;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_CC', value);
      }
    },

    bcc: {
      get() {
        return this.$store.state.config.alert.bcc;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_BCC', value);
      }
    },

    emailFromField: {
      get() {
        return this.$store.state.config.alert.emailFromField;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_EMAIL_FROM_FIELD', value);
      }
    },

    emailAddDomain: {
      get() {
        return this.$store.state.config.alert.emailAddDomain;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_EMAIL_ADD_DOMAIN', value);
      }
    },

    smtpSsl: {
      get() {
        return this.$store.state.config.alert.smtpSsl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SMTP_SSL', value);
      }
    },

    smtpHost: {
      get() {
        return this.$store.state.config.alert.smtpHost;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SMTP_HOST', value);
      }
    },

    smtpPort: {
      get() {
        return this.$store.state.config.alert.smtpPort;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SMTP_PORT', value);
      }
    },

    smtpAuthFile: {
      get() {
        return this.$store.state.config.alert.smtpAuthFile;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SMTP_AUTH_FILE', value);
      }
    },

    smtpKeyFile: {
      get() {
        return this.$store.state.config.alert.smtpKeyFile;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SMTP_KEY_FILE', value);
      }
    },

    smtpCertFile: {
      get() {
        return this.$store.state.config.alert.smtpCertFile;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SMTP_CERT_FILE', value);
      }
    },
  },

  methods: {
    changeSmtpSsl(val) {
      if (val) {
        this.smtpSsl = true;
      } else {
        this.smtpSsl = false;
      }
    }
  }
};
</script>

<style lang="scss">

</style>
