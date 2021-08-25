<template>
  <div>
    <el-form-item label="Channel or username" prop="rocketChatChannelOverride" required>
      <el-input id="rocketChatChannelOverride" v-model="rocketChatChannelOverride" :disabled="viewOnly" />
      <label>
        The @username or #channel to send the alert. Tip: Create new channels
        for your alerts, to have fine-grained control of Slack notifications.
      </label>
    </el-form-item>

    <praeco-form-item label="Post as" prop="rocketChatUsernameOverride" required>
      <el-input id="rocketChatUsernameOverride" v-model="rocketChatUsernameOverride" :disabled="viewOnly" />
      <label>This is the username that will appear in Rocket.Chat for the alert</label>
    </praeco-form-item>

    <praeco-form-item
      v-if="!(viewOnly && !rocketChatEmojiOverride)"
      :class="{ 'disabled': viewOnly }"
      label="Icon"
      prop="rocketChatEmojiOverride">
      <picker
        :emoji="rocketChatEmojiOverride"
        :title="rocketChatEmojiOverride"
        color="#189acc"
        @select="addRocketChatEmoji" />
    </praeco-form-item>

    <el-form-item label="Message color" prop="rocketChatMsgColor" required>
      <el-radio-group v-model="rocketChatMsgColor" :disabled="viewOnly">
        <el-radio id="rocketChatMsgColorDanger" label="danger" border class="rocketChat-danger">
          Danger
        </el-radio>
        <el-radio id="rocketChatMsgColorWarning" label="warning" border class="rocketChat-warning">
          Warning
        </el-radio>
        <el-radio id="rocketChatMsgColorGood" label="good" border class="rocketChat-good">
          Good
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="Text String" prop="rocketChatTextString">
      <el-input id="rocketChatTextString" v-model="rocketChatTextString" :disabled="viewOnly" />
      <label>Notification message you want to add.</label>
    </el-form-item>

    <el-form-item label="Proxy" prop="rocketChatProxy">
      <el-input id="rocketChatProxy" v-model="rocketChatProxy" :disabled="viewOnly" />
      <label>
        By default ElastAlert2 will not use a network proxy to send notifications to Rocket.Chat.
        Set this option using hostname:port if you need to use a proxy.
      </label>
    </el-form-item>

    <el-form-item label="Attach Kibana Discover URL" prop="rocketChatAttachKibanaDiscoverUrl">
      <el-switch
        id="rocketChatAttachKibanaDiscoverUrl"
        v-model="rocketChatAttachKibanaDiscoverUrl"
        :disabled="viewOnly"
        @change="changeRocketChatAttachKibanaDiscoverUrl" />
    </el-form-item>

    <el-form-item label="Kibana Discover Color" prop="rocketChatKibanaDiscoverColor">
      <el-color-picker
        v-model="rocketChatKibanaDiscoverColor" :disabled="viewOnly" />
      <label>The color of the Kibana Discover url attachment.</label>
    </el-form-item>

    <el-form-item label="Kibana Discover Title" prop="rocketChatKibanaDiscoverTitle">
      <el-input v-model="rocketChatKibanaDiscoverTitle" :disabled="viewOnly" />
      <label>The title of the Kibana Discover url attachment.</label>
    </el-form-item>

    <el-form-item label="Ignore SSL Errors" prop="rocketChatIgnoreSslErrors">
      <el-switch
        id="rocketChatIgnoreSslErrors"
        v-model="rocketChatIgnoreSslErrors"
        :disabled="viewOnly"
        @change="changeRocketChatIgnoreSslErrors" />
    </el-form-item>

    <el-form-item label="CA Certs" prop="rocketChatCaCerts">
      <el-switch
        id="rocketChatCaCerts"
        v-model="rocketChatCaCerts"
        :disabled="viewOnly"
        @change="changeRocketChatCaCerts" />
    </el-form-item>

    <el-form-item label="Timeout" prop="rocketChatTimeout">
      <el-input-number id="rocketChatTimeout" v-model="rocketChatTimeout" :disabled="viewOnly" />
      <label>
        You can specify a timeout value, in seconds, for making communicating with Rocket.Chat.
        The default is 10. If a timeout occurs, the alert will be retried next time ElastAlert 2 cycles.
      </label>
    </el-form-item>
  </div>
</template>

<script>
import { Picker } from 'emoji-mart-vue';

