<template>
  <el-form ref="form" :rules="rules" :model="config" label-position="top" @submit.native.prevent>
    <el-form-item label="Re-alert minutes">
      <el-input-number v-model="config.realert.minutes" />
      <label v-if="config.realert.minutes === 0">
        WARNING: When re-alert is set to 0 minutes, you will receive an alert
        every single time this rule triggers. This may result in large bursts
        of notifications.
      </label>
      <label v-else>
        You will receive, at most, one alert every
        {{ config.realert.minutes }} minute(s), even if a rule
        triggers multiple times within that timeframe
      </label>
    </el-form-item>


    <ConfigAlertSubjectBody
      v-if="config.alert.includes('slack') || config.alert.includes('email')"
      v-model="config"
      :alert-text-type-prefill="prefill.alert_text_type"
      :fields="fields"
      class="m-s-lg" />

    <el-form-item label="Destination" prop="alert" required>
      <el-checkbox-group v-model="config.alert">
        <el-checkbox label="slack" border>Slack</el-checkbox>
        <el-checkbox label="email" border>Email</el-checkbox>
        <el-checkbox label="post" border>HTTP</el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-tabs v-if="config.alert.length" type="border-card" class="border-card-plain">
      <el-tab-pane v-if="config.alert.includes('slack')" label="Slack">
        <praeco-form-item
          :value="config.slack_webhook_url"
          label="Slack webhook URL"
          prop="slack_webhook_url"
          required>
          <el-input v-model="config.slack_webhook_url" />
        </praeco-form-item>

        <el-form-item label="Channel or username" prop="slack_channel_override" required>
          <el-input v-model="config.slack_channel_override" />
          <label>
            The @username or #channel to send the alert. Tip: Create new channels
            for your alerts, to have fine-grained control of Slack notifications.
          </label>
        </el-form-item>

        <praeco-form-item label="Post as" prop="slack_username_override" required>
          <el-input v-model="config.slack_username_override" />
          <label>This is the username that will appear in Slack for the alert</label>
        </praeco-form-item>

        <el-form-item label="Message color" prop="slack_msg_color" required>
          <el-radio-group v-model="config.slack_msg_color">
            <el-radio label="danger" border class="slack-danger">Danger</el-radio>
            <el-radio label="warning" border class="slack-warning">Warning</el-radio>
            <el-radio label="good" border class="slack-good">Good</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="config.alert.includes('email')" label="Email">
        <praeco-form-item :value="config.smtp_host" label="SMTP host" prop="smtp_host" required>
          <el-input v-model="config.smtp_host" />
          <label>The SMTP host to use</label>
        </praeco-form-item>

        <praeco-form-item :value="config.smtp_port" label="SMTP port" prop="smtp_port" required>
          <el-input-number v-model="config.smtp_port" />
          <label>The SMTP port to use</label>
        </praeco-form-item>

        <praeco-form-item
          :value="config.from_addr"
          label="From address"
          prop="from_addr">
          <el-input v-model="config.from_addr" />
          <label>
            This sets the From header in the email.
            By default, the from address is ElastAlert@
            and the domain will be set by the smtp server.
          </label>
        </praeco-form-item>

        <praeco-form-item
          :value="config.email_reply_to"
          label="Reply to"
          prop="email_reply_to">
          <el-input v-model="config.email_reply_to" />
          <label>
            This sets the Reply-To header in the email.
            By default, the from address is ElastAlert@ and the
            domain will be set by the smtp server.
          </label>
        </praeco-form-item>

        <el-form-item label="To" prop="email" required>
          <el-input v-model="config.email" />
          <label>Comma separated list of email addresses</label>
        </el-form-item>

        <el-form-item label="CC" prop="cc">
          <el-input v-model="config.cc" />
          <label>Comma separated list of email addresses</label>
        </el-form-item>

        <el-form-item label="BCC" prop="bcc">
          <el-input v-model="config.bcc" />
          <label>Comma separated list of email addresses</label>
        </el-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="config.alert.includes('post')" label="HTTP">
        <el-form-item label="HTTP POST URL" prop="http_post_url" required>
          <el-input v-model="config.http_post_url" />
          <label>JSON results will be POSTed to this URL</label>
        </el-form-item>
      </el-tab-pane>
    </el-tabs>
  </el-form>
</template>

<script>
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

export default {
  components: {
    ConfigAlertSubjectBody
  },
  props: ['fields', 'prefill'],
  data() {
    return {
      rules: {
        alert: [
          {
            required: true,
            message: 'You must choose at least one alert type'
          }
        ],
        slack_channel_override: [
          {
            validator: validateSlackDestination,
            trigger: 'change'
          }
        ]
      },
      config: {
        alert: [],
        realert: {}
      }
    };
  },
  // computed: {
  //   alertTextType() {
  //     if (this.attach === 'default') {
  //       return undefined;
  //     }
  //     return this.attach;
  //   }
  // },
  watch: {
    prefill() {
      this.config = this.prefill;
    },

  },
  methods: {
    async validate() {
      try {
        await this.$refs.form.validate();
        return this.config;
      } catch (error) {
        return false;
      }
    }
  }
};
</script>

<style>
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
