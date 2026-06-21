import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export const DISCORD_EMBED_COLOR_MAX = 16777215;

export function discordEmbedColorToHex(value) {
  if (!Number.isInteger(value) || value < 0 || value > DISCORD_EMBED_COLOR_MAX) {
    return null;
  }

  return `#${value.toString(16).padStart(6, '0').toLowerCase()}`;
}

export function hexToDiscordEmbedColor(value) {
  if (typeof value !== 'string' || !/^#?[0-9a-f]{6}$/i.test(value)) {
    return null;
  }

  return parseInt(value.replace('#', ''), 16);
}

export function useConfigAlertDiscord() {

  // store
  const store = useStore();

  // ===== discordWebhookUrl =====
  const discordWebhookUrl = computed({
    get: () => store.state.config.alert.discordWebhookUrl,
    set: (value) =>
      store.commit('config/alert/UPDATE_DISCORD_WEBHOOK_URL', value)
  });

  // ===== discordEmojiTitle =====
  const discordEmojiTitle = computed({
    get: () => store.state.config.alert.discordEmojiTitle,
    set: (value) =>
      store.commit('config/alert/UPDATE_DISCORD_EMOJI_TITLE', value)
  });

  const addDiscordEmoji = (value) => {
    discordEmojiTitle.value = value.colons;
  };

  // ===== discordEmbedFooter =====
  const discordEmbedFooter = computed({
    get: () => store.state.config.alert.discordEmbedFooter,
    set: (value) =>
      store.commit('config/alert/UPDATE_DISCORD_EMBED_FOOTER', value)
  });

  // ===== discordEmbedColor =====
  const discordEmbedColor = computed({
    get: () => store.state.config.alert.discordEmbedColor,
    set: (value) =>
      store.commit('config/alert/UPDATE_DISCORD_EMBED_COLOR', value)
  });

  const discordEmbedColorHex = computed({
    get: () => discordEmbedColorToHex(store.state.config.alert.discordEmbedColor),
    set: (value) =>
      store.commit('config/alert/UPDATE_DISCORD_EMBED_COLOR', hexToDiscordEmbedColor(value))
  });

  // ===== discordEmbedIconUrl =====
  const discordEmbedIconUrl = computed({
    get: () => store.state.config.alert.discordEmbedIconUrl,
    set: (value) =>
      store.commit('config/alert/UPDATE_DISCORD_EMBED_ICON_URL', value)
  });

  // ===== discordProxy =====
  const discordProxy = computed({
    get: () => store.state.config.alert.discordProxy,
    set: (value) =>
      store.commit('config/alert/UPDATE_DISCORD_PROXY', value)
  });

  // ===== discordProxyLogin =====
  const discordProxyLogin = computed({
    get: () => store.state.config.alert.discordProxyLogin,
    set: (value) =>
      store.commit('config/alert/UPDATE_DISCORD_PROXY_LOGIN', value)
  });

  // ===== discordProxyPassword =====
  const discordProxyPassword = computed({
    get: () => store.state.config.alert.discordProxyPassword,
    set: (value) =>
      store.commit('config/alert/UPDATE_DISCORD_PROXY_PASSWORD', value)
  });

  // ===== return =====
  return {
    discordWebhookUrl,
    discordEmojiTitle,
    addDiscordEmoji,
    discordEmbedFooter,
    discordEmbedColor,
    discordEmbedColorHex,
    discordEmbedIconUrl,
    discordProxy,
    discordProxyLogin,
    discordProxyPassword
  };
}
