<template>
  <div>
    <praeco-form-item label="WebhookURL" prop="discordWebhookUrl">
      <el-input id="discordWebhookUrl" v-model="discordWebhookUrl" :disabled="viewOnly" @update:model-value="discordWebhookUrl = $event" />
      <label>The webhook URL.</label>
    </praeco-form-item>

    <div v-show="viewOnly">
      <emoji
        :data="emojiIndex"
        :emoji="discordEmojiTitle"
        :size="32"
        :disabled="viewOnly" />
    </div>
    <div v-if="!viewOnly">
      <picker
        :disabled="viewOnly"
        :data="emojiIndex"
        color="#189acc"
        @select="addDiscordEmoji" />
      <emoji
        :data="emojiIndex"
        :emoji="discordEmojiTitle"
        :size="32"
        :disabled="viewOnly" />
    </div>

    <praeco-form-item label="Discord Embed Footer" prop="discordEmbedFooter">
      <el-input id="discordEmbedFooter" v-model="discordEmbedFooter" :disabled="viewOnly" @update:model-value="discordEmbedFooter = $event" />
      <label>embed footer.</label>
    </praeco-form-item>

    <praeco-form-item label="Embed IconUrl" prop="discordEmbedIconUrl">
      <el-input id="discordEmbedIconUrl" v-model="discordEmbedIconUrl" :disabled="viewOnly" @update:model-value="discordEmbedIconUrl = $event" />
      <label>
        You can provide icon_url to use custom image.
        Provide absolute address of the pciture.(exampmle : http://domain/picure.png)
      </label>
    </praeco-form-item>

    <praeco-form-item label="Proxy" prop="discordProxy">
      <el-input id="discordProxy" v-model="discordProxy" :disabled="viewOnly" @update:model-value="discordProxy = $event" />
      <label>
        By default ElastAlert 2 will not use a network proxy to send notifications to Discord.
        Set this option using hostname:port if you need to use a proxy.
      </label>
    </praeco-form-item>

    <praeco-form-item label="Proxy Login" prop="discordProxyLogin">
      <el-input id="discordProxyLogin" v-model="discordProxyLogin" :disabled="viewOnly" @update:model-value="discordProxyLogin = $event" />
      <label>The Discord proxy auth username.</label>
    </praeco-form-item>

    <praeco-form-item label="Proxy Password" prop="discordProxyPassword">
      <el-input id="discordProxyPassword" v-model="discordProxyPassword" :disabled="viewOnly" @update:model-value="discordProxyPassword = $event" />
      <label>The Discord proxy auth password.</label>
    </praeco-form-item>
  </div>
</template>

<script>
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

  data() {
    return {
      emojiIndex,
    };
  },
  computed: {
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

    discordProxy: {
      get() {
        return this.$store.state.config.alert.discordProxy;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_DISCORD_PROXY',
          value
        );
      }
    },

    discordProxyLogin: {
      get() {
        return this.$store.state.config.alert.discordProxyLogin;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_DISCORD_PROXY_LOGIN',
          value
        );
      }
    },

    discordProxyPassword: {
      get() {
        return this.$store.state.config.alert.discordProxyPassword;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_DISCORD_PROXY_PASSWORD',
          value
        );
      }
    }
  },

  methods: {
    addDiscordEmoji(value) {
      this.discordEmojiTitle = value.colons;
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
</style>
