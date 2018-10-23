import axios from 'axios';
import yaml from 'js-yaml';
import { htmlToConfigFormat } from '@/lib/alertText';
import { logger } from '@/lib/logger.js';
import settings from './settings';
import query from './query';
import match from './match';
import alert from './alert';

let sampleCancelToken = null;

export default {
  namespaced: true,

  modules: {
    settings,
    query,
    match,
    alert
  },

  state: {
    path: '',
    type: '',

    valid: true,
    validating: false,
    validateError: null,

    sampleResult: null
  },

  mutations: {
    UPDATE_TYPE(state, type) {
      state.type = type;
    },

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
    },

    CLEAR_SAMPLE(state) {
      state.sampleResult = null;
    },

    UPDATE_PATH(state, path) {
      state.path = path;
    }
  },

  actions: {
    reset({ commit }) {
      commit('CLEAR_SAMPLE');
      commit('settings/RESET');
      commit('query/RESET');
      commit('match/RESET');
      commit('alert/RESET');
    },

    async load({ dispatch, commit, rootState }, { type, path }) {
      await dispatch('configs/fetchConfig', { type, path }, { root: true });
      let config = rootState.configs[type][path];

      if (config) {
        dispatch('reset');

        let folderPath = path.split('/');
        folderPath.pop();
        folderPath = folderPath.join('/');

        commit('UPDATE_PATH', folderPath);

        commit('settings/UPDATE_NAME', config.name);
        commit('settings/UPDATE_DESCRIPTION', config.description);
        commit('settings/UPDATE_INDEX', config.index);

        // If is_enabled is not in the config, the rule is in fact enabled
        if (config.is_enabled === undefined || config.is_enabled) {
          commit('settings/UPDATE_ENABLED', true);
        } else {
          commit('settings/UPDATE_ENABLED', false);
        }

        if (config.__praeco_query_builder && config.__praeco_query_builder.query) {
          commit('query/UPDATE_TREE', config.__praeco_query_builder.query);
        }

        commit('match/UPDATE_TYPE', config.type);
        commit('match/UPDATE_IGNORE_NULL', config.ignore_null);
        commit('match/UPDATE_DOC_TYPE', config.doc_type);
        commit('match/UPDATE_QUERY_KEY', config.query_key);
        commit('match/UPDATE_COMPARE_KEY', config.compare_key);
        commit('match/UPDATE_TIMEFRAME', config.timeframe);
        if (config.type === 'change' && config.timeframe && Object.keys(config.timeframe).length) {
          commit('match/UPDATE_USE_TIMEFRAME', true);
        }

        if (config.blacklist) {
          config.blacklist.forEach(entry => commit('match/ADD_BLACKLIST_ENTRY', entry));
        }

        if (config.whitelist) {
          config.whitelist.forEach(entry => commit('match/ADD_WHITELIST_ENTRY', entry));
        }

        commit('match/UPDATE_NUM_EVENTS', config.num_events);
        commit('match/UPDATE_USE_TERMS_QUERY', config.use_terms_query);
        commit('match/UPDATE_USE_COUNT_QUERY', config.use_count_query);
        commit('match/UPDATE_TERMS_SIZE', config.terms_size);
        commit('match/UPDATE_THRESHOLD_REF', config.threshold_ref);
        commit('match/UPDATE_THRESHOLD_CUR', config.threshold_cur);
        commit('match/UPDATE_SPIKE_HEIGHT', config.spike_height);
        commit('match/UPDATE_SPIKE_TYPE', config.spike_type);

        commit('alert/UPDATE_HTTP_POST_URL', config.http_post_url);
        commit('alert/UPDATE_SMTP_HOST', config.smtp_host);
        commit('alert/UPDATE_SMTP_PORT', config.smtp_port);
        commit('alert/UPDATE_FROM_ADDR', config.from_addr);
        commit('alert/UPDATE_REPLY_TO', config.reply_to);
        commit('alert/UPDATE_EMAIL', config.email);
        commit('alert/UPDATE_CC', config.cc);
        commit('alert/UPDATE_BCC', config.bcc);

        commit('alert/UPDATE_SLACK_WEBHOOK_URL', config.slack_webhook_url);
        commit('alert/UPDATE_SLACK_CHANNEL_OVERRIDE', config.slack_channel_override);
        commit('alert/UPDATE_SLACK_USERNAME_OVERRIDE', config.slack_username_override);
        commit('alert/UPDATE_SLACK_MSG_COLOR', config.slack_msg_color);
        commit('alert/UPDATE_REALERT', config.realert);
        commit('alert/UPDATE_ALERT', config.alert);

        if (config.alert_text_type) {
          commit('alert/UPDATE_BODY_TYPE', config.alert_text_type);
        } else {
          commit('alert/UPDATE_BODY_TYPE', 'default');
        }

        commit('alert/UPDATE_BODY', config.alert_text);
        commit('alert/UPDATE_SUBJECT', config.alert_subject);
      }
    },

    async save({ state, getters, dispatch }, { type, overwrite }) {
      await dispatch('validate');

      if (!state.valid) {
        return;
      }

      return dispatch(
        'configs/createConfig',
        {
          config: getters.config,
          format: false,
          type,
          overwrite
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
        let res = await axios.post('/api/test', {
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
          commit('UPDATE_VALIDATION_ERROR', 'Invalid config. Make sure all required fields are filled out.');
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

      if (sampleCancelToken) {
        sampleCancelToken.cancel();
      }

      let res = {};

      try {
        sampleCancelToken = axios.CancelToken.source();
        res = await axios.post(`/api/search/${getters['settings/wildcardIndex']}`, search, {
          cancelToken: sampleCancelToken.token
        });
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error(error);
        }
      } finally {
        sampleCancelToken = null;
      }

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

      if (state.match.timeframe && Object.keys(state.match.timeframe).length) {
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

      if (state.match.timeframe && Object.keys(state.match.timeframe).length) {
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

      if (state.match.useTimeframe && state.match.timeframe && Object.keys(state.match.timeframe).length) {
        config.timeframe = state.match.timeframe;
      }

      config.ignore_null = !!state.match.ignoreNull;

      return config;
    },

    whitelist(state) {
      let config = {};

      if (state.match.compareKey) {
        config.compare_key = state.match.compareKey;
      }

      config.ignore_null = !!state.match.ignoreNull;

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

      if (state.path) {
        config.__praeco_full_path = `${state.path}/${state.settings.name}`;
      } else {
        config.__praeco_full_path = state.settings.name;
      }

      config.__praeco_query_builder = JSON.stringify({ query: state.query.tree });

      if (state.settings.name) {
        config.name = state.settings.name;
      }

      if (state.settings.index) {
        config.index = state.settings.index;
      }
      
      config.is_enabled = !!state.settings.isEnabled;

      config.use_strftime_index = getters['settings/strftime'];

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
