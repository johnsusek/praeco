<template>
  <div>
    <el-popover v-model="popHttpPostUrlVisible" :class="{ 'is-invalid': !popHttpPostUrlValid }">
      <template v-slot:reference>
        <span class="pop-trigger">
          <el-tooltip v-if="httpPostUrl.length" :content="httpPostUrl.join(', ')" placement="top">
            <span>HttpPostUrls ({{ httpPostUrl.length }})</span>
          </el-tooltip>
          <span v-else>httpPostUrls ({{ httpPostUrl.length }})</span>
        </span>
      </template>
      <template>
        <el-form
          ref="httpPostUrl"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in httpPostUrl"
            :key="index"
            :prop="'httpPostUrl.' + index"
            :disabled="viewOnly"
            class="el-form-item-list"
            label=""
            required>
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="httpPostUrl[index]"
                  :disabled="viewOnly"
                  placeholder="HttpPostUrls"
                  @input="(val) => updatehttpPostUrl(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="removehttpPostUrlEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addhttpPostUrlEntry">
          Add HttpPostUrl
        </el-button>
      </template>
    </el-popover>

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

  data() {
    return {
      popHttpPostUrlVisible: false,
      popHttpPostUrlValid: true,
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
    async validate() {
      try {
        if (this.$refs.httpPostUrl) {
          await this.validatehttpPostUrl();
        }
        this.$emit('validate', true);
        return true;
      } catch (error) {
        this.$emit('validate', false);
        return false;
      }
    },

    async validatehttpPostUrl() {
      if (!this.httpPostUrl.length) {
        this.popHttpPostUrlValid = false;
        return;
      }
      try {
        this.popHttpPostUrlValid = await this.$refs.httpPostUrl.validate();
      } catch (error) {
        this.popHttpPostUrlValid = false;
        throw error;
      }
    },

    updatehttpPostUrl(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_HTTP_POST_URL_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removehttpPostUrlEntry(entry) {
      this.$store.commit('config/alert/REMOVE_HTTP_POST_URL_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addhttpPostUrlEntry() {
      this.$store.commit('config/alert/ADD_HTTP_POST_URL_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

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
