<template>
  <el-form ref="form" :model="config" :rules="rules" label-position="top" @submit.native.prevent>
    <br>

    <el-form-item label="Spike height" prop="spike_height" required>
      <praeco-input-number v-model="config.spike_height" />
      <label>
        The ratio of number of events in the last "timeframe" to the previous
        "timeframe" that when hit will trigger an alert.
      </label>
    </el-form-item>

    <el-form-item label="Timeframe" props="timeframe" required>
      <ElastalertTimePicker v-model="config.timeframe" />
      <label>
        The rule will average out the rate of events over this time period.
        For example, 1 hour means that the ‘current’ window will span from
        present to one hour ago, and the ‘reference’ window will span from one
        hour ago to two hours ago.
      </label>
    </el-form-item>

    <el-form-item label="Direction" prop="spike_type">
      <el-select v-model="config.spike_type">
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
      <el-form-item label="Threshold (reference)" prop="threshold_ref">
        <el-switch v-model="useThresholdRef" @input="changeThresholdRef" /><br>
        <praeco-input-number
          v-if="useThresholdRef"
          v-model="config.threshold_ref"
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

      <el-form-item label="Threshold (current)" prop="threshold_cur">
        <el-switch v-model="useThresholdCur" @input="changeThresholdCur" /><br>
        <praeco-input-number
          v-if="useThresholdCur"
          v-model="config.threshold_cur"
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
        :spike-height="config.spike_height"
        :mark-line="markLine"
        :timeframe="{ hours: 24 }"
        :bucket="config.timeframe"
        :query="query.query_string.query"
        :index="wildcardIndex" />
    </el-form-item>
  </el-form>
</template>

<script>
import Vue from 'vue';

export default {
  props: ['config', 'index', 'query', 'fields', 'types'],
  data() {
    return {
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
      let formattedIndex = this.config.index;

      if (this.config.use_strftime_index) {
        formattedIndex = formattedIndex.replace(/%[Ymd]/g, '*');
      }

      return formattedIndex;
    }
  },
  mounted() {
    this.updateMarkLine();

    if (!this.config.spike_height) {
      this.config.spike_height = 2;
    }

    if (!this.config.spike_type) {
      this.config.spike_type = 'up';
    }
  },
  methods: {
    changeThresholdRef(val) {
      if (val === false) {
        Vue.delete(this.config, 'threshold_ref');
      } else {
        Vue.set(this.config, 'threshold_ref', 1);
      }

      this.updateMarkLine();
    },
    changeThresholdCur(val) {
      if (val === false) {
        Vue.delete(this.config, 'threshold_cur');
      } else {
        Vue.set(this.config, 'threshold_cur', 1);
      }

      this.updateMarkLine();
    },
    setSpikeHeight(e) {
      Vue.set(this.config, 'spike_height', e.target.value);
    },
    updateMarkLine() {
      let data = [];

      if (this.useThresholdRef) {
        data.push({
          name: 'Threshold (reference)',
          yAxis: this.config.threshold_ref,
          lineStyle: {
            color: 'red'
          },
          label: {
            formatter: `Threshold (reference) - ${this.config.threshold_ref}`,
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
          yAxis: this.config.threshold_cur,
          label: {
            formatter: `Threshold (current) - ${this.config.threshold_cur}`,
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
    async validate() {
      try {
        await this.$refs.form.validate();
        return this.config;
      } catch (error) {
        return false;
      }
    },
    toggleAdvanced() {
      this.showAdvanced = !this.showAdvanced;
    },
  }
};
</script>
