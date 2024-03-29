<template>
  <div>
    <el-popover v-model="popMattermostWebhookUrlVisible" :class="{ 'is-invalid': !popMattermostWebhookUrlValid }">
      <template #reference>
        <span class="pop-trigger">
          <el-tooltip v-if="mattermostWebhookUrl.length" :content="mattermostWebhookUrl.join(', ')" placement="top">
            <span>MattermostWebhookUrls ({{ mattermostWebhookUrl.length }})</span>
          </el-tooltip>
          <span v-else>mattermostWebhookUrls ({{ mattermostWebhookUrl.length }})</span>
        </span>
      </template>
      <div>
        <el-form
          ref="mattermostWebhookUrl"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in mattermostWebhookUrl"
            :key="index"
            :prop="`mattermostWebhookUrl.${index}`"
            :disabled="viewOnly"
            class="el-form-item-list"
            label="">
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="mattermostWebhookUrl[index]"
                  :disabled="viewOnly"
                  placeholder="WebhookUrl"
                  @input="(val) => updateMattermostWebhookUrl(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="removeMattermostWebhookUrlEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addmattermostWebhookUrlEntry">
          Add WebhookUrl
        </el-button>
      </div>
    </el-popover>

    <el-popover v-model="popMattermostChannelOverrideVisible" :class="{ 'is-invalid': !popMattermostChannelOverrideValid }">
      <template #reference>
        <span class="pop-trigger">
          <el-tooltip v-if="mattermostChannelOverride.length" :content="mattermostChannelOverride.join(', ')" placement="top">
            <span>MattermostChannelOverrides ({{ mattermostChannelOverride.length }})</span>
          </el-tooltip>
          <span v-else>MattermostChannelOverrides ({{ mattermostChannelOverride.length }})</span>
        </span>
      </template>
      <div>
        <el-form
          ref="mattermostChannelOverride"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in mattermostChannelOverride"
            :key="index"
            :prop="`mattermostChannelOverride.${index}`"
            :disabled="viewOnly"
            class="el-form-item-list"
            label=""
            required>
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="mattermostChannelOverride[index]"
                  :disabled="viewOnly"
                  placeholder="MattermostChannelOverrides"
                  @input="(val) => updatemattermostChannelOverride(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="removemattermostChannelOverrideEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addmattermostChannelOverrideEntry">
          Add ChannelOverrides
        </el-button>
      </div>
    </el-popover>

    <praeco-form-item label="Post as" prop="mattermostUsernameOverride" required>
      <el-input id="mattermostUsernameOverride" :value="mattermostUsernameOverride" :disabled="viewOnly" @input="mattermostUsernameOverride = $event" />
      <label>This is the username that will appear in Mattermost for the alert</label>
    </praeco-form-item>

    <div v-show="viewOnly">
      <emoji
        :data="emojiIndex"
        :emoji="mattermostEmojiOverride"
        :size="32"
        :disabled="viewOnly" />
    </div>
    <div v-if="!viewOnly">
      <picker
        :disabled="viewOnly"
        :data="emojiIndex"
        color="#189acc"
        @select="addMattermostEmoji" />
      <emoji
        :data="emojiIndex"
        :emoji="mattermostEmojiOverride"
        :size="32"
        :disabled="viewOnly" />
    </div>

    <el-form-item label="Message color" prop="mattermostMsgColor" required>
      <el-radio-group :value="mattermostMsgColor" :disabled="viewOnly" @input="mattermostMsgColor = $event">
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
        :value="mattermostIgnoreSslErrors"
        :disabled="viewOnly"
        @change="changeMattermostIgnoreSslErrors" />
    </el-form-item>

    <el-form-item label="Icon URL Override" prop="mattermostIconUrlOverride">
      <el-input id="mattermostIconUrlOverride" :value="mattermostIconUrlOverride" :disabled="viewOnly" @input="mattermostIconUrlOverride = $event" />
      <label>
        By default ElastAlert 2 will use the default webhook icon when posting to the channel.
        You can provide icon_url to use custom image.
        Provide absolute address of the picture or Base64 data url.
      </label>
    </el-form-item>

    <el-form-item label="Msg Pretext" prop="mattermostMsgPretext">
      <el-input id="mattermostMsgPretext" :value="mattermostMsgPretext" :disabled="viewOnly" @input="mattermostMsgPretext = $event" />
      <label>You can set the message attachment pretext using this option.</label>
    </el-form-item>

    <el-form-item label="Proxy" prop="mattermostProxy">
      <el-input id="mattermostProxy" :value="mattermostProxy" :disabled="viewOnly" @input="mattermostProxy = $event" />
      <label>
        By default ElastAlert 2 will not use a network proxy to send notifications to Mattermost.
        Set this option using hostname:port if you need to use a proxy.
      </label>
    </el-form-item>

    <el-form-item label="Title" prop="mattermostTitle">
      <el-input :value="mattermostTitle" :disabled="viewOnly" @input="mattermostTitle = $event" />
      <label>Sets a title for the message, this shows up as a blue text at the start of the message.</label>
    </el-form-item>

    <el-form-item label="Title Link" prop="mattermostTitleLink">
      <el-input :value="mattermostTitleLink" :disabled="viewOnly" @input="mattermostTitleLink = $event" />
      <label>You can add a link in your Mattermost notification by setting this to a valid URL.</label>
    </el-form-item>

    <el-form-item label="Footer" prop="mattermostFooter">
      <el-input :value="mattermostFooter" :disabled="viewOnly" @input="mattermostFooter = $event" />
      <label>Add a static footer text for alert.</label>
    </el-form-item>

    <el-form-item label="Footer Icon" prop="mattermostFooterIcon">
      <el-input :value="mattermostFooterIcon" :disabled="viewOnly" @input="mattermostFooterIcon = $event" />
      <label>A Public Url for a footer icon.</label>
    </el-form-item>

    <el-form-item label="Image URL" prop="mattermostImageUrl">
      <el-input :value="mattermostImageUrl" :disabled="viewOnly" @input="mattermostImageUrl = $event" />
      <label>An optional URL to an image file (GIF, JPEG, PNG, BMP, or SVG).</label>
    </el-form-item>

    <el-form-item label="Thumb URL" prop="mattermostThumbUrl">
      <el-input :value="mattermostThumbUrl" :disabled="viewOnly" @input="mattermostThumbUrl = $event" />
      <label>An optional URL to an image file (GIF, JPEG, PNG, BMP, or SVG) that is displayed as thumbnail.</label>
    </el-form-item>

    <el-form-item label="Author Name" prop="mattermostAuthorName">
      <el-input :value="mattermostAuthorName" :disabled="viewOnly" @input="mattermostAuthorName = $event" />
      <label>An optional name used to identify the author.</label>
    </el-form-item>

    <el-form-item label="Author Link" prop="mattermostAuthorLink">
      <el-input :value="mattermostAuthorLink" :disabled="viewOnly" @input="mattermostAuthorLink = $event" />
      <label>An optional URL used to hyperlink the author_name.</label>
    </el-form-item>

    <el-form-item label="Author Icon" prop="mattermostAuthorIcon">
      <el-input :value="mattermostAuthorIcon" :disabled="viewOnly" @input="mattermostAuthorIcon = $event" />
      <label>An optional URL used to display a 16x16 pixel icon beside the author_name.</label>
    </el-form-item>

    <el-form-item label="Attach Kibana Discover URL" prop="mattermostAttachKibanaDiscoverUrl">
      <el-switch
        id="mattermostAttachKibanaDiscoverUrl"
        :value="mattermostAttachKibanaDiscoverUrl"
        :disabled="viewOnly"
        @change="changeMattermostAttachKibanaDiscoverUrl" />
    </el-form-item>

    <el-form-item label="Kibana Discover Color" prop="mattermostKibanaDiscoverColor">
      <el-color-picker
        v-model="mattermostKibanaDiscoverColor" :disabled="viewOnly" />
      <label>The color of the Kibana Discover url attachment.</label>
    </el-form-item>

    <el-form-item label="Kibana Discover Title" prop="mattermostKibanaDiscoverTitle">
      <el-input :value="mattermostKibanaDiscoverTitle" :disabled="viewOnly" @input="mattermostKibanaDiscoverTitle = $event" />
      <label>The title of the Kibana Discover url attachment.</label>
    </el-form-item>
  </div>
