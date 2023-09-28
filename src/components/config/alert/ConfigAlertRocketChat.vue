<template>
  <div>
    <el-popover v-model="popRocketChatWebhookUrlVisible" :class="{ 'is-invalid': !popRocketChatWebhookUrlValid }">
      <template #reference>
        <span class="pop-trigger">
          <el-tooltip v-if="rocketChatWebhookUrl.length" :content="rocketChatWebhookUrl.join(', ')" placement="top">
            <span>RocketChatWebhookUrls ({{ rocketChatWebhookUrl.length }})</span>
          </el-tooltip>
          <span v-else>RocketChatWebhookUrls ({{ rocketChatWebhookUrl.length }})</span>
        </span>
      </template>
      <div>
        <!-- native modifier has been removed, please confirm whether the function has been affected  -->
        <el-form
          ref="rocketChatWebhookUrl"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.prevent>
          <el-form-item
            v-for="(entry, index) in rocketChatWebhookUrl"
            :key="index"
            :prop="'rocketChatWebhookUrl.' + index"
            :disabled="viewOnly"
            class="el-form-item-list"
            label="">
            <el-row :gutter="5" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="rocketChatWebhookUrl[index]"
                  :disabled="viewOnly"
                  placeholder="WebhookUrl"
                  @input="(val) => updateRocketChatWebhookUrl(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  :icon="ElIconDelete"
                  circle
                  plain
                  @click="removeRocketChatWebhookUrlEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addRocketChatWebhookUrlEntry">
          Add WebhookUrl
        </el-button>
      </div>
    </el-popover>

    <el-popover v-model="popRocketChatChannelOverrideVisible" :class="{ 'is-invalid': !popRocketChatChannelOverrideValid }">
      <template #reference>
        <span class="pop-trigger">
          <el-tooltip v-if="rocketChatChannelOverride.length" :content="rocketChatChannelOverride.join(', ')" placement="top">
            <span>RocketChatChannelOverrides ({{ rocketChatChannelOverride.length }})</span>
          </el-tooltip>
          <span v-else>RocketChatChannelOverrides ({{ rocketChatChannelOverride.length }})</span>
        </span>
      </template>
      <div>
        <!-- native modifier has been removed, please confirm whether the function has been affected  -->
        <el-form
          ref="rocketChatChannelOverride"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.prevent>
          <el-form-item
            v-for="(entry, index) in rocketChatChannelOverride"
            :key="index"
            :prop="'rocketChatChannelOverride.' + index"
            :disabled="viewOnly"
            class="el-form-item-list"
            label=""
            required>
            <el-row :gutter="5" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="rocketChatChannelOverride[index]"
                  :disabled="viewOnly"
                  placeholder="RocketChatChannelOverrides"
                  @input="(val) => updateRocketChatChannelOverride(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  :icon="ElIconDelete"
                  circle
                  plain
                  @click="removeRocketChatChannelOverrideEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addRocketChatChannelOverrideEntry">
          Add ChatChannelOverride
        </el-button>
      </div>
    </el-popover>

    <praeco-form-item label="Post as" prop="rocketChatUsernameOverride" required>
      <el-input id="rocketChatUsernameOverride" v-model="rocketChatUsernameOverride" :disabled="viewOnly" />
      <label>This is the username that will appear in Rocket.Chat for the alert</label>
    </praeco-form-item>

    <div v-show="viewOnly">
      <emoji
        :data="emojiIndex"
        :emoji="rocketChatEmojiOverride"
        :size="32"
        :disabled="viewOnly" />
    </div>
    <div v-if="!viewOnly">
      <picker
        :disabled="viewOnly"
        :data="emojiIndex"
        color="#189acc"
        @select="addRocketChatEmoji" />
      <emoji
        :data="emojiIndex"
        :emoji="rocketChatEmojiOverride"
        :size="32"
        :disabled="viewOnly" />
    </div>

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
import { Delete as ElIconDelete } from '@element-plus/icons-vue';
import 'emoji-mart-vue-fast/css/emoji-mart.css';
import emojiData from 'emoji-mart-vue-fast/data/all.json';
import { Picker, Emoji, EmojiIndex } from 'emoji-mart-vue-fast/src';

let emojiIndex = new EmojiIndex(emojiData);

export default {
  components: {
    Emoji,
    Picker
  },

  props: ['viewOnly'],
  emits: ['validate'],

  data() {
    return {
      ElIconDelete,
      emojiIndex,
      popRocketChatWebhookUrlVisible: false,
      popRocketChatWebhookUrlValid: true,
      popRocketChatChannelOverrideVisible: false,
      popRocketChatChannelOverrideValid: true,
    };
  },
  computed: {
    rocketChatWebhookUrl: {
      get() {
        return this.$store.state.config.alert.rocketChatWebhookUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_rocket_chat_webhook_url', value);
      }
    },

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
    async validate() {
      try {
        if (this.$refs.rocketChatWebhookUrl) {
          await this.validateRocketChatWebhookUrl();
        }
        if (this.$refs.rocketChatChannelOverride) {
          await this.validateRocketChatChannelOverride();
        }
        this.$emit('validate', true);
        return true;
      } catch (error) {
        this.$emit('validate', false);
        return false;
      }
    },

    async validateRocketChatWebhookUrl() {
      if (!this.rocketChatWebhookUrl.length) {
        this.popRocketChatWebhookUrlValid = false;
        return;
      }
      try {
        this.popRocketChatWebhookUrlValid = await this.$refs.rocketChatWebhookUrl.validate();
      } catch (error) {
        this.popRocketChatWebhookUrlValid = false;
        throw error;
      }
    },

    updateRocketChatWebhookUrl(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_ROCKET_CHAT_WEBHOOK_URL_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removeRocketChatWebhookUrlEntry(entry) {
      this.$store.commit('config/alert/REMOVE_ROCKET_CHAT_WEBHOOK_URL_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addRocketChatWebhookUrlEntry() {
      this.$store.commit('config/alert/ADD_ROCKET_CHAT_WEBHOOK_URL_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    async validateRocketChatChannelOverride() {
      if (!this.rocketChatChannelOverride.length) {
        this.popRocketChatChannelOverrideValid = false;
        return;
      }
      try {
        this.popRocketChatChannelOverrideValid = await this.$refs.rocketChatChannelOverride.validate();
      } catch (error) {
        this.popRocketChatChannelOverrideValid = false;
        throw error;
      }
    },

    updateRocketChatChannelOverride(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_ROCKET_CHAT_CHANNEL_OVERRIDE_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removeRocketChatChannelOverrideEntry(entry) {
      this.$store.commit('config/alert/REMOVE_ROCKET_CHAT_CHANNEL_OVERRIDE_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addRocketChatChannelOverrideEntry() {
      this.$store.commit('config/alert/ADD_ROCKET_CHAT_CHANNEL_OVERRIDE_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

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
