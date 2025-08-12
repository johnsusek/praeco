import { defineStore } from 'pinia';
import axios from 'axios';
import { formatIndex, buildMappingFields, buildMappingTypes } from '@/lib/elasticSearchMetadata.js';
import networkError from '../lib/networkError.js';
import { useConfigStore } from './config.js';

function buildObjectFields(fields, prefix, addNonAnalyzedFields) {
  let objectFields = {};

  Object.entries(fields).forEach(([name, field]) => {
    if (field.type) {
      objectFields[`${prefix}.${name}`] = field;

      // there is a field.fields, which contains e.g. keyword or raw suffixes
      // required for aggregation
      if (addNonAnalyzedFields && field.fields) {
        // loop through each field.fields, adding an additional entry
        // for it to our main list of fields
        Object.entries(field.fields).forEach(([suffixFieldName, suffixFieldValue]) => {
          if (suffixFieldValue.type === 'keyword') {
            objectFields[`${prefix}.${name}.${suffixFieldName}`] = field;
          }
        });
      }
    } else if (field.properties) {
      objectFields = {
        ...objectFields,
        ...buildObjectFields(field.properties, `${prefix}.${name}`, addNonAnalyzedFields)
      };
    }
  });

  return objectFields;
}

export const useMetadataStore = defineStore('metadata', {
  state: () => ({
    indices: [],
    mappings: {
      // 'ms-*': {
      //   types: [],
      //   fields: {}
      // }
    }
  }),

  getters: {
    fieldIsNumeric: (state) => (index, field) => {
      let numTypes = ['long', 'integer', 'short', 'byte', 'double', 'float', 'half_float', 'scaled_float'];
      if (numTypes.includes(state.typeForField(index, field))) {
        return true;
      }
    },

    typeForField: (state) => (index, field) => {
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

    textFieldsForCurrentConfig() {
      let fields = {};

      Object.entries(this.fieldsForCurrentConfig).forEach(([name, field]) => {
        if (['text', 'keyword'].includes(field.type)) {
          fields[name] = field;
        }
      });

      return fields;
    },

    numberFieldsForCurrentConfig() {
      let fields = {};

      Object.entries(this.fieldsForCurrentConfig).forEach(([name, field]) => {
        if (
          ['long', 'integer', 'short', 'byte', 'double', 'float', 'half_float', 'scaled_float'].includes(field.type)
        ) {
          fields[name] = field;
        }
      });

      return fields;
    },

    dateFieldsForCurrentConfig() {
      let fields = {};

      Object.entries(this.fieldsForCurrentConfig).forEach(([name, field]) => {
        if (field.type === 'date') {
          fields[name] = field;
        }
      });

      return fields;
    },

    templateFieldsForCurrentConfig() {
      const configStore = useConfigStore();
      let templateFields = [];
      let fields = {};

      // if using "grouped over field", only allow for the grouped field (queryKey)
      if (
        configStore.match.queryKey
        && (configStore.match.type === 'frequency' || configStore.match.type === 'flatline')
      ) {
        fields[configStore.match.queryKey] = configStore.match.queryKey;
      } else {
        fields = this.fieldsForCurrentConfig;
      }

      // Handle JSON fields with dot notation
      Object.entries(fields).forEach(([field, mapping]) => {
        if (mapping.properties) {
          Object.entries(mapping.properties).forEach(([f]) => {
            templateFields.push(`${field}.${f}`);
          });
        } else {
          templateFields.push(field);
        }
      });

      return templateFields;
    },

    fieldsForCurrentConfig() {
      const configStore = useConfigStore();
      let index = configStore.settings.index;
      let mappings = this.mappings[formatIndex(index)];

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

    aggFieldsForCurrentConfig() {
      const configStore = useConfigStore();
      let index = configStore.settings.index;
      let mappings = this.mappings[formatIndex(index)];

      if (!mappings) {
        return {};
      }

      let fields = {};

      if (mappings.fields) {
        Object.entries(mappings.fields).forEach(([name, field]) => {
          if (field.type) {
            fields[name] = field;
            // there is a field.fields, which contains e.g. keyword or raw suffixes
            // required for aggregation
            if (field.fields) {
              // loop through each field.fields, adding an additional entry
              // for it to our main list of fields
              Object.entries(field.fields).forEach(([suffixFieldName, suffixFieldValue]) => {
                if (suffixFieldValue.type === 'keyword') {
                  fields[`${name}.${suffixFieldName}`] = field;
                }
              });
            }
          } else if (field.properties) {
            fields = { ...fields, ...buildObjectFields(field.properties, name, true) };
          }
        });
      }

      return fields;
    },

    typesForCurrentConfig() {
      const configStore = useConfigStore();
      let index = configStore.settings.index;
      let mappings = this.mappings[formatIndex(index)];
      if (mappings) {
        return mappings.types;
      }
      return [];
    }
  },

  actions: {
    fetchedIndices(payload) {
      this.indices = payload;
    },

    fetchedMappings({ mappings, index }) {
      if (!this.mappings[index]) {
        this.mappings[index] = {};
      }

      this.mappings[index].types = buildMappingTypes(mappings);
      this.mappings[index].fields = buildMappingFields(mappings);
    },

    async fetchIndices() {
      if (this.indices.length) {
        return true;
      }

      try {
        let res = await axios.get('/api/indices');
        if (res.data.error) {
          networkError('Error fetching indices.');
        } else {
          this.fetchedIndices(res.data);
          return true;
        }
      } catch (error) {
        networkError(error);
      }
    },

    async fetchMappings(index) {
      if (this.mappings[index]) {
        return true;
      }

      try {
        let res = await axios.get(`/api/mapping/${index}`);
        this.fetchedMappings({ mappings: res.data, index });
        return true;
      } catch {
        return false;
      }
    }
  }
});