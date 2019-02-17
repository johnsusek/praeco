<template>
  <el-row :gutter="20">
    <el-col :span="enableAgg ? 6 : 24">
      <el-form-item label="Aggregation">
        <el-switch v-model="enableAgg" :disabled="viewOnly" @change="changeAgg" />
        <label>
          Instead of sending alerts immediately, send a report of
          alerts on a schedule.
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
        v-if="!viewOnly || (summaryTableFields && summaryTableFields.length)"
        label="Summary table">
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
    </el-col>

    <el-col v-show="enableAgg" :span="6">
      <el-form-item v-if="!viewOnly || aggregationKey" label="Group by">
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
      recurrentEventForm: {}
    };
  },

  computed: {
    realert: {
      get() {
        return this.$store.state.config.alert.realert || { minutes: 5 };
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_REALERT', value);
      }
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
      if (!document.querySelector('#cron')) {
        return;
      }
      this.recurrentEventForm = new CronUI('#cron', {
        initial: '0 * * * *',
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
        this.aggregationKey = '';
        this.summaryTableFields = [];
        this.realert = { minutes: 5 };
      } else {
        this.aggregationSchedule = '0 * * * *';
        this.realert = { minutes: 0 };
      }
    }
  }
};
</script>

<style>
.cron-line {
  line-height: 1.3;
}
</style>
