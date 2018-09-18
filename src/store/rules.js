import Vue from 'vue';
import axios from 'axios';
import yaml from 'js-yaml';
import { htmlToConfigFormat, configFormatToHtml } from '../lib/alertText';

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
        Vue.set(state.rules, id, doc);
      } catch (e) {
        console.log(e);
      }
    },
    DELETED_RULE(state, id) {
      Vue.delete(state.rules, id);
    }
  },
  actions: {
    async fetchRules({ commit }) {
      let res = await axios.get('/rules');
      commit('FETCHED_RULES', res.data);
      return res;
    },
    async fetchRule({ commit }, id) {
      let res = await axios.get(`/rules/${id}`);
      commit('FETCHED_RULE', { id, rule: res.data });
      return res;
    },
    async createRule({ commit }, config) {
      let formattedSubject = htmlToConfigFormat(config.alert_subject);
      config.alert_subject = formattedSubject.alertText;
      config.alert_subject_args = formattedSubject.alertArgs;

      let formattedText = htmlToConfigFormat(config.alert_text);
      config.alert_text = formattedText.alertText;
      config.alert_text_args = formattedText.alertArgs;

      let res = await axios.post(`/rules/${config.name}`, {
        yaml: yaml.safeDump(config)
      });

      if (res.data.created) {
        commit('FETCHED_RULE', { id: config.name, rule: config });
      }

      return res.data;
    },
    async deleteRule({ commit }, id) {
      let res = await axios.delete(`/rules/${id}`);
      if (res.status === 200) {
        commit('DELETED_RULE', id);
        return true;
      }
      return false;
    }
  }
};
