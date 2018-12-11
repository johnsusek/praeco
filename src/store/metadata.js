import Vue from 'vue';
import axios from 'axios';
import { formatIndex, buildMappingFields, buildMappingTypes } from '@/lib/elasticSearchMetadata.js';
import networkError from '../lib/networkError.js';

function buildObjectFields(fields, prefix) {
  let objectFields = {};

  Object.entries(fields).forEach(([name, field]) => {
    if (field.type) {
      objectFields[`${prefix}.${name}`] = field;
    } else if (field.properties) {
      objectFields = { ...objectFields, ...buildObjectFields(field.properties, `${prefix}.${name}`) };
    }
  });

  return objectFields;
}

export default {
  namespaced: true,

  state: {
    indices: [],
    mappings: {
      // 'ms-*': {
      //   types: [],
      //   fields: {}
      // }
    }
  },

  getters: {
    fieldIsNumeric: (state, getters) => (index, field) => {
      let numTypes = ['long', 'integer', 'short', 'byte', 'double', 'float', 'half_float', 'scaled_float'];
      if (numTypes.includes(getters.typeForField(index, field))) {
        return true;
      }
    },

    typeForField: state => (index, field) => {
      if (!state.mappings[index]) return;
      if (!state.mappings[index].fields) return;
      if (!state.mappings[index].fields[field]) return;

      return state.mappings[index].fields[field].type;
    },

    suggestedIndices(state) {
      let indices = {};

      state.indices.forEach(item => {
        if (item.includes('elastalert')) return;
        let parts = item.split(/-/);
        if (parts[0].startsWith('.')) return;
        if (parts.length > 1) {
          indices[`${parts[0]}-*`] = true;
        } else {
          indices[parts[0]] = true;
        }
      });

      return Object.keys(indices);
    },

    textFieldsForCurrentConfig: (state, getters) => {
      let fields = {};

      Object.entries(getters.fieldsForCurrentConfig).forEach(([name, field]) => {
        if (['text', 'keyword'].includes(field.type)) {
          fields[name] = field;
        }
      });

      return fields;
    },

    numberFieldsForCurrentConfig: (state, getters) => {
      let fields = {};

      Object.entries(getters.fieldsForCurrentConfig).forEach(([name, field]) => {
        if (
          ['long', 'integer', 'short', 'byte', 'double', 'float', 'half_float', 'scaled_float'].includes(field.type)
        ) {
          fields[name] = field;
        }
      });

      return fields;
    },

    dateFieldsForCurrentConfig: (state, getters) => {
      let fields = {};

      Object.entries(getters.fieldsForCurrentConfig).forEach(([name, field]) => {
        if (field.type === 'date') {
          fields[name] = field;
        }
      });

      return fields;
    },

    templateFieldsForCurrentConfig: (state, getters, rootState) => {
      let fields = {};

      // if using "grouped over field", only allow for the grouped field (queryKey)
      if (
        rootState.config.match.queryKey &&
        (rootState.config.match.type === 'frequency' || rootState.config.match.type === 'flatline')
      ) {
        fields[rootState.config.match.queryKey] = rootState.config.match.queryKey;
        return fields;
      }

      fields = getters.fieldsForCurrentConfig;
      return fields;
    },

    fieldsForCurrentConfig: (state, getters, rootState) => {
      let index = rootState.config.settings.index;
      let mappings = state.mappings[formatIndex(index)];

      if (!mappings) {
        return {};
      }

      let fields = {};

      if (mappings.fields) {
        Object.entries(mappings.fields).forEach(([name, field]) => {
          if (field.type) {
            fields[name] = field;
          } else if (field.properties) {
            fields = { ...fields, ...buildObjectFields(field.properties, name) };
          }
        });
      }

      return fields;
    },

    typesForCurrentConfig: (state, getters, rootState) => {
      let index = rootState.config.settings.index;
      let mappings = state.mappings[formatIndex(index)];
      if (mappings) {
        return mappings.types;
      }
      return [];
    }
  },

  mutations: {
    FETCHED_INDICES(state, payload) {
      state.indices = payload;
    },

    FETCHED_MAPPINGS(state, { mappings, index }) {
      if (!state.mappings[index]) {
        Vue.set(state.mappings, index, {});
      }

      Vue.set(state.mappings[index], 'types', buildMappingTypes(mappings));
      Vue.set(state.mappings[index], 'fields', buildMappingFields(mappings));
    }
  },

  actions: {
    async fetchIndices({ commit, state }) {
      if (state.indices.length) {
        return true;
      }

      try {
        let res = await axios.get('/api/indices');
        if (res.data.error) {
          networkError('Error fetching indices.');
        } else {
          commit('FETCHED_INDICES', res.data);
          return true;
        }
      } catch (error) {
        networkError(error);
      }
    },

    async fetchMappings({ commit, state }, index) {
      if (state.mappings[index]) {
        return true;
      }

      try {
        let res = await axios.get(`/api/mapping/${index}`);
        commit('FETCHED_MAPPINGS', { mappings: res.data, index });
        return true;
      } catch (error) {
        return false;
      }
    }
  }
};
