<template>
  <el-form ref="form" :model="config" label-position="top" @submit.native.prevent>
    <br>

    <el-form-item label="Compare key(s)" prop="compare_key" required>
      <el-select
        v-model="config.compare_key"
        filterable
        placeholder="Field">
        <el-option
          v-for="field in Object.keys(fields)"
          :key="field"
          :label="field"
          :value="field" />
      </el-select>
      <label>
        The names of the field(s) to monitor for changes.
        An alert will trigger if any of the fields change.
      </label>
    </el-form-item>

    <el-form-item label="Ignore null">
      <el-switch v-model="config.ignore_null" />
      <label>
        If true, events without a compare_key field will not count as changed.
        Currently this checks for all the fields in compare_key.
      </label>
    </el-form-item>

    <el-form-item required prop="query_key" label="Query key">
      <el-select
        v-model="config.query_key"
        filterable
        clearable
        placeholder="Field"
        @input="updateQueryKey">
        <el-option
          v-for="field in Object.keys(fields)"
          :key="field"
          :label="field"
          :value="field" />
      </el-select>
      <label>
        This rule is applied on a per-"query key" basis.
        This field must be present in all of the events that are checked.
      </label>
    </el-form-item>

    <el-form-item label="Use timeframe">
      <el-switch v-model="useTimeframe" @input="changeTimeframe" /><br>
      <ElastalertTimePicker v-if="config.timeframe && useTimeframe" v-model="config.timeframe" />
      <label>
        The maximum time between changes.
        After this time period, ElastAlert will forget the old value of the "compare key" field.
      </label>
    </el-form-item>
  </el-form>
</template>

<script>
import Vue from 'vue';

export default {
  props: ['config', 'fields'],

  data() {
    return {
      useTimeframe: false
    };
  },

  mounted() {
    if (this.config.ignore_null === undefined) {
      Vue.set(this.config, 'ignore_null', false);
    }
  },

  methods: {
    changeTimeframe(val) {
      if (val === false) {
        Vue.delete(this.config, 'timeframe');
      } else {
        Vue.set(this.config, 'timeframe', { hours: 24 });
      }
    },
    updateQueryKey(val) {
      if (val === '') {
        Vue.delete(this.config, 'query_key');
      }
    }
  },
};
</script>
