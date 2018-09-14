import Vue from 'vue';
import axios from 'axios';
import yaml from 'js-yaml';

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
      let res = await axios.get('/api/templates');
      commit('FETCHED_TEMPLATES', res.data);
      return res;
    },
    async fetchTemplate({ commit }, id) {
      let res = await axios.get(`/api/templates/${id}`);
      commit('FETCHED_TEMPLATE', { id, template: res.data });
      return res;
    },
    async createTemplate({ commit, rootState }) {
      let config = rootState.editor.config;
      let res = await axios.post(`/api/templates/${config.name}`, {
        yaml: yaml.safeDump(config)
      });
      if (res.data.created) {
        commit('FETCHED_TEMPLATE', { id: config.name, template: config });
        return true;
      }
      return false;
    },
    async deleteTemplate({ commit }, id) {
      let res = await axios.delete(`/api/templates/${id}`);
      if (res.status === 200) {
        commit('DELETED_TEMPLATE', id);
        return true;
      }
      return false;
    }
  }
};
