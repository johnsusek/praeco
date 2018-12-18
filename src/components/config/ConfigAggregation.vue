<template>
  <el-form-item label="Aggregation">
    <el-switch v-model="enableAgg" :disabled="viewOnly" @change="changeAgg" />
    <label>
      Instead of sending alerts immediately, send a report of
      alerts.
    </label>

    <div v-show="enableAgg">
      <el-form-item class="m-n-med" label="Schedule">
        <div v-show="viewOnly">
          {{ formattedAggSchedule }}
        </div>
        <div v-show="!viewOnly">
          Every <span id="cron" />
        </div>
      </el-form-item>

      <el-form-item v-if="!viewOnly || (summaryTableFields && summaryTableFields.length)" class="m-n-sm">
        Summary table
        <br>
        <el-select
          :disabled="viewOnly"
          v-model="summaryTableFields"
          filterable
          clearable
          multiple
          placeholder="Select field">
          <el-option
            v-for="field in Object.keys(fields)"
            :key="field"
            :label="field"
            :value="field" />
        </el-select>
        <label>Include a summary table of these fields in alert.</label>
      </el-form-item>

      <el-form-item v-if="!viewOnly || aggregationKey" class="m-n-sm">
        Group by
        <br>
        <el-select
          :disabled="viewOnly"
          v-model="aggregationKey"
          filterable
          clearable
          placeholder="Select field">
          <el-option
            v-for="field in Object.keys(fields)"
            :key="field"
            :label="field"
            :value="field" />
        </el-select>
        <label>Send separate reports grouped by the value of this field.</label>
      </el-form-item>
    </div>
  </el-form-item>
</template>

<script>
import prettycron from 'prettycron';

export default {
  props: ['viewOnly'],

  data() {
    return {
      enableAgg: false,
      recurrentEventForm: {}
    };
  },

  computed: {
    fields() {
      return this.$store.getters['metadata/fieldsForCurrentConfig'];
    },

    aggregationSchedule: {
      get() {
        return this.$store.state.config.alert.aggregationSchedule;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_AGGREGATION_SCHEDULE', value);
      }
    },

    summaryTableFields: {
      get() {
        return this.$store.state.config.alert.summaryTableFields;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SUMMARY_TABLE_FIELDS', value);
      }
    },

    aggregationKey: {
      get() {
        return this.$store.state.config.alert.aggregationKey;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_AGGREGATION_KEY', value);
      }
    },

    formattedAggSchedule() {
      return prettycron.toString(this.aggregationSchedule);
    }
  },

  mounted() {
    if (!this.viewOnly || (this.viewOnly && this.aggregationSchedule)) {
      this.recurrentEventForm = new CronUI('#cron', {
        changeEvent: val => {
          this.aggregationSchedule = val;
        }
      });
    }

    if (this.aggregationSchedule) {
      this.enableAgg = true;
      if (this.recurrentEventForm) {
        this.recurrentEventForm.setCronString(this.aggregationSchedule);
      }
    }
  },

  methods: {
    changeAgg(val) {
      if (!val) {
        this.aggregationSchedule = '';
        this.summaryTableFields = [];
      }
    }
  }
};
</script>
