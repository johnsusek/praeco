<template>
  <el-form
    ref="form"
    :model="$store.state.config.match"
    :rules="rules"
    label-position="top"
    @submit.native.prevent>
    <el-form-item label="Spike height" prop="spikeHeight" required>
      <el-input v-model="spikeHeight" type="number" @input="updateSpikeHeight" />
      <label>
        The ratio of number of events in the last "timeframe" to the previous
        "timeframe" that when hit will trigger an alert.
      </label>
    </el-form-item>

    <el-form-item label="Timeframe" prop="timeframe" required>
      <ElastalertTimePicker v-model="timeframe" @input="(t) => $emit('updateTimeframe', t)" />
      <label>
        The rule will average out the rate of events over this time period.
        For example, 1 hour means that the ‘current’ window will span from
        present to one hour ago, and the ‘reference’ window will span from one
        hour ago to two hours ago.
      </label>
    </el-form-item>

    <el-form-item label="Direction" prop="spikeType" required>
      <el-select v-model="spikeType">
        <el-option label="Up" value="up" />
        <el-option label="Down" value="down" />
        <el-option label="Both" value="both" />
      </el-select>
      <label>
        ‘Up’ means the rule will only match when the number of events is "spike height" times
        higher. ‘Down’ means the reference number is "spike height" higher than the
        current number. ‘Both’ will match either.
      </label>
    </el-form-item>

    <el-button
      v-if="showAdvanced"
      type="text"
      @click="toggleAdvanced">
      <i class="el-icon-caret-bottom" />
      Hide advanced options
    </el-button>
    <el-button v-else type="text" @click="toggleAdvanced">
      <i class="el-icon-caret-right" />
      Show advanced options
    </el-button>

    <template v-if="showAdvanced">
      <el-form-item label="Threshold (reference)" prop="thresholdRef">
        <el-switch v-model="useThresholdRef" @input="toggleThresholdRef" />
        <br>
        <el-input
          v-if="useThresholdRef"
          v-model="thresholdRef"
          type="number"
          @input="updateMarkLine" />
        <label>
          The minimum number of events that must exist in the
          reference window for an alert to trigger.
          For example, if "spike height" is 3 and "threshold reference" is 10,
          then the ‘reference’ window must contain
          at least 10 events and the ‘current’ window at least
          30 events for an alert to be triggered.
        </label>
      </el-form-item>

      <el-form-item label="Threshold (current)" prop="thresholdCur">
        <el-switch v-model="useThresholdCur" @input="toggleThresholdCur" /><br>
        <el-input
          v-if="useThresholdCur"
          v-model="thresholdCur"
          type="number"
          @input="updateMarkLine" />
        <label>
          The minimum number of events that must exist in the current
          window for an alert to trigger.
          For example, if 'spike height' is 3 and 'threshold current' is 60, then an alert
          will occur if the current window has more than 60 events and the reference
          window has less than 20.
        </label>
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      useThresholdRef: false,
      useThresholdCur: false,
      showAdvanced: false,
      rules: {
        spike_height: [{
          pattern: /^([1-9]*[.])?[0-9]+$/,
          message: 'Please enter a number above 1.0'
        }, {
          validator(rule, value, callback) {
            let errors = [];

            if (value <= 1.0) {
              errors.push('Please enter a number above 1.0');
            }

            callback(errors);
          }
        }]
      }
    };
  },

  computed: {
    timeframe: {
      get() {
        return this.$store.state.config.match.timeframe;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_TIMEFRAME', value);
      }
    },

    spikeHeight: {
      get() {
        return this.$store.state.config.match.spikeHeight;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_SPIKE_HEIGHT', value);
      }
    },

    spikeType: {
      get() {
        return this.$store.state.config.match.spikeType;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_SPIKE_TYPE', value);
      }
    },

    thresholdRef: {
      get() {
        return this.$store.state.config.match.threasholdRef;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_THRESHOLD_REF', value);
      }
    },

    thresholdCur: {
      get() {
        return this.$store.state.config.match.threasholdCur;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_THRESHOLD_CUR', value);
      }
    },
  },

  mounted() {
    this.updateMarkLine();
  },

  methods: {
    updateSpikeHeight(val) {
      this.$emit('updateSpikeHeight', val);
    },

    updateMarkLine() {
      let data = [];

      if (this.useThresholdRef) {
        data.push({
          name: 'Threshold (reference)',
          yAxis: this.thresholdRef,
          lineStyle: {
            color: 'red'
          },
          label: {
            formatter: `Threshold (reference) - ${this.thresholdRef}`,
            position: 'middle',
            color: 'red',
            textBorderColor: 'white',
            textShadowColor: 'white',
            textShadowBlur: 1,
            textBorderWidth: 2,
            fontSize: 14
          }
        });
      }

      if (this.useThresholdCur) {
        data.push({
          name: 'Threshold (current)',
          yAxis: this.thresholdCur,
          label: {
            formatter: `Threshold (current) - ${this.thresholdCur}`,
            position: 'middle',
            color: 'green',
            fontWeight: 'bold',
            textBorderColor: 'white',
            textShadowColor: 'white',
            textShadowBlur: 1,
            textBorderWidth: 2,
            fontSize: 14
          }
        });
      }

      this.$emit('updateMarkLine', {
        silent: true,
        lineStyle: {
          color: 'green',
          type: 'solid'
        },
        animation: false,
        symbol: 'none',
        data
      });
    },

    toggleAdvanced() {
      this.showAdvanced = !this.showAdvanced;
    },

    toggleThresholdRef(val) {
      if (!val) {
        this.$store.commit('config/match/UPDATE_THRESHOLD_REF', null);
      }
    },

    toggleThresholdCur(val) {
      if (!val) {
        this.$store.commit('config/match/UPDATE_THRESHOLD_CUR', null);
      }
    }
  }
};
</script>

