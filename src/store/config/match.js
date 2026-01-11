import Vue from 'vue';

function initialState() {
  return {
    type: 'any',

    blacklist: [],
    whitelist: [],
    compareKey: null,
    ignoreNull: false,

    queryKey: [],
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

    cardinalityField: null,
    minCardinality: null,
    maxCardinality: null,

    threshold: null,

    termsWindowSize: { days: 30 },
    windowStepSize: { days: 1 },
    alertOnMissingField: false,
    useKeywordPostfix: true,

    // Percentage Match
    matchBucketFilter: null,
    minPercentage: null,
    maxPercentage: null,

    // Spike Aggregation
    spikeAggMetricAggKey: '',
    spikeAggMetricAggType: 'avg'
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
      } if (state.type === 'frequency') {
        return getters.markLineFrequency;
      } if (state.type === 'flatline') {
        return getters.markLineFlatline;
      } if (state.type === 'metric_aggregation') {
        return getters.markLineMetricAggregation;
      } if (state.type === 'cardinality') {
        return getters.markLineCardinality;
      } if (state.type === 'percentage_match') {
        return getters.markLinePercentageMatch;
      } if (state.type === 'spike_aggregation') {
        return getters.markLineSpikeAggregation;
      }
    },

    spikeHeight(state) {
      if (state.type === 'spike' || state.type === 'spike_aggregation') {
        return state.spikeHeight;
      }
    },

    markLinePercentageMatch(state) {
      let data = [];

      if (state.minPercentage !== null && state.minPercentage !== undefined) {
        data.push({
          name: 'Minimum percentage',
          yAxis: state.minPercentage,
          lineStyle: {
            color: '#F56C6C'
          },
          label: {
            formatter: `Minimum percentage - ${state.minPercentage}%`,
            position: 'middle',
            color: '#F56C6C',
            fontSize: 14
          }
        });
      }

      if (state.maxPercentage !== null && state.maxPercentage !== undefined) {
        data.push({
          name: 'Maximum percentage',
          yAxis: state.maxPercentage,
          lineStyle: {
            color: '#F56C6C'
          },
          label: {
            formatter: `Maximum percentage - ${state.maxPercentage}%`,
            position: 'middle',
            color: '#F56C6C',
            fontSize: 14
          }
        });
      }

      return {
        silent: true,
        lineStyle: {
          color: '#F56C6C',
          type: 'solid'
        },
        animation: false,
        symbol: 'none',
        data
      };
    },

    markLineSpikeAggregation(state) {
      let data = [];

      if (state.thresholdRef) {
        data.push({
          name: 'Threshold (reference)',
          yAxis: state.thresholdRef,
          lineStyle: {
            color: '#F56C6C'
          },
          label: {
            formatter: `Threshold (reference) - ${state.thresholdRef}`,
            position: 'middle',
            color: '#F56C6C',
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

    markLineCardinality(state) {
      let data = [];

      if (state.minCardinality) {
        data.push({
          name: 'Minimum cardinality',
          yAxis: state.minCardinality,
          lineStyle: {
            color: '#F56C6C'
          },
          label: {
            formatter: 'Minimum cardinality',
            position: 'middle',
            color: '#F56C6C',
            fontSize: 14
          }
        });
      }

      if (state.maxCardinality) {
        data.push({
          name: 'Maximum cardinality',
          yAxis: state.maxCardinality,
          lineStyle: {
            color: '#F56C6C'
          },
          label: {
            formatter: 'Maximum cardinality',
            position: 'middle',
            color: '#F56C6C',
            fontSize: 14
          }
        });
      }

      return {
        silent: true,
        lineStyle: {
          color: '#F56C6C',
          type: 'solid'
        },
        animation: false,
        symbol: 'none',
        data
      };
    },

    markLineSpike(state) {
      let data = [];

      if (state.thresholdRef) {
        data.push({
          name: 'Threshold (reference)',
          yAxis: state.thresholdRef,
          lineStyle: {
            color: '#F56C6C'
          },
          label: {
            formatter: `Threshold (reference) - ${state.thresholdRef}`,
            position: 'middle',
            color: '#F56C6C',
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
            color: '#F56C6C',
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
            color: '#F56C6C',
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
            color: '#F56C6C'
          },
          label: {
            formatter: `Above - ${state.maxThreshold}`,
            position: 'middle',
            color: '#F56C6C',
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

    RESET(state) {

      state = Object.assign(state, initialState()); // eslint-disable-line no-unused-vars
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

    ADD_QUERY_KEY_ENTRY(state) {
      state.queryKey.push('');
    },

    ADD_QUERY_KEY_ENTRY_VALUE(state, value) {
      state.queryKey.push(value);
    },

    REMOVE_QUERY_KEY_ENTRY(state, entry) {
      state.queryKey = state.queryKey.filter(b => b !== entry);
    },

    UPDATE_QUERY_KEY_ENTRY(state, { entry, index }) {
      if (!state.queryKey) return;
      state.queryKey[index] = entry;
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
    // Cardinality
    //

    UPDATE_CARDINALITY_FIELD(state, cardinalityField) {
      state.cardinalityField = cardinalityField;
    },

    UPDATE_MAX_CARDINALITY(state, maxCardinality) {
      state.maxCardinality = parseInt(maxCardinality);
    },

    UPDATE_MIN_CARDINALITY(state, minCardinality) {
      state.minCardinality = parseInt(minCardinality);
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
    },

    //
    // Percentage Match
    //

    UPDATE_MATCH_BUCKET_FILTER(state, matchBucketFilter) {
      state.matchBucketFilter = matchBucketFilter;
    },

    UPDATE_MIN_PERCENTAGE(state, minPercentage) {
      state.minPercentage = parseFloat(minPercentage) || null;
    },

    UPDATE_MAX_PERCENTAGE(state, maxPercentage) {
      state.maxPercentage = parseFloat(maxPercentage) || null;
    },

    //
    // Spike Aggregation
    //

    UPDATE_SPIKE_AGG_METRIC_AGG_KEY(state, spikeAggMetricAggKey) {
      state.spikeAggMetricAggKey = spikeAggMetricAggKey;
    },

    UPDATE_SPIKE_AGG_METRIC_AGG_TYPE(state, spikeAggMetricAggType) {
      state.spikeAggMetricAggType = spikeAggMetricAggType;
    }
  }
};
