<template>
  <div>
    <el-form-item label="HTTP POST URL" prop="httpPostUrl" required>
      <el-input v-model="httpPostUrl" :disabled="viewOnly" />
      <label>JSON results will be POSTed to this URL</label>
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
import validUrl from 'valid-url';

let validateUrl = (rule, value, callback) => {
  if (validUrl.isUri(value)) {
    try {
      let url = new URL(value);
      if (['http:', 'https:'].includes(url.protocol)) {
        callback();
      } else {
        callback(new Error('Invalid URL'));
      }
    } catch (error) {
      callback(new Error('Invalid URL'));
    }
  } else {
    callback(new Error('Invalid URL'));
  }
};

export default {
  components: {
  },

  props: ['viewOnly'],

  data() {
    return {
      rules: {
        httpPostUrl: [
          {
            validator: validateUrl,
            trigger: ['change', 'blur']
          }
        ]
      }
    };
  },

  computed: {
    httpPostUrl: {
      get() {
        return this.$store.state.config.alert.httpPostUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_HTTP_POST_URL', value);
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
  }
};
</script>

<style lang="scss">
</style>
