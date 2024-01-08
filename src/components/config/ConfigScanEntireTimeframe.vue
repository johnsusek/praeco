<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-form-item label="scan entire timeframe">
        <el-switch
          id="scanEntireTimeframe"
          :value="scanEntireTimeframe"
          :disabled="viewOnly"
          @change="changeScanEntireTimeframe" />
        <label>
          If true, when ElastAlert 2 starts, it will always start querying at the current time minus the timeframe.
          timeframe must exist in the rule.
        </label>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ['viewOnly'],

  computed: {
    scanEntireTimeframe: {
      get() {
        return this.$store.state.config.alert.scanEntireTimeframe;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SCAN_ENTIRE_TIMEFRAME', value);
      }
    }
  },

  mounted() {
    this.scanEntireTimeframe = this.$store.state.config.alert.scanEntireTimeframe;
  },

  methods: {
    changeScanEntireTimeframe(val) {
      this.scanEntireTimeframe = val;
    }
  }
};
</script>