</template>

<script>
import emojiData from 'emoji-mart-vue-fast/data/all.json';
import { Picker, Emoji, EmojiIndex } from 'emoji-mart-vue-fast';

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
      emojiIndex,
      popMattermostWebhookUrlVisible: false,
      popMattermostWebhookUrlValid: true,
      popMattermostChannelOverrideVisible: false,
      popMattermostChannelOverrideValid: true,
    };
  },
  computed: {
    mattermostWebhookUrl: {
      get() {
        return this.$store.state.config.alert.mattermostWebhookUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MATTERMOST_WEBHOOK_URL', value);
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

    mattermostEmojiOverride: {
      get() {
        return this.$store.state.config.alert.mattermostEmojiOverride;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MATTERMOST_EMOJI_OVERRIDE', value);
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

    mattermostTitle: {
      get() {
        return this.$store.state.config.alert.mattermostTitle;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MATTERMOST_TITLE',
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

    mattermostAttachKibanaDiscoverUrl: {
      get() {
        return this.$store.state.config.alert.mattermostAttachKibanaDiscoverUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MATTERMOST_ATTACH_KIBANA_DISCOVER_URL', value);
      }
    },

    mattermostKibanaDiscoverColor: {
      get() {
        return this.$store.state.config.alert.mattermostKibanaDiscoverColor;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MATTERMOST_KIBANA_DISCOVER_COLOR', value);
      }
    },

    mattermostKibanaDiscoverTitle: {
      get() {
        return this.$store.state.config.alert.mattermostKibanaDiscoverTitle;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MATTERMOST_KIBANA_DISCOVER_TITLE', value);
      }
    }
  },

  methods: {
    async validate() {
      try {
        if (this.$refs.mattermostWebhookUrl) {
          await this.validateMattermostWebhookUrl();
        }
        if (this.$refs.mattermostChannelOverride) {
          await this.validatemattermostChannelOverride();
        }
        this.$emit('validate', true);
        return true;
      } catch (error) {
        this.$emit('validate', false);
        return false;
      }
    },

    async validateMattermostWebhookUrl() {
      if (!this.mattermostWebhookUrl.length) {
        this.popMattermostWebhookUrlValid = false;
        return;
      }
      try {
        this.popMattermostWebhookUrlValid = await this.$refs.mattermostWebhookUrl.validate();
      } catch (error) {
        this.popMattermostWebhookUrlValid = false;
        throw error;
      }
    },

    updateMattermostWebhookUrl(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_MATTERMOST_WEBHOOK_URL_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removeMattermostWebhookUrlEntry(entry) {
      this.$store.commit('config/alert/REMOVE_MATTERMOST_WEBHOOK_URL_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addmattermostWebhookUrlEntry() {
      this.$store.commit('config/alert/ADD_MATTERMOST_WEBHOOK_URL_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    async validatemattermostChannelOverride() {
      if (!this.mattermostChannelOverride.length) {
        this.popMattermostChannelOverrideValid = false;
        return;
      }
      try {
        this.popMattermostChannelOverrideValid = await this.$refs.mattermostChannelOverride.validate();
      } catch (error) {
        this.popMattermostChannelOverrideValid = false;
        throw error;
      }
    },
    updatemattermostChannelOverride(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_MATTERMOST_CHANNEL_OVERRIDE_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },
    removemattermostChannelOverrideEntry(entry) {
      this.$store.commit('config/alert/REMOVE_MATTERMOST_CHANNEL_OVERRIDE_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },
    addmattermostChannelOverrideEntry() {
      this.$store.commit('config/alert/ADD_MATTERMOST_CHANNEL_OVERRIDE_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    changeMattermostIgnoreSslErrors(val) {
      this.mattermostIgnoreSslErrors = val;
    },

    changeMattermostAttachKibanaDiscoverUrl(val) {
      this.mattermostAttachKibanaDiscoverUrl = val;
    },

    addMattermostEmoji(value) {
      this.mattermostEmojiOverride = value.colons;
    }
  }
};
</script>

<style lang="scss" scoped>
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
}
</style>
