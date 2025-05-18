<template>
  <div>
    <el-form-item label="Webhook id" prop="webexWebhookId" required>
      <el-input :value="webexWebhookId" :disabled="viewOnly" @input="webexWebhookId = $event" />
      <label>Webex webhook ID.</label>
    </el-form-item>

    <el-form-item label="Message color" prop="webexWebhookMsgtype" required>
      <el-radio-group :value="webexWebhookMsgtype" :disabled="viewOnly" @input="webexWebhookMsgtype = $event">
        <el-radio id="webexWebhookMsgtypeText" label="text" border>
          Text
        </el-radio>
        <el-radio id="webexWebhookMsgtypeMarkDown" label="markdown" border>
          MarkDown
        </el-radio>
      </el-radio-group>
    </el-form-item>
  </div>
</template>

<script>
export default {
  components: {
  },

  props: ['viewOnly'],
  emits: ['validate'],

  data() {
    return {
    };
  },
  computed: {
    webexWebhookId: {
      get() {
        return this.$store.state.config.alert.webexWebhookId;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_WEBEX_WEBHOOK_ID', value);
      }
    },
    webexWebhookMsgtype: {
      get() {
        return this.$store.state.config.alert.webexWebhookMsgtype;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_WEBEX_WEBHOOK_MSGTYPE', value);
      }
    }
  },

  methods: {
  }
};
</script>

<style lang="scss" scoped>
</style>
