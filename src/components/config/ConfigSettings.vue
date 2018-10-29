<template>
  <el-form
    ref="form"
    :rules="rules"
    :model="$store.state.config.settings"
    label-position="top"
    @submit.native.prevent>

    <el-alert
      v-if="mappingError"
      :description="mappingError"
      :closable="false"
      title="Get mapping failed. Make sure the index exists."
      type="error"
      show-icon />

    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item v-if="action === 'add'" label="Name" prop="name" required>
          <el-input ref="name" v-model="name" spellcheck="false" autofocus />
          <label>The name of the {{ type }}, must be unique.</label>
        </el-form-item>
        <el-form-item v-else label="Name">
          <el-input v-model="name" disabled />
          <label v-if="!viewOnly">The name of the rule, must be unique.</label>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="Index" prop="index" required>
          <el-autocomplete
            :disabled="viewOnly"
            v-model="index"
            :fetch-suggestions="(qs, cb) => { cb(links); }"
            class="el-input-wide"
            placeholder=""
            @input="getMappingDebounced" />
          <label v-if="!viewOnly">
            e.g. logstash-* or logstash-%Y.%m.%d
            [<a href="https://elastalert.readthedocs.io/en/latest/ruletypes.html#index" target="_blank">?</a>]
          </label>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="Time field" prop="timeField" required>
          <el-select
            v-model="timeField"
            :disabled="viewOnly"
            filterable
            clearable
            placeholder=""
            class="el-select-wide"
          >
            <el-option
              v-for="field in Object.keys(dateFields)"
              :key="field"
              :label="field"
              :value="field" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import debounce from 'debounce';
import { formatIndex } from '@/lib/elasticSearchMetadata.js';

export default {
  props: [
    'prefillPath',
    'action',
    'type',
    'viewOnly'
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
    links() {
      return this.suggestions.map(s => ({ value: s, link: s }));
    },

    dateFields() {
      return this.$store.getters['metadata/dateFieldsForCurrentConfig'];
    },

    name: {
      get() {
        return this.$store.state.config.settings.name;
      },
      set(value) {
        this.$store.commit('config/settings/UPDATE_NAME', value);
      }
    },

    timeField: {
      get() {
        return this.$store.state.config.settings.timeField;
      },
      set(value) {
        this.$store.commit('config/settings/UPDATE_TIME_FIELD', value);
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
        this.$store.commit('config/CLEAR_SAMPLE');
        this.$store.commit('config/query/RESET');
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
      this.index = suggestion;
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
