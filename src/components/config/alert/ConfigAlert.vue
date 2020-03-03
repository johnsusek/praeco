<template>
  <el-form
    ref="form"
    :rules="rules"
    :model="$store.state.config.alert"
    label-position="top"
    @submit.native.prevent>

    <el-row class="m-s-sm">
      <el-col :span="aggregationSchedule ? 24 : 12">
        <ConfigAggregation ref="aggregation" :view-only="viewOnly" />
      </el-col>
      <el-col v-if="!aggregationSchedule" :span="12">
        <el-form-item :class="{'view-only': viewOnly }" label="Re-alert">
          <ElastalertTimeView v-if="viewOnly" :time="realert" />
          <ElastalertTimePicker
            v-else-if="realert"
            id="realert"
            :allow-zero="true"
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
            triggers multiple times within that timeframe.
            <br>
            If the rule is grouped over a field, this option will be applied on a per-group basis.
          </label>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item
      v-if="!viewOnly"
      :label="`Destination${alert.length > 1 ? 's' : ''}`"
      prop="alert"
      required>
      <el-checkbox-group v-model="alert" :disabled="viewOnly" @change="$emit('validate')">
        <el-checkbox id="destinationSlack" label="slack" border>Slack</el-checkbox>
        <el-checkbox id="destinationMsTeams" label="ms_teams" border>MS Teams</el-checkbox>
        <el-checkbox id="destinationEmail" label="email" border>Email</el-checkbox>
        <el-checkbox id="destinationPost" label="post" border>HTTP</el-checkbox>
        <el-checkbox id="destinationTelegram" label="telegram" border>Telegram</el-checkbox>
        <el-checkbox id="destinationJira" label="jira" border>JIRA</el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-tabs v-if="alert.length" v-model="visibleTabPane" class="border-card-plain m-n-sm" type="card">
      <el-tab-pane v-if="alert.includes('slack') || alert.includes('ms_teams') || alert.includes('email') ||
      alert.includes('telegram') || alert.includes('jira')">
        <template slot="label"><icon :icon="['fa', 'bell']" size="1x" /> Alert</template>
        <ConfigAlertSubjectBody
          ref="subjectBody"
          :view-only="viewOnly"
          class="m-s-lg" />
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('slack')" >
        <template slot="label"><icon :icon="['fab', 'slack']" size="1x" /> Slack</template>
        <el-form-item label="Channel or username" prop="slackChannelOverride" required>
          <el-input id="slackChannelOverride" v-model="slackChannelOverride" :disabled="viewOnly" />
          <label>
            The @username or #channel to send the alert. Tip: Create new channels
            for your alerts, to have fine-grained control of Slack notifications.
          </label>
        </el-form-item>

        <praeco-form-item label="Post as" prop="slackUsernameOverride" required>
          <el-input id="slackUsernameOverride" v-model="slackUsernameOverride" :disabled="viewOnly" />
          <label>This is the username that will appear in Slack for the alert</label>
        </praeco-form-item>

        <praeco-form-item
          v-if="!(viewOnly && !slackEmojiOverride)"
          :class="{ 'disabled': viewOnly }"
          label="Icon"
          prop="slackEmojiOverride">
          <picker
            :emoji="slackEmojiOverride || 'arrow_up'"
            :title="slackEmojiOverride || 'Pick your icon...'"
            color="#189acc"
            @select="addEmoji" />
        </praeco-form-item>

        <el-form-item label="Message color" prop="slackMsgColor" required>
          <el-radio-group v-model="slackMsgColor" :disabled="viewOnly">
            <el-radio id="slackMsgColorDanger" label="danger" border class="slack-danger">Danger</el-radio>
            <el-radio id="slackMsgColorWarning" label="warning" border class="slack-warning">Warning</el-radio>
            <el-radio id="slackMsgColorGood" label="good" border class="slack-good">Good</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('email')">
        <span slot="label"><icon icon="envelope" size="1x" /> Email</span>
        <praeco-form-item
          v-if="!viewOnly || fromAddr"
          :value="fromAddr"
          label="From address"
          prop="fromAddr">
          <el-input v-model="fromAddr" :disabled="viewOnly" />
          <label>
            This sets the From header in the email.
            By default, the from address is ElastAlert@
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
            By default, the from address is ElastAlert@ and the
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
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('post')" label="HTTP">
        <span slot="label"><icon icon="globe" /> HTTP</span>
        <el-form-item label="HTTP POST URL" prop="httpPostUrl" required>
          <el-input v-model="httpPostUrl" :disabled="viewOnly" />
          <label>JSON results will be POSTed to this URL</label>
        </el-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('ms_teams')" >
        <template slot="label"><icon :icon="['fab', 'microsoft']" size="1x" /> MS Teams</template>
        <el-form-item label="Team webhook" prop="ms_teamsWebhookUrl" required>
          <el-input id="ms_teamsWebhookUrl" v-model="ms_teamsWebhookUrl" :disabled="viewOnly" />
          <label>
            See<a href="https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook">
            https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook</a>
          </label>
        </el-form-item>

        <el-form-item label="Color" prop="ms_teamsThemeColor" required>
          <el-input id="ms_teamsThemeColor" v-model="ms_teamsThemeColor" :disabled="viewOnly" />
          <label>
            HTML color name in form of <b>#RRGGBB</b>
          </label>
        </el-form-item>

      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('telegram')" >
        <template slot="label">Telegram</template>

        <praeco-form-item label="Room ID" prop="telegramRoomId" required>
          <el-input id="telegramRoomId" v-model="telegramRoomId" :disabled="viewOnly" />
          <label>
            Unique identifier for the target chat or username of the
            target channel using telegram chat_id (in the format “-xxxxxxxx”)
          </label>
        </praeco-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('jira')" >
        <template slot="label">JIRA</template>

        <praeco-form-item label="Project" prop="jiraProject" required>
          <el-input id="jiraProject" v-model="jiraProject" :disabled="viewOnly" />
          <label>Jira project</label>
        </praeco-form-item>
        <praeco-form-item label="Issue type" prop="jiraIssueType" required>
          <el-input id="jiraIssueType" v-model="jiraIssueType" :disabled="viewOnly" />
          <label>Jira issue type (Bug, Integration Bug, etc...)</label>
        </praeco-form-item>
        <praeco-form-item label="Component" prop="jiraComponent">
          <el-input id="jiraComponent" v-model="jiraComponent" :disabled="viewOnly" />
          <label>Jira issue components</label>
        </praeco-form-item>
      </el-tab-pane>
    </el-tabs>
  </el-form>
