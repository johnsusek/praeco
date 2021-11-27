<template>
  <div>
    <el-form-item label="HTTP POST URL" prop="httpPostUrl" required>
      <el-input v-model="httpPostUrl" :disabled="viewOnly" />
      <label>JSON results will be POSTed to this URL</label>
    </el-form-item>

    <el-form-item label="CA Certs" prop="httpPostCaCerts">
      <el-switch
        id="httpPostCaCerts"
        v-model="httpPostCaCerts"
        :disabled="viewOnly"
        @change="changeHttpPostCaCerts" />
    </el-form-item>

    <el-form-item label="Ignore SSL Errors" prop="httpPostIgnoreSslErrors">
      <el-switch
        id="httpPostIgnoreSslErrors"
        v-model="httpPostIgnoreSslErrors"
        :disabled="viewOnly"
        @change="changeHttpPostIgnoreSslErrors" />
    </el-form-item>

    <el-form-item label="Timeout" prop="httpPostTimeout">
      <el-input-number id="httpPostTimeout" v-model="httpPostTimeout" :disabled="viewOnly" />
      <label>
        The timeout value, in seconds, for making the post.
        The default is 10.
        If a timeout occurs, the alert will be retried next time ElastAlert 2 cycles.
      </label>
    </el-form-item>

    <el-form-item label="Proxy" prop="httpPostProxy">
      <el-input id="httpPostProxy" v-model="httpPostProxy" :disabled="viewOnly" />
      <label>URL of proxy, if required.</label>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: ['viewOnly'],

  computed: {
    httpPostUrl: {
      get() {
        return this.$store.state.config.alert.httpPostUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_HTTP_POST_URL', value);
      }
    },

    httpPostIgnoreSslErrors: {
      get() {
        return this.$store.state.config.alert.httpPostIgnoreSslErrors;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_HTTP_POST_IGNORE_SSL_ERRORS',
          value
        );
      }
    },

    httpPostCaCerts: {
      get() {
        return this.$store.state.config.alert.httpPostCaCerts;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_HTTP_POST_CA_CERTS',
          value
        );
      }
    },

    httpPostTimeout: {
      get() {
        return this.$store.state.config.alert.httpPostTimeout;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_HTTP_POST_TIMEOUT',
          value
        );
      }
    },

    httpPostProxy: {
      get() {
        return this.$store.state.config.alert.httpPostProxy;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_HTTP_POST_PROXY',
          value
        );
      }
    }
  },

  methods: {
    changeHttpPostIgnoreSslErrors(val) {
      if (val) {
        this.httpPostIgnoreSslErrors = true;
      } else {
        this.httpPostIgnoreSslErrors = false;
      }
    },

    changeHttpPostCaCerts(val) {
      if (val) {
        this.httpPostCaCerts = true;
      } else {
        this.httpPostCaCerts = false;
      }
    }
  }
};
</script>

<style lang="scss">
</style>
