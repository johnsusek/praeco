<template>
  <el-form
    ref="form"
    :rules="rules"
    :model="$store.state.config.settings"
    label-position="top"
    @submit.native.prevent>

    <el-form-item v-if="action !== 'edit'" label="Name" prop="name" required>
      <el-input ref="name" v-model="name" spellcheck="false" />
    </el-form-item>

    <el-form-item label="Description" prop="description">
      <el-input ref="description" v-model="description" spellcheck="false" />
    </el-form-item>

    <el-form-item label="Index" prop="index" required>
      <el-input v-model="index" spellcheck="false" @input="getMappingDebounced" />
      <label>
        The index that contains data you want to be alerted on, e.g. logstash-* or logstash-%Y.%m.%d
        [<a href="https://elastalert.readthedocs.io/en/latest/ruletypes.html#index" target="_blank">?</a>]
        <br>
        <span v-if="suggestions.length">
          <br>
          Suggestions:
          <span v-for="(suggestion, i) in suggestions" :key="suggestion">
            <el-button type="text" @click="useSuggestion(suggestion)">{{ suggestion }}</el-button>
            <template v-if="i !== suggestions.length - 1">, </template>
          </span>
        </span>
      </label>
    </el-form-item>

    <el-alert
      v-if="mappingError"
      :description="mappingError"
      :closable="false"
      title="Get mapping failed. Make sure the index exists."
      type="error"
      show-icon />
  </el-form>
</template>

<script>
import debounce from 'debounce';
import { formatIndex } from '@/lib/elasticSearchMetadata.js';

export default {
  props: [
    'prefillPath',
    'action',
    'type'
  ],

  data() {
    return {
      mappingError: '',
      rules: {
        name: [{
          validator: this.validateName
        }]
      }
    };
  },

  computed: {
    name: {
      get() {
        return this.$store.state.config.settings.name;
      },
      set(value) {
        this.$store.commit('config/settings/UPDATE_NAME', value);
      }
    },

    description: {
      get() {
        return this.$store.state.config.settings.description;
      },
      set(value) {
        this.$store.commit('config/settings/UPDATE_DESCRIPTION', value);
      }
    },

    index: {
      get() {
        return this.$store.state.config.settings.index;
      },
      set(value) {
        this.$store.commit('config/settings/UPDATE_INDEX', value);
      }
    },

    suggestions() {
      return this.$store.getters['metadata/suggestedIndices'];
    }
  },

  mounted() {
    // Get the indices needed to build the suggestions list
    this.$store.dispatch('metadata/fetchIndices');

    // Automatically get the mapping on start
    if (this.index) {
      this.$store.commit('config/settings/UPDATE_INDEX', this.index);
      this.getMapping();
    }
  },

  methods: {
    getMappingDebounced: debounce(async function() {
      this.getMapping();
    }, 1000),

    async getMapping() {
      this.mappingError = '';

      let fetched = await this.$store.dispatch('metadata/fetchMappings', formatIndex(this.index));

      if (!fetched) {
        this.mappingError = 'Could not fetch mappings.';
        return false;
      }

      return true;
    },

    useSuggestion(suggestion) {
      this.$store.commit('config/settings/UPDATE_INDEX', suggestion);
      this.getMapping();
    },

    validateName(rule, value, callback) {
      let configs = Object.keys(this.$store.state.configs[`${this.type}s`]);
      configs = configs.map(c => c.split('/').pop());

      if (configs.includes(this.$store.state.config.settings.name)) {
        callback(new Error(`A ${this.type} by that name already exists`));
      } else {
        callback();
      }
    }
  }
};
</script>
