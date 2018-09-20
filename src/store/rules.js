import Vue from 'vue';
import axios from 'axios';
import yaml from 'js-yaml';
import networkError from '../lib/networkError.js';
import { htmlToConfigFormat, configFormatToHtml } from '../lib/alertText';

function formatConfig(config) {
  let formattedSubject = htmlToConfigFormat(config.alert_subject);
  config.alert_subject = formattedSubject.alertText;
  config.alert_subject_args = formattedSubject.alertArgs;

  let formattedText = htmlToConfigFormat(config.alert_text);
  config.alert_text = formattedText.alertText;
  config.alert_text_args = formattedText.alertArgs;

  config.__praeco_query_builder = JSON.stringify(config.__praeco_query_builder);

  return config;
}

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
      } catch (e) {
        console.log(e);
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
    async createRule(context, config) {
      config = formatConfig(config);

      try {
        let res = await axios.post(`/rules/${config.name}`, {
          yaml: yaml.safeDump(config)
        });

        return res.data;
      } catch (error) {
        networkError(error);
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
      config = formatConfig(config);
      config.is_enabled = false;

      try {
        let res = await axios.post(`/rules/${config.name}`, {
          yaml: yaml.safeDump(config)
        });

        if (res.data.created) {
          commit('UPDATED_RULE', { id: config.name, rule: config });
          return true;
        }

        return false;
      } catch (error) {
        networkError(error);
      }
    },
    async enableRule({ commit }, config) {
      config = formatConfig(config);
      config.is_enabled = true;

      try {
        let res = await axios.post(`/rules/${config.name}`, {
          yaml: yaml.safeDump(config)
        });

        if (res.data.created) {
          commit('UPDATED_RULE', { id: config.name, rule: config });
          return true;
        }

        return false;
      } catch (error) {
        networkError(error);
      }
    }
  }
};
