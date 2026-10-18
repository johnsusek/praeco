<template>
  <div>
    <praeco-form-item label="datadog_api_key" prop="datadogApiKey" required>
      <el-input v-model="datadogApiKey" :disabled="viewOnly" />
      <label>Datadog API key.</label>
    </praeco-form-item>

    <praeco-form-item label="datadog_app_key" prop="datadogAppKey" required>
      <el-input v-model="datadogAppKey" :disabled="viewOnly" />
      <label>Datadog application key.</label>
    </praeco-form-item>

    <praeco-form-item label="datadog_api_url" prop="datadogApiUrl">
      <el-input v-model="datadogApiUrl" :disabled="viewOnly" />
      <label>Datadog API URL.</label>
    </praeco-form-item>
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
    },

    datadogApiUrl: {
      get() {
        return this.$store.state.config.alert.datadogApiUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_DATADOG_API_URL', value);
      }
    }
  },

  methods: {
  }
};
</script>

<style lang="scss" scoped>

</style>
