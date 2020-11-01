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
            every single time this rule triggers. <strong>This may result in large bursts
              of notifications.</strong>
          </label>
          <label v-else>
            You will receive, at most, one alert every
            {{ realert.minutes }} minute(s), even if a rule
            triggers multiple times within that timeframe.
            This is a mechanism to prevent getting flooded with alerts.
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
        <el-checkbox id="destinationSlack" label="slack" border>
          Slack
        </el-checkbox>
        <el-checkbox id="destinationMsTeams" label="ms_teams" border>
          MS Teams
        </el-checkbox>
        <el-checkbox id="destinationEmail" label="email" border>
          Email
        </el-checkbox>
        <el-checkbox id="destinationPost" label="post" border>
          HTTP
        </el-checkbox>
        <el-checkbox id="destinationTelegram" label="telegram" border>
          Telegram
        </el-checkbox>
        <el-checkbox id="destinationJira" label="jira" border>
          JIRA
        </el-checkbox>
        <el-checkbox id="destinationGoogleChats" label="googlechat" border>
          GOOGLE CHAT
        </el-checkbox>
        <el-checkbox id="destinationlineNotify" label="linenotify" border>
          LineNotify
        </el-checkbox>
        <el-checkbox id="destinationMattermost" label="mattermost" border>
          Mattermost
        </el-checkbox>
        <el-checkbox id="destinationCommand" label="command" border>
          Command
        </el-checkbox>
        <el-checkbox id="destinationGitter" label="gitter" border>
          Gitter
        </el-checkbox>
        <el-checkbox id="destinationSns" label="sns" border>
          SNS
        </el-checkbox>
        <el-checkbox id="destinationZabbix" label="zabbix" border>
          Zabbix
        </el-checkbox>
        <el-checkbox id="destinationTwilio" label="twilio" border>
          Twilio
        </el-checkbox>
        <el-checkbox id="destinationPagerTree" label="pagertree" border>
          PagerTree
        </el-checkbox>
        <el-checkbox id="destinationExotel" label="exotel" border>
          Exotel
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-tabs v-if="alert.length" v-model="visibleTabPane" class="border-card-plain m-n-sm" type="card">
      <el-tab-pane v-if="alert.includes('slack') || alert.includes('email') || alert.includes('ms_teams') ||
        alert.includes('telegram') || alert.includes('jira') || alert.includes('mattermost') ||
        alert.includes('sns') || alert.includes('pagertree') || alert.includes('gitter') || alert.includes('googlechat')">
        <template slot="label">
          <icon :icon="['fa', 'bell']" size="1x" /> Alert
        </template>
        <ConfigAlertSubjectBody
          ref="subjectBody"
          :view-only="viewOnly"
          class="m-s-lg" />
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('slack')">
        <template slot="label">
          <icon :icon="['fab', 'slack']" size="1x" /> Slack
        </template>
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
            <el-radio id="slackMsgColorDanger" label="danger" border class="slack-danger">
              Danger
            </el-radio>
            <el-radio id="slackMsgColorWarning" label="warning" border class="slack-warning">
              Warning
            </el-radio>
            <el-radio id="slackMsgColorGood" label="good" border class="slack-good">
              Good
            </el-radio>
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

      <el-tab-pane v-if="alert.includes('ms_teams')">
        <template slot="label">
          <icon :icon="['fab', 'microsoft']" size="1x" /> MS Teams
        </template>
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

      <el-tab-pane v-if="alert.includes('telegram')">
        <template slot="label">
          <icon :icon="['fab', 'telegram']" size="1x" /> Telegram
        </template>

        <praeco-form-item label="Room ID" prop="telegramRoomId" required>
          <el-input id="telegramRoomId" v-model="telegramRoomId" :disabled="viewOnly" />
          <label>
            Unique identifier for the target chat or username of the
            target channel using telegram chat_id (in the format “-xxxxxxxx”)
          </label>
        </praeco-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('jira')">
        <template slot="label">
          <icon :icon="['fab', 'jira']" size="1x" /> JIRA
        </template>

        <praeco-form-item label="Project" prop="jiraProject" required>
          <el-input id="jiraProject" v-model="jiraProject" :disabled="viewOnly" />
          <label>Jira project</label>
        </praeco-form-item>
        <praeco-form-item label="Issue type" prop="jiraIssueType" required>
          <el-input id="jiraIssueType" v-model="jiraIssueType" :disabled="viewOnly" />
          <label>Jira issue type (Bug, Integration Bug, etc...)</label>
        </praeco-form-item>
        <praeco-form-item label="Components" prop="jiraComponents">
          <el-input id="jiraComponents" v-model="jiraComponents" :disabled="viewOnly" />
          <label>Jira issue components</label>
        </praeco-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('googlechat')">
        <template slot="label">
          GOOGLE CHAT
        </template>

        <praeco-form-item label="GoogleChat Webhook" prop="googleChatWebhookUrl" required>
          <el-input id="googleChatWebhookUrl" v-model="googleChatWebhookUrl" :disabled="viewOnly" />
          <label>Google Webhook Url</label>
        </praeco-form-item>
        <praeco-form-item label="GoogleChat Format" prop="googleChatFormat" required>
          <el-radio-group v-model="googleChatFormat" :disabled="viewOnly">
            <el-radio id="googleChatFormatBasic" label="basic" border>
              basic
            </el-radio>
            <el-radio id="googleChatFormatCard" label="card" border>
              card
            </el-radio>
          </el-radio-group>
        </praeco-form-item>
        <praeco-form-item label="GoogleChat Header Title" prop="googleChatHeaderTitle">
          <el-input id="googleChatHeaderTitle" v-model="googleChatHeaderTitle" :disabled="viewOnly" />
          <label>GoogleChat Header Title</label>
        </praeco-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('linenotify')">
        <template slot="label">
          <icon :icon="['fab', 'line']" size="1x" /> Line Notify
        </template>

        <praeco-form-item label="Access Token" prop="linenotifyAccessToken" required>
          <el-input id="linenotifyAccessToken" v-model="linenotifyAccessToken" :disabled="viewOnly" />
          <label>The access token that you got from https://notify-bot.line.me/my/</label>
        </praeco-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('mattermost')">
        <template slot="label">
          Mattermost
        </template>
        <el-form-item label="Channel or username" prop="mattermostChannelOverride" required>
          <el-input id="mattermostChannelOverride" v-model="mattermostChannelOverride" :disabled="viewOnly" />
          <label>
            The @username or #channel to send the alert. Tip: Create new channels
            for your alerts, to have fine-grained control of Mattermost notifications.
          </label>
        </el-form-item>

        <praeco-form-item label="Post as" prop="mattermostUsernameOverride" required>
          <el-input id="mattermostUsernameOverride" v-model="mattermostUsernameOverride" :disabled="viewOnly" />
          <label>This is the username that will appear in Mattermost for the alert</label>
        </praeco-form-item>

        <el-form-item label="Message color" prop="mattermostMsgColor" required>
          <el-radio-group v-model="mattermostMsgColor" :disabled="viewOnly">
            <el-radio id="mattermostMsgColorDanger" label="danger" border class="mattermost-danger">
              Danger
            </el-radio>
            <el-radio id="mattermostMsgColorWarning" label="warning" border class="mattermost-warning">
              Warning
            </el-radio>
            <el-radio id="mattermostMsgColorGood" label="good" border class="mattermost-good">
              Good
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('command')">
        <template slot="label">
          Command
        </template>

        <praeco-form-item label="Command" prop="command" required>
          <el-input id="command" v-model="command" :disabled="viewOnly" />
          <label>
            arguments to execute or a string to execute.
            the first argument is the name of the program to execute.
            If passed a string, the command is executed through the shell.
            format, /path/program name ,argument1,argument2,argument3
          </label>
        </praeco-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('gitter')">
        <template slot="label">
          <icon :icon="['fab', 'gitter']" size="1x" /> Gitter
        </template>
        <el-form-item label="Message level" prop="gitterMsgLevel" required>
          <el-radio-group v-model="gitterMsgLevel" :disabled="viewOnly">
            <el-radio id="gitterMsgLevelError" label="error" border class="gitter-error">
              Error
            </el-radio>
            <el-radio id="gitterMsgLevelInfo" label="info" border class="gitter-info">
              Info
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('sns')">
        <template slot="label">
          <icon :icon="['fab', 'aws']" size="1x" /> SNS
        </template>
        <el-radio id="groupSns" v-model="groupSns" :disabled="viewOnly" label="profile" border @change="changeSns">
          Profile
        </el-radio>
        <el-radio id="groupSns" v-model="groupSns" :disabled="viewOnly" label="notProfile" border @change="changeSns">
          NotProfile
        </el-radio>

        <div v-if="groupSns === 'notProfile'">
          <praeco-form-item label="TopicArn" prop="snsTopicArn" required>
            <el-input id="snsTopicArn" v-model="snsTopicArn" :disabled="viewOnly" />
            <label>The SNS topic’s ARN. For example, arn:aws:sns:us-east-1:123456789:somesnstopic</label>
          </praeco-form-item>
          <praeco-form-item label="SnsAwsAccessKeyId" prop="snsAwsAccessKeyId" required>
            <el-input id="snsAwsAccessKeyId" v-model="snsAwsAccessKeyId" :disabled="viewOnly" />
            <label>An access key to connect to SNS with.</label>
          </praeco-form-item>
          <praeco-form-item label="SnsAwsSecretAccessKey" prop="snsAwsSecretAccessKey" required>
            <el-input id="snsAwsSecretAccessKey" v-model="snsAwsSecretAccessKey" :disabled="viewOnly" />
            <label>The secret key associated with the access key.</label>
          </praeco-form-item>
          <praeco-form-item label="SnsAwsRegion" prop="snsAwsRegion" required>
            <el-input id="snsAwsRegion" v-model="snsAwsRegion" :disabled="viewOnly" />
            <label>The AWS region in which the SNS resource is located. For example, us-east-1</label>
          </praeco-form-item>
        </div>
        <div v-if="groupSns === 'profile'">
          <praeco-form-item label="TopicArn" prop="snsTopicArn" required>
            <el-input id="snsTopicArn" v-model="snsTopicArn" :disabled="viewOnly" />
            <label>The SNS topic’s ARN. For example, arn:aws:sns:us-east-1:123456789:somesnstopic</label>
          </praeco-form-item>
          <praeco-form-item label="SnsAwsProfile" prop="snsAwsProfile" required>
            <el-input id="snsAwsProfile" v-model="snsAwsProfile" :disabled="viewOnly" />
            <label>The AWS profile to use. If none specified, the default will be used.</label>
          </praeco-form-item>
        </div>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('zabbix')">
        <template slot="label">
          Zabbix
        </template>

        <praeco-form-item label="ZbxHost" prop="zbxHost" required>
          <el-input id="zbxHost" v-model="zbxHost" :disabled="viewOnly" />
          <label>This field setup the host in zabbix that receives the value sent by Elastalert.</label>
        </praeco-form-item>
        <praeco-form-item label="ZbxKey" prop="zbxKey" required>
          <el-input id="zbxKey" v-model="zbxKey" :disabled="viewOnly" />
          <label>This field setup the key in the host that receives the value sent by Elastalert.</label>
        </praeco-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('twilio')">
        <template slot="label">
          Twilio
        </template>

        <praeco-form-item label="Twilio Account Sid" prop="twilioAccountSid" required>
          <el-input id="twilioAccountSid" v-model="twilioAccountSid" :disabled="viewOnly" />
          <label>This is sid of your twilio account.</label>
        </praeco-form-item>

        <praeco-form-item label="Twilio Auth Token" prop="twilioAuth" required>
          <el-input id="twilioAuth" v-model="twilioAuth" :disabled="viewOnly" />
          <label>Auth token assosiated with your twilio account.</label>
        </praeco-form-item>

        <praeco-form-item label="Twilio To Number" prop="twilioToNumber" required>
          <el-input id="twilioToNumber" v-model="twilioToNumber" :disabled="viewOnly" />
          <label>The phone number where you would like send the notification. </label>
        </praeco-form-item>

        <praeco-form-item label="Twilio From Number" prop="twilioFromNumber" required>
          <el-input id="twilioFromNumber" v-model="twilioFromNumber" :disabled="viewOnly" />
          <label>Your twilio phone number from which message will be sent. </label>
        </praeco-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('pagertree')">
        <template slot="label">
          PagerTree
        </template>

        <praeco-form-item label="Pager Tree Integration Url" prop="pagertreeIntegrationUrl" required>
          <el-input id="pagertreeIntegrationUrl" v-model="pagertreeIntegrationUrl" :disabled="viewOnly" />
          <label>URL generated by PagerTree for the integration.</label>
        </praeco-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('exotel')">
        <template slot="label">
          Exotel
        </template>

        <praeco-form-item label="Exotel Account Sid" prop="exotelAccountSid" required>
          <el-input id="exotelAccountSid" v-model="exotelAccountSid" :disabled="viewOnly" />
          <label>This is sid of your Exotel account.</label>
        </praeco-form-item>

        <praeco-form-item label="Exotel Auth Token" prop="exotelAuthToken" required>
          <el-input id="exotelAuthToken" v-model="exotelAuthToken" :disabled="viewOnly" />
          <label>Auth token assosiated with your Exotel account.</label>
        </praeco-form-item>

        <praeco-form-item label="Exotel To Number" prop="exotelToNumber" required>
          <el-input id="exotelToNumber" v-model="exotelToNumber" :disabled="viewOnly" />
          <label>The phone number where you would like send the notification.</label>
        </praeco-form-item>

        <praeco-form-item label="Exotel From Number" prop="exotelFromNumber" required>
          <el-input id="exotelFromNumber" v-model="exotelFromNumber" :disabled="viewOnly" />
          <label>Your exophone number from which message will be sent.</label>
        </praeco-form-item>

        <praeco-form-item label="Exotel Message Body" prop="exotelMessageBody">
          <el-input id="exotelMessageBody" v-model="exotelMessageBody" :disabled="viewOnly" />
          <label>Message you want to send in the sms, is you don’t specify this argument only the rule name is sent</label>
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

