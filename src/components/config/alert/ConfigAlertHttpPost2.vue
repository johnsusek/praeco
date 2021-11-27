<template>
  <div>
    <el-form-item label="HTTP POST URL" prop="httpPost2Url" required>
      <el-input v-model="httpPost2Url" :disabled="viewOnly" />
      <label>JSON results will be POSTed to this URL</label>
    </el-form-item>

    <el-form-item label="CA Certs" prop="httpPost2CaCerts">
      <el-switch
        id="httpPost2CaCerts"
        v-model="httpPost2CaCerts"
        :disabled="viewOnly"
        @change="changeHttpPost2CaCerts" />
    </el-form-item>

    <el-form-item label="Ignore SSL Errors" prop="httpPost2IgnoreSslErrors">
      <el-switch
        id="httpPost2IgnoreSslErrors"
        v-model="httpPost2IgnoreSslErrors"
        :disabled="viewOnly"
        @change="changeHttpPost2IgnoreSslErrors" />
    </el-form-item>

    <el-form-item label="Timeout" prop="httpPost2Timeout">
      <el-input-number id="httpPost2Timeout" v-model="httpPost2Timeout" :disabled="viewOnly" />
      <label>
        The timeout value, in seconds, for making the post.
        The default is 10.
        If a timeout occurs, the alert will be retried next time ElastAlert 2 cycles.
      </label>
    </el-form-item>

    <el-form-item label="Proxy" prop="httpPost2Proxy">
      <el-input id="httpPost2Proxy" v-model="httpPost2Proxy" :disabled="viewOnly" />
      <label>URL of proxy, if required.</label>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: ['viewOnly'],

  computed: {
    httpPost2Url: {
      get() {
        return this.$store.state.config.alert.httpPost2Url;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_HTTP_POST2_URL', value);
      }
    },

    httpPost2IgnoreSslErrors: {
      get() {
        return this.$store.state.config.alert.httpPost2IgnoreSslErrors;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_HTTP_POST2_IGNORE_SSL_ERRORS',
          value
        );
      }
    },

    httpPost2CaCerts: {
      get() {
        return this.$store.state.config.alert.httpPost2CaCerts;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_HTTP_POST2_CA_CERTS',
          value
        );
      }
    },

    httpPost2Timeout: {
      get() {
        return this.$store.state.config.alert.httpPost2Timeout;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_HTTP_POST2_TIMEOUT',
          value
        );
      }
    },

    httpPost2Proxy: {
      get() {
        return this.$store.state.config.alert.httpPost2Proxy;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_HTTP_POST2_PROXY',
          value
        );
      }
    }
  },

  methods: {
    changeHttpPost2IgnoreSslErrors(val) {
      if (val) {
        this.httpPost2IgnoreSslErrors = true;
      } else {
        this.httpPost2IgnoreSslErrors = false;
      }
    },

    changeHttpPost2CaCerts(val) {
      if (val) {
        this.httpPost2CaCerts = true;
      } else {
        this.httpPost2CaCerts = false;
      }
    }
  }
};
</script>

<style lang="scss">
</style>
