<template>
  <div>
    <praeco-form-item label="Access Token" prop="linenotifyAccessToken" required>
      <el-input id="linenotifyAccessToken" v-model="linenotifyAccessToken" :disabled="viewOnly" />
      <label>The access token that you got from https://notify-bot.line.me/my/</label>
    </praeco-form-item>
  </div>
</template>

<script>

export default {
  props: ['viewOnly'],

  computed: {
    linenotifyAccessToken: {
      get() {
        return this.$store.state.config.alert.linenotifyAccessToken;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_LINENOTIFY_ACCESS_TOKEN',
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