let validateRocketChatDestination = (rule, value, callback) => {
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
        rocketChatChannelOverride: [
          {
            validator: validateRocketChatDestination,
            trigger: 'change'
          }
        ]
      }
    };
  },

  computed: {
    rocketChatChannelOverride: {
      get() {
        return this.$store.state.config.alert.rocketChatChannelOverride;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ROCKET_CHAT_CHANNEL_OVERRIDE', value);
      }
    },

    rocketChatUsernameOverride: {
      get() {
        return this.$store.state.config.alert.rocketChatUsernameOverride;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ROCKET_CHAT_USERNAME_OVERRIDE',
          value
        );
      }
    },

    rocketChatEmojiOverride: {
      get() {
        return this.$store.state.config.alert.rocketChatEmojiOverride;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ROCKET_CHAT_EMOJI_OVERRIDE', value);
      }
    },

    rocketChatTextString: {
      get() {
        return this.$store.state.config.alert.rocketChatTextString;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ROCKET_CHAT_TEXT_STRING',
          value
        );
      }
    },

    rocketChatMsgColor: {
      get() {
        return this.$store.state.config.alert.rocketChatMsgColor;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ROCKET_CHAT_MSG_COLOR', value);
      }
    },

    rocketChatProxy: {
      get() {
        return this.$store.state.config.alert.rocketChatProxy;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ROCKET_CHAT_PROXY',
          value
        );
      }
    },

    rocketChatAttachKibanaDiscoverUrl: {
      get() {
        return this.$store.state.config.alert.rocketChatAttachKibanaDiscoverUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ROCKET_CHAT_ATTACH_KIBANA_DISCOVER_URL', value);
      }
    },

    rocketChatKibanaDiscoverColor: {
      get() {
        return this.$store.state.config.alert.rocketChatKibanaDiscoverColor;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ROCKET_CHAT_KIBANA_DISCOVER_COLOR', value);
      }
    },

    rocketChatKibanaDiscoverTitle: {
      get() {
        return this.$store.state.config.alert.rocketChatKibanaDiscoverTitle;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ROCKET_CHAT_KIBANA_DISCOVER_TITLE', value);
      }
    },

    rocketChatIgnoreSslErrors: {
      get() {
        return this.$store.state.config.alert.rocketChatIgnoreSslErrors;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ROCKET_CHAT_IGNORE_SSL_ERRORS',
          value
        );
      }
    },

    rocketChatCaCerts: {
      get() {
        return this.$store.state.config.alert.rocketChatCaCerts;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ROCKET_CHAT_CA_CERTS',
          value
        );
      }
    },
    rocketChatTimeout: {
      get() {
        return this.$store.state.config.alert.rocketChatTimeout;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ROCKET_CHAT_TIMEOUT',
          value
        );
      }
    }
  },

  methods: {
    addRocketChatEmoji(value) {
      this.rocketChatEmojiOverride = value.colons;
    },

    changeRocketChatIgnoreSslErrors(val) {
      if (val) {
        this.rocketChatIgnoreSslErrors = true;
      } else {
        this.rocketChatIgnoreSslErrors = false;
      }
    },

    changeRocketChatCaCerts(val) {
      if (val) {
        this.rocketChatCaCerts = true;
      } else {
        this.rocketChatCaCerts = false;
      }
    },

    changeRocketChatAttachKibanaDiscoverUrl(val) {
      if (val) {
        this.rocketChatAttachKibanaDiscoverUrl = true;
      } else {
        this.rocketChatAttachKibanaDiscoverUrl = false;
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
  &.rocketChat-danger .el-radio__inner:hover {
    border-color: red;
  }
  &.rocketChat-danger .el-radio__input.is-checked .el-radio__inner {
    border-color: red;
    background: red;
  }
  &.rocketChat-danger .el-radio__input.is-checked + .el-radio__label,
  &.rocketChat-danger {
    color: red !important;
    border-color: red !important;
  }
  &.rocketChat-warning .el-radio__inner:hover {
    border-color: orange;
  }
  &.rocketChat-warning .el-radio__input.is-checked .el-radio__inner {
    border-color: orange;
    background: orange;
  }
  &.rocketChat-warning .el-radio__input.is-checked + .el-radio__label,
  &.rocketChat-warning {
    color: orange !important;
    border-color: orange !important;
  }
  &.rocketChat-good .el-radio__inner:hover {
    border-color: green;
  }
  &.rocketChat-good .el-radio__input.is-checked .el-radio__inner {
    border-color: green;
    background: green;
  }
  &.rocketChat-good .el-radio__input.is-checked + .el-radio__label,
  &.rocketChat-good {
    color: green !important;
    border-color: green !important;
  }
}
</style>
