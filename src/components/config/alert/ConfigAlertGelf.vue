<template>
  <div>
    <praeco-form-item label="Type" prop="gelfType" required>
      <el-radio-group v-model="gelfType" :disabled="viewOnly">
        <el-radio id="gelfTypeHttp" label="http" border>
          http
        </el-radio>
        <el-radio id="gelfTypeTcp" label="tcp" border>
          tcp
        </el-radio>
      </el-radio-group>
    </praeco-form-item>

    <div v-if="gelfType === 'http'">
      <praeco-form-item label="EndPoint" prop="gelfEndpoint">
        <el-input id="gelfEndpoint" v-model="gelfEndpoint" :disabled="viewOnly" />
        <label>Link to GELF HTTP Input as an example: ‘http://example.com/gelf'</label>
      </praeco-form-item>

      <praeco-form-item label="Ignore SSL Errors" prop="gelfHttpIgnoreSslErrors">
        <el-switch
          id="gelfHttpIgnoreSslErrors"
          v-model="gelfHttpIgnoreSslErrors"
          :disabled="viewOnly"
          @change="changeGelfHttpIgnoreSslErrors" />
      </praeco-form-item>
    </div>

    <div v-if="gelfType === 'tcp'">
      <praeco-form-item label="Host" prop="gelfHost" required>
        <el-input id="gelfHost" v-model="gelfHost" :disabled="viewOnly" />
        <label>Graylog server address where Input launched.</label>
      </praeco-form-item>

      <praeco-form-item label="Port" prop="gelfPort" required>
        <el-input-number id="gelfPort" v-model="gelfPort" :disabled="viewOnly" />
        <label>Port, specified for Input.</label>
      </praeco-form-item>
    </div>

    <praeco-form-item label="LogLevel" prop="gelfLogLevel">
      <el-input-number id="gelfLogLevel" v-model="gelfLogLevel" :disabled="viewOnly" :min="0" :max="7" />
      <label>Standard syslog severity levels. </label>
    </praeco-form-item>

    <praeco-form-item label="CaCert" prop="gelfCaCert">
      <el-input id="gelfCaCert" v-model="gelfCaCert" :disabled="viewOnly" />
      <label>Path to custom CA certificate.</label>
    </praeco-form-item>

    <praeco-form-item label="TimeOut" prop="gelfTimeout">
      <el-input-number id="gelfTimeout" v-model="gelfTimeout" :disabled="viewOnly" />
      <label>Custom timeout.</label>
    </praeco-form-item>
  </div>
</template>

<script>
export default {
  props: {
    viewOnly: Boolean
  },
  computed: {
    gelfType: {
      get() {
        return this.$store.state.config.alert.gelfType;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GELF_TYPE',
          value
        );
      }
    },

    gelfEndpoint: {
      get() {
        return this.$store.state.config.alert.gelfEndpoint;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GELF_ENDPOINT',
          value
        );
      }
    },

    gelfHttpIgnoreSslErrors: {
      get() {
        return this.$store.state.config.alert.gelfHttpIgnoreSslErrors;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GELF_HTTP_IGNORE_SSL_ERRORS',
          value
        );
      }
    },

    gelfHost: {
      get() {
        return this.$store.state.config.alert.gelfHost;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GELF_HOST',
          value
        );
      }
    },

    gelfPort: {
      get() {
        return this.$store.state.config.alert.gelfPort;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GELF_PORT',
          value
        );
      }
    },

    gelfLogLevel: {
      get() {
        return this.$store.state.config.alert.gelfLogLevel;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GELF_LOG_LEVEL',
          value
        );
      }
    },

    gelfCaCert: {
      get() {
        return this.$store.state.config.alert.gelfCaCert;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GELF_CA_CERT',
          value
        );
      }
    },

    gelfTimeout: {
      get() {
        return this.$store.state.config.alert.gelfTimeout;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GELF_TIMEOUT',
          value
        );
      }
    },
  },
  methods: {
    changeGelfHttpIgnoreSslErrors(val) {
      if (val) {
        this.gelfHttpIgnoreSslErrors = true;
      } else {
        this.gelfHttpIgnoreSslErrors = false;
      }
    },
  }
};
</script>

<style lang="scss">
</style>
