<template>
  <el-form ref="form" :rules="rules" :model="config" label-position="top" @submit.native.prevent>
    <p v-if="action === 'add'" >
      Enter a name and choose an index to begin.
      If you are unsure of what index to use, try one of the suggestions.
      On the next step you'll be able to build a query against the data in this index.
    </p>

    <el-form-item label="Enabled" prop="is_enabled">
      <el-switch ref="is_enabled" v-model="config.is_enabled" />
    </el-form-item>

    <el-form-item v-if="action !== 'edit'" label="Name" prop="name" required>
      <el-input ref="name" v-model="config.name" spellcheck="false"/>
    </el-form-item>

    <el-form-item label="Description" prop="description">
      <el-input ref="description" v-model="config.description" spellcheck="false" />
    </el-form-item>

    <el-form-item label="Index" prop="index" required>
      <el-input v-model="config.index" spellcheck="false" />
      <label>
        The index to use, e.g. logstash-* or logstash-%Y.%m.%d
        [<a href="https://elastalert.readthedocs.io/en/latest/ruletypes.html#index" target="_blank">?</a>]
        <br>
        <span v-if="suggestions.length">
          <br>
          Suggestions:
          <span v-for="(suggestion, i) in suggestions" :key="suggestion">
            <el-button type="text" @click="useSuggestion(suggestion)">{{ suggestion }}</el-button>
            <span v-if="i !== suggestions.length - 1">, </span>
          </span>
        </span>
      </label>
    </el-form-item>

    <el-form-item label="Use formatted date">
      <el-switch v-model="config.use_strftime_index" />
      <label>
        Use formatted date for index, when using an index like logstash-%Y.%m.%d
        [<a href="https://elastalert.readthedocs.io/en/latest/ruletypes.html#use-strftime-index" target="_blank">?</a>]
      </label>
    </el-form-item>
  </el-form>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import { logger } from '@/lib/logger.js';

export default {
  props: ['prefill', 'prefillPath', 'prefillType', 'action', 'type'],

  data() {
    return {
      indices: [],
      config: {},
      rules: {
        name: [{ validator: this.validateName }]
      }
    };
  },
  computed: {
    suggestions() {
      let indices = {};
      this.indices.forEach(item => {
        let parts = item.split(/-/);
        if (parts[0].startsWith('.')) return;
        if (parts.length > 1) {
          indices[`${parts[0]}-*`] = true;
        } else {
          indices[parts[0]] = true;
        }
      });
      return Object.keys(indices);
    }
  },
  watch: {
    prefill() {
      this.config = this.prefill;
    }
  },
  async mounted() {
    try {
      let res = await axios.get('/indices');
      this.indices = res.data.sort();
    } catch (error) {
      logger().error(error);
    }
  },
  methods: {
    useSuggestion(suggestion) {
      Vue.set(this.config, 'index', suggestion);
    },
    validateName(rule, value, callback) {
      let path = this.prefillPath || '';

      // If the prefill type is template, and the type is rule, use root for prefillpath
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
    },

    async validate() {
      try {
        await this.$refs.form.validate();
        return this.config;
      } catch (error) {
        return false;
      }
    }
  }
};
</script>
