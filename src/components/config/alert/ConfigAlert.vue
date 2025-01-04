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
        <el-form-item :class="{ 'view-only': viewOnly }" label="Re-alert">
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

    <!-- time_window_change -->
    <el-row class="m-s-sm">
      <el-col :span="19">
        <ConfigTimeWindowFeature ref="timeWindowFeature" :view-only="viewOnly" />
      </el-col>
    </el-row>

    <!-- Limit Excecution -->
    <el-row class="m-s-sm">
      <el-col :span="24">
        <ConfigLimitExcecution ref="limitExcecution" :view-only="viewOnly" />
      </el-col>
    </el-row>

    <!-- KibanaDiscover -->
    <el-row class="m-s-sm">
      <el-col :span="24">
        <ConfigKibanaDiscover ref="kibanaDiscover" :view-only="viewOnly" />
      </el-col>
    </el-row>

    <!-- ScanEntireTimeframe -->
    <el-row class="m-s-sm">
      <el-col :span="24">
        <ConfigScanEntireTimeframe ref="scanEntireTimeframe" :view-only="viewOnly" />
      </el-col>
    </el-row>

    <!-- Owner -->
    <el-row class="m-s-sm">
      <el-col :span="24">
        <ConfigOwner ref="configOwner" :view-only="viewOnly" />
      </el-col>
    </el-row>

    <!-- Priority -->
    <el-row class="m-s-sm">
      <el-col :span="24">
        <ConfigPriority ref="configPriority" :view-only="viewOnly" />
      </el-col>
    </el-row>

    <!-- Description -->
    <el-row class="m-s-sm">
      <el-col :span="24">
        <ConfigDescription ref="configDescription" :view-only="viewOnly" />
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
        <el-checkbox id="destinationEmail" label="email" border>
          Email
        </el-checkbox>
        <el-checkbox id="destinationPost" label="post" border>
          HTTP POST
        </el-checkbox>
        <el-checkbox id="destinationPost2" label="post2" border>
          HTTP POST 2
        </el-checkbox>
        <el-checkbox id="destinationTelegram" label="telegram" border>
          Telegram
        </el-checkbox>
        <el-checkbox id="destinationJira" label="jira" border>
          Jira
        </el-checkbox>
        <el-checkbox id="destinationGoogleChats" label="googlechat" border>
          Google Chat
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
          AWS SNS (Amazon Simple Notification Service)
        </el-checkbox>
        <el-checkbox id="destinationSes" label="ses" border>
          AWS SES (Amazon Simple Email Service)
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
        <el-checkbox id="destinationStomp" label="stomp" border>
          Stomp
        </el-checkbox>
        <el-checkbox id="destinationVictorOps" label="victorops" border>
          Splunk On-Call (Formerly VictorOps)
        </el-checkbox>
        <el-checkbox id="destinationServiceNow" label="servicenow" border>
          ServiceNow
        </el-checkbox>
        <el-checkbox id="destinationChatwork" label="chatwork" border>
          Chatwork
        </el-checkbox>
        <el-checkbox id="destinationDiscord" label="discord" border>
          Discord
        </el-checkbox>
        <el-checkbox id="destinationHivealerter" label="hivealerter" border>
          TheHive
        </el-checkbox>
        <el-checkbox id="destinationAlerta" label="alerta" border>
          Alerta
        </el-checkbox>
        <el-checkbox id="destinationDatadog" label="datadog" border>
          Datadog
        </el-checkbox>
        <el-checkbox id="destinationRocketChat" label="rocketchat" border>
          Rocket.Chat
        </el-checkbox>
        <el-checkbox id="destinationPagerDuty" label="pagerduty" border>
          PagerDuty
        </el-checkbox>
        <el-checkbox id="destinationTencentSms" label="tencent_sms" border>
          TencentSMS
        </el-checkbox>
        <el-checkbox id="destinationAlertmanager" label="alertmanager" border>
          Alertmanager
        </el-checkbox>
        <el-checkbox id="destinationDingtalk" label="dingtalk" border>
          Dingtalk
        </el-checkbox>
        <el-checkbox id="destinationOpsgenie" label="opsgenie" border>
          Opsgenie
        </el-checkbox>
        <el-checkbox id="destinationGelf" label="gelf" border>
          Gelf
        </el-checkbox>
        <el-checkbox id="destinationLark" label="lark" border>
          Lark
        </el-checkbox>
        <el-checkbox id="destinationIris" label="iris" border>
          IRIS
        </el-checkbox>
        <el-checkbox id="destinationWorkWeChat" label="workwechat" border>
          WorkWeChat
        </el-checkbox>
        <el-checkbox id="destinationMatrixHookshot" label="matrixhookshot" border>
          Matrix Hookshot
        </el-checkbox>
        <el-checkbox id="destinationMsPowerAutomate" label="ms_power_automate" border>
          MS PowerAutomate
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-tabs v-if="alert.length" v-model="visibleTabPane" class="border-card-plain m-n-sm" type="card">
      <el-tab-pane
        v-if="alert.includes('alerta')
          || alert.includes('alertmanager')
          || alert.includes('chatwork')
          || alert.includes('datadog')
          || alert.includes('dingtalk')
          || alert.includes('discord')
          || alert.includes('email')
          || alert.includes('gitter')
          || alert.includes('googlechat')
          || alert.includes('hivealerter')
          || alert.includes('iris')
          || alert.includes('jira')
          || alert.includes('lark')
          || alert.includes('mattermost')
          || alert.includes('ms_power_automate')
          || alert.includes('opsgenie')
          || alert.includes('pagerduty')
          || alert.includes('pagertree')
          || alert.includes('rocketchat')
          || alert.includes('servicenow')
          || alert.includes('ses')
          || alert.includes('slack')
          || alert.includes('sns')
          || alert.includes('stomp')
          || alert.includes('tencent_sms')
          || alert.includes('victorops')
          || alert.includes('gelf')
          || alert.includes('workwechat')
          || alert.includes('matrixhookshot')
          || alert.includes('telegram')">
        <template #label>
          <Icon :icon="['fa', 'bell']" size="1x" /> Alert
        </template>
        <ConfigAlertSubjectBody
          ref="subjectBody"
          :view-only="viewOnly"
          class="m-s-lg" />
      </el-tab-pane>

      <!-- Slack -->
      <el-tab-pane v-if="alert.includes('slack')">
        <template #label>
          <Icon :icon="['fab', 'slack']" size="1x" /> Slack
        </template>
        <ConfigAlertSlack ref="slack" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Email -->
      <el-tab-pane v-if="alert.includes('email')">
        <template #label>
          <span><Icon icon="envelope" size="1x" /> Email</span>
        </template>
        <ConfigAlertEmail ref="email" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- HTTP POST -->
      <el-tab-pane v-if="alert.includes('post')" label="HTTP">
        <template #label>
          <span><Icon icon="globe" /> HTTP POST</span>
        </template>
        <ConfigAlertHttpPost ref="post" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- HTTP POST 2 -->
      <el-tab-pane v-if="alert.includes('post2')" label="HTTP2">
        <template #label>
          <span><Icon icon="globe" /> HTTP POST 2</span>
        </template>
        <ConfigAlertHttpPost2 ref="post2" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Telegram -->
      <el-tab-pane v-if="alert.includes('telegram')">
        <template #label>
          <Icon :icon="['fab', 'telegram']" size="1x" /> Telegram
        </template>
        <ConfigAlertTelegram ref="telegram" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Jira -->
      <el-tab-pane v-if="alert.includes('jira')">
        <template #label>
          <Icon :icon="['fab', 'jira']" size="1x" /> Jira
        </template>
        <ConfigAlertJira ref="jira" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Google Chat -->
      <el-tab-pane v-if="alert.includes('googlechat')">
        <template #label>
          Google Chat
        </template>
        <ConfigAlertGoogleChat ref="googlechat" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Mattermost -->
      <el-tab-pane v-if="alert.includes('mattermost')">
        <template #label>
          Mattermost
        </template>
        <ConfigAlertMattermost ref="mattermost" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Command -->
      <el-tab-pane v-if="alert.includes('command')">
        <template #label>
          Command
        </template>
        <ConfigAlertCommand ref="command" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Gitter -->
      <el-tab-pane v-if="alert.includes('gitter')">
        <template #label>
          <Icon :icon="['fab', 'gitter']" size="1x" /> Gitter
        </template>
        <ConfigAlertGitter ref="gitter" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Amazon SNS -->
      <el-tab-pane v-if="alert.includes('sns')">
        <template #label>
          <Icon :icon="['fab', 'aws']" size="1x" /> Amazon SNS
        </template>
        <ConfigAlertAmazonSns ref="sns" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Amazon SES -->
      <el-tab-pane v-if="alert.includes('ses')">
        <template #label>
          <Icon :icon="['fab', 'aws']" size="1x" /> Amazon SES
        </template>
        <ConfigAlertAmazonSes ref="ses" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Zabbix -->
      <el-tab-pane v-if="alert.includes('zabbix')">
        <template #label>
          Zabbix
        </template>
        <ConfigAlertZabbix ref="zabbix" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Twilio -->
      <el-tab-pane v-if="alert.includes('twilio')">
        <template #label>
          Twilio
        </template>
        <ConfigAlertTwilio ref="twilio" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- PagerTree -->
      <el-tab-pane v-if="alert.includes('pagertree')">
        <template #label>
          PagerTree
        </template>
        <ConfigAlertPagerTree ref="pagertree" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Exotel -->
      <el-tab-pane v-if="alert.includes('exotel')">
        <template #label>
          Exotel
        </template>
        <ConfigAlertExotel ref="exotel" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Stomp -->
      <el-tab-pane v-if="alert.includes('stomp')">
        <template #label>
          Stomp
        </template>
        <ConfigAlertStomp ref="stomp" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- VictorOps -->
      <el-tab-pane v-if="alert.includes('victorops')">
        <template #label>
          VictorOps
        </template>
        <ConfigAlertVictorOps ref="victorops" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- ServiceNow -->
      <el-tab-pane v-if="alert.includes('servicenow')">
        <template #label>
          ServiceNow
        </template>
        <ConfigAlertServiceNow ref="servicenow" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Chatwork -->
      <el-tab-pane v-if="alert.includes('chatwork')">
        <template #label>
          Chatwork
        </template>
        <ConfigAlertChatwork ref="chatwork" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Discord -->
      <el-tab-pane v-if="alert.includes('discord')">
        <template #label>
          Discord
        </template>
        <ConfigAlertDiscord ref="discord" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- TheHive -->
      <el-tab-pane v-if="alert.includes('hivealerter')">
        <template #label>
          TheHive
        </template>
        <ConfigAlertTheHive ref="hivealerter" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Alerta -->
      <el-tab-pane v-if="alert.includes('alerta')">
        <template #label>
          Alerta
        </template>
        <ConfigAlertAlerta ref="alerta" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Datadog -->
      <el-tab-pane v-if="alert.includes('datadog')">
        <template #label>
          Datadog
        </template>
        <ConfigAlertDatadog ref="datadog" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Rocket.Chat -->
      <el-tab-pane v-if="alert.includes('rocketchat')">
        <template #label>
          <Icon :icon="['fab', 'rocketchat']" size="1x" /> Rocket.Chat
        </template>
        <ConfigAlertRocketChat ref="rocketchat" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- PagerDuty -->
      <el-tab-pane v-if="alert.includes('pagerduty')">
        <template #label>
          PagerDuty
        </template>
        <ConfigAlertPagerDuty ref="pagerduty" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Tencent SMS -->
      <el-tab-pane v-if="alert.includes('tencent_sms')">
        <template #label>
          TencentSMS
        </template>
        <ConfigAlertTencentSms ref="tencent_sms" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Alertmanager -->
      <el-tab-pane v-if="alert.includes('alertmanager')">
        <template #label>
          Alertmanager
        </template>
        <ConfigAlertAlertmanager ref="alertmanager" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Dingtalk -->
      <el-tab-pane v-if="alert.includes('dingtalk')">
        <template #label>
          Dingtalk
        </template>
        <ConfigAlertDingtalk ref="dingtalk" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Opsgenie -->
      <el-tab-pane v-if="alert.includes('opsgenie')">
        <template #label>
          Opsgenie
        </template>
        <ConfigAlertOpsgenie ref="opsgenie" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Gelf -->
      <el-tab-pane v-if="alert.includes('gelf')" label="Gelf">
        <template #label>
          <span><Icon icon="globe" /> Gelf</span>
        </template>
        <ConfigAlertGelf ref="gelf" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Lark -->
      <el-tab-pane v-if="alert.includes('lark')">
        <template #label>
          Lark
        </template>
        <ConfigAlertLark ref="lark" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- IRIS -->
      <el-tab-pane v-if="alert.includes('iris')">
        <template #label>
          IRIS
        </template>
        <ConfigAlertIris ref="iris" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- WorkWeChat -->
      <el-tab-pane v-if="alert.includes('workwechat')">
        <template #label>
          WorkWeChat
        </template>
        <ConfigAlertWorkWeChat ref="workwechat" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Matrix Hookshot -->
      <el-tab-pane v-if="alert.includes('matrixhookshot')">
        <template #label>
          Matrix Hookshot
        </template>
        <ConfigAlertMatrixHookshot ref="matrixhookshot" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- MS PowerAutomate -->
      <el-tab-pane v-if="alert.includes('ms_power_automate')">
        <template #label>
          <Icon :icon="['fab', 'microsoft']" size="1x" /> MS PowerAutomate
        </template>
        <ConfigAlertMsPowerAutomate ref="ms_power_automate" :view-only="viewOnly" />
      </el-tab-pane>
    </el-tabs>
  </el-form>
