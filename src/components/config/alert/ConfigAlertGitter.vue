<template>
  <div>
    <praeco-form-item label="Webhook URL" prop="gitterWebhookUrl">
      <el-input id="gitterWebhookUrl" :value="gitterWebhookUrl" :disabled="viewOnly" @input="gitterWebhookUrl = $event" />
      <label>
        The webhook URL that includes your auth data and the ID of the channel (room) you want to post to.
        Go to the Integration Settings of the channel: (example  https://gitter.im/ORGA/CHANNEL#integrations ) ,
        click ‘CUSTOM’ and copy the resulting URL.
      </label>
    </praeco-form-item>

    <praeco-form-item label="Message level" prop="gitterMsgLevel" required>
      <el-radio-group :value="gitterMsgLevel" :disabled="viewOnly" @input="gitterMsgLevel = $event">
        <el-radio id="gitterMsgLevelError" label="error" border class="gitter-error">
          Error
        </el-radio>
        <el-radio id="gitterMsgLevelInfo" label="info" border class="gitter-info">
          Info
        </el-radio>
      </el-radio-group>
    </praeco-form-item>

    <praeco-form-item label="Proxy" prop="gitterProxy">
      <el-input id="gitterProxy" :value="gitterProxy" :disabled="viewOnly" @input="gitterProxy = $event" />
      <label>
        By default ElastAlert 2 will not use a network proxy to send notifications to Gitter.
        Set this option using hostname:port if you need to use a proxy.
      </label>
    </praeco-form-item>
  </div>
</template>

<script>
export default {
  props: ['viewOnly'],

  computed: {
    gitterWebhookUrl: {
      get() {
        return this.$store.state.config.alert.gitterWebhookUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_GITTER_WEBHOOK_URL', value);
      }
    },

    gitterMsgLevel: {
      get() {
        return this.$store.state.config.alert.gitterMsgLevel;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_GITTER_MSG_LEVEL', value);
      }
    },

    gitterProxy: {
      get() {
        return this.$store.state.config.alert.gitterProxy;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_GITTER_PROXY',
          value
        );
      }
    }
  },

  methods: {
  }
};
</script>

<style lang="scss" scoped>
:not(.is-disabled) {
  &.gitter-error .el-radio__inner:hover {
    border-color: red;
  }
  &.gitter-error .el-radio__input.is-checked .el-radio__inner {
    border-color: red;
    background: red;
  }
  &.gitter-error .el-radio__input.is-checked + .el-radio__label,
  &.gitter-error {
    color: red !important;
    border-color: red !important;
  }
  &.gitter-info .el-radio__inner:hover {
    border-color: blue;
  }
  &.gitter-info .el-radio__input.is-checked .el-radio__inner {
    border-color: green;
    background: blue;
  }
  &.gitter-info .el-radio__input.is-checked + .el-radio__label,
  &.gitter-info {
    color: green !important;
    border-color: blue !important;
  }
}
</style>
