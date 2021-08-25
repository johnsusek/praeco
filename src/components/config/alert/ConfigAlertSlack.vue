<template>
  <div>
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
        By default ElastAlert 2 will use the default webhook icon when posting to the channel.
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
        The default is 10. If a timeout occurs, the alert will be retried next time ElastAlert 2 cycles.
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
        By default ElastAlert 2 will not use a network proxy to send notifications to Slack.
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
  </div>
</template>

<script>
import { Picker } from 'emoji-mart-vue';

let validateSlackDestination = (rule, value, callback) => {
  if (value.length < 2) {
    callback(new Error('Please enter a @username or #channel'));
  } else if (!value.startsWith('@') && !value.startsWith('#')) {
    callback(new Error('Please enter a @username or #channel'));
  } else {
    callback();
  }
};

export default {
  components: {
    Picker
  },

  props: ['viewOnly'],

  data() {
    return {
      rules: {
        slackChannelOverride: [
          {
            validator: validateSlackDestination,
            trigger: 'change'
          }
        ],
      }
    };
  },

  computed: {
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
  },

  methods: {
    addEmoji(value) {
      this.slackEmojiOverride = value.colons;
    },

    changeSlackIgnoreSslErrors(val) {
      if (val) {
        this.slackIgnoreSslErrors = true;
      } else {
        this.slackIgnoreSslErrors = false;
      }
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
}
</style>
