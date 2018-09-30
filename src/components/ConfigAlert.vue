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

    <el-form-item label="Type" prop="alert" required>
      <el-checkbox-group v-model="config.alert">
        <el-checkbox label="slack" border>Slack</el-checkbox>
        <el-checkbox label="email" border>Email</el-checkbox>
        <el-checkbox label="post" border>HTTP</el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-form-item
      v-if="config.alert.includes('slack') || config.alert.includes('email')"
      label="Subject"
      prop="alert_subject"
      required>
      <at
        v-model="config.alert_subject"
        :members="fields"
        :allow-spaces="false"
        at="%">
        <span slot="embeddedItem" slot-scope="s">
          <el-tag :data-term="s.current" size="mini" type="info">{{ s.current }}</el-tag>
        </span>
        <div contenteditable />
        <label>Insert fields by typing '%' followed by the field name</label>
      </at>
    </el-form-item>

    <el-form-item
      v-if="(config.alert.includes('slack') ||
        config.alert.includes('email')) &&
      config.alert_text_type !== 'aggregation_summary_only'"
      label="Body text"
      prop="alert_text">
      <at
        v-model="config.alert_text"
        :members="fields"
        :allow-spaces="false"
        at="%">
        <span slot="embeddedItem" slot-scope="s">
          <el-tag :data-term="s.current" size="mini" type="info">{{ s.current }}</el-tag>
        </span>
        <div contenteditable />
        <label>Insert fields by typing '%' followed by the field name</label>
      </at>
    </el-form-item>

    <el-form-item
      v-if="config.alert.includes('slack') || config.alert.includes('email')"
      required
      label="Include in body">
      <el-row>
        <el-radio-group v-model="attach">
          <el-radio value="alert_text_only" label="alert_text_only" border>
            Body text only
          </el-radio>
          <el-radio value="exclude_fields" label="exclude_fields" border>
            Include trigger details &amp; top counts
          </el-radio>
          <el-radio value="default" label="default" border>
            Include trigger details &amp; top counts &amp; field values
          </el-radio>
        </el-radio-group>
      </el-row>
    </el-form-item>

    <el-card v-if="config.alert.includes('slack')" header="Slack options" shadow="never">
      <praeco-form-item
        :value="config.slack_webhook_url"
        label="Slack webhook URL"
        prop="slack_webhook_url"
        required>
        <el-input v-model="config.slack_webhook_url" />
      </praeco-form-item>

      <el-form-item label="Channel or username" prop="slack_channel_override" required>
        <el-input v-model="config.slack_channel_override" />
        <label>The @username or #channel to send the alert</label>
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
    </el-card>

    <el-card v-if="config.alert.includes('email')" header="Email options" shadow="never">
      <praeco-form-item :value="config.smtp_host" label="SMTP host" prop="smtp_host" required>
        <el-input v-model="config.smtp_host" />
        <label>The SMTP host to use</label>
      </praeco-form-item>

      <praeco-form-item :value="config.smtp_port" label="SMTP port" prop="smtp_port" required>
        <el-input-number v-model="config.smtp_port" />
        <label>The SMTP port to use</label>
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
    </el-card>

    <el-card v-if="config.alert.includes('post')" header="HTTP options" shadow="never">
      <el-form-item label="HTTP POST URL" prop="http_post_url" required>
        <el-input v-model="config.http_post_url" />
        <label>JSON results will be POSTed to this URL</label>
      </el-form-item>
    </el-card>
  </el-form>
</template>

<script>
import Vue from 'vue';
import At from 'vue-at';

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
    At
  },
  props: ['fields', 'prefill'],
  data() {
    return {
      attach: '',
      rules: {
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
  computed: {
    alertTextType() {
      if (this.attach === 'default') {
        return undefined;
      }
      return this.attach;
    }
  },
  watch: {
    prefill() {
      this.config = this.prefill;
    },
    attach: {
      initial: true,
      handler() {
        if (this.alertTextType) {
          Vue.set(this.config, 'alert_text_type', this.alertTextType);
        } else {
          Vue.delete(this.config, 'alert_text_type');
        }
      }
    },
    'prefill.alert_text_type': {
      initial: true,
      handler() {
        if (this.prefill.alert_text_type) {
          this.attach = this.prefill.alert_text_type;
          Vue.set(this.config, 'alert_text_type', this.alertTextType);
        } else {
          this.attach = 'default';
          Vue.delete(this.config, 'alert_text_type');
        }
      }
    }
  },
  mounted() {
    if (!this.prefill.alert_text_type) {
      this.attach = 'default';
    }
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

<style scoped>
.el-tag {
  margin-right: 5px;
}

.el-checkbox.is-bordered.el-checkbox--mini {
  height: auto;
}

[contenteditable] {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
  overflow-y: auto;
  line-height: 1.4;
}

[contenteditable]:focus {
  border: 1px solid #ccc;
  outline: none;
}

[contenteditable] .el-tag {
  margin-right: 0;
}

[contenteditable] + label {
  display: block;
  color: #86898f;
  line-height: 1.3;
  font-size: 12px;
  padding-top: 8px;
}

.el-card {
  margin-bottom: 20px;
}
</style>

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