</template>

<script>
import isURL from 'validator/lib/isURL';
import isEmail from 'validator/lib/isEmail';
import ConfigAlertSubjectBody from './ConfigAlertSubjectBody';
import ConfigAlertAlerta from './ConfigAlertAlerta';
import ConfigAlertAlertmanager from './ConfigAlertAlertmanager';
import ConfigAlertAmazonSes from './ConfigAlertAmazonSes';
import ConfigAlertAmazonSns from './ConfigAlertAmazonSns';
import ConfigAlertChatwork from './ConfigAlertChatwork';
import ConfigAlertCommand from './ConfigAlertCommand';
import ConfigAlertDingtalk from './ConfigAlertDingtalk';
import ConfigAlertDatadog from './ConfigAlertDatadog';
import ConfigAlertDiscord from './ConfigAlertDiscord';
import ConfigAlertEmail from './ConfigAlertEmail';
import ConfigAlertExotel from './ConfigAlertExotel';
import ConfigAlertGelf from './ConfigAlertGelf';
import ConfigAlertGitter from './ConfigAlertGitter';
import ConfigAlertGoogleChat from './ConfigAlertGoogleChat';
import ConfigAlertHttpPost from './ConfigAlertHttpPost';
import ConfigAlertHttpPost2 from './ConfigAlertHttpPost2';
import ConfigAlertIris from './ConfigAlertIris';
import ConfigAlertJira from './ConfigAlertJira';
import ConfigAlertLark from './ConfigAlertLark';
import ConfigAlertMattermost from './ConfigAlertMattermost';
import ConfigAlertMatrixHookshot from './ConfigAlertMatrixHookshot';
import ConfigAlertMsPowerAutomate from './ConfigAlertMsPowerAutomate';
import ConfigAlertOpsgenie from './ConfigAlertOpsgenie';
import ConfigAlertPagerDuty from './ConfigAlertPagerDuty';
import ConfigAlertPagerTree from './ConfigAlertPagerTree';
import ConfigAlertRocketChat from './ConfigAlertRocketChat';
import ConfigAlertServiceNow from './ConfigAlertServiceNow';
import ConfigAlertSlack from './ConfigAlertSlack';
import ConfigAlertStomp from './ConfigAlertStomp';
import ConfigAlertTencentSms from './ConfigAlertTencentSms';
import ConfigAlertTelegram from './ConfigAlertTelegram';
import ConfigAlertTheHive from './ConfigAlertTheHive';
import ConfigAlertTwilio from './ConfigAlertTwilio';
import ConfigAlertVictorOps from './ConfigAlertVictorOps';
import ConfigAlertZabbix from './ConfigAlertZabbix';
import ConfigAlertWorkWeChat from './ConfigAlertWorkWeChat.vue';

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

