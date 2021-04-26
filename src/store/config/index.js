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
          try {
            commit('query/UPDATE_MANUAL', config.filter[0].query.query_string.query);
          } catch (error) {
            console.error(error);
          }
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
        if (config.query_key) {
          config.query_key.forEach(entry => commit('match/ADD_QUERY_KEY_ENTRY_VALUE', entry));
        }
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

        /* limit_execution */
        commit('alert/UPDATE_LIMIT_EXCECUTION', config.limit_execution);

        /* Kibana Discover */
        commit('alert/UPDATE_GENERATE_KIBANA_DISCOVER_URL', config.generate_kibana_discover_url);
        commit('alert/UPDATE_KIBANA_DISCOVER_APP_URL', config.kibana_discover_app_url);
        commit('alert/UPDATE_KIBANA_DISCOVER_VERSION', config.kibana_discover_version);
        commit('alert/UPDATE_KIBANA_DISCOVER_INDEX_PATTERN_ID', config.kibana_discover_index_pattern_id);

        if (config.kibana_discover_columns) {
          config.kibana_discover_columns.forEach(entry => commit('alert/ADD_KIBANA_DISCOVER_COLUMNS_ENTRY_VALUE', entry));
        }

        commit('alert/UPDATE_KIBANA_DISCOVER_FROM_TIMEDELTA', config.kibana_discover_from_timedelta);
        commit('alert/UPDATE_KIBANA_DISCOVER_TO_TIMEDELTA', config.kibana_discover_to_timedelta);

        /* HTTP POST */
        commit('alert/UPDATE_HTTP_POST_URL', config.http_post_url);

        if (config.http_post_timeout) {
          commit('alert/UPDATE_HTTP_POST_TIMEOUT', config.http_post_timeout);
        } else {
          commit('alert/UPDATE_HTTP_POST_TIMEOUT', 10);
        }

        commit('alert/UPDATE_HTTP_POST_PROXY', config.http_post_proxy);

        /* EMail */
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

        if (config.smtp_ssl) {
          commit('alert/UPDATE_SMTP_SSL', config.smtp_ssl);
        } else {
          commit('alert/UPDATE_SMTP_SSL', false);
        }

        commit('alert/UPDATE_SMTP_HOST', config.smtp_host);

        if (config.smtp_port) {
          commit('alert/UPDATE_SMTP_PORT', config.smtp_port);
        } else {
          commit('alert/UPDATE_SMTP_PORT', 25);
        }

        commit('alert/UPDATE_SMTP_AUTH_FILE', config.smtp_auth_file);
        commit('alert/UPDATE_SMTP_KEY_FILE', config.smtp_key_file);
        commit('alert/UPDATE_SMTP_CERT_FILE', config.smtp_cert_file);
        commit('alert/UPDATE_EMAIL_FROM_FIELD', config.email_from_field);
        commit('alert/UPDATE_EMAIL_ADD_DOMAIN', config.email_add_domain);

        // TODO:
        // if (config.email_format === 'html') {
        //   commit('alert/UPDATE_EMAIL_FORMAT', true);
        // } else {
        //   commit('alert/UPDATE_EMAIL_FORMAT', false);
        // }

        /* Telegram */
        commit('alert/UPDATE_TELEGRAM_ROOM_ID', config.telegram_room_id);
        commit('alert/UPDATE_TELEGRAM_PROXY', config.telegram_proxy);
        commit('alert/UPDATE_TELEGRAM_PROXY_LOGIN', config.telegram_proxy_login);
        commit('alert/UPDATE_TELEGRAM_PROXY_PASS', config.telegram_proxy_pass);

        /* Chatwork */
        commit('alert/UPDATE_CHATWORK_API_KEY', config.chatwork_apikey);
        commit('alert/UPDATE_CHATWORK_ROOM_ID', config.chatwork_room_id);

        /* Discord */
        commit('alert/UPDATE_DISCORD_WEBHOOK_URL', config.discord_webhook_url);
        commit('alert/UPDATE_DISCORD_EMOJI_TITLE', config.discord_emoji_title);
        commit('alert/UPDATE_DISCORD_EMBED_FOOTER', config.discord_embed_footer);
        commit('alert/UPDATE_DISCORD_EMBED_ICON_URL', config.discord_embed_icon_url);

        /* Exotel */
        commit('alert/UPDATE_EXOTEL_ACCOUNT_SID', config.exotel_account_sid);
        commit('alert/UPDATE_EXOTEL_AUTH_TOKEN', config.exotel_auth_token);
        commit('alert/UPDATE_EXOTEL_TO_NUMBER', config.exotel_to_number);
        commit('alert/UPDATE_EXOTEL_FROM_NUMBER', config.exotel_from_number);
        commit('alert/UPDATE_EXOTEL_MESSAGE_BODY', config.exotel_message_body);

        /* Twilio */
        commit('alert/UPDATE_TWILIO_ACCOUNT_SID', config.twilio_account_sid);
        commit('alert/UPDATE_TWILIO_AUTH_TOKEN', config.twilio_auth_token);
        commit('alert/UPDATE_TWILIO_TO_NUMBER', config.twilio_to_number);
        commit('alert/UPDATE_TWILIO_FROM_NUMBER', config.twilio_from_number);

        /* PagerTree */
        commit('alert/UPDATE_PAGERTREE_INTEGRATION_URL', config.pagertree_integration_url);
        commit('alert/UPDATE_PAGERTREE_PROXY', config.pagertree_proxy);

        /* AWS SNS */
        commit('alert/UPDATE_SNS_TOPIC_ARN', config.sns_topic_arn);
        commit('alert/UPDATE_SNS_AWS_ACCESS_KEY_ID', config.sns_aws_access_key_id);
        commit('alert/UPDATE_SNS_AWS_SECRET_ACCESS_KEY', config.sns_aws_secret_access_key);
        commit('alert/UPDATE_SNS_AWS_REGION', config.sns_aws_region);
        commit('alert/UPDATE_SNS_AWS_PROFILE', config.sns_aws_profile);

        /* Zabbix */
        if (config.zbx_sender_host) {
          commit('alert/UPDATE_ZBX_SENDER_HOST', config.zbx_sender_host);
        } else {
          commit('alert/UPDATE_ZBX_SENDER_HOST', 'localhost');
        }

        if (config.zbx_sender_port) {
          commit('alert/UPDATE_ZBX_SENDER_PORT', config.zbx_sender_port);
        } else {
          commit('alert/UPDATE_ZBX_SENDER_PORT', 10051);
        }

        commit('alert/UPDATE_ZBX_HOST', config.zbx_host);
        commit('alert/UPDATE_ZBX_KEY', config.zbx_key);

        /* Line Notify */
        commit('alert/UPDATE_LINENOTIFY_ACCESS_TOKEN', config.linenotify_access_token);

        /* Command */
        if (config.command) {
          config.command.forEach(entry => commit('alert/ADD_COMMAND_ENTRY_VALUE', entry));
        }

        commit('alert/UPDATE_PIPE_MATCH_JSON', config.pipe_match_json);
        commit('alert/UPDATE_PIPE_ALERT_TEXT', config.pipe_alert_text);

        /* Gitter */
        commit('alert/UPDATE_GITTER_WEBHOOK_URL', config.gitter_webhook_url);

        if (config.gitter_msg_level) {
          commit('alert/UPDATE_GITTER_MSG_LEVEL', config.gitter_msg_level);
        } else {
          commit('alert/UPDATE_GITTER_MSG_LEVEL', 'error');
        }

        commit('alert/UPDATE_GITTER_PROXY', config.gitter_proxy);

        /* time_window_change */
        if (config.start_time && config.end_time && config.drop_if) {
          commit('alert/UPDATE_USE_TIME_WINDOW', true);
          commit('alert/UPDATE_TIME_WINDOW_START_TIME', config.start_time);
          commit('alert/UPDATE_TIME_WINDOW_END_TIME', config.end_time);
          commit('alert/UPDATE_TIME_WINDOW_DROP_IF', config.drop_if);
        } else {
          commit('alert/UPDATE_USE_TIME_WINDOW', false);
        }

        /* Jira */
        commit('alert/UPDATE_JIRA_PROJECT', config.jira_project);
        commit('alert/UPDATE_JIRA_ISSUE_TYPE', config.jira_issuetype);
        commit('alert/UPDATE_JIRA_COMPONENTS', config.jira_components);

        /* ServiceNow */
        commit('alert/UPDATE_SERVICENOW_USERNAME', config.username);
        commit('alert/UPDATE_SERVICENOW_PASSWORD', config.password);
        commit('alert/UPDATE_SERVICENOW_REST_URL', config.servicenow_rest_url);
        commit('alert/UPDATE_SERVICENOW_SHORT_DESCRIPTION', config.short_description);
        commit('alert/UPDATE_SERVICENOW_COMMENTS', config.comments);
        commit('alert/UPDATE_SERVICENOW_ASSIGNMENT_GROUP', config.assignment_group);
        commit('alert/UPDATE_SERVICENOW_CATEGORY', config.category);
        commit('alert/UPDATE_SERVICENOW_SUBCATEGORY', config.subcategory);
        commit('alert/UPDATE_SERVICENOW_CMDB_CI', config.cmdb_ci);
        commit('alert/UPDATE_SERVICENOW_CALLER_ID', config.caller_id);
        commit('alert/UPDATE_SERVICENOW_PROXY', config.servicenow_proxy);

        /* VictorOps */
        commit('alert/UPDATE_VICTOROPS_API_KEY', config.victorops_api_key);
        commit('alert/UPDATE_VICTOROPS_ROUTING_KEY', config.victorops_routing_key);
        commit('alert/UPDATE_VICTOROPS_MESSAGE_TYPE', config.victorops_message_type);
        commit('alert/UPDATE_VICTOROPS_ENTITY_ID', config.victorops_entity_id);
        commit('alert/UPDATE_VICTOROPS_PROXY', config.victorops_proxy);

        if (config.victorops_entity_display_name) {
          commit('alert/UPDATE_VICTOROPS_ENTITY_DISPLAY_NAME', config.victorops_entity_display_name);
        } else {
          commit('alert/UPDATE_VICTOROPS_ENTITY_DISPLAY_NAME', 'no entity display name');
        }

        /* Stomp */
        if (config.stomp_hostname) {
          commit('alert/UPDATE_STOMP_HOSTNAME', config.stomp_hostname);
        } else {
          commit('alert/UPDATE_STOMP_HOSTNAME', 'localhost');
        }

        if (config.stomp_hostport) {
          commit('alert/UPDATE_STOMP_HOSTPORT', config.stomp_hostport);
        } else {
          commit('alert/UPDATE_STOMP_HOSTPORT', 61613);
        }

        if (config.stomp_login) {
          commit('alert/UPDATE_STOMP_LOGIN', config.stomp_login);
        } else {
          commit('alert/UPDATE_STOMP_LOGIN', 'admin');
        }

        if (config.stomp_password) {
          commit('alert/UPDATE_STOMP_PASSWORD', config.stomp_password);
        } else {
          commit('alert/UPDATE_STOMP_PASSWORD', 'admin');
        }

        if (config.stomp_destination) {
          commit('alert/UPDATE_STOMP_DESTINATION', config.stomp_destination);
        } else {
          commit('alert/UPDATE_STOMP_DESTINATION', '/queue/ALERT');
        }

        if (config.stomp_ssl) {
          commit('alert/UPDATE_STOMP_SSL', config.stomp_ssl);
        } else {
          commit('alert/UPDATE_STOMP_SSL', false);
        }

        /* GoogleChat */
        commit('alert/UPDATE_GOOGLE_CHAT_WEBHOOK_URL', config.googlechat_webhook_url);

        if (config.googlechat_format) {
          commit('alert/UPDATE_GOOGLE_CHAT_FORMAT', config.googlechat_format);
        } else {
          commit('alert/UPDATE_GOOGLE_CHAT_FORMAT', 'basic');
        }

        commit('alert/UPDATE_GOOGLE_CHAT_HEADER_TITLE', config.googlechat_header_title);
        commit('alert/UPDATE_GOOGLECHAT_HEADER_SUBTITLE', config.googlechat_header_subtitle);
        commit('alert/UPDATE_GOOGLECHAT_HEADER_IMAGE', config.googlechat_header_image);
        commit('alert/UPDATE_GOOGLECHAT_FOOTER_KIBANALINK', config.googlechat_footer_kibanalink);

        /* Mattermost */
        commit('alert/UPDATE_MATTERMOST_CHANNEL_OVERRIDE', config.mattermost_channel_override);

        if (config.mattermost_username_override) {
          commit('alert/UPDATE_MATTERMOST_USERNAME_OVERRIDE', config.mattermost_username_override);
        } else {
          commit('alert/UPDATE_MATTERMOST_USERNAME_OVERRIDE', 'elastalert');
        }

        if (config.mattermost_msg_color) {
          commit('alert/UPDATE_MATTERMOST_MSG_COLOR', config.mattermost_msg_color);
        } else {
          commit('alert/UPDATE_MATTERMOST_MSG_COLOR', 'danger');
        }

        commit('alert/UPDATE_MATTERMOST_ICON_URL_OVERRIDE', config.mattermost_icon_url_override);
        commit('alert/UPDATE_MATTERMOST_MSG_PRETEXT', config.mattermost_msg_pretext);

        if (config.mattermost_ignore_ssl_errors) {
          commit('alert/UPDATE_MATTERMOST_IGNORE_SSL_ERRORS', config.mattermost_ignore_ssl_errors);
        } else {
          commit('alert/UPDATE_MATTERMOST_IGNORE_SSL_ERRORS', false);
        }

        commit('alert/UPDATE_MATTERMOST_PROXY', config.mattermost_proxy);

        /* TheHive */
        if (config.hive_alert_config && config.hive_alert_config.title) {
          commit('alert/UPDATE_HIVE_ALERT_CONFIG_TITLE', config.hive_alert_config.title);
        }

        if (config.hive_alert_config && config.hive_alert_config.type) {
          commit('alert/UPDATE_HIVE_ALERT_CONFIG_TYPE', config.hive_alert_config.type);
        }

        if (config.hive_alert_config && config.hive_alert_config.source) {
          commit('alert/UPDATE_HIVE_ALERT_CONFIG_SOURCE', config.hive_alert_config.source);
        }

        if (config.hive_alert_config && config.hive_alert_config.description) {
          commit('alert/UPDATE_HIVE_ALERT_CONFIG_DESCRIPTION', config.hive_alert_config.description);
        }

        if (config.hive_alert_config && config.hive_alert_config.severity) {
          commit('alert/UPDATE_HIVE_ALERT_CONFIG_SEVERITY', config.hive_alert_config.severity);
        } else {
          commit('alert/UPDATE_HIVE_ALERT_CONFIG_SEVERITY', 2);
        }

        if (config.hive_alert_config && config.hive_alert_config.tags) {
          commit('alert/UPDATE_HIVE_ALERT_CONFIG_TAGS', config.hive_alert_config.tags);
        }

        if (config.hive_alert_config && config.hive_alert_config.tlp) {
          commit('alert/UPDATE_HIVE_ALERT_CONFIG_TLP', config.hive_alert_config.tlp);
        } else {
          commit('alert/UPDATE_HIVE_ALERT_CONFIG_TLP', 2);
        }

        if (config.hive_alert_config && config.hive_alert_config.status) {
          commit('alert/UPDATE_HIVE_ALERT_CONFIG_STATUS', config.hive_alert_config.status);
        } else {
          commit('alert/UPDATE_HIVE_ALERT_CONFIG_STATUS', 'Waiting');
        }

        if (config.hive_alert_config && config.hive_alert_config.follow) {
          commit('alert/UPDATE_HIVE_ALERT_CONFIG_FOLLOW', config.hive_alert_config.follow);
        } else {
          commit('alert/UPDATE_HIVE_ALERT_CONFIG_FOLLOW', false);
        }

        /* Alerta */
        commit('alert/UPDATE_ALERTA_API_URL', config.alerta_api_url);
        commit('alert/UPDATE_ALERTA_API_KEY', config.alerta_api_key);

        if (config.alerta_severity) {
          commit('alert/UPDATE_ALERTA_SEVERITY', config.alerta_severity);
        } else {
          commit('alert/UPDATE_ALERTA_SEVERITY', 'warning');
        }

        if (config.alerta_resource) {
          commit('alert/UPDATE_ALERTA_RESOURCE', config.alerta_resource);
        } else {
          commit('alert/UPDATE_ALERTA_RESOURCE', 'elastalert');
        }

        if (config.alerta_text) {
          commit('alert/UPDATE_ALERTA_TEXT', config.alerta_text);
        } else {
          commit('alert/UPDATE_ALERTA_TEXT', 'elastalert');
        }

        if (config.alerta_event) {
          commit('alert/UPDATE_ALERTA_EVENT', config.alerta_event);
        } else {
          commit('alert/UPDATE_ALERTA_EVENT', 'elastalert');
        }

        commit('alert/UPDATE_ALERTA_GROUP', config.alerta_group);

        if (config.alerta_tags) {
          commit('alert/UPDATE_ALERTA_TAGS', config.alerta_tags);
        }

        if (config.alerta_environment) {
          commit('alert/UPDATE_ALERTA_ENVIRONMENT', config.alerta_environment);
        } else {
          commit('alert/UPDATE_ALERTA_ENVIRONMENT', 'Production');
        }

        /* Datadog */
        commit('alert/UPDATE_DATADOG_API_KEY', config.datadog_api_key);
        commit('alert/UPDATE_DATADOG_APP_KEY', config.datadog_app_key);

        /* Slack */
        commit('alert/UPDATE_SLACK_CHANNEL_OVERRIDE', config.slack_channel_override);

        if (config.slack_username_override) {
          commit('alert/UPDATE_SLACK_USERNAME_OVERRIDE', config.slack_username_override);
        } else {
          commit('alert/UPDATE_SLACK_USERNAME_OVERRIDE', 'elastalert');
        }

        if (config.slack_emoji_override) {
          commit('alert/UPDATE_SLACK_EMOJI_OVERRIDE', config.slack_emoji_override);
        } else {
          commit('alert/UPDATE_SLACK_EMOJI_OVERRIDE', ':ghost:');
        }

        if (config.slack_msg_color) {
          commit('alert/UPDATE_SLACK_MSG_COLOR', config.slack_msg_color);
        } else {
          commit('alert/UPDATE_SLACK_MSG_COLOR', 'danger');
        }

        commit('alert/UPDATE_SLACK_CA_CERTS', config.slack_ca_certs);
        commit('alert/UPDATE_SLACK_ICON_URL_OVERRIDE', config.slack_icon_url_override);

        if (config.slack_timeout) {
          commit('alert/UPDATE_SLACK_TIMEOUT', config.slack_timeout);
        } else {
          commit('alert/UPDATE_SLACK_TIMEOUT', 10);
        }

        if (config.slack_parse_override) {
          commit('alert/UPDATE_SLACK_PARSE_OVERRIDE', config.slack_parse_override);
        } else {
          commit('alert/UPDATE_SLACK_PARSE_OVERRIDE', 'none');
        }

        commit('alert/UPDATE_SLACK_TEXT_STRING', config.slack_text_string);

        if (config.slack_ignore_ssl_errors) {
          commit('alert/UPDATE_SLACK_IGNORE_SSL_ERRORS', config.slack_ignore_ssl_errors);
        } else {
          commit('alert/UPDATE_SLACK_IGNORE_SSL_ERRORS', false);
        }

        if (config.slack_attach_kibana_discover_url) {
          commit('alert/UPDATE_SLACK_ATTACH_KIBANA_DISCOVER_URL', config.slack_attach_kibana_discover_url);
        }

        if (config.slack_kibana_discover_color) {
          commit('alert/UPDATE_SLACK_KIBANA_DISCOVER_COLOR', config.slack_kibana_discover_color);
        }

        if (config.slack_kibana_discover_color) {
          commit('alert/UPDATE_SLACK_KIBANA_DISCOVER_TITLE', config.slack_kibana_discover_title);
        }

        commit('alert/UPDATE_SLACK_PROXY', config.slack_proxy);

        /* MS Teams */
        commit('alert/UPDATE_MS_TEAMS_WEBHOOK_URL', config.ms_teams_webhook_url);
        commit('alert/UPDATE_MS_TEAMS_THEME_COLOR', config.ms_teams_theme_color);

        if (config.ms_teams_alert_summary) {
          commit('alert/UPDATE_MS_TEAMS_ALERT_SUMMARY', config.ms_teams_alert_summary);
        } else {
          commit('alert/UPDATE_MS_TEAMS_ALERT_SUMMARY', 'ElastAlert Message');
        }

        commit('alert/UPDATE_MS_TEAMS_ALERT_FIXED_WIDTH', config.ms_teams_alert_fixed_width);
        commit('alert/UPDATE_MS_TEAMS_PROXY', config.ms_teams_proxy);

        commit('alert/UPDATE_REALERT', config.realert);
        commit('alert/UPDATE_ALERT', config.alert);

        if (config.alert_text_type) {
          commit('alert/UPDATE_BODY_TYPE', config.alert_text_type);
        } else {
          commit('alert/UPDATE_BODY_TYPE', 'default');
        }

        commit('alert/UPDATE_BODY', config.alert_text);
        commit('alert/UPDATE_SUBJECT', config.alert_subject);

        if (config.alert_subject_args) {
          commit('alert/UPDATE_ALERT_SUBJECT_ARGS', config.alert_subject_args);
        }

        if (config.alert_text_args) {
          commit('alert/UPDATE_ALERT_TEXT_ARGS', config.alert_text_args);
        }
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

      if (state.alert.httpPostTimeout) {
        config.http_post_timeout = state.alert.httpPostTimeout;
      }

      if (state.alert.httpPostProxy) {
        config.http_post_proxy = state.alert.httpPostProxy;
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

    limitExcecution(state) {
      let config = {};

      if (state.alert.limitExcecution) {
        config.limit_execution = state.alert.limitExcecution;
      }

      return config;
    },

    kibanaDiscover(state) {
      let config = {};

      if (state.alert.generateKibanaDiscoverUrl) {
        config.generate_kibana_discover_url = state.alert.generateKibanaDiscoverUrl;
      } else {
        config.generate_kibana_discover_url = false;
        config.slack_attach_kibana_discover_url = false;
      }

      if (state.alert.kibanaDiscoverAppUrl) {
        config.kibana_discover_app_url = state.alert.kibanaDiscoverAppUrl;
      }

      if (state.alert.kibanaDiscoverVersion) {
        config.kibana_discover_version = state.alert.kibanaDiscoverVersion;
      }

      if (state.alert.kibanaDiscoverIndexPatternId) {
        config.kibana_discover_index_pattern_id = state.alert.kibanaDiscoverIndexPatternId;
      }

      if (state.alert.kibanaDiscoverColumns && state.alert.kibanaDiscoverColumns.length) {
        config.kibana_discover_columns = state.alert.kibanaDiscoverColumns;
      }

      if (state.alert.kibanaDiscoverFromTimedelta) {
        config.kibana_discover_from_timedelta = state.alert.kibanaDiscoverFromTimedelta;
      }

      if (state.alert.kibanaDiscoverToTimedelta) {
        config.kibana_discover_to_timedelta = state.alert.kibanaDiscoverToTimedelta;
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

      if (state.alert.smtpSsl) {
        config.smtp_ssl = state.alert.smtpSsl;
      }

      if (state.alert.smtpHost) {
        config.smtp_host = state.alert.smtpHost;
      }

      if (state.alert.smtpPort) {
        config.smtp_port = state.alert.smtpPort;
      }

      if (state.alert.smtpAuthFile) {
        config.smtp_auth_file = state.alert.smtpAuthFile;
      }

      if (state.alert.smtpKeyFile) {
        config.smtp_key_file = state.alert.smtpKeyFile;
      }

      if (state.alert.smtpCertFile) {
        config.smtp_cert_file = state.alert.smtpCertFile;
      }

      if (state.alert.emailFromField) {
        config.email_from_field = state.alert.emailFromField;
      }

      if (state.alert.emailAddDomain) {
        config.email_add_domain = state.alert.emailAddDomain;
      }

      // TODO:
      // if (state.alert.emailFormat) {
      //   config.email_format = 'html';
      // }

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

      if (state.alert.slackParseOverride) {
        config.slack_parse_override = state.alert.slackParseOverride;
      }

      if (state.alert.slackTextString) {
        config.slack_text_string = state.alert.slackTextString;
      }

      config.slack_ignore_ssl_errors = state.alert.slackIgnoreSslErrors;

      if (state.alert.slackCaCerts) {
        config.slack_ca_certs = state.alert.slackCaCerts;
      }

      if (state.alert.slackIconUrlOverride) {
        config.slack_icon_url_override = state.alert.slackIconUrlOverride;
      }

      if (state.alert.slackTimeout) {
        config.slack_timeout = state.alert.slackTimeout;
      }

      config.slack_attach_kibana_discover_url = state.alert.slackAttachKibanaDiscoverUrl;

      if (state.alert.slackKibanaDiscoverColor) {
        config.slack_kibana_discover_color = state.alert.slackKibanaDiscoverColor;
      }

      if (state.alert.slackKibanaDiscoverTitle) {
        config.slack_kibana_discover_title = state.alert.slackKibanaDiscoverTitle;
      }

      if (state.alert.slackProxy) {
        config.slack_proxy = state.alert.slackProxy;
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

      if (state.alert.ms_teamsAlertFixedWidth) {
        config.ms_teams_alert_fixed_width = state.alert.ms_teamsAlertFixedWidth;
      }

      if (state.alert.ms_teamsAlertSummary) {
        config.ms_teams_alert_summary = state.alert.ms_teamsAlertSummary;
      }

      if (state.alert.ms_teamsProxy) {
        config.ms_teams_proxy = state.alert.ms_teamsProxy;
      }

      return config;
    },

    telegram(state) {
      let config = {};

      if (state.alert.telegramRoomId) {
        config.telegram_room_id = state.alert.telegramRoomId;
      }

      if (state.alert.telegramProxy) {
        config.telegram_proxy = state.alert.telegramProxy;
      }

      if (state.alert.telegramProxyLogin) {
        config.telegram_proxy_login = state.alert.telegramProxyLogin;
      }

      if (state.alert.telegramProxyPass) {
        config.telegram_proxy_pass = state.alert.telegramProxyPass;
      }

      return config;
    },

    chatwork(state) {
      let config = {};
      if (state.alert.chatworkApikey) {
        config.chatwork_apikey = state.alert.chatworkApikey;
      }

      if (state.alert.chatworkRoomId) {
        config.chatwork_room_id = state.alert.chatworkRoomId;
      }

      return config;
    },

    discord(state) {
      let config = {};
      if (state.alert.discordWebhookUrl) {
        config.discord_webhook_url = state.alert.discordWebhookUrl;
      }

      if (state.alert.discordEmojiTitle) {
        config.discord_emoji_title = state.alert.discordEmojiTitle;
      }

      if (state.alert.discordEmbedFooter) {
        config.discord_embed_footer = state.alert.discordEmbedFooter;
      }

      if (state.alert.discordEmbedIconUrl) {
        config.discord_embed_icon_url = state.alert.discordEmbedIconUrl;
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

      if (state.alert.pagertreeProxy) {
        config.pagertree_proxy = state.alert.pagertreeProxy;
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

      if (state.alert.zbxSenderHost) {
        config.zbx_sender_host = state.alert.zbxSenderHost;
      }

      if (state.alert.zbxSenderPort) {
        config.zbx_sender_port = state.alert.zbxSenderPort;
      }

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

      if (state.alert.command && state.alert.command.length) {
        config.command = state.alert.command;
      }

      if (state.alert.pipeMatchJson) {
        config.pipe_match_json = state.alert.pipeMatchJson;
      }

      if (state.alert.pipeAlertText) {
        config.pipe_alert_text = state.alert.pipeAlertText;
      }

      return config;
    },

    gitter(state) {
      let config = {};

      if (state.alert.gitterWebhookUrl) {
        config.gitter_webhook_url = state.alert.gitterWebhookUrl;
      }

      if (state.alert.gitterMsgLevel) {
        config.gitter_msg_level = state.alert.gitterMsgLevel;
      }

      if (state.alert.gitterProxy) {
        config.gitter_proxy = state.alert.gitterProxy;
      }

      return config;
    },

    // time_window_change
    timeWindow(state) {
      let config = {};

      if (state.alert.useTimeWindow) {
        config.start_time = state.alert.timeWindowStartTime;
        config.end_time = state.alert.timeWindowEndTime;
        config.drop_if = state.alert.timeWindowDropIf;
        // This will work only if HourRangeEnhancement exists in elastalert - sent different merge request.
        config.match_enhancements = ['elastalert_modules.hour_range_enhancement.HourRangeEnhancement'];
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

    servicenow(state) {
      let config = {};
      if (state.alert.serviceNowUsername) {
        config.username = state.alert.serviceNowUsername;
      }

      if (state.alert.serviceNowPassword) {
        config.password = state.alert.serviceNowPassword;
      }

      if (state.alert.servicenowRestUrl) {
        config.servicenow_rest_url = state.alert.servicenowRestUrl;
      }

      if (state.alert.servicenowShortDescription) {
        config.short_description = state.alert.servicenowShortDescription;
      }

      if (state.alert.servicenowComments) {
        config.comments = state.alert.servicenowComments;
      }

      if (state.alert.servicenowAssignmentGroup) {
        config.assignment_group = state.alert.servicenowAssignmentGroup;
      }

      if (state.alert.servicenowCategory) {
        config.category = state.alert.servicenowCategory;
      }

      if (state.alert.servicenowSubcategory) {
        config.subcategory = state.alert.servicenowSubcategory;
      }

      if (state.alert.servicenowCmdbCi) {
        config.cmdb_ci = state.alert.servicenowCmdbCi;
      }

      if (state.alert.servicenowCallerId) {
        config.caller_id = state.alert.servicenowCallerId;
      }

      if (state.alert.servicenowProxy) {
        config.servicenow_proxy = state.alert.servicenowProxy;
      }

      return config;
    },

    victorops(state) {
      let config = {};
      if (state.alert.victoropsApiKey) {
        config.victorops_api_key = state.alert.victoropsApiKey;
      }

      if (state.alert.victoropsRoutingKey) {
        config.victorops_routing_key = state.alert.victoropsRoutingKey;
      }

      if (state.alert.victoropsMessageType) {
        config.victorops_message_type = state.alert.victoropsMessageType;
      }

      if (state.alert.victoropsEntityId) {
        config.victorops_entity_id = state.alert.victoropsEntityId;
      }

      if (state.alert.victoropsEntityDisplayName) {
        config.victorops_entity_display_name = state.alert.victoropsEntityDisplayName;
      }

      if (state.alert.victoropsProxy) {
        config.victorops_proxy = state.alert.victoropsProxy;
      }

      return config;
    },

    stomp(state) {
      let config = {};
      if (state.alert.stompHostname) {
        config.stomp_hostname = state.alert.stompHostname;
      }

      if (state.alert.stompHostport) {
        config.stomp_hostport = state.alert.stompHostport;
      }

      if (state.alert.stompLogin) {
        config.stomp_login = state.alert.stompLogin;
      }

      if (state.alert.stompPassword) {
        config.stomp_password = state.alert.stompPassword;
      }

      if (state.alert.stompDestination) {
        config.stomp_destination = state.alert.stompDestination;
      }

      config.stomp_ssl = state.alert.stompSsl;

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

      if (state.alert.googleChatHeaderSubtitle) {
        config.googlechat_header_subtitle = state.alert.googleChatHeaderSubtitle;
      }

      if (state.alert.googleChatHeaderImage) {
        config.googlechat_header_image = state.alert.googleChatHeaderImage;
      }

      if (state.alert.googleFooterKibanalink) {
        config.googlechat_footer_kibanalink = state.alert.googleFooterKibanalink;
      }

      return config;
    },

    mattermost(state) {
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

      if (state.alert.mattermostIconUrlOverride) {
        config.mattermost_icon_url_override = state.alert.mattermostIconUrlOverride;
      }

      if (state.alert.mattermostMsgPretext) {
        config.mattermost_msg_pretext = state.alert.mattermostMsgPretext;
      }

      config.mattermost_ignore_ssl_errors = state.alert.mattermostIgnoreSslErrors;

      if (state.alert.mattermostProxy) {
        config.mattermost_proxy = state.alert.mattermostProxy;
      }

      return config;
    },

    hivealerter(state) {
      let config = {};
      config.hive_alert_config = {};

      if (state.alert.hiveAlertConfigTitle) {
        config.hive_alert_config.title = state.alert.hiveAlertConfigTitle;
      }

      if (state.alert.hiveAlertConfigType) {
        config.hive_alert_config.type = state.alert.hiveAlertConfigType;
      }

      if (state.alert.hiveAlertConfigSource) {
        config.hive_alert_config.source = state.alert.hiveAlertConfigSource;
      }

      if (state.alert.hiveAlertConfigDescription) {
        config.hive_alert_config.description = state.alert.hiveAlertConfigDescription;
      }

      if (state.alert.hiveAlertConfigSeverity) {
        config.hive_alert_config.severity = state.alert.hiveAlertConfigSeverity;
      }

      if (state.alert.hiveAlertConfigTags && state.alert.hiveAlertConfigTags.length) {
        config.hive_alert_config.tags = state.alert.hiveAlertConfigTags;
      }

      if (state.alert.hiveAlertConfigTlp) {
        config.hive_alert_config.tlp = state.alert.hiveAlertConfigTlp;
      }

      if (state.alert.hiveAlertConfigStatus) {
        config.hive_alert_config.status = state.alert.hiveAlertConfigStatus;
      }

      if (state.alert.hiveAlertConfigFollow) {
        config.hive_alert_config.follow = state.alert.hiveAlertConfigFollow;
      } else {
        config.hive_alert_config.follow = false;
      }

      return config;
    },

    alerta(state) {
      let config = {};

      if (state.alert.alertaApiUrl) {
        config.alerta_api_url = state.alert.alertaApiUrl;
      }

      if (state.alert.alertaApiKey) {
        config.alerta_api_key = state.alert.alertaApiKey;
      }

      if (state.alert.alertaSeverity) {
        config.alerta_severity = state.alert.alertaSeverity;
      }

      if (state.alert.alertaResource) {
        config.alerta_resource = state.alert.alertaResource;
      }

      if (state.alert.alertaText) {
        config.alerta_text = state.alert.alertaText;
      }

      if (state.alert.alertaEvent) {
        config.alerta_event = state.alert.alertaEvent;
      }

      if (state.alert.alertaGroup) {
        config.alerta_group = state.alert.alertaGroup;
      }

      if (state.alert.alertaTags && state.alert.alertaTags.length) {
        config.alerta_tags = state.alert.alertaTags;
      }

      if (state.alert.alertaEnvironment) {
        config.alerta_environment = state.alert.alertaEnvironment;
      }

      return config;
    },

    datadog(state) {
      let config = {};

      if (state.alert.datadogApiKey) {
        config.datadog_api_key = state.alert.datadogApiKey;
      }

      if (state.alert.datadogAppKey) {
        config.datadog_app_key = state.alert.datadogAppKey;
      }

      return config;
    },

    subjectBody(state) {
      let config = {};

      if (state.alert.subject) {
        let formattedSubject = htmlToConfigFormat(state.alert.subject);
        config.alert_subject = formattedSubject.alertText.trim();

        if (state.alert.alertSubjectArgs && state.alert.alertSubjectArgs.length) {
          config.alert_subject_args = state.alert.alertSubjectArgs;
        }

        // TODO: Comment out once
        // config.alert_subject_args = formattedSubject.alertArgs;
      }

      if (state.alert.body) {
        let formattedText = htmlToConfigFormat(state.alert.body);
        config.alert_text = formattedText.alertText;

        if (state.alert.alertTextArgs && state.alert.alertTextArgs.length) {
          config.alert_text_args = state.alert.alertTextArgs;
        }

        // TODO: Comment out once
        // config.alert_text_args = formattedText.alertArgs;
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

      if (state.match.queryKey && state.match.queryKey.length) {
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

      // time_window_change
      const existingMatchEnhancements = config.match_enhancements ?? [];
      const timeWindowMatchEnhancements = getters.timeWindow.match_enhancements ?? [];
      config = {
        ...config,
        ...getters.aggregation,
        ...getters.timeWindow,
        match_enhancements: [...existingMatchEnhancements, ...timeWindowMatchEnhancements]
      };

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

      if (state.alert.alert.includes('victorops')) {
        config = { ...config, ...getters.victorops };
      }

      if (state.alert.alert.includes('servicenow')) {
        config = { ...config, ...getters.servicenow };
      }

      if (state.alert.alert.includes('stomp')) {
        config = { ...config, ...getters.stomp };
      }

      if (state.alert.alert.includes('googlechat')) {
        config = { ...config, ...getters.googlechat };
      }

      if (state.alert.alert.includes('mattermost')) {
        config = { ...config, ...getters.mattermost };
      }

      if (state.alert.alert.includes('hivealerter')) {
        config = { ...config, ...getters.hivealerter };
      }

      if (state.alert.alert.includes('alerta')) {
        config = { ...config, ...getters.alerta };
      }

      if (state.alert.alert.includes('datadog')) {
        config = { ...config, ...getters.datadog };
      }

      if (state.alert.alert.includes('chatwork')) {
        config = { ...config, ...getters.chatwork };
      }

      if (state.alert.alert.includes('discord')) {
        config = { ...config, ...getters.discord };
      }

      if (state.alert.alert.includes('ms_teams')) {
        config = { ...config, ...getters.ms_teams };
      }

      if (state.alert.alert.includes('email')
          || state.alert.alert.includes('slack')
          || state.alert.alert.includes('ms_teams')
          || state.alert.alert.includes('telegram')
          || state.alert.alert.includes('jira')
          || state.alert.alert.includes('servicenow')
          || state.alert.alert.includes('googlechat')
          || state.alert.alert.includes('pagertree')
          || state.alert.alert.includes('sns')
          || state.alert.alert.includes('mattermost')
          || state.alert.alert.includes('hivealerter')
          || state.alert.alert.includes('alerta')
          || state.alert.alert.includes('datadog')
          || state.alert.alert.includes('chatwork')
          || state.alert.alert.includes('discord')
          || state.alert.alert.includes('gitter')) {
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

      config = { ...config, ...getters.kibanaDiscover };

      config = { ...config, ...getters.limitExcecution };

      // Sort the keys in the object so it appears alphabetically in the UI
      let conf = {};

      Object.keys(config)
        .sort()
        .forEach(v => {
          conf[v] = config[v];
        });

      return conf;
    },

    yaml: (state, getters) => forTest => yaml.dump(getters.config(forTest), { quotingType: '"', forceQuotes: true })
  }
};
