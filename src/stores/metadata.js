import { defineStore } from 'pinia'
import axios from 'axios'
import { formatIndex, buildMappingFields, buildMappingTypes } from '@/lib/elasticSearchMetadata.js'
import networkError from '../lib/networkError.js'

function buildObjectFields(fields, prefix, addNonAnalyzedFields) {
  let objectFields = {}

  Object.entries(fields).forEach(([name, field]) => {
    if (field.type) {
      objectFields[`${prefix}.${name}`] = field

      // there is a field.fields, which contains e.g. keyword or raw suffixes
      // required for aggregation
      if (addNonAnalyzedFields && field.fields) {
        // loop through each field.fields, adding an additional entry
        // for it to our main list of fields
        Object.entries(field.fields).forEach(([suffixFieldName, suffixFieldValue]) => {
          if (suffixFieldValue.type === 'keyword') {
            objectFields[`${prefix}.${name}.${suffixFieldName}`] = field
          }
        })
      }
    } else if (field.properties) {
      objectFields = {
        ...objectFields,
        ...buildObjectFields(field.properties, `${prefix}.${name}`, addNonAnalyzedFields)
      }
    }
  })

  return objectFields
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
      let numTypes = ['long', 'integer', 'short', 'byte', 'double', 'float', 'half_float', 'scaled_float']
      const typeForField = state.mappings[index]?.fields?.[field]?.type
      return numTypes.includes(typeForField)
    },

    typeForField: (state) => (index, field) => {
      return state.mappings[index]?.fields?.[field]?.type
    },

    suggestedIndices(state) {
      let indices = {}

      state.indices.forEach(item => {
        if (item.includes('elastalert')) return
        let parts = item.split(/-/)
        if (parts[0].startsWith('.')) return
        if (parts.length > 1) {
          indices[`${parts[0]}-*`] = true
        } else {
          indices[parts[0]] = true
        }
      })

      return Object.keys(indices)
    },

    textFieldsForCurrentConfig() {
      let fields = {}

      Object.entries(this.fieldsForCurrentConfig).forEach(([name, field]) => {
        if (['text', 'keyword'].includes(field.type)) {
          fields[name] = field
        }
      })

      return fields
    },

    numberFieldsForCurrentConfig() {
      let fields = {}

      Object.entries(this.fieldsForCurrentConfig).forEach(([name, field]) => {
        if (
          ['long', 'integer', 'short', 'byte', 'double', 'float', 'half_float', 'scaled_float'].includes(field.type)
        ) {
          fields[name] = field
        }
      })

      return fields
    },

    dateFieldsForCurrentConfig() {
      let fields = {}

      Object.entries(this.fieldsForCurrentConfig).forEach(([name, field]) => {
        if (field.type === 'date') {
          fields[name] = field
        }
      })

      return fields
    },

    templateFieldsForCurrentConfig() {
      // This getter will need to be updated when config store is fully converted
      // For now, return empty array to prevent errors
      return []
    },

    fieldsForCurrentConfig() {
      // This getter will need to be updated when config store is fully converted  
      // For now, return empty object to prevent errors
      return {}
    },

    aggFieldsForCurrentConfig() {
      // This getter will need to be updated when config store is fully converted
      // For now, return empty object to prevent errors
      return {}
    },

    typesForCurrentConfig() {
      // This getter will need to be updated when config store is fully converted
      // For now, return empty array to prevent errors
      return []
    }
  },

  actions: {
    setIndices(payload) {
      this.indices = payload
    },

    setMappings({ mappings, index }) {
      if (!this.mappings[index]) {
        this.mappings[index] = {}
      }

      this.mappings[index].types = buildMappingTypes(mappings)
      this.mappings[index].fields = buildMappingFields(mappings)
    },

    async fetchIndices() {
      if (this.indices.length) {
        return true
      }

      try {
        let res = await axios.get('/api/indices')
        if (res.data.error) {
          networkError('Error fetching indices.')
        } else {
          this.setIndices(res.data)
          return true
        }
      } catch (error) {
        networkError(error)
      }
    },

    async fetchMappings(index) {
      if (this.mappings[index]) {
        return true
      }

      try {
        let res = await axios.get(`/api/mapping/${index}`)
        this.setMappings({ mappings: res.data, index })
        return true
      } catch (error) {
        return false
      }
    }
  }
})