</template>

<script>
import validUrl from 'valid-url';
import { Picker } from 'emoji-mart-vue';
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

let validateMSTeamsDestination = (rule, value, callback) => {
  console.log(value);
  callback(); // FIXME
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
  let emails = [];

  if (value) emails = value.split(',');

  emails.forEach(email => {
    if (
      email &&
      !email.trim().match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)
    ) {
      return callback(new Error('Invalid email address'));
    }
  });

  return callback();
};

export default {
  components: {
    ConfigAlertSubjectBody,
    Picker
  },

  props: ['viewOnly'],

  data() {
    return {
      visibleTabPane: '',
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
      }
    };
  },

  computed: {
    aggregationSchedule: {
      get() {
        return this.$store.state.config.alert.aggregationSchedule;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_AGGREGATION_SCHEDULE', value);
      }
    },

    httpPostUrl: {
      get() {
        return this.$store.state.config.alert.httpPostUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_HTTP_POST_URL', value);
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

    telegramRoomId: {
      get() {
        return this.$store.state.config.alert.telegramRoomId;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TELEGRAM_ROOM_ID',
          value
        );
      }
    },

    jiraIssueType: {
      get() {
        return this.$store.state.config.alert.jiraIssueType;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_JIRA_ISSUE_TYPE',
          value
        );
      }
    },

    jiraProject: {
      get() {
        return this.$store.state.config.alert.jiraProject;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_JIRA_PROJECT',
          value
        );
      }
    },

    jiraComponents: {
      get() {
        return this.$store.state.config.alert.jiraComponents;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_JIRA_COMPONENTS',
          value
        );
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
        this.$store.commit(
          'config/alert/UPDATE_SLACK_USERNAME_OVERRIDE',
          value
        );
      }
    },

    slackEmojiOverride: {
      get() {
        return this.$store.state.config.alert.slackEmojiOverride;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SLACK_EMOJI_OVERRIDE', value);
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

    ms_teamsWebhookUrl: {
      get() {
        return this.$store.state.config.alert.ms_teamsWebhookUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_TEAMS_WEBHOOK_URL', value);
      }
    },

    ms_teamsThemeColor: {
      get() {
        return this.$store.state.config.alert.ms_teamsThemeColor;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_TEAMS_THEME_COLOR', value);
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
    addEmoji(value) {
      this.slackEmojiOverride = value.colons;
    },

    updateRealert(value) {
      this.realert = {};
      this.$set(this.realert, Object.keys(value)[0], Object.values(value)[0]);
    }
  }
};
</script>

<style lang="scss" scoped>
// If we don't do this, the autocomplete dropdown gets cut off
.el-tabs__content {
  overflow: visible;
}
</style>

<style lang="scss">
.disabled {
  .emoji-mart {
    height: auto !important;
    border: 0 !important;
  }

  .emoji-mart-title-label,
  .emoji-mart-bar:first-child,
  .emoji-mart-search,
  .emoji-mart-scroll,
  .emoji-mart-preview-skins {
    display: none;
  }

  .emoji-mart-bar {
    border: 0 !important;
  }

  .emoji-mart-preview {
    height: 45px !important;
  }

  .emoji-mart-preview-emoji {
    left: 0 !important;
  }

  .emoji-mart-preview-data {
    left: 56px !important;
  }
}

.atwho-view {
  max-height: 220px;
  height: 220px;
  margin-bottom: -245px;
}

// Fix issue where clicking on label of dropdown didn't register
.atwho-li span {
  pointer-events: none;
}

:not(.is-disabled) {
  &.slack-danger .el-radio__inner:hover {
    border-color: red;
  }

  &.slack-danger .el-radio__input.is-checked .el-radio__inner {
    border-color: red;
    background: red;
  }

  &.slack-danger .el-radio__input.is-checked + .el-radio__label,
  &.slack-danger {
    color: red !important;
    border-color: red !important;
  }

  &.slack-warning .el-radio__inner:hover {
    border-color: orange;
  }

  &.slack-warning .el-radio__input.is-checked .el-radio__inner {
    border-color: orange;
    background: orange;
  }

  &.slack-warning .el-radio__input.is-checked + .el-radio__label,
  &.slack-warning {
    color: orange !important;
    border-color: orange !important;
  }

  &.slack-good .el-radio__inner:hover {
    border-color: green;
  }

  &.slack-good .el-radio__input.is-checked .el-radio__inner {
    border-color: green;
    background: green;
  }

  &.slack-good .el-radio__input.is-checked + .el-radio__label,
  &.slack-good {
    color: green !important;
    border-color: green !important;
  }
}
</style>
