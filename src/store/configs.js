import Vue from 'vue';
import axios from 'axios';
import yaml from 'js-yaml';
import cloneDeep from 'lodash.clonedeep';
import { logger } from '@/lib/logger.js';
import networkError from '../lib/networkError.js';
import { configFormatToHtml } from '../lib/alertText';

export default {
  namespaced: true,

  state: {
    templates: {
      // 'aaa/templateName': { ...config... },
      // 'aaa/bbb/otherTemplateName': { ...config... }
    },
    rules: {
      // 'zzz/ruleName': { ...config... },
      // 'zzz/ddd/otherRuleName': { ...config... }
    },
    tree: {
      templates: [],
      rules: []
    }
  },

  mutations: {
    FETCHED_CONFIGS(state, { paths, type }) {
      // Configs are stored with their full path as their key
      paths.forEach(path => {
        if (!state[type][path]) {
          // Since we are just getting a list of configs without their
          // details, we set to an empty object in the store
          Vue.set(state[type], path, {});
        }
      });
    },

    FETCHED_CONFIGS_TREE(state, { paths, type }) {
      paths = paths.filter(path => path !== 'BaseRule.config');
      Vue.set(state.tree, type, paths);
    },

    /*eslint-disable */
    FETCHED_CONFIG(state, { path, config, type, isYaml = true }) {
      /* eslint-enable */
      try {
        let conf = isYaml ? yaml.safeLoad(config, 'utf8') : config;

        if (isYaml) {
          // The config from the server has yaml formatted alert subject/text
          // We need it in html so convert it here. When saving the config,
          // it will be converted back to yaml format.
          conf.alert_subject = configFormatToHtml(conf.alert_subject, conf.alert_subject_args);
          conf.alert_text = configFormatToHtml(conf.alert_text, conf.alert_text_args);

          // The configuration for the querybuilder widget that we saved to the rule
          // gets parsed here for use later.
          conf.__praeco_query_builder = JSON.parse(conf.__praeco_query_builder || '{}');
        }

        // The rule name is only for display, for actually referring to the rule
        // in our store we use the full path. We need that path saved as
        // we pass around our rule conf.
        conf.__praeco_full_path = path;

        // Save the config at the full path in the store, how we'll refer to it later
        // The rule name is just for display, we should use __praeco_full_path to refer
        // to the rule internally.
        Vue.set(state[type], path, conf);
      } catch (error) {
        console.error(error);
        logger().error({ error });
      }
    },

    UPDATED_CONFIG(state, { path, config, type }) {
      Vue.set(state[type], path, config);
    },

    DELETED_CONFIG(state, { path, type }) {
      Vue.delete(state[type], path);
    }
  },

  actions: {
    async fetchConfig({ commit }, { path, type }) {
      try {
        let res = await axios.get(`/api/${type}/${path}`);
        // We have got the config, so save it to our store keyed on its path
        let ruleYaml = typeof res.data === 'object' ? res.data.yaml : res.data;
        commit('FETCHED_CONFIG', { path, config: ruleYaml, type });
        return res.data;
      } catch (error) {
        networkError(error);
      }
    },

    async renameConfig({ dispatch, state }, { config, type, newName }) {
      // Rename is similar to move, except the path is the same,
      // so our param is just the new name
      if (config.name === newName) return;

      // If a config with the same name exists somewhere, return false
      let takenNames = state.tree[type].map(c => c.split('/').pop()).filter(c => c !== '');
      if (takenNames.includes(newName)) {
        return;
      }

      let newConfig = cloneDeep(config);

      // First we change the name on the rule itself
      newConfig.name = newName;
      // Then we also change the name in our path
      let newPath = newConfig.__praeco_full_path.split('/');
      newPath.pop();
      newPath.push(newName);
      newConfig.__praeco_full_path = newPath.join('/');

      try {
        // First we create the new config with the new name
        let res = await dispatch('createConfig', { config: newConfig, type });

        if (res && !res.error) {
          // It worked, delete the old config
          await dispatch('deleteConfig', { path: config.__praeco_full_path, type });

          // Give the new path back to the caller so it can e.g. update UI
          return newConfig.__praeco_full_path;
        }
      } catch (error) {
        networkError(error);
      }
    },

    async moveConfig({ dispatch }, { oldConfig, newPath, type }) {
      let newConfig = cloneDeep(oldConfig);

      // If there is a new path (i.e. in a subfolder), add that to the full pathname
      newConfig.__praeco_full_path = `${newPath}${newConfig.name}`;

      if (oldConfig.__praeco_full_path === newConfig.__praeco_full_path) return;

      if (type === 'rules') {
        let dots = '';

        for (let i = 1; i < newConfig.__praeco_full_path.split('/').length; i++) {
          dots += '../';
        }

        newConfig.import = `${dots}BaseRule.config`;
      }

      try {
        // Create the config at the full path
        let res = await dispatch('createConfig', { config: newConfig, type });

        if (res && !res.error) {
          // It worked, delete the old config at the full path
          await dispatch('deleteConfig', { path: oldConfig.__praeco_full_path, type });

          // Give the new full path back to the caller so it can e.g. route to
          // the new location
          return newConfig.__praeco_full_path;
        }
      } catch (error) {
        networkError(error);
      }
    },

    async duplicateConfig({ dispatch, state }, { config, type }) {
      let newConfig = cloneDeep(config);

      newConfig.is_enabled = false;

      // Get a new path/key for the config
      let i = 1;
      while (state[type][`${newConfig.__praeco_full_path} (${i})`]) {
        i++;
      }
      newConfig.__praeco_full_path += ` (${i})`;

      // Get the new label name
      let newPath = newConfig.__praeco_full_path.split('/');
      newConfig.name = newPath.pop();

      try {
        let res = await dispatch('createConfig', { config: newConfig, type });

        // Return the full path back to the caller to update the UI
        if (res && !res.error) {
          return newConfig.__praeco_full_path;
        }
      } catch (error) {
        networkError(error);
      }
    },

    /*eslint-disable */
    async createConfig({ dispatch }, { config, type, overwrite, rootPath }) {
      /* eslint-enable */

      let fullPath;
      if (rootPath) {
        fullPath = '';
      } else if (config.__praeco_full_path) {
        fullPath = config.__praeco_full_path;
        delete config.__praeco_full_path;
      } else {
        fullPath = '';
      }

      let path = fullPath.split('/');
      path.pop();
      path.push(config.name);
      path = path.join('/');

      if (overwrite) {
        return dispatch('createConfigFinal', { type, path, conf: config });
      }

      try {
        // Before creating the config at this path, we check to make sure
        // it doesn't already exist
        let res = await axios.get(`/api/${type}/${path}`);
        if (res.data) {
          return { error: 'A rule by that name already exists at that path' };
        }
      } catch (error) {
        // 404 on this file, which means it is safe to save
        // because no file exists here
        return dispatch('createConfigFinal', { type, path, conf: config });
      }
    },

    async createConfigFinal({ commit, state }, { type, path, conf }) {
      try {
        let res = await axios.post(`/api/${type}/${path}`, {
          yaml: yaml.safeDump(conf)
        });

        if (!res.data.created) {
          logger().error({ ...res.data });
        }

        commit('FETCHED_CONFIG', {
          isYaml: false,
          path,
          config: conf,
          type
        });

        return state[type][path];
      } catch (err) {
        return networkError(err);
      }
    },

    async deleteConfig({ commit }, { path, type }) {
      try {
        let res = await axios.delete(`/api/${type}/${path}`);

        if (res.status === 200) {
          commit('DELETED_CONFIG', { path, type });
          return true;
        }
      } catch (error) {
        networkError(error);
      }
    },

    async createFolder(context, { path, type }) {
      try {
        let res = await axios.put(`/api/folders/${type}/${path}`);
        return res.data;
      } catch (error) {
        networkError(error);
      }
    },

    async deleteFolder(context, { path, type }) {
      try {
        let res = await axios.delete(`/api/folders/${type}/${path}`);
        return res.data;
      } catch (error) {
        networkError(error);
      }
    },

    async silenceRule(context, { path, unit, duration }) {
      try {
        let res = await axios.post(`/api/silence/${path}`, {
          unit,
          duration
        });

        if (res.data.startsWith('INFO:elastalert:Success')) {
          return true;
        }

        return false;
      } catch (error) {
        networkError(error);
      }
    },

    async disableRule({ commit }, conf) {
      conf.is_enabled = false;

      try {
        let res = await axios.post(`/api/rules/${conf.__praeco_full_path}`, {
          yaml: yaml.safeDump(conf)
        });

        if (res.data.created) {
          commit('config/settings/UPDATE_ENABLED', false, { root: true });
          commit('UPDATED_CONFIG', {
            path: conf.__praeco_full_path,
            type: 'rules',
            config: conf
          });
          return true;
        }
        return false;
      } catch (error) {
        networkError(error);
      }
    },

    async enableRule({ commit }, conf) {
      conf.is_enabled = true;

      try {
        let res = await axios.post(`/api/rules/${conf.__praeco_full_path}`, {
          yaml: yaml.safeDump(conf)
        });

        if (res.data.created) {
          commit('config/settings/UPDATE_ENABLED', true, { root: true });
          commit('UPDATED_CONFIG', {
            path: conf.__praeco_full_path,
            type: 'rules',
            config: conf
          });
          return true;
        }

        return false;
      } catch (error) {
        networkError(error);
      }
    }
  }
};
