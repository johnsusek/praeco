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
      state.path = path || '';
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
          commit('query/UPDATE_TYPE', 'tree');
        } else {
          commit('query/UPDATE_MANUAL', config.filter[0].query.query_string.query);
          commit('query/UPDATE_TYPE', 'manual');
        }

        if (config.timestamp_field) {
          commit('settings/UPDATE_TIME_FIELD', config.timestamp_field);
        }

        if (config.timestamp_type) {
          commit('settings/UPDATE_TIME_TYPE', config.timestamp_type);
        }

        commit('match/UPDATE_TYPE', config.type);
        commit('match/UPDATE_IGNORE_NULL', config.ignore_null);
        commit('match/UPDATE_DOC_TYPE', config.doc_type);
        commit('match/UPDATE_QUERY_KEY', config.query_key);
        commit('match/UPDATE_COMPARE_KEY', config.compare_key);
        commit('match/UPDATE_TIMEFRAME', config.timeframe);

        if (config.terms_window_size) {
          commit('match/UPDATE_TERMS_WINDOW_SIZE', config.terms_window_size);
        }

        if (config.window_step_size) {
          commit('match/UPDATE_WINDOW_STEP_SIZE', config.window_step_size);
        }

        if (config.alert_on_missing_field !== undefined) {
          commit('match/UPDATE_ALERT_ON_MISSING_FIELD', !!config.alert_on_missing_field);
        }

        if (config.use_keyword_postfix !== undefined) {
          commit('match/UPDATE_USE_KEYWORD_POSTFIX', !!config.use_keyword_postfix);
        }

        if (config.type === 'change' && config.timeframe && Object.keys(config.timeframe).length) {
          commit('match/UPDATE_USE_TIMEFRAME', true);
        }

        if (config.blacklist) {
          config.blacklist.forEach(entry => commit('match/ADD_BLACKLIST_ENTRY_VALUE', entry));
        }

        if (config.whitelist) {
          config.whitelist.forEach(entry => commit('match/ADD_WHITELIST_ENTRY_VALUE', entry));
        }

        commit('match/UPDATE_THRESHOLD', config.threshold);

        commit('match/UPDATE_NUM_EVENTS', config.num_events);

        commit('match/UPDATE_USE_TERMS_QUERY', config.use_terms_query);
        commit('match/UPDATE_USE_COUNT_QUERY', config.use_count_query);

        if (config.terms_size) {
          commit('match/UPDATE_TERMS_SIZE', config.terms_size);
        }

        commit('match/UPDATE_THRESHOLD_REF', config.threshold_ref);
        commit('match/UPDATE_THRESHOLD_CUR', config.threshold_cur);

        commit('match/UPDATE_SPIKE_HEIGHT', config.spike_height);
        commit('match/UPDATE_SPIKE_TYPE', config.spike_type);

        commit('match/UPDATE_METRIC_AGG_KEY', config.metric_agg_key);
        commit('match/UPDATE_METRIC_AGG_TYPE', config.metric_agg_type);
        commit('match/UPDATE_MAX_THRESHOLD', config.max_threshold);
        commit('match/UPDATE_MIN_THRESHOLD', config.min_threshold);

        commit('match/UPDATE_MIN_CARDINALITY', config.min_cardinality);
        commit('match/UPDATE_MAX_CARDINALITY', config.max_cardinality);
        commit('match/UPDATE_CARDINALITY_FIELD', config.cardinality_field);

        if (config.aggregation && config.aggregation.schedule) {
          commit('alert/UPDATE_AGGREGATION_SCHEDULE', config.aggregation.schedule);
        }

        if (config.summary_table_fields) {
          commit('alert/UPDATE_SUMMARY_TABLE_FIELDS', config.summary_table_fields);
        }

        commit('alert/UPDATE_AGGREGATION_KEY', config.aggregation_key);

        commit('alert/UPDATE_HTTP_POST_URL', config.http_post_url);
        commit('alert/UPDATE_FROM_ADDR', config.from_addr);
        commit('alert/UPDATE_REPLY_TO', config.email_reply_to);

        if (config.email) {
          if (Array.isArray(config.email)) {
            commit('alert/UPDATE_EMAIL', config.email.join(','));
          } else {
            commit('alert/UPDATE_EMAIL', config.email);
          }
        }

        if (config.cc) {
          if (Array.isArray(config.cc)) {
            commit('alert/UPDATE_CC', config.cc.join(','));
          } else {
            commit('alert/UPDATE_CC', config.cc);
          }
        }

        if (config.bcc) {
          if (Array.isArray(config.bcc)) {
            commit('alert/UPDATE_BCC', config.bcc.join(','));
          } else {
            commit('alert/UPDATE_BCC', config.bcc);
          }
        }

        commit('alert/UPDATE_TELEGRAM_ROOM_ID', config.telegram_room_id);

        commit('alert/UPDATE_EXOTEL_ACCOUNT_SID', config.exotel_account_sid);
        commit('alert/UPDATE_EXOTEL_AUTH_TOKEN', config.exotel_auth_token);
        commit('alert/UPDATE_EXOTEL_TO_NUMBER', config.exotel_to_number);
        commit('alert/UPDATE_EXOTEL_FROM_NUMBER', config.exotel_from_number);
        commit('alert/UPDATE_EXOTEL_MESSAGE_BODY', config.exotel_message_body);

        commit('alert/UPDATE_TWILIO_ACCOUNT_SID', config.twilio_account_sid);
        commit('alert/UPDATE_TWILIO_AUTH_TOKEN', config.twilio_auth_token);
        commit('alert/UPDATE_TWILIO_TO_NUMBER', config.twilio_to_number);
        commit('alert/UPDATE_TWILIO_FROM_NUMBER', config.twilio_from_number);

        commit('alert/UPDATE_PAGERTREE_INTEGRATION_URL', config.pagertree_integration_url);

        commit('alert/UPDATE_SNS_TOPIC_ARN', config.sns_topic_arn);
        commit('alert/UPDATE_SNS_AWS_ACCESS_KEY_ID', config.sns_aws_access_key_id);
        commit('alert/UPDATE_SNS_AWS_SECRET_ACCESS_KEY', config.sns_aws_secret_access_key);
        commit('alert/UPDATE_SNS_AWS_REGION', config.sns_aws_region);
        commit('alert/UPDATE_SNS_AWS_PROFILE', config.sns_aws_profile);

        commit('alert/UPDATE_ZBX_HOST', config.zbx_host);
        commit('alert/UPDATE_ZBX_KEY', config.zbx_key);

        commit('alert/UPDATE_LINENOTIFY_ACCESS_TOKEN', config.linenotify_access_token);

        if (config.command) {
          if (Array.isArray(config.command)) {
            config.command.forEach((value, index, array) => {
              array[index] = value.replace(/"/g, '').replace(/'/g, '').trim();
            });
          }
          commit('alert/UPDATE_COMMAND', config.command);
        }

        commit('alert/UPDATE_GITTER_MSG_LEVEL', config.gitter_msg_level);

        commit('alert/UPDATE_JIRA_PROJECT', config.jira_project);
        commit('alert/UPDATE_JIRA_ISSUE_TYPE', config.jira_issuetype);
        commit('alert/UPDATE_JIRA_COMPONENTS', config.jira_components);

        commit('alert/UPDATE_GOOGLE_CHAT_WEBHOOK_URL', config.googlechat_webhook_url);
        commit('alert/UPDATE_GOOGLE_CHAT_FORMAT', config.googlechat_format);
        commit('alert/UPDATE_GOOGLE_CHAT_HEADER_TITLE', config.googlechat_header_title);

        commit('alert/UPDATE_MATTERMOST_CHANNEL_OVERRIDE', config.mattermost_channel_override);
        commit('alert/UPDATE_MATTERMOST_USERNAME_OVERRIDE', config.mattermost_username_override);
        commit('alert/UPDATE_MATTERMOST_MSG_COLOR', config.mattermost_msg_color);

        commit('alert/UPDATE_SLACK_CHANNEL_OVERRIDE', config.slack_channel_override);
        commit('alert/UPDATE_SLACK_USERNAME_OVERRIDE', config.slack_username_override);
        commit('alert/UPDATE_SLACK_EMOJI_OVERRIDE', config.slack_emoji_override);
        commit('alert/UPDATE_SLACK_MSG_COLOR', config.slack_msg_color);

        commit('alert/UPDATE_MS_TEAMS_WEBHOOK_URL', config.ms_teams_webhook_url);
        commit('alert/UPDATE_MS_TEAMS_THEME_COLOR', config.ms_teams_theme_color);

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
          config: getters.config(false),
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
          rule: getters.yaml(true),
          options: {
            testType: 'schemaOnly',
            days: 1,
            alert: false,
            format: 'json'
          }
        });
        if (res.data) {
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

    async sample({ commit, getters, state }) {
      commit('CLEAR_SAMPLE');

      let search = {
        query: {
          bool: {
            must: [
              {
                query_string: { query: getters['query/queryString'] || `${state.settings.timeField}:*` }
              }
            ]
          }
        },
        sort: [{ [state.settings.timeField]: { order: 'desc' } }],
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
    metricagg(state) {
      let config = {};

      if (state.match.metricAggKey) {
        config.metric_agg_key = state.match.metricAggKey;
      }

      if (state.match.metricAggType) {
        config.metric_agg_type = state.match.metricAggType;
      }

      if (state.match.docType) {
        config.doc_type = state.match.docType;
      }

      if (state.match.maxThreshold) {
        config.max_threshold = state.match.maxThreshold;
      }

      if (state.match.minThreshold) {
        config.min_threshold = state.match.minThreshold;
      }

      return config;
    },

    newterm(state) {
      let config = {};

      if (state.match.termsWindowSize && Object.keys(state.match.termsWindowSize).length) {
        config.terms_window_size = state.match.termsWindowSize;
      }

      if (state.match.windowStepSize && Object.keys(state.match.windowStepSize).length) {
        config.window_step_size = state.match.windowStepSize;
      }

      if (state.match.alertOnMissingField !== undefined) {
        config.alert_on_missing_field = state.match.alertOnMissingField;
      }

      if (state.match.useKeywordPostfix !== undefined) {
        config.use_keyword_postfix = state.match.useKeywordPostfix;
      }

      if (state.match.useTermsQuery) {
        config.use_terms_query = state.match.useTermsQuery;

        if (state.match.termsSize) {
          config.terms_size = state.match.termsSize;
        }

        if (state.match.docType) {
          config.doc_type = state.match.docType;
        }
      }

      return config;
    },

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

      if (state.match.useCountQuery) {
        config.use_count_query = state.match.useCountQuery;
      }

      if (state.match.docType) {
        config.doc_type = state.match.docType;
      }

      return config;
    },

    frequency(state) {
      let config = {};

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

    flatline(state) {
      let config = {};

      if (state.match.docType) {
        config.doc_type = state.match.docType;
      }

      if (state.match.threshold) {
        config.threshold = state.match.threshold;
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

    cardinality(state) {
      let config = {};

      if (state.match.timeframe && Object.keys(state.match.timeframe).length) {
        config.timeframe = state.match.timeframe;
      }

      if (state.match.cardinalityField) {
        config.cardinality_field = state.match.cardinalityField;
      }

      if (state.match.maxCardinality) {
        config.max_cardinality = state.match.maxCardinality;
      }

      if (state.match.minCardinality) {
        config.min_cardinality = state.match.minCardinality;
      }

      return config;
    },

    queryString(state, getters) {
      let qs = {
        query: getters['query/queryString'] || `${state.settings.timeField}:*`
      };

      // the new term rule triggers a bug in elastalert
      // so we need to slightly change the way queries are sent
      // https://github.com/Yelp/elastalert/issues/1042
      if (state.match.type === 'new_term') {
        return {
          filter: [
            {
              query_string: qs
            }
          ]
        };
      }

      return {
        filter: [
          {
            query: {
              query_string: qs
            }
          }
        ]
      };
    },

    http(state) {
      let config = {};
      if (state.alert.httpPostUrl) {
        config.http_post_url = state.alert.httpPostUrl;
      }
      return config;
    },

    aggregation(state) {
      let config = {};

      if (state.alert.aggregationSchedule) {
        config.aggregation = {
          schedule: state.alert.aggregationSchedule
        };
      }

      if (state.alert.summaryTableFields && state.alert.summaryTableFields.length) {
        config.summary_table_fields = state.alert.summaryTableFields;
      }

      if (state.alert.aggregationKey) {
        config.aggregation_key = state.alert.aggregationKey;
      }

      return config;
    },

    email(state) {
      let config = {};

      if (state.alert.fromAddr) {
        config.from_addr = state.alert.fromAddr;
      }

      if (state.alert.replyTo) {
        config.email_reply_to = state.alert.replyTo;
      }

      if (state.alert.email) {
        if (typeof state.alert.email === 'string') {
          config.email = state.alert.email.split(',');
        } else {
          console.warn('Local email state is not a string!');
        }
      }

      if (state.alert.cc) {
        if (typeof state.alert.cc === 'string') {
          config.cc = state.alert.cc.split(',');
        } else {
          console.warn('Local cc state is not a string!');
        }
      }

      if (state.alert.bcc) {
        if (typeof state.alert.bcc === 'string') {
          config.bcc = state.alert.bcc.split(',');
        } else {
          console.warn('Local bcc state is not a string!');
        }
      }

      return config;
    },

    slack(state, getters) {
      let config = {};

      if (state.alert.slackChannelOverride) {
        config.slack_channel_override = state.alert.slackChannelOverride;
      }

      if (state.alert.slackUsernameOverride) {
        config.slack_username_override = state.alert.slackUsernameOverride;
      }

      if (state.alert.slackEmojiOverride) {
        config.slack_emoji_override = state.alert.slackEmojiOverride;
      }

      if (state.alert.slackMsgColor) {
        config.slack_msg_color = state.alert.slackMsgColor;
      }

      if (getters['alert/slackTitleLink']) {
        config.slack_title_link = getters['alert/slackTitleLink'];
      }

      return config;
    },

    ms_teams(state) {
      let config = {};

      if (state.alert.ms_teamsWebhookUrl) {
        config.ms_teams_webhook_url = state.alert.ms_teamsWebhookUrl;
      }

      if (state.alert.ms_teamsThemeColor) {
        config.ms_teams_theme_color = state.alert.ms_teamsThemeColor;
      }

      config.ms_teams_alert_summary = 'Alert';

      return config;
    },

    telegram(state) {
      let config = {};

      if (state.alert.telegramRoomId) {
        config.telegram_room_id = state.alert.telegramRoomId;
      }

      return config;
    },

    exotel(state) {
      let config = {};

      if (state.alert.exotelAccountSid) {
        config.exotel_account_sid = state.alert.exotelAccountSid;
      }

      if (state.alert.exotelAuthToken) {
        config.exotel_auth_token = state.alert.exotelAuthToken;
      }

      if (state.alert.exotelToNumber) {
        config.exotel_to_number = state.alert.exotelToNumber;
      }

      if (state.alert.exotelFromNumber) {
        config.exotel_from_number = state.alert.exotelFromNumber;
      }

      if (state.alert.exotelMessageBody) {
        config.exotel_message_body = state.alert.exotelMessageBody;
      }

      return config;
    },

    twilio(state) {
      let config = {};

      if (state.alert.twilioAccountSid) {
        config.twilio_account_sid = state.alert.twilioAccountSid;
      }

      if (state.alert.twilioAuth) {
        config.twilio_auth_token = state.alert.twilioAuth;
      }

      if (state.alert.twilioToNumber) {
        config.twilio_to_number = state.alert.twilioToNumber;
      }

      if (state.alert.twilioFromNumber) {
        config.twilio_from_number = state.alert.twilioFromNumber;
      }

      return config;
    },

    pagertree(state) {
      let config = {};

      if (state.alert.pagertreeIntegrationUrl) {
        config.pagertree_integration_url = state.alert.pagertreeIntegrationUrl;
      }

      return config;
    },

    sns(state) {
      let config = {};

      if (state.alert.snsTopicArn) {
        config.sns_topic_arn = state.alert.snsTopicArn;
      }

      if (state.alert.snsAwsProfile) {
        config.sns_aws_profile = state.alert.snsAwsProfile;
      } else {
        if (state.alert.snsAwsAccessKeyId) {
          config.sns_aws_access_key_id = state.alert.snsAwsAccessKeyId;
        }

        if (state.alert.snsAwsSecretAccessKey) {
          config.sns_aws_secret_access_key = state.alert.snsAwsSecretAccessKey;
        }

        if (state.alert.snsAwsRegion) {
          config.sns_aws_region = state.alert.snsAwsRegion;
        }
      }

      return config;
    },

    zabbix(state) {
      let config = {};

      if (state.alert.zbxHost) {
        config.zbx_host = state.alert.zbxHost;
      }

      if (state.alert.zbxKey) {
        config.zbx_key = state.alert.zbxKey;
      }

      return config;
    },

    linenotify(state) {
      let config = {};

      if (state.alert.linenotifyAccessToken) {
        config.linenotify_access_token = state.alert.linenotifyAccessToken;
      }

      return config;
    },

    command(state) {
      let config = {};

      if (state.alert.command) {
        config.command = state.alert.command;
      }

      return config;
    },

    gitter(state) {
      let config = {};

      if (state.alert.gitterMsgLevel) {
        config.gitter_msg_level = state.alert.gitterMsgLevel;
      }

      return config;
    },

    jira(state) {
      let config = {};

      if (state.alert.jiraProject && state.alert.jiraIssueType) {
        config.jira_project = state.alert.jiraProject;
        config.jira_issuetype = state.alert.jiraIssueType;
      }

      if (state.alert.jiraComponents) {
        config.jira_components = state.alert.jiraComponents;
      }

      return config;
    },

    googlechat(state) {
      let config = {};
      if (state.alert.googleChatWebhookUrl) {
        config.googlechat_webhook_url = state.alert.googleChatWebhookUrl;
      }

      if (state.alert.googleChatFormat) {
        config.googlechat_format = state.alert.googleChatFormat;
      }

      if (state.alert.googleChatHeaderTitle) {
        config.googlechat_header_title = state.alert.googleChatHeaderTitle;
      }

      return config;
    },

    mattermost(state, getters) {
      let config = {};

      if (state.alert.mattermostChannelOverride) {
        config.mattermost_channel_override = state.alert.mattermostChannelOverride;
      }

      if (state.alert.mattermostUsernameOverride) {
        config.mattermost_username_override = state.alert.mattermostUsernameOverride;
      }

      if (state.alert.mattermostMsgColor) {
        config.mattermost_msg_color = state.alert.mattermostMsgColor;
      }

      if (getters['alert/mattermostTitleLink']) {
        config.mattermost_title_link = getters['alert/mattermostTitleLink'];
      }

      return config;
    },

    subjectBody(state) {
      let config = {};

      if (state.alert.subject) {
        let formattedSubject = htmlToConfigFormat(state.alert.subject);
        config.alert_subject = formattedSubject.alertText.trim();
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

    config: (state, getters) => forTest => {
      let config = {
        ...getters.queryString
      };

      if (forTest) {
        config.import = '../../rules/BaseRule.config';
      } else {
        let dots;

        if (!state.path) {
          dots = '';
        } else {
          dots = '../';
        }

        let path = state.path;

        if (path.endsWith('/')) {
          path = path.slice(0, -1);
        }

        for (let i = 1; i < path.split('/').length; i++) {
          dots += '../';
        }

        config.import = `${dots}BaseRule.config`;
      }

      if (state.path) {
        config.__praeco_full_path = `${state.path}/${state.settings.name}`;
      } else {
        config.__praeco_full_path = state.settings.name;
      }

      // if the user is using a manual query, then don't save this to the config,
      // so we know when loading it is manual
      if (state.query.type === 'tree') {
        config.__praeco_query_builder = JSON.stringify({ query: state.query.tree });
      }

      if (state.settings.name) {
        config.name = state.settings.name;
      }

      if (state.settings.index) {
        config.index = state.settings.index;
      }

      if (state.settings.timeField) {
        config.timestamp_field = state.settings.timeField;
      }

      if (state.settings.timeType) {
        config.timestamp_type = state.settings.timeType;
      }

      config.is_enabled = !!state.settings.isEnabled;

      config.use_strftime_index = getters['settings/strftime'];

      if (state.match.queryKey) {
        config.query_key = state.match.queryKey;
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

      config = { ...config, ...getters.aggregation };

      if (state.alert.alert.includes('post')) {
        config = { ...config, ...getters.http };
      }

      if (state.alert.alert.includes('email')) {
        config = { ...config, ...getters.email };
      }

      if (state.alert.alert.includes('slack')) {
        config = { ...config, ...getters.slack };
      }
      if (state.alert.alert.includes('telegram')) {
        config = { ...config, ...getters.telegram };
      }

      if (state.alert.alert.includes('exotel')) {
        config = { ...config, ...getters.exotel };
      }

      if (state.alert.alert.includes('twilio')) {
        config = { ...config, ...getters.twilio };
      }

      if (state.alert.alert.includes('pagertree')) {
        config = { ...config, ...getters.pagertree };
      }

      if (state.alert.alert.includes('sns')) {
        config = { ...config, ...getters.sns };
      }

      if (state.alert.alert.includes('zabbix')) {
        config = { ...config, ...getters.zabbix };
      }

      if (state.alert.alert.includes('linenotify')) {
        config = { ...config, ...getters.linenotify };
      }

      if (state.alert.alert.includes('command')) {
        config = { ...config, ...getters.command };
      }

      if (state.alert.alert.includes('gitter')) {
        config = { ...config, ...getters.gitter };
      }

      if (state.alert.alert.includes('jira')) {
        config = { ...config, ...getters.jira };
      }

      if (state.alert.alert.includes('googlechat')) {
        config = { ...config, ...getters.googlechat };
      }

      if (state.alert.alert.includes('mattermost')) {
        config = { ...config, ...getters.mattermost };
      }

      if (state.alert.alert.includes('email')
          || state.alert.alert.includes('slack')
          || state.alert.alert.includes('ms_teams')
          || state.alert.alert.includes('telegram')
          || state.alert.alert.includes('jira')
          || state.alert.alert.includes('googlechat')
          || state.alert.alert.includes('pagertree')
          || state.alert.alert.includes('sns')
          || state.alert.alert.includes('mattermost')
          || state.alert.alert.includes('gitter')) {
        config = { ...config, ...getters.subjectBody };
      }

      if (state.alert.alert.includes('ms_teams')) {
        config = { ...config, ...getters.ms_teams };
      }

      if (state.match.type === 'blacklist') {
        config = { ...config, ...getters.blacklist };
      } else if (state.match.type === 'whitelist') {
        config = { ...config, ...getters.whitelist };
      } else if (state.match.type === 'change') {
        config = { ...config, ...getters.change };
      } else if (state.match.type === 'frequency') {
        config = { ...config, ...getters.frequency };
      } else if (state.match.type === 'flatline') {
        config = { ...config, ...getters.flatline };
      } else if (state.match.type === 'metric_aggregation') {
        config = { ...config, ...getters.metricagg };
      } else if (state.match.type === 'spike') {
        config = { ...config, ...getters.spike };
      } else if (state.match.type === 'new_term') {
        config = { ...config, ...getters.newterm };
      } else if (state.match.type === 'cardinality') {
        config = { ...config, ...getters.cardinality };
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

    yaml: (state, getters) => forTest => yaml.safeDump(getters.config(forTest))
  }
};
