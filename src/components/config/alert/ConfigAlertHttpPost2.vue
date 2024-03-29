<template>
  <div>
    <el-popover v-model="popHttpPost2UrlVisible" :class="{ 'is-invalid': !popHttpPost2UrlValid }">
      <template #reference>
        <span class="pop-trigger">
          <el-tooltip v-if="httpPost2Url.length" :content="httpPost2Url.join(', ')" placement="top">
            <span>HttpPost2Urls ({{ httpPost2Url.length }})</span>
          </el-tooltip>
          <span v-else>HttpPost2Urls ({{ httpPost2Url.length }})</span>
        </span>
      </template>
      <div>
        <el-form
          ref="httpPost2Url"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in httpPost2Url"
            :key="index"
            :prop="`httpPost2Url.${index}`"
            :disabled="viewOnly"
            class="el-form-item-list"
            label="">
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="httpPost2Url[index]"
                  :disabled="viewOnly"
                  placeholder="HttpPost2Url"
                  @input="(val) => updatehttpPost2Url(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="removehttpPost2UrlEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addhttpPost2UrlEntry">
          Add HttpPost2Url
        </el-button>
      </div>
    </el-popover>

    <el-form-item label="CA Certs" prop="httpPost2CaCerts">
      <el-switch
        id="httpPost2CaCerts"
        :value="httpPost2CaCerts"
        :disabled="viewOnly"
        @change="changeHttpPost2CaCerts" />
    </el-form-item>

    <el-form-item label="Ignore SSL Errors" prop="httpPost2IgnoreSslErrors">
      <el-switch
        id="httpPost2IgnoreSslErrors"
        :value="httpPost2IgnoreSslErrors"
        :disabled="viewOnly"
        @change="changeHttpPost2IgnoreSslErrors" />
    </el-form-item>

    <el-form-item label="Timeout" prop="httpPost2Timeout">
      <el-input-number id="httpPost2Timeout" :value="httpPost2Timeout" :disabled="viewOnly" @input="httpPost2Timeout = $event" />
      <label>
        The timeout value, in seconds, for making the post.
        The default is 10.
        If a timeout occurs, the alert will be retried next time ElastAlert 2 cycles.
      </label>
    </el-form-item>

    <el-form-item label="Proxy" prop="httpPost2Proxy">
      <el-input id="httpPost2Proxy" :value="httpPost2Proxy" :disabled="viewOnly" @input="httpPost2Proxy = $event" />
      <label>URL of proxy, if required.</label>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: ['viewOnly'],
  emits: ['validate'],

  data() {
    return {
      popHttpPost2UrlVisible: false,
      popHttpPost2UrlValid: true,
    };
  },

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
    async validate() {
      try {
        if (this.$refs.httpPost2Url) {
          await this.validatehttpPost2Url();
        }
        this.$emit('validate', true);
        return true;
      } catch (error) {
        this.$emit('validate', false);
        return false;
      }
    },
    async validatehttpPost2Url() {
      if (!this.httpPost2Url.length) {
        this.popHttpPost2UrlValid = false;
        return;
      }
      try {
        this.popHttpPost2UrlValid = await this.$refs.httpPost2Url.validate();
      } catch (error) {
        this.popHttpPost2UrlValid = false;
        throw error;
      }
    },
    updatehttpPost2Url(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_HTTP_POST2_URL_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },
    removehttpPost2UrlEntry(entry) {
      this.$store.commit('config/alert/REMOVE_HTTP_POST2_URL_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },
    addhttpPost2UrlEntry() {
      this.$store.commit('config/alert/ADD_HTTP_POST2_URL_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    changeHttpPost2IgnoreSslErrors(val) {
      this.httpPost2IgnoreSslErrors = val;
    },

    changeHttpPost2CaCerts(val) {
      this.httpPost2CaCerts = val;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
