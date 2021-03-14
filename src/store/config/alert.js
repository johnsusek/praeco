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

    generateKibanaDiscoverUrl: false,
    kibanaDiscoverAppUrl: '',
    kibanaDiscoverVersion: '',
    kibanaDiscoverIndexPatternId: '',
    kibanaDiscoverColumns: [],
    kibanaDiscoverFromTimedelta: { minutes: 10 },
    kibanaDiscoverToTimedelta: { minutes: 10 },

    subject: '',
    body: '',
    bodyType: 'alert_text_only',

    /* Slack */
    slackChannelOverride: '',
    slackUsernameOverride: 'Praeco',
    slackEmojiOverride: '',
    slackMsgColor: 'danger',
    slackParseOverride: 'none',
    slackTextString: '',
    slackIgnoreSslErrors: false,
    slackCaCerts: '',
    slackIconUrlOverride: '',
    slackTimeout: 10,
    slackAttachKibanaDiscoverUrl: false,
    slackKibanaDiscoverColor: '#ec4b98',
    slackKibanaDiscoverTitle: 'Discover in Kibana',
    slackProxy: '',

    /* MS Teams */
    ms_teamsWebhookUrl: '',
    ms_teamsThemeColor: '#ff0000',
    ms_teamsAlertFixedWidth: false,
    ms_teamsAlertSummary: 'ElastAlert Message',
    ms_teamsProxy: '',

    /* Telegram */
    telegramRoomId: '',
    telegramProxy: '',
    telegramProxyLogin: '',
    telegramProxyPass: '',

    /* Exotel */
    exotelAccountSid: '',
    exotelAuthToken: '',
    exotelToNumber: '',
    exotelFromNumber: '',
    exotelMessageBody: '',

    /* Twilio */
    twilioAccountSid: '',
    twilioAuth: '',
    twilioToNumber: '',
    twilioFromNumber: '',

    /* PagerTree */
    pagertreeIntegrationUrl: '',

    /* AWS SNS */
    snsTopicArn: '',
    snsAwsAccessKeyId: '',
    snsAwsSecretAccessKey: '',
    snsAwsRegion: '',
    snsAwsProfile: '',

    /* Zabbix */
    zbxSenderHost: 'localhost',
    zbxSenderPort: 10051,
    zbxHost: '',
    zbxKey: '',

    /* Line Notify */
    linenotifyAccessToken: '',

    /* Command */
    command: [],
    pipeMatchJson: false,
    pipeAlertText: false,

    /* Gitter */
    gitterWebhookUrl: '',
    gitterMsgLevel: 'error',
    gitterProxy: '',

    /* Jira */
    jiraProject: '',
    jiraIssueType: '',
    jiraComponents: '',

    /* Chatwork */
    chatworkApikey: '',
    chatworkRoomId: '',

    /* Discord */
    discordWebhookUrl: '',
    discordEmojiTitle: '',
    discordEmbedFooter: '',
    discordEmbedIconUrl: '',

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

    /* VictorOps */
    victoropsApiKey: '',
    victoropsRoutingKey: '',
    victoropsMessageType: '',
    victoropsEntityId: '',
    victoropsEntityDisplayName: '',
    victoropsProxy: '',

    /* Stomp */
    stompHostname: '',
    stompHostport: '',
    stompLogin: '',
    stompPassword: '',
    stompDestination: '',
    stompSsl: false,

    /* GoogleChat */
    googleChatWebhookUrl: '',
    googleChatFormat: 'basic',
    googleChatHeaderTitle: '',

    /* Mattermost */
    mattermostChannelOverride: '',
    mattermostUsernameOverride: 'Praeco',
    mattermostMsgColor: 'danger',
    mattermostIconUrlOverride: '',
    mattermostMsgPretext: '',
    mattermostIgnoreSslErrors: false,
    mattermostProxy: '',

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
    // TODO:
    // emailFormat: false,

    /* HTTP POST */
    httpPostUrl: '',
    httpPostTimeout: '',
    httpPostProxy: '',
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

    /* HTTP POST */
    UPDATE_HTTP_POST_URL(state, httpPostUrl) {
      state.httpPostUrl = httpPostUrl;
    },

    UPDATE_HTTP_POST_TIMEOUT(state, httpPostTimeout) {
      state.httpPostTimeout = httpPostTimeout;
    },

    UPDATE_HTTP_POST_PROXY(state, httpPostProxy) {
      state.httpPostProxy = httpPostProxy;
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

    // TODO:
    // UPDATE_EMAIL_FORMAT(state, emailFormat) {
    //   state.emailFormat = emailFormat;
    // },

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

    /* Chatwork */
    UPDATE_CHATWORK_API_KEY(state, chatworkApikey) {
      state.chatworkApikey = chatworkApikey;
    },

    UPDATE_CHATWORK_ROOM_ID(state, chatworkRoomId) {
      state.chatworkRoomId = chatworkRoomId;
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

    /* Pagertree */
    UPDATE_PAGERTREE_INTEGRATION_URL(state, pagertreeIntegrationUrl) {
      state.pagertreeIntegrationUrl = pagertreeIntegrationUrl;
    },

    /* AWS SNS */
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

    /* LineNotify */
    UPDATE_LINENOTIFY_ACCESS_TOKEN(state, linenotifyAccessToken) {
      state.linenotifyAccessToken = linenotifyAccessToken;
    },

    /* Command */
    UPDATE_COMMAND(state, command) {
      state.command = command;
    },

    UPDATE_PIPE_MATCH_JSON(state, pipeMatchJson) {
      state.pipeMatchJson = pipeMatchJson;
    },

    UPDATE_PIPE_ALERT_TEXT(state, pipeAlertText) {
      state.pipeAlertText = pipeAlertText;
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

    UPDATE_STOMP_SSL(state, stompSsl) {
      state.stompSsl = stompSsl;
    },

    /* GoogleChat */
    UPDATE_GOOGLE_CHAT_WEBHOOK_URL(state, googleChatWebhookUrl) {
      state.googleChatWebhookUrl = googleChatWebhookUrl;
    },

    UPDATE_GOOGLE_CHAT_FORMAT(state, googleChatFormat) {
      state.googleChatFormat = googleChatFormat;
    },

    UPDATE_GOOGLE_CHAT_HEADER_TITLE(state, googleChatHeaderTitle) {
      state.googleChatHeaderTitle = googleChatHeaderTitle;
    },

    /* Mattermost */
    UPDATE_MATTERMOST_CHANNEL_OVERRIDE(state, mattermostChannelOverride) {
      state.mattermostChannelOverride = mattermostChannelOverride;
    },

    UPDATE_MATTERMOST_USERNAME_OVERRIDE(state, mattermostUsernameOverride) {
      state.mattermostUsernameOverride = mattermostUsernameOverride;
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

    /* Slack */
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

    /* MS Teams */
    UPDATE_MS_TEAMS_WEBHOOK_URL(state, ms_teamsWebhookUrl) {
      state.ms_teamsWebhookUrl = ms_teamsWebhookUrl;
    },

    UPDATE_MS_TEAMS_THEME_COLOR(state, ms_teamsThemeColor) {
      state.ms_teamsThemeColor = ms_teamsThemeColor;
    },

    UPDATE_MS_TEAMS_ALERT_FIXED_WIDTH(state, ms_teamsAlertFixedWidth) {
      state.ms_teamsAlertFixedWidth = ms_teamsAlertFixedWidth;
    },

    UPDATE_MS_TEAMS_ALERT_SUMMARY(state, ms_teamsAlertSummary) {
      state.ms_teamsAlertSummary = ms_teamsAlertSummary;
    },

    UPDATE_MS_TEAMS_PROXY(state, ms_teamsProxy) {
      state.ms_teamsProxy = ms_teamsProxy;
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
