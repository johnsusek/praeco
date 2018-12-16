<template>
  <el-form-item label="Aggregation">
    <el-switch v-model="enableAgg" :disabled="viewOnly" @change="changeAgg" />
    <label>
      Instead of sending alerts immediately, send a report of
      alerts.
    </label>
    <template v-if="enableAgg">

      <el-form-item class="m-n-med" label="Schedule" required>
        <el-popover v-model="cronPopover">
          <el-button
            slot="reference"
            :disabled="viewOnly"
            type="text"
            class="formatted-cron"
            @click="cronPopover = true">
            {{ formattedCron }}
          </el-button>
          <Cron i18n="en" @change="changeCron" @close="cronPopover = false"/>
        </el-popover>
      </el-form-item>

      <el-form-item v-if="!viewOnly || summaryTableFields.length" class="m-n-sm">
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
    </template>
  </el-form-item>
</template>

<script>
import prettycron from 'prettycron';

export default {
  props: ['viewOnly'],

  data() {
    return {
      enableAgg: false,
      cronPopover: false
    };
  },

  computed: {
    fields() {
      return this.$store.getters['metadata/fieldsForCurrentConfig'];
    },

    cron: {
      get() {
        return this.$store.state.config.alert.aggregationSchedule;
      },
      set(value) {
        let schedule = value.split(' ');
        if (schedule.length === 7) {
          schedule.pop();
          schedule.pop();
        }
        this.$store.commit(
          'config/alert/UPDATE_AGGREGATION_SCHEDULE',
          schedule.join(' ')
        );
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

    formattedCron() {
      return prettycron.toString(this.cron, true);
    }
  },

  mounted() {
    if (this.cron) {
      this.enableAgg = true;
    }
  },

  methods: {
    changeCron(val) {
      this.cron = val;
    },

    changeAgg(val) {
      if (!val) {
        this.cron = '';
        this.summaryTableFields = [];
      }
    }
  }
};
</script>

<style>
#changeContab .bottom .value,
.el-button.language {
  display: none;
}

#changeContab .el-radio__label {
  font-weight: 400;
}

#changeContab #tab-5 {
  display: none;
}

.formatted-cron.el-button--text {
  font-size: 15px;
  font-weight: 400;
  border-bottom: 1px dotted;
  line-height: 1;
}
</style>
