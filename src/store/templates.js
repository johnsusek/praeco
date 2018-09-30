import Vue from 'vue';
import axios from 'axios';
import yaml from 'js-yaml';
import cloneDeep from 'lodash.clonedeep';
import { logger } from '@/lib/logger.js';
import networkError from '../lib/networkError.js';
import { configFormatToHtml } from '../lib/alertText';
import { formatConfig } from '../lib/formatConfig';

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
      } catch (error) {
        logger().error({ error });
        console.log(error);
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
    async renameTemplate({ dispatch, state }, { oldName, newName }) {
      if (oldName === newName) return;

      let oldTemplate = state.templates[oldName];
      let newTemplate = cloneDeep(oldTemplate);
      newTemplate.name = newName;

      try {
        let res = await dispatch('createTemplate', newTemplate);
        if (res) {
          await dispatch('deleteTemplate', oldName);
          return newName;
        }
      } catch (error) {
        networkError(error);
      }
    },
    async duplicateTemplate({ dispatch, state }, { name }) {
      let rule = state.templates[name];
      let newTemplate = cloneDeep(rule);

      let i = 1;
      while (state.templates[`${newTemplate.name} (${i})`]) {
        i++;
      }
      newTemplate.name += ` (${i})`;

      try {
        let res = await dispatch('createTemplate', newTemplate);
        if (res) {
          return newTemplate.name;
        }
      } catch (error) {
        networkError(error);
      }
    },
    async createTemplate(context, config) {
      config = formatConfig(config);

      try {
        let res = await axios.post(`/templates/${config.name}`, {
          yaml: yaml.safeDump(config)
        });

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
