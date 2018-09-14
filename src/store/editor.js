import axios from 'axios';
import yaml from 'js-yaml';
import defaultConfig from '../defaultConfig.json';

export default {
  namespaced: true,
  state: {
    config: defaultConfig,
    test: null
  },
  mutations: {
    CONFIG_LOAD(state, config) {
      state.config = { ...defaultConfig, ...config };
    },
    CONFIG_RESET(state) {
      state.config = defaultConfig;
    },
    CLEAR_TEST_RESULT(state) {
      state.test = null;
    },
    FETCHED_TEST_RESULT(state, result) {
      state.test = result;
    }
  },
  actions: {
    async testRule({ commit, state }) {
      commit('CLEAR_TEST_RESULT');

      try {
        let res = await axios.post('/api/test', {
          rule: yaml.safeDump(state.config),
          options: {
            testType: 'all',
            days: 1,
            alert: false,
            format: 'json',
            maxResults: 1
          }
        });

        if (!res.data.success) {
          commit('FETCHED_TEST_RESULT', { error: res.data });
          return false;
        }

        commit('FETCHED_TEST_RESULT', res.data);
        return true;
      } catch (error) {
        commit('FETCHED_TEST_RESULT', { error: error.response.data });
        return false;
      }
    }
  }
};
