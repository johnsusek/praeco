<template>
  <el-form ref="form" :model="form" :rules="rules" label-position="top" @submit.native.prevent>
    <br>

    <el-form-item label="Spike height" prop="spikeHeight" required>
      <el-input v-model="form.spikeHeight" type="number" />
      <label>
        The ratio of number of events in the last "timeframe" to the previous
        "timeframe" that when hit will trigger an alert.
      </label>
    </el-form-item>

    <el-form-item label="Timeframe" prop="timeframe" required>
      <ElastalertTimePicker v-model="form.timeframe" />
      <label>
        The rule will average out the rate of events over this time period.
        For example, 1 hour means that the ‘current’ window will span from
        present to one hour ago, and the ‘reference’ window will span from one
        hour ago to two hours ago.
      </label>
    </el-form-item>

    <el-form-item label="Direction" prop="spikeType">
      <el-select v-model="form.spikeType">
        <el-option label="Up" value="up"/>
        <el-option label="Down" value="down"/>
        <el-option label="Both" value="both"/>
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
          v-model="form.thresholdRef"
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
          v-model="form.thresholdCur"
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

    <hr>

    <el-form-item label="Frequency visualizer" >
      <ESChart
        :spike-height="form.spikeHeight"
        :mark-line="markLine"
        :timeframe="{ hours: 24 }"
        :bucket="form.timeframe"
        :query="query"
        :index="wildcardIndex" />
    </el-form-item>
  </el-form>
</template>

<script>
import Vue from 'vue';
import { validateForm } from '@/mixins/validateForm';

export default {
  mixins: [validateForm],

  props: [
    'index',
    'query',
    'spikeHeight',
    'timeframe',
    'spikeType',
    'thresholdRef',
    'thresholdCur',
    'strftime'
  ],

  data() {
    return {
      form: {},
      useThresholdRef: false,
      useThresholdCur: false,
      showAdvanced: false,
      markLine: {},
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
    wildcardIndex() {
      let formattedIndex = this.index;
      if (this.strftime) {
        formattedIndex = formattedIndex.replace(/%[Ymd]/g, '*');
      }
      return formattedIndex;
    }
  },

  mounted() {
    if (this.spikeHeight) {
      Vue.set(this.form, 'spikeHeight', this.spikeHeight);
    } else {
      Vue.set(this.form, 'spikeHeight', 2);
    }

    if (this.spikeType) {
      Vue.set(this.form, 'spikeType', this.spikeType);
    } else {
      Vue.set(this.form, 'spikeType', 'up');
    }

    if (this.timeframe) {
      Vue.set(this.form, 'timeframe', this.timeframe);
    } else {
      Vue.set(this.form, 'timeframe', { minutes: 15 });
    }

    if (this.thresholdRef) {
      Vue.set(this.form, 'thresholdRef', this.thresholdRef);
    }

    if (this.thresholdCur) {
      Vue.set(this.form, 'thresholdCur', this.thresholdCur);
    }

    this.updateMarkLine();
  },

  methods: {
    toggleThresholdRef(val) {
      if (val === false) {
        Vue.delete(this.form, 'thresholdRef');
      } else {
        Vue.set(this.form, 'thresholdRef', '1');
      }
    },

    toggleThresholdCur(val) {
      if (val === false) {
        Vue.delete(this.form, 'thresholdCur');
      } else {
        Vue.set(this.form, 'thresholdCur', '1');
      }
    },

    updateMarkLine() {
      let data = [];

      if (this.useThresholdRef) {
        data.push({
          name: 'Threshold (reference)',
          yAxis: this.form.thresholdRef,
          lineStyle: {
            color: 'red'
          },
          label: {
            formatter: `Threshold (reference) - ${this.form.thresholdRef}`,
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
          yAxis: this.form.thresholdCur,
          label: {
            formatter: `Threshold (current) - ${this.form.thresholdCur}`,
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

      this.markLine = {
        silent: true,
        lineStyle: {
          color: 'green',
          type: 'solid'
        },
        animation: false,
        symbol: 'none',
        data
      };
    },

    toggleAdvanced() {
      this.showAdvanced = !this.showAdvanced;
    },
  }
};
</script>

