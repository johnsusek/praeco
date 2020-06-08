import get from 'lodash.get';
import format from 'string-format';
import { htmlToConfigFormat } from '@/lib/alertText';

function initialState() {
  return {
    alert: [],
    realert: null,

    aggregationSchedule: '',
    aggregationKey: '',
    summaryTableFields: [],

    subject: '',
    body: '',
    bodyType: 'alert_text_only',

    slackChannelOverride: '',
    slackUsernameOverride: 'Praeco',
    slackEmojiOverride: '',
    slackMsgColor: 'danger',

    ms_teamsWebhookUrl: '',
    ms_teamsThemeColor: '#ff0000',

    telegramRoomId: '',

    jiraProject: '',
    jiraIssueType: '',
    jiraComponents: '',

    fromAddr: '',
    replyTo: '',
    email: '',
    cc: '',
    bcc: '',

    httpPostUrl: ''
  };
}

export default {
  namespaced: true,

  state: {
    ...initialState()
  },

  getters: {
    slackTitleLink(state, getters, rootState) {
      let appUrl = rootState.appconfig.config.appUrl;
      let path = rootState.config.settings.name;

      if (rootState.config.path) {
        path = `${rootState.config.path}/${path}`;
      }

      return `${appUrl}/rules/${encodeURIComponent(path)}`;
    },

    subjectRendered(state, getters, rootState) {
      let subject = htmlToConfigFormat(state.subject);
      let sample = rootState.config.sampleResult;

      subject.alertArgs = subject.alertArgs.map(a => get(sample, a) || '<MISSING VALUE>');

      return format(subject.alertText, ...subject.alertArgs);
    },

    bodyRendered(state, getters, rootState) {
      let body = htmlToConfigFormat(state.body);
      let sample = rootState.config.sampleResult;

      body.alertArgs = body.alertArgs.map(a => get(sample, a) || '<MISSING VALUE>');

      return format(body.alertText, ...body.alertArgs);
    }
  },

  mutations: {
    /*eslint-disable */
    RESET(state) {
      /* eslint-enable */
      state = Object.assign(state, initialState());
    },

    UPDATE_AGGREGATION_SCHEDULE(state, schedule) {
      state.aggregationSchedule = schedule;
    },

    UPDATE_AGGREGATION_KEY(state, key) {
      state.aggregationKey = key;
    },

    UPDATE_SUMMARY_TABLE_FIELDS(state, fields) {
      state.summaryTableFields = fields;
    },

    UPDATE_HTTP_POST_URL(state, httpPostUrl) {
      state.httpPostUrl = httpPostUrl;
    },

    UPDATE_FROM_ADDR(state, fromAddr) {
      state.fromAddr = fromAddr;
    },

    UPDATE_REPLY_TO(state, replyTo) {
      state.replyTo = replyTo;
    },

    UPDATE_EMAIL(state, email) {
      state.email = email;
    },

    UPDATE_CC(state, cc) {
      state.cc = cc;
    },

    UPDATE_BCC(state, bcc) {
      state.bcc = bcc;
    },

    UPDATE_TELEGRAM_ROOM_ID(state, telegramRoomId) {
      state.telegramRoomId = telegramRoomId;
    },

    UPDATE_JIRA_PROJECT(state, jiraProject) {
      state.jiraProject = jiraProject;
    },

    UPDATE_JIRA_ISSUE_TYPE(state, jiraIssueType) {
      state.jiraIssueType = jiraIssueType;
    },

    UPDATE_JIRA_COMPONENTS(state, jiraComponents) {
      state.jiraComponents = jiraComponents;
    },

    UPDATE_SLACK_CHANNEL_OVERRIDE(state, slackChannelOverride) {
      state.slackChannelOverride = slackChannelOverride;
    },

    UPDATE_SLACK_USERNAME_OVERRIDE(state, slackUsernameOverride) {
      state.slackUsernameOverride = slackUsernameOverride;
    },

    UPDATE_SLACK_EMOJI_OVERRIDE(state, slackEmojiOverride) {
      state.slackEmojiOverride = slackEmojiOverride;
    },

    UPDATE_SLACK_MSG_COLOR(state, slackMsgColor) {
      state.slackMsgColor = slackMsgColor;
    },

    UPDATE_MS_TEAMS_WEBHOOK_URL(state, ms_teamsWebhookUrl) {
      state.ms_teamsWebhookUrl  = ms_teamsWebhookUrl;
    },

    UPDATE_MS_TEAMS_THEME_COLOR(state, ms_teamsThemeColor) {
      state.ms_teamsThemeColor = ms_teamsThemeColor;
    },

    UPDATE_REALERT(state, realert) {
      state.realert = realert;
    },

    UPDATE_BODY(state, body) {
      state.body = body;
    },

    UPDATE_BODY_TYPE(state, bodyType) {
      state.bodyType = bodyType;
    },

    UPDATE_SUBJECT(state, subject) {
      state.subject = subject;
    },

    UPDATE_ALERT(state, alert) {
      state.alert = alert;
    }
  }
};