let validateMattermostDestination = (rule, value, callback) => {
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
      email
      && !email.trim().match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)
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
    let groupSnsValue = 'profile';
    if (typeof this.$store.state.config.alert.snsAwsProfile === 'undefined' || this.$store.state.config.alert.snsAwsProfile === '') {
      groupSnsValue = 'notProfile';
    }
    return {
      groupSns: groupSnsValue,
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
        mattermostChannelOverride: [
          {
            validator: validateMattermostDestination,
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
        ],
        pagertreeIntegrationUrl: [
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

    exotelAccountSid: {
      get() {
        return this.$store.state.config.alert.exotelAccountSid;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_EXOTEL_ACCOUNT_SID',
          value
        );
      }
    },

    exotelAuthToken: {
      get() {
        return this.$store.state.config.alert.exotelAuthToken;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_EXOTEL_AUTH_TOKEN',
          value
        );
      }
    },

    exotelToNumber: {
      get() {
        return this.$store.state.config.alert.exotelToNumber;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_EXOTEL_TO_NUMBER',
          value
        );
      }
    },

    exotelFromNumber: {
      get() {
        return this.$store.state.config.alert.exotelFromNumber;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_EXOTEL_FROM_NUMBER',
          value
        );
      }
    },

    exotelMessageBody: {
      get() {
        return this.$store.state.config.alert.exotelMessageBody;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_EXOTEL_MESSAGE_BODY',
          value
        );
      }
    },

    twilioAccountSid: {
      get() {
        return this.$store.state.config.alert.twilioAccountSid;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TWILIO_ACCOUNT_SID',
          value
        );
      }
    },

    twilioAuth: {
      get() {
        return this.$store.state.config.alert.twilioAuth;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TWILIO_AUTH_TOKEN',
          value
        );
      }
    },

    twilioToNumber: {
      get() {
        return this.$store.state.config.alert.twilioToNumber;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TWILIO_TO_NUMBER',
          value
        );
      }
    },

    twilioFromNumber: {
      get() {
        return this.$store.state.config.alert.twilioFromNumber;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TWILIO_FROM_NUMBER',
          value
        );
      }
    },

    pagertreeIntegrationUrl: {
      get() {
        return this.$store.state.config.alert.pagertreeIntegrationUrl;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_PAGERTREE_INTEGRATION_URL',
          value
        );
      }
    },

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
    },

    zbxHost: {
      get() {
        return this.$store.state.config.alert.zbxHost;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ZBX_HOST',
          value
        );
      }
    },

    zbxKey: {
      get() {
        return this.$store.state.config.alert.zbxKey;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ZBX_KEY',
          value
        );
      }
    },

    linenotifyAccessToken: {
      get() {
        return this.$store.state.config.alert.linenotifyAccessToken;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_LINENOTIFY_ACCESS_TOKEN',
          value
        );
      }
    },

    command: {
      get() {
        return this.$store.state.config.alert.command;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_COMMAND',
          value.split(',')
        );
      }
    },

    gitterMsgLevel: {
      get() {
        return this.$store.state.config.alert.gitterMsgLevel;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_GITTER_MSG_LEVEL', value);
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

    googleChatWebhookUrl: {
      get() {
        return this.$store.state.config.alert.googleChatWebhookUrl;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GOOGLE_CHAT_WEBHOOK_URL',
          value
        );
      }
    },

    googleChatFormat: {
      get() {
        return this.$store.state.config.alert.googleChatFormat;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GOOGLE_CHAT_FORMAT',
          value
        );
      }
    },

    googleChatHeaderTitle: {
      get() {
        return this.$store.state.config.alert.googleChatHeaderTitle;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GOOGLE_CHAT_HEADER_TITLE',
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

    mattermostChannelOverride: {
      get() {
        return this.$store.state.config.alert.mattermostChannelOverride;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MATTERMOST_CHANNEL_OVERRIDE', value);
      }
    },

    mattermostUsernameOverride: {
      get() {
        return this.$store.state.config.alert.mattermostUsernameOverride;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MATTERMOST_USERNAME_OVERRIDE',
          value
        );
      }
    },

    mattermostMsgColor: {
      get() {
        return this.$store.state.config.alert.mattermostMsgColor;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MATTERMOST_MSG_COLOR', value);
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

    changeSns() {
      this.snsAwsAccessKeyId = '';
      this.snsAwsSecretAccessKey = '';
      this.snsAwsRegion = '';
      this.snsAwsProfile = '';
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

  &.mattermost-danger .el-radio__inner:hover {
    border-color: red;
  }
  &.mattermost-danger .el-radio__input.is-checked .el-radio__inner {
    border-color: red;
    background: red;
  }
  &.mattermost-danger .el-radio__input.is-checked + .el-radio__label,
  &.mattermost-danger {
    color: red !important;
    border-color: red !important;
  }
  &.mattermost-warning .el-radio__inner:hover {
    border-color: orange;
  }
  &.mattermost-warning .el-radio__input.is-checked .el-radio__inner {
    border-color: orange;
    background: orange;
  }
  &.mattermost-warning .el-radio__input.is-checked + .el-radio__label,
  &.mattermost-warning {
    color: orange !important;
    border-color: orange !important;
  }
  &.mattermost-good .el-radio__inner:hover {
    border-color: green;
  }
  &.mattermost-good .el-radio__input.is-checked .el-radio__inner {
    border-color: green;
    background: green;
  }
  &.mattermost-good .el-radio__input.is-checked + .el-radio__label,
  &.mattermost-good {
    color: green !important;
    border-color: green !important;
  }
  &.gitter-error .el-radio__inner:hover {
    border-color: red;
  }
  &.gitter-error .el-radio__input.is-checked .el-radio__inner {
    border-color: red;
    background: red;
  }
  &.gitter-error .el-radio__input.is-checked + .el-radio__label,
  &.gitter-error {
    color: red !important;
    border-color: red !important;
  }
  &.gitter-info .el-radio__inner:hover {
    border-color: blue;
  }
  &.gitter-info .el-radio__input.is-checked .el-radio__inner {
    border-color: green;
    background: blue;
  }
  &.gitter-info .el-radio__input.is-checked + .el-radio__label,
  &.gitter-info {
    color: green !important;
    border-color: blue !important;
  }
}
</style>
