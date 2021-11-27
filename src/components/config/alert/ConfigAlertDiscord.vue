<template>
  <div>
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
  </div>
</template>

<script>
export default {
  props: ['viewOnly'],

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
    }
  },

  methods: {
    addDiscordEmoji(value) {
      this.discordEmojiTitle = value.colons;
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
</style>
