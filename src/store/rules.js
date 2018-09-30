import Vue from 'vue';
import axios from 'axios';
import yaml from 'js-yaml';
import cloneDeep from 'lodash.clonedeep';
import { logger } from '@/lib/logger.js';
import networkError from '../lib/networkError';
import { configFormatToHtml } from '../lib/alertText';
import { formatConfig } from '../lib/formatConfig';

export default {
  namespaced: true,
  state: {
    rules: {}
  },
  mutations: {
    FETCHED_RULES(state, payload) {
      payload.rules.forEach(id => {
        if (!state.rules[id]) {
          Vue.set(state.rules, id, {});
        }
      });
    },
    FETCHED_RULE(state, { id, rule }) {
      try {
        let doc = yaml.safeLoad(rule, 'utf8');
        doc.alert_subject = configFormatToHtml(doc.alert_subject, doc.alert_subject_args);
        doc.alert_text = configFormatToHtml(doc.alert_text, doc.alert_text_args);
        doc.__praeco_query_builder = JSON.parse(doc.__praeco_query_builder || '{}');
        Vue.set(state.rules, id, doc);
      } catch (error) {
        logger().error({ error });
      }
    },
    UPDATED_RULE(state, { id, rule }) {
      Vue.set(state.rules, id, rule);
    },
    DELETED_RULE(state, id) {
      Vue.delete(state.rules, id);
    }
  },
  actions: {
    async fetchRules({ commit }) {
      try {
        let res = await axios.get('/rules');
        commit('FETCHED_RULES', res.data);
        return res;
      } catch (error) {
        networkError(error);
      }
    },
    async fetchRule({ commit }, id) {
      try {
        let res = await axios.get(`/rules/${id}`);
        commit('FETCHED_RULE', { id, rule: res.data });
        return res;
      } catch (error) {
        networkError(error);
      }
    },
    async renameRule({ dispatch, state }, { oldName, newName }) {
      if (oldName === newName) return;

      let oldRule = state.rules[oldName];
      let newRule = cloneDeep(oldRule);
      newRule.name = newName;

      try {
        let res = await dispatch('createRule', newRule);
        if (res) {
          await dispatch('deleteRule', oldName);
          return newName;
        }
      } catch (error) {
        networkError(error);
      }
    },
    async duplicateRule({ dispatch, state }, { name }) {
      let rule = state.rules[name];
      let newRule = cloneDeep(rule);
      newRule.is_enabled = false;

      let i = 1;
      while (state.rules[`${newRule.name} (${i})`]) {
        i++;
      }
      newRule.name += ` (${i})`;

      try {
        let res = await dispatch('createRule', newRule);
        if (res) {
          return newRule.name;
        }
      } catch (error) {
        networkError(error);
      }
    },
    async createRule(context, config) {
      let conf = formatConfig(config);

      try {
        let res = await axios.post(`/rules/${conf.name}`, {
          yaml: yaml.safeDump(conf)
        });

        return res.data;
      } catch (error) {
        networkError(error);
        throw error;
      }
    },
    async deleteRule({ commit }, id) {
      try {
        let res = await axios.delete(`/rules/${id}`);
        if (res.status === 200) {
          commit('DELETED_RULE', id);
          return true;
        }
        return false;
      } catch (error) {
        networkError(error);
      }
    },
    async disableRule({ commit }, config) {
      let conf = formatConfig(config);
      conf.is_enabled = false;

      try {
        let res = await axios.post(`/rules/${conf.name}`, {
          yaml: yaml.safeDump(conf)
        });

        if (res.data.created) {
          commit('UPDATED_RULE', { id: conf.name, rule: conf });
          return true;
        }

        return false;
      } catch (error) {
        networkError(error);
      }
    },
    async enableRule({ commit }, config) {
      let conf = formatConfig(config);
      conf.is_enabled = true;

      try {
        let res = await axios.post(`/rules/${conf.name}`, {
          yaml: yaml.safeDump(conf)
        });

        if (res.data.created) {
          commit('UPDATED_RULE', { id: conf.name, rule: conf });
          return true;
        }

        return false;
      } catch (error) {
        networkError(error);
      }
    }
  }
};
