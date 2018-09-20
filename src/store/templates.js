import Vue from 'vue';
import axios from 'axios';
import yaml from 'js-yaml';
import networkError from '../lib/networkError.js';
import { htmlToConfigFormat, configFormatToHtml } from '../lib/alertText';

export default {
  namespaced: true,
  state: {
    templates: {}
  },
  mutations: {
    FETCHED_TEMPLATES(state, payload) {
      payload.templates.forEach(id => {
        if (!state.templates[id]) {
          Vue.set(state.templates, id, {});
        }
      });
    },
    FETCHED_TEMPLATE(state, { id, template }) {
      try {
        let doc = yaml.safeLoad(template, 'utf8');
        doc.alert_subject = configFormatToHtml(doc.alert_subject, doc.alert_subject_args);
        doc.alert_text = configFormatToHtml(doc.alert_text, doc.alert_text_args);
        doc.__praeco_query_builder = JSON.parse(doc.__praeco_query_builder || '{}');
        Vue.set(state.templates, id, doc);
      } catch (e) {
        console.log(e);
      }
    },
    DELETED_TEMPLATE(state, id) {
      Vue.delete(state.templates, id);
    }
  },
  actions: {
    async fetchTemplates({ commit }) {
      try {
        let res = await axios.get('/templates');
        commit('FETCHED_TEMPLATES', res.data);
        return res;
      } catch (error) {
        networkError(error);
      }
    },
    async fetchTemplate({ commit }, id) {
      try {
        let res = await axios.get(`/templates/${id}`);
        commit('FETCHED_TEMPLATE', { id, template: res.data });
        return res;
      } catch (error) {
        networkError(error);
      }
    },
    async createTemplate({ commit }, config) {
      let formattedSubject = htmlToConfigFormat(config.alert_subject);
      config.alert_subject = formattedSubject.alertText;
      config.alert_subject_args = formattedSubject.alertArgs;

      let formattedText = htmlToConfigFormat(config.alert_text);
      config.alert_text = formattedText.alertText;
      config.alert_text_args = formattedText.alertArgs;

      config.__praeco_query_builder = JSON.stringify(config.__praeco_query_builder);
      try {
        let res = await axios.post(`/templates/${config.name}`, {
          yaml: yaml.safeDump(config)
        });

        if (res.data.created) {
          commit('FETCHED_TEMPLATE', { id: config.name, template: config });
        }

        return res.data;
      } catch (error) {
        networkError(error);
      }
    },
    async deleteTemplate({ commit }, id) {
      try {
        let res = await axios.delete(`/templates/${id}`);
        if (res.status === 200) {
          commit('DELETED_TEMPLATE', id);
          return true;
        }
        return false;
      } catch (error) {
        networkError(error);
      }
    }
  }
};
