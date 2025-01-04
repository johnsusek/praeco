import axios from 'axios';
import yaml from 'js-yaml';
import { htmlToConfigFormat } from '@/lib/alertText';
// TODO: error  Dependency cycle via @/lib/logger.js:7  import/no-cycle
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
          if (typeof (config.query_key) === 'string') {
            let tmpQueryKey = [];
            tmpQueryKey.push(config.query_key);
            config.query_key = tmpQueryKey;
          }
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
        if (config.limit_execution) {
          commit('alert/UPDATE_LIMIT_EXCECUTION', config.limit_execution);
        }

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

        /* scan_entire_timeframe */
        commit('alert/UPDATE_SCAN_ENTIRE_TIMEFRAME', config.scan_entire_timeframe);

        /* Description */
        commit('alert/UPDATE_DESCRIPTION', config.description);

        /* Priority */
        commit('alert/UPDATE_PRIORITY', config.priority);

        /* Owner */
        commit('alert/UPDATE_OWNER', config.owner);

        /* HTTP POST */
        if (typeof (config.http_post_url) === 'string') {
          let tmphttpPostUrl = [];
          tmphttpPostUrl.push(config.http_post_url);
          config.http_post_url = tmphttpPostUrl;
        }

        if (config.http_post_url) {
          commit('alert/UPDATE_HTTP_POST_URL', config.http_post_url);
        }

        if (config.http_post_ignore_ssl_errors) {
          commit('alert/UPDATE_HTTP_POST_IGNORE_SSL_ERRORS', config.http_post_ignore_ssl_errors);
        }

        if (config.http_post_ca_certs) {
          commit('alert/UPDATE_HTTP_POST_CA_CERTS', config.http_post_ca_certs);
        }

        if (config.http_post_timeout) {
          commit('alert/UPDATE_HTTP_POST_TIMEOUT', config.http_post_timeout);
        } else {
          commit('alert/UPDATE_HTTP_POST_TIMEOUT', 10);
        }

        commit('alert/UPDATE_HTTP_POST_PROXY', config.http_post_proxy);

        /* HTTP POST 2 */
        if (typeof (config.http_post2_url) === 'string') {
          let tmphttpPost2Url = [];
          tmphttpPost2Url.push(config.http_post2_url);
          config.http_post2_url = tmphttpPost2Url;
        }

        if (config.http_post2_url) {
          commit('alert/UPDATE_HTTP_POST2_URL', config.http_post2_url);
        }

        if (config.http_post2_ignore_ssl_errors) {
          commit('alert/UPDATE_HTTP_POST2_IGNORE_SSL_ERRORS', config.http_post2_ignore_ssl_errors);
        }

        if (config.http_post2_ca_certs) {
          commit('alert/UPDATE_HTTP_POST2_CA_CERTS', config.http_post2_ca_certs);
        }

        if (config.http_post2_timeout) {
          commit('alert/UPDATE_HTTP_POST2_TIMEOUT', config.http_post2_timeout);
        } else {
          commit('alert/UPDATE_HTTP_POST2_TIMEOUT', 10);
        }

        commit('alert/UPDATE_HTTP_POST2_PROXY', config.http_post2_proxy);

        /* IRIS */
        commit('alert/UPDATE_IRIS_HOST', config.iris_host);

        commit('alert/UPDATE_IRIS_API_TOKEN', config.iris_api_token);

        if (config.iris_customer_id) {
          commit('alert/UPDATE_IRIS_CUSTOMER_ID', config.iris_customer_id);
        } else {
          commit('alert/UPDATE_IRIS_CUSTOMER_ID', 1);
        }

        if (config.iris_ignore_ssl_errors) {
          commit('alert/UPDATE_IRIS_IGNORE_SSL_ERRORS', config.iris_ignore_ssl_errors);
        }

        // TODO: Error saving config, are all fields filled out?
        if (config.iris_ca_cert) {
          commit('alert/UPDATE_IRIS_CA_CERT', config.iris_ca_cert);
        }

        commit('alert/UPDATE_IRIS_DESCRIPTION', config.iris_description);

        if (config.iris_overwrite_timestamp) {
          commit('alert/UPDATE_IRIS_OVERWRITE_TIMESTAMP', config.iris_overwrite_timestamp);
        }

        if (config.iris_type) {
          commit('alert/UPDATE_IRIS_TYPE', config.iris_type);
        } else {
          commit('alert/UPDATE_IRIS_TYPE', 'alert');
        }

        commit('alert/UPDATE_IRIS_CASE_TEMPLATE_ID', config.iris_case_template_id);

        commit('alert/UPDATE_IRIS_ALERT_NOTE', config.iris_alert_note);

        commit('alert/UPDATE_IRIS_ALERT_TAGS', config.iris_alert_tags);

        if (config.iris_alert_status_id) {
          commit('alert/UPDATE_IRIS_ALERT_STATUS_ID', config.iris_alert_status_id);
        } else {
          commit('alert/UPDATE_IRIS_ALERT_STATUS_ID', 2);
        }

        commit('alert/UPDATE_IRIS_ALERT_SOURCE_LINK', config.iris_alert_source_link);

        if (config.iris_alert_severity_id) {
          commit('alert/UPDATE_IRIS_ALERT_SEVERITY_ID', config.iris_alert_severity_id);
        } else {
          commit('alert/UPDATE_IRIS_ALERT_SEVERITY_ID', 1);
        }

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

        /* Telegram */
        commit('alert/UPDATE_TELEGRAM_ROOM_ID', config.telegram_room_id);
        commit('alert/UPDATE_TELEGRAM_PROXY', config.telegram_proxy);
        commit('alert/UPDATE_TELEGRAM_PROXY_LOGIN', config.telegram_proxy_login);
        commit('alert/UPDATE_TELEGRAM_PROXY_PASS', config.telegram_proxy_pass);
        commit('alert/UPDATE_TELEGRAM_THREAD_ID', config.telegram_thread_id);

        if (config.telegram_parse_mode) {
          commit('alert/UPDATE_TELEGRAM_PARSE_MODE', config.telegram_parse_mode);
        } else {
          commit('alert/UPDATE_TELEGRAM_PARSE_MODE', 'markdown');
        }

        /* Tencent SMS */
        commit('alert/UPDATE_TENCENT_SMS_SECRET_ID', config.tencent_sms_secret_id);
        commit('alert/UPDATE_TENCENT_SMS_SECRET_KEY', config.tencent_sms_secret_key);
        commit('alert/UPDATE_TENCENT_SMS_SDK_APPID', config.tencent_sms_sdk_appid);

        if (config.tencent_sms_to_number) {
          commit('alert/UPDATE_TENCENT_SMS_TO_NUMBER', config.tencent_sms_to_number);
        }

        if (config.tencent_sms_region) {
          commit('alert/UPDATE_TENCENT_SMS_REGION', config.tencent_sms_region);
        } else {
          commit('alert/UPDATE_TENCENT_SMS_REGION', 'ap-guangzhou');
        }

        commit('alert/UPDATE_TENCENT_SMS_SIGN_NAME', config.tencent_sms_sign_name);
        commit('alert/UPDATE_TENCENT_SMS_TEMPLATE_ID', config.tencent_sms_template_id);

        if (config.tencent_sms_template_parm) {
          commit('alert/UPDATE_TENCENT_SMS_TEMPLATE_PARM', config.tencent_sms_template_parm);
        }

        /* Chatwork */
        commit('alert/UPDATE_CHATWORK_API_KEY', config.chatwork_apikey);
        commit('alert/UPDATE_CHATWORK_ROOM_ID', config.chatwork_room_id);
        commit('alert/UPDATE_CHATWORK_PROXY', config.chatwork_proxy);
        commit('alert/UPDATE_CHATWORK_PROXY_LOGIN', config.chatwork_proxy_login);
        commit('alert/UPDATE_CHATWORK_PROXY_PASS', config.chatwork_proxy_pass);

        /* Discord */
        commit('alert/UPDATE_DISCORD_WEBHOOK_URL', config.discord_webhook_url);

        if (config.discord_emoji_title) {
          commit('alert/UPDATE_DISCORD_EMOJI_TITLE', config.discord_emoji_title);
        } else {
          commit('alert/UPDATE_DISCORD_EMOJI_TITLE', ':warning:');
        }

        commit('alert/UPDATE_DISCORD_EMBED_FOOTER', config.discord_embed_footer);
        commit('alert/UPDATE_DISCORD_EMBED_ICON_URL', config.discord_embed_icon_url);
        commit('alert/UPDATE_DISCORD_PROXY', config.discord_proxy);
        commit('alert/UPDATE_DISCORD_PROXY_LOGIN', config.discord_proxy_login);
        commit('alert/UPDATE_DISCORD_PROXY_PASSWORD', config.discord_proxy_password);

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
        commit('alert/UPDATE_TWILIO_MESSAGE_SERVICE_SID', config.twilio_message_service_sid);

        /* OpsGenie */
        commit('alert/OPSGENIE_KEY', config.opsgenie_key);
        commit('alert/OPSGENIE_ACCOUNT', config.opsgenie_account);
        commit('alert/OPSGENIE_MESSAGE', config.opsgenie_message);
        commit('alert/OPSGENIE_SUBJECT', config.opsgenie_subject);
        commit('alert/OPSGENIE_ALIAS', config.opsgenie_alias);
        commit('alert/OPSGENIE_PROXY', config.opsgenie_proxy);
        commit('alert/OPSGENIE_DESCRIPTION', config.opsgenie_description);

        /* PagerDuty */
        commit('alert/UPDATE_PAGERDUTY_SERVICE_KEY', config.pagerduty_service_key);
        commit('alert/UPDATE_PAGERDUTY_CLIENT_NAME', config.pagerduty_client_name);

        if (config.pagerduty_event_type) {
          commit('alert/UPDATE_PAGERDUTY_EVENT_TYPE', config.pagerduty_event_type);
        } else {
          commit('alert/UPDATE_PAGERDUTY_EVENT_TYPE', 'trigger');
        }

        commit('alert/UPDATE_PAGERDUTY_INCIDENT_KEY', config.pagerduty_incident_key);

        if (config.pagerduty_incident_key_args) {
          commit('alert/UPDATE_PAGERDUTY_INCIDENT_KEY_ARGS', config.pagerduty_incident_key_args);
        }

        commit('alert/UPDATE_PAGERDUTY_PROXYY', config.pagerduty_proxy);
        commit('alert/UPDATE_PAGERDUTY_API_VERSION', config.pagerduty_api_version);

        commit('alert/UPDATE_PAGERDUTY_V2_PAYLOAD_CLASS', config.pagerduty_v2_payload_class);

        if (config.pagerduty_v2_payload_class_args) {
          commit('alert/UPDATE_PAGERDUTY_V2_PAYLOAD_CLASS_ARGS', config.pagerduty_v2_payload_class_args);
        }

        commit('alert/UPDATE_PAGERDUTY_V2_PAYLOAD_COMPONENT', config.pagerduty_v2_payload_component);

        if (config.pagerduty_v2_payload_component_args) {
          commit('alert/UPDATE_PAGERDUTY_V2_PAYLOAD_COMPONENT_ARGS', config.pagerduty_v2_payload_component_args);
        }

        commit('alert/UPDATE_PAGERDUTY_V2_PAYLOAD_GROUP', config.pagerduty_v2_payload_group);

        if (config.pagerduty_v2_payload_group_args) {
          commit('alert/UPDATE_PAGERDUTY_V2_PAYLOAD_GROUP_ARGS', config.pagerduty_v2_payload_group_args);
        }

        if (config.pagerduty_v2_payload_severity) {
          commit('alert/UPDATE_PAGERDUTY_V2_PAYLOAD_SEVERITY', config.pagerduty_v2_payload_severity);
        } else {
          commit('alert/UPDATE_PAGERDUTY_V2_PAYLOAD_SEVERITY', 'critical');
        }

        if (config.pagerduty_v2_payload_source) {
          commit('alert/UPDATE_PAGERDUTY_V2_PAYLOAD_SOURCE', config.pagerduty_v2_payload_source);
        } else {
          commit('alert/UPDATE_PAGERDUTY_V2_PAYLOAD_SOURCE', 'ElastAlert');
        }

        if (config.pagerduty_v2_payload_source_args) {
          commit('alert/UPDATE_PAGERDUTY_V2_PAYLOAD_SOURCE_ARGS', config.pagerduty_v2_payload_source_args);
        }

        if (config.pagerduty_v2_payload_include_all_info) {
          commit('alert/UPDATE_PAGERDUTY_V2_PAYLOAD_INCLUDE_ALL_INFO', config.pagerduty_v2_payload_include_all_info);
        }

        if (config.pagerduty_ca_certs) {
          commit('alert/UPDATE_PAGERDUTY_CA_CERTS', config.pagerduty_ca_certs);
        }

        if (config.pagerduty_ignore_ssl_errors) {
          commit('alert/UPDATE_PAGERDUTY_IGNORE_SSL_ERRORS', config.pagerduty_ignore_ssl_errors);
        }

        /* PagerTree */
        commit('alert/UPDATE_PAGERTREE_INTEGRATION_URL', config.pagertree_integration_url);
        commit('alert/UPDATE_PAGERTREE_PROXY', config.pagertree_proxy);

        /* Alertmanager */
        if (config.alertmanager_alert_subject_labelname) {
          commit('alert/UPDATE_ALERTMANAGER_ALERT_SUBJECT_LABELNAME', config.alertmanager_alert_subject_labelname);
        } else {
          commit('alert/UPDATE_ALERTMANAGER_ALERT_SUBJECT_LABELNAME', 'summary');
        }

        if (config.alertmanager_alert_text_labelname) {
          commit('alert/UPDATE_ALERTMANAGER_ALERT_TEXT_LABELNAME', config.alertmanager_alert_text_labelname);
        } else {
          commit('alert/UPDATE_ALERTMANAGER_ALERT_TEXT_LABELNAME', 'description');
        }

        commit('alert/UPDATE_ALERTMANAGER_PROXY', config.alertmanager_proxy);
        commit('alert/UPDATE_ALERTMANAGER_BASIC_AUTH_LOGIN', config.alertmanager_basic_auth_login);
        commit('alert/UPDATE_ALERTMANAGER_BASIC_AUTH_PASSWORD', config.alertmanager_basic_auth_password);

        if (config.alertmanager_ca_certs) {
          commit('alert/UPDATE_ALERTMANAGER_CA_CERTS', config.alertmanager_ca_certs);
        }

        if (config.alertmanager_ignore_ssl_errors) {
          commit('alert/UPDATE_ALERTMANAGER_IGNORE_SSL_ERRORS', config.alertmanager_ignore_ssl_errors);
        }

        commit('alert/UPDATE_ALERTMANAGER_TIMEOUT', config.alertmanager_timeout);

        /* Amazon SNS */
        commit('alert/UPDATE_SNS_TOPIC_ARN', config.sns_topic_arn);
        commit('alert/UPDATE_SNS_AWS_ACCESS_KEY_ID', config.sns_aws_access_key_id);
        commit('alert/UPDATE_SNS_AWS_SECRET_ACCESS_KEY', config.sns_aws_secret_access_key);
        commit('alert/UPDATE_SNS_AWS_REGION', config.sns_aws_region);
        commit('alert/UPDATE_SNS_AWS_PROFILE', config.sns_aws_profile);

        /* Amazon SES */
        commit('alert/UPDATE_SES_AWS_ACCESS_KEY_ID', config.ses_aws_access_key_id);
        commit('alert/UPDATE_SES_AWS_SECRET_ACCESS_KEY', config.ses_aws_secret_access_key);
        commit('alert/UPDATE_SES_AWS_REGION', config.ses_aws_region);
        commit('alert/UPDATE_SES_AWS_PROFILE', config.ses_aws_profile);
        commit('alert/UPDATE_SES_FROM_ADDR', config.ses_from_addr);
        commit('alert/UPDATE_SES_EMAIL_REPLY_TO', config.ses_email_reply_to);

        if (config.ses_email) {
          if (Array.isArray(config.ses_email)) {
            commit('alert/UPDATE_SES_EMAIL', config.ses_email.join(','));
          } else {
            commit('alert/UPDATE_SES_EMAIL', config.ses_email);
          }
        }

        if (config.ses_cc) {
          if (Array.isArray(config.ses_cc)) {
            commit('alert/UPDATE_SES_CC', config.ses_cc.join(','));
          } else {
            commit('alert/UPDATE_SES_CC', config.ses_cc);
          }
        }

        if (config.ses_bcc) {
          if (Array.isArray(config.ses_bcc)) {
            commit('alert/UPDATE_SES_BCC', config.ses_bcc.join(','));
          } else {
            commit('alert/UPDATE_SES_BCC', config.ses_bcc);
          }
        }

        commit('alert/UPDATE_SES_EMAIL_FROM_FIELD', config.ses_email_from_field);
        commit('alert/UPDATE_SES_EMAIL_ADD_DOMAIN', config.ses_email_add_domain);

        /* WorkWechat */
        commit('alert/UPDATE_WORK_WECHAT_BOT_ID', config.work_wechat_bot_id);

        if (config.work_wechat_msgtype) {
          commit('alert/UPDATE_WORK_WECHAT_MSGTYPE', config.work_wechat_msgtype);
        } else {
          commit('alert/UPDATE_WORK_WECHAT_MSGTYPE', 'text');
        }

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

        if (config.zbx_host_from_field) {
          commit('alert/UPDATE_ZBX_HOST_FROM_FIELD', config.zbx_host_from_field);
        }

        /* Lark */
        commit('alert/UPDATE_LARK_BOT_ID', config.lark_bot_id);
        if (config.lark_msgtype) {
          commit('alert/UPDATE_LARK_MSGTYPE', config.lark_msgtype);
        } else {
          commit('alert/UPDATE_LARK_MSGTYPE', 'text');
        }

        /* Command */
        if (config.command) {
          config.command.forEach(entry => commit('alert/ADD_COMMAND_ENTRY_VALUE', entry));
        }

        commit('alert/UPDATE_PIPE_MATCH_JSON', config.pipe_match_json);
        commit('alert/UPDATE_PIPE_ALERT_TEXT', config.pipe_alert_text);
        commit('alert/UPDATE_FAIL_ON_NON_ZERO_EXIT', config.fail_on_non_zero_exit);

        /* Gelf */
        commit('alert/UPDATE_GELF_TYPE', config.gelf_type);
        commit('alert/UPDATE_GELF_ENDPOINT', config.gelf_endpoint);

        if (config.gelf_http_ignore_ssl_errors) {
          commit('alert/UPDATE_GELF_HTTP_IGNORE_SSL_ERRORS', config.gelf_http_ignore_ssl_errors);
        }

        commit('alert/UPDATE_GELF_CA_CERT', config.gelf_ca_cert);
        commit('alert/UPDATE_GELF_HOST', config.gelf_host);
        commit('alert/UPDATE_GELF_PORT', config.gelf_port);
        commit('alert/UPDATE_GELF_LOG_LEVEL', config.gelf_log_level);
        commit('alert/UPDATE_GELF_TIMEOUT', config.gelf_timeout);

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
        commit('alert/UPDATE_SERVICENOW_IMPACT', config.servicenow_impact);
        commit('alert/UPDATE_SERVICENOW_URGENCY', config.servicenow_urgency);

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
          commit('alert/UPDATE_STOMP_HOSTPORT', '61613');
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

        /* GoogleChat */
        if (typeof (config.googlechat_webhook_url) === 'string') {
          let tmpGooglechatWebhookUrl = [];
          tmpGooglechatWebhookUrl.push(config.googlechat_webhook_url);
          config.googlechat_webhook_url = tmpGooglechatWebhookUrl;
        }

        if (config.googlechat_webhook_url) {
          commit('alert/UPDATE_GOOGLE_CHAT_WEBHOOK_URL', config.googlechat_webhook_url);
        }

        if (config.googlechat_format) {
          commit('alert/UPDATE_GOOGLE_CHAT_FORMAT', config.googlechat_format);
        } else {
          commit('alert/UPDATE_GOOGLE_CHAT_FORMAT', 'basic');
        }

        commit('alert/UPDATE_GOOGLE_CHAT_HEADER_TITLE', config.googlechat_header_title);
        commit('alert/UPDATE_GOOGLECHAT_HEADER_SUBTITLE', config.googlechat_header_subtitle);
        commit('alert/UPDATE_GOOGLECHAT_HEADER_IMAGE', config.googlechat_header_image);
        commit('alert/UPDATE_GOOGLECHAT_FOOTER_KIBANALINK', config.googlechat_footer_kibanalink);
        commit('alert/UPDATE_GOOGLECHAT_PROXY', config.googlechat_proxy);

        /* Mattermost */
        if (config.mattermost_webhook_url) {
          commit('alert/UPDATE_MATTERMOST_WEBHOOK_URL', config.mattermost_webhook_url);
        }

        if (typeof (config.mattermost_channel_override) === 'string') {
          let tmpMattermostChannelOverride = [];
          tmpMattermostChannelOverride.push(config.mattermost_channel_override);
          config.mattermost_channel_override = tmpMattermostChannelOverride;
        }
        if (config.mattermost_channel_override) {
          commit('alert/UPDATE_MATTERMOST_CHANNEL_OVERRIDE', config.mattermost_channel_override);
        }

        if (config.mattermost_username_override) {
          commit('alert/UPDATE_MATTERMOST_USERNAME_OVERRIDE', config.mattermost_username_override);
        } else {
          commit('alert/UPDATE_MATTERMOST_USERNAME_OVERRIDE', 'elastalert');
        }

        if (config.mattermost_emoji_override) {
          commit('alert/UPDATE_MATTERMOST_EMOJI_OVERRIDE', config.mattermost_emoji_override);
        } else {
          commit('alert/UPDATE_MATTERMOST_EMOJI_OVERRIDE', ':ghost:');
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
        }

        commit('alert/UPDATE_MATTERMOST_PROXY', config.mattermost_proxy);
        commit('alert/UPDATE_MATTERMOST_TITLE', config.mattermost_title);
        commit('alert/UPDATE_MATTERMOST_TITLE_LINK', config.mattermost_title_link);
        commit('alert/UPDATE_MATTERMOST_FOOTER', config.mattermost_footer);
        commit('alert/UPDATE_MATTERMOST_FOOTER_ICON', config.mattermost_footer_icon);
        commit('alert/UPDATE_MATTERMOST_IMAGE_URL', config.mattermost_image_url);
        commit('alert/UPDATE_MATTERMOST_THUMB_URL', config.mattermost_thumb_url);
        commit('alert/UPDATE_MATTERMOST_AUTHOR_NAME', config.mattermost_author_name);
        commit('alert/UPDATE_MATTERMOST_AUTHOR_LINK', config.mattermost_author_link);
        commit('alert/UPDATE_MATTERMOST_AUTHOR_ICON', config.mattermost_author_icon);

        if (config.mattermost_attach_kibana_discover_url) {
          commit('alert/UPDATE_MATTERMOST_ATTACH_KIBANA_DISCOVER_URL', config.mattermost_attach_kibana_discover_url);
        }

        if (config.mattermost_kibana_discover_color) {
          commit('alert/UPDATE_MATTERMOST_KIBANA_DISCOVER_COLOR', config.mattermost_kibana_discover_color);
        }

        if (config.mattermost_kibana_discover_title) {
          commit('alert/UPDATE_MATTERMOST_KIBANA_DISCOVER_TITLE', config.mattermost_kibana_discover_title);
        }

        /* Matrix Hookshot */
        if (typeof (config.matrixhookshot_webhook_url) === 'string') {
          let tmpMatrixhookshotWebhookUrl = [];
          tmpMatrixhookshotWebhookUrl.push(config.matrixhookshot_webhook_url);
          config.matrixhookshot_webhook_url = tmpMatrixhookshotWebhookUrl;
        }
        if (config.matrixhookshot_webhook_url) {
          commit('alert/UPDATE_MATRIXHOOKSHOT_WEBHOOK_URL', config.matrixhookshot_webhook_url);
        }

        commit('alert/UPDATE_MATRIXHOOKSHOT_USERNAME', config.matrixhookshot_username);

        if (config.matrixhookshot_timeout) {
          commit('alert/UPDATE_MATRIXHOOKSHOT_TIMEOUT', config.matrixhookshot_timeout);
        }

        commit('alert/UPDATE_MATRIXHOOKSHOT_TEXT', config.matrixhookshot_text);
        commit('alert/UPDATE_MATRIXHOOKSHOT_PROXY', config.matrixhookshot_proxy);

        if (config.matrixhookshot_ca_certs) {
          commit('alert/UPDATE_MATRIXHOOKSHOT_CA_CERTS', config.matrixhookshot_ca_certs);
        }

        if (config.matrixhookshot_ignore_ssl_errors) {
          commit('alert/UPDATE_MATRIXHOOKSHOT_IGNORE_SSL_ERRORS', config.matrixhookshot_ignore_ssl_errors);
        }

        /* Rocket.Chat */
        if (config.rocket_chat_webhook_url) {
          commit('alert/UPDATE_ROCKET_CHAT_WEBHOOK_URL', config.rocket_chat_webhook_url);
        }

        if (config.rocket_chat_username_override) {
          commit('alert/UPDATE_ROCKET_CHAT_USERNAME_OVERRIDE', config.rocket_chat_username_override);
        } else {
          commit('alert/UPDATE_ROCKET_CHAT_USERNAME_OVERRIDE', 'elastalert2');
        }

        if (typeof (config.rocket_chat_channel_override) === 'string') {
          let tmpRocketChatChannelOverride = [];
          tmpRocketChatChannelOverride.push(config.rocket_chat_channel_override);
          config.rocket_chat_channel_override = tmpRocketChatChannelOverride;
        }
        if (config.rocket_chat_channel_override) {
          commit('alert/UPDATE_ROCKET_CHAT_CHANNEL_OVERRIDE', config.rocket_chat_channel_override);
        }

        if (config.rocket_chat_emoji_override) {
          commit('alert/UPDATE_ROCKET_CHAT_EMOJI_OVERRIDE', config.rocket_chat_emoji_override);
        } else {
          commit('alert/UPDATE_ROCKET_CHAT_EMOJI_OVERRIDE', ':ghost:');
        }

        if (config.rocket_chat_msg_color) {
          commit('alert/UPDATE_ROCKET_CHAT_MSG_COLOR', config.rocket_chat_msg_color);
        } else {
          commit('alert/UPDATE_ROCKET_CHAT_MSG_COLOR', 'danger');
        }

        commit('alert/UPDATE_ROCKET_CHAT_TEXT_STRING', config.rocket_chat_text_string);
        commit('alert/UPDATE_ROCKET_CHAT_PROXY', config.rocket_chat_proxy);

        if (config.rocket_chat_attach_kibana_discover_url) {
          commit('alert/UPDATE_ROCKET_CHAT_ATTACH_KIBANA_DISCOVER_URL', config.rocket_chat_attach_kibana_discover_url);
        }

        if (config.rocket_chat_kibana_discover_color) {
          commit('alert/UPDATE_ROCKET_CHAT_KIBANA_DISCOVER_COLOR', config.rocket_chat_kibana_discover_color);
        }

        if (config.rocket_chat_kibana_discover_title) {
          commit('alert/UPDATE_ROCKET_CHAT_KIBANA_DISCOVER_TITLE', config.rocket_chat_kibana_discover_title);
        }

        if (config.rocket_chat_ignore_ssl_errors) {
          commit('alert/UPDATE_ROCKET_CHAT_IGNORE_SSL_ERRORS', config.rocket_chat_ignore_ssl_errors);
        }

        if (config.rocket_chat_timeout) {
          commit('alert/UPDATE_ROCKET_CHAT_TIMEOUT', config.rocket_chat_timeout);
        } else {
          commit('alert/UPDATE_ROCKET_CHAT_TIMEOUT', 10);
        }

        if (config.rocket_chat_ca_certs) {
          commit('alert/UPDATE_ROCKET_CHAT_CA_CERTS', config.rocket_chat_ca_certs);
        }

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

        commit('alert/UPDATE_ALERTA_TIMEOUT', config.alerta_timeout);

        if (config.alerta_use_match_timestamp) {
          commit('alert/UPDATE_ALERTA_USE_MATCH_TIMESTAMP', config.alerta_use_match_timestamp);
        }

        if (config.alerta_use_qk_as_resource) {
          commit('alert/UPDATE_ALERTA_USE_QK_AS_RESOURCE', config.alerta_use_qk_as_resource);
        }

        if (config.alerta_api_skip_ssl) {
          commit('alert/UPDATE_ALERTA_API_SKIP_SSL', config.alerta_api_skip_ssl);
        }

        if (config.alerta_origin) {
          commit('alert/UPDATE_ALERTA_ORIGIN', config.alerta_origin);
        } else {
          commit('alert/UPDATE_ALERTA_ORIGIN', 'elastalert');
        }

        commit('alert/UPDATE_ALERTA_VALUE', config.alerta_value);

        if (config.alerta_type) {
          commit('alert/UPDATE_ALERTA_TYPE', config.alerta_type);
        } else {
          commit('alert/UPDATE_ALERTA_TYPE', 'elastalert');
        }

        if (config.alerta_service) {
          commit('alert/UPDATE_ALERTA_SERVICE', config.alerta_service);
        }

        if (config.alerta_correlate) {
          commit('alert/UPDATE_ALERTA_CORRELATE', config.alerta_correlate);
        }

        if (config.alerta_attributes_keys) {
          commit('alert/UPDATE_ALERTA_ATTRIBUTES_KEYS', config.alerta_attributes_keys);
        }

        if (config.alerta_attributes_values) {
          commit('alert/UPDATE_ALERTA_ATTRIBUTES_VALUES', config.alerta_attributes_values);
        }

        /* Datadog */
        commit('alert/UPDATE_DATADOG_API_KEY', config.datadog_api_key);
        commit('alert/UPDATE_DATADOG_APP_KEY', config.datadog_app_key);

        /* Dingtalk */
        commit('alert/UPDATE_DINGTALK_ACCESS_TOKEN', config.dingtalk_access_token);

        if (config.dingtalk_msgtype) {
          commit('alert/UPDATE_DINGTALK_MSGTYPE', config.dingtalk_msgtype);
        } else {
          commit('alert/UPDATE_DINGTALK_MSGTYPE', 'text');
        }

        if (config.dingtalk_single_title) {
          commit('alert/UPDATE_DINGTALK_SINGLE_TITLE', config.dingtalk_single_title);
        } else {
          commit('alert/UPDATE_DINGTALK_SINGLE_TITLE', 'elastalert');
        }

        commit('alert/UPDATE_DINGTALK_SINGLE_URL', config.dingtalk_single_url);

        commit('alert/UPDATE_DINGTALK_BTN_ORIENTATION', config.dingtalk_btn_orientation);

        commit('alert/UPDATE_DINGTALK_SIGN', config.dingtalk_sign);

        /* Slack */
        if (config.slack_webhook_url) {
          commit('alert/UPDATE_SLACK_WEBHOOK_URL', config.slack_webhook_url);
        }

        if (typeof (config.slack_channel_override) === 'string') {
          let tmpSlackChannelOverride = [];
          tmpSlackChannelOverride.push(config.slack_channel_override);
          config.slack_channel_override = tmpSlackChannelOverride;
        }
        if (config.slack_channel_override) {
          commit('alert/UPDATE_SLACK_CHANNEL_OVERRIDE', config.slack_channel_override);
        }

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

        if (config.slack_ca_certs) {
          commit('alert/UPDATE_SLACK_CA_CERTS', config.slack_ca_certs);
        }

        if (config.slack_icon_url_override) {
          commit('alert/UPDATE_SLACK_ICON_URL_OVERRIDE', config.slack_icon_url_override);
        }

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
        }

        if (config.slack_attach_kibana_discover_url) {
          commit('alert/UPDATE_SLACK_ATTACH_KIBANA_DISCOVER_URL', config.slack_attach_kibana_discover_url);
        }

        if (config.slack_kibana_discover_color) {
          commit('alert/UPDATE_SLACK_KIBANA_DISCOVER_COLOR', config.slack_kibana_discover_color);
        }

        if (config.slack_kibana_discover_title) {
          commit('alert/UPDATE_SLACK_KIBANA_DISCOVER_TITLE', config.slack_kibana_discover_title);
        }

        if (config.slack_attach_jira_ticket_url) {
          commit('alert/UPDATE_SLACK_ATTACH_JIRA_TICKET_URL', config.slack_attach_jira_ticket_url);
        }

        if (config.slack_jira_ticket_color) {
          commit('alert/UPDATE_SLACK_JIRA_TICKET_COLOR', config.slack_jira_ticket_color);
        }

        if (config.slack_jira_ticket_title) {
          commit('alert/UPDATE_SLACK_JIRA_TICKET_TITLE', config.slack_jira_ticket_title);
        }

        commit('alert/UPDATE_SLACK_PROXY', config.slack_proxy);
        commit('alert/UPDATE_SLACK_FOOTER', config.slack_footer);
        commit('alert/UPDATE_SLACK_FOOTER_ICON', config.slack_footer_icon);
        commit('alert/UPDATE_SLACK_IMAGE_URL', config.slack_image_url);
        commit('alert/UPDATE_SLACK_THUMB_URL', config.slack_thumb_url);
        commit('alert/UPDATE_SLACK_AUTHOR_NAME', config.slack_author_name);
        commit('alert/UPDATE_SLACK_AUTHOR_LINK', config.slack_author_link);
        commit('alert/UPDATE_SLACK_AUTHOR_ICON', config.slack_author_icon);
        commit('alert/UPDATE_SLACK_MSG_PRETEXT', config.slack_msg_pretext);

        /* MS Power Automate */
        if (typeof (config.ms_power_automate_webhook_url) === 'string') {
          let tmpMsPowerAutomateWebhookUrl = [];
          tmpMsPowerAutomateWebhookUrl.push(config.ms_power_automate_webhook_url);
          config.ms_power_automate_webhook_url = tmpMsPowerAutomateWebhookUrl;
        }
        if (config.ms_power_automate_webhook_url) {
          commit('alert/UPDATE_MS_POWER_AUTOMATE_WEBHOOK_URL', config.ms_power_automate_webhook_url);
        }

        if (config.ms_power_automate_teams_card_width_full) {
          commit('alert/UPDATE_MS_POWER_AUTOMATE_ALERT_FIXED_WIDTH', config.ms_power_automate_teams_card_width_full);
        }

        commit('alert/UPDATE_MS_POWER_AUTOMATE_ALERT_SUMMARY', config.ms_power_automate_alert_summary);
        commit('alert/UPDATE_MS_POWER_AUTOMATE_SUMMARY_TEXT_SIZE', config.ms_power_automate_summary_text_size);
        commit('alert/UPDATE_MS_POWER_AUTOMATE_BODY_TEXT_SIZE', config.ms_power_automate_body_text_size);
        commit('alert/UPDATE_MS_POWER_AUTOMATE_PROXY', config.ms_power_automate_proxy);

        if (config.ms_power_automate_ca_certs) {
          commit('alert/UPDATE_MS_POWER_AUTOMATE_CA_CERTS', config.ms_power_automate_ca_certs);
        }

        if (config.ms_power_automate_ignore_ssl_errors) {
          commit('alert/UPDATE_MS_POWER_AUTOMATE_IGNORE_SSL_ERRORS', config.ms_power_automate_ignore_ssl_errors);
        }

        commit('alert/UPDATE_MS_POWER_AUTOMATE_ATTACH_KIBANA_DISCOVER_URL', config.ms_power_automate_attach_kibana_discover_url);
        commit('alert/UPDATE_MS_POWER_AUTOMATE_KIBANA_DISCOVER_TITLE', config.ms_power_automate_kibana_discover_title);
        commit('alert/UPDATE_MS_POWER_AUTOMATE_KIBANA_DISCOVER_COLOR', config.ms_power_automate_kibana_discover_color);

        /* OpsGenie */
        commit('alert/OPSGENIE_KEY', config.opsgenie_key);
        commit('alert/OPSGENIE_ACCOUNT', config.opsgenie_account);
        commit('alert/OPSGENIE_MESSAGE', config.opsgenie_message);
        commit('alert/OPSGENIE_SUBJECT', config.opsgenie_subject);
        commit('alert/OPSGENIE_ALIAS', config.opsgenie_alias);
        commit('alert/OPSGENIE_PROXY', config.opsgenie_proxy);
        commit('alert/OPSGENIE_PRIORITY', config.opsgenie_priority);
        commit('alert/OPSGENIE_DESCRIPTION', config.opsgenie_description);
        commit('alert/UPDATE_OPSGENIE_PRIORITY', config.opsgenie_priority);

        /* realert, alert, alert_text_type, alert_text, alert_subject, alert_subject_args, alert_text_args */
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

      if (state.alert.httpPostUrl && state.alert.httpPostUrl.length) {
        config.http_post_url = state.alert.httpPostUrl;
      }

      if (state.alert.httpPostIgnoreSslErrors) {
        config.http_post_ignore_ssl_errors = state.alert.httpPostIgnoreSslErrors;
      }

      if (state.alert.httpPostCaCerts) {
        config.http_post_ca_certs = state.alert.httpPostCaCerts;
      }

      if (state.alert.httpPostTimeout) {
        config.http_post_timeout = state.alert.httpPostTimeout;
      }

      if (state.alert.httpPostProxy) {
        config.http_post_proxy = state.alert.httpPostProxy;
      }

      return config;
    },

    http2(state) {
      let config = {};

      if (state.alert.httpPost2Url && state.alert.httpPost2Url.length) {
        config.http_post2_url = state.alert.httpPost2Url;
      }

      if (state.alert.httpPost2IgnoreSslErrors) {
        config.http_post2_ignore_ssl_errors = state.alert.httpPost2IgnoreSslErrors;
      }

      if (state.alert.httpPost2CaCerts) {
        config.http_post2_ca_certs = state.alert.httpPost2CaCerts;
      }

      if (state.alert.httpPost2Timeout) {
        config.http_post2_timeout = state.alert.httpPost2Timeout;
      }

      if (state.alert.httpPost2Proxy) {
        config.http_post2_proxy = state.alert.httpPost2Proxy;
      }

      return config;
    },

    iris(state) {
      let config = {};

      if (state.alert.irisHost) {
        config.iris_host = state.alert.irisHost;
      }

      if (state.alert.irisApiToken) {
        config.iris_api_token = state.alert.irisApiToken;
      }

      if (state.alert.irisCustomerId) {
        config.iris_customer_id = state.alert.irisCustomerId;
      }

      if (state.alert.irisIgnoreSslErrors) {
        config.iris_ignore_ssl_errors = state.alert.irisIgnoreSslErrors;
      }

      // TODO: Error saving config, are all fields filled out?
      if (state.alert.irisCaCert) {
        config.iris_ca_cert = state.alert.irisCaCert;
      }

      if (state.alert.irisDescription) {
        config.iris_description = state.alert.irisDescription;
      }

      if (state.alert.irisOverwriteTimestamp) {
        config.iris_overwrite_timestamp = state.alert.irisOverwriteTimestamp;
      }

      if (state.alert.irisType) {
        config.iris_type = state.alert.irisType;
      }

      if (state.alert.irisCaseTemplateId) {
        config.iris_case_template_id = state.alert.irisCaseTemplateId;
      }

      if (state.alert.irisAlertNote) {
        config.iris_alert_note = state.alert.irisAlertNote;
      }

      if (state.alert.irisAlertTags) {
        config.iris_alert_tags = state.alert.irisAlertTags;
      }

      if (state.alert.irisAlertStatusId) {
        config.iris_alert_status_id = state.alert.irisAlertStatusId;
      }

      if (state.alert.irisAlertSourceLink) {
        config.iris_alert_source_link = state.alert.irisAlertSourceLink;
      }

      if (state.alert.irisAlertSeverityId) {
        config.iris_alert_severity_id = state.alert.irisAlertSeverityId;
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

      return config;
    },

    slack(state, getters) {
      let config = {};

      if (state.alert.slackWebhookUrl && state.alert.slackWebhookUrl.length) {
        config.slack_webhook_url = state.alert.slackWebhookUrl;
      }

      if (state.alert.slackChannelOverride && state.alert.slackChannelOverride.length) {
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
      } else {
        config.slack_parse_override = 'none';
      }

      if (state.alert.slackTextString) {
        config.slack_text_string = state.alert.slackTextString;
      }

      if (state.alert.slackIgnoreSslErrors) {
        config.slack_ignore_ssl_errors = state.alert.slackIgnoreSslErrors;
      }

      if (state.alert.slackCaCerts) {
        config.slack_ca_certs = state.alert.slackCaCerts;
      }

      if (state.alert.slackIconUrlOverride) {
        config.slack_icon_url_override = state.alert.slackIconUrlOverride;
      }

      if (state.alert.slackTimeout) {
        config.slack_timeout = state.alert.slackTimeout;
      }

      if (state.alert.generateKibanaDiscoverUrl && state.alert.slackAttachKibanaDiscoverUrl) {
        config.slack_attach_kibana_discover_url = state.alert.slackAttachKibanaDiscoverUrl;

        if (state.alert.slackKibanaDiscoverColor) {
          config.slack_kibana_discover_color = state.alert.slackKibanaDiscoverColor;
        }

        if (state.alert.slackKibanaDiscoverTitle) {
          config.slack_kibana_discover_title = state.alert.slackKibanaDiscoverTitle;
        }
      }

      if (state.alert.slackProxy) {
        config.slack_proxy = state.alert.slackProxy;
      }

      if (state.alert.slackFooter) {
        config.slack_footer = state.alert.slackFooter;
      }

      if (state.alert.slackFooterIcon) {
        config.slack_footer_icon = state.alert.slackFooterIcon;
      }

      if (state.alert.slackImageUrl) {
        config.slack_image_url = state.alert.slackImageUrl;
      }

      if (state.alert.slackThumbUrl) {
        config.slack_thumb_url = state.alert.slackThumbUrl;
      }

      if (state.alert.slackAuthorName) {
        config.slack_author_name = state.alert.slackAuthorName;
      }

      if (state.alert.slackAuthorLink) {
        config.slack_author_link = state.alert.slackAuthorLink;
      }

      if (state.alert.slackAuthorIcon) {
        config.slack_author_icon = state.alert.slackAuthorIcon;
      }

      if (state.alert.slackMsgPretext) {
        config.slack_msg_pretext = state.alert.slackMsgPretext;
      }

      if (state.alert.slackAttachJiraTicketUrl) {
        config.slack_attach_jira_ticket_url = state.alert.slackAttachJiraTicketUrl;

        if (state.alert.slackJiraTicketColor) {
          config.slack_jira_ticket_color = state.alert.slackJiraTicketColor;
        }

        if (state.alert.slackJiraTicketTitle) {
          config.slack_jira_ticket_title = state.alert.slackJiraTicketTitle;
        }
      }

      return config;
    },

    ms_power_automate(state) {
      let config = {};

      if (state.alert.msPowerAutomateWebhookUrl && state.alert.msPowerAutomateWebhookUrl.length) {
        config.ms_power_automate_webhook_url = state.alert.msPowerAutomateWebhookUrl;
      }

      if (state.alert.msPowerAutomateTeamsCardWidthFull) {
        config.ms_power_automate_teams_card_width_full = state.alert.msPowerAutomateTeamsCardWidthFull;
      }

      if (state.alert.msPowerAutomateAlertSummary) {
        config.ms_power_automate_alert_summary = state.alert.msPowerAutomateAlertSummary;
      }

      if (state.alert.msPowerAutomateSummaryTextSize) {
        config.ms_power_automate_summary_text_size = state.alert.msPowerAutomateSummaryTextSize;
      }

      if (state.alert.msPowerAutomateBodyTextSize) {
        config.ms_power_automate_body_text_size = state.alert.msPowerAutomateBodyTextSize;
      }

      if (state.alert.msPowerAutomateProxy) {
        config.ms_power_automate_proxy = state.alert.msPowerAutomateProxy;
      }

      if (state.alert.msPowerAutomateIgnoreSslErrors) {
        config.ms_power_automate_ignore_ssl_errors = state.alert.msPowerAutomateIgnoreSslErrors;
      }

      if (state.alert.msPowerAutomateCaCerts) {
        config.ms_power_automate_ca_certs = state.alert.msPowerAutomateCaCerts;
      }

      if (state.alert.generateKibanaDiscoverUrl && state.alert.msPowerAutomateAttachKibanaDiscoverUrl) {
        config.ms_power_automate_attach_kibana_discover_url = state.alert.msPowerAutomateAttachKibanaDiscoverUrl;

        if (state.alert.msPowerAutomateKibanaDiscoverTitle) {
          config.ms_power_automate_kibana_discover_title = state.alert.msPowerAutomateKibanaDiscoverTitle;
        }

        if (state.alert.msPowerAutomateKibanaDiscoverColor) {
          config.ms_power_automate_opensearch_discover_color = state.alert.msPowerAutomateKibanaDiscoverColor;
        }
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

      if (state.alert.telegramParseMode) {
        config.telegram_parse_mode = state.alert.telegramParseMode;
      }

      if (state.alert.telegramThreadId) {
        config.telegram_thread_id = state.alert.telegramThreadId;
      }

      return config;
    },

    tencentsms(state) {
      let config = {};

      if (state.alert.tencentSmsSecretId) {
        config.tencent_sms_secret_id = state.alert.tencentSmsSecretId;
      }

      if (state.alert.tencentSmsSecretKey) {
        config.tencent_sms_secret_key = state.alert.tencentSmsSecretKey;
      }

      if (state.alert.tencentSmsSdkAppid) {
        config.tencent_sms_sdk_appid = state.alert.tencentSmsSdkAppid;
      }

      if (state.alert.tencentSmsToNumber && state.alert.tencentSmsToNumber.length) {
        config.tencent_sms_to_number = state.alert.tencentSmsToNumber;
      }

      if (state.alert.tencentSmsRegion) {
        config.tencent_sms_region = state.alert.tencentSmsRegion;
      }

      if (state.alert.tencentSmsSignName) {
        config.tencent_sms_sign_name = state.alert.tencentSmsSignName;
      }

      if (state.alert.tencentSmsTemplateId) {
        config.tencent_sms_template_id = state.alert.tencentSmsTemplateId;
      }

      if (state.alert.tencentSmsTemplateParm && state.alert.tencentSmsTemplateParm.length) {
        config.tencent_sms_template_parm = state.alert.tencentSmsTemplateParm;
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

      if (state.alert.chatworkProxy) {
        config.chatwork_proxy = state.alert.chatworkProxy;
      }

      if (state.alert.chatworkProxyLogin) {
        config.chatwork_proxy_login = state.alert.chatworkProxyLogin;
      }

      if (state.alert.chatworkProxyPass) {
        config.chatwork_proxy_pass = state.alert.chatworkProxyPass;
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

      if (state.alert.discordProxy) {
        config.discord_proxy = state.alert.discordProxy;
      }

      if (state.alert.discordProxyLogin) {
        config.discord_proxy_login = state.alert.discordProxyLogin;
      }

      if (state.alert.discordProxyPassword) {
        config.discord_proxy_password = state.alert.discordProxyPassword;
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
        config.twilio_use_copilot = false;
        config.twilio_from_number = state.alert.twilioFromNumber;
      }

      if (state.alert.twilioMessageServiceSid) {
        config.twilio_use_copilot = true;
        config.twilio_message_service_sid = state.alert.twilioMessageServiceSid;
      }

      return config;
    },

    opsgenie(state) {
      let config = {};

      if (state.alert.opsgenieKey) {
        config.opsgenie_key = state.alert.opsgenieKey;
      }

      if (state.alert.opsgenieAccount) {
        config.opsgenie_account = state.alert.opsgenieAccount;
      }

      if (state.alert.opsgenieMessage) {
        config.opsgenie_message = state.alert.opsgenieMessage;
      }

      if (state.alert.opsgenieSubject) {
        config.opsgenie_subject = state.alert.opsgenieSubject;
      }

      if (state.alert.opsgenieAlias) {
        config.opsgenie_alias = state.alert.opsgenieAlias;
      }

      if (state.alert.opsgenieProxy) {
        config.opsgenie_proxy = state.alert.opsgenieProxy;
      }

      if (state.alert.opsgenieDescription) {
        config.opsgenie_description = state.alert.opsgenieDescription;
      }

      if (state.alert.opsgeniePriority) {
        config.opsgenie_priority = state.alert.opsgeniePriority;
      }

      return config;
    },

    pagerduty(state) {
      let config = {};

      if (state.alert.pagerdutyServiceKey) {
        config.pagerduty_service_key = state.alert.pagerdutyServiceKey;
      }

      if (state.alert.pagerdutyClientName) {
        config.pagerduty_client_name = state.alert.pagerdutyClientName;
      }

      if (state.alert.pagerdutyEventType) {
        config.pagerduty_event_type = state.alert.pagerdutyEventType;
      }

      if (state.alert.pagerdutyIncidentKeyArgs && state.alert.pagerdutyIncidentKeyArgs.length) {
        config.pagerduty_incident_key_args = state.alert.pagerdutyIncidentKeyArgs;
      } else if (state.alert.pagerdutyIncidentKey) {
        config.pagerduty_incident_key = state.alert.pagerdutyIncidentKey;
      }

      if (state.alert.pagerdutyProxy) {
        config.pagerduty_proxy = state.alert.pagerdutyProxy;
      }

      if (state.alert.pagerdutyApiVersion) {
        config.pagerduty_api_version = state.alert.pagerdutyApiVersion;
      }

      if (state.alert.pagerdutyApiVersion === 'v2') {
        if (state.alert.pagerdutyV2PayloadClassArgs && state.alert.pagerdutyV2PayloadClassArgs.length) {
          config.pagerduty_v2_payload_class_args = state.alert.pagerdutyV2PayloadClassArgs;
        } else if (state.alert.pagerdutyV2PayloadClass) {
          config.pagerduty_v2_payload_class = state.alert.pagerdutyV2PayloadClass;
        }

        if (state.alert.pagerdutyV2PayloadComponentArgs && state.alert.pagerdutyV2PayloadComponentArgs.length) {
          config.pagerduty_v2_payload_component_args = state.alert.pagerdutyV2PayloadComponentArgs;
        } else if (state.alert.pagerdutyV2PayloadComponent) {
          config.pagerduty_v2_payload_component = state.alert.pagerdutyV2PayloadComponent;
        }

        if (state.alert.pagerdutyV2PayloadGroupArgs && state.alert.pagerdutyV2PayloadGroupArgs.length) {
          config.pagerduty_v2_payload_group_args = state.alert.pagerdutyV2PayloadGroupArgs;
        } else if (state.alert.pagerdutyV2PayloadGroup) {
          config.pagerduty_v2_payload_group = state.alert.pagerdutyV2PayloadGroup;
        }

        if (state.alert.pagerdutyV2PayloadSeverity) {
          config.pagerduty_v2_payload_severity = state.alert.pagerdutyV2PayloadSeverity;
        }

        if (state.alert.pagerdutyV2PayloadSourceArgs && state.alert.pagerdutyV2PayloadSourceArgs.length) {
          config.pagerduty_v2_payload_source_args = state.alert.pagerdutyV2PayloadSourceArgs;
        } else if (state.alert.pagerdutyV2PayloadSource) {
          config.pagerduty_v2_payload_source = state.alert.pagerdutyV2PayloadSource;
        }

        if (state.alert.pagerdutyV2PayloadIncludeAllInfo) {
          config.pagerduty_v2_payload_include_all_info = state.alert.pagerdutyV2PayloadIncludeAllInfo;
        }
      }

      if (state.alert.pagerdutyIgnoreSslErrors) {
        config.pagerduty_ignore_ssl_errors = state.alert.pagerdutyIgnoreSslErrors;
      }

      if (state.alert.pagerdutyCaCerts) {
        config.pagerduty_ca_certs = state.alert.pagerdutyCaCerts;
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

    workwechat(state) {
      let config = {};

      if (state.alert.workWechatBotId) {
        config.work_wechat_bot_id = state.alert.workWechatBotId;
      }

      if (state.alert.workWechatMsgtype) {
        config.work_wechat_msgtype = state.alert.workWechatMsgtype;
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

      if (state.alert.zbxHostFromField) {
        config.zbx_host_from_field = state.alert.zbxHostFromField;
      }

      return config;
    },

    ses(state) {
      let config = {};

      if (state.alert.sesFromAddr) {
        config.ses_from_addr = state.alert.sesFromAddr;
      }

      if (state.alert.sesEmailReplyTo) {
        config.ses_email_reply_to = state.alert.sesEmailReplyTo;
      }

      if (state.alert.sesEmail) {
        if (typeof state.alert.sesEmail === 'string') {
          config.ses_email = state.alert.sesEmail.split(',');
        } else {
          console.warn('Local ses email state is not a string!');
        }
      }

      if (state.alert.sesCc) {
        if (typeof state.alert.sesCc === 'string') {
          config.ses_cc = state.alert.sesCc.split(',');
        } else {
          console.warn('Local ses cc state is not a string!');
        }
      }

      if (state.alert.sesBcc) {
        if (typeof state.alert.sesBcc === 'string') {
          config.ses_bcc = state.alert.sesBcc.split(',');
        } else {
          console.warn('Local ses bcc state is not a string!');
        }
      }

      if (state.alert.sesEmailFromField) {
        config.ses_email_from_field = state.alert.sesEmailFromField;
      }

      if (state.alert.sesEmailAddDomain) {
        config.ses_email_add_domain = state.alert.sesEmailAddDomain;
      }

      if (state.alert.sesAwsProfile) {
        config.ses_aws_profile = state.alert.sesAwsProfile;
      } else {
        if (state.alert.sesAwsAccessKeyId) {
          config.ses_aws_access_key_id = state.alert.sesAwsAccessKeyId;
        }

        if (state.alert.sesAwsSecretAccessKey) {
          config.ses_aws_secret_access_key = state.alert.sesAwsSecretAccessKey;
        }

        if (state.alert.sesAwsRegion) {
          config.ses_aws_region = state.alert.sesAwsRegion;
        }
      }

      return config;
    },

    lark(state) {
      let config = {};

      if (state.alert.larkBotId) {
        config.lark_bot_id = state.alert.larkBotId;
        config.lark_msgtype = state.alert.larkMsgtype;
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

      if (state.alert.failOnNonZeroExit) {
        config.fail_on_non_zero_exit = state.alert.failOnNonZeroExit;
      }

      return config;
    },

    gelf(state) {
      let config = {};

      if (state.alert.gelfType) {
        config.gelf_type = state.alert.gelfType;
      }

      if (state.alert.gelfType === 'http') {
        if (state.alert.gelfEndpoint) {
          config.gelf_endpoint = state.alert.gelfEndpoint;
        }

        if (state.alert.gelfHttpIgnoreSslErrors) {
          config.gelf_http_ignore_ssl_errors = state.alert.gelfHttpIgnoreSslErrors;
        }
      } else {
        if (state.alert.gelfHost) {
          config.gelf_host = state.alert.gelfHost;
        }

        if (state.alert.gelfPort) {
          config.gelf_port = state.alert.gelfPort;
        }
      }

      config.gelf_log_level = state.alert.gelfLogLevel;

      if (state.alert.gelfCaCert) {
        config.gelf_ca_cert = state.alert.gelfCaCert;
      }

      if (state.alert.gelfTimeout) {
        config.gelf_timeout = state.alert.gelfTimeout;
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

    // Description
    description(state) {
      let config = {};

      if (state.alert.useDescription) {
        config.description = state.alert.configDescription;
      }

      return config;
    },

    // scan_entire_timeframe
    scanEntireTimeframe(state) {
      let config = {};

      if (state.alert.scanEntireTimeframe) {
        config.scan_entire_timeframe = state.alert.scanEntireTimeframe;
      }

      return config;
    },

    // Priority
    priority(state) {
      let config = {};

      if (state.alert.usePriority) {
        config.priority = state.alert.configPriority;
      }

      return config;
    },

    // Owner
    owner(state) {
      let config = {};

      if (state.alert.useOwner) {
        config.owner = state.alert.configOwner;
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

      if (state.alert.servicenowImpact) {
        config.servicenow_impact = state.alert.servicenowImpact;
      }

      if (state.alert.servicenowUrgency) {
        config.servicenow_urgency = state.alert.servicenowUrgency;
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

      return config;
    },

    googlechat(state) {
      let config = {};
      if (state.alert.googleChatWebhookUrl && state.alert.googleChatWebhookUrl.length) {
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

      if (state.alert.googleChatProxy) {
        config.googlechat_proxy = state.alert.googleChatProxy;
      }

      return config;
    },

    mattermost(state) {
      let config = {};

      if (state.alert.mattermostWebhookUrl && state.alert.mattermostWebhookUrl.length) {
        config.mattermost_webhook_url = state.alert.mattermostWebhookUrl;
      }

      if (state.alert.mattermostChannelOverride) {
        config.mattermost_channel_override = state.alert.mattermostChannelOverride;
      }

      if (state.alert.mattermostUsernameOverride) {
        config.mattermost_username_override = state.alert.mattermostUsernameOverride;
      }

      if (state.alert.mattermostEmojiOverride) {
        config.mattermost_emoji_override = state.alert.mattermostEmojiOverride;
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

      if (state.alert.mattermostIgnoreSslErrors) {
        config.mattermost_ignore_ssl_errors = state.alert.mattermostIgnoreSslErrors;
      }

      if (state.alert.mattermostProxy) {
        config.mattermost_proxy = state.alert.mattermostProxy;
      }

      if (state.alert.mattermostTitle) {
        config.mattermost_title = state.alert.mattermostTitle;
      }

      if (state.alert.mattermostTitleLink) {
        config.mattermost_title_link = state.alert.mattermostTitleLink;
      }

      if (state.alert.mattermostFooter) {
        config.mattermost_footer = state.alert.mattermostFooter;
      }

      if (state.alert.mattermostFooterIcon) {
        config.mattermost_footer_icon = state.alert.mattermostFooterIcon;
      }

      if (state.alert.mattermostImageUrl) {
        config.mattermost_image_url = state.alert.mattermostImageUrl;
      }

      if (state.alert.mattermostThumbUrl) {
        config.mattermost_thumb_url = state.alert.mattermostThumbUrl;
      }

      if (state.alert.mattermostAuthorName) {
        config.mattermost_author_name = state.alert.mattermostAuthorName;
      }

      if (state.alert.mattermostAuthorLink) {
        config.mattermost_author_link = state.alert.mattermostAuthorLink;
      }

      if (state.alert.mattermostAuthorIcon) {
        config.mattermost_author_icon = state.alert.mattermostAuthorIcon;
      }

      if (state.alert.generateKibanaDiscoverUrl && state.alert.mattermostAttachKibanaDiscoverUrl) {
        config.mattermost_attach_kibana_discover_url = state.alert.mattermostAttachKibanaDiscoverUrl;

        if (state.alert.mattermostKibanaDiscoverColor) {
          config.mattermost_kibana_discover_color = state.alert.mattermostKibanaDiscoverColor;
        }

        if (state.alert.mattermostKibanaDiscoverTitle) {
          config.mattermost_kibana_discover_title = state.alert.mattermostKibanaDiscoverTitle;
        }
      }

      return config;
    },

    matrixhookshot(state) {
      let config = {};

      if (state.alert.matrixhookshotWebhookUrl && state.alert.matrixhookshotWebhookUrl.length) {
        config.matrixhookshot_webhook_url = state.alert.matrixhookshotWebhookUrl;
      }

      if (state.alert.matrixhookshotUsername) {
        config.matrixhookshot_username = state.alert.matrixhookshotUsername;
      }

      if (state.alert.matrixhookshotTimeout) {
        config.matrixhookshot_timeout = state.alert.matrixhookshotTimeout;
      }

      if (state.alert.matrixhookshotText) {
        config.matrixhookshot_text = state.alert.matrixhookshotText;
      }

      if (state.alert.matrixhookshotProxy) {
        config.matrixhookshot_proxy = state.alert.matrixhookshotProxy;
      }

      if (state.alert.matrixhookshotIgnoreSslErrors) {
        config.matrixhookshot_ignore_ssl_errors = state.alert.matrixhookshotIgnoreSslErrors;
      }

      if (state.alert.matrixhookshotCaCerts) {
        config.matrixhookshot_ca_certs = state.alert.matrixhookshotCaCerts;
      }

      return config;
    },

    rocketchat(state) {
      let config = {};

      if (state.alert.rocketChatWebhookUrl && state.alert.rocketChatWebhookUrl.length) {
        config.rocket_chat_webhook_url = state.alert.rocketChatWebhookUrl;
      }

      if (state.alert.rocketChatUsernameOverride) {
        config.rocket_chat_username_override = state.alert.rocketChatUsernameOverride;
      }

      if (state.alert.rocketChatChannelOverride && state.alert.rocketChatChannelOverride.length) {
        config.rocket_chat_channel_override = state.alert.rocketChatChannelOverride;
      }

      if (state.alert.rocketChatEmojiOverride) {
        config.rocket_chat_emoji_override = state.alert.rocketChatEmojiOverride;
      }

      if (state.alert.rocketChatMsgColor) {
        config.rocket_chat_msg_color = state.alert.rocketChatMsgColor;
      }

      if (state.alert.rocketChatTextString) {
        config.rocket_chat_text_string = state.alert.rocketChatTextString;
      }

      if (state.alert.rocketChatProxy) {
        config.rocket_chat_proxy = state.alert.rocketChatProxy;
      }

      if (state.alert.generateKibanaDiscoverUrl && state.alert.rocketChatAttachKibanaDiscoverUrl) {
        config.rocket_chat_attach_kibana_discover_url = state.alert.rocketChatAttachKibanaDiscoverUrl;

        if (state.alert.rocketChatKibanaDiscoverColor) {
          config.rocket_chat_kibana_discover_color = state.alert.rocketChatKibanaDiscoverColor;
        }

        if (state.alert.rocketChatKibanaDiscoverTitle) {
          config.rocket_chat_kibana_discover_title = state.alert.rocketChatKibanaDiscoverTitle;
        }
      }

      if (state.alert.rocketChatIgnoreSslErrors) {
        config.rocket_chat_ignore_ssl_errors = state.alert.rocketChatIgnoreSslErrors;
      }

      if (state.alert.rocketChatCaCerts) {
        config.rocket_chat_ca_certs = state.alert.rocketChatCaCerts;
      }

      if (state.alert.rocketChatTimeout) {
        config.rocket_chat_timeout = state.alert.rocketChatTimeout;
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

      if (state.alert.alertaTimeout) {
        config.alerta_timeout = state.alert.alertaTimeout;
      }

      if (state.alert.alertaUseMatchTimestamp) {
        config.alerta_use_match_timestamp = state.alert.alertaUseMatchTimestamp;
      }

      if (state.alert.alertaUseQkAsResource) {
        config.alerta_use_qk_as_resource = state.alert.alertaUseQkAsResource;
      }

      if (state.alert.alertaApiSkipSsl) {
        config.alerta_api_skip_ssl = state.alert.alertaApiSkipSsl;
      }

      if (state.alert.alertaOrigin) {
        config.alerta_origin = state.alert.alertaOrigin;
      }

      if (state.alert.alertaValue) {
        config.alerta_value = state.alert.alertaValue;
      }

      if (state.alert.alertaType) {
        config.alerta_type = state.alert.alertaType;
      }

      if (state.alert.alertaService && state.alert.alertaService.length) {
        config.alerta_service = state.alert.alertaService;
      }

      if (state.alert.alertaCorrelate && state.alert.alertaCorrelate.length) {
        config.alerta_correlate = state.alert.alertaCorrelate;
      }

      if (state.alert.alertaAttributesKeys && state.alert.alertaAttributesKeys.length) {
        config.alerta_attributes_keys = state.alert.alertaAttributesKeys;
      }

      if (state.alert.alertaAttributesValues && state.alert.alertaAttributesValues.length) {
        config.alerta_attributes_values = state.alert.alertaAttributesValues;
      }

      return config;
    },

    alertmanager(state) {
      let config = {};

      if (state.alert.alertmanagerAlertSubjectLabelname) {
        config.alertmanager_alert_subject_labelname = state.alert.alertmanagerAlertSubjectLabelname;
      }

      if (state.alert.alertmanagerAlertTextLabelname) {
        config.alertmanager_alert_text_labelname = state.alert.alertmanagerAlertTextLabelname;
      }

      if (state.alert.alertmanagerProxy) {
        config.alertmanager_proxy = state.alert.alertmanagerProxy;
      }

      if (state.alert.alertmanagerBasicAuthLogin) {
        config.alertmanager_basic_auth_login = state.alert.alertmanagerBasicAuthLogin;
      }

      if (state.alert.alertmanagerBasicAuthPassword) {
        config.alertmanager_basic_auth_password = state.alert.alertmanagerBasicAuthPassword;
      }

      if (state.alert.alertmanagerCaCerts) {
        config.alertmanager_ca_certs = state.alert.alertmanagerCaCerts;
      }

      if (state.alert.alertmanagerIgnoreSslErrors) {
        config.alertmanager_ignore_ssl_errors = state.alert.alertmanagerIgnoreSslErrors;
      }

      if (state.alert.alertmanagerTimeout) {
        config.alertmanager_timeout = state.alert.alertmanagerTimeout;
      }

      return config;
    },

    dingtalk(state) {
      let config = {};

      if (state.alert.dingtalkAccessToken) {
        config.dingtalk_access_token = state.alert.dingtalkAccessToken;
      }

      if (state.alert.dingtalkMsgtype) {
        config.dingtalk_msgtype = state.alert.dingtalkMsgtype;

        if (state.alert.dingtalkMsgtype === 'single_action_card') {
          if (state.alert.dingtalkSingleTitle) {
            config.dingtalk_single_title = state.alert.dingtalkSingleTitle;
          }
          if (state.alert.dingtalkSingleUrl) {
            config.dingtalk_single_url = state.alert.dingtalkSingleUrl;
          }
        } else if (state.alert.dingtalkMsgtype === 'action_card') {
          if (state.alert.dingtalkBtnOrientation) {
            config.dingtalk_btn_orientation = state.alert.dingtalkBtnOrientation;
          }
        }
      }

      if (state.alert.dingtalkProxy) {
        config.dingtalk_proxy = state.alert.dingtalkProxy;
      }

      if (state.alert.dingtalkProxyLogin && state.alert.dingtalkProxyPass) {
        config.dingtalk_proxy_login = state.alert.dingtalkProxyLogin;
        config.dingtalk_proxy_pass = state.alert.dingtalkProxy;
      }

      if (state.alert.dingtalkSign) {
        config.dingtalk_sign = state.alert.dingtalkSign;
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

      if (state.alert.alert.includes('alerta')) {
        config = { ...config, ...getters.alerta };
      }

      if (state.alert.alert.includes('alertmanager')) {
        config = { ...config, ...getters.alertmanager };
      }

      if (state.alert.alert.includes('chatwork')) {
        config = { ...config, ...getters.chatwork };
      }

      if (state.alert.alert.includes('command')) {
        config = { ...config, ...getters.command };
      }

      if (state.alert.alert.includes('datadog')) {
        config = { ...config, ...getters.datadog };
      }

      if (state.alert.alert.includes('dingtalk')) {
        config = { ...config, ...getters.dingtalk };
      }

      if (state.alert.alert.includes('discord')) {
        config = { ...config, ...getters.discord };
      }

      if (state.alert.alert.includes('email')) {
        config = { ...config, ...getters.email };
      }

      if (state.alert.alert.includes('exotel')) {
        config = { ...config, ...getters.exotel };
      }

      if (state.alert.alert.includes('gelf')) {
        config = { ...config, ...getters.gelf };
      }

      if (state.alert.alert.includes('gitter')) {
        config = { ...config, ...getters.gitter };
      }

      if (state.alert.alert.includes('googlechat')) {
        config = { ...config, ...getters.googlechat };
      }

      if (state.alert.alert.includes('hivealerter')) {
        config = { ...config, ...getters.hivealerter };
      }

      if (state.alert.alert.includes('jira')) {
        config = { ...config, ...getters.jira };
      }

      if (state.alert.alert.includes('lark')) {
        config = { ...config, ...getters.lark };
      }

      if (state.alert.alert.includes('mattermost')) {
        config = { ...config, ...getters.mattermost };
      }

      if (state.alert.alert.includes('matrixhookshot')) {
        config = { ...config, ...getters.matrixhookshot };
      }

      if (state.alert.alert.includes('ms_power_automate')) {
        config = { ...config, ...getters.ms_power_automate };
      }

      if (state.alert.alert.includes('opsgenie')) {
        config = { ...config, ...getters.opsgenie };
      }

      if (state.alert.alert.includes('pagerduty')) {
        config = { ...config, ...getters.pagerduty };
      }

      if (state.alert.alert.includes('pagertree')) {
        config = { ...config, ...getters.pagertree };
      }

      if (state.alert.alert.includes('post')) {
        config = { ...config, ...getters.http };
      }

      if (state.alert.alert.includes('post2')) {
        config = { ...config, ...getters.http2 };
      }

      if (state.alert.alert.includes('iris')) {
        config = { ...config, ...getters.iris };
      }

      if (state.alert.alert.includes('rocketchat')) {
        config = { ...config, ...getters.rocketchat };
      }

      if (state.alert.alert.includes('ses')) {
        config = { ...config, ...getters.ses };
      }

      if (state.alert.alert.includes('servicenow')) {
        config = { ...config, ...getters.servicenow };
      }

      if (state.alert.alert.includes('slack')) {
        config = { ...config, ...getters.slack };
      }

      if (state.alert.alert.includes('sns')) {
        config = { ...config, ...getters.sns };
      }

      if (state.alert.alert.includes('stomp')) {
        config = { ...config, ...getters.stomp };
      }

      if (state.alert.alert.includes('telegram')) {
        config = { ...config, ...getters.telegram };
      }

      if (state.alert.alert.includes('tencent_sms')) {
        config = { ...config, ...getters.tencentsms };
      }

      if (state.alert.alert.includes('twilio')) {
        config = { ...config, ...getters.twilio };
      }

      if (state.alert.alert.includes('victorops')) {
        config = { ...config, ...getters.victorops };
      }

      if (state.alert.alert.includes('zabbix')) {
        config = { ...config, ...getters.zabbix };
      }

      if (state.alert.alert.includes('workwechat')) {
        config = { ...config, ...getters.workwechat };
      }

      if (state.alert.alert.includes('alerta')
        || state.alert.alert.includes('alertmanager')
        || state.alert.alert.includes('chatwork')
        || state.alert.alert.includes('datadog')
        || state.alert.alert.includes('dingtalk')
        || state.alert.alert.includes('discord')
        || state.alert.alert.includes('email')
        || state.alert.alert.includes('gelf')
        || state.alert.alert.includes('gitter')
        || state.alert.alert.includes('googlechat')
        || state.alert.alert.includes('hivealerter')
        || state.alert.alert.includes('iris')
        || state.alert.alert.includes('jira')
        || state.alert.alert.includes('lark')
        || state.alert.alert.includes('mattermost')
        || state.alert.alert.includes('matrixhookshot')
        || state.alert.alert.includes('ms_power_automate')
        || state.alert.alert.includes('opsgenie')
        || state.alert.alert.includes('pagerduty')
        || state.alert.alert.includes('pagertree')
        || state.alert.alert.includes('rocketchat')
        || state.alert.alert.includes('servicenow')
        || state.alert.alert.includes('ses')
        || state.alert.alert.includes('slack')
        || state.alert.alert.includes('sns')
        || state.alert.alert.includes('stomp')
        || state.alert.alert.includes('telegram')
        || state.alert.alert.includes('tencent_sms')
        || state.alert.alert.includes('workwechat')
        || state.alert.alert.includes('victorops')) {
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

      config = { ...config, ...getters.description };

      config = { ...config, ...getters.priority };

      config = { ...config, ...getters.owner };

      config = { ...config, ...getters.scanEntireTimeframe };

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
