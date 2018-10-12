import axios from 'axios';
import yaml from 'js-yaml';
import { htmlToConfigFormat } from '@/lib/alertText';
import { logger } from '@/lib/logger.js';
import settings from './settings';
import query from './query';
import match from './match';
import alert from './alert';

export default {
  namespaced: true,

  modules: {
    settings,
    query,
    match,
    alert
  },

  state: {
    fullPath: '',

    valid: true,
    validating: false,
    validateError: null,

    sampleResult: null
  },

  mutations: {
    UPDATE_VALID(state, valid) {
      state.valid = valid;
    },

    UPDATE_VALIDATING(state, validating) {
      state.validating = validating;
    },

    UPDATE_VALIDATION_ERROR(state, validateError) {
      state.validateError = validateError;
    },

    UPDATE_SAMPLE_RESULT(state, sampleResult) {
      state.sampleResult = sampleResult;
    }
  },

  actions: {
    async save({ state, getters, dispatch }, { type }) {
      await dispatch('validate');

      if (!state.valid) {
        return;
      }

      return dispatch(
        'configs/createConfig',
        {
          config: getters.config,
          format: false,
          type
        },
        {
          root: true
        }
      );
    },

    async validate({ commit, getters }) {
      commit('UPDATE_VALIDATION_ERROR', null);
      commit('UPDATE_VALIDATING', true);

      try {
        let res = await axios.post('/test', {
          rule: getters.yaml,
          options: {
            testType: 'schemaOnly',
            days: 1,
            alert: false,
            format: 'json'
          }
        });
        if (res.data && res.data.success) {
          commit('UPDATE_VALID', true);
        } else {
          commit('UPDATE_VALID', false);
          commit(
            'UPDATE_VALIDATION_ERROR',
            'Invalid config. Make sure all required fields are filled out.'
          );
        }
      } catch (error) {
        commit('UPDATE_VALID', false);
        commit('UPDATE_VALIDATION_ERROR', error.toString());
        logger.error(error);
        return false;
      } finally {
        commit('UPDATE_VALIDATING', false);
      }
    },

    async sample({ commit, getters }) {
      // gets single result - most recent - from search endpoint and
      // commits to store
      let search = {
        query: {
          bool: {
            must: [
              {
                query_string: { query: getters['query/queryString'] }
              }
            ]
          }
        },
        sort: [{ '@timestamp': { order: 'desc' } }],
        size: 1
      };

      let res = await axios.post(`/search/${getters['settings/wildcardIndex']}`, search);

      if (res.data && res.data.hits && res.data.hits.hits[0] && res.data.hits.hits[0]._source) {
        commit('UPDATE_SAMPLE_RESULT', res.data.hits.hits[0]._source);
      }
    }
  },

  getters: {
    spike(state) {
      let config = {};

      if (state.match.spikeHeight) {
        config.spike_height = state.match.spikeHeight;
      }

      if (state.match.spikeType) {
        config.spike_type = state.match.spikeType;
      }

      if (state.match.thresholdRef) {
        config.threshold_ref = state.match.thresholdRef;
      }

      if (state.match.thresholdCur) {
        config.threshold_cur = state.match.thresholdCur;
      }

      if (Object.keys(state.match.timeframe).length) {
        config.timeframe = state.match.timeframe;
      }

      return config;
    },

    frequency(state) {
      let config = {};

      if (state.match.queryKey) {
        config.query_key = state.match.queryKey;
      }

      if (state.match.docType) {
        config.doc_type = state.match.docType;
      }

      if (state.match.numEvents) {
        config.num_events = state.match.numEvents;
      }

      if (state.match.termsSize) {
        config.terms_size = state.match.termsSize;
      }

      if (state.match.useCountQuery) {
        config.use_count_query = state.match.useCountQuery;
      }

      if (state.match.useTermsQuery) {
        config.use_terms_query = state.match.useTermsQuery;
      }

      if (Object.keys(state.match.timeframe).length) {
        config.timeframe = state.match.timeframe;
      }

      return config;
    },

    change(state) {
      let config = {};

      if (state.match.compareKey) {
        config.compare_key = state.match.compareKey;
      }

      if (state.match.queryKey) {
        config.query_key = state.match.queryKey;
      }

      if (Object.keys(state.match.timeframe).length) {
        config.timeframe = state.match.timeframe;
      }

      config.ignore_null = state.match.ignoreNull;

      return config;
    },

    whitelist(state) {
      let config = {};

      if (state.match.compareKey) {
        config.compare_key = state.match.compareKey;
      }

      config.ignore_null = state.match.ignoreNull;

      if (state.match.whitelist && state.match.whitelist.length) {
        config.whitelist = state.match.whitelist;
      }

      return config;
    },

    blacklist(state) {
      let config = {};

      if (state.match.compareKey) {
        config.compare_key = state.match.compareKey;
      }

      if (state.match.blacklist && state.match.blacklist.length) {
        config.blacklist = state.match.blacklist;
      }

      return config;
    },

    queryString(state, getters) {
      if (getters['query/queryString']) {
        return {
          filter: [
            {
              query: {
                query_string: {
                  query: getters['query/queryString']
                }
              }
            }
          ]
        };
      }
    },

    http(state) {
      let config = {};
      if (state.alert.httpPostUrl) {
        config.http_post_url = state.alert.httpPostUrl;
      }
      return config;
    },

    email(state) {
      let config = {};

      if (state.alert.smtpHost) {
        config.smtp_host = state.alert.smtpHost;
      }

      if (state.alert.smtpPort) {
        config.smtp_port = state.alert.smtpPort;
      }

      if (state.alert.fromAddr) {
        config.from_addr = state.alert.fromAddr;
      }

      if (state.alert.replyTo) {
        config.reply_to = state.alert.replyTo;
      }

      if (state.alert.email) {
        config.email = state.alert.email;
      }

      if (state.alert.cc) {
        config.cc = state.alert.cc;
      }

      if (state.alert.bcc) {
        config.bcc = state.alert.bcc;
      }

      return config;
    },

    slack(state, getters) {
      let config = {};

      if (state.alert.slackWebhookUrl) {
        config.slack_webhook_url = state.alert.slackWebhookUrl;
      }

      if (state.alert.slackChannelOverride) {
        config.slack_channel_override = state.alert.slackChannelOverride;
      }

      if (state.alert.slackUsernameOverride) {
        config.slack_username_override = state.alert.slackUsernameOverride;
      }

      if (state.alert.slackMsgColor) {
        config.slack_msg_color = state.alert.slackMsgColor;
      }

      if (getters['alert/slackTitleLink']) {
        config.slack_title_link = getters['alert/slackTitleLink'];
      }

      return config;
    },

    subjectBody(state) {
      let config = {};

      if (state.alert.subject) {
        let formattedSubject = htmlToConfigFormat(state.alert.subject);
        config.alert_subject = formattedSubject.alertText;
        config.alert_subject_args = formattedSubject.alertArgs;
      }

      if (state.alert.body) {
        let formattedText = htmlToConfigFormat(state.alert.body);
        config.alert_text = formattedText.alertText;
        config.alert_text_args = formattedText.alertArgs;
      }

      if (state.alert.bodyType && state.alert.bodyType !== 'default') {
        config.alert_text_type = state.alert.bodyType;
      }

      return config;
    },

    config(state, getters) {
      let config = {
        ...getters.queryString
      };

      if (state.settings.name) {
        config.name = state.settings.name;
      }

      if (state.settings.index) {
        config.index = state.settings.index;
      }

      if (state.match.type) {
        config.type = state.match.type;
      }

      if (state.alert.alert) {
        config.alert = state.alert.alert;
      }

      if (state.alert.realert) {
        config.realert = state.alert.realert;
      }

      if (state.alert.alert.includes('post')) {
        config = { ...config, ...getters.http };
      }

      if (state.alert.alert.includes('email')) {
        config = { ...config, ...getters.email };
      }

      if (state.alert.alert.includes('slack')) {
        config = { ...config, ...getters.slack };
      }

      if (state.alert.alert.includes('email') || state.alert.alert.includes('slack')) {
        config = { ...config, ...getters.subjectBody };
      }

      if (state.match.type === 'blacklist') {
        config = { ...config, ...getters.blacklist };
      } else if (state.match.type === 'whitelist') {
        config = { ...config, ...getters.whitelist };
      } else if (state.match.type === 'change') {
        config = { ...config, ...getters.change };
      } else if (state.match.type === 'frequency') {
        config = { ...config, ...getters.frequency };
      } else if (state.match.type === 'spike') {
        config = { ...config, ...getters.spike };
      }

      // Sort the keys in the object so it appears alphabetically in the UI
      let conf = {};

      Object.keys(config)
        .sort()
        .forEach(v => {
          conf[v] = config[v];
        });

      return conf;
    },

    yaml(state, getters) {
      return yaml.safeDump(getters.config);
    }
  }
};
