import Vue from 'vue';

function initialState() {
  return {
    type: 'frequency',

    blacklist: [],
    whitelist: [],
    compareKey: null,
    ignoreNull: false,

    queryKey: '',
    timeframe: { minutes: 5 },
    useTimeframe: false,
    docType: '',

    numEvents: null,
    useCountQuery: false,
    useTermsQuery: false,
    termsSize: 50,

    spikeHeight: null,
    spikeType: 'up',
    thresholdRef: null,
    thresholdCur: null,

    metricAggKey: '',
    metricAggType: 'count',
    maxThreshold: null,
    minThreshold: null,

    threshold: null,

    termsWindowSize: { days: 30 },
    windowStepSize: { days: 1 },
    alertOnMissingField: false,
    useKeywordPostfix: true
  };
}

export default {
  namespaced: true,

  state: {
    ...initialState()
  },

  getters: {
    markLine(state, getters) {
      if (state.type === 'spike') {
        return getters.markLineSpike;
      } else if (state.type === 'frequency') {
        return getters.markLineFrequency;
      } else if (state.type === 'flatline') {
        return getters.markLineFlatline;
      } else if (state.type === 'metric_aggregation') {
        return getters.markLineMetricAggregation;
      }
    },

    spikeHeight(state) {
      if (state.type === 'spike') {
        return state.spikeHeight;
      }
    },

    markLineSpike(state) {
      let data = [];

      if (state.thresholdRef) {
        data.push({
          name: 'Threshold (reference)',
          yAxis: state.thresholdRef,
          lineStyle: {
            color: 'red'
          },
          label: {
            formatter: `Threshold (reference) - ${state.thresholdRef}`,
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

      if (state.thresholdCur) {
        data.push({
          name: 'Threshold (current)',
          yAxis: state.thresholdCur,
          label: {
            formatter: `Threshold (current) - ${state.thresholdCur}`,
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

      return {
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

    markLineFrequency(state) {
      if (state.numEvents > 0) {
        return {
          silent: true,
          lineStyle: {
            color: 'red',
            type: 'solid'
          },
          animation: false,
          symbol: 'none',
          label: {
            show: false
          },
          data: [
            {
              name: 'Alert level',
              yAxis: state.numEvents
            }
          ]
        };
      }

      return {};
    },

    markLineFlatline(state) {
      if (state.threshold > 0) {
        return {
          silent: true,
          lineStyle: {
            color: 'red',
            type: 'solid'
          },
          animation: false,
          symbol: 'none',
          label: {
            show: false
          },
          data: [
            {
              name: 'Alert level',
              yAxis: state.threshold
            }
          ]
        };
      }

      return {};
    },

    markLineMetricAggregation(state) {
      let data = [];

      if (state.maxThreshold) {
        data.push({
          name: 'Above',
          yAxis: state.maxThreshold,
          lineStyle: {
            color: 'red'
          },
          label: {
            formatter: `Above - ${state.maxThreshold}`,
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

      if (state.minThreshold) {
        data.push({
          name: 'Below',
          yAxis: state.minThreshold,
          label: {
            formatter: `Below - ${state.minThreshold}`,
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

      return {
        silent: true,
        lineStyle: {
          color: 'green',
          type: 'solid'
        },
        animation: false,
        symbol: 'none',
        data
      };
    }
  },

  mutations: {
    /*eslint-disable */
    RESET(state) {
      /* eslint-enable */
      state = Object.assign(state, initialState());
    },

    //
    // Shared
    //
    UPDATE_TYPE(state, type) {
      state.type = type;
    },

    UPDATE_IGNORE_NULL(state, ignoreNull) {
      state.ignoreNull = ignoreNull;
    },

    UPDATE_DOC_TYPE(state, docType) {
      state.docType = docType;
    },

    UPDATE_QUERY_KEY(state, queryKey) {
      state.queryKey = queryKey;
    },

    UPDATE_COMPARE_KEY(state, compareKey) {
      state.compareKey = compareKey;
    },

    UPDATE_TIMEFRAME(state, timeframe) {
      if (!timeframe) return;

      Vue.delete(state, 'timeframe');

      if (typeof timeframe === 'object' && Object.keys(timeframe).length) {
        state.timeframe = {
          [Object.keys(timeframe)[0]]: Object.values(timeframe)[0]
        };
      }
    },

    UPDATE_USE_TIMEFRAME(state, useTimeframe) {
      state.useTimeframe = useTimeframe;
    },

    //
    // Blacklist
    //

    ADD_BLACKLIST_ENTRY(state) {
      state.blacklist.push('');
    },

    ADD_BLACKLIST_ENTRY_VALUE(state, value) {
      state.blacklist.push(value);
    },

    REMOVE_BLACKLIST_ENTRY(state, entry) {
      state.blacklist = state.blacklist.filter(b => b !== entry);
    },

    UPDATE_BLACKLIST_ENTRY(state, { entry, index }) {
      if (!state.blacklist) return;
      state.blacklist[index] = entry;
    },

    //
    // Whitelist
    //

    ADD_WHITELIST_ENTRY(state) {
      state.whitelist.push('');
    },

    ADD_WHITELIST_ENTRY_VALUE(state, value) {
      state.whitelist.push(value);
    },

    REMOVE_WHITELIST_ENTRY(state, entry) {
      state.whitelist = state.whitelist.filter(b => b !== entry);
    },

    UPDATE_WHITELIST_ENTRY(state, { entry, index }) {
      if (!state.whitelist) return;
      state.whitelist[index] = entry;
    },

    //
    // Change
    //

    //
    // Frequency
    //
    UPDATE_NUM_EVENTS(state, numEvents) {
      state.numEvents = parseInt(numEvents) || null;
    },

    UPDATE_USE_TERMS_QUERY(state, useTermsQuery) {
      state.useTermsQuery = useTermsQuery;
    },

    UPDATE_USE_COUNT_QUERY(state, useCountQuery) {
      state.useCountQuery = useCountQuery;
    },

    UPDATE_TERMS_SIZE(state, termsSize) {
      state.termsSize = parseInt(termsSize) || null;
    },

    //
    // Spike
    //

    UPDATE_THRESHOLD_REF(state, thresholdRef) {
      state.thresholdRef = parseFloat(thresholdRef) || null;
    },

    UPDATE_THRESHOLD_CUR(state, thresholdCur) {
      state.thresholdCur = parseFloat(thresholdCur) || null;
    },

    UPDATE_SPIKE_HEIGHT(state, spikeHeight) {
      state.spikeHeight = parseFloat(spikeHeight) || null;
    },

    UPDATE_SPIKE_TYPE(state, spikeType) {
      if (!spikeType) return;
      state.spikeType = spikeType;
    },

    //
    // Metric aggregation
    //

    UPDATE_METRIC_AGG_KEY(state, metricAggKey) {
      state.metricAggKey = metricAggKey;
    },

    UPDATE_METRIC_AGG_TYPE(state, metricAggType) {
      state.metricAggType = metricAggType;
    },

    UPDATE_MAX_THRESHOLD(state, maxThreshold) {
      state.maxThreshold = parseFloat(maxThreshold) || null;
    },

    UPDATE_MIN_THRESHOLD(state, minThreshold) {
      state.minThreshold = parseFloat(minThreshold) || null;
    },

    //
    // Flatline
    //

    UPDATE_THRESHOLD(state, threshold) {
      state.threshold = parseFloat(threshold) || null;
    },

    //
    // New Term
    //

    UPDATE_TERMS_WINDOW_SIZE(state, termsWindowSize) {
      if (!termsWindowSize) return;

      Vue.delete(state, 'termsWindowSize');

      if (typeof termsWindowSize === 'object' && Object.keys(termsWindowSize).length) {
        state.termsWindowSize = {
          [Object.keys(termsWindowSize)[0]]: Object.values(termsWindowSize)[0]
        };
      }
    },

    UPDATE_WINDOW_STEP_SIZE(state, windowStepSize) {
      if (!windowStepSize) return;

      Vue.delete(state, 'windowStepSize');

      if (typeof windowStepSize === 'object' && Object.keys(windowStepSize).length) {
        state.windowStepSize = {
          [Object.keys(windowStepSize)[0]]: Object.values(windowStepSize)[0]
        };
      }
    },

    UPDATE_ALERT_ON_MISSING_FIELD(state, value) {
      state.alertOnMissingField = value;
    },

    UPDATE_USE_KEYWORD_POSTFIX(state, value) {
      state.useKeywordPostfix = value;
    }
  }
};
