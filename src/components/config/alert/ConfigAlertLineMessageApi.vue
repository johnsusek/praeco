<template>
  <div>
    <praeco-form-item label="line_channel_access_token" prop="lineChannelAccessToken" required>
      <el-input id="lineChannelAccessToken" v-model="lineChannelAccessToken" :disabled="viewOnly" @update:model-value="lineChannelAccessToken = $event" />
    </praeco-form-item>

    <praeco-form-item label="line_to" prop="lineTo" required>
      <el-input id="lineTo" v-model="lineTo" :disabled="viewOnly" @update:model-value="lineTo = $event" />
    </praeco-form-item>
  </div>
</template>

<script>

export default {
  props: ['viewOnly'],

  computed: {
    lineChannelAccessToken: {
      get() {
        return this.$store.state.config.alert.lineChannelAccessToken;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_LINE_CHANNEL_ACCESS_TOKEN',
          value
        );
      }
    },
    lineTo: {
      get() {
        return this.$store.state.config.alert.lineTo;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_LINE_TO',
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

</style>
