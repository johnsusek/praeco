<template>
  <el-form
    ref="form"
    :rules="rules"
    :model="$store.state.config.alert"
    label-position="top"
    @submit.native.prevent>
    <el-row class="m-s-sm">
      <el-col :span="aggregationSchedule ? 24 : 12">
        <ConfigAggregation ref="aggregation" :view-only="viewOnly" />
      </el-col>
      <el-col v-if="!aggregationSchedule" :span="12">
        <el-form-item :class="{'view-only': viewOnly }" label="Re-alert">
          <ElastalertTimeView v-if="viewOnly" :time="realert" />
          <ElastalertTimePicker
            v-else-if="realert"
            id="realert"
            :allow-zero="true"
            :unit="Object.keys(realert)[0]"
            :amount="Object.values(realert)[0]"
            @input="updateRealert" />
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

    <!-- time_window_change  -->
    <el-row class="m-s-sm">
      <el-col :span="19">
        <ConfigTimeWindowFeature ref="timeWindowFeature" :view-only="viewOnly" />
      </el-col>
    </el-row>

    <el-row class="m-s-sm">
      <el-col :span="enableLimitExcecution ? 6 : 24">
        <el-form-item label="Limit Excecution">
          <el-switch
            id="enableLimitExcecution"
            v-model="enableLimitExcecution"
            :disabled="viewOnly"
            @change="changeLimitExcecution" />
          <label>Limit Excecution Setting.</label>
        </el-form-item>
      </el-col>

      <el-col v-if="enableLimitExcecution" :span="20">
        <el-form-item label="" prop="limitExcecution">
          <div v-if="!viewOnly" class="limit-excecution">
            <VueCronEditorBuefy v-model="limitExcecution" /><br>
            {{ limitExcecution }}
          </div>
          <div v-else>
            {{ limitExcecution }}
          </div>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row class="m-s-sm">
      <el-col :span="24">
        <ConfigKibanaDiscover ref="kibanaDiscover" :view-only="viewOnly" />
      </el-col>
    </el-row>

    <el-form-item
      v-if="!viewOnly"
      :label="`Destination${alert.length > 1 ? 's' : ''}`"
      prop="alert"
      required>
      <el-checkbox-group v-model="alert" :disabled="viewOnly" @change="$emit('validate')">
        <el-checkbox id="destinationSlack" label="slack" border>
          Slack
        </el-checkbox>
        <el-checkbox id="destinationMsTeams" label="ms_teams" border>
          MS Teams
        </el-checkbox>
        <el-checkbox id="destinationEmail" label="email" border>
          Email
        </el-checkbox>
        <el-checkbox id="destinationPost" label="post" border>
          HTTP
        </el-checkbox>
        <el-checkbox id="destinationTelegram" label="telegram" border>
          Telegram
        </el-checkbox>
        <el-checkbox id="destinationJira" label="jira" border>
          JIRA
        </el-checkbox>
        <el-checkbox id="destinationGoogleChats" label="googlechat" border>
          GOOGLE CHAT
        </el-checkbox>
        <el-checkbox id="destinationlineNotify" label="linenotify" border>
          LineNotify
        </el-checkbox>
        <el-checkbox id="destinationMattermost" label="mattermost" border>
          Mattermost
        </el-checkbox>
        <el-checkbox id="destinationCommand" label="command" border>
          Command
        </el-checkbox>
        <el-checkbox id="destinationGitter" label="gitter" border>
          Gitter
        </el-checkbox>
        <el-checkbox id="destinationSns" label="sns" border>
          SNS
        </el-checkbox>
        <el-checkbox id="destinationZabbix" label="zabbix" border>
          Zabbix
        </el-checkbox>
        <el-checkbox id="destinationTwilio" label="twilio" border>
          Twilio
        </el-checkbox>
        <el-checkbox id="destinationPagerTree" label="pagertree" border>
          PagerTree
        </el-checkbox>
        <el-checkbox id="destinationExotel" label="exotel" border>
          Exotel
        </el-checkbox>
        <el-checkbox id="destinationStomp" label="stomp" border>
          Stomp
        </el-checkbox>
        <el-checkbox id="destinationVictorOps" label="victorops" border>
          VictorOps
        </el-checkbox>
        <el-checkbox id="destinationServiceNow" label="servicenow" border>
          ServiceNow
        </el-checkbox>
        <el-checkbox id="destinationChatwork" label="chatwork" border>
          Chatwork
        </el-checkbox>
        <el-checkbox id="destinationDiscord" label="discord" border>
          Discord
        </el-checkbox>
        <el-checkbox id="destinationHivealerter" label="hivealerter" border>
          TheHive
        </el-checkbox>
        <el-checkbox id="destinationAlerta" label="alerta" border>
          Alerta
        </el-checkbox>
        <el-checkbox id="destinationDatadog" label="datadog" border>
          Datadog
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-tabs v-if="alert.length" v-model="visibleTabPane" class="border-card-plain m-n-sm" type="card">
      <el-tab-pane v-if="alert.includes('slack') || alert.includes('email') || alert.includes('ms_teams') ||
        alert.includes('telegram') || alert.includes('jira') || alert.includes('mattermost') ||
        alert.includes('sns') || alert.includes('pagertree') || alert.includes('gitter') || alert.includes('googlechat') ||
        alert.includes('chatwork') || alert.includes('discord') || alert.includes('hivealerter') ||
        alert.includes('alerta') || alert.includes('datadog')">
        <template slot="label">
          <icon :icon="['fa', 'bell']" size="1x" /> Alert
        </template>
        <ConfigAlertSubjectBody
          ref="subjectBody"
          :view-only="viewOnly"
          class="m-s-lg" />
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('slack')">
        <template slot="label">
          <icon :icon="['fab', 'slack']" size="1x" /> Slack
        </template>
        <el-form-item label="Channel or username" prop="slackChannelOverride" required>
          <el-input id="slackChannelOverride" v-model="slackChannelOverride" :disabled="viewOnly" />
          <label>
            The @username or #channel to send the alert. Tip: Create new channels
            for your alerts, to have fine-grained control of Slack notifications.
          </label>
        </el-form-item>

        <praeco-form-item label="Post as" prop="slackUsernameOverride" required>
          <el-input id="slackUsernameOverride" v-model="slackUsernameOverride" :disabled="viewOnly" />
          <label>This is the username that will appear in Slack for the alert</label>
        </praeco-form-item>

        <praeco-form-item
          v-if="!(viewOnly && !slackEmojiOverride)"
          :class="{ 'disabled': viewOnly }"
          label="Icon"
          prop="slackEmojiOverride">
          <picker
            :emoji="slackEmojiOverride || 'arrow_up'"
            :title="slackEmojiOverride || 'Pick your icon...'"
            color="#189acc"
            @select="addEmoji" />
        </praeco-form-item>

        <el-form-item label="Message color" prop="slackMsgColor" required>
          <el-radio-group v-model="slackMsgColor" :disabled="viewOnly">
            <el-radio id="slackMsgColorDanger" label="danger" border class="slack-danger">
              Danger
            </el-radio>
            <el-radio id="slackMsgColorWarning" label="warning" border class="slack-warning">
              Warning
            </el-radio>
            <el-radio id="slackMsgColorGood" label="good" border class="slack-good">
              Good
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Parse Override" prop="slackParseOverride">
          <el-radio-group v-model="slackParseOverride" :disabled="viewOnly">
            <el-radio id="slackParseOverrideNone" label="none" border>
              none
            </el-radio>
            <el-radio id="slackParseOverrideFull" label="full" border>
              full
            </el-radio>
          </el-radio-group>
          <label>By default the notification message is escaped ‘none’. You can also use ‘full’.</label>
        </el-form-item>

        <el-form-item label="Text String" prop="slackTextString">
          <el-input id="slackTextString" v-model="slackTextString" :disabled="viewOnly" />
          <label>Notification message you want to add.</label>
        </el-form-item>

        <el-form-item label="Ignore SSL Errors" prop="slackIgnoreSslErrors">
          <el-switch
            id="slackIgnoreSslErrors"
            v-model="slackIgnoreSslErrors"
            :disabled="viewOnly"
            @change="changeSlackIgnoreSslErrors" />
        </el-form-item>

        <el-form-item label="Icon URL Override" prop="slackIconUrlOverride">
          <el-input id="slackIconUrlOverride" v-model="slackIconUrlOverride" :disabled="viewOnly" />
          <label>
            By default ElastAlert will use the default webhook icon when posting to the channel.
            You can provide icon_url to use custom image.
            Provide absolute address of the picture or Base64 data url.
          </label>
        </el-form-item>

        <el-form-item label="CA Certs" prop="slackCaCerts">
          <el-switch
            id="slackCaCerts"
            v-model="slackCaCerts"
            :disabled="viewOnly"
            @change="changeSlackCaCerts" />
        </el-form-item>

        <el-form-item label="Timeout" prop="slackTimeout">
          <el-input-number id="slackTimeout" v-model="slackTimeout" :disabled="viewOnly" />
          <label>
            You can specify a timeout value, in seconds, for making communicating with Slack.
            The default is 10. If a timeout occurs, the alert will be retried next time elastalert cycles.
          </label>
        </el-form-item>

        <el-form-item label="Attach Kibana Discover URL" prop="slackAttachKibanaDiscoverUrl">
          <el-switch
            id="slackAttachKibanaDiscoverUrl"
            v-model="slackAttachKibanaDiscoverUrl"
            :disabled="viewOnly"
            @change="changeSlackAttachKibanaDiscoverUrl" />
        </el-form-item>

        <el-form-item label="Kibana Discover Color" prop="slackKibanaDiscoverColor">
          <el-color-picker
            v-model="slackKibanaDiscoverColor" :disabled="viewOnly" />
          <label>The color of the Kibana Discover url attachment.</label>
        </el-form-item>

        <el-form-item label="Kibana Discover Title" prop="slackKibanaDiscoverTitle">
          <el-input v-model="slackKibanaDiscoverTitle" :disabled="viewOnly" />
          <label>The title of the Kibana Discover url attachment.</label>
        </el-form-item>

        <el-form-item label="Proxy" prop="slackProxy">
          <el-input id="slackProxy" v-model="slackProxy" :disabled="viewOnly" />
          <label>
            By default ElastAlert will not use a network proxy to send notifications to Slack.
            Set this option using hostname:port if you need to use a proxy.
          </label>
        </el-form-item>

        <el-form-item label="Footer" prop="slackFooter">
          <el-input v-model="slackFooter" :disabled="viewOnly" />
          <label>Add a static footer text for alert.</label>
        </el-form-item>

        <el-form-item label="Footer Icon" prop="slackFooterIcon">
          <el-input v-model="slackFooterIcon" :disabled="viewOnly" />
          <label>A Public Url for a footer icon.</label>
        </el-form-item>

        <el-form-item label="Image URL" prop="slackImageUrl">
          <el-input v-model="slackImageUrl" :disabled="viewOnly" />
          <label>An optional URL to an image file (GIF, JPEG, PNG, BMP, or SVG).</label>
        </el-form-item>

        <el-form-item label="Thumb URL" prop="slackThumbUrl">
          <el-input v-model="slackThumbUrl" :disabled="viewOnly" />
          <label>An optional URL to an image file (GIF, JPEG, PNG, BMP, or SVG) that is displayed as thumbnail.</label>
        </el-form-item>

        <el-form-item label="Author Name" prop="slackAuthorName">
          <el-input v-model="slackAuthorName" :disabled="viewOnly" />
          <label>An optional name used to identify the author.</label>
        </el-form-item>

        <el-form-item label="Author Link" prop="slackAuthorLink">
          <el-input v-model="slackAuthorLink" :disabled="viewOnly" />
          <label>An optional URL used to hyperlink the author_name.</label>
        </el-form-item>

        <el-form-item label="Author Icon" prop="slackAuthorIcon">
          <el-input v-model="slackAuthorIcon" :disabled="viewOnly" />
          <label>An optional URL used to display a 16x16 pixel icon beside the author_name.</label>
        </el-form-item>

        <el-form-item label="Msg Pretext" prop="slackMsgPretext">
          <el-input v-model="slackMsgPretext" :disabled="viewOnly" />
          <label>You can set the message attachment pretext using this option.</label>
        </el-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('email')">
        <span slot="label"><icon icon="envelope" size="1x" /> Email</span>
        <praeco-form-item
          v-if="!viewOnly || fromAddr"
          :value="fromAddr"
          label="From address"
          prop="fromAddr">
          <el-input v-model="fromAddr" :disabled="viewOnly" />
          <label>
            This sets the From header in the email.
            By default, the from address is ElastAlert@
            and the domain will be set by the smtp server.
          </label>
        </praeco-form-item>

        <praeco-form-item
          v-if="!viewOnly || replyTo"
          :value="replyTo"
          label="Reply to"
          prop="replyTo">
          <el-input v-model="replyTo" :disabled="viewOnly" />
          <label>
            This sets the Reply-To header in the email.
            By default, the from address is ElastAlert@ and the
            domain will be set by the smtp server.
          </label>
        </praeco-form-item>

        <el-form-item label="To" prop="email" required>
          <el-input v-model="email" :disabled="viewOnly" />
          <label>Comma separated list of email addresses</label>
        </el-form-item>

        <el-form-item v-if="!viewOnly || cc" label="CC" prop="cc">
          <el-input v-model="cc" :disabled="viewOnly" />
          <label>Comma separated list of email addresses</label>
        </el-form-item>

        <el-form-item v-if="!viewOnly || bcc" label="BCC" prop="bcc">
          <el-input v-model="bcc" :disabled="viewOnly" />
          <label>Comma separated list of email addresses</label>
        </el-form-item>

        <el-form-item label="SMTP SSL" prop="smtpSsl">
          <el-switch
            id="smtpSsl"
            v-model="smtpSsl"
            :disabled="viewOnly"
            @change="changeSmtpSsl" />
          <label>
            Connect the SMTP host using TLS, defaults to false.
            If smtp_ssl is not used, ElastAlert will still attempt STARTTLS.
          </label>
        </el-form-item>

        <el-form-item label="SMTP Host" prop="smtpHost">
          <el-input v-model="smtpHost" :disabled="viewOnly" />
          <label>The SMTP host to use, defaults to localhost.</label>
        </el-form-item>

        <el-form-item label="SMTP Port" prop="smtpPort">
          <el-input-number id="smtpPort" v-model="smtpPort" :disabled="viewOnly" />
          <label>The port to use. Default is 25.</label>
        </el-form-item>

        <el-form-item label="SMTP Auth File" prop="smtpAuthFile">
          <el-input v-model="smtpAuthFile" :disabled="viewOnly" />
          <label>
            The path to a file which contains SMTP authentication credentials.
            The path can be either absolute or relative to the given rule.
            It should be YAML formatted and contain two fields, user and password.
            If this is not present, no authentication will be attempted.
          </label>
        </el-form-item>

        <el-form-item label="SMTP Key File" prop="smtpKeyFile">
          <el-input v-model="smtpKeyFile" :disabled="viewOnly" />
          <label>Connect the SMTP host using the given path to a TLS key file, default to None.</label>
        </el-form-item>

        <el-form-item label="SMTP Cert File" prop="smtpCertFile">
          <el-input v-model="smtpCertFile" :disabled="viewOnly" />
          <label> Connect the SMTP host using the given path to a TLS certificate file, default to None.</label>
        </el-form-item>

        <el-form-item label="Email From Field" prop="emailFromField">
          <el-input v-model="emailFromField" :disabled="viewOnly" />
        </el-form-item>

        <el-form-item label="Email Add Domain" prop="emailAddDomain">
          <el-input v-model="emailAddDomain" :disabled="viewOnly" />
        </el-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('post')" label="HTTP">
        <span slot="label"><icon icon="globe" /> HTTP</span>
        <el-form-item label="HTTP POST URL" prop="httpPostUrl" required>
          <el-input v-model="httpPostUrl" :disabled="viewOnly" />
          <label>JSON results will be POSTed to this URL</label>
        </el-form-item>

        <el-form-item label="Timeout" prop="httpPostTimeout">
          <el-input-number id="httpPostTimeout" v-model="httpPostTimeout" :disabled="viewOnly" />
          <label>
            The timeout value, in seconds, for making the post.
            The default is 10.
            If a timeout occurs, the alert will be retried next time elastalert cycles.
          </label>
        </el-form-item>

        <el-form-item label="Proxy" prop="httpPostProxy">
          <el-input id="httpPostProxy" v-model="httpPostProxy" :disabled="viewOnly" />
          <label>URL of proxy, if required.</label>
        </el-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('ms_teams')">
        <template slot="label">
          <icon :icon="['fab', 'microsoft']" size="1x" /> MS Teams
        </template>
        <el-form-item label="Team webhook" prop="ms_teamsWebhookUrl" required>
          <el-input id="ms_teamsWebhookUrl" v-model="ms_teamsWebhookUrl" :disabled="viewOnly" />
          <label>
            See<a href="https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook">
              https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook</a>
          </label>
        </el-form-item>

        <el-form-item label="Color" prop="ms_teamsThemeColor" required>
          <el-color-picker id="ms_teamsThemeColor" v-model="ms_teamsThemeColor" :disabled="viewOnly" />
        </el-form-item>

        <el-form-item label="Alert Summary" prop="ms_teamsAlertSummary" required>
          <el-input id="ms_teamsAlertSummary" v-model="ms_teamsAlertSummary" :disabled="viewOnly" />
          <label>
            Summary should be configured according to MS documentation, although it seems not displayed by Teams currently.
          </label>
        </el-form-item>

        <el-form-item label="Alert Fixed Width" prop="ms_teamsAlertFixedWidth">
          <el-switch
            id="ms_teamsAlertFixedWidth"
            v-model="ms_teamsAlertFixedWidth"
            :disabled="viewOnly"
            @change="changemsTeamsAlertFixedWidth" />
          <label>
            By default this is False and the notification will be sent to MS Teams as-is.
            Teams supports a partial Markdown implementation, which means asterisk, underscore and other characters may be interpreted as Markdown.
            Currenlty, Teams does not fully implement code blocks. Setting this attribute to True will enable line by line code blocks.
            It is recommended to enable this to get clearer notifications in Teams.
          </label>
        </el-form-item>

        <el-form-item label="Proxy" prop="ms_teamsProxy">
          <el-input id="ms_teamsProxy" v-model="ms_teamsProxy" :disabled="viewOnly" />
          <label>
            By default ElastAlert will not use a network proxy to send notifications to MS Teams.
            Set this option using hostname:port if you need to use a proxy.
          </label>
        </el-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('telegram')">
        <template slot="label">
          <icon :icon="['fab', 'telegram']" size="1x" /> Telegram
        </template>

        <praeco-form-item label="Room ID" prop="telegramRoomId" required>
          <el-input id="telegramRoomId" v-model="telegramRoomId" :disabled="viewOnly" />
          <label>
            Unique identifier for the target chat or username of the
            target channel using telegram chat_id (in the format “-xxxxxxxx”)
          </label>
        </praeco-form-item>

        <praeco-form-item label="Proxy" prop="telegramProxy">
          <el-input id="telegramProxy" v-model="telegramProxy" :disabled="viewOnly" />
          <label>
            By default ElastAlert will not use a network proxy to send notifications to Telegram.
            Set this option using hostname:port if you need to use a proxy.
          </label>
        </praeco-form-item>

        <praeco-form-item label="Proxy Login" prop="telegramProxyLogin">
          <el-input id="telegramProxyLogin" v-model="telegramProxyLogin" :disabled="viewOnly" />
          <label>The Telegram proxy auth username.</label>
        </praeco-form-item>

        <praeco-form-item label="Proxy Password" prop="telegramProxyPass">
          <el-input id="telegramProxyPass" v-model="telegramProxyPass" :disabled="viewOnly" />
          <label>The Telegram proxy auth password.</label>
        </praeco-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('jira')">
        <template slot="label">
          <icon :icon="['fab', 'jira']" size="1x" /> JIRA
        </template>

        <praeco-form-item label="Project" prop="jiraProject" required>
          <el-input id="jiraProject" v-model="jiraProject" :disabled="viewOnly" />
          <label>Jira project</label>
        </praeco-form-item>
        <praeco-form-item label="Issue type" prop="jiraIssueType" required>
          <el-input id="jiraIssueType" v-model="jiraIssueType" :disabled="viewOnly" />
          <label>Jira issue type (Bug, Integration Bug, etc...)</label>
        </praeco-form-item>
        <praeco-form-item label="Components" prop="jiraComponents">
          <el-input id="jiraComponents" v-model="jiraComponents" :disabled="viewOnly" />
          <label>Jira issue components</label>
        </praeco-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('googlechat')">
        <template slot="label">
          GOOGLE CHAT
        </template>

        <praeco-form-item label="GoogleChat Webhook" prop="googleChatWebhookUrl" required>
          <el-input id="googleChatWebhookUrl" v-model="googleChatWebhookUrl" :disabled="viewOnly" />
          <label>Google Webhook Url</label>
        </praeco-form-item>
        <praeco-form-item label="GoogleChat Format" prop="googleChatFormat" required>
          <el-radio-group v-model="googleChatFormat" :disabled="viewOnly">
            <el-radio id="googleChatFormatBasic" label="basic" border>
              basic
            </el-radio>
            <el-radio id="googleChatFormatCard" label="card" border>
              card
            </el-radio>
          </el-radio-group>
        </praeco-form-item>

        <div v-if="googleChatFormat === 'card'">
          <praeco-form-item label="Header Title" prop="googleChatHeaderTitle">
            <el-input id="googleChatHeaderTitle" v-model="googleChatHeaderTitle" :disabled="viewOnly" />
            <label>GoogleChat Header Title</label>
          </praeco-form-item>

          <praeco-form-item label="Header Subtitle" prop="googleChatHeaderSubtitle">
            <el-input id="googleChatHeaderSubtitle" v-model="googleChatHeaderSubtitle" :disabled="viewOnly" />
            <label>Sets the text for the card header subtitle.</label>
          </praeco-form-item>

          <praeco-form-item label="Header Image" prop="googleChatHeaderImage">
            <el-input id="googleChatHeaderImage" v-model="googleChatHeaderImage" :disabled="viewOnly" />
            <label>URL for the card header icon.</label>
          </praeco-form-item>

          <praeco-form-item label="Footer Kibanalink" prop="googleFooterKibanalink">
            <el-input id="googleFooterKibanalink" v-model="googleFooterKibanalink" :disabled="viewOnly" />
            <label>URL to Kibana to include in the card footer.</label>
          </praeco-form-item>
        </div>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('linenotify')">
        <template slot="label">
          <icon :icon="['fab', 'line']" size="1x" /> Line Notify
        </template>

        <praeco-form-item label="Access Token" prop="linenotifyAccessToken" required>
          <el-input id="linenotifyAccessToken" v-model="linenotifyAccessToken" :disabled="viewOnly" />
          <label>The access token that you got from https://notify-bot.line.me/my/</label>
        </praeco-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('mattermost')">
        <template slot="label">
          Mattermost
        </template>
        <el-form-item label="Channel or username" prop="mattermostChannelOverride" required>
          <el-input id="mattermostChannelOverride" v-model="mattermostChannelOverride" :disabled="viewOnly" />
          <label>
            The @username or #channel to send the alert. Tip: Create new channels
            for your alerts, to have fine-grained control of Mattermost notifications.
          </label>
        </el-form-item>

        <praeco-form-item label="Post as" prop="mattermostUsernameOverride" required>
          <el-input id="mattermostUsernameOverride" v-model="mattermostUsernameOverride" :disabled="viewOnly" />
          <label>This is the username that will appear in Mattermost for the alert</label>
        </praeco-form-item>

        <el-form-item label="Message color" prop="mattermostMsgColor" required>
          <el-radio-group v-model="mattermostMsgColor" :disabled="viewOnly">
            <el-radio id="mattermostMsgColorDanger" label="danger" border class="mattermost-danger">
              Danger
            </el-radio>
            <el-radio id="mattermostMsgColorWarning" label="warning" border class="mattermost-warning">
              Warning
            </el-radio>
            <el-radio id="mattermostMsgColorGood" label="good" border class="mattermost-good">
              Good
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Ignore SSL Errors" prop="mattermostIgnoreSslErrors">
          <el-switch
            id="mattermostIgnoreSslErrors"
            v-model="mattermostIgnoreSslErrors"
            :disabled="viewOnly"
            @change="changeMattermostIgnoreSslErrors" />
        </el-form-item>

        <el-form-item label="Icon URL Override" prop="mattermostIconUrlOverride">
          <el-input id="mattermostIconUrlOverride" v-model="mattermostIconUrlOverride" :disabled="viewOnly" />
          <label>
            By default ElastAlert will use the default webhook icon when posting to the channel.
            You can provide icon_url to use custom image.
            Provide absolute address of the picture or Base64 data url.
          </label>
        </el-form-item>

        <el-form-item label="Msg Pretext" prop="mattermostMsgPretext">
          <el-input id="mattermostMsgPretext" v-model="mattermostMsgPretext" :disabled="viewOnly" />
          <label>You can set the message attachment pretext using this option.</label>
        </el-form-item>

        <el-form-item label="Proxy" prop="mattermostProxy">
          <el-input id="mattermostProxy" v-model="mattermostProxy" :disabled="viewOnly" />
          <label>
            By default ElastAlert will not use a network proxy to send notifications to Mattermost.
            Set this option using hostname:port if you need to use a proxy.
          </label>
        </el-form-item>

        <el-form-item label="Title Link" prop="mattermostTitleLink">
          <el-input v-model="mattermostTitleLink" :disabled="viewOnly" />
          <label>You can add a link in your Mattermost notification by setting this to a valid URL.</label>
        </el-form-item>

        <el-form-item label="Footer" prop="mattermostFooter">
          <el-input v-model="mattermostFooter" :disabled="viewOnly" />
          <label>Add a static footer text for alert.</label>
        </el-form-item>

        <el-form-item label="Footer Icon" prop="mattermostFooterIcon">
          <el-input v-model="mattermostFooterIcon" :disabled="viewOnly" />
          <label>A Public Url for a footer icon.</label>
        </el-form-item>

        <el-form-item label="Image URL" prop="mattermostImageUrl">
          <el-input v-model="mattermostImageUrl" :disabled="viewOnly" />
          <label>An optional URL to an image file (GIF, JPEG, PNG, BMP, or SVG).</label>
        </el-form-item>

        <el-form-item label="Thumb URL" prop="mattermostThumbUrl">
          <el-input v-model="mattermostThumbUrl" :disabled="viewOnly" />
          <label>An optional URL to an image file (GIF, JPEG, PNG, BMP, or SVG) that is displayed as thumbnail.</label>
        </el-form-item>

        <el-form-item label="Author Name" prop="mattermostAuthorName">
          <el-input v-model="mattermostAuthorName" :disabled="viewOnly" />
          <label>An optional name used to identify the author.</label>
        </el-form-item>

        <el-form-item label="Author Link" prop="mattermostAuthorLink">
          <el-input v-model="mattermostAuthorLink" :disabled="viewOnly" />
          <label>An optional URL used to hyperlink the author_name.</label>
        </el-form-item>

        <el-form-item label="Author Icon" prop="mattermostAuthorIcon">
          <el-input v-model="mattermostAuthorIcon" :disabled="viewOnly" />
          <label>An optional URL used to display a 16x16 pixel icon beside the author_name.</label>
        </el-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('command')">
        <template slot="label">
          Command
        </template>

        <el-popover v-model="popCommandVisible" :class="{ 'is-invalid': !popCommandValid }">
          <span slot="reference" class="pop-trigger">
            <el-tooltip v-if="command.length" :content="command.join(', ')" placement="top">
              <span>Command ({{ command.length }})</span>
            </el-tooltip>
            <span v-else>Command ({{ command.length }})</span>
          </span>
          <template>
            <el-form
              ref="command"
              :model="$store.state.config.alert"
              label-position="top"
              style="width: 360px"
              @submit.native.prevent>
              <el-form-item
                v-for="(entry, index) in command"
                :key="index"
                :prop="'command.' + index"
                :disabled="viewOnly"
                class="el-form-item-list"
                label=""
                required>
                <el-row :gutter="5" type="flex" justify="space-between">
                  <el-col :span="20">
                    <el-input
                      v-model="command[index]"
                      :disabled="viewOnly"
                      placeholder="Tags"
                      @input="(val) => updateCommand(val, index)" />
                  </el-col>
                  <el-col :span="4">
                    <el-button
                      :disabled="viewOnly"
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      plain
                      @click="removeCommandEntry(entry)" />
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>

            <el-button :disabled="viewOnly" class="m-n-sm" @click="addCommandEntry">
              Add command
            </el-button>
          </template>
        </el-popover>

        <el-form-item label="Pipe Match Json" prop="pipeMatchJson">
          <el-switch
            id="pipeMatchJson"
            v-model="pipeMatchJson"
            :disabled="viewOnly"
            @change="changePipeMatchJson" />
          <label>
            If true, the match will be converted to JSON and passed to stdin of the command.
            Note that this will cause ElastAlert to block until the command exits or sends an EOF to stdout.
          </label>
        </el-form-item>

        <el-form-item label="Pipe Alert Text" prop="pipeAlertText">
          <el-switch
            id="pipeAlertText"
            v-model="pipeAlertText"
            :disabled="viewOnly"
            @change="changePipeAlertText" />
          <label>
            If true, the standard alert body text will be passed to stdin of the command.
            Note that this will cause ElastAlert to block until the command exits or sends an EOF to stdout.
            It cannot be used at the same time as pipe_match_json.
          </label>
        </el-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('gitter')">
        <template slot="label">
          <icon :icon="['fab', 'gitter']" size="1x" /> Gitter
        </template>

        <praeco-form-item label="Webhook URL" prop="gitterWebhookUrl" required>
          <el-input id="gitterWebhookUrl" v-model="gitterWebhookUrl" :disabled="viewOnly" />
          <label>
            The webhook URL that includes your auth data and the ID of the channel (room) you want to post to.
            Go to the Integration Settings of the channel: (example  https://gitter.im/ORGA/CHANNEL#integrations ) ,
            click ‘CUSTOM’ and copy the resulting URL.
          </label>
        </praeco-form-item>

        <praeco-form-item label="Message level" prop="gitterMsgLevel" required>
          <el-radio-group v-model="gitterMsgLevel" :disabled="viewOnly">
            <el-radio id="gitterMsgLevelError" label="error" border class="gitter-error">
              Error
            </el-radio>
            <el-radio id="gitterMsgLevelInfo" label="info" border class="gitter-info">
              Info
            </el-radio>
          </el-radio-group>
        </praeco-form-item>

        <praeco-form-item label="Proxy" prop="gitterProxy">
          <el-input id="gitterProxy" v-model="gitterProxy" :disabled="viewOnly" />
          <label>
            By default ElastAlert will not use a network proxy to send notifications to Gitter.
            Set this option using hostname:port if you need to use a proxy.
          </label>
        </praeco-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('sns')">
        <template slot="label">
          <icon :icon="['fab', 'aws']" size="1x" /> SNS
        </template>
        <el-radio id="groupSns" v-model="groupSns" :disabled="viewOnly" label="profile" border @change="changeSns">
          Profile
        </el-radio>
        <el-radio id="groupSns" v-model="groupSns" :disabled="viewOnly" label="notProfile" border @change="changeSns">
          NotProfile
        </el-radio>

        <div v-if="groupSns === 'notProfile'">
          <praeco-form-item label="TopicArn" prop="snsTopicArn" required>
            <el-input id="snsTopicArn" v-model="snsTopicArn" :disabled="viewOnly" />
            <label>The SNS topic’s ARN. For example, arn:aws:sns:us-east-1:123456789:somesnstopic</label>
          </praeco-form-item>
          <praeco-form-item label="SnsAwsAccessKeyId" prop="snsAwsAccessKeyId" required>
            <el-input id="snsAwsAccessKeyId" v-model="snsAwsAccessKeyId" :disabled="viewOnly" />
            <label>An access key to connect to SNS with.</label>
          </praeco-form-item>
          <praeco-form-item label="SnsAwsSecretAccessKey" prop="snsAwsSecretAccessKey" required>
            <el-input id="snsAwsSecretAccessKey" v-model="snsAwsSecretAccessKey" :disabled="viewOnly" />
            <label>The secret key associated with the access key.</label>
          </praeco-form-item>
          <praeco-form-item label="SnsAwsRegion" prop="snsAwsRegion" required>
            <el-input id="snsAwsRegion" v-model="snsAwsRegion" :disabled="viewOnly" />
            <label>The AWS region in which the SNS resource is located. For example, us-east-1</label>
          </praeco-form-item>
        </div>
        <div v-if="groupSns === 'profile'">
          <praeco-form-item label="TopicArn" prop="snsTopicArn" required>
            <el-input id="snsTopicArn" v-model="snsTopicArn" :disabled="viewOnly" />
            <label>The SNS topic’s ARN. For example, arn:aws:sns:us-east-1:123456789:somesnstopic</label>
          </praeco-form-item>
          <praeco-form-item label="SnsAwsProfile" prop="snsAwsProfile" required>
            <el-input id="snsAwsProfile" v-model="snsAwsProfile" :disabled="viewOnly" />
            <label>The AWS profile to use. If none specified, the default will be used.</label>
          </praeco-form-item>
        </div>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('zabbix')">
        <template slot="label">
          Zabbix
        </template>
        <praeco-form-item label="Zbx Sender Host" prop="zbxSenderHost" required>
          <el-input id="zbxSenderHost" v-model="zbxSenderHost" :disabled="viewOnly" />
          <label>The address where zabbix server is running.</label>
        </praeco-form-item>

        <praeco-form-item label="Zbx Sender Port" prop="zbxSenderPort" required>
          <el-input-number id="zbxSenderPort" v-model="zbxSenderPort" :disabled="viewOnly" />
          <label>The port where zabbix server is listenning.</label>
        </praeco-form-item>

        <praeco-form-item label="ZbxHost" prop="zbxHost" required>
          <el-input id="zbxHost" v-model="zbxHost" :disabled="viewOnly" />
          <label>This field setup the host in zabbix that receives the value sent by Elastalert.</label>
        </praeco-form-item>

        <praeco-form-item label="ZbxKey" prop="zbxKey" required>
          <el-input id="zbxKey" v-model="zbxKey" :disabled="viewOnly" />
          <label>This field setup the key in the host that receives the value sent by Elastalert.</label>
        </praeco-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('twilio')">
        <template slot="label">
          Twilio
        </template>
        <el-radio id="groupTwilio" v-model="groupTwilio" :disabled="viewOnly" label="sms" border @change="changeTwilio">
          SMS
        </el-radio>
        <el-radio id="groupTwilio" v-model="groupTwilio" :disabled="viewOnly" label="copilot" border @change="changeTwilio">
          Copilot
        </el-radio>

        <praeco-form-item label="Twilio Account Sid" prop="twilioAccountSid" required>
          <el-input id="twilioAccountSid" v-model="twilioAccountSid" :disabled="viewOnly" />
          <label>This is sid of your twilio account.</label>
        </praeco-form-item>

        <praeco-form-item label="Twilio Auth Token" prop="twilioAuth" required>
          <el-input id="twilioAuth" v-model="twilioAuth" :disabled="viewOnly" />
          <label>Auth token assosiated with your twilio account.</label>
        </praeco-form-item>

        <praeco-form-item label="Twilio To Number" prop="twilioToNumber" required>
          <el-input id="twilioToNumber" v-model="twilioToNumber" :disabled="viewOnly" />
          <label>The phone number where you would like send the notification. </label>
        </praeco-form-item>

        <div v-if="groupTwilio === 'sms'">
          <praeco-form-item label="Twilio From Number" prop="twilioFromNumber" required>
            <el-input id="twilioFromNumber" v-model="twilioFromNumber" :disabled="viewOnly" />
            <label>Your twilio phone number from which message will be sent. </label>
          </praeco-form-item>
        </div>

        <div v-if="groupTwilio === 'copilot'">
          <praeco-form-item label="Twilio Message Service Sid" prop="twilioMessageServiceSid" required>
            <el-input id="twilioMessageServiceSid" v-model="twilioMessageServiceSid" :disabled="viewOnly" />
            <label>The SID of your twilio message service.</label>
          </praeco-form-item>
        </div>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('pagertree')">
        <template slot="label">
          PagerTree
        </template>

        <praeco-form-item label="Integration URL" prop="pagertreeIntegrationUrl" required>
          <el-input id="pagertreeIntegrationUrl" v-model="pagertreeIntegrationUrl" :disabled="viewOnly" />
          <label>URL generated by PagerTree for the integration.</label>
        </praeco-form-item>

        <praeco-form-item label="Proxy" prop="pagertreeProxy" required>
          <el-input id="pagertreeProxy" v-model="pagertreeProxy" :disabled="viewOnly" />
          <label>
            By default ElastAlert will not use a network proxy to send notifications to PagerTree.
            Set this option using hostname:port if you need to use a proxy.
          </label>
        </praeco-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('exotel')">
        <template slot="label">
          Exotel
        </template>

        <praeco-form-item label="Account Sid" prop="exotelAccountSid" required>
          <el-input id="exotelAccountSid" v-model="exotelAccountSid" :disabled="viewOnly" />
          <label>This is sid of your Exotel account.</label>
        </praeco-form-item>

        <praeco-form-item label="Auth Token" prop="exotelAuthToken" required>
          <el-input id="exotelAuthToken" v-model="exotelAuthToken" :disabled="viewOnly" />
          <label>Auth token assosiated with your Exotel account.</label>
        </praeco-form-item>

        <praeco-form-item label="Number" prop="exotelToNumber" required>
          <el-input id="exotelToNumber" v-model="exotelToNumber" :disabled="viewOnly" />
          <label>The phone number where you would like send the notification.</label>
        </praeco-form-item>

        <praeco-form-item label="From Number" prop="exotelFromNumber" required>
          <el-input id="exotelFromNumber" v-model="exotelFromNumber" :disabled="viewOnly" />
          <label>Your exophone number from which message will be sent.</label>
        </praeco-form-item>

        <praeco-form-item label="Message Body" prop="exotelMessageBody">
          <el-input id="exotelMessageBody" v-model="exotelMessageBody" :disabled="viewOnly" />
          <label>Message you want to send in the sms, is you don’t specify this argument only the rule name is sent</label>
        </praeco-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('stomp')">
        <template slot="label">
          Stomp
        </template>

        <praeco-form-item label="Host Name" prop="stompHostname" required>
          <el-input id="stompHostname" v-model="stompHostname" :disabled="viewOnly" />
          <label>The STOMP host to use, defaults to localhost.</label>
        </praeco-form-item>

        <praeco-form-item label="Host Port" prop="stompHostport" required>
          <el-input-number id="stompHostport" v-model="stompHostport" :disabled="viewOnly" />
          <label>The STOMP port to use, defaults to 61613.</label>
        </praeco-form-item>

        <praeco-form-item label="Login" prop="stompLogin" required>
          <el-input id="stompLogin" v-model="stompLogin" :disabled="viewOnly" />
          <label>The STOMP login to use, defaults to admin.</label>
        </praeco-form-item>

        <praeco-form-item label="Password" prop="stompPassword" required>
          <el-input id="stompPassword" v-model="stompPassword" :disabled="viewOnly" />
          <label>The STOMP password to use, defaults to admin.</label>
        </praeco-form-item>

        <praeco-form-item label="Destination" prop="stompDestination">
          <el-input id="stompDestination" v-model="stompDestination" :disabled="viewOnly" />
          <label>The STOMP destination to use, defaults to /queue/ALERT</label>
        </praeco-form-item>

        <praeco-form-item label="SSL" prop="stompSsl">
          <el-switch
            id="stompSsl"
            v-model="stompSsl"
            :disabled="viewOnly"
            @change="changestompSsl" />
          <label>Connect the STOMP host using TLS.</label>
        </praeco-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('victorops')">
        <template slot="label">
          VictorOps
        </template>

        <praeco-form-item label="Api Key" prop="victoropsApiKey" required>
          <el-input id="victoropsApiKey" v-model="victoropsApiKey" :disabled="viewOnly" />
          <label>API key generated under the ‘REST Endpoint’ in the Integrations settings.</label>
        </praeco-form-item>

        <praeco-form-item label="Routing Key" prop="victoropsRoutingKey" required>
          <el-input id="victoropsRoutingKey" v-model="victoropsRoutingKey" :disabled="viewOnly" />
          <label>VictorOps routing key to route the alert to.</label>
        </praeco-form-item>

        <praeco-form-item label="Message Type" prop="victoropsMessageType" required>
          <el-radio-group v-model="victoropsMessageType" :disabled="viewOnly">
            <el-radio id="victoropsMessageTypeInfo" label="INFO" border>
              INFO
            </el-radio>
            <el-radio id="victoropsMessageTypeWarning" label="WARNING" border>
              WARNING
            </el-radio>
            <el-radio id="victoropsMessageTypeAcknowledgement" label="ACKNOWLEDGEMENT" border>
              ACKNOWLEDGEMENT
            </el-radio>
            <el-radio id="victoropsMessageTypeCritical" label="CRITICAL" border>
              CRITICAL
            </el-radio>
            <el-radio id="victoropsMessageTypeRecovery" label="RECOVERY" border>
              RECOVERY
            </el-radio>
          </el-radio-group>
          <label>
            VictorOps field to specify severity level.
            Must be one of the following: INFO, WARNING, ACKNOWLEDGEMENT, CRITICAL, RECOVERY
          </label>
        </praeco-form-item>

        <praeco-form-item label="Entity Id" prop="victoropsEntityId">
          <el-input id="victoropsEntityId" v-model="victoropsEntityId" :disabled="viewOnly" />
          <label>
            The identity of the incident used by VictorOps to correlate incidents throughout the alert lifecycle.
            If not defined, VictorOps will assign a random string to each alert.
            /label>
          </label>
        </praeco-form-item>

        <praeco-form-item label="Entity Display Name" prop="victoropsEntityDisplayName">
          <el-input id="victoropsEntityDisplayName" v-model="victoropsEntityDisplayName" :disabled="viewOnly" />
          <label>Human-readable name of alerting entity to summarize incidents without affecting the life-cycle workflow.</label>
        </praeco-form-item>

        <praeco-form-item label="Proxy" prop="victoropsProxy">
          <el-input id="victoropsProxy" v-model="victoropsProxy" :disabled="viewOnly" />
          <label>
            By default ElastAlert will not use a network proxy to send notifications to VictorOps.
            Set this option using hostname:port if you need to use a proxy.
          </label>
        </praeco-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('servicenow')">
        <template slot="label">
          ServiceNow
        </template>

        <praeco-form-item label="Username" prop="serviceNowUsername" required>
          <el-input id="serviceNowUsername" v-model="serviceNowUsername" :disabled="viewOnly" />
          <label>The ServiceNow Username to access the api.</label>
        </praeco-form-item>

        <praeco-form-item label="Password" prop="serviceNowPassword" required>
          <el-input id="serviceNowPassword" v-model="serviceNowPassword" :disabled="viewOnly" />
          <label>The ServiceNow password to access the api.</label>
        </praeco-form-item>

        <praeco-form-item label="REST URL" prop="servicenowRestUrl" required>
          <el-input id="servicenowRestUrl" v-model="servicenowRestUrl" :disabled="viewOnly" />
          <label>The ServiceNow RestApi url.</label>
        </praeco-form-item>

        <praeco-form-item label="ShortDescription" prop="servicenowShortDescription" required>
          <el-input id="servicenowShortDescription" v-model="servicenowShortDescription" :disabled="viewOnly" />
          <label>The ServiceNow password to access the api.</label>
        </praeco-form-item>

        <praeco-form-item label="Comments" prop="servicenowComments" required>
          <el-input id="servicenowComments" v-model="servicenowComments" :disabled="viewOnly" />
          <label>Comments to be attached to the incident, this is the equivilant of work notes.</label>
        </praeco-form-item>

        <praeco-form-item label="AssignmentGroup" prop="servicenowAssignmentGroup" required>
          <el-input id="servicenowAssignmentGroup" v-model="servicenowAssignmentGroup" :disabled="viewOnly" />
          <label>The group to assign the incident to.</label>
        </praeco-form-item>

        <praeco-form-item label="Category" prop="servicenowCategory" required>
          <el-input id="servicenowCategory" v-model="servicenowCategory" :disabled="viewOnly" />
          <label>The category to attach the incident to, use an existing category.</label>
        </praeco-form-item>

        <praeco-form-item label="Subcategory" prop="servicenowSubcategory" required>
          <el-input id="servicenowSubcategory" v-model="servicenowSubcategory" :disabled="viewOnly" />
          <label>The subcategory to attach the incident to, use an existing subcategory.</label>
        </praeco-form-item>

        <praeco-form-item label="CmdbCi" prop="servicenowCmdbCi" required>
          <el-input id="servicenowCmdbCi" v-model="servicenowCmdbCi" :disabled="viewOnly" />
          <label>The configuration item to attach the incident to.</label>
        </praeco-form-item>

        <praeco-form-item label="CallerId" prop="servicenowCallerId" required>
          <el-input id="servicenowCallerId" v-model="servicenowCallerId" :disabled="viewOnly" />
          <label>The caller id (email address) of the user that created the incident.</label>
        </praeco-form-item>

        <praeco-form-item label="Proxy" prop="servicenowProxy">
          <el-input id="servicenowProxy" v-model="servicenowProxy" :disabled="viewOnly" />
          <label>
            By default ElastAlert will not use a network proxy to send notifications to ServiceNow.
            Set this option using hostname:port if you need to use a proxy.
          </label>
        </praeco-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('chatwork')">
        <template slot="label">
          Chatwork
        </template>

        <praeco-form-item label="Api Key" prop="chatworkApikey" required>
          <el-input id="chatworkApikey" v-model="chatworkApikey" :disabled="viewOnly" />
          <label>ChatWork API KEY.</label>
        </praeco-form-item>

        <praeco-form-item label="Room Id" prop="chatworkRoomId" required>
          <el-input id="chatworkRoomId" v-model="chatworkRoomId" :disabled="viewOnly" />
          <label>
            The ID of the room you are talking to in Chatwork.
            How to find the room ID is the part of the number after "rid" at the end of the URL of the browser.
          </label>
        </praeco-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('discord')">
        <template slot="label">
          Discord
        </template>

        <praeco-form-item label="WebhookURL" prop="discordWebhookUrl" required>
          <el-input id="discordWebhookUrl" v-model="discordWebhookUrl" :disabled="viewOnly" />
          <label>The webhook URL.</label>
        </praeco-form-item>

        <praeco-form-item
          v-if="!(viewOnly && !discordEmojiTitle)"
          :class="{ 'disabled': viewOnly }"
          label="Icon"
          prop="discordEmojiTitle">
          <picker
            :emoji="discordEmojiTitle || 'arrow_up'"
            :title="discordEmojiTitle || 'Pick your icon...'"
            color="#189acc"
            @select="addDiscordEmoji" />
        </praeco-form-item>

        <praeco-form-item label="Discord Embed Footer" prop="discordEmbedFooter">
          <el-input id="discordEmbedFooter" v-model="discordEmbedFooter" :disabled="viewOnly" />
          <label>embed footer.</label>
        </praeco-form-item>

        <praeco-form-item label="Embed IconUrl" prop="discordEmbedIconUrl">
          <el-input id="discordEmbedIconUrl" v-model="discordEmbedIconUrl" :disabled="viewOnly" />
          <label>
            You can provide icon_url to use custom image.
            Provide absolute address of the pciture.(exampmle : http://domain/picure.png)
          </label>
        </praeco-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('hivealerter')">
        <template slot="label">
          TheHive
        </template>

        <praeco-form-item label="Hive Alert Config Title" prop="hiveAlertConfigTitle">
          <el-input id="hiveAlertConfigTitle" v-model="hiveAlertConfigTitle" :disabled="viewOnly" />
          <label>Alert's description.</label>
        </praeco-form-item>

        <praeco-form-item label="Hive Alert Config Type" prop="hiveAlertConfigType">
          <el-input id="hiveAlertConfigType" v-model="hiveAlertConfigType" :disabled="viewOnly" />
          <label>Alert's type.</label>
        </praeco-form-item>

        <praeco-form-item label="Hive Alert Config Source" prop="hiveAlertConfigSource">
          <el-input id="hiveAlertConfigSource" v-model="hiveAlertConfigSource" :disabled="viewOnly" />
          <label>Alert's source.</label>
        </praeco-form-item>

        <praeco-form-item label="Hive Alert Config Description" prop="hiveAlertConfigDescription">
          <el-input id="hiveAlertConfigDescription" v-model="hiveAlertConfigDescription" :disabled="viewOnly" />
          <label>Alert's description.</label>
        </praeco-form-item>

        <praeco-form-item label="Hive Alert Config Severity" prop="hiveAlertConfigSeverity">
          <el-input-number id="hiveAlertConfigSeverity" v-model.number="hiveAlertConfigSeverity" :min="1" :max="4" :disabled="viewOnly" />
          <label>Alert's severity: 1, 2, 3, 4 for LOW, MEDIUM, HIGH, CRTICAL.</label>
        </praeco-form-item>

        <el-popover v-model="pophiveAlertConfigTagsVisible" :class="{ 'is-invalid': !pophiveAlertConfigTagsValid }">
          <span slot="reference" class="pop-trigger">
            <el-tooltip v-if="hiveAlertConfigTags.length" :content="hiveAlertConfigTags.join(', ')" placement="top">
              <span>Tags ({{ hiveAlertConfigTags.length }})</span>
            </el-tooltip>
            <span v-else>Tags ({{ hiveAlertConfigTags.length }})</span>
          </span>
          <template>
            <el-form
              ref="hiveAlertConfigTags"
              :model="$store.state.config.alert"
              label-position="top"
              style="width: 360px"
              @submit.native.prevent>
              <el-form-item
                v-for="(entry, index) in hiveAlertConfigTags"
                :key="index"
                :prop="'hiveAlertConfigTags.' + index"
                :disabled="viewOnly"
                class="el-form-item-list"
                label=""
                required>
                <el-row :gutter="5" type="flex" justify="space-between">
                  <el-col :span="20">
                    <el-input
                      v-model="hiveAlertConfigTags[index]"
                      :disabled="viewOnly"
                      placeholder="Tags"
                      @input="(val) => updateHiveAlertConfigTags(val, index)" />
                  </el-col>
                  <el-col :span="4">
                    <el-button
                      :disabled="viewOnly"
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      plain
                      @click="removeHiveAlertConfigTagsEntry(entry)" />
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>

            <el-button :disabled="viewOnly" class="m-n-sm" @click="addHiveAlertConfigTagsEntry">
              Add tags
            </el-button>
          </template>
        </el-popover>

        <praeco-form-item label="Hive Alert Config Tlp" prop="hiveAlertConfigTlp">
          <el-input-number id="hiveAlertConfigTlp" v-model.number="hiveAlertConfigTlp" :min="0" :max="3" :disabled="viewOnly" />
          <label>Alert's TLP: 0, 1, 2, 3 for WHITE, GREEN, AMBER, RED.</label>
        </praeco-form-item>

        <praeco-form-item label="Hive Alert Config Status" prop="hiveAlertConfigStatus">
          <el-radio-group v-model="hiveAlertConfigStatus" :disabled="viewOnly">
            <el-radio id="hiveAlertConfigStatusWaiting" label="Waiting" border>
              Waiting
            </el-radio>
            <el-radio id="hiveAlertConfigStatusInProgress" label="InProgress" border>
              InProgress
            </el-radio>
            <el-radio id="hiveAlertConfigStatusCancel" label="Cancel" border>
              Cancel
            </el-radio>
            <el-radio id="hiveAlertConfigStatusCompleted" label="Completed" border>
              Completed
            </el-radio>
          </el-radio-group>
          <label>Task's status: Waiting, InProgress, Cancel, Completed.</label>
        </praeco-form-item>

        <el-form-item label="Hive Alert Config Follow" prop="hiveAlertConfigFollow">
          <el-switch
            id="hiveAlertConfigFollow"
            v-model="hiveAlertConfigFollow"
            :disabled="viewOnly"
            @change="changeHiveAlertConfigFollow" />
        </el-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('alerta')">
        <template slot="label">
          Alerta
        </template>

        <el-form-item label="API URL" prop="alertaApiUrl" required>
          <el-input id="alertaApiUrl" v-model="alertaApiUrl" :disabled="viewOnly" />
          <label>API server URL.</label>
        </el-form-item>

        <el-form-item label="API Key" prop="alertaApiKey">
          <el-input id="alertaApiKey" v-model="alertaApiKey" :disabled="viewOnly" />
          <label>
            This is the api key for alerta server, sent in an Authorization HTTP header.
            If not defined, no Authorization header is sent.
          </label>
        </el-form-item>

        <el-form-item label="Severity" prop="alertaSeverity">
          <el-select
            v-model="alertaSeverity"
            :disabled="viewOnly"
            placeholder=""
            class="el-select-wide">
            <el-option
              v-for="v in alertaSeverityOptions"
              :key="v.code"
              :label="v.name"
              :value="v.code" />
          </el-select>
        </el-form-item>

        <el-form-item label="Resource" prop="alertaResource">
          <el-input id="alertaResource" v-model="alertaResource" :disabled="viewOnly" />
          <label>If true and query_key is present, this will override alerta_resource field with the query_key value (Can be useful if query_key is a hostname).</label>
        </el-form-item>

        <el-form-item label="Text" prop="alertaText">
          <el-input id="alertaText" v-model="alertaText" :disabled="viewOnly" />
          <label>
            This is the api key for alerta server, sent in an Authorization HTTP header.
            If not defined, no Authorization header is sent.
          </label>
        </el-form-item>

        <el-form-item label="Event" prop="alertaEvent">
          <el-input id="alertaEvent" v-model="alertaEvent" :disabled="viewOnly" />
          <label>Defaults to “elastalert”.</label>
        </el-form-item>

        <el-form-item label="Group" prop="alertaGroup">
          <el-input id="alertaGroup" v-model="alertaGroup" :disabled="viewOnly" />
          <label>Defaults to “”.</label>
        </el-form-item>

        <el-popover v-model="popAlertaTagsVisible" :class="{ 'is-invalid': !popAlertaTagsValid }">
          <span slot="reference" class="pop-trigger">
            <el-tooltip v-if="alertaTags.length" :content="alertaTags.join(', ')" placement="top">
              <span>Tags ({{ alertaTags.length }})</span>
            </el-tooltip>
            <span v-else>Tags ({{ alertaTags.length }})</span>
          </span>
          <template>
            <el-form
              ref="alertaTags"
              :model="$store.state.config.alert"
              label-position="top"
              style="width: 360px"
              @submit.native.prevent>
              <el-form-item
                v-for="(entry, index) in alertaTags"
                :key="index"
                :prop="'alertaTags.' + index"
                :disabled="viewOnly"
                class="el-form-item-list"
                label=""
                required>
                <el-row :gutter="5" type="flex" justify="space-between">
                  <el-col :span="20">
                    <el-input
                      v-model="alertaTags[index]"
                      :disabled="viewOnly"
                      placeholder="Tags"
                      @input="(val) => updateAlertaTags(val, index)" />
                  </el-col>
                  <el-col :span="4">
                    <el-button
                      :disabled="viewOnly"
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      plain
                      @click="removeAlertaTagsEntry(entry)" />
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>

            <el-button :disabled="viewOnly" class="m-n-sm" @click="addAlertaTagsEntry">
              Add tags
            </el-button>
          </template>
        </el-popover>

        <el-form-item label="Environment" prop="alertaEnvironment">
          <el-input id="alertaEnvironment" v-model="alertaEnvironment" :disabled="viewOnly" />
          <label>Defaults to “Production”.</label>
        </el-form-item>
      </el-tab-pane>

      <el-tab-pane v-if="alert.includes('datadog')">
        <template slot="label">
          Datadog
        </template>

        <el-form-item label="API KEY" prop="datadogApiKey" required>
          <el-input id="datadogApiKey" v-model="datadogApiKey" :disabled="viewOnly" />
          <label>Datadog API key.</label>
        </el-form-item>

        <el-form-item label="APP KEY" prop="datadogAppKey" required>
          <el-input id="datadogAppKey" v-model="datadogAppKey" :disabled="viewOnly" />
          <label>Datadog application key.</label>
        </el-form-item>
      </el-tab-pane>
    </el-tabs>
  </el-form>
</template>

<script>
import VueCronEditorBuefy from 'vue-cron-editor-buefy';
import * as EmailValidator from 'email-validator';
import validUrl from 'valid-url';
import { Picker } from 'emoji-mart-vue';
import ConfigAlertSubjectBody from './ConfigAlertSubjectBody';

let validateSlackDestination = (rule, value, callback) => {
  if (value.length < 2) {
    callback(new Error('Please enter a @username or #channel'));
  } else if (!value.startsWith('@') && !value.startsWith('#')) {
    callback(new Error('Please enter a @username or #channel'));
  } else {
    callback();
  }
};

let validateMattermostDestination = (rule, value, callback) => {
  if (value.length < 2) {
    callback(new Error('Please enter a @username or #channel'));
  } else if (!value.startsWith('@') && !value.startsWith('#')) {
    callback(new Error('Please enter a @username or #channel'));
  } else {
    callback();
  }
};

let validateEmail = (rule, value, callback) => {
  if (!value || EmailValidator.validate(value)) {
    callback();
  } else {
    callback(new Error('Invalid email address'));
  }
};

let validateUrl = (rule, value, callback) => {
  if (validUrl.isUri(value)) {
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

let validateEmailCommaSeparated = (rule, value, callback) => {
  let emails = [];

  if (value) emails = value.split(',');

  emails.forEach(email => {
    if (
      email
      && !EmailValidator.validate(email.trim())
    ) {
      return callback(new Error('Invalid email address'));
    }
  });

  return callback();
};

export default {
  components: {
    ConfigAlertSubjectBody,
    VueCronEditorBuefy,
    Picker
  },

  props: ['viewOnly'],

  data() {
    let groupSnsValue = 'profile';
    if (typeof this.$store.state.config.alert.snsAwsProfile === 'undefined' || this.$store.state.config.alert.snsAwsProfile === '') {
      groupSnsValue = 'notProfile';
    }
    let groupTwilioValue = 'copilot';
    if (typeof this.$store.state.config.alert.twilio_message_service_sid === 'undefined' || this.$store.state.config.alert.twilio_message_service_sid === '') {
      groupTwilioValue = 'sms';
    }
    return {
      enableLimitExcecution: false,
      popAlertaTagsVisible: false,
      popAlertaTagsValid: true,
      popHiveAlertConfigTagsVisible: false,
      popHiveAlertConfigTagsValid: true,
      popCommandVisible: false,
      popCommandValid: true,
      groupSns: groupSnsValue,
      groupTwilio: groupTwilioValue,
      visibleTabPane: '',
      alertaSeverityOptions: [{
        code: 'unknown',
        name: 'unknown'
      }, {
        code: 'security',
        name: 'security'
      }, {
        code: 'debug',
        name: 'debug'
      }, {
        code: 'informational',
        name: 'informational'
      }, {
        code: 'ok',
        name: 'ok'
      }, {
        code: 'normal',
        name: 'normal'
      }, {
        code: 'cleared',
        name: 'cleared'
      }, {
        code: 'indeterminate',
        name: 'indeterminate'
      }, {
        code: 'warning',
        name: 'warning'
      }, {
        code: 'minor',
        name: 'minor'
      }, {
        code: 'major',
        name: 'major'
      }, {
        code: 'critical',
        name: 'critical'
      }],
      rules: {
        alert: [
          {
            required: true,
            message: 'You must choose at least one alert type'
          }
        ],
        slackChannelOverride: [
          {
            validator: validateSlackDestination,
            trigger: 'change'
          }
        ],
        mattermostChannelOverride: [
          {
            validator: validateMattermostDestination,
            trigger: 'change'
          }
        ],
        fromAddr: [
          {
            validator: validateEmail,
            trigger: 'change'
          }
        ],
        replyTo: [
          {
            validator: validateEmail,
            trigger: 'change'
          }
        ],
        email: [
          {
            validator: validateEmailCommaSeparated,
            trigger: 'change'
          }
        ],
        cc: [
          {
            validator: validateEmailCommaSeparated,
            trigger: 'change'
          }
        ],
        bcc: [
          {
            validator: validateEmailCommaSeparated,
            trigger: 'change'
          }
        ],
        httpPostUrl: [
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
        alertaApiUrl: [
          {
            validator: validateUrl,
            trigger: ['change', 'blur']
          }
        ]
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

    limitExcecution: {
      get() {
        return this.$store.state.config.alert.limitExcecution;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_LIMIT_EXCECUTION', value);
      }
    },

    httpPostUrl: {
      get() {
        return this.$store.state.config.alert.httpPostUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_HTTP_POST_URL', value);
      }
    },

    httpPostTimeout: {
      get() {
        return this.$store.state.config.alert.httpPostTimeout;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_HTTP_POST_TIMEOUT',
          value
        );
      }
    },

    httpPostProxy: {
      get() {
        return this.$store.state.config.alert.httpPostProxy;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_HTTP_POST_PROXY',
          value
        );
      }
    },

    fromAddr: {
      get() {
        return this.$store.state.config.alert.fromAddr;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_FROM_ADDR', value);
      }
    },

    replyTo: {
      get() {
        return this.$store.state.config.alert.replyTo;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_REPLY_TO', value);
      }
    },

    email: {
      get() {
        return this.$store.state.config.alert.email;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_EMAIL', value);
      }
    },

    cc: {
      get() {
        return this.$store.state.config.alert.cc;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_CC', value);
      }
    },

    bcc: {
      get() {
        return this.$store.state.config.alert.bcc;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_BCC', value);
      }
    },

    smtpSsl: {
      get() {
        return this.$store.state.config.alert.smtpSsl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SMTP_SSL', value);
      }
    },

    smtpHost: {
      get() {
        return this.$store.state.config.alert.smtpHost;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SMTP_HOST', value);
      }
    },

    smtpPort: {
      get() {
        return this.$store.state.config.alert.smtpPort;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SMTP_PORT', value);
      }
    },

    smtpAuthFile: {
      get() {
        return this.$store.state.config.alert.smtpAuthFile;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SMTP_AUTH_FILE', value);
      }
    },

    smtpKeyFile: {
      get() {
        return this.$store.state.config.alert.smtpKeyFile;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SMTP_KEY_FILE', value);
      }
    },

    smtpCertFile: {
      get() {
        return this.$store.state.config.alert.smtpCertFile;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SMTP_CERT_FILE', value);
      }
    },

    emailFromField: {
      get() {
        return this.$store.state.config.alert.emailFromField;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_EMAIL_FROM_FIELD', value);
      }
    },

    emailAddDomain: {
      get() {
        return this.$store.state.config.alert.emailAddDomain;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_EMAIL_ADD_DOMAIN', value);
      }
    },

    // TODO:
    // emailFormat: {
    //   get() {
    //     return this.$store.state.config.alert.emailFormat;
    //   },
    //   set(value) {
    //     this.$store.commit('config/alert/UPDATE_EMAIL_FORMAT', value);
    //   }
    // },

    telegramRoomId: {
      get() {
        return this.$store.state.config.alert.telegramRoomId;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TELEGRAM_ROOM_ID',
          value
        );
      }
    },

    telegramProxy: {
      get() {
        return this.$store.state.config.alert.telegramProxy;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TELEGRAM_PROXY',
          value
        );
      }
    },

    telegramProxyLogin: {
      get() {
        return this.$store.state.config.alert.telegramProxyLogin;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TELEGRAM_PROXY_LOGIN',
          value
        );
      }
    },

    telegramProxyPass: {
      get() {
        return this.$store.state.config.alert.telegramProxyPass;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TELEGRAM_PROXY_PASS',
          value
        );
      }
    },

    exotelAccountSid: {
      get() {
        return this.$store.state.config.alert.exotelAccountSid;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_EXOTEL_ACCOUNT_SID',
          value
        );
      }
    },

    exotelAuthToken: {
      get() {
        return this.$store.state.config.alert.exotelAuthToken;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_EXOTEL_AUTH_TOKEN',
          value
        );
      }
    },

    exotelToNumber: {
      get() {
        return this.$store.state.config.alert.exotelToNumber;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_EXOTEL_TO_NUMBER',
          value
        );
      }
    },

    exotelFromNumber: {
      get() {
        return this.$store.state.config.alert.exotelFromNumber;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_EXOTEL_FROM_NUMBER',
          value
        );
      }
    },

    exotelMessageBody: {
      get() {
        return this.$store.state.config.alert.exotelMessageBody;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_EXOTEL_MESSAGE_BODY',
          value
        );
      }
    },

    twilioAccountSid: {
      get() {
        return this.$store.state.config.alert.twilioAccountSid;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TWILIO_ACCOUNT_SID',
          value
        );
      }
    },

    twilioAuth: {
      get() {
        return this.$store.state.config.alert.twilioAuth;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TWILIO_AUTH_TOKEN',
          value
        );
      }
    },

    twilioToNumber: {
      get() {
        return this.$store.state.config.alert.twilioToNumber;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TWILIO_TO_NUMBER',
          value
        );
      }
    },

    twilioFromNumber: {
      get() {
        return this.$store.state.config.alert.twilioFromNumber;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TWILIO_FROM_NUMBER',
          value
        );
      }
    },

    twilioMessageServiceSid: {
      get() {
        return this.$store.state.config.alert.twilioMessageServiceSid;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TWILIO_MESSAGE_SERVICE_SID',
          value
        );
      }
    },

    pagertreeIntegrationUrl: {
      get() {
        return this.$store.state.config.alert.pagertreeIntegrationUrl;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_PAGERTREE_INTEGRATION_URL',
          value
        );
      }
    },

    pagertreeProxy: {
      get() {
        return this.$store.state.config.alert.pagertreeProxy;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_PAGERTREE_PAGERTREE_PROXY',
          value
        );
      }
    },

    snsTopicArn: {
      get() {
        return this.$store.state.config.alert.snsTopicArn;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SNS_TOPIC_ARN',
          value
        );
      }
    },

    snsAwsAccessKeyId: {
      get() {
        return this.$store.state.config.alert.snsAwsAccessKeyId;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SNS_AWS_ACCESS_KEY_ID',
          value
        );
      }
    },

    snsAwsSecretAccessKey: {
      get() {
        return this.$store.state.config.alert.snsAwsSecretAccessKey;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SNS_AWS_SECRET_ACCESS_KEY',
          value
        );
      }
    },

    snsAwsRegion: {
      get() {
        return this.$store.state.config.alert.snsAwsRegion;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SNS_AWS_REGION',
          value
        );
      }
    },

    snsAwsProfile: {
      get() {
        return this.$store.state.config.alert.snsAwsProfile;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SNS_AWS_PROFILE',
          value
        );
      }
    },

    zbxSenderHost: {
      get() {
        return this.$store.state.config.alert.zbxSenderHost;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ZBX_SENDER_HOST',
          value
        );
      }
    },

    zbxSenderPort: {
      get() {
        return this.$store.state.config.alert.zbxSenderPort;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ZBX_SENDER_PORT',
          value
        );
      }
    },

    zbxHost: {
      get() {
        return this.$store.state.config.alert.zbxHost;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ZBX_HOST',
          value
        );
      }
    },

    zbxKey: {
      get() {
        return this.$store.state.config.alert.zbxKey;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ZBX_KEY',
          value
        );
      }
    },

    linenotifyAccessToken: {
      get() {
        return this.$store.state.config.alert.linenotifyAccessToken;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_LINENOTIFY_ACCESS_TOKEN',
          value
        );
      }
    },

    command: {
      get() {
        return this.$store.state.config.alert.command;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_COMMAND',
          value
        );
      }
    },

    pipeMatchJson: {
      get() {
        return this.$store.state.config.alert.pipeMatchJson;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_PIPE_MATCH_JSON',
          value
        );
      }
    },

    pipeAlertText: {
      get() {
        return this.$store.state.config.alert.pipeAlertText;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_PIPE_ALERT_TEXT',
          value
        );
      }
    },

    gitterWebhookUrl: {
      get() {
        return this.$store.state.config.alert.gitterWebhookUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_GITTER_WEBHOOK_URL', value);
      }
    },

    gitterMsgLevel: {
      get() {
        return this.$store.state.config.alert.gitterMsgLevel;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_GITTER_MSG_LEVEL', value);
      }
    },

    gitterProxy: {
      get() {
        return this.$store.state.config.alert.gitterProxy;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GITTER_PROXY',
          value
        );
      }
    },

    jiraIssueType: {
      get() {
        return this.$store.state.config.alert.jiraIssueType;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_JIRA_ISSUE_TYPE',
          value
        );
      }
    },

    jiraProject: {
      get() {
        return this.$store.state.config.alert.jiraProject;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_JIRA_PROJECT',
          value
        );
      }
    },

    jiraComponents: {
      get() {
        return this.$store.state.config.alert.jiraComponents;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_JIRA_COMPONENTS',
          value
        );
      }
    },

    discordWebhookUrl: {
      get() {
        return this.$store.state.config.alert.discordWebhookUrl;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_DISCORD_WEBHOOK_URL',
          value
        );
      }
    },

    discordEmojiTitle: {
      get() {
        return this.$store.state.config.alert.discordEmojiTitle;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_DISCORD_EMOJI_TITLE',
          value
        );
      }
    },

    discordEmbedFooter: {
      get() {
        return this.$store.state.config.alert.discordEmbedFooter;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_DISCORD_EMBED_FOOTER',
          value
        );
      }
    },

    discordEmbedIconUrl: {
      get() {
        return this.$store.state.config.alert.discordEmbedIconUrl;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_DISCORD_EMBED_ICON_URL',
          value
        );
      }
    },

    chatworkApikey: {
      get() {
        return this.$store.state.config.alert.chatworkApikey;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_CHATWORK_API_KEY',
          value
        );
      }
    },
    chatworkRoomId: {
      get() {
        return this.$store.state.config.alert.chatworkRoomId;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_CHATWORK_ROOM_ID',
          value
        );
      }
    },

    serviceNowUsername: {
      get() {
        return this.$store.state.config.alert.serviceNowUsername;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SERVICENOW_USERNAME',
          value
        );
      }
    },

    serviceNowPassword: {
      get() {
        return this.$store.state.config.alert.serviceNowPassword;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SERVICENOW_PASSWORD',
          value
        );
      }
    },

    servicenowRestUrl: {
      get() {
        return this.$store.state.config.alert.servicenowRestUrl;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SERVICENOW_REST_URL',
          value
        );
      }
    },

    servicenowShortDescription: {
      get() {
        return this.$store.state.config.alert.servicenowShortDescription;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SERVICENOW_SHORT_DESCRIPTION',
          value
        );
      }
    },

    servicenowComments: {
      get() {
        return this.$store.state.config.alert.servicenowComments;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SERVICENOW_COMMENTS',
          value
        );
      }
    },

    servicenowAssignmentGroup: {
      get() {
        return this.$store.state.config.alert.servicenowAssignmentGroup;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SERVICENOW_ASSIGNMENT_GROUP',
          value
        );
      }
    },

    servicenowCategory: {
      get() {
        return this.$store.state.config.alert.servicenowCategory;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SERVICENOW_CATEGORY',
          value
        );
      }
    },

    servicenowSubcategory: {
      get() {
        return this.$store.state.config.alert.servicenowSubcategory;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SERVICENOW_SUBCATEGORY',
          value
        );
      }
    },

    servicenowCmdbCi: {
      get() {
        return this.$store.state.config.alert.servicenowCmdbCi;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SERVICENOW_CMDB_CI',
          value
        );
      }
    },

    servicenowCallerId: {
      get() {
        return this.$store.state.config.alert.servicenowCallerId;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SERVICENOW_CALLER_ID',
          value
        );
      }
    },

    servicenowProxy: {
      get() {
        return this.$store.state.config.alert.servicenowProxy;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SERVICENOW_PROXY',
          value
        );
      }
    },

    victoropsApiKey: {
      get() {
        return this.$store.state.config.alert.victoropsApiKey;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_VICTOROPS_API_KEY',
          value
        );
      }
    },

    victoropsRoutingKey: {
      get() {
        return this.$store.state.config.alert.victoropsRoutingKey;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_VICTOROPS_ROUTING_KEY',
          value
        );
      }
    },

    victoropsMessageType: {
      get() {
        return this.$store.state.config.alert.victoropsMessageType;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_VICTOROPS_MESSAGE_TYPE',
          value
        );
      }
    },

    victoropsEntityId: {
      get() {
        return this.$store.state.config.alert.victoropsEntityId;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_VICTOROPS_ENTITY_ID',
          value
        );
      }
    },

    victoropsEntityDisplayName: {
      get() {
        return this.$store.state.config.alert.victoropsEntityDisplayName;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_VICTOROPS_ENTITY_DISPLAY_NAME',
          value
        );
      }
    },

    victoropsProxy: {
      get() {
        return this.$store.state.config.alert.victoropsProxy;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_VICTOROPS_PROXY',
          value
        );
      }
    },

    stompHostname: {
      get() {
        return this.$store.state.config.alert.stompHostname;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_STOMP_HOSTNAME',
          value
        );
      }
    },

    stompHostport: {
      get() {
        return this.$store.state.config.alert.stompHostport;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_STOMP_HOSTPORT',
          value
        );
      }
    },

    stompLogin: {
      get() {
        return this.$store.state.config.alert.stompLogin;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_STOMP_LOGIN',
          value
        );
      }
    },

    stompPassword: {
      get() {
        return this.$store.state.config.alert.stompPassword;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_STOMP_PASSWORD',
          value
        );
      }
    },

    stompDestination: {
      get() {
        return this.$store.state.config.alert.stompDestination;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_STOMP_DESTINATION',
          value
        );
      }
    },

    stompSsl: {
      get() {
        return this.$store.state.config.alert.stompSsl;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_STOMP_SSL',
          value
        );
      }
    },

    googleChatWebhookUrl: {
      get() {
        return this.$store.state.config.alert.googleChatWebhookUrl;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GOOGLE_CHAT_WEBHOOK_URL',
          value
        );
      }
    },

    googleChatFormat: {
      get() {
        return this.$store.state.config.alert.googleChatFormat;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GOOGLE_CHAT_FORMAT',
          value
        );
      }
    },

    googleChatHeaderTitle: {
      get() {
        return this.$store.state.config.alert.googleChatHeaderTitle;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GOOGLE_CHAT_HEADER_TITLE',
          value
        );
      }
    },

    googleChatHeaderSubtitle: {
      get() {
        return this.$store.state.config.alert.googleChatHeaderSubtitle;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GOOGLECHAT_HEADER_SUBTITLE',
          value
        );
      }
    },

    googleChatHeaderImage: {
      get() {
        return this.$store.state.config.alert.googleChatHeaderImage;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GOOGLECHAT_HEADER_IMAGE',
          value
        );
      }
    },

    googleFooterKibanalink: {
      get() {
        return this.$store.state.config.alert.googleFooterKibanalink;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GOOGLECHAT_FOOTER_KIBANALINK',
          value
        );
      }
    },

    slackChannelOverride: {
      get() {
        return this.$store.state.config.alert.slackChannelOverride;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SLACK_CHANNEL_OVERRIDE', value);
      }
    },

    slackUsernameOverride: {
      get() {
        return this.$store.state.config.alert.slackUsernameOverride;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SLACK_USERNAME_OVERRIDE',
          value
        );
      }
    },

    slackEmojiOverride: {
      get() {
        return this.$store.state.config.alert.slackEmojiOverride;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SLACK_EMOJI_OVERRIDE', value);
      }
    },

    slackParseOverride: {
      get() {
        return this.$store.state.config.alert.slackParseOverride;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SLACK_PARSE_OVERRIDE', value);
      }
    },

    slackTextString: {
      get() {
        return this.$store.state.config.alert.slackTextString;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SLACK_TEXT_STRING',
          value
        );
      }
    },

    slackIgnoreSslErrors: {
      get() {
        return this.$store.state.config.alert.slackIgnoreSslErrors;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SLACK_IGNORE_SSL_ERRORS',
          value
        );
      }
    },

    slackIconUrlOverride: {
      get() {
        return this.$store.state.config.alert.slackIconUrlOverride;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SLACK_ICON_URL_OVERRIDE',
          value
        );
      }
    },

    slackCaCerts: {
      get() {
        return this.$store.state.config.alert.slackCaCerts;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SLACK_CA_CERTS',
          value
        );
      }
    },

    slackTimeout: {
      get() {
        return this.$store.state.config.alert.slackTimeout;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SLACK_TIMEOUT',
          value
        );
      }
    },

    slackMsgColor: {
      get() {
        return this.$store.state.config.alert.slackMsgColor;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SLACK_MSG_COLOR', value);
      }
    },

    slackAttachKibanaDiscoverUrl: {
      get() {
        return this.$store.state.config.alert.slackAttachKibanaDiscoverUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SLACK_ATTACH_KIBANA_DISCOVER_URL', value);
      }
    },

    slackKibanaDiscoverColor: {
      get() {
        return this.$store.state.config.alert.slackKibanaDiscoverColor;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SLACK_KIBANA_DISCOVER_COLOR', value);
      }
    },

    slackKibanaDiscoverTitle: {
      get() {
        return this.$store.state.config.alert.slackKibanaDiscoverTitle;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SLACK_KIBANA_DISCOVER_TITLE', value);
      }
    },

    slackProxy: {
      get() {
        return this.$store.state.config.alert.slackProxy;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SLACK_PROXY',
          value
        );
      }
    },

    slackFooter: {
      get() {
        return this.$store.state.config.alert.slackFooter;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SLACK_FOOTER',
          value
        );
      }
    },

    slackFooterIcon: {
      get() {
        return this.$store.state.config.alert.slackFooterIcon;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SLACK_FOOTER_ICON',
          value
        );
      }
    },

    slackImageUrl: {
      get() {
        return this.$store.state.config.alert.slackImageUrl;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SLACK_IMAGE_URL',
          value
        );
      }
    },

    slackThumbUrl: {
      get() {
        return this.$store.state.config.alert.slackThumbUrl;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SLACK_THUMB_URL',
          value
        );
      }
    },

    slackAuthorName: {
      get() {
        return this.$store.state.config.alert.slackAuthorName;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SLACK_AUTHOR_NAME',
          value
        );
      }
    },

    slackAuthorLink: {
      get() {
        return this.$store.state.config.alert.slackAuthorLink;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SLACK_AUTHOR_LINK',
          value
        );
      }
    },

    slackAuthorIcon: {
      get() {
        return this.$store.state.config.alert.slackAuthorIcon;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SLACK_AUTHOR_ICON',
          value
        );
      }
    },

    slackMsgPretext: {
      get() {
        return this.$store.state.config.alert.slackMsgPretext;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SLACK_MSG_PRETEXT',
          value
        );
      }
    },

    mattermostChannelOverride: {
      get() {
        return this.$store.state.config.alert.mattermostChannelOverride;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MATTERMOST_CHANNEL_OVERRIDE', value);
      }
    },

    mattermostUsernameOverride: {
      get() {
        return this.$store.state.config.alert.mattermostUsernameOverride;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MATTERMOST_USERNAME_OVERRIDE',
          value
        );
      }
    },

    mattermostMsgColor: {
      get() {
        return this.$store.state.config.alert.mattermostMsgColor;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MATTERMOST_MSG_COLOR', value);
      }
    },

    mattermostIconUrlOverride: {
      get() {
        return this.$store.state.config.alert.mattermostIconUrlOverride;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MATTERMOST_ICON_URL_OVERRIDE',
          value
        );
      }
    },

    mattermostMsgPretext: {
      get() {
        return this.$store.state.config.alert.mattermostMsgPretext;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MATTERMOST_MSG_PRETEXT',
          value
        );
      }
    },

    mattermostIgnoreSslErrors: {
      get() {
        return this.$store.state.config.alert.mattermostIgnoreSslErrors;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MATTERMOST_IGNORE_SSL_ERRORS',
          value
        );
      }
    },

    mattermostProxy: {
      get() {
        return this.$store.state.config.alert.mattermostProxy;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MATTERMOST_PROXY',
          value
        );
      }
    },

    mattermostTitleLink: {
      get() {
        return this.$store.state.config.alert.mattermostTitleLink;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MATTERMOST_TITLE_LINK',
          value
        );
      }
    },

    mattermostFooter: {
      get() {
        return this.$store.state.config.alert.mattermostFooter;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MATTERMOST_FOOTER',
          value
        );
      }
    },

    mattermostFooterIcon: {
      get() {
        return this.$store.state.config.alert.mattermostFooterIcon;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MATTERMOST_FOOTER_ICON',
          value
        );
      }
    },

    mattermostImageUrl: {
      get() {
        return this.$store.state.config.alert.mattermostImageUrl;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MATTERMOST_IMAGE_URL',
          value
        );
      }
    },

    mattermostThumbUrl: {
      get() {
        return this.$store.state.config.alert.mattermostThumbUrl;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MATTERMOST_THUMB_URL',
          value
        );
      }
    },

    mattermostAuthorName: {
      get() {
        return this.$store.state.config.alert.mattermostAuthorName;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MATTERMOST_AUTHOR_NAME',
          value
        );
      }
    },

    mattermostAuthorLink: {
      get() {
        return this.$store.state.config.alert.mattermostAuthorLink;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MATTERMOST_AUTHOR_LINK',
          value
        );
      }
    },

    mattermostAuthorIcon: {
      get() {
        return this.$store.state.config.alert.mattermostAuthorIcon;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MATTERMOST_AUTHOR_ICON',
          value
        );
      }
    },

    ms_teamsWebhookUrl: {
      get() {
        return this.$store.state.config.alert.ms_teamsWebhookUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_TEAMS_WEBHOOK_URL', value);
      }
    },

    ms_teamsThemeColor: {
      get() {
        return this.$store.state.config.alert.ms_teamsThemeColor;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_TEAMS_THEME_COLOR', value);
      }
    },

    ms_teamsAlertFixedWidth: {
      get() {
        return this.$store.state.config.alert.ms_teamsAlertFixedWidth;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_TEAMS_ALERT_FIXED_WIDTH', value);
      }
    },

    ms_teamsAlertSummary: {
      get() {
        return this.$store.state.config.alert.ms_teamsAlertSummary;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_TEAMS_ALERT_SUMMARY', value);
      }
    },

    ms_teamsProxy: {
      get() {
        return this.$store.state.config.alert.ms_teamsProxy;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_TEAMS_PROXY', value);
      }
    },

    hiveAlertConfigTitle: {
      get() {
        return this.$store.state.config.alert.hiveAlertConfigTitle;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_HIVE_ALERT_CONFIG_TITLE', value);
      }
    },

    hiveAlertConfigType: {
      get() {
        return this.$store.state.config.alert.hiveAlertConfigType;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_HIVE_ALERT_CONFIG_TYPE', value);
      }
    },

    hiveAlertConfigSource: {
      get() {
        return this.$store.state.config.alert.hiveAlertConfigSource;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_HIVE_ALERT_CONFIG_SOURCE', value);
      }
    },

    hiveAlertConfigDescription: {
      get() {
        return this.$store.state.config.alert.hiveAlertConfigDescription;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_HIVE_ALERT_CONFIG_DESCRIPTION', value);
      }
    },

    hiveAlertConfigSeverity: {
      get() {
        return this.$store.state.config.alert.hiveAlertConfigSeverity;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_HIVE_ALERT_CONFIG_SEVERITY', value);
      }
    },

    hiveAlertConfigTags: {
      get() {
        return this.$store.state.config.alert.hiveAlertConfigTags;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_HIVE_ALERT_CONFIG_TAGS', value);
      }
    },

    hiveAlertConfigTlp: {
      get() {
        return this.$store.state.config.alert.hiveAlertConfigTlp;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_HIVE_ALERT_CONFIG_TLP', value);
      }
    },

    hiveAlertConfigStatus: {
      get() {
        return this.$store.state.config.alert.hiveAlertConfigStatus;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_HIVE_ALERT_CONFIG_STATUS', value);
      }
    },

    hiveAlertConfigFollow: {
      get() {
        return this.$store.state.config.alert.hiveAlertConfigFollow;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_HIVE_ALERT_CONFIG_FOLLOW', value);
      }
    },

    alertaApiUrl: {
      get() {
        return this.$store.state.config.alert.alertaApiUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERTA_API_URL', value);
      }
    },

    alertaApiKey: {
      get() {
        return this.$store.state.config.alert.alertaApiKey;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERTA_API_KEY', value);
      }
    },

    alertaSeverity: {
      get() {
        return this.$store.state.config.alert.alertaSeverity;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERTA_SEVERITY', value);
      }
    },

    alertaResource: {
      get() {
        return this.$store.state.config.alert.alertaResource;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERTA_RESOURCE', value);
      }
    },

    alertaText: {
      get() {
        return this.$store.state.config.alert.alertaText;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERTA_TEXT', value);
      }
    },

    alertaEvent: {
      get() {
        return this.$store.state.config.alert.alertaEvent;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERTA_EVENT', value);
      }
    },

    alertaGroup: {
      get() {
        return this.$store.state.config.alert.alertaGroup;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERTA_GROUP', value);
      }
    },

    alertaTags: {
      get() {
        return this.$store.state.config.alert.alertaTags;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERTA_TAGS', value);
      }
    },

    alertaEnvironment: {
      get() {
        return this.$store.state.config.alert.alertaEnvironment;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERTA_ENVIRONMENT', value);
      }
    },

    datadogApiKey: {
      get() {
        return this.$store.state.config.alert.datadogApiKey;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_DATADOG_API_KEY', value);
      }
    },

    datadogAppKey: {
      get() {
        return this.$store.state.config.alert.datadogAppKey;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_DATADOG_APP_KEY', value);
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
    this.limitExcecution = this.$store.state.config.alert.limitExcecution;
  },

  methods: {
    addEmoji(value) {
      this.slackEmojiOverride = value.colons;
    },

    addDiscordEmoji(value) {
      this.discordEmojiTitle = value.colons;
    },

    changeSns() {
      this.snsAwsAccessKeyId = '';
      this.snsAwsSecretAccessKey = '';
      this.snsAwsRegion = '';
      this.snsAwsProfile = '';
    },

    changeTwilio() {
      this.twilioFromNumber = '';
      this.twilioMessageServiceSid = '';
    },

    changeLimitExcecution(val) {
      if (val) {
        this.enableLimitExcecution = true;
      } else {
        this.enableLimitExcecution = false;
        this.limitExcecution = '';
      }
    },

    changeHiveAlertConfigFollow(val) {
      if (val) {
        this.hiveAlertConfigFollow = true;
      } else {
        this.hiveAlertConfigFollow = false;
      }
    },

    changeSmtpSsl(val) {
      if (val) {
        this.smtpSsl = true;
      } else {
        this.smtpSsl = false;
      }
    },

    changeSlackIgnoreSslErrors(val) {
      if (val) {
        this.slackIgnoreSslErrors = true;
      } else {
        this.slackIgnoreSslErrors = false;
      }
    },

    changeMattermostIgnoreSslErrors(val) {
      if (val) {
        this.mattermostIgnoreSslErrors = true;
      } else {
        this.mattermostIgnoreSslErrors = false;
      }
    },

    changestompSsl(val) {
      if (val) {
        this.stompSsl = true;
      } else {
        this.stompSsl = false;
      }
    },

    changemsTeamsAlertFixedWidth(val) {
      if (val) {
        this.ms_teamsAlertFixedWidth = true;
      } else {
        this.ms_teamsAlertFixedWidth = false;
      }
    },

    async validate() {
      try {
        if (this.$refs.hiveAlertConfigTags) {
          await this.validateHiveAlertConfigTags();
        }
        if (this.$refs.command) {
          await this.validateCommand();
        }
        if (this.$refs.alertaTags) {
          await this.validateAlertaTags();
        }
        this.$emit('validate', true);
        return true;
      } catch (error) {
        this.$emit('validate', false);
        return false;
      }
    },

    async validateHiveAlertConfigTags() {
      if (!this.hiveAlertConfigTags.length) {
        this.popHiveAlertConfigTagsValid = false;
        return;
      }
      try {
        this.popHiveAlertConfigTagsValid = await this.$refs.hiveAlertConfigTags.validate();
      } catch (error) {
        this.popHiveAlertConfigTagsValid = false;
        throw error;
      }
    },

    updateHiveAlertConfigTags(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_HIVE_ALERT_CONFIG_TAGS_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removeHiveAlertConfigTagsEntry(entry) {
      this.$store.commit('config/alert/REMOVE_HIVE_ALERT_CONFIG_TAGS_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addHiveAlertConfigTagsEntry() {
      this.$store.commit('config/alert/ADD_HIVE_ALERT_CONFIG_TAGS_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    async validateCommand() {
      if (!this.command.length) {
        this.popCommandValid = false;
        return;
      }
      try {
        this.popCommandValid = await this.$refs.command.validate();
      } catch (error) {
        this.popCommandValid = false;
        throw error;
      }
    },

    updateCommand(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_COMMAND_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removeCommandEntry(entry) {
      this.$store.commit('config/alert/REMOVE_COMMAND_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addCommandEntry() {
      this.$store.commit('config/alert/ADD_COMMAND_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    async validateAlertaTags() {
      if (!this.alertaTags.length) {
        this.popAlertaTagsValid = false;
        return;
      }
      try {
        this.popAlertaTagsValid = await this.$refs.alertaTags.validate();
      } catch (error) {
        this.popAlertaTagsValid = false;
        throw error;
      }
    },

    updateAlertaTags(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_ALERTA_TAGS_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removeAlertaTagsEntry(entry) {
      this.$store.commit('config/alert/REMOVE_ALERTA_TAGS_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addAlertaTagsEntry() {
      this.$store.commit('config/alert/ADD_ALERTA_TAGS_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    updateRealert(value) {
      this.realert = {};
      this.$set(this.realert, Object.keys(value)[0], Object.values(value)[0]);
    },

    changeSlackAttachKibanaDiscoverUrl(val) {
      if (val) {
        this.slackAttachKibanaDiscoverUrl = true;
      } else {
        this.slackAttachKibanaDiscoverUrl = false;
      }
    },

    changeSlackCaCerts(val) {
      if (val) {
        this.slackCaCerts = true;
      } else {
        this.slackCaCerts = false;
      }
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
.disabled {
  .emoji-mart {
    height: auto !important;
    border: 0 !important;
  }

  .emoji-mart-title-label,
  .emoji-mart-bar:first-child,
  .emoji-mart-search,
  .emoji-mart-scroll,
  .emoji-mart-preview-skins {
    display: none;
  }

  .emoji-mart-bar {
    border: 0 !important;
  }

  .emoji-mart-preview {
    height: 45px !important;
  }

  .emoji-mart-preview-emoji {
    left: 0 !important;
  }

  .emoji-mart-preview-data {
    left: 56px !important;
  }
}

.atwho-view {
  max-height: 220px;
  height: 220px;
  margin-bottom: -245px;
}

// Fix issue where clicking on label of dropdown didn't register
.atwho-li span {
  pointer-events: none;
}

:not(.is-disabled) {
  &.slack-danger .el-radio__inner:hover {
    border-color: red;
  }

  &.slack-danger .el-radio__input.is-checked .el-radio__inner {
    border-color: red;
    background: red;
  }

  &.slack-danger .el-radio__input.is-checked + .el-radio__label,
  &.slack-danger {
    color: red !important;
    border-color: red !important;
  }

  &.slack-warning .el-radio__inner:hover {
    border-color: orange;
  }

  &.slack-warning .el-radio__input.is-checked .el-radio__inner {
    border-color: orange;
    background: orange;
  }

  &.slack-warning .el-radio__input.is-checked + .el-radio__label,
  &.slack-warning {
    color: orange !important;
    border-color: orange !important;
  }

  &.slack-good .el-radio__inner:hover {
    border-color: green;
  }

  &.slack-good .el-radio__input.is-checked .el-radio__inner {
    border-color: green;
    background: green;
  }

  &.slack-good .el-radio__input.is-checked + .el-radio__label,
  &.slack-good {
    color: green !important;
    border-color: green !important;
  }

  &.mattermost-danger .el-radio__inner:hover {
    border-color: red;
  }
  &.mattermost-danger .el-radio__input.is-checked .el-radio__inner {
    border-color: red;
    background: red;
  }
  &.mattermost-danger .el-radio__input.is-checked + .el-radio__label,
  &.mattermost-danger {
    color: red !important;
    border-color: red !important;
  }
  &.mattermost-warning .el-radio__inner:hover {
    border-color: orange;
  }
  &.mattermost-warning .el-radio__input.is-checked .el-radio__inner {
    border-color: orange;
    background: orange;
  }
  &.mattermost-warning .el-radio__input.is-checked + .el-radio__label,
  &.mattermost-warning {
    color: orange !important;
    border-color: orange !important;
  }
  &.mattermost-good .el-radio__inner:hover {
    border-color: green;
  }
  &.mattermost-good .el-radio__input.is-checked .el-radio__inner {
    border-color: green;
    background: green;
  }
  &.mattermost-good .el-radio__input.is-checked + .el-radio__label,
  &.mattermost-good {
    color: green !important;
    border-color: green !important;
  }
  &.gitter-error .el-radio__inner:hover {
    border-color: red;
  }
  &.gitter-error .el-radio__input.is-checked .el-radio__inner {
    border-color: red;
    background: red;
  }
  &.gitter-error .el-radio__input.is-checked + .el-radio__label,
  &.gitter-error {
    color: red !important;
    border-color: red !important;
  }
  &.gitter-info .el-radio__inner:hover {
    border-color: blue;
  }
  &.gitter-info .el-radio__input.is-checked .el-radio__inner {
    border-color: green;
    background: blue;
  }
  &.gitter-info .el-radio__input.is-checked + .el-radio__label,
  &.gitter-info {
    color: green !important;
    border-color: blue !important;
  }
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