let validateUrl = (rule, value, callback) => {
  if (!value) {
    callback();
  } else if (isURL(value)) {
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

let validateMattermostkDestination = (rule, value, callback) => {
  if (!value) {
    callback();
  } else if (value.length < 2) {
    callback(new Error('Please enter a @username or #channel'));
  } else if (!value.startsWith('@') && !value.startsWith('#')) {
    callback(new Error('Please enter a @username or #channel'));
  } else {
    callback();
  }
};

let validateRocketChatDestination = (rule, value, callback) => {
  if (!value) {
    callback();
  } else if (value.length < 2) {
    callback(new Error('Please enter a @username or #channel'));
  } else if (!value.startsWith('@') && !value.startsWith('#')) {
    callback(new Error('Please enter a @username or #channel'));
  } else {
    callback();
  }
};

let validateSlackDestination = (rule, value, callback) => {
  if (!value) {
    callback();
  } else if (value.length < 2) {
    callback(new Error('Please enter a @username or #channel'));
  } else if (!value.startsWith('@') && !value.startsWith('#')) {
    callback(new Error('Please enter a @username or #channel'));
  } else {
    callback();
  }
};

export default {
  components: {
    ConfigAlertSubjectBody,
    ConfigAlertAlerta,
    ConfigAlertAlertmanager,
    ConfigAlertAmazonSes,
    ConfigAlertAmazonSns,
    ConfigAlertChatwork,
    ConfigAlertCommand,
    ConfigAlertDingtalk,
    ConfigAlertDatadog,
    ConfigAlertDiscord,
    ConfigAlertEmail,
    ConfigAlertExotel,
    ConfigAlertGelf,
    ConfigAlertGitter,
    ConfigAlertGoogleChat,
    ConfigAlertHttpPost,
    ConfigAlertHttpPost2,
    ConfigAlertIris,
    ConfigAlertJira,
    ConfigAlertLark,
    ConfigAlertMattermost,
    ConfigAlertMatrixHookshot,
    ConfigAlertMsPowerAutomate,
    ConfigAlertOpsgenie,
    ConfigAlertPagerDuty,
    ConfigAlertPagerTree,
    ConfigAlertRocketChat,
    ConfigAlertServiceNow,
    ConfigAlertSlack,
    ConfigAlertStomp,
    ConfigAlertTencentSms,
    ConfigAlertTelegram,
    ConfigAlertTheHive,
    ConfigAlertTwilio,
    ConfigAlertVictorOps,
    ConfigAlertZabbix,
    ConfigAlertWorkWeChat
  },

  props: ['viewOnly'],
  emits: ['validate'],

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
        alertaApiUrl: [
          {
            validator: validateUrl,
            trigger: ['change', 'blur']
          }
        ],
        discordWebhookUrl: [
          {
            validator: validateUrl,
            trigger: ['change', 'blur']
          }
        ],
        gitterWebhookUrl: [
          {
            validator: validateUrl,
            trigger: ['change', 'blur']
          }
        ],
        googleChatWebhookUrl: [
          {
            validator: validateUrl,
            trigger: ['change', 'blur']
          }
        ],
        httpPostUrl: [
          {
            validator: validateUrl,
            trigger: ['change', 'blur']
          }
        ],
        httpPost2Url: [
          {
            validator: validateUrl,
            trigger: ['change', 'blur']
          }
        ],
        mattermostChannelOverride: [
          {
            validator: validateMattermostkDestination,
            trigger: 'change'
          }
        ],
        matrixhookshotWebhookUrl: [
          {
            validator: validateUrl,
            trigger: ['change', 'blur']
          }
        ],
        msPowerAutomateWebhookUrl: [
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
        ],
        rocketChatChannelOverride: [
          {
            validator: validateRocketChatDestination,
            trigger: 'change'
          }
        ],
        sesFromAddr: [
          {
            validator: validateEmail,
            trigger: 'change'
          }
        ],
        sesEmailReplyTo: [
          {
            validator: validateEmail,
            trigger: 'change'
          }
        ],
        sesEmail: [
          {
            validator: validateEmailCommaSeparated,
            trigger: 'change'
          }
        ],
        sesCc: [
          {
            validator: validateEmailCommaSeparated,
            trigger: 'change'
          }
        ],
        sesBcc: [
          {
            validator: validateEmailCommaSeparated,
            trigger: 'change'
          }
        ],
        servicenowRestUrl: [
          {
            validator: validateUrl,
            trigger: ['change', 'blur']
          }
        ],
        slackChannelOverride: [
          {
            validator: validateSlackDestination,
            trigger: 'change'
          }
        ],
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

  mounted() {
  },

  methods: {
    async validate() {
      try {
        this.$emit('validate', true);
        return true;
      } catch (error) {
        this.$emit('validate', false);
        return false;
      }
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
.atwho-view {
  max-height: 220px;
  height: 220px;
  margin-bottom: -245px;
}

// Fix issue where clicking on label of dropdown didn't register
.atwho-li span {
  pointer-events: none;
}

.limit-excecution {
  margin: 0 auto;
  min-height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
