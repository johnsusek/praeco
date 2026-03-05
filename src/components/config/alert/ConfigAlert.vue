<template>
  <!-- native modifier has been removed, please confirm whether the function has been affected  -->
  <el-form
    ref="form"
    :rules="rules"
    :model="$store.state.config.alert"
    label-position="top"
    @submit.prevent>
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
            @update:model-value="updateRealert" />
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

    <!-- buffer_time -->
    <el-row class="m-s-sm">
      <el-col :span="19">
        <ConfigBufferTime ref="bufferTimeLocal" :view-only="viewOnly" />
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
        <el-checkbox id="destinationSlack" value="slack" border>
          Slack
        </el-checkbox>
        <el-checkbox id="destinationEmail" value="email" border>
          Email
        </el-checkbox>
        <el-checkbox id="destinationPost" value="post" border>
          HTTP POST
        </el-checkbox>
        <el-checkbox id="destinationPost2" value="post2" border>
          HTTP POST 2
        </el-checkbox>
        <el-checkbox id="destinationTelegram" value="telegram" border>
          Telegram
        </el-checkbox>
        <el-checkbox id="destinationJira" value="jira" border>
          Jira
        </el-checkbox>
        <el-checkbox id="destinationGoogleChats" value="googlechat" border>
          Google Chat
        </el-checkbox>
        <el-checkbox id="destinationMattermost" value="mattermost" border>
          Mattermost
        </el-checkbox>
        <el-checkbox id="destinationCommand" value="command" border>
          Command
        </el-checkbox>
        <el-checkbox id="destinationGitter" value="gitter" border>
          Gitter
        </el-checkbox>
        <el-checkbox id="destinationSns" value="sns" border>
          AWS SNS (Amazon Simple Notification Service)
        </el-checkbox>
        <el-checkbox id="destinationSes" value="ses" border>
          AWS SES (Amazon Simple Email Service)
        </el-checkbox>
        <el-checkbox id="destinationZabbix" value="zabbix" border>
          Zabbix
        </el-checkbox>
        <el-checkbox id="destinationTwilio" value="twilio" border>
          Twilio
        </el-checkbox>
        <el-checkbox id="destinationPagerTree" value="pagertree" border>
          PagerTree
        </el-checkbox>
        <el-checkbox id="destinationExotel" value="exotel" border>
          Exotel
        </el-checkbox>
        <el-checkbox id="destinationStomp" value="stomp" border>
          Stomp
        </el-checkbox>
        <el-checkbox id="destinationVictorOps" value="victorops" border>
          Splunk On-Call (Formerly VictorOps)
        </el-checkbox>
        <el-checkbox id="destinationServiceNow" value="servicenow" border>
          ServiceNow
        </el-checkbox>
        <el-checkbox id="destinationChatwork" value="chatwork" border>
          Chatwork
        </el-checkbox>
        <el-checkbox id="destinationDiscord" value="discord" border>
          Discord
        </el-checkbox>
        <el-checkbox id="destinationHivealerter" value="hivealerter" border>
          TheHive
        </el-checkbox>
        <el-checkbox id="destinationAlerta" value="alerta" border>
          Alerta
        </el-checkbox>
        <el-checkbox id="destinationDatadog" value="datadog" border>
          Datadog
        </el-checkbox>
        <el-checkbox id="destinationRocketChat" value="rocketchat" border>
          Rocket.Chat
        </el-checkbox>
        <el-checkbox id="destinationPagerDuty" value="pagerduty" border>
          PagerDuty
        </el-checkbox>
        <el-checkbox id="destinationTencentSms" value="tencent_sms" border>
          TencentSMS
        </el-checkbox>
        <el-checkbox id="destinationAlertmanager" value="alertmanager" border>
          Alertmanager
        </el-checkbox>
        <el-checkbox id="destinationDingtalk" value="dingtalk" border>
          Dingtalk
        </el-checkbox>
        <el-checkbox id="destinationOpsgenie" value="opsgenie" border>
          Opsgenie
        </el-checkbox>
        <el-checkbox id="destinationGelf" value="gelf" border>
          Gelf
        </el-checkbox>
        <el-checkbox id="destinationLark" value="lark" border>
          Lark
        </el-checkbox>
        <el-checkbox id="destinationIris" value="iris" border>
          IRIS
        </el-checkbox>
        <el-checkbox id="destinationWorkWeChat" value="workwechat" border>
          WorkWeChat
        </el-checkbox>
        <el-checkbox id="destinationMatrixHookshot" value="matrixhookshot" border>
          Matrix Hookshot
        </el-checkbox>
        <el-checkbox id="destinationMsPowerAutomate" value="ms_power_automate" border>
          MS PowerAutomate
        </el-checkbox>
        <el-checkbox id="destinationWebex" value="webex_webhook" border>
          Webex
        </el-checkbox>
        <el-checkbox id="destinationYzj" value="yzj" border>
          YZJ
        </el-checkbox>
        <el-checkbox id="destinationFlashduty" value="flashduty" border>
          Flashduty
        </el-checkbox>
        <el-checkbox id="destinationline" value="line" border>
          LINE Message API
        </el-checkbox>
        <el-checkbox id="destinationsmseagle" value="smseagle" border>
          SMSEagle
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-tabs v-if="alert.length" v-model="visibleTabPane" class="border-card-plain m-n-sm" type="card">
      <el-tab-pane
        name="alert"
        v-if="alert.includes('alerta')
          || alert.includes('alertmanager')
          || alert.includes('chatwork')
          || alert.includes('datadog')
          || alert.includes('dingtalk')
          || alert.includes('discord')
          || alert.includes('email')
          || alert.includes('flashduty')
          || alert.includes('gitter')
          || alert.includes('googlechat')
          || alert.includes('hivealerter')
          || alert.includes('iris')
          || alert.includes('jira')
          || alert.includes('lark')
          || alert.includes('line')
          || alert.includes('mattermost')
          || alert.includes('ms_power_automate')
          || alert.includes('opsgenie')
          || alert.includes('pagerduty')
          || alert.includes('pagertree')
          || alert.includes('rocketchat')
          || alert.includes('servicenow')
          || alert.includes('ses')
          || alert.includes('slack')
          || alert.includes('smseagle')
          || alert.includes('sns')
          || alert.includes('stomp')
          || alert.includes('tencent_sms')
          || alert.includes('victorops')
          || alert.includes('gelf')
          || alert.includes('workwechat')
          || alert.includes('matrixhookshot')
          || alert.includes('webex_webhook')
          || alert.includes('yzj')
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
      <el-tab-pane v-if="alert.includes('slack')" name="slack">
        <template #label>
          <Icon :icon="['fab', 'slack']" size="1x" /> Slack
        </template>
        <ConfigAlertSlack ref="slack" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Email -->
      <el-tab-pane v-if="alert.includes('email')" name="email">
        <template #label>
          <span><Icon icon="envelope" size="1x" /> Email</span>
        </template>
        <ConfigAlertEmail ref="email" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- HTTP POST -->
      <el-tab-pane v-if="alert.includes('post')" label="HTTP" name="post">
        <template #label>
          <span><Icon icon="globe" /> HTTP POST</span>
        </template>
        <ConfigAlertHttpPost ref="post" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- HTTP POST 2 -->
      <el-tab-pane v-if="alert.includes('post2')" label="HTTP2" name="post2">
        <template #label>
          <span><Icon icon="globe" /> HTTP POST 2</span>
        </template>
        <ConfigAlertHttpPost2 ref="post2" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Telegram -->
      <el-tab-pane v-if="alert.includes('telegram')" name="telegram">
        <template #label>
          <Icon :icon="['fab', 'telegram']" size="1x" /> Telegram
        </template>
        <ConfigAlertTelegram ref="telegram" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Jira -->
      <el-tab-pane v-if="alert.includes('jira')" name="jira">
        <template #label>
          <Icon :icon="['fab', 'jira']" size="1x" /> Jira
        </template>
        <ConfigAlertJira ref="jira" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Google Chat -->
      <el-tab-pane v-if="alert.includes('googlechat')" name="googlechat">
        <template #label>
          Google Chat
        </template>
        <ConfigAlertGoogleChat ref="googlechat" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Mattermost -->
      <el-tab-pane v-if="alert.includes('mattermost')" name="mattermost">
        <template #label>
          Mattermost
        </template>
        <ConfigAlertMattermost ref="mattermost" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Command -->
      <el-tab-pane v-if="alert.includes('command')" name="command">
        <template #label>
          Command
        </template>
        <ConfigAlertCommand ref="command" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Gitter -->
      <el-tab-pane v-if="alert.includes('gitter')" name="gitter">
        <template #label>
          <Icon :icon="['fab', 'gitter']" size="1x" /> Gitter
        </template>
        <ConfigAlertGitter ref="gitter" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Amazon SNS -->
      <el-tab-pane v-if="alert.includes('sns')" name="sns">
        <template #label>
          <Icon :icon="['fab', 'aws']" size="1x" /> Amazon SNS
        </template>
        <ConfigAlertAmazonSns ref="sns" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Amazon SES -->
      <el-tab-pane v-if="alert.includes('ses')" name="ses">
        <template #label>
          <Icon :icon="['fab', 'aws']" size="1x" /> Amazon SES
        </template>
        <ConfigAlertAmazonSes ref="ses" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Zabbix -->
      <el-tab-pane v-if="alert.includes('zabbix')" name="zabbix">
        <template #label>
          Zabbix
        </template>
        <ConfigAlertZabbix ref="zabbix" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Twilio -->
      <el-tab-pane v-if="alert.includes('twilio')" name="twilio">
        <template #label>
          Twilio
        </template>
        <ConfigAlertTwilio ref="twilio" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- PagerTree -->
      <el-tab-pane v-if="alert.includes('pagertree')" name="pagertree">
        <template #label>
          PagerTree
        </template>
        <ConfigAlertPagerTree ref="pagertree" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Exotel -->
      <el-tab-pane v-if="alert.includes('exotel')" name="exotel">
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
      <el-tab-pane v-if="alert.includes('victorops')" name="victorops">
        <template #label>
          VictorOps
        </template>
        <ConfigAlertVictorOps ref="victorops" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- ServiceNow -->
      <el-tab-pane v-if="alert.includes('servicenow')" name="servicenow">
        <template #label>
          ServiceNow
        </template>
        <ConfigAlertServiceNow ref="servicenow" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Chatwork -->
      <el-tab-pane v-if="alert.includes('chatwork')" name="chatwork">
        <template #label>
          Chatwork
        </template>
        <ConfigAlertChatwork ref="chatwork" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Discord -->
      <el-tab-pane v-if="alert.includes('discord')" name="discord">
        <template #label>
          Discord
        </template>
        <ConfigAlertDiscord ref="discord" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- TheHive -->
      <el-tab-pane v-if="alert.includes('hivealerter')" name="hivealerter">
        <template #label>
          TheHive
        </template>
        <ConfigAlertTheHive ref="hivealerter" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Alerta -->
      <el-tab-pane v-if="alert.includes('alerta')" name="alerta">
        <template #label>
          Alerta
        </template>
        <ConfigAlertAlerta ref="alerta" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Datadog -->
      <el-tab-pane v-if="alert.includes('datadog')" name="datadog">
        <template #label>
          Datadog
        </template>
        <ConfigAlertDatadog ref="datadog" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Rocket.Chat -->
      <el-tab-pane v-if="alert.includes('rocketchat')" name="rocketchat">
        <template #label>
          <Icon :icon="['fab', 'rocketchat']" size="1x" /> Rocket.Chat
        </template>
        <ConfigAlertRocketChat ref="rocketchat" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- PagerDuty -->
      <el-tab-pane v-if="alert.includes('pagerduty')" name="pagerduty">
        <template #label>
          PagerDuty
        </template>
        <ConfigAlertPagerDuty ref="pagerduty" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Tencent SMS -->
      <el-tab-pane v-if="alert.includes('tencent_sms')" name="tencent_sms">
        <template #label>
          TencentSMS
        </template>
        <ConfigAlertTencentSms ref="tencent_sms" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Alertmanager -->
      <el-tab-pane v-if="alert.includes('alertmanager')" name="alertmanager">
        <template #label>
          Alertmanager
        </template>
        <ConfigAlertAlertmanager ref="alertmanager" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Dingtalk -->
      <el-tab-pane v-if="alert.includes('dingtalk')" name="dingtalk">
        <template #label>
          Dingtalk
        </template>
        <ConfigAlertDingtalk ref="dingtalk" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Opsgenie -->
      <el-tab-pane v-if="alert.includes('opsgenie')" name="opsgenie">
        <template #label>
          Opsgenie
        </template>
        <ConfigAlertOpsgenie ref="opsgenie" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Gelf -->
      <el-tab-pane v-if="alert.includes('gelf')" label="Gelf" name="gelf">
        <template #label>
          <span><Icon icon="globe" /> Gelf</span>
        </template>
        <ConfigAlertGelf ref="gelf" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Lark -->
      <el-tab-pane v-if="alert.includes('lark')" name="lark">
        <template #label>
          Lark
        </template>
        <ConfigAlertLark ref="lark" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- IRIS -->
      <el-tab-pane v-if="alert.includes('iris')" name="iris">
        <template #label>
          IRIS
        </template>
        <ConfigAlertIris ref="iris" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- WorkWeChat -->
      <el-tab-pane v-if="alert.includes('workwechat')" name="workwechat">
        <template #label>
          WorkWeChat
        </template>
        <ConfigAlertWorkWeChat ref="workwechat" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Matrix Hookshot -->
      <el-tab-pane v-if="alert.includes('matrixhookshot')" name="matrixhookshot">
        <template #label>
          Matrix Hookshot
        </template>
        <ConfigAlertMatrixHookshot ref="matrixhookshot" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- MS PowerAutomate -->
      <el-tab-pane v-if="alert.includes('ms_power_automate')" name="ms_power_automate">
        <template #label>
          <Icon :icon="['fab', 'microsoft']" size="1x" /> MS PowerAutomate
        </template>
        <ConfigAlertMsPowerAutomate ref="ms_power_automate" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Webex -->
      <el-tab-pane v-if="alert.includes('webex_webhook')" name="webex_webhook">
        <template #label>
          Webex
        </template>
        <ConfigAlertWebex ref="webex_webhook" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- YZJ -->
      <el-tab-pane v-if="alert.includes('yzj')" name="yzj">
        <template #label>
          YZJ
        </template>
        <ConfigAlertYzj ref="yzj" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- Flashduty -->
      <el-tab-pane v-if="alert.includes('flashduty')" name="flashduty">
        <template #label>
          Flashduty
        </template>
        <ConfigAlertFlashDuty ref="flashduty" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- LINE Message API -->
      <el-tab-pane v-if="alert.includes('line')" name="line">
        <template #label>
          <Icon :icon="['fab', 'line']" size="1x" /> LINE Message API
        </template>
        <ConfigAlertLineMessageApi ref="line" :view-only="viewOnly" />
      </el-tab-pane>

      <!-- SMSEagle -->
      <el-tab-pane v-if="alert.includes('smseagle')" name="smseagle">
        <template #label>
          SMSEagle
        </template>
        <ConfigAlertSmsEagle ref="smseagle" :view-only="viewOnly" />
      </el-tab-pane>
    </el-tabs>
  </el-form>
