<template>
  <el-form ref="form" :model="form" label-position="top" @submit.native.prevent>
    <el-form-item label="Compare key(s)" prop="compareKey" required>
      <el-select
        v-model="form.compareKey"
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
      <el-switch v-model="form.ignoreNull" @input="updateIgnoreNull" />
      <label>
        If true, events without a compare_key field will not count as changed.
        Currently this checks for all the fields in compare_key.
      </label>
    </el-form-item>

    <el-form-item required prop="queryKey" label="Query key">
      <el-select
        v-model="form.queryKey"
        filterable
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
      <el-switch v-model="useTimeframe" @input="updateUseTimeframe" /><br>
      <ElastalertTimePicker v-if="useTimeframe" v-model="form.timeframe" />
      <label>
        The maximum time between changes.
        After this time period, ElastAlert will forget the old value of the "compare key" field.
      </label>
    </el-form-item>

  </el-form>
</template>

<script>
import Vue from 'vue';
import { validateForm } from '@/mixins/validateForm';

export default {
  mixins: [validateForm],

  props: ['fields', 'compareKey', 'ignoreNull', 'queryKey', 'timeframe'],

  data() {
    return {
      useTimeframe: false,
    };
  },

  mounted() {
    if (this.compareKey) {
      Vue.set(this.form, 'compareKey', this.compareKey);
    }

    if (this.ignoreNull) {
      Vue.set(this.form, 'ignoreNull', this.ignoreNull);
    }

    if (this.queryKey) {
      Vue.set(this.form, 'queryKey', this.queryKey);
    }

    if (this.timeframe) {
      Vue.set(this.form, 'timeframe', this.timeframe);
    }
  },

  methods: {
    updateIgnoreNull(val) {
      if (!val) {
        Vue.delete(this.form, 'ignoreNull');
      }
    },

    updateQueryKey(val) {
      if (!val) {
        Vue.delete(this.form, 'queryKey');
      }
    },

    updateUseTimeframe(val) {
      if (val) {
        this.$nextTick(() => {
          Vue.set(this.form, 'timeframe', { hours: 24 });
        });
      } else {
        Vue.delete(this.form, 'timeframe');
      }
    }
  },
};
</script>
