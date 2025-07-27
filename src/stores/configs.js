import { defineStore } from 'pinia';
import axios from 'axios';
import yaml from 'js-yaml';
import cloneDeep from 'lodash.clonedeep';
import { logger } from '@/lib/logger.js';
import networkError from '../lib/networkError.js';

export const useConfigsStore = defineStore('configs', {
  state: () => ({
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
  }),

  actions: {
    fetchedConfigs({ paths, type }) {
      // Configs are stored with their full path as their key
      paths.forEach(path => {
        if (!this[type][path]) {
          // Since we are just getting a list of configs without their
          // details, we set to an empty object in the store
          this[type][path] = {};
        }
      });
    },

    fetchedConfigsTree({ paths, type }) {
      paths = paths.filter(path => path !== 'BaseRule.config');
      this.tree[type] = paths;
    },

    fetchedConfig({ path, config, type, isYaml = true }) {
      try {
        let conf = isYaml ? yaml.load(config, 'utf8') : config;

        if (isYaml) {
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
        this[type][path] = conf;
      } catch (error) {
        console.error(error);
        logger().error({ error });
      }
    },

    updatedConfig({ path, config, type }) {
      this[type][path] = config;
    },

    deletedConfig({ path, type }) {
      delete this[type][path];
    },

    async fetchConfig({ path, type }) {
      try {
        let res = await axios.get(`/api/${type}/${path}`);
        // We have got the config, so save it to our store keyed on its path
        let ruleYaml = typeof res.data === 'object' ? res.data.yaml : res.data;
        this.fetchedConfig({ path, config: ruleYaml, type });
        return res.data;
      } catch (error) {
        networkError(error);
      }
    },

    async renameConfig({ config, type, newName }) {
      // Rename is similar to move, except the path is the same,
      // so our param is just the new name
      if (config.name === newName) return;

      // If a config with the same name exists somewhere, return false
      let takenNames = this.tree[type].map(c => c.split('/').pop()).filter(c => c !== '');
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
        let res = await this.createConfig({ config: newConfig, type });

        if (res && !res.error) {
          // It worked, delete the old config
          await this.deleteConfig({ path: config.__praeco_full_path, type });

          // Give the new path back to the caller so it can e.g. update UI
          return newConfig.__praeco_full_path;
        }
      } catch (error) {
        networkError(error);
      }
    },

    async moveConfig({ oldConfig, newPath, type }) {
      let newConfig = cloneDeep(oldConfig);

      // If there is a new path (i.e. in a subfolder), add that to the full pathname
      newConfig.__praeco_full_path = `${newPath}${newConfig.name}`;

      if (oldConfig.__praeco_full_path === newConfig.__praeco_full_path) return;

      if (type === 'rules') {
        let dots = '';

        for (let i = 1; i < newConfig.__praeco_full_path.split('/').length; i++) {
          dots += '../';
        }

        if (newConfig.import) {
          if (Array.isArray(newConfig.import)) {
            newConfig.import = newConfig.import.map(i => (i.includes('.') ? i : dots + i));
          } else {
            newConfig.import = newConfig.import.includes('.') ? newConfig.import : dots + newConfig.import;
          }
        }
      }

      try {
        // First we create the new config in its new location
        let res = await this.createConfig({ config: newConfig, type });

        if (res && !res.error) {
          // It worked, delete the old config
          await this.deleteConfig({ path: oldConfig.__praeco_full_path, type });

          // Give the new path back to the caller so it can e.g. update UI
          return newConfig.__praeco_full_path;
        }
      } catch (error) {
        networkError(error);
      }
    },

    async fetchConfigs({ type }) {
      try {
        let res = await axios.get(`/api/${type}`);
        // We just got a list of all config names & full paths,
        // but not the details of the config
        this.fetchedConfigs({ paths: res.data, type });
        return res.data;
      } catch (error) {
        networkError(error);
      }
    },

    async fetchConfigsTree({ type }) {
      try {
        let res = await axios.get(`/api/${type}/tree`);
        this.fetchedConfigsTree({ paths: res.data, type });
        return res.data;
      } catch (error) {
        networkError(error);
      }
    },

    async createConfig({ config, type }) {
      try {
        let res = await axios.post(`/api/${type}`, config);
        this.updatedConfig({ path: config.__praeco_full_path, config, type });
        return res.data;
      } catch (error) {
        networkError(error);
        return error;
      }
    },

    async createFolder({ type, path }) {
      try {
        let res = await axios.post(`/api/${type}/folder`, { path });
        return res.data;
      } catch (error) {
        networkError(error);
      }
    },

    async updateConfig({ config, type }) {
      try {
        let res = await axios.post(`/api/${type}`, config);
        this.updatedConfig({ path: config.__praeco_full_path, config, type });
        return res.data;
      } catch (error) {
        networkError(error);
        return error;
      }
    },

    async deleteConfig({ path, type }) {
      try {
        let res = await axios.delete(`/api/${type}/${path}`);
        this.deletedConfig({ path, type });
        return res.data;
      } catch (error) {
        networkError(error);
      }
    },

    async testConfig({ config, options }) {
      try {
        let res = await axios.post('/api/test', { config, options });
        return res.data;
      } catch (error) {
        networkError(error);
      }
    },

    async copyConfig({ config, type }) {
      let newConfig = cloneDeep(config);

      // Generate a copy name and path
      let copyName = `${config.name}_copy`;
      let copyPath = config.__praeco_full_path.replace(config.name, copyName);

      // Check if a config with this name already exists
      let counter = 1;
      while (this[type][copyPath]) {
        copyName = `${config.name}_copy_${counter}`;
        copyPath = config.__praeco_full_path.replace(config.name, copyName);
        counter++;
      }

      newConfig.name = copyName;
      newConfig.__praeco_full_path = copyPath;

      try {
        let res = await this.createConfig({ config: newConfig, type });
        return res;
      } catch (error) {
        networkError(error);
      }
    }
  }
});