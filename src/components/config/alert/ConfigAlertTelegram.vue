<template>
  <div>
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
        By default ElastAlert 2 will not use a network proxy to send notifications to Telegram.
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
    }
  },

  methods: {
  }
};
</script>

<style lang="scss">
</style>
