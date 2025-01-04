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
    alertSubjectArgs: [],
    alertTextArgs: [],

    /* Description */
    useDescription: false,
    configDescription: '',

    /* Kibana Discover */
    generateKibanaDiscoverUrl: false,
    kibanaDiscoverAppUrl: '',
    kibanaDiscoverVersion: '',
    kibanaDiscoverIndexPatternId: '',
    kibanaDiscoverColumns: [],
    kibanaDiscoverFromTimedelta: { minutes: 10 },
    kibanaDiscoverToTimedelta: { minutes: 10 },

    /* limitExcecution */
    limitExcecution: '',

    /* Owner */
    useOwner: false,
    configOwner: '',

    /* Priority */
    usePriority: false,
    configPriority: '',

    /* scanEntireTimeframe */
    scanEntireTimeframe: false,

    /* time_window_change */
    useTimeWindow: false,
    timeWindowStartTime: '',
    timeWindowEndTime: '',
    timeWindowDropIf: '',

    /* Alerta */
    alertaApiUrl: '',
    alertaApiKey: '',
    alertaSeverity: 'warning',
    alertaResource: 'elastalert',
    alertaText: 'elastalert',
    alertaEvent: 'elastalert',
    alertaGroup: '',
    alertaTags: [],
    alertaEnvironment: 'Production',
    alertaTimeout: 84600,
    alertaUseMatchTimestamp: false,
    alertaUseQkAsResource: false,
    alertaApiSkipSsl: false,
    alertaOrigin: 'elastalert',
    alertaValue: '',
    alertaType: 'elastalert',
    alertaService: [],
    alertaCorrelate: [],
    alertaAttributesKeys: [],
    alertaAttributesValues: [],

    /* Alertmanager */
    alertmanagerAlertSubjectLabelname: 'summary',
    alertmanagerAlertTextLabelname: 'description',
    alertmanagerProxy: '',
    alertmanagerBasicAuthLogin: '',
    alertmanagerBasicAuthPassword: '',
    alertmanagerCaCerts: false,
    alertmanagerIgnoreSslErrors: false,
    alertmanagerTimeout: 10,

    /* Amazon SNS */
    snsTopicArn: '',
    snsAwsAccessKeyId: '',
    snsAwsSecretAccessKey: '',
    snsAwsRegion: '',
    snsAwsProfile: '',

    /* Amazon SES */
    sesFromAddr: '',
    sesEmailReplyTo: '',
    sesEmail: '',
    sesCc: '',
    sesBcc: '',
    sesEmailFromField: '',
    sesEmailAddDomain: '',
    sesAwsAccessKeyId: '',
    sesAwsSecretAccessKey: '',
    sesAwsRegion: '',
    sesAwsProfile: '',

    /* Chatwork */
    chatworkApikey: '',
    chatworkRoomId: '',
    chatworkProxy: '',
    chatworkProxyLogin: '',
    chatworkProxyPass: '',

    /* Command */
    command: [],
    pipeMatchJson: false,
    pipeAlertText: false,
    failOnNonZeroExit: false,

    /* Discord */
    discordWebhookUrl: '',
    discordEmojiTitle: '',
    discordEmbedFooter: '',
    discordEmbedIconUrl: '',
    discordProxy: '',
    discordProxyLogin: '',
    discordProxyPassword: '',

    /* Dingtalk */
    dingtalkAccessToken: '',
    dingtalkMsgtype: '',
    dingtalkSingleTitle: '',
    dingtalkSingleUrl: '',
    dingtalkBtnOrientation: '0',
    dingtalkSign: '',

    /* Datadog */
    datadogApiKey: '',
    datadogAppKey: '',

    /* Email */
    fromAddr: '',
    replyTo: '',
    email: '',
    cc: '',
    bcc: '',
    smtpSsl: false,
    smtpHost: '',
    smtpPort: 25,
    smtpAuthFile: '',
    smtpKeyFile: '',
    smtpCertFile: '',
    emailFromField: '',
    emailAddDomain: '',

    /* Exotel */
    exotelAccountSid: '',
    exotelAuthToken: '',
    exotelToNumber: '',
    exotelFromNumber: '',
    exotelMessageBody: '',

    /* Gelf */
    gelfType: '',
    gelfEndpoint: '',
    gelfHttpIgnoreSslErrors: false,
    gelfHost: '',
    gelfPort: '',
    gelfLogLevel: '5',
    gelfCaCert: '',
    gelfTimeout: 30,

    /* Gitter */
    gitterWebhookUrl: '',
    gitterMsgLevel: 'error',
    gitterProxy: '',

    /* GoogleChat */
    googleChatWebhookUrl: [],
    googleChatFormat: 'basic',
    googleChatHeaderTitle: '',
    googleChatHeaderSubtitle: '',
    googleChatHeaderImage: '',
    googleFooterKibanalink: '',
    googleChatProxy: '',

    /* HTTP POST */
    httpPostUrl: [],
    httpPostIgnoreSslErrors: false,
    httpPostCaCerts: false,
    httpPostTimeout: '',
    httpPostProxy: '',

    /* HTTP POST 2 */
    httpPost2Url: [],
    httpPost2IgnoreSslErrors: false,
    httpPost2CaCerts: false,
    httpPost2Timeout: '',
    httpPost2Proxy: '',

    /* IRIS */
    irisHost: '',
    irisApiToken: '',
    irisCustomerId: 0,
    irisIgnoreSslErrors: false,
    irisCaCert: false,
    irisDescription: '',
    irisOverwriteTimestamp: false,
    irisType: 'alert',
    irisCaseTemplateId: 0,
    irisAlertNote: '',
    irisAlertTags: '',
    irisAlertStatusId: 0,
    irisAlertSourceLink: '',
    irisAlertSeverityId: 0,

    /* Jira */
    jiraProject: '',
    jiraIssueType: '',
    jiraComponents: '',

    /* Lark */
    larkBotId: '',
    larkMsgtype: 'text',

    /* Mattermost */
    mattermostWebhookUrl: [],
    mattermostChannelOverride: [],
    mattermostUsernameOverride: 'Praeco',
    mattermostEmojiOverride: ':ghost:',
    mattermostMsgColor: 'danger',
    mattermostIconUrlOverride: '',
    mattermostMsgPretext: '',
    mattermostIgnoreSslErrors: false,
    mattermostProxy: '',
    mattermostTitle: '',
    mattermostTitleLink: '',
    mattermostFooter: '',
    mattermostFooterIcon: '',
    mattermostImageUrl: '',
    mattermostThumbUrl: '',
    mattermostAuthorName: '',
    mattermostAuthorLink: '',
    mattermostAuthorIcon: '',
    mattermostAttachKibanaDiscoverUrl: false,
    mattermostKibanaDiscoverColor: '#ec4b98',
    mattermostKibanaDiscoverTitle: 'Discover in Kibana',

    /* Matrix Hookshot */
    matrixhookshotWebhookUrl: [],
    matrixhookshotUsername: '',
    matrixhookshotTimeout: 0,
    matrixhookshotText: '',
    matrixhookshotProxy: '',
    matrixhookshotIgnoreSslErrors: false,
    matrixhookshotCaCerts: false,

    /* MS Power Automate */
    msPowerAutomateWebhookUrl: [],
    msPowerAutomateAlertSummary: '',
    msPowerAutomateTeamsCardWidthFull: false,
    msPowerAutomateProxy: '',
    msPowerAutomateIgnoreSslErrors: false,
    msPowerAutomateCaCerts: false,
    msPowerAutomateAttachKibanaDiscoverUrl: false,
    msPowerAutomateKibanaDiscoverTitle: 'Discover in Kibana',
    msPowerAutomateKibanaDiscoverColor: 'default',
    msPowerAutomateSummaryTextSize: 'large',
    msPowerAutomateBodyTextSize: '',

    /* OpsGenie */
    opsgenieKey: '',
    opsgenieAccount: '',
    opsgenieMessage: '',
    opsgenieSubject: '',
    opsgenieAlias: '',
    opsgenieProxy: '',
    opsgenieDescription: '',
    opsgeniePriority: '',

    /* PagerDuty */
    pagerdutyServiceKey: '',
    pagerdutyClientName: '',
    pagerdutyEventType: 'trigger',
    pagerdutyIncidentKey: '',
    pagerdutyIncidentKeyArgs: [],
    pagerdutyProxy: '',
    pagerdutyApiVersion: 'v1',
    pagerdutyV2PayloadClass: '',
    pagerdutyV2PayloadClassArgs: [],
    pagerdutyV2PayloadComponent: '',
    pagerdutyV2PayloadComponentArgs: [],
    pagerdutyV2PayloadGroup: '',
    pagerdutyV2PayloadGroupArgs: [],
    pagerdutyV2PayloadSeverity: 'critical',
    pagerdutyV2PayloadSource: 'ElastAlert',
    pagerdutyV2PayloadSourceArgs: [],
    pagerdutyV2PayloadIncludeAllInfo: false,
    pagerdutyIgnoreSslErrors: false,
    pagerdutyCaCerts: false,

    /* PagerTree */
    pagertreeIntegrationUrl: '',
    pagertreeProxy: '',

    /* Rocket.Chat */
    rocketChatWebhookUrl: [],
    rocketChatChannelOverride: [],
    rocketChatUsernameOverride: 'Praeco',
    rocketChatEmojiOverride: ':ghost:',
    rocketChatMsgColor: 'danger',
    rocketChatTextString: '',
    rocketChatProxy: '',
    rocketChatAttachKibanaDiscoverUrl: false,
    rocketChatKibanaDiscoverColor: '#ec4b98',
    rocketChatKibanaDiscoverTitle: 'Discover in Kibana',
    rocketChatIgnoreSslErrors: false,
    rocketChatCaCerts: false,
    rocketChatTimeout: 10,

    /* Slack */
    slackWebhookUrl: [],
    slackChannelOverride: [],
    slackUsernameOverride: 'Praeco',
    slackEmojiOverride: ':ghost:',
    slackMsgColor: 'danger',
    slackParseOverride: 'none',
    slackTextString: '',
    slackIgnoreSslErrors: false,
    slackCaCerts: false,
    slackIconUrlOverride: '',
    slackTimeout: 10,
    slackAttachKibanaDiscoverUrl: false,
    slackKibanaDiscoverColor: '#ec4b98',
    slackKibanaDiscoverTitle: 'Discover in Kibana',
    slackProxy: '',
    slackFooter: '',
    slackFooterIcon: '',
    slackImageUrl: '',
    slackThumbUrl: '',
    slackAuthorName: '',
    slackAuthorLink: '',
    slackAuthorIcon: '',
    slackMsgPretext: '',
    slackAttachJiraTicketUrl: false,
    slackJiraTicketColor: '#ec4b98',
    slackJiraTicketTitle: 'Jira Ticket',

    /* ServiceNow */
    serviceNowUsername: '',
    serviceNowPassword: '',
    servicenowRestUrl: '',
    servicenowShortDescription: '',
    servicenowComments: '',
    servicenowAssignmentGroup: '',
    servicenowCategory: '',
    servicenowSubcategory: '',
    servicenowCmdbCi: '',
    servicenowCallerId: '',
    servicenowProxy: '',
    servicenowImpact: 1,
    servicenowUrgency: 1,

    /* Stomp */
    stompHostname: '',
    stompHostport: '',
    stompLogin: '',
    stompPassword: '',
    stompDestination: '',

    /* Telegram */
    telegramRoomId: '',
    telegramProxy: '',
    telegramProxyLogin: '',
    telegramProxyPass: '',
    telegramParseMode: 'markdown',
    telegramThreadId: '',

    /* Tencent SMS */
    tencentSmsSecretId: '',
    tencentSmsSecretKey: '',
    tencentSmsSdkAppid: '',
    tencentSmsToNumber: [],
    tencentSmsRegion: '',
    tencentSmsSignName: '',
    tencentSmsTemplateId: '',
    tencentSmsTemplateParm: [],

    /* TheHive */
    hiveAlertConfigTitle: '',
    hiveAlertConfigType: '',
    hiveAlertConfigSource: '',
    hiveAlertConfigDescription: '',
    hiveAlertConfigSeverity: 2,
    hiveAlertConfigTags: [],
    hiveAlertConfigTlp: 2,
    hiveAlertConfigStatus: 'Waiting',
    hiveAlertConfigFollow: false,

    /* Twilio */
    twilioAccountSid: '',
    twilioAuth: '',
    twilioToNumber: '',
    twilioFromNumber: '',
    twilioMessageServiceSid: '',

    /* VictorOps */
    victoropsApiKey: '',
    victoropsRoutingKey: '',
    victoropsMessageType: '',
    victoropsEntityId: '',
    victoropsEntityDisplayName: '',
    victoropsProxy: '',

    /* WorkWechat */
    workWechatBotId: '',
    workWechatMsgtype: 'text',

    /* Zabbix */
    zbxSenderHost: 'localhost',
    zbxSenderPort: 10051,
    zbxHost: '',
    zbxKey: '',
    zbxHostFromField: false
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
      state = Object.assign(state, initialState()); // eslint-disable-line no-unused-vars
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

    UPDATE_ALERT_SUBJECT_ARGS(state, alertSubjectArgs) {
      state.alertSubjectArgs = alertSubjectArgs;
    },

    ADD_ALERT_SUBJECT_ARGS_ENTRY(state) {
      state.alertSubjectArgs.push('');
    },

    ADD_ALERT_SUBJECT_ARGS_ENTRY_VALUE(state, value) {
      state.alertSubjectArgs.push(value);
    },

    REMOVE_ALERT_SUBJECT_ARGS_ENTRY(state, entry) {
      state.alertSubjectArgs = state.alertSubjectArgs.filter(b => b !== entry);
    },

    UPDATE_ALERT_SUBJECT_ARGS_ENTRY(state, { entry, index }) {
      if (!state.alertSubjectArgs) return;
      state.alertSubjectArgs[index] = entry;
    },

    UPDATE_ALERT_TEXT_ARGS(state, alertTextArgs) {
      state.alertTextArgs = alertTextArgs;
    },

    ADD_ALERT_TEXT_ARGS_ENTRY(state) {
      state.alertTextArgs.push('');
    },

    ADD_ALERT_TEXT_ARGS_ENTRY_VALUE(state, value) {
      state.alertTextArgs.push(value);
    },

    REMOVE_ALERT_TEXT_ARGS_ENTRY(state, entry) {
      state.alertTextArgs = state.alertTextArgs.filter(b => b !== entry);
    },

    UPDATE_ALERT_TEXT_ARGS_ENTRY(state, { entry, index }) {
      if (!state.alertTextArgs) return;
      state.alertTextArgs[index] = entry;
    },

    UPDATE_ALERT(state, alert) {
      state.alert = alert;
    },

    /* Description */
    UPDATE_USE_DESCRIPTION(state, useDescription) {
      state.useDescription = useDescription;
    },

    UPDATE_DESCRIPTION(state, configDescription) {
      state.configDescription = configDescription;
    },

    /* Kibana Discover */
    UPDATE_GENERATE_KIBANA_DISCOVER_URL(state, generateKibanaDiscoverUrl) {
      state.generateKibanaDiscoverUrl = generateKibanaDiscoverUrl;
    },

    UPDATE_KIBANA_DISCOVER_APP_URL(state, kibanaDiscoverAppUrl) {
      state.kibanaDiscoverAppUrl = kibanaDiscoverAppUrl;
    },

    UPDATE_KIBANA_DISCOVER_VERSION(state, kibanaDiscoverVersion) {
      state.kibanaDiscoverVersion = kibanaDiscoverVersion;
    },

    UPDATE_KIBANA_DISCOVER_INDEX_PATTERN_ID(state, kibanaDiscoverIndexPatternId) {
      state.kibanaDiscoverIndexPatternId = kibanaDiscoverIndexPatternId;
    },

    UPDATE_KIBANA_DISCOVER_FROM_TIMEDELTA(state, kibanaDiscoverFromTimedelta) {
      state.kibanaDiscoverFromTimedelta = kibanaDiscoverFromTimedelta;
    },

    UPDATE_KIBANA_DISCOVER_TO_TIMEDELTA(state, kibanaDiscoverToTimedelta) {
      state.kibanaDiscoverToTimedelta = kibanaDiscoverToTimedelta;
    },

    UPDATE_KIBANA_DISCOVER_COLUMNS(state, kibanaDiscoverColumns) {
      state.kibanaDiscoverColumns = kibanaDiscoverColumns;
    },

    ADD_KIBANA_DISCOVER_COLUMNS_ENTRY(state) {
      state.kibanaDiscoverColumns.push('');
    },

    ADD_KIBANA_DISCOVER_COLUMNS_ENTRY_VALUE(state, value) {
      state.kibanaDiscoverColumns.push(value);
    },

    REMOVE_KIBANA_DISCOVER_COLUMNS_ENTRY(state, entry) {
      state.kibanaDiscoverColumns = state.kibanaDiscoverColumns.filter(b => b !== entry);
    },

    UPDATE_KIBANA_DISCOVER_COLUMNS_ENTRY(state, { entry, index }) {
      if (!state.kibanaDiscoverColumns) return;
      state.kibanaDiscoverColumns[index] = entry;
    },

    /* limitExcecution */
    UPDATE_LIMIT_EXCECUTION(state, limitExcecution) {
      state.limitExcecution = limitExcecution;
    },

    /* Owner */
    UPDATE_USE_OWNER(state, useOwner) {
      state.useOwner = useOwner;
    },

    UPDATE_OWNER(state, configOwner) {
      state.configOwner = configOwner;
    },

    /* Priority */
    UPDATE_USE_PRIORITY(state, usePriority) {
      state.usePriority = usePriority;
    },

    UPDATE_PRIORITY(state, configPriority) {
      state.configPriority = configPriority;
    },

    /* scan_entire_timeframe */
    UPDATE_SCAN_ENTIRE_TIMEFRAME(state, scanEntireTimeframe) {
      state.scanEntireTimeframe = scanEntireTimeframe;
    },

    /* time_window_change */
    UPDATE_USE_TIME_WINDOW(state, useTimeWindow) {
      state.useTimeWindow = useTimeWindow;
    },
    UPDATE_TIME_WINDOW_START_TIME(state, timeWindowStartTime) {
      state.timeWindowStartTime = timeWindowStartTime;
    },
    UPDATE_TIME_WINDOW_END_TIME(state, timeWindowEndTime) {
      state.timeWindowEndTime = timeWindowEndTime;
    },
    UPDATE_TIME_WINDOW_DROP_IF(state, timeWindowDropIf) {
      state.timeWindowDropIf = timeWindowDropIf;
    },

    /* Alerta */
    UPDATE_ALERTA_API_URL(state, alertaApiUrl) {
      state.alertaApiUrl = alertaApiUrl;
    },

    UPDATE_ALERTA_API_KEY(state, alertaApiKey) {
      state.alertaApiKey = alertaApiKey;
    },

    UPDATE_ALERTA_SEVERITY(state, alertaSeverity) {
      state.alertaSeverity = alertaSeverity;
    },

    UPDATE_ALERTA_RESOURCE(state, alertaResource) {
      state.alertaResource = alertaResource;
    },

    UPDATE_ALERTA_TEXT(state, alertaText) {
      state.alertaText = alertaText;
    },

    UPDATE_ALERTA_EVENT(state, alertaEvent) {
      state.alertaEvent = alertaEvent;
    },

    UPDATE_ALERTA_GROUP(state, alertaGroup) {
      state.alertaGroup = alertaGroup;
    },

    UPDATE_ALERTA_TAGS(state, alertaTags) {
      state.alertaTags = alertaTags;
    },

    ADD_ALERTA_TAGS_ENTRY(state) {
      state.alertaTags.push('');
    },

    ADD_ALERTA_TAGS_ENTRY_VALUE(state, value) {
      state.alertaTags.push(value);
    },

    REMOVE_ALERTA_TAGS_ENTRY(state, entry) {
      state.alertaTags = state.alertaTags.filter(b => b !== entry);
    },

    UPDATE_ALERTA_TAGS_ENTRY(state, { entry, index }) {
      if (!state.alertaTags) return;
      state.alertaTags[index] = entry;
    },

    UPDATE_ALERTA_ENVIRONMENT(state, alertaEnvironment) {
      state.alertaEnvironment = alertaEnvironment;
    },

    UPDATE_ALERTA_TIMEOUT(state, alertaTimeout) {
      state.alertaTimeout = alertaTimeout;
    },

    UPDATE_ALERTA_USE_MATCH_TIMESTAMP(state, alertaUseMatchTimestamp) {
      state.alertaUseMatchTimestamp = alertaUseMatchTimestamp;
    },

    UPDATE_ALERTA_USE_QK_AS_RESOURCE(state, alertaUseQkAsResource) {
      state.alertaUseQkAsResource = alertaUseQkAsResource;
    },

    UPDATE_ALERTA_API_SKIP_SSL(state, alertaApiSkipSsl) {
      state.alertaApiSkipSsl = alertaApiSkipSsl;
    },

    UPDATE_ALERTA_ORIGIN(state, alertaOrigin) {
      state.alertaOrigin = alertaOrigin;
    },

    UPDATE_ALERTA_VALUE(state, alertaValue) {
      state.alertaValue = alertaValue;
    },

    UPDATE_ALERTA_TYPE(state, alertaType) {
      state.alertaType = alertaType;
    },

    UPDATE_ALERTA_SERVICE(state, alertaService) {
      state.alertaService = alertaService;
    },

    ADD_ALERTA_SERVICE_ENTRY(state) {
      state.alertaService.push('');
    },

    ADD_ALERTA_SERVICE_ENTRY_VALUE(state, value) {
      state.alertaService.push(value);
    },

    REMOVE_ALERTA_SERVICE_ENTRY(state, entry) {
      state.alertaService = state.alertaService.filter(b => b !== entry);
    },

    UPDATE_ALERTA_SERVICE_ENTRY(state, { entry, index }) {
      if (!state.alertaService) return;
      state.alertaService[index] = entry;
    },

    UPDATE_ALERTA_CORRELATE(state, alertaCorrelate) {
      state.alertaCorrelate = alertaCorrelate;
    },

    ADD_ALERTA_CORRELATE_ENTRY(state) {
      state.alertaCorrelate.push('');
    },

    ADD_ALERTA_CORRELATE_ENTRY_VALUE(state, value) {
      state.alertaCorrelate.push(value);
    },

    REMOVE_ALERTA_CORRELATE_ENTRY(state, entry) {
      state.alertaCorrelate = state.alertaCorrelate.filter(b => b !== entry);
    },

    UPDATE_ALERTA_CORRELATE_ENTRY(state, { entry, index }) {
      if (!state.alertaCorrelate) return;
      state.alertaCorrelate[index] = entry;
    },

    UPDATE_ALERTA_ATTRIBUTES_KEYS(state, alertaAttributesKeys) {
      state.alertaAttributesKeys = alertaAttributesKeys;
    },

    ADD_ALERTA_ATTRIBUTES_KEYS_ENTRY(state) {
      state.alertaAttributesKeys.push('');
    },

    ADD_ALERTA_ATTRIBUTES_KEYS_ENTRY_VALUE(state, value) {
      state.alertaAttributesKeys.push(value);
    },

    REMOVE_ALERTA_ATTRIBUTES_KEYS_ENTRY(state, entry) {
      state.alertaAttributesKeys = state.alertaAttributesKeys.filter(b => b !== entry);
    },

    UPDATE_ALERTA_ATTRIBUTES_KEYS_ENTRY(state, { entry, index }) {
      if (!state.alertaAttributesKeys) return;
      state.alertaAttributesKeys[index] = entry;
    },

    UPDATE_ALERTA_ATTRIBUTES_VALUES(state, alertaAttributesValues) {
      state.alertaAttributesValues = alertaAttributesValues;
    },

    ADD_ALERTA_ATTRIBUTES_VALUES_ENTRY(state) {
      state.alertaAttributesValues.push('');
    },

    ADD_ALERTA_ATTRIBUTES_VALUES_ENTRY_VALUE(state, value) {
      state.alertaAttributesValues.push(value);
    },

    REMOVE_ALERTA_ATTRIBUTES_VALUES_ENTRY(state, entry) {
      state.alertaAttributesValues = state.alertaAttributesValues.filter(b => b !== entry);
    },

    UPDATE_ALERTA_ATTRIBUTES_VALUES_ENTRY(state, { entry, index }) {
      if (!state.alertaAttributesValues) return;
      state.alertaAttributesValues[index] = entry;
    },

    /* Alertmanager */
    UPDATE_ALERTMANAGER_ALERT_SUBJECT_LABELNAME(state, alertmanagerAlertSubjectLabelname) {
      state.alertmanagerAlertSubjectLabelname = alertmanagerAlertSubjectLabelname;
    },

    UPDATE_ALERTMANAGER_ALERT_TEXT_LABELNAME(state, alertmanagerAlertTextLabelname) {
      state.alertmanagerAlertTextLabelname = alertmanagerAlertTextLabelname;
    },

    UPDATE_ALERTMANAGER_PROXY(state, alertmanagerProxy) {
      state.alertmanagerProxy = alertmanagerProxy;
    },

    UPDATE_ALERTMANAGER_BASIC_AUTH_LOGIN(state, alertmanagerBasicAuthLogin) {
      state.alertmanagerBasicAuthLogin = alertmanagerBasicAuthLogin;
    },

    UPDATE_ALERTMANAGER_BASIC_AUTH_PASSWORD(state, alertmanagerBasicAuthPassword) {
      state.alertmanagerBasicAuthPassword = alertmanagerBasicAuthPassword;
    },

    UPDATE_ALERTMANAGER_CA_CERTS(state, alertmanagerCaCerts) {
      state.alertmanagerCaCerts = alertmanagerCaCerts;
    },

    UPDATE_ALERTMANAGER_IGNORE_SSL_ERRORS(state, alertmanagerIgnoreSslErrors) {
      state.alertmanagerIgnoreSslErrors = alertmanagerIgnoreSslErrors;
    },

    UPDATE_ALERTMANAGER_TIMEOUT(state, alertmanagerTimeout) {
      state.alertmanagerTimeout = alertmanagerTimeout;
    },

    /* Amazon SNS */
    UPDATE_SNS_TOPIC_ARN(state, snsTopicArn) {
      state.snsTopicArn = snsTopicArn;
    },

    UPDATE_SNS_AWS_ACCESS_KEY_ID(state, snsAwsAccessKeyId) {
      state.snsAwsAccessKeyId = snsAwsAccessKeyId;
    },

    UPDATE_SNS_AWS_SECRET_ACCESS_KEY(state, snsAwsSecretAccessKey) {
      state.snsAwsSecretAccessKey = snsAwsSecretAccessKey;
    },

    UPDATE_SNS_AWS_REGION(state, snsAwsRegion) {
      state.snsAwsRegion = snsAwsRegion;
    },

    UPDATE_SNS_AWS_PROFILE(state, snsAwsProfile) {
      state.snsAwsProfile = snsAwsProfile;
    },

    /* Amazon SES */
    UPDATE_SES_FROM_ADDR(state, sesFromAddr) {
      state.sesFromAddr = sesFromAddr;
    },

    UPDATE_SES_EMAIL_REPLY_TO(state, sesEmailReplyTo) {
      state.sesEmailReplyTo = sesEmailReplyTo;
    },

    UPDATE_SES_EMAIL(state, sesEmail) {
      state.sesEmail = sesEmail;
    },

    UPDATE_SES_CC(state, sesCc) {
      state.sesCc = sesCc;
    },

    UPDATE_SES_BCC(state, sesBcc) {
      state.sesBcc = sesBcc;
    },

    UPDATE_SES_EMAIL_FROM_FIELD(state, sesEmailFromField) {
      state.sesEmailFromField = sesEmailFromField;
    },

    UPDATE_SES_EMAIL_ADD_DOMAIN(state, sesEmailAddDomain) {
      state.sesEmailAddDomain = sesEmailAddDomain;
    },

    UPDATE_SES_AWS_ACCESS_KEY_ID(state, sesAwsAccessKeyId) {
      state.sesAwsAccessKeyId = sesAwsAccessKeyId;
    },

    UPDATE_SES_AWS_SECRET_ACCESS_KEY(state, sesAwsSecretAccessKey) {
      state.sesAwsSecretAccessKey = sesAwsSecretAccessKey;
    },

    UPDATE_SES_AWS_REGION(state, sesAwsRegion) {
      state.sesAwsRegion = sesAwsRegion;
    },

    UPDATE_SES_AWS_PROFILE(state, sesAwsProfile) {
      state.sesAwsProfile = sesAwsProfile;
    },

    /* Chatwork */
    UPDATE_CHATWORK_API_KEY(state, chatworkApikey) {
      state.chatworkApikey = chatworkApikey;
    },

    UPDATE_CHATWORK_ROOM_ID(state, chatworkRoomId) {
      state.chatworkRoomId = chatworkRoomId;
    },

    UPDATE_CHATWORK_PROXY(state, chatworkProxy) {
      state.chatworkProxy = chatworkProxy;
    },

    UPDATE_CHATWORK_PROXY_LOGIN(state, chatworkProxyLogin) {
      state.chatworkProxyLogin = chatworkProxyLogin;
    },

    UPDATE_CHATWORK_PROXY_PASS(state, chatworkProxyPass) {
      state.chatworkProxyPass = chatworkProxyPass;
    },

    /* Command */
    UPDATE_COMMAND(state, command) {
      state.command = command;
    },

    ADD_COMMAND_ENTRY(state) {
      state.command.push('');
    },

    ADD_COMMAND_ENTRY_VALUE(state, value) {
      state.command.push(value);
    },

    REMOVE_COMMAND_ENTRY(state, entry) {
      state.command = state.command.filter(b => b !== entry);
    },

    UPDATE_COMMAND_ENTRY(state, { entry, index }) {
      if (!state.command) return;
      state.command[index] = entry;
    },

    UPDATE_PIPE_MATCH_JSON(state, pipeMatchJson) {
      state.pipeMatchJson = pipeMatchJson;
    },

    UPDATE_PIPE_ALERT_TEXT(state, pipeAlertText) {
      state.pipeAlertText = pipeAlertText;
    },

    UPDATE_FAIL_ON_NON_ZERO_EXIT(state, failOnNonZeroExit) {
      state.failOnNonZeroExit = failOnNonZeroExit;
    },

    /* Datadog */
    UPDATE_DATADOG_API_KEY(state, datadogApiKey) {
      state.datadogApiKey = datadogApiKey;
    },

    UPDATE_DATADOG_APP_KEY(state, datadogAppKey) {
      state.datadogAppKey = datadogAppKey;
    },

    /* Dingtalk */
    UPDATE_DINGTALK_ACCESS_TOKEN(state, dingtalkAccessToken) {
      state.dingtalkAccessToken = dingtalkAccessToken;
    },

    UPDATE_DINGTALK_MSGTYPE(state, dingtalkMsgtype) {
      state.dingtalkMsgtype = dingtalkMsgtype;
    },

    UPDATE_DINGTALK_SINGLE_TITLE(state, dingtalkSingleTitle) {
      state.dingtalkSingleTitle = dingtalkSingleTitle;
    },

    UPDATE_DINGTALK_SINGLE_URL(state, dingtalkSingleUrl) {
      state.dingtalkSingleUrl = dingtalkSingleUrl;
    },

    UPDATE_DINGTALK_BTN_ORIENTATION(state, dingtalkBtnOrientation) {
      state.dingtalkBtnOrientation = dingtalkBtnOrientation;
    },

    UPDATE_DINGTALK_SIGN(state, dingtalkSign) {
      state.dingtalkSign = dingtalkSign;
    },

    /* Discord */
    UPDATE_DISCORD_WEBHOOK_URL(state, discordWebhookUrl) {
      state.discordWebhookUrl = discordWebhookUrl;
    },

    UPDATE_DISCORD_EMOJI_TITLE(state, discordEmojiTitle) {
      state.discordEmojiTitle = discordEmojiTitle;
    },

    UPDATE_DISCORD_EMBED_FOOTER(state, discordEmbedFooter) {
      state.discordEmbedFooter = discordEmbedFooter;
    },

    UPDATE_DISCORD_EMBED_ICON_URL(state, discordEmbedIconUrl) {
      state.discordEmbedIconUrl = discordEmbedIconUrl;
    },

    UPDATE_DISCORD_PROXY(state, discordProxy) {
      state.discordProxy = discordProxy;
    },

    UPDATE_DISCORD_PROXY_LOGIN(state, discordProxyLogin) {
      state.discordProxyLogin = discordProxyLogin;
    },

    UPDATE_DISCORD_PROXY_PASSWORD(state, discordProxyPassword) {
      state.discordProxyPassword = discordProxyPassword;
    },

    /* Exotel */
    UPDATE_EXOTEL_ACCOUNT_SID(state, exotelAccountSid) {
      state.exotelAccountSid = exotelAccountSid;
    },

    UPDATE_EXOTEL_AUTH_TOKEN(state, exotelAuthToken) {
      state.exotelAuthToken = exotelAuthToken;
    },

    UPDATE_EXOTEL_TO_NUMBER(state, exotelToNumber) {
      state.exotelToNumber = exotelToNumber;
    },

    UPDATE_EXOTEL_FROM_NUMBER(state, exotelFromNumber) {
      state.exotelFromNumber = exotelFromNumber;
    },

    UPDATE_EXOTEL_MESSAGE_BODY(state, exotelMessageBody) {
      state.exotelMessageBody = exotelMessageBody;
    },

    /* EMail */
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

    UPDATE_SMTP_SSL(state, smtpSsl) {
      state.smtpSsl = smtpSsl;
    },

    UPDATE_SMTP_HOST(state, smtpHost) {
      state.smtpHost = smtpHost;
    },

    UPDATE_SMTP_PORT(state, smtpPort) {
      state.smtpPort = smtpPort;
    },

    UPDATE_SMTP_AUTH_FILE(state, smtpAuthFile) {
      state.smtpAuthFile = smtpAuthFile;
    },

    UPDATE_SMTP_KEY_FILE(state, smtpKeyFile) {
      state.smtpKeyFile = smtpKeyFile;
    },

    UPDATE_SMTP_CERT_FILE(state, smtpCertFile) {
      state.smtpCertFile = smtpCertFile;
    },

    UPDATE_EMAIL_FROM_FIELD(state, emailFromField) {
      state.emailFromField = emailFromField;
    },

    UPDATE_EMAIL_ADD_DOMAIN(state, emailAddDomain) {
      state.emailAddDomain = emailAddDomain;
    },

    /* GoogleChat */
    UPDATE_GOOGLE_CHAT_WEBHOOK_URL(state, googleChatWebhookUrl) {
      state.googleChatWebhookUrl = googleChatWebhookUrl;
    },

    ADD_GOOGLECHAT_WEBHOOK_URL_ENTRY(state) {
      state.googleChatWebhookUrl.push('');
    },

    ADD_GOOGLECHAT_WEBHOOK_URL_ENTRY_VALUE(state, value) {
      state.googleChatWebhookUrl.push(value);
    },

    REMOVE_GOOGLECHAT_WEBHOOK_URL_ENTRY(state, entry) {
      state.googleChatWebhookUrl = state.googleChatWebhookUrl.filter(b => b !== entry);
    },

    UPDATE_GOOGLECHAT_WEBHOOK_URL_ENTRY(state, { entry, index }) {
      if (!state.googleChatWebhookUrl) return;
      state.googleChatWebhookUrl[index] = entry;
    },

    UPDATE_GOOGLE_CHAT_FORMAT(state, googleChatFormat) {
      state.googleChatFormat = googleChatFormat;
    },

    UPDATE_GOOGLE_CHAT_HEADER_TITLE(state, googleChatHeaderTitle) {
      state.googleChatHeaderTitle = googleChatHeaderTitle;
    },

    UPDATE_GOOGLECHAT_HEADER_SUBTITLE(state, googleChatHeaderSubtitle) {
      state.googleChatHeaderSubtitle = googleChatHeaderSubtitle;
    },

    UPDATE_GOOGLECHAT_HEADER_IMAGE(state, googleChatHeaderImage) {
      state.googleChatHeaderImage = googleChatHeaderImage;
    },

    UPDATE_GOOGLECHAT_FOOTER_KIBANALINK(state, googleFooterKibanalink) {
      state.googleFooterKibanalink = googleFooterKibanalink;
    },

    UPDATE_GOOGLECHAT_PROXY(state, googleChatProxy) {
      state.googleChatProxy = googleChatProxy;
    },

    /* Gelf */
    UPDATE_GELF_TYPE(state, gelfType) {
      state.gelfType = gelfType;
    },

    UPDATE_GELF_ENDPOINT(state, gelfEndpoint) {
      state.gelfEndpoint = gelfEndpoint;
    },

    UPDATE_GELF_HTTP_IGNORE_SSL_ERRORS(state, gelfHttpIgnoreSslErrors) {
      state.gelfHttpIgnoreSslErrors = gelfHttpIgnoreSslErrors;
    },

    UPDATE_GELF_HOST(state, gelfHost) {
      state.gelfHost = gelfHost;
    },

    UPDATE_GELF_PORT(state, gelfPort) {
      state.gelfPort = gelfPort;
    },

    UPDATE_GELF_LOG_LEVEL(state, gelfLogLevel) {
      state.gelfLogLevel = gelfLogLevel;
    },

    UPDATE_GELF_CA_CERT(state, gelfCaCert) {
      state.gelfCaCert = gelfCaCert;
    },

    UPDATE_GELF_TIMEOUT(state, gelfTimeout) {
      state.gelfTimeout = gelfTimeout;
    },

    /* Gitter */
    UPDATE_GITTER_WEBHOOK_URL(state, gitterWebhookUrl) {
      state.gitterWebhookUrl = gitterWebhookUrl;
    },

    UPDATE_GITTER_MSG_LEVEL(state, gitterMsgLevel) {
      state.gitterMsgLevel = gitterMsgLevel;
    },

    UPDATE_GITTER_PROXY(state, gitterProxy) {
      state.gitterProxy = gitterProxy;
    },

    /* HTTP POST */
    UPDATE_HTTP_POST_URL(state, httpPostUrl) {
      state.httpPostUrl = httpPostUrl;
    },

    ADD_HTTP_POST_URL_ENTRY(state) {
      state.httpPostUrl.push('');
    },

    ADD_HTTP_POST_URL_ENTRY_VALUE(state, value) {
      state.httpPostUrl.push(value);
    },

    REMOVE_HTTP_POST_URL_ENTRY(state, entry) {
      state.httpPostUrl = state.httpPostUrl.filter(b => b !== entry);
    },

    UPDATE_HTTP_POST_URL_ENTRY(state, { entry, index }) {
      if (!state.httpPostUrl) return;
      state.httpPostUrl[index] = entry;
    },

    UPDATE_HTTP_POST_IGNORE_SSL_ERRORS(state, httpPostIgnoreSslErrors) {
      state.httpPostIgnoreSslErrors = httpPostIgnoreSslErrors;
    },

    UPDATE_HTTP_POST_CA_CERTS(state, httpPostCaCerts) {
      state.httpPostCaCerts = httpPostCaCerts;
    },

    UPDATE_HTTP_POST_TIMEOUT(state, httpPostTimeout) {
      state.httpPostTimeout = httpPostTimeout;
    },

    UPDATE_HTTP_POST_PROXY(state, httpPostProxy) {
      state.httpPostProxy = httpPostProxy;
    },

    /* HTTP POST 2 */
    UPDATE_HTTP_POST2_URL(state, httpPost2Url) {
      state.httpPost2Url = httpPost2Url;
    },

    ADD_HTTP_POST2_URL_ENTRY(state) {
      state.httpPost2Url.push('');
    },

    ADD_HTTP_POST2_URL_ENTRY_VALUE(state, value) {
      state.httpPost2Url.push(value);
    },

    REMOVE_HTTP_POST2_URL_ENTRY(state, entry) {
      state.httpPost2Url = state.httpPost2Url.filter(b => b !== entry);
    },

    UPDATE_HTTP_POST2_URL_ENTRY(state, { entry, index }) {
      if (!state.httpPost2Url) return;
      state.httpPost2Url[index] = entry;
    },

    UPDATE_HTTP_POST2_IGNORE_SSL_ERRORS(state, httpPost2IgnoreSslErrors) {
      state.httpPost2IgnoreSslErrors = httpPost2IgnoreSslErrors;
    },

    UPDATE_HTTP_POST2_CA_CERTS(state, httpPost2CaCerts) {
      state.httpPost2CaCerts = httpPost2CaCerts;
    },

    UPDATE_HTTP_POST2_TIMEOUT(state, httpPost2Timeout) {
      state.httpPost2Timeout = httpPost2Timeout;
    },

    UPDATE_HTTP_POST2_PROXY(state, httpPost2Proxy) {
      state.httpPost2Proxy = httpPost2Proxy;
    },

    /* IRIS */
    UPDATE_IRIS_HOST(state, irisHost) {
      state.irisHost = irisHost;
    },

    UPDATE_IRIS_API_TOKEN(state, irisApiToken) {
      state.irisApiToken = irisApiToken;
    },

    UPDATE_IRIS_CUSTOMER_ID(state, irisCustomerId) {
      state.irisCustomerId = irisCustomerId;
    },

    UPDATE_IRIS_IGNORE_SSL_ERRORS(state, irisIgnoreSslErrors) {
      state.irisIgnoreSslErrors = irisIgnoreSslErrors;
    },

    // TODO: Error saving config, are all fields filled out?
    UPDATE_IRIS_CA_CERT(state, irisCaCert) {
      state.irisCaCert = irisCaCert;
    },

    UPDATE_IRIS_DESCRIPTION(state, irisDescription) {
      state.irisDescription = irisDescription;
    },

    UPDATE_IRIS_OVERWRITE_TIMESTAMP(state, irisOverwriteTimestamp) {
      state.irisOverwriteTimestamp = irisOverwriteTimestamp;
    },

    UPDATE_IRIS_TYPE(state, irisType) {
      state.irisType = irisType;
    },

    UPDATE_IRIS_CASE_TEMPLATE_ID(state, irisCaseTemplateId) {
      state.irisCaseTemplateId = irisCaseTemplateId;
    },

    UPDATE_IRIS_ALERT_NOTE(state, irisAlertNote) {
      state.irisAlertNote = irisAlertNote;
    },

    UPDATE_IRIS_ALERT_TAGS(state, irisAlertTags) {
      state.irisAlertTags = irisAlertTags;
    },

    UPDATE_IRIS_ALERT_STATUS_ID(state, irisAlertStatusId) {
      state.irisAlertStatusId = irisAlertStatusId;
    },

    UPDATE_IRIS_ALERT_SOURCE_LINK(state, irisAlertSourceLink) {
      state.irisAlertSourceLink = irisAlertSourceLink;
    },

    UPDATE_IRIS_ALERT_SEVERITY_ID(state, irisAlertSeverityId) {
      state.irisAlertSeverityId = irisAlertSeverityId;
    },

    /* Jira */
    UPDATE_JIRA_PROJECT(state, jiraProject) {
      state.jiraProject = jiraProject;
    },

    UPDATE_JIRA_ISSUE_TYPE(state, jiraIssueType) {
      state.jiraIssueType = jiraIssueType;
    },

    UPDATE_JIRA_COMPONENTS(state, jiraComponents) {
      state.jiraComponents = jiraComponents;
    },

    UPDATE_JIRA_DESCRIPTIONT(state, jiraDescription) {
      state.jiraDescription = jiraDescription;
    },

    /* Lark */
    UPDATE_LARK_BOT_ID(state, larkBotId) {
      state.larkBotId = larkBotId;
    },

    UPDATE_LARK_MSGTYPE(state, larkMsgtype) {
      state.larkMsgtype = larkMsgtype;
    },

    /* Mattermost */
    UPDATE_MATTERMOST_WEBHOOK_URL(state, mattermostWebhookUrl) {
      state.mattermostWebhookUrl = mattermostWebhookUrl;
    },

    ADD_MATTERMOST_WEBHOOK_URL_ENTRY(state) {
      state.mattermostWebhookUrl.push('');
    },

    ADD_MATTERMOST_WEBHOOK_URL_ENTRY_VALUE(state, value) {
      state.mattermostWebhookUrl.push(value);
    },

    REMOVE_MATTERMOST_WEBHOOK_URL_ENTRY(state, entry) {
      state.mattermostWebhookUrl = state.mattermostWebhookUrl.filter(b => b !== entry);
    },

    UPDATE_MATTERMOST_WEBHOOK_URL_ENTRY(state, { entry, index }) {
      if (!state.mattermostWebhookUrl) return;
      state.mattermostWebhookUrl[index] = entry;
    },

    UPDATE_MATTERMOST_CHANNEL_OVERRIDE(state, mattermostChannelOverride) {
      state.mattermostChannelOverride = mattermostChannelOverride;
    },

    ADD_MATTERMOST_CHANNEL_OVERRIDE_ENTRY(state) {
      state.mattermostChannelOverride.push('');
    },

    ADD_MATTERMOST_CHANNEL_OVERRIDE_ENTRY_VALUE(state, value) {
      state.mattermostChannelOverride.push(value);
    },

    REMOVE_MATTERMOST_CHANNEL_OVERRIDE_ENTRY(state, entry) {
      state.mattermostChannelOverride = state.mattermostChannelOverride.filter(b => b !== entry);
    },

    UPDATE_MATTERMOST_CHANNEL_OVERRIDE_ENTRY(state, { entry, index }) {
      if (!state.mattermostChannelOverride) return;
      state.mattermostChannelOverride[index] = entry;
    },

    UPDATE_MATTERMOST_USERNAME_OVERRIDE(state, mattermostUsernameOverride) {
      state.mattermostUsernameOverride = mattermostUsernameOverride;
    },

    UPDATE_MATTERMOST_EMOJI_OVERRIDE(state, mattermostEmojiOverride) {
      state.mattermostEmojiOverride = mattermostEmojiOverride;
    },

    UPDATE_MATTERMOST_MSG_COLOR(state, mattermostMsgColor) {
      state.mattermostMsgColor = mattermostMsgColor;
    },

    UPDATE_MATTERMOST_ICON_URL_OVERRIDE(state, mattermostIconUrlOverride) {
      state.mattermostIconUrlOverride = mattermostIconUrlOverride;
    },

    UPDATE_MATTERMOST_MSG_PRETEXT(state, mattermostMsgPretext) {
      state.mattermostMsgPretext = mattermostMsgPretext;
    },

    UPDATE_MATTERMOST_IGNORE_SSL_ERRORS(state, mattermostIgnoreSslErrors) {
      state.mattermostIgnoreSslErrors = mattermostIgnoreSslErrors;
    },

    UPDATE_MATTERMOST_PROXY(state, mattermostProxy) {
      state.mattermostProxy = mattermostProxy;
    },

    UPDATE_MATTERMOST_TITLE(state, mattermostTitle) {
      state.mattermostTitle = mattermostTitle;
    },

    UPDATE_MATTERMOST_TITLE_LINK(state, mattermostTitleLink) {
      state.mattermostTitleLink = mattermostTitleLink;
    },

    UPDATE_MATTERMOST_FOOTER(state, mattermostFooter) {
      state.mattermostFooter = mattermostFooter;
    },

    UPDATE_MATTERMOST_FOOTER_ICON(state, mattermostFooterIcon) {
      state.mattermostFooterIcon = mattermostFooterIcon;
    },

    UPDATE_MATTERMOST_IMAGE_URL(state, mattermostImageUrl) {
      state.mattermostImageUrl = mattermostImageUrl;
    },

    UPDATE_MATTERMOST_THUMB_URL(state, mattermostThumbUrl) {
      state.mattermostThumbUrl = mattermostThumbUrl;
    },

    UPDATE_MATTERMOST_AUTHOR_NAME(state, mattermostAuthorName) {
      state.mattermostAuthorName = mattermostAuthorName;
    },

    UPDATE_MATTERMOST_AUTHOR_LINK(state, mattermostAuthorLink) {
      state.mattermostAuthorLink = mattermostAuthorLink;
    },

    UPDATE_MATTERMOST_AUTHOR_ICON(state, mattermostAuthorIcon) {
      state.mattermostAuthorIcon = mattermostAuthorIcon;
    },

    UPDATE_MATTERMOST_ATTACH_KIBANA_DISCOVER_URL(state, mattermostAttachKibanaDiscoverUrl) {
      state.mattermostAttachKibanaDiscoverUrl = mattermostAttachKibanaDiscoverUrl;
    },

    UPDATE_MATTERMOST_KIBANA_DISCOVER_COLOR(state, mattermostKibanaDiscoverColor) {
      state.mattermostKibanaDiscoverColor = mattermostKibanaDiscoverColor;
    },

    UPDATE_MATTERMOST_KIBANA_DISCOVER_TITLE(state, mattermostKibanaDiscoverTitle) {
      state.mattermostKibanaDiscoverTitle = mattermostKibanaDiscoverTitle;
    },

    /* Matrix Hookshot */
    UPDATE_MATRIXHOOKSHOT_WEBHOOK_URL(state, matrixhookshotWebhookUrl) {
      state.matrixhookshotWebhookUrl = matrixhookshotWebhookUrl;
    },

    ADD_MATRIXHOOKSHOT_WEBHOOK_URL_ENTRY(state) {
      state.matrixhookshotWebhookUrl.push('');
    },

    ADD_MATRIXHOOKSHOT_WEBHOOK_URL_ENTRY_VALUE(state, value) {
      state.matrixhookshotWebhookUrl.push(value);
    },

    REMOVE_MATRIXHOOKSHOT_WEBHOOK_URL_ENTRY(state, entry) {
      state.matrixhookshotWebhookUrl = state.matrixhookshotWebhookUrl.filter(b => b !== entry);
    },

    UPDATE_MATRIXHOOKSHOT_WEBHOOK_URL_ENTRY(state, { entry, index }) {
      if (!state.matrixhookshotWebhookUrl) return;
      state.matrixhookshotWebhookUrl[index] = entry;
    },

    UPDATE_MATRIXHOOKSHOT_USERNAME(state, matrixhookshotUsername) {
      state.matrixhookshotUsername = matrixhookshotUsername;
    },

    UPDATE_MATRIXHOOKSHOT_TEXT(state, matrixhookshotText) {
      state.matrixhookshotText = matrixhookshotText;
    },

    UPDATE_MATRIXHOOKSHOT_IGNORE_SSL_ERRORS(state, matrixhookshotIgnoreSslErrors) {
      state.matrixhookshotIgnoreSslErrors = matrixhookshotIgnoreSslErrors;
    },

    UPDATE_MATRIXHOOKSHOT_CA_CERTS(state, matrixhookshotCaCerts) {
      state.matrixhookshotCaCerts = matrixhookshotCaCerts;
    },

    UPDATE_MATRIXHOOKSHOT_TIMEOUT(state, matrixhookshotTimeout) {
      state.matrixhookshotTimeout = matrixhookshotTimeout;
    },

    UPDATE_MATRIXHOOKSHOT_PROXY(state, matrixhookshotProxy) {
      state.matrixhookshotProxy = matrixhookshotProxy;
    },

    /* MS Power Automate */
    UPDATE_MS_POWER_AUTOMATE_WEBHOOK_URL(state, msPowerAutomateWebhookUrl) {
      state.msPowerAutomateWebhookUrl = msPowerAutomateWebhookUrl;
    },

    ADD_MS_POWER_AUTOMATE_WEBHOOK_URL_ENTRY(state) {
      state.msPowerAutomateWebhookUrl.push('');
    },

    ADD_MS_POWER_AUTOMATE_WEBHOOK_URL_ENTRY_VALUE(state, value) {
      state.msPowerAutomateWebhookUrl.push(value);
    },

    REMOVE_MS_POWER_AUTOMATE_WEBHOOK_URL_ENTRY(state, entry) {
      state.msPowerAutomateWebhookUrl = state.msPowerAutomateWebhookUrl.filter(b => b !== entry);
    },

    UPDATE_MS_POWER_AUTOMATE_WEBHOOK_URL_ENTRY(state, { entry, index }) {
      if (!state.msPowerAutomateWebhookUrl) return;
      state.msPowerAutomateWebhookUrl[index] = entry;
    },

    UPDATE_MS_POWER_AUTOMATE_ALERT_FIXED_WIDTH(state, msPowerAutomateTeamsCardWidthFull) {
      state.msPowerAutomateTeamsCardWidthFull = msPowerAutomateTeamsCardWidthFull;
    },

    UPDATE_MS_POWER_AUTOMATE_ALERT_SUMMARY(state, msPowerAutomateAlertSummary) {
      state.msPowerAutomateAlertSummary = msPowerAutomateAlertSummary;
    },

    UPDATE_MS_POWER_AUTOMATE_SUMMARY_TEXT_SIZE(state, msPowerAutomateSummaryTextSize) {
      state.msPowerAutomateSummaryTextSize = msPowerAutomateSummaryTextSize;
    },

    UPDATE_MS_POWER_AUTOMATE_BODY_TEXT_SIZE(state, msPowerAutomateBodyTextSize) {
      state.msPowerAutomateBodyTextSize = msPowerAutomateBodyTextSize;
    },

    UPDATE_MS_POWER_AUTOMATE_PROXY(state, msPowerAutomateProxy) {
      state.msPowerAutomateProxy = msPowerAutomateProxy;
    },

    UPDATE_MS_POWER_AUTOMATE_IGNORE_SSL_ERRORS(state, msPowerAutomateIgnoreSslErrors) {
      state.msPowerAutomateIgnoreSslErrors = msPowerAutomateIgnoreSslErrors;
    },

    UPDATE_MS_POWER_AUTOMATE_CA_CERTS(state, msPowerAutomateCaCerts) {
      state.msPowerAutomateCaCerts = msPowerAutomateCaCerts;
    },

    UPDATE_MS_POWER_AUTOMATE_ATTACH_KIBANA_DISCOVER_URL(state, msPowerAutomateAttachKibanaDiscoverUrl) {
      state.msPowerAutomateAttachKibanaDiscoverUrl = msPowerAutomateAttachKibanaDiscoverUrl;
    },

    UPDATE_MS_POWER_AUTOMATE_KIBANA_DISCOVER_TITLE(state, msPowerAutomateKibanaDiscoverTitle) {
      state.msPowerAutomateKibanaDiscoverTitle = msPowerAutomateKibanaDiscoverTitle;
    },

    UPDATE_MS_POWER_AUTOMATE_KIBANA_DISCOVER_COLOR(state, msPowerAutomateKibanaDiscoverColor) {
      state.msPowerAutomateKibanaDiscoverColor = msPowerAutomateKibanaDiscoverColor;
    },

    /* OpsGenie */
    OPSGENIE_KEY(state, opsgenieKey) {
      state.opsgenieKey = opsgenieKey;
    },

    OPSGENIE_ACCOUNT(state, opsgenieAccount) {
      state.opsgenieAccount = opsgenieAccount;
    },

    OPSGENIE_MESSAGE(state, opsgenieMessage) {
      state.opsgenieMessage = opsgenieMessage;
    },

    OPSGENIE_SUBJECT(state, opsgenieSubject) {
      state.opsgenieSubject = opsgenieSubject;
    },

    OPSGENIE_ALIAS(state, opsgenieAlias) {
      state.opsgenieAlias = opsgenieAlias;
    },

    OPSGENIE_PROXY(state, opsgenieProxy) {
      state.opsgenieProxy = opsgenieProxy;
    },

    OPSGENIE_PRIORITY(state, opsgeniePriority) {
      state.opsgeniePriority = opsgeniePriority;
    },

    OPSGENIE_DESCRIPTION(state, opsgenieDescription) {
      state.opsgenieDescription = opsgenieDescription;
    },

    UPDATE_OPSGENIE_PRIORITY(state, opsgeniePriority) {
      state.opsgeniePriority = opsgeniePriority;
    },

    /* PagerDuty */
    UPDATE_PAGERDUTY_SERVICE_KEY(state, pagerdutyServiceKey) {
      state.pagerdutyServiceKey = pagerdutyServiceKey;
    },

    UPDATE_PAGERDUTY_CLIENT_NAME(state, pagerdutyClientName) {
      state.pagerdutyClientName = pagerdutyClientName;
    },

    UPDATE_PAGERDUTY_EVENT_TYPE(state, pagerdutyEventType) {
      state.pagerdutyEventType = pagerdutyEventType;
    },

    UPDATE_PAGERDUTY_INCIDENT_KEY(state, pagerdutyIncidentKey) {
      state.pagerdutyIncidentKey = pagerdutyIncidentKey;
    },

    UPDATE_PAGERDUTY_INCIDENT_KEY_ARGS(state, pagerdutyIncidentKeyArgs) {
      state.pagerdutyIncidentKeyArgs = pagerdutyIncidentKeyArgs;
    },

    ADD_PAGERDUTY_INCIDENT_KEY_ARGS_ENTRY(state) {
      state.pagerdutyIncidentKeyArgs.push('');
    },

    ADD_PAGERDUTY_INCIDENT_KEY_ARGS_ENTRY_VALUE(state, value) {
      state.pagerdutyIncidentKeyArgs.push(value);
    },

    REMOVE_PAGERDUTY_INCIDENT_KEY_ARGS_ENTRY(state, entry) {
      state.pagerdutyIncidentKeyArgs = state.pagerdutyIncidentKeyArgs.filter(b => b !== entry);
    },

    UPDATE_PAGERDUTY_INCIDENT_KEY_ARGS_ENTRY(state, { entry, index }) {
      if (!state.pagerdutyIncidentKeyArgs) return;
      state.pagerdutyIncidentKeyArgs[index] = entry;
    },

    UPDATE_PAGERDUTY_PROXYY(state, pagerdutyProxy) {
      state.pagerdutyProxy = pagerdutyProxy;
    },

    UPDATE_PAGERDUTY_API_VERSION(state, pagerdutyApiVersion) {
      state.pagerdutyApiVersion = pagerdutyApiVersion;
    },

    UPDATE_PAGERDUTY_V2_PAYLOAD_CLASS(state, pagerdutyV2PayloadClass) {
      state.pagerdutyV2PayloadClass = pagerdutyV2PayloadClass;
    },

    UPDATE_PAGERDUTY_V2_PAYLOAD_CLASS_ARGS(state, pagerdutyV2PayloadClassArgs) {
      state.pagerdutyV2PayloadClassArgs = pagerdutyV2PayloadClassArgs;
    },

    ADD_PAGERDUTY_V2_PAYLOAD_CLASS_ARGS_ENTRY(state) {
      state.pagerdutyV2PayloadClassArgs.push('');
    },

    ADD_PAGERDUTY_V2_PAYLOAD_CLASS_ARGS_ENTRY_VALUE(state, value) {
      state.pagerdutyV2PayloadClassArgs.push(value);
    },

    REMOVE_PAGERDUTY_V2_PAYLOAD_CLASS_ARGS_ENTRY(state, entry) {
      state.pagerdutyV2PayloadClassArgs = state.pagerdutyV2PayloadClassArgs.filter(b => b !== entry);
    },

    UPDATE_PAGERDUTY_V2_PAYLOAD_CLASS_ARGS_ENTRY(state, { entry, index }) {
      if (!state.pagerdutyV2PayloadClassArgs) return;
      state.pagerdutyV2PayloadClassArgs[index] = entry;
    },

    UPDATE_PAGERDUTY_V2_PAYLOAD_COMPONENT(state, pagerdutyV2PayloadComponent) {
      state.pagerdutyV2PayloadComponent = pagerdutyV2PayloadComponent;
    },

    UPDATE_PAGERDUTY_V2_PAYLOAD_COMPONENT_ARGS(state, pagerdutyV2PayloadComponentArgs) {
      state.pagerdutyV2PayloadComponentArgs = pagerdutyV2PayloadComponentArgs;
    },

    ADD_PAGERDUTY_V2_PAYLOAD_COMPONENT_ARGS_ENTRY(state) {
      state.pagerdutyV2PayloadComponentArgs.push('');
    },

    ADD_PAGERDUTY_V2_PAYLOAD_COMPONENT_ARGS_ENTRY_VALUE(state, value) {
      state.pagerdutyV2PayloadComponentArgs.push(value);
    },

    REMOVE_PAGERDUTY_V2_PAYLOAD_COMPONENT_ARGS_ENTRY(state, entry) {
      state.pagerdutyV2PayloadComponentArgs = state.pagerdutyV2PayloadComponentArgs.filter(b => b !== entry);
    },

    UPDATE_PAGERDUTY_V2_PAYLOAD_COMPONENT_ARGS_ENTRY(state, { entry, index }) {
      if (!state.pagerdutyV2PayloadComponentArgs) return;
      state.pagerdutyV2PayloadComponentArgs[index] = entry;
    },

    UPDATE_PAGERDUTY_V2_PAYLOAD_GROUP(state, pagerdutyV2PayloadGroup) {
      state.pagerdutyV2PayloadGroup = pagerdutyV2PayloadGroup;
    },

    UPDATE_PAGERDUTY_V2_PAYLOAD_GROUP_ARGS(state, pagerdutyV2PayloadGroupArgs) {
      state.pagerdutyV2PayloadGroupArgs = pagerdutyV2PayloadGroupArgs;
    },

    ADD_PAGERDUTY_V2_PAYLOAD_GROUP_ARGS_ENTRY(state) {
      state.pagerdutyV2PayloadGroupArgs.push('');
    },

    ADD_PAGERDUTY_V2_PAYLOAD_GROUP_ARGS_ENTRY_VALUE(state, value) {
      state.pagerdutyV2PayloadGroupArgs.push(value);
    },

    REMOVE_PAGERDUTY_V2_PAYLOAD_GROUP_ARGS_ENTRY(state, entry) {
      state.pagerdutyV2PayloadGroupArgs = state.pagerdutyV2PayloadGroupArgs.filter(b => b !== entry);
    },

    UPDATE_PAGERDUTY_V2_PAYLOAD_GROUP_ARGS_ENTRY(state, { entry, index }) {
      if (!state.pagerdutyV2PayloadGroupArgs) return;
      state.pagerdutyV2PayloadGroupArgs[index] = entry;
    },

    UPDATE_PAGERDUTY_V2_PAYLOAD_SEVERITY(state, pagerdutyV2PayloadSeverity) {
      state.pagerdutyV2PayloadSeverity = pagerdutyV2PayloadSeverity;
    },

    UPDATE_PAGERDUTY_V2_PAYLOAD_SOURCE(state, pagerdutyV2PayloadSource) {
      state.pagerdutyV2PayloadSource = pagerdutyV2PayloadSource;
    },

    UPDATE_PAGERDUTY_V2_PAYLOAD_SOURCE_ARGS(state, pagerdutyV2PayloadSourceArgs) {
      state.pagerdutyV2PayloadSourceArgs = pagerdutyV2PayloadSourceArgs;
    },

    ADD_PAGERDUTY_V2_PAYLOAD_SOURCE_ARGS_ENTRY(state) {
      state.pagerdutyV2PayloadSourceArgs.push('');
    },

    ADD_PAGERDUTY_V2_PAYLOAD_SOURCE_ARGS_ENTRY_VALUE(state, value) {
      state.pagerdutyV2PayloadSourceArgs.push(value);
    },

    REMOVE_PAGERDUTY_V2_PAYLOAD_SOURCE_ARGS_ENTRY(state, entry) {
      state.pagerdutyV2PayloadSourceArgs = state.pagerdutyV2PayloadSourceArgs.filter(b => b !== entry);
    },

    UPDATE_PAGERDUTY_V2_PAYLOAD_SOURCE_ARGS_ENTRY(state, { entry, index }) {
      if (!state.pagerdutyV2PayloadSourceArgs) return;
      state.pagerdutyV2PayloadSourceArgs[index] = entry;
    },

    UPDATE_PAGERDUTY_V2_PAYLOAD_INCLUDE_ALL_INFO(state, pagerdutyV2PayloadIncludeAllInfo) {
      state.pagerdutyV2PayloadIncludeAllInfo = pagerdutyV2PayloadIncludeAllInfo;
    },

    UPDATE_PAGERDUTY_IGNORE_SSL_ERRORS(state, pagerdutyIgnoreSslErrors) {
      state.pagerdutyIgnoreSslErrors = pagerdutyIgnoreSslErrors;
    },

    UPDATE_PAGERDUTY_CA_CERTS(state, pagerdutyCaCerts) {
      state.pagerdutyCaCerts = pagerdutyCaCerts;
    },

    /* Pagertree */
    UPDATE_PAGERTREE_INTEGRATION_URL(state, pagertreeIntegrationUrl) {
      state.pagertreeIntegrationUrl = pagertreeIntegrationUrl;
    },

    UPDATE_PAGERTREE_PROXY(state, pagertreeProxy) {
      state.pagertreeProxy = pagertreeProxy;
    },

    /* Rocket.Chat */
    UPDATE_ROCKET_CHAT_WEBHOOK_URL(state, rocketChatWebhookUrl) {
      state.rocketChatWebhookUrl = rocketChatWebhookUrl;
    },

    ADD_ROCKET_CHAT_WEBHOOK_URL_ENTRY(state) {
      state.rocketChatWebhookUrl.push('');
    },

    ADD_ROCKET_CHAT_WEBHOOK_URL_ENTRY_VALUE(state, value) {
      state.rocketChatWebhookUrl.push(value);
    },

    REMOVE_ROCKET_CHAT_WEBHOOK_URL_ENTRY(state, entry) {
      state.rocketChatWebhookUrl = state.rocketChatWebhookUrl.filter(b => b !== entry);
    },

    UPDATE_ROCKET_CHAT_WEBHOOK_URL_ENTRY(state, { entry, index }) {
      if (!state.rocketChatWebhookUrl) return;
      state.rocketChatWebhookUrl[index] = entry;
    },

    UPDATE_ROCKET_CHAT_CHANNEL_OVERRIDE(state, rocketChatChannelOverride) {
      state.rocketChatChannelOverride = rocketChatChannelOverride;
    },

    ADD_ROCKET_CHAT_CHANNEL_OVERRIDE_ENTRY(state) {
      state.rocketChatChannelOverride.push('');
    },

    ADD_ROCKET_CHAT_CHANNEL_OVERRIDE_ENTRY_VALUE(state, value) {
      state.rocketChatChannelOverride.push(value);
    },

    REMOVE_ROCKET_CHAT_CHANNEL_OVERRIDE_ENTRY(state, entry) {
      state.rocketChatChannelOverride = state.rocketChatChannelOverride.filter(b => b !== entry);
    },

    UPDATE_ROCKET_CHAT_CHANNEL_OVERRIDE_ENTRY(state, { entry, index }) {
      if (!state.rocketChatChannelOverride) return;
      state.rocketChatChannelOverride[index] = entry;
    },

    UPDATE_ROCKET_CHAT_USERNAME_OVERRIDE(state, rocketChatUsernameOverride) {
      state.rocketChatUsernameOverride = rocketChatUsernameOverride;
    },

    UPDATE_ROCKET_CHAT_EMOJI_OVERRIDE(state, rocketChatEmojiOverride) {
      state.rocketChatEmojiOverride = rocketChatEmojiOverride;
    },

    UPDATE_ROCKET_CHAT_MSG_COLOR(state, rocketChatMsgColor) {
      state.rocketChatMsgColor = rocketChatMsgColor;
    },

    UPDATE_ROCKET_CHAT_TEXT_STRING(state, rocketChatTextString) {
      state.rocketChatTextString = rocketChatTextString;
    },

    UPDATE_ROCKET_CHAT_PROXY(state, rocketChatProxy) {
      state.rocketChatProxy = rocketChatProxy;
    },

    UPDATE_ROCKET_CHAT_ATTACH_KIBANA_DISCOVER_URL(state, rocketChatAttachKibanaDiscoverUrl) {
      state.rocketChatAttachKibanaDiscoverUrl = rocketChatAttachKibanaDiscoverUrl;
    },

    UPDATE_ROCKET_CHAT_KIBANA_DISCOVER_COLOR(state, rocketChatKibanaDiscoverColor) {
      state.rocketChatKibanaDiscoverColor = rocketChatKibanaDiscoverColor;
    },

    UPDATE_ROCKET_CHAT_KIBANA_DISCOVER_TITLE(state, rocketChatKibanaDiscoverTitle) {
      state.rocketChatKibanaDiscoverTitle = rocketChatKibanaDiscoverTitle;
    },

    UPDATE_ROCKET_CHAT_IGNORE_SSL_ERRORS(state, rocketChatIgnoreSslErrors) {
      state.rocketChatIgnoreSslErrors = rocketChatIgnoreSslErrors;
    },

    UPDATE_ROCKET_CHAT_CA_CERTS(state, rocketChatCaCerts) {
      state.rocketChatCaCerts = rocketChatCaCerts;
    },

    UPDATE_ROCKET_CHAT_TIMEOUT(state, rocketChatTimeout) {
      state.rocketChatTimeout = rocketChatTimeout;
    },

    /* ServiceNow */
    UPDATE_SERVICENOW_USERNAME(state, serviceNowUsername) {
      state.serviceNowUsername = serviceNowUsername;
    },

    UPDATE_SERVICENOW_PASSWORD(state, serviceNowPassword) {
      state.serviceNowPassword = serviceNowPassword;
    },

    UPDATE_SERVICENOW_REST_URL(state, servicenowRestUrl) {
      state.servicenowRestUrl = servicenowRestUrl;
    },

    UPDATE_SERVICENOW_SHORT_DESCRIPTION(state, servicenowShortDescription) {
      state.servicenowShortDescription = servicenowShortDescription;
    },

    UPDATE_SERVICENOW_COMMENTS(state, servicenowComments) {
      state.servicenowComments = servicenowComments;
    },

    UPDATE_SERVICENOW_ASSIGNMENT_GROUP(state, servicenowAssignmentGroup) {
      state.servicenowAssignmentGroup = servicenowAssignmentGroup;
    },

    UPDATE_SERVICENOW_CATEGORY(state, servicenowCategory) {
      state.servicenowCategory = servicenowCategory;
    },

    UPDATE_SERVICENOW_SUBCATEGORY(state, servicenowSubcategory) {
      state.servicenowSubcategory = servicenowSubcategory;
    },

    UPDATE_SERVICENOW_CMDB_CI(state, servicenowCmdbCi) {
      state.servicenowCmdbCi = servicenowCmdbCi;
    },

    UPDATE_SERVICENOW_CALLER_ID(state, servicenowCallerId) {
      state.servicenowCallerId = servicenowCallerId;
    },

    UPDATE_SERVICENOW_PROXY(state, servicenowProxy) {
      state.servicenowProxy = servicenowProxy;
    },

    UPDATE_SERVICENOW_IMPACT(state, servicenowImpact) {
      state.servicenowImpact = servicenowImpact;
    },

    UPDATE_SERVICENOW_URGENCY(state, servicenowUrgency) {
      state.servicenowUrgency = servicenowUrgency;
    },

    /* Slack */
    UPDATE_SLACK_WEBHOOK_URL(state, slackWebhookUrl) {
      state.slackWebhookUrl = slackWebhookUrl;
    },

    ADD_SLACK_WEBHOOK_URL_ENTRY(state) {
      state.slackWebhookUrl.push('');
    },

    ADD_SLACK_WEBHOOK_URL_ENTRY_VALUE(state, value) {
      state.slackWebhookUrl.push(value);
    },

    REMOVE_SLACK_WEBHOOK_URL_ENTRY(state, entry) {
      state.slackWebhookUrl = state.slackWebhookUrl.filter(b => b !== entry);
    },

    UPDATE_SLACK_WEBHOOK_URL_ENTRY(state, { entry, index }) {
      if (!state.slackWebhookUrl) return;
      state.slackWebhookUrl[index] = entry;
    },

    UPDATE_SLACK_CHANNEL_OVERRIDE(state, slackChannelOverride) {
      state.slackChannelOverride = slackChannelOverride;
    },

    ADD_SLACK_CHANNEL_OVERRIDE_ENTRY(state) {
      state.slackChannelOverride.push('');
    },

    ADD_SLACK_CHANNEL_OVERRIDE_ENTRY_VALUE(state, value) {
      state.slackChannelOverride.push(value);
    },

    REMOVE_SLACK_CHANNEL_OVERRIDE_ENTRY(state, entry) {
      state.slackChannelOverride = state.slackChannelOverride.filter(b => b !== entry);
    },

    UPDATE_SLACK_CHANNEL_OVERRIDE_ENTRY(state, { entry, index }) {
      if (!state.slackChannelOverride) return;
      state.slackChannelOverride[index] = entry;
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

    UPDATE_SLACK_PARSE_OVERRIDE(state, slackParseOverride) {
      state.slackParseOverride = slackParseOverride;
    },

    UPDATE_SLACK_TEXT_STRING(state, slackTextString) {
      state.slackTextString = slackTextString;
    },

    UPDATE_SLACK_IGNORE_SSL_ERRORS(state, slackIgnoreSslErrors) {
      state.slackIgnoreSslErrors = slackIgnoreSslErrors;
    },

    UPDATE_SLACK_CA_CERTS(state, slackCaCerts) {
      state.slackCaCerts = slackCaCerts;
    },

    UPDATE_SLACK_ICON_URL_OVERRIDE(state, slackIconUrlOverride) {
      state.slackIconUrlOverride = slackIconUrlOverride;
    },

    UPDATE_SLACK_TIMEOUT(state, slackTimeout) {
      state.slackTimeout = slackTimeout;
    },

    UPDATE_SLACK_ATTACH_KIBANA_DISCOVER_URL(state, slackAttachKibanaDiscoverUrl) {
      state.slackAttachKibanaDiscoverUrl = slackAttachKibanaDiscoverUrl;
    },

    UPDATE_SLACK_KIBANA_DISCOVER_COLOR(state, slackKibanaDiscoverColor) {
      state.slackKibanaDiscoverColor = slackKibanaDiscoverColor;
    },

    UPDATE_SLACK_KIBANA_DISCOVER_TITLE(state, slackKibanaDiscoverTitle) {
      state.slackKibanaDiscoverTitle = slackKibanaDiscoverTitle;
    },

    UPDATE_SLACK_PROXY(state, slackProxy) {
      state.slackProxy = slackProxy;
    },

    UPDATE_SLACK_FOOTER(state, slackFooter) {
      state.slackFooter = slackFooter;
    },

    UPDATE_SLACK_FOOTER_ICON(state, slackFooterIcon) {
      state.slackFooterIcon = slackFooterIcon;
    },

    UPDATE_SLACK_IMAGE_URL(state, slackImageUrl) {
      state.slackImageUrl = slackImageUrl;
    },

    UPDATE_SLACK_THUMB_URL(state, slackThumbUrl) {
      state.slackThumbUrl = slackThumbUrl;
    },

    UPDATE_SLACK_AUTHOR_NAME(state, slackAuthorName) {
      state.slackAuthorName = slackAuthorName;
    },

    UPDATE_SLACK_AUTHOR_LINK(state, slackAuthorLink) {
      state.slackAuthorLink = slackAuthorLink;
    },

    UPDATE_SLACK_AUTHOR_ICON(state, slackAuthorIcon) {
      state.slackAuthorIcon = slackAuthorIcon;
    },

    UPDATE_SLACK_MSG_PRETEXT(state, slackMsgPretext) {
      state.slackMsgPretext = slackMsgPretext;
    },

    UPDATE_SLACK_ATTACH_JIRA_TICKET_URL(state, slackAttachJiraTicketUrl) {
      state.slackAttachJiraTicketUrl = slackAttachJiraTicketUrl;
    },

    UPDATE_SLACK_JIRA_TICKET_COLOR(state, slackJiraTicketColor) {
      state.slackJiraTicketColor = slackJiraTicketColor;
    },

    UPDATE_SLACK_JIRA_TICKET_TITLE(state, slackJiraTicketTitle) {
      state.slackJiraTicketTitle = slackJiraTicketTitle;
    },

    /* Stomp */
    UPDATE_STOMP_HOSTNAME(state, stompHostname) {
      state.stompHostname = stompHostname;
    },

    UPDATE_STOMP_HOSTPORT(state, stompHostport) {
      state.stompHostport = stompHostport;
    },

    UPDATE_STOMP_LOGIN(state, stompLogin) {
      state.stompLogin = stompLogin;
    },

    UPDATE_STOMP_PASSWORD(state, stompPassword) {
      state.stompPassword = stompPassword;
    },

    UPDATE_STOMP_DESTINATION(state, stompDestination) {
      state.stompDestination = stompDestination;
    },

    /* Telegram */
    UPDATE_TELEGRAM_ROOM_ID(state, telegramRoomId) {
      state.telegramRoomId = telegramRoomId;
    },

    UPDATE_TELEGRAM_PROXY(state, telegramProxy) {
      state.telegramProxy = telegramProxy;
    },

    UPDATE_TELEGRAM_PROXY_LOGIN(state, telegramProxyLogin) {
      state.telegramProxyLogin = telegramProxyLogin;
    },

    UPDATE_TELEGRAM_PROXY_PASS(state, telegramProxyPass) {
      state.telegramProxyPass = telegramProxyPass;
    },

    UPDATE_TELEGRAM_PARSE_MODE(state, telegramParseMode) {
      state.telegramParseMode = telegramParseMode;
    },

    UPDATE_TELEGRAM_THREAD_ID(state, telegramThreadId) {
      state.telegramThreadId = telegramThreadId;
    },

    /* Tencent SMS */
    UPDATE_TENCENT_SMS_SECRET_ID(state, tencentSmsSecretId) {
      state.tencentSmsSecretId = tencentSmsSecretId;
    },

    UPDATE_TENCENT_SMS_SECRET_KEY(state, tencentSmsSecretKey) {
      state.tencentSmsSecretKey = tencentSmsSecretKey;
    },

    UPDATE_TENCENT_SMS_SDK_APPID(state, tencentSmsSdkAppid) {
      state.tencentSmsSdkAppid = tencentSmsSdkAppid;
    },

    UPDATE_TENCENT_SMS_TO_NUMBER(state, tencentSmsToNumber) {
      state.tencentSmsToNumber = tencentSmsToNumber;
    },

    ADD_TENCENT_SMS_TO_NUMBER_ENTRY(state) {
      state.tencentSmsToNumber.push('');
    },

    ADD_TENCENT_SMS_TO_NUMBER_ENTRY_VALUE(state, value) {
      state.tencentSmsToNumber.push(value);
    },

    UPDATE_TENCENT_SMS_TO_NUMBER_ENTRY(state, { entry, index }) {
      if (!state.tencentSmsToNumber) return;
      state.tencentSmsToNumber[index] = entry;
    },

    REMOVE_TENCENT_SMS_TO_NUMBER_ENTRY(state, entry) {
      state.tencentSmsToNumber = state.tencentSmsToNumber.filter(b => b !== entry);
    },

    UPDATE_TENCENT_SMS_REGION(state, tencentSmsRegion) {
      state.tencentSmsRegion = tencentSmsRegion;
    },

    UPDATE_TENCENT_SMS_SIGN_NAME(state, tencentSmsSignName) {
      state.tencentSmsSignName = tencentSmsSignName;
    },

    UPDATE_TENCENT_SMS_TEMPLATE_ID(state, tencentSmsTemplateId) {
      state.tencentSmsTemplateId = tencentSmsTemplateId;
    },

    UPDATE_TENCENT_SMS_TEMPLATE_PARM(state, tencentSmsTemplateParm) {
      state.tencentSmsTemplateParm = tencentSmsTemplateParm;
    },

    ADD_TENCENT_SMS_TEMPLATE_PARM_ENTRY(state) {
      state.tencentSmsTemplateParm.push('');
    },

    ADD_TENCENT_SMS_TEMPLATE_PARM_ENTRY_VALUE(state, value) {
      state.tencentSmsTemplateParm.push(value);
    },

    UPDATE_TENCENT_SMS_TEMPLATE_PARM_ENTRY(state, { entry, index }) {
      if (!state.tencentSmsTemplateParm) return;
      state.tencentSmsTemplateParm[index] = entry;
    },

    REMOVE_TENCENT_SMS_TEMPLATE_PARM_ENTRY(state, entry) {
      state.tencentSmsTemplateParm = state.tencentSmsTemplateParm.filter(b => b !== entry);
    },

    /* TheHive */
    UPDATE_HIVE_ALERT_CONFIG_TITLE(state, hiveAlertConfigTitle) {
      state.hiveAlertConfigTitle = hiveAlertConfigTitle;
    },

    UPDATE_HIVE_ALERT_CONFIG_TYPE(state, hiveAlertConfigType) {
      state.hiveAlertConfigType = hiveAlertConfigType;
    },

    UPDATE_HIVE_ALERT_CONFIG_SOURCE(state, hiveAlertConfigSource) {
      state.hiveAlertConfigSource = hiveAlertConfigSource;
    },

    UPDATE_HIVE_ALERT_CONFIG_DESCRIPTION(state, hiveAlertConfigDescription) {
      state.hiveAlertConfigDescription = hiveAlertConfigDescription;
    },

    UPDATE_HIVE_ALERT_CONFIG_SEVERITY(state, hiveAlertConfigSeverity) {
      state.hiveAlertConfigSeverity = hiveAlertConfigSeverity;
    },

    UPDATE_HIVE_ALERT_CONFIG_TAGS(state, hiveAlertConfigTags) {
      state.hiveAlertConfigTags = hiveAlertConfigTags;
    },

    ADD_HIVE_ALERT_CONFIG_TAGS_ENTRY(state) {
      state.hiveAlertConfigTags.push('');
    },

    ADD_HIVE_ALERT_CONFIG_TAGS_ENTRY_VALUE(state, value) {
      state.hiveAlertConfigTags.push(value);
    },

    REMOVE_HIVE_ALERT_CONFIG_TAGS_ENTRY(state, entry) {
      state.hiveAlertConfigTags = state.hiveAlertConfigTags.filter(b => b !== entry);
    },

    UPDATE_HIVE_ALERT_CONFIG_TAGS_ENTRY(state, { entry, index }) {
      if (!state.hiveAlertConfigTags) return;
      state.hiveAlertConfigTags[index] = entry;
    },

    UPDATE_HIVE_ALERT_CONFIG_TLP(state, hiveAlertConfigTlp) {
      state.hiveAlertConfigTlp = hiveAlertConfigTlp;
    },

    UPDATE_HIVE_ALERT_CONFIG_STATUS(state, hiveAlertConfigStatus) {
      state.hiveAlertConfigStatus = hiveAlertConfigStatus;
    },

    UPDATE_HIVE_ALERT_CONFIG_FOLLOW(state, hiveAlertConfigFollow) {
      state.hiveAlertConfigFollow = hiveAlertConfigFollow;
    },

    /* Twilio */
    UPDATE_TWILIO_ACCOUNT_SID(state, twilioAccountSid) {
      state.twilioAccountSid = twilioAccountSid;
    },

    UPDATE_TWILIO_AUTH_TOKEN(state, twilioAuth) {
      state.twilioAuth = twilioAuth;
    },

    UPDATE_TWILIO_TO_NUMBER(state, twilioToNumber) {
      state.twilioToNumber = twilioToNumber;
    },

    UPDATE_TWILIO_FROM_NUMBER(state, twilioFromNumber) {
      state.twilioFromNumber = twilioFromNumber;
    },

    UPDATE_TWILIO_MESSAGE_SERVICE_SID(state, twilioMessageServiceSid) {
      state.twilioMessageServiceSid = twilioMessageServiceSid;
    },

    /* VictorOps */
    UPDATE_VICTOROPS_API_KEY(state, victoropsApiKey) {
      state.victoropsApiKey = victoropsApiKey;
    },

    UPDATE_VICTOROPS_ROUTING_KEY(state, victoropsRoutingKey) {
      state.victoropsRoutingKey = victoropsRoutingKey;
    },

    UPDATE_VICTOROPS_MESSAGE_TYPE(state, victoropsMessageType) {
      state.victoropsMessageType = victoropsMessageType;
    },

    UPDATE_VICTOROPS_ENTITY_ID(state, victoropsEntityId) {
      state.victoropsEntityId = victoropsEntityId;
    },

    UPDATE_VICTOROPS_ENTITY_DISPLAY_NAME(state, victoropsEntityDisplayName) {
      state.victoropsEntityDisplayName = victoropsEntityDisplayName;
    },

    UPDATE_VICTOROPS_PROXY(state, victoropsProxy) {
      state.victoropsProxy = victoropsProxy;
    },

    /* WorkWechat */
    UPDATE_WORK_WECHAT_BOT_ID(state, workWechatBotId) {
      state.workWechatBotId = workWechatBotId;
    },

    UPDATE_WORK_WECHAT_MSGTYPE(state, workWechatMsgtype) {
      state.workWechatMsgtype = workWechatMsgtype;
    },

    /* Zabbix */
    UPDATE_ZBX_SENDER_HOST(state, zbxSenderHost) {
      state.zbxSenderHost = zbxSenderHost;
    },

    UPDATE_ZBX_SENDER_PORT(state, zbxSenderPort) {
      state.zbxSenderPort = zbxSenderPort;
    },

    UPDATE_ZBX_HOST(state, zbxHost) {
      state.zbxHost = zbxHost;
    },

    UPDATE_ZBX_KEY(state, zbxKey) {
      state.zbxKey = zbxKey;
    },

    UPDATE_ZBX_HOST_FROM_FIELD(state, zbxHostFromField) {
      state.zbxHostFromField = zbxHostFromField;
    }
  }
};
