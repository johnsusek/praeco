<template>
  <div>
    <el-popover v-model="popMatrixhookshotWebhookUrlVisible" :class="{ 'is-invalid': !popMatrixhookshotWebhookUrlValid }">
      <template #reference>
        <span class="pop-trigger">
          <el-tooltip v-if="matrixhookshotWebhookUrl.length" :content="matrixhookshotWebhookUrl.join(', ')" placement="top">
            <span>matrixhookshotWebhookUrls ({{ matrixhookshotWebhookUrl.length }})</span>
          </el-tooltip>
          <span v-else>matrixhookshotWebhookUrls ({{ matrixhookshotWebhookUrl.length }})</span>
        </span>
      </template>
      <div>
        <el-form
          ref="matrixhookshotWebhookUrl"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in matrixhookshotWebhookUrl"
            :key="index"
            :prop="`matrixhookshotWebhookUrl.${index}`"
            :disabled="viewOnly"
            class="el-form-item-list"
            label="">
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="matrixhookshotWebhookUrl[index]"
                  :disabled="viewOnly"
                  placeholder="WebhookUrl"
                  @input="(val) => updateMatrixhookshotWebhookUrl(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="removeMatrixhookshotWebhookUrlEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addMatrixhookshotWebhookUrlEntry">
          Add WebhookUrl
        </el-button>
      </div>
    </el-popover>

    <el-form-item label="Post as" prop="matrixhookshotUsername">
      <el-input id="matrixhookshotUsername" :value="matrixhookshotUsername" :disabled="viewOnly" @input="matrixhookshotUsername = $event" />
      <label>Optional username to prepend to the text body.</label>
    </el-form-item>

    <el-form-item label="Timeout" prop="matrixhookshotTimeout">
      <el-input-number id="matrixhookshotTimeout" :value="matrixhookshotTimeout" :disabled="viewOnly" @input="matrixhookshotTimeout = $event" />
      <label>
        You can specify a timeout value, in seconds, for making communicating with Hookshot.
        The default is 10. If a timeout occurs, the alert will be retried next time ElastAlert 2 cycles.
      </label>
    </el-form-item>

    <el-form-item label="text" prop="matrixhookshotText">
      <el-input id="matrixhookshotText" :value="matrixhookshotText" :disabled="viewOnly" @input="matrixhookshotText = $event" />
      <label>Override the default alert text with custom text formatting.</label>
    </el-form-item>

    <el-form-item label="Proxy" prop="matrixhookshotProxy">
      <el-input :value="matrixhookshotProxy" :disabled="viewOnly" @input="matrixhookshotProxy = $event" />
      <label>
        By default ElastAlert 2 will not use a network proxy to send notifications to Hookshot.
        Set this option using ``hostname:port`` if you need to use a proxy. only supports https.
      </label>
    </el-form-item>

    <el-form-item label="Ignore SSL Errors" prop="matrixhookshotIgnoreSslErrors">
      <el-switch
        id="matrixhookshotIgnoreSslErrors"
        :value="matrixhookshotIgnoreSslErrors"
        :disabled="viewOnly"
        @change="changeMatrixhookshotIgnoreSslErrors" />
    </el-form-item>

    <el-form-item label="CA Certs" prop="matrixhookshotCaCerts">
      <el-switch
        id="matrixhookshotCaCerts"
        :value="matrixhookshotCaCerts"
        :disabled="viewOnly"
        @change="changeMatrixhookshotCaCerts" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: ['viewOnly'],
  emits: ['validate'],

  data() {
    return {
      popMatrixhookshotWebhookUrlVisible: false,
      popMatrixhookshotWebhookUrlValid: true,
    };
  },

  computed: {
    matrixhookshotWebhookUrl: {
      get() {
        return this.$store.state.config.alert.matrixhookshotWebhookUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MATRIXHOOKSHOT_WEBHOOK_URL', value);
      }
    },

    matrixhookshotUsername: {
      get() {
        return this.$store.state.config.alert.matrixhookshotUsername;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MATRIXHOOKSHOT_USERNAME',
          value
        );
      }
    },

    matrixhookshotTimeout: {
      get() {
        return this.$store.state.config.alert.matrixhookshotTimeout;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MATRIXHOOKSHOT_TIMEOUT',
          value
        );
      }
    },

    matrixhookshotText: {
      get() {
        return this.$store.state.config.alert.matrixhookshotText;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MATRIXHOOKSHOT_TEXT',
          value
        );
      }
    },

    matrixhookshotProxy: {
      get() {
        return this.$store.state.config.alert.matrixhookshotProxy;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MATRIXHOOKSHOT_PROXY', value);
      }
    },

    matrixhookshotIgnoreSslErrors: {
      get() {
        return this.$store.state.config.alert.matrixhookshotIgnoreSslErrors;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MATRIXHOOKSHOT_IGNORE_SSL_ERRORS',
          value
        );
      }
    },

    matrixhookshotCaCerts: {
      get() {
        return this.$store.state.config.alert.matrixhookshotCaCerts;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MATRIXHOOKSHOT_CA_CERTS',
          value
        );
      }
    }
  },

  methods: {
    async validate() {
      try {
        if (this.$refs.matrixhookshotWebhookUrl) {
          await this.validateMatrixhookshotWebhookUrl();
        }
        this.$emit('validate', true);
        return true;
      } catch (error) {
        this.$emit('validate', false);
        return false;
      }
    },

    async validateMatrixhookshotWebhookUrl() {
      if (!this.matrixhookshotWebhookUrl.length) {
        this.popMatrixhookshotWebhookUrlValid = false;
        return;
      }
      try {
        this.popMatrixhookshotWebhookUrlValid = await this.$refs.matrixhookshotWebhookUrl.validate();
      } catch (error) {
        this.popMatrixhookshotWebhookUrlValid = false;
        throw error;
      }
    },

    updateMatrixhookshotWebhookUrl(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_MATRIXHOOKSHOT_WEBHOOK_URL_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removeMatrixhookshotWebhookUrlEntry(entry) {
      this.$store.commit('config/alert/REMOVE_MATRIXHOOKSHOTS_WEBHOOK_URL_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addMatrixhookshotWebhookUrlEntry() {
      this.$store.commit('config/alert/ADD_MATRIXHOOKSHOTS_WEBHOOK_URL_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    changeMatrixhookshotIgnoreSslErrors(val) {
      this.matrixhookshotIgnoreSslErrors = val;
    },

    changeMatrixhookshotCaCerts(val) {
      this.matrixhookshotCaCerts = val;
    }
  }
};
</script>

  <style lang="scss" scoped>
  </style>
