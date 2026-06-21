<template>
  <el-row :gutter="20">
    <el-col :span="enableAgg ? 6 : 24">
      <el-form-item label="Aggregation">
        <el-switch
          v-model="enableAgg"
          :disabled="viewOnly"
          @change="changeAgg" />
        <label>
          Instead of sending alerts immediately, send a report of alerts on a
          schedule.
        </label>
      </el-form-item>
    </el-col>

    <el-col v-show="enableAgg" :span="6">
      <el-form-item label="Schedule">
        <div v-show="viewOnly">
          {{ formattedAggSchedule }}
        </div>
        <div v-show="!viewOnly" class="cron-line">
          Every <span id="cron" />
        </div>
        <label>Schedule is in the server's time zone.</label>
      </el-form-item>
    </el-col>

    <el-col v-show="enableAgg" :span="6">
      <el-form-item
        v-if="!viewOnly || (summaryTableFields && summaryTableFields.length) || summaryTableType || summaryPrefix || summarySuffix || summaryTableMaxRows"
        label="Summary table">
        <el-select
          v-model="summaryTableType"
          :disabled="viewOnly"
          placeholder="Select type">
          <el-option label="ascii" value="ascii" />
          <el-option label="html" value="html" />
          <el-option label="markdown" value="markdown" />
        </el-select>
        <label>Choose summary table format.</label>

        <el-select
          v-model="summaryTableFields"
          :disabled="viewOnly"
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

        <el-input
          v-model="summaryPrefix"
          :disabled="viewOnly"
          placeholder="Summary prefix" />

        <el-input
          v-model="summarySuffix"
          :disabled="viewOnly"
          placeholder="Summary suffix" />

        <el-input-number
          v-model="summaryTableMaxRows"
          :disabled="viewOnly"
          :min="1"
          controls-position="right" />
        <label>Limit number of summary table rows.</label>
      </el-form-item>
    </el-col>

    <el-col v-show="enableAgg" :span="6">
      <el-form-item v-if="!viewOnly || aggregationKey" label="Group by">
        <el-select
          v-model="aggregationKey"
          :disabled="viewOnly"
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
    </el-col>
  </el-row>
</template>

<script>
import prettycron from 'prettycron';
import CronUI from 'cron-ui';

export default {
  props: ['viewOnly'],

  data() {
    return {
      enableAgg: false,
      recurrentEventForm: {},
    };
  },

  computed: {
    realert: {
      get() {
        return this.$store.state.config.alert.realert || { minutes: 5 };
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_REALERT', value);
      },
    },

    fields() {
      return this.$store.getters['metadata/fieldsForCurrentConfig'];
    },

    aggregationSchedule: {
      get() {
        return this.$store.state.config.alert.aggregationSchedule;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_AGGREGATION_SCHEDULE', value);
      },
    },

    summaryTableFields: {
      get() {
        return this.$store.state.config.alert.summaryTableFields;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SUMMARY_TABLE_FIELDS', value);
      },
    },

    summaryTableType: {
      get() {
        return this.$store.state.config.alert.summaryTableType;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SUMMARY_TABLE_TYPE', value);
      },
    },

    summaryPrefix: {
      get() {
        return this.$store.state.config.alert.summaryPrefix;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SUMMARY_PREFIX', value);
      },
    },

    summarySuffix: {
      get() {
        return this.$store.state.config.alert.summarySuffix;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SUMMARY_SUFFIX', value);
      },
    },

    summaryTableMaxRows: {
      get() {
        return this.$store.state.config.alert.summaryTableMaxRows;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SUMMARY_TABLE_MAX_ROWS', value);
      },
    },

    aggregationKey: {
      get() {
        return this.$store.state.config.alert.aggregationKey;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_AGGREGATION_KEY', value);
      },
    },

    formattedAggSchedule() {
      return prettycron.toString(this.aggregationSchedule);
    },
  },

  mounted() {
    if (!this.viewOnly || (this.viewOnly && this.aggregationSchedule)) {
      if (!document.querySelector('#cron')) {
        return;
      }
      this.recurrentEventForm = new CronUI('#cron', {
        initial: '0 * * * *',
        changeEvent: (val) => {
          this.aggregationSchedule = val;
        },
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
        this.aggregationKey = '';
        this.summaryTableFields = [];
        this.summaryTableType = '';
        this.summaryPrefix = '';
        this.summarySuffix = '';
        this.summaryTableMaxRows = null;
        this.realert = { minutes: 5 };
      } else {
        this.aggregationSchedule = '0 * * * *';
        if (!this.summaryTableType) {
          this.summaryTableType = 'ascii';
        }
        this.realert = { minutes: 0 };
      }
    },
  },
};
</script>

<style>
.cron-line {
  line-height: 1.3;
}
</style>
