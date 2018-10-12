<template>
  <el-form
    ref="form"
    :model="$store.state.config.match"
    label-position="top"
    @submit.native.prevent>
    <el-form-item label="Compare key(s)" prop="compareKey" required>
      <el-select
        v-model="compareKey"
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
      <el-switch v-model="ignoreNull" />
      <label>
        If true, events without a compare_key field will not count as changed.
        Currently this checks for all the fields in compare_key.
      </label>
    </el-form-item>

    <el-form-item required prop="queryKey" label="Query key">
      <el-select
        v-model="queryKey"
        filterable
        placeholder="Field">
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
      <el-switch v-model="useTimeframe" @input="updateUseTimeframe" /><br>
      <ElastalertTimePicker v-if="useTimeframe" v-model="timeframe" />
      <label>
        The maximum time between changes.
        After this time period, ElastAlert will forget the old value of the "compare key" field.
      </label>
    </el-form-item>

  </el-form>
</template>

<script>
export default {
  data() {
    return {
      useTimeframe: false,
    };
  },

  computed: {
    fields() {
      return this.$store.getters['metadata/fieldsForCurrentConfig'];
    },

    compareKey: {
      get() {
        return this.$store.state.config.match.compareKey;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_COMPARE_KEY', value);
      }
    },

    ignoreNull: {
      get() {
        return this.$store.state.config.match.ignoreNull;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_IGNORE_NULL', value);
      }
    },

    queryKey: {
      get() {
        return this.$store.state.config.match.queryKey;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_QUERY_KEY', value);
      }
    },

    timeframe: {
      get() {
        return this.$store.state.config.match.timeframe;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_TIMEFRAME', value);
      }
    }
  },

  methods: {
    updateUseTimeframe(val) {
      if (!val) {
        this.$store.commit('config/match/UPDATE_TIMEFRAME', {});
      }
    }
  },
};
</script>
