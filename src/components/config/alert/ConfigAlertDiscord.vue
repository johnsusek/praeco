<template>
  <div>
    <praeco-form-item label="discord_webhook_url" prop="discordWebhookUrl">
      <el-input v-model="discordWebhookUrl" :disabled="viewOnly" />
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

    <praeco-form-item label="discord_embed_footer" prop="discordEmbedFooter">
      <el-input v-model="discordEmbedFooter" :disabled="viewOnly" />
      <label>embed footer.</label>
    </praeco-form-item>

    <praeco-form-item label="discord_embed_color" prop="discordEmbedColor">
      <el-input-number v-model="discordEmbedColor" :disabled="viewOnly" :min="0" :max="16777215" />
      <label>
        Discord embed color as a decimal RGB integer from 0 to 16777215.
      </label>
    </praeco-form-item>

    <praeco-form-item label="discord_embed_icon_url" prop="discordEmbedIconUrl">
      <el-input v-model="discordEmbedIconUrl" :disabled="viewOnly" />
      <label>
        You can provide icon_url to use custom image.
        Provide absolute address of the pciture.(exampmle : http://domain/picure.png)
      </label>
    </praeco-form-item>

    <praeco-form-item label="discord_proxy" prop="discordProxy">
      <el-input v-model="discordProxy" :disabled="viewOnly" />
      <label>
        By default ElastAlert 2 will not use a network proxy to send notifications to Discord.
        Set this option using hostname:port if you need to use a proxy.
      </label>
    </praeco-form-item>

    <praeco-form-item label="discord_proxy_login" prop="discordProxyLogin">
      <el-input v-model="discordProxyLogin" :disabled="viewOnly" />
      <label>The Discord proxy auth username.</label>
    </praeco-form-item>

    <praeco-form-item label="discord_proxy_password" prop="discordProxyPassword">
      <el-input v-model="discordProxyPassword" :disabled="viewOnly" />
      <label>The Discord proxy auth password.</label>
    </praeco-form-item>
  </div>
</template>

<script setup>
import 'emoji-mart-vue-fast/css/emoji-mart.css';
import emojiData from 'emoji-mart-vue-fast/data/all.json';
import { Picker, Emoji, EmojiIndex } from 'emoji-mart-vue-fast';

import { useConfigAlertDiscord } from '@/composables/config/alert/useConfigAlertDiscord';

// props
defineProps({
  viewOnly: Boolean
});

const {
  discordWebhookUrl,
  discordEmojiTitle,
  addDiscordEmoji,
  discordEmbedFooter,
  discordEmbedColor,
  discordEmbedIconUrl,
  discordProxy,
  discordProxyLogin,
  discordProxyPassword
} = useConfigAlertDiscord();

const emojiIndex = new EmojiIndex(emojiData);
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
