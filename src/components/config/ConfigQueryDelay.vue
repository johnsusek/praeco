<template>
  <el-row :gutter="19">
    <el-col :span="19">
      <el-form-item label="query_delay">
        <el-switch
          v-model="useQueryDelay"
          :disabled="viewOnly" />
        <label>query_delay Setting.</label>
      </el-form-item>
    </el-col>

    <el-col v-if="useQueryDelay" :span="6">
      <el-form-item :class="{ 'view-only': viewOnly }" label="query_delay">
        <ElastalertTimeView v-if="viewOnly" :time="queryDelayLocal" />
        <ElastalertTimePicker
          v-else-if="queryDelayLocal"
          id="queryDelayLocal"
          :allow-zero="true"
          :unit="Object.keys(queryDelayLocal)[0]"
          :amount="Object.values(queryDelayLocal)[0]"
          @input="updateQueryDelay" />
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ['viewOnly'],

  data() {
    return {};
  },

  computed: {
    useQueryDelay: {
      get() {
        return this.$store.state.config.alert.useQueryDelay;
      },
      set(value) {
        this.$store.commit('config/alert/USE_QUERY_DELAY', value);
      }
    },

    queryDelayLocal: {
      get() {
        return this.$store.state.config.alert.queryDelayLocal || { minutes: 1 };
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_QUERY_DELAY', value);
      }
    },
  },

  mounted() {
    if (this.$store.state.config.alert.queryDelayLocal) {
      this.useQueryDelay = true;
    }
  },

  methods: {
    updateQueryDelay(value) {
      this.queryDelayLocal = {};
      /*eslint-disable */
      this.$set(this.queryDelayLocal, Object.keys(value)[0], Object.values(value)[0]);
    },
  }
};
</script>
