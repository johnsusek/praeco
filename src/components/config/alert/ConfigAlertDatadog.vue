<template>
  <div>
    <el-form-item label="API KEY" prop="datadogApiKey" required>
      <el-input id="datadogApiKey" :value="datadogApiKey" :disabled="viewOnly" @input="datadogApiKey = $event" />
      <label>Datadog API key.</label>
    </el-form-item>

    <el-form-item label="APP KEY" prop="datadogAppKey" required>
      <el-input id="datadogAppKey" :value="datadogAppKey" :disabled="viewOnly" @input="datadogAppKey = $event" />
      <label>Datadog application key.</label>
    </el-form-item>
  </div>
</template>

<script>

export default {
  props: ['viewOnly'],

  computed: {
    datadogApiKey: {
      get() {
        return this.$store.state.config.alert.datadogApiKey;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_DATADOG_API_KEY', value);
      }
    },

    datadogAppKey: {
      get() {
        return this.$store.state.config.alert.datadogAppKey;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_DATADOG_APP_KEY', value);
      }
    }
  },

  methods: {
  }
};
</script>

<style lang="scss" scoped>

</style>
