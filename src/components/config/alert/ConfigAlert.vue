<template>
  <el-form
    ref="form"
    :rules="rules"
    :model="$store.state.config.alert"
    label-position="top"
    @submit.native.prevent>
    <el-row>
      <el-col :span="12">
        <el-form-item label="Destination" prop="alert" required>
          <el-checkbox-group v-model="alert">
            <el-checkbox label="slack" border>Slack</el-checkbox>
            <el-checkbox label="email" border>Email</el-checkbox>
            <el-checkbox label="post" border>HTTP</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Re-alert">
          <ElastalertTimePicker
            v-if="realert"
            :unit="Object.keys(realert)[0]"
            :amount="Object.values(realert)[0]"
            @input="updateRealert" />
          <label v-if="Object.values(realert)[0] === 0">
            WARNING: When re-alert is set to 0 minutes, you will receive an alert
            every single time this rule triggers. This may result in large bursts
            of notifications.
          </label>
          <label v-else>
            You will receive, at most, one alert every
            {{ realert.minutes }} minute(s), even if a rule
            triggers multiple times within that timeframe
          </label>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="">
      <el-tabs v-if="alert.length" type="border-card" class="border-card-plain">
        <el-tab-pane v-if="alert.includes('slack') || alert.includes('email')" label="Settings">
          <ConfigAlertSubjectBody
            v-if="alert.includes('slack') || alert.includes('email')"
            class="m-s-lg" />
        </el-tab-pane>

        <el-tab-pane v-if="alert.includes('slack')" label="Slack">
          <praeco-form-item
            :value="slackWebhookUrl"
            label="Slack webhook URL"
            prop="slackWebhookUrl"
            required>
            <el-input v-model="slackWebhookUrl" />
          </praeco-form-item>

          <el-form-item label="Channel or username" prop="slackChannelOverride" required>
            <el-input v-model="slackChannelOverride" />
            <label>
              The @username or #channel to send the alert. Tip: Create new channels
              for your alerts, to have fine-grained control of Slack notifications.
            </label>
          </el-form-item>

          <praeco-form-item label="Post as" prop="slackUsernameOverride" required>
            <el-input v-model="slackUsernameOverride" />
            <label>This is the username that will appear in Slack for the alert</label>
          </praeco-form-item>

          <el-form-item label="Message color" prop="slackMsgColor" required>
            <el-radio-group v-model="slackMsgColor">
              <el-radio label="danger" border class="slack-danger">Danger</el-radio>
              <el-radio label="warning" border class="slack-warning">Warning</el-radio>
              <el-radio label="good" border class="slack-good">Good</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane v-if="alert.includes('email')" label="Email">
          <praeco-form-item :value="smtpHost" label="SMTP host" prop="smtpHost" required>
            <el-input v-model="smtpHost" />
            <label>The SMTP host to use</label>
          </praeco-form-item>

          <praeco-form-item :value="smtpPort" label="SMTP port" prop="smtpPort" required>
            <el-input-number v-model="smtpPort" />
            <label>The SMTP port to use</label>
          </praeco-form-item>

          <praeco-form-item
            :value="fromAddr"
            label="From address"
            prop="fromAddr">
            <el-input v-model="fromAddr" />
            <label>
              This sets the From header in the email.
              By default, the from address is ElastAlert@
              and the domain will be set by the smtp server.
            </label>
          </praeco-form-item>

          <praeco-form-item
            :value="replyTo"
            label="Reply to"
            prop="replyTo">
            <el-input v-model="replyTo" />
            <label>
              This sets the Reply-To header in the email.
              By default, the from address is ElastAlert@ and the
              domain will be set by the smtp server.
            </label>
          </praeco-form-item>

          <el-form-item label="To" prop="email" required>
            <el-input v-model="email" />
            <label>Comma separated list of email addresses</label>
          </el-form-item>

          <el-form-item label="CC" prop="cc">
            <el-input v-model="cc" />
            <label>Comma separated list of email addresses</label>
          </el-form-item>

          <el-form-item label="BCC" prop="bcc">
            <el-input v-model="bcc" />
            <label>Comma separated list of email addresses</label>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane v-if="alert.includes('post')" label="HTTP">
          <el-form-item label="HTTP POST URL" prop="httpPostUrl" required>
            <el-input v-model="httpPostUrl" />
            <label>JSON results will be POSTed to this URL</label>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form-item>
  </el-form>
