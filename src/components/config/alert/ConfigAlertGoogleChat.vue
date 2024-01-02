<template>
  <div>
    <el-popover v-model="popgoogleChatWebhookUrlVisible" :class="{ 'is-invalid': !popgoogleChatWebhookUrlValid }">
      <template #reference>
        <span class="pop-trigger">
          <el-tooltip v-if="googleChatWebhookUrl.length" :content="googleChatWebhookUrl.join(', ')" placement="top">
            <span>GoogleChatWebhookUrls ({{ googleChatWebhookUrl.length }})</span>
          </el-tooltip>
          <span v-else>googleChatWebhookUrls ({{ googleChatWebhookUrl.length }})</span>
        </span>
      </template>
      <div>
        <el-form
          ref="googleChatWebhookUrl"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in googleChatWebhookUrl"
            :key="index"
            :prop="`googleChatWebhookUrl.${index}`"
            :disabled="viewOnly"
            class="el-form-item-list"
            label="">
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="googleChatWebhookUrl[index]"
                  :disabled="viewOnly"
                  placeholder="WebhookUrl"
                  @input="(val) => updategoogleChatWebhookUrl(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="removegoogleChatWebhookUrlEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addgoogleChatWebhookUrlEntry">
          Add WebhookUrl
        </el-button>
      </div>
    </el-popover>

    <praeco-form-item label="GoogleChat Format" prop="googleChatFormat" required>
      <el-radio-group v-model="googleChatFormat" :disabled="viewOnly">
        <el-radio id="googleChatFormatBasic" label="basic" border>
          basic
        </el-radio>
        <el-radio id="googleChatFormatCard" label="card" border>
          card
        </el-radio>
      </el-radio-group>
    </praeco-form-item>

    <div v-if="googleChatFormat === 'card'">
      <praeco-form-item label="Header Title" prop="googleChatHeaderTitle">
        <el-input id="googleChatHeaderTitle" v-model="googleChatHeaderTitle" :disabled="viewOnly" />
        <label>GoogleChat Header Title</label>
      </praeco-form-item>

      <praeco-form-item label="Header Subtitle" prop="googleChatHeaderSubtitle">
        <el-input id="googleChatHeaderSubtitle" v-model="googleChatHeaderSubtitle" :disabled="viewOnly" />
        <label>Sets the text for the card header subtitle.</label>
      </praeco-form-item>

      <praeco-form-item label="Header Image" prop="googleChatHeaderImage">
        <el-input id="googleChatHeaderImage" v-model="googleChatHeaderImage" :disabled="viewOnly" />
        <label>URL for the card header icon.</label>
      </praeco-form-item>

      <praeco-form-item label="Footer Kibanalink" prop="googleFooterKibanalink">
        <el-input id="googleFooterKibanalink" v-model="googleFooterKibanalink" :disabled="viewOnly" />
        <label>URL to Kibana to include in the card footer.</label>
      </praeco-form-item>
    </div>

    <praeco-form-item label="Proxy" prop="googleChatProxy">
      <el-input id="googleChatProxy" v-model="googleChatProxy" :disabled="viewOnly" />
      <label>
        By default ElastAlert 2 will not use a network proxy to send notifications to GoogleChat.
        Set this option using hostname:port if you need to use a proxy.
      </label>
    </praeco-form-item>
  </div>
</template>

<script>

export default {
  props: ['viewOnly'],
  emits: ['validate'],

  data() {
    return {
      popgoogleChatWebhookUrlVisible: false,
      popgoogleChatWebhookUrlValid: true,
    };
  },

  computed: {
    googleChatWebhookUrl: {
      get() {
        return this.$store.state.config.alert.googleChatWebhookUrl;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GOOGLE_CHAT_WEBHOOK_URL',
          value
        );
      }
    },

    googleChatFormat: {
      get() {
        return this.$store.state.config.alert.googleChatFormat;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GOOGLE_CHAT_FORMAT',
          value
        );
      }
    },

    googleChatHeaderTitle: {
      get() {
        return this.$store.state.config.alert.googleChatHeaderTitle;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GOOGLE_CHAT_HEADER_TITLE',
          value
        );
      }
    },

    googleChatHeaderSubtitle: {
      get() {
        return this.$store.state.config.alert.googleChatHeaderSubtitle;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GOOGLECHAT_HEADER_SUBTITLE',
          value
        );
      }
    },

    googleChatHeaderImage: {
      get() {
        return this.$store.state.config.alert.googleChatHeaderImage;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GOOGLECHAT_HEADER_IMAGE',
          value
        );
      }
    },

    googleFooterKibanalink: {
      get() {
        return this.$store.state.config.alert.googleFooterKibanalink;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GOOGLECHAT_FOOTER_KIBANALINK',
          value
        );
      }
    },

    googleChatProxy: {
      get() {
        return this.$store.state.config.alert.googleChatProxy;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GOOGLECHAT_PROXY',
          value
        );
      }
    }
  },

  methods: {
    async validate() {
      try {
        if (this.$refs.googleChatWebhookUrl) {
          await this.validategoogleChatWebhookUrl();
        }
        this.$emit('validate', true);
        return true;
      } catch (error) {
        this.$emit('validate', false);
        return false;
      }
    },
    async validategoogleChatWebhookUrl() {
      if (!this.googleChatWebhookUrl.length) {
        this.popgoogleChatWebhookUrlValid = false;
        return;
      }
      try {
        this.popgoogleChatWebhookUrlValid = await this.$refs.googleChatWebhookUrl.validate();
      } catch (error) {
        this.popgoogleChatWebhookUrlValid = false;
        throw error;
      }
    },
    updategoogleChatWebhookUrl(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_GOOGLECHAT_WEBHOOK_URL_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },
    removegoogleChatWebhookUrlEntry(entry) {
      this.$store.commit('config/alert/REMOVE_GOOGLECHAT_WEBHOOK_URL_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },
    addgoogleChatWebhookUrlEntry() {
      this.$store.commit('config/alert/ADD_GOOGLECHAT_WEBHOOK_URL_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },
  }
};
</script>

<style lang="scss">

</style>
