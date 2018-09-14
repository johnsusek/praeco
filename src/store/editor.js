import axios from 'axios';
import yaml from 'js-yaml';
import appConfig from '../../praeco.config.json';

export default {
  namespaced: true,
  state: {
    config: appConfig.defaultRule,
    test: null
  },
  mutations: {
    CONFIG_LOAD(state, config) {
      state.config = { ...appConfig.defaultRule, ...config };
    },
    CONFIG_RESET(state) {
      state.config = appConfig.defaultRule;
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
        let res = await axios.post('/test', {
          rule: yaml.safeDump(state.config),
          options: {
            testType: 'countOnly',
            days: 30,
            alert: false,
            format: 'json'
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