</template>

<script>
import validUrl from 'valid-url';
import ConfigAlertSubjectBody from './ConfigAlertSubjectBody';

let validateSlackDestination = (rule, value, callback) => {
  if (value.length < 2) {
    callback(new Error('Please enter a @username or #channel'));
  } else if (!value.startsWith('@') && !value.startsWith('#')) {
    callback(new Error('Please enter a @username or #channel'));
  } else {
    callback();
  }
};

let validateEmail = (rule, value, callback) => {
  if (!value || value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)) {
    callback();
  } else {
    callback(new Error('Invalid email address'));
  }
};

let validateUrl = (rule, value, callback) => {
  if (validUrl.isUri(value)) {
    try {
      let url = new URL(value);
      if (['http:', 'https:'].includes(url.protocol)) {
        callback();
      } else {
        callback(new Error('Invalid URL'));
      }
    } catch (error) {
      callback(new Error('Invalid URL'));
    }
  } else {
    callback(new Error('Invalid URL'));
  }
};

let validateEmailCommaSeparated = (rule, value, callback) => {
  let emails = value.split(',');

  emails.forEach(email => {
    if (email && !email.trim().match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)) {
      return callback(new Error('Invalid email address'));
    }
  });

  return callback();
};

export default {
  components: {
    ConfigAlertSubjectBody
  },

  props: ['prefill'],

  data() {
    return {
      rules: {
        alert: [
          {
            required: true,
            message: 'You must choose at least one alert type'
          }
        ],
        slackChannelOverride: [
          {
            validator: validateSlackDestination,
            trigger: 'change'
          }
        ],
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
        ],
        httpPostUrl: [
          {
            validator: validateUrl,
            trigger: ['change', 'blur']
          }
        ]
      },
    };
  },

  computed: {
    httpPostUrl: {
      get() {
        return this.$store.state.config.alert.httpPostUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_HTTP_POST_URL', value);
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

    slackWebhookUrl: {
      get() {
        return this.$store.state.config.alert.slackWebhookUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SLACK_WEBHOOK_URL', value);
      }
    },


    slackChannelOverride: {
      get() {
        return this.$store.state.config.alert.slackChannelOverride;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SLACK_CHANNEL_OVERRIDE', value);
      }
    },

    slackUsernameOverride: {
      get() {
        return this.$store.state.config.alert.slackUsernameOverride;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SLACK_USERNAME_OVERRIDE', value);
      }
    },

    slackMsgColor: {
      get() {
        return this.$store.state.config.alert.slackMsgColor;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SLACK_MSG_COLOR', value);
      }
    },

    realert: {
      get() {
        return this.$store.state.config.alert.realert || { minutes: 5 };
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_REALERT', value);
      }
    },

    alert: {
      get() {
        return this.$store.state.config.alert.alert;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERT', value);
      }
    }
  },

  methods: {
    updateRealert(value) {
      this.realert = value;
    }
  }
};
</script>

<style>
.atwho-view {
  max-height: 220px;
  height: 220px;
  margin-bottom: -245px;
}

.slack-danger .el-radio__inner:hover {
  border-color: red;
}

.slack-danger .el-radio__input.is-checked .el-radio__inner {
  border-color: red;
  background: red;
}

.slack-danger .el-radio__input.is-checked + .el-radio__label,
.slack-danger {
  color: red !important;
  border-color: red !important;
}

.slack-warning .el-radio__inner:hover {
  border-color: orange;
}

.slack-warning .el-radio__input.is-checked .el-radio__inner {
  border-color: orange;
  background: orange;
}

.slack-warning .el-radio__input.is-checked + .el-radio__label,
.slack-warning {
  color: orange !important;
  border-color: orange !important;
}

.slack-good .el-radio__inner:hover {
  border-color: green;
}

.slack-good .el-radio__input.is-checked .el-radio__inner {
  border-color: green;
  background: green;
}

.slack-good .el-radio__input.is-checked + .el-radio__label,
.slack-good {
  color: green !important;
  border-color: green !important;
}
</style>
