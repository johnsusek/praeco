<template>
  <div>
    <praeco-form-item label="Api Key" prop="chatworkApikey" required>
      <el-input id="chatworkApikey" :value="chatworkApikey" :disabled="viewOnly" @input="chatworkApikey = $event" />
      <label>ChatWork API KEY.</label>
    </praeco-form-item>

    <praeco-form-item label="Room Id" prop="chatworkRoomId" required>
      <el-input id="chatworkRoomId" :value="chatworkRoomId" :disabled="viewOnly" @input="chatworkRoomId = $event" />
      <label>
        The ID of the room you are talking to in Chatwork.
        How to find the room ID is the part of the number after "rid" at the end of the URL of the browser.
      </label>
    </praeco-form-item>

    <praeco-form-item label="Proxy" prop="chatworkProxy">
      <el-input id="chatworkProxy" :value="chatworkProxy" :disabled="viewOnly" @input="chatworkProxy = $event" />
      <label>
        By default ElastAlert 2 will not use a network proxy to send notifications to chatwork.
        Set this option using hostname:port if you need to use a proxy.
      </label>
    </praeco-form-item>

    <praeco-form-item label="Proxy Login" prop="chatworkProxyLogin">
      <el-input id="chatworkProxyLogin" :value="chatworkProxyLogin" :disabled="viewOnly" @input="chatworkProxyLogin = $event" />
      <label>The chatwork proxy auth username.</label>
    </praeco-form-item>

    <praeco-form-item label="Proxy Password" prop="chatworkProxyPass">
      <el-input id="chatworkProxyPass" :value="chatworkProxyPass" :disabled="viewOnly" @input="chatworkProxyPass = $event" />
      <label>The chatwork proxy auth password.</label>
    </praeco-form-item>
  </div>
</template>

<script>

export default {
  props: ['viewOnly'],

  computed: {
    chatworkApikey: {
      get() {
        return this.$store.state.config.alert.chatworkApikey;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_CHATWORK_API_KEY',
          value
        );
      }
    },
    chatworkRoomId: {
      get() {
        return this.$store.state.config.alert.chatworkRoomId;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_CHATWORK_ROOM_ID',
          value
        );
      }
    },

    chatworkProxy: {
      get() {
        return this.$store.state.config.alert.chatworkProxy;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_CHATWORK_PROXY',
          value
        );
      }
    },

    chatworkProxyLogin: {
      get() {
        return this.$store.state.config.alert.chatworkProxyLogin;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_CHATWORK_PROXY_LOGIN',
          value
        );
      }
    },

    chatworkProxyPass: {
      get() {
        return this.$store.state.config.alert.chatworkProxyPass;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_CHATWORK_PROXY_PASS',
          value
        );
      }
    }
  },

  methods: {
  }
};
</script>

<style lang="scss" scoped>

</style>
