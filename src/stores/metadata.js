import { defineStore } from 'pinia';
import axios from 'axios';
import { formatIndex, buildMappingFields, buildMappingTypes } from '@/lib/elasticSearchMetadata.js';
import networkError from '../lib/networkError.js';

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
    mappings: {}
  }),

  getters: {
    fieldIsNumeric: (state) => (index, field) => {
      let numTypes = ['long', 'integer', 'short', 'byte', 'double', 'float', 'half_float', 'scaled_float'];
      const fieldType = state.typeForField(index, field);
      if (numTypes.includes(fieldType)) {
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

    textFieldsForCurrentConfig: (state) => (configIndex) => {
      let fields = {};
      const currentFields = state.fieldsForCurrentConfig(configIndex);

      Object.entries(currentFields).forEach(([name, field]) => {
        if (['text', 'keyword'].includes(field.type)) {
          fields[name] = field;
        }
      });

      return fields;
    },

    numberFieldsForCurrentConfig: (state) => (configIndex) => {
      let fields = {};
      const currentFields = state.fieldsForCurrentConfig(configIndex);

      Object.entries(currentFields).forEach(([name, field]) => {
        if (
          ['long', 'integer', 'short', 'byte', 'double', 'float', 'half_float', 'scaled_float'].includes(field.type)
        ) {
          fields[name] = field;
        }
      });

      return fields;
    },

    dateFieldsForCurrentConfig: (state) => (configIndex) => {
      let fields = {};
      const currentFields = state.fieldsForCurrentConfig(configIndex);

      Object.entries(currentFields).forEach(([name, field]) => {
        if (field.type === 'date') {
          fields[name] = field;
        }
      });

      return fields;
    },

    templateFieldsForCurrentConfig: (state) => (configIndex, matchConfig) => {
      let templateFields = [];
      let fields = {};

      // if using "grouped over field", only allow for the grouped field (queryKey)
      if (
        matchConfig?.queryKey
        && (matchConfig.type === 'frequency' || matchConfig.type === 'flatline')
      ) {
        fields[matchConfig.queryKey] = matchConfig.queryKey;
      } else {
        fields = state.fieldsForCurrentConfig(configIndex);
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

    fieldsForCurrentConfig: (state) => (configIndex) => {
      let index = formatIndex(configIndex);
      let mappings = state.mappings[index];

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

    aggFieldsForCurrentConfig: (state) => (configIndex) => {
      let index = formatIndex(configIndex);
      let mappings = state.mappings[index];

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

    typesForCurrentConfig: (state) => (configIndex) => {
      let index = formatIndex(configIndex);
      let mappings = state.mappings[index];
      if (mappings) {
        return mappings.types;
      }
      return [];
    }
  },

  actions: {
    async fetchIndices() {
      if (this.indices.length) {
        return true;
      }

      try {
        let res = await axios.get('/api/indices');
        if (res.data.error) {
          networkError('Error fetching indices.');
        } else {
          this.indices = res.data;
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
        if (!this.mappings[index]) {
          this.mappings[index] = {};
        }
        this.mappings[index].types = buildMappingTypes(res.data);
        this.mappings[index].fields = buildMappingFields(res.data);
        return true;
      } catch (error) {
        return false;
      }
    }
  }
});
