<template>
  <el-form ref="form" :rules="rules" :model="form" label-position="top" @submit.native.prevent>
    <el-form-item v-if="action !== 'edit'" label="Name" prop="name" required>
      <el-input ref="name" v-model="form.name" spellcheck="false"/>
    </el-form-item>

    <el-form-item label="Description" prop="description">
      <el-input ref="description" v-model="form.description" spellcheck="false" />
    </el-form-item>

    <el-form-item label="Index" prop="index" required>
      <el-input v-model="form.index" spellcheck="false" @input="updateIndex" />
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
      v-if="mappingLoading"
      :closable="false"
      class="el-alert-loading"
      title="Getting fields..."
      type="info">
      <i class="el-icon-loading" />
    </el-alert>

    <el-alert
      v-if="mappingError"
      :description="mappingError"
      :closable="false"
      title="Get mapping failed. Make sure the index exists."
      type="error"
      show-icon />

    <el-alert
      v-if="mappingLoaded"
      :closable="false"
      title="Got field mapping."
      type="success"
      show-icon />
  </el-form>
</template>

<script>
import Vue from 'vue';
import debounce from 'debounce';
import { formatIndex } from '@/lib/elasticSearchMetadata.js';
import { validateForm } from '@/mixins/validateForm';

export default {
  mixins: [validateForm],

  props: [
    'index',
    'description',
    'name',
    'prefillPath',
    'prefillType',
    'action',
    'type'
  ],

  data() {
    return {
      mappingError: '',
      mappingLoaded: null,
      mappingLoading: false,

      rules: {
        name: [{
          validator: this.validateName
        }]
      }
    };
  },

  computed: {
    suggestions() {
      return this.$store.getters['metadata/suggestedIndices'];
    },

    formattedIndex() {
      return formatIndex(this.form.index);
    }
  },

  async mounted() {
    this.$store.dispatch('metadata/fetchIndices');

    if (this.name) {
      Vue.set(this.form, 'name', this.name);
    }

    if (this.description) {
      Vue.set(this.form, 'description', this.description);
    }

    if (this.index) {
      Vue.set(this.form, 'index', this.index);
    }

    if (this.formattedIndex) {
      this.getMapping();
    }

    this.updateIndex(this.form.index);
  },

  methods: {
    getMappingDebounced: debounce(async function() {
      this.getMapping();
    }, 1000),

    async getMapping() {
      this.mappingLoading = true;
      this.mappingLoaded = false;
      this.mappingError = '';

      let fetched = await this.$store.dispatch('metadata/fetchMappings', this.formattedIndex);

      if (!fetched) {
        this.mappingLoading = false;
        this.mappingError = 'Could not fetch mappings.';
        return false;
      }

      this.mappingLoading = false;
      this.mappingLoaded = true;
      return true;
    },

    updateIndex(index) {
      if (index.includes('%Y') || index.includes('%m') || index.includes('%d')) {
        Vue.set(this.form, 'strftime', true);
      } else {
        Vue.set(this.form, 'strftime', false);
      }

      this.getMappingDebounced();
    },

    useSuggestion(suggestion) {
      Vue.set(this.form, 'index', suggestion);
      this.getMapping();
    },

    validateName(rule, value, callback) {
      // If the prefill type is template, and the type is rule, use root for prefillpath
      let path = this.prefillPath || '';

      if (this.type === 'rule' && this.prefillType === 'template') {
        path = '';
      }

      path = path.split('/');
      path.pop();
      path.push(value);
      path = path.join('/');
      let configs = Object.keys(this.$store.state.configs[`${this.type}s`]);

      if (configs.includes(path)) {
        callback(new Error(`A ${this.type} by that name already exists`));
      } else {
        callback();
      }
    }
  }
};
</script>
