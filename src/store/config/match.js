import Vue from 'vue';

function initialState() {
  return {
    type: 'any',

    blacklist: [],
    whitelist: [],
    compareKey: null,
    ignoreNull: false,

    queryKey: '',
    timeframe: {},
    docType: '',

    numEvents: null,
    useCountQuery: false,
    useTermsQuery: false,
    termsSize: null,

    spikeHeight: null,
    spikeType: 'up',
    thresholdRef: null,
    thresholdCur: null
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
            color: '#ff0000',
            type: 'solid'
          },
          label: {
            position: 'middle',
            formatter: `Threshold - ${state.numEvents}`
          },
          animation: false,
          symbol: 'none',
          data: [
            {
              name: 'Alert level',
              yAxis: state.numEvents
            }
          ]
        };
      }

      return {};
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
      state.timeframe = timeframe;
    },

    //
    // Blacklist
    //

    ADD_BLACKLIST_ENTRY(state) {
      if (!state.blacklist) {
        state.blacklist = [];
      }

      state.blacklist.push('');
    },

    REMOVE_BLACKLIST_ENTRY(state, entry) {
      state.blacklist = state.blacklist.filter(b => b !== entry);

      if (state.blacklist.length === 0) {
        Vue.delete(state, 'blacklist');
      }
    },

    UPDATE_BLACKLIST_ENTRY(state, { entry, index }) {
      if (!state.blacklist) return;
      state.blacklist[index] = entry;
    },

    //
    // Whitelist
    //

    ADD_WHITELIST_ENTRY(state) {
      if (!state.whitelist) {
        state.whitelist = [];
      }

      state.whitelist.push('');
    },

    REMOVE_WHITELIST_ENTRY(state, entry) {
      state.whitelist = state.whitelist.filter(b => b !== entry);

      if (state.whitelist.length === 0) {
        Vue.delete(state, 'whitelist');
      }
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
      state.numEvents = parseInt(numEvents);
    },

    UPDATE_USE_TERMS_QUERY(state, useTermsQuery) {
      state.useTermsQuery = useTermsQuery;
    },

    UPDATE_USE_COUNT_QUERY(state, useCountQuery) {
      state.useCountQuery = useCountQuery;
    },

    UPDATE_TERMS_SIZE(state, termsSize) {
      state.termsSize = parseInt(termsSize);
    },

    //
    // Spike
    //

    UPDATE_THRESHOLD_REF(state, thresholdRef) {
      state.thresholdRef = parseFloat(thresholdRef);
    },

    UPDATE_THRESHOLD_CUR(state, thresholdCur) {
      state.thresholdCur = parseFloat(thresholdCur);
    },

    UPDATE_SPIKE_HEIGHT(state, spikeHeight) {
      state.spikeHeight = parseFloat(spikeHeight);
    },

    UPDATE_SPIKE_TYPE(state, spikeType) {
      state.spikeType = spikeType;
    }
  }
};
