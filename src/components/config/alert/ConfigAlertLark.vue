<template>
  <div>
    <praeco-form-item label="Bot Id" prop="larkBotId" required>
      <el-input id="larkBotId" :value="larkBotId" :disabled="viewOnly" @input="larkBotId = $event" />
      <label>Lark bot id.</label>
    </praeco-form-item>
  </div>
</template>

<script>
export default {
  props: ['viewOnly'],

  computed: {
    larkBotId: {
      get() {
        return this.$store.state.config.alert.larkBotId;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_LARK_BOT_ID', value);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  </style>
