<template>
  <div>
    <el-form-item label="API KEY" prop="datadogApiKey" required>
      <el-input id="datadogApiKey" v-model="datadogApiKey" :disabled="viewOnly" />
      <label>Datadog API key.</label>
    </el-form-item>

    <el-form-item label="APP KEY" prop="datadogAppKey" required>
      <el-input id="datadogAppKey" v-model="datadogAppKey" :disabled="viewOnly" />
      <label>Datadog application key.</label>
    </el-form-item>
  </div>
</template>

<script>

export default {
  components: {
  },

  props: ['viewOnly'],

  data() {
    return {
      rules: {
      }
    };
  },

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

<style lang="scss">

</style>
