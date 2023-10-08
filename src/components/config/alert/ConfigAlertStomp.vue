<template>
  <div>
    <praeco-form-item label="Host Name" prop="stompHostname" required>
      <el-input id="stompHostname" v-model="stompHostname" :disabled="viewOnly" />
      <label>The STOMP host to use, defaults to localhost.</label>
    </praeco-form-item>

    <praeco-form-item label="Host Port" prop="stompHostport" required>
      <el-input id="stompHostport" v-model="stompHostport" :disabled="viewOnly" />
      <label>The STOMP port to use, defaults to 61613.</label>
    </praeco-form-item>

    <praeco-form-item label="Login" prop="stompLogin" required>
      <el-input id="stompLogin" v-model="stompLogin" :disabled="viewOnly" />
      <label>The STOMP login to use, defaults to admin.</label>
    </praeco-form-item>

    <praeco-form-item label="Password" prop="stompPassword" required>
      <el-input id="stompPassword" v-model="stompPassword" :disabled="viewOnly" />
      <label>The STOMP password to use, defaults to admin.</label>
    </praeco-form-item>

    <praeco-form-item label="Destination" prop="stompDestination">
      <el-input id="stompDestination" v-model="stompDestination" :disabled="viewOnly" />
      <label>The STOMP destination to use, defaults to /queue/ALERT</label>
    </praeco-form-item>
  </div>
</template>

<script>
export default {
  props: {
    viewOnly: Boolean
  },

  computed: {
    stompHostname: {
      get() {
        return this.$store.state.config.alert.stompHostname;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_STOMP_HOSTNAME',
          value
        );
      }
    },

    stompHostport: {
      get() {
        return this.$store.state.config.alert.stompHostport;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_STOMP_HOSTPORT',
          value
        );
      }
    },

    stompLogin: {
      get() {
        return this.$store.state.config.alert.stompLogin;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_STOMP_LOGIN',
          value
        );
      }
    },

    stompPassword: {
      get() {
        return this.$store.state.config.alert.stompPassword;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_STOMP_PASSWORD',
          value
        );
      }
    },

    stompDestination: {
      get() {
        return this.$store.state.config.alert.stompDestination;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_STOMP_DESTINATION',
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
