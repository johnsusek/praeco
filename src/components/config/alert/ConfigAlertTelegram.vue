<template>
  <div>
    <praeco-form-item label="Room ID" prop="telegramRoomId" required>
      <el-input id="telegramRoomId" v-model="telegramRoomId" :disabled="viewOnly" @update:model-value="telegramRoomId = $event" />
      <label>
        Unique identifier for the target chat or username of the
        target channel using telegram chat_id (in the format “-xxxxxxxx”)
      </label>
    </praeco-form-item>

    <praeco-form-item label="Proxy" prop="telegramProxy">
      <el-input id="telegramProxy" v-model="telegramProxy" :disabled="viewOnly" @update:model-value="telegramProxy = $event" />
      <label>
        By default ElastAlert 2 will not use a network proxy to send notifications to Telegram.
        Set this option using hostname:port if you need to use a proxy.
      </label>
    </praeco-form-item>

    <praeco-form-item label="Proxy Login" prop="telegramProxyLogin">
      <el-input id="telegramProxyLogin" v-model="telegramProxyLogin" :disabled="viewOnly" @update:model-value="telegramProxyLogin = $event" />
      <label>The Telegram proxy auth username.</label>
    </praeco-form-item>

    <praeco-form-item label="Proxy Password" prop="telegramProxyPass">
      <el-input id="telegramProxyPass" v-model="telegramProxyPass" :disabled="viewOnly" @update:model-value="telegramProxyPass = $event" />
      <label>The Telegram proxy auth password.</label>
    </praeco-form-item>

    <praeco-form-item label="Parse Mode" prop="telegramParseMode" required>
      <el-radio-group v-model="telegramParseMode" :disabled="viewOnly" @update:model-value="telegramParseMode = $event">
        <el-radio id="telegramParseModeMarkdown" label="markdown" border>
          markdown
        </el-radio>
        <el-radio id="telegramParseModeMarkdownV2" label="markdownV2" border>
          markdownV2
        </el-radio>
        <el-radio id="telegramParseModeHtml" label="html" border>
          html
        </el-radio>
      </el-radio-group>
    </praeco-form-item>

    <praeco-form-item label="Thread Id" prop="telegramThreadId">
      <el-input-number id="telegramThreadId" v-model="telegramThreadId" :disabled="viewOnly" @update:model-value="telegramThreadId = $event" />
      <label>Unique identifier for the target thread of supergroup/forum using telegram message_thread_id.</label>
    </praeco-form-item>
  </div>
</template>

<script>
export default {
  props: ['viewOnly'],

  computed: {
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

    telegramParseMode: {
      get() {
        return this.$store.state.config.alert.telegramParseMode;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_TELEGRAM_PARSE_MODE', value);
      }
    },

    telegramThreadId: {
      get() {
        return this.$store.state.config.alert.telegramThreadId;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TELEGRAM_THREAD_ID',
          value
        );
      }
    },
  },

  methods: {
  }
};
</script>

<style lang="scss" scoped>
</style>
