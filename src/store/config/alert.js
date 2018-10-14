import get from 'lodash.get';
import format from 'string-format';
import { htmlToConfigFormat } from '@/lib/alertText';

function initialState() {
  return {
    alert: [],
    realert: null,

    subject: '',
    body: '',
    bodyType: 'default',

    slackWebhookUrl: '',
    slackChannelOverride: '',
    slackUsernameOverride: 'Praeco',
    slackMsgColor: 'danger',

    smtpHost: '',
    smtpPort: null,
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
      let encodedPath = encodeURIComponent(rootState.config.fullPath);

      return `${appUrl}/rules/${encodedPath}`;
    },

    subjectRendered(state, getters, rootState) {
      let subject = htmlToConfigFormat(state.subject);
      subject.alertArgs = subject.alertArgs.map(a => get(rootState.config.sampleResult, a) || '<MISSING VALUE>');

      return format(subject.alertText, ...subject.alertArgs);
    },

    bodyRendered(state, getters, rootState) {
      let body = htmlToConfigFormat(state.body);
      body.alertArgs = body.alertArgs.map(a => get(rootState.config.sampleResult, a) || '<MISSING VALUE>');

      return format(body.alertText, ...body.alertArgs);
    }
  },

  mutations: {
    /*eslint-disable */
    RESET(state) {
      /* eslint-enable */
      state = Object.assign(state, initialState());
    },

    UPDATE_HTTP_POST_URL(state, httpPostUrl) {
      state.httpPostUrl = httpPostUrl;
    },

    UPDATE_SMTP_HOST(state, smtpHost) {
      state.smtpHost = smtpHost;
    },

    UPDATE_SMTP_PORT(state, smtpPort) {
      state.smtpPort = smtpPort;
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

    UPDATE_SLACK_WEBHOOK_URL(state, slackWebhookUrl) {
      state.slackWebhookUrl = slackWebhookUrl;
    },

    UPDATE_SLACK_CHANNEL_OVERRIDE(state, slackChannelOverride) {
      state.slackChannelOverride = slackChannelOverride;
    },

    UPDATE_SLACK_USERNAME_OVERRIDE(state, slackUsernameOverride) {
      state.slackUsernameOverride = slackUsernameOverride;
    },

    UPDATE_SLACK_MSG_COLOR(state, slackMsgColor) {
      state.slackMsgColor = slackMsgColor;
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
