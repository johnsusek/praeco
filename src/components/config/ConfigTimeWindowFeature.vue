<template>
  <el-row :gutter="19">
    <el-col :span="useTimeWindow ? 6 : 19">
      <el-form-item label="Use Time Window">
        <el-switch
          v-model="useTimeWindow"
          :disabled="viewOnly"
          @change="changeTimeWindow" />
        <label>
          Use time window in order to send alerts only at specific time range.
        </label>
      </el-form-item>
    </el-col>

    <el-col v-if="useTimeWindow" :span="6">
      <el-form-item label="Start time" prop="timeWindowStartTime" required>
        <el-time-select
          v-model="timeWindowStartTime"
          :disabled="viewOnly"
          start="00:00"
          step="00:15"
          end="23:59"
          placeholder="Select time" />
        <label v-if="!viewOnly">Start time of the range.</label>
      </el-form-item>"
    </el-col>

    <el-col v-if="useTimeWindow" :span="6">
      <el-form-item label="End time" prop="timeWindowEndTime" required>
        <el-time-select
          v-model="timeWindowEndTime"
          :disabled="viewOnly"
          start="00:00"
          step="00:15"
          end="23:59"
          placeholder="Select time" />
        <label v-if="!viewOnly">Start time of the range.</label>
      </el-form-item>
    </el-col>

    <el-col v-if="useTimeWindow" :span="6">
      <el-form-item label="Drop if" prop="timeWindowDropIf" required>
        <el-select v-model="timeWindowDropIf" :disabled="viewOnly" placeholder="" class="el-select-wide">
          <el-option key="outside" label="Outside" value="outside" />
          <el-option key="inside" label="Inside" value="inside" />
        </el-select>
        <label v-if="!viewOnly">Drop if inside/outside given range.</label>
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
    // time_window_change
    useTimeWindow: {
      get() {
        return this.$store.state.config.alert.useTimeWindow;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_USE_TIME_WINDOW', value);
      }
    },

    timeWindowStartTime: {
      get() {
        return this.$store.state.config.alert.timeWindowStartTime;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_TIME_WINDOW_START_TIME', value);
      }
    },

    timeWindowEndTime: {
      get() {
        return this.$store.state.config.alert.timeWindowEndTime;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_TIME_WINDOW_END_TIME', value);
      }
    },

    timeWindowDropIf: {
      get() {
        return this.$store.state.config.alert.timeWindowDropIf;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_TIME_WINDOW_DROP_IF', value);
      }
    },
  },

  mounted() {
    if (this.timeWindowStartTime && this.timeWindowEndTime && this.timeWindowDropIf) {
      this.useTimeWindow = true;
    }
  },

  methods: {
    // time_window_change
    changeTimeWindow(val) {
      if (val) {
        this.useTimeWindow = true;
      } else {
        this.useTimeWindow = false;
      }
    },
  }
};
</script>
