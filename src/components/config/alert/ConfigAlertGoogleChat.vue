<template>
  <div>
    <praeco-form-item label="GoogleChat Webhook" prop="googleChatWebhookUrl" required>
      <el-input id="googleChatWebhookUrl" v-model="googleChatWebhookUrl" :disabled="viewOnly" />
      <label>Google Webhook Url</label>
    </praeco-form-item>
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
  }
};
</script>

<style lang="scss">

</style>