</template>

<script>
import isURL from 'validator/lib/isURL';
import isEmail from 'validator/lib/isEmail';
import ConfigAlertSubjectBody from './ConfigAlertSubjectBody.vue';
import ConfigAlertAlerta from './ConfigAlertAlerta.vue';
import ConfigAlertAlertmanager from './ConfigAlertAlertmanager.vue';
import ConfigAlertAmazonSes from './ConfigAlertAmazonSes.vue';
import ConfigAlertAmazonSns from './ConfigAlertAmazonSns.vue';
import ConfigAlertChatwork from './ConfigAlertChatwork.vue';
import ConfigAlertCommand from './ConfigAlertCommand.vue';
import ConfigAlertDingtalk from './ConfigAlertDingtalk.vue';
import ConfigAlertDatadog from './ConfigAlertDatadog.vue';
import ConfigAlertDiscord from './ConfigAlertDiscord.vue';
import ConfigAlertEmail from './ConfigAlertEmail.vue';
import ConfigAlertExotel from './ConfigAlertExotel.vue';
import ConfigAlertFlashDuty from './ConfigAlertFlashDuty.vue';
import ConfigAlertGelf from './ConfigAlertGelf.vue';
import ConfigAlertGitter from './ConfigAlertGitter.vue';
import ConfigAlertGoogleChat from './ConfigAlertGoogleChat.vue';
import ConfigAlertHttpPost from './ConfigAlertHttpPost.vue';
import ConfigAlertHttpPost2 from './ConfigAlertHttpPost2.vue';
import ConfigAlertIris from './ConfigAlertIris.vue';
import ConfigAlertJira from './ConfigAlertJira.vue';
import ConfigAlertLark from './ConfigAlertLark.vue';
import ConfigAlertLineMessageApi from './ConfigAlertLineMessageApi.vue';
import ConfigAlertMattermost from './ConfigAlertMattermost.vue';
import ConfigAlertMatrixHookshot from './ConfigAlertMatrixHookshot.vue';
import ConfigAlertMsPowerAutomate from './ConfigAlertMsPowerAutomate.vue';
import ConfigAlertOpsgenie from './ConfigAlertOpsgenie.vue';
import ConfigAlertPagerDuty from './ConfigAlertPagerDuty.vue';
import ConfigAlertPagerTree from './ConfigAlertPagerTree.vue';
import ConfigAlertRocketChat from './ConfigAlertRocketChat.vue';
import ConfigAlertServiceNow from './ConfigAlertServiceNow.vue';
import ConfigAlertSlack from './ConfigAlertSlack.vue';
import ConfigAlertSmsEagle from './ConfigAlertSmsEagle.vue';
import ConfigAlertStomp from './ConfigAlertStomp.vue';
import ConfigAlertTencentSms from './ConfigAlertTencentSms.vue';
import ConfigAlertTelegram from './ConfigAlertTelegram.vue';
import ConfigAlertTheHive from './ConfigAlertTheHive.vue';
import ConfigAlertTwilio from './ConfigAlertTwilio.vue';
import ConfigAlertVictorOps from './ConfigAlertVictorOps.vue';
import ConfigAlertZabbix from './ConfigAlertZabbix.vue';
import ConfigAlertWorkWeChat from './ConfigAlertWorkWeChat.vue';
import ConfigAlertWebex from './ConfigAlertWebex.vue';
import ConfigAlertYzj from './ConfigAlertYzj.vue';

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
    ConfigAlertFlashDuty,
    ConfigAlertGelf,
    ConfigAlertGitter,
    ConfigAlertGoogleChat,
    ConfigAlertHttpPost,
    ConfigAlertHttpPost2,
    ConfigAlertIris,
    ConfigAlertJira,
    ConfigAlertLark,
    ConfigAlertLineMessageApi,
    ConfigAlertMattermost,
    ConfigAlertMatrixHookshot,
    ConfigAlertMsPowerAutomate,
    ConfigAlertOpsgenie,
    ConfigAlertPagerDuty,
    ConfigAlertPagerTree,
    ConfigAlertRocketChat,
    ConfigAlertServiceNow,
    ConfigAlertSlack,
    ConfigAlertSmsEagle,
    ConfigAlertStomp,
    ConfigAlertTencentSms,
    ConfigAlertTelegram,
    ConfigAlertTheHive,
    ConfigAlertTwilio,
    ConfigAlertVictorOps,
    ConfigAlertZabbix,
    ConfigAlertWorkWeChat,
    ConfigAlertWebex,
    ConfigAlertYzj
  },

  props: ['viewOnly'],
  emits: ['validate'],

  data() {
    return {
      visibleTabPane: 'alert',
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
        smseagleUrl: [
          {
            validator: validateUrl,
            trigger: ['change', 'blur']
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
      /*eslint-disable */
      this.realert[Object.keys(value)[0]] = Object.values(value)[0];
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
