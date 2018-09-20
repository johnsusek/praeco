<template>
  <el-form ref="form" :model="config" label-position="top" @submit.native.prevent>
    <el-form-item label="Query" prop="filter[0].query.query_string.query" required>
      <el-input
        :rows="2"
        v-model="config.filter[0].query.query_string.query"
        class="el-input-readonly"
        disabled
        type="textarea"
        spellcheck="false" />
    </el-form-item>

    <el-form-item label="Query builder">
      <vue-query-builder
        v-if="config.queryBuilder.query"
        v-model="config.queryBuilder.query"
        :rules="rules"
        :labels="labels"
        :styled="false" />
    </el-form-item>
    <br>

    <el-alert
      :closable="false"
      title="Wildcards"
      type="info"
      show-icon>
      <br>
      Wildcard searches can be run on
      'contains' and 'does not contain' rules,
      using <strong>?</strong> to replace a single character,
      and <strong>*</strong> to replace zero or more characters.
    </el-alert>

    <el-alert
      :closable="false"
      title="Regexes"
      type="info"
      show-icon>
      <br>
      Lucene regular expression engine is not Perl-compatible
      but supports a smaller range of operators.
      <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-regexp-query.html#regexp-syntax" target="_blank">[?]</a>
    </el-alert>
  </el-form>
</template>

<script>
import Vue from 'vue';
import VueQueryBuilder from 'vue-query-builder';
import debounce from 'debounce';
import { luceneSyntaxFromQueryBuilder } from '../lib/luceneSyntaxBuilder.js';

export default {
  components: {
    VueQueryBuilder
  },
  props: ['prefill', 'fields', 'queryBuilderQuery', 'action'],
  data() {
    return {
      labels: {
        matchType: 'Match type',
        matchTypeAll: 'All',
        matchTypeAny: 'Any',
        addRule: 'Add rule',
        removeRule: '&times;',
        addGroup: 'Add group',
        removeGroup: '&times;',
        textInputPlaceholder: 'value'
      },
      config: {
        queryBuilder: {},
        filter: [
          {
            query: {
              query_string: {
                query: ''
              }
            }
          }
        ]
      }
    };
  },
  computed: {
    rules() {
      let rules = [];

      Object.entries(this.fields).forEach(([k, v]) => {
        let operators = ['contains', 'does not contain', 'is empty', 'is not empty', 'regex'];

        if (v.type === 'long') {
          operators = operators.concat(['less than', 'greater than']);
        }

        rules.push({
          operators,
          type: 'text',
          id: k,
          label: k
        });
      });

      rules = rules.sort((a, b) => {
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
        return 0;
      });

      return rules;
    }
  },
  watch: {
    'config.queryBuilder': {
      immediate: true,
      deep: true,
      handler() {
        let query = this.config.queryBuilder.query;
        if (query) {
          this.config.filter[0].query.query_string.query = luceneSyntaxFromQueryBuilder(query);
          this.preview();
        }
      }
    },
    prefill() {
      this.config = this.prefill;
    }
  },
  mounted() {
    if (this.queryBuilderQuery.query) {
      Vue.set(this.config, 'queryBuilder', this.queryBuilderQuery);
    } else {
      Vue.set(this.config, 'queryBuilder', { query: { logicalOperator: 'All' } });
    }
  },
  methods: {
    preview: debounce(function() {
      this.$emit('preview', this.config);
    }, 350),
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

<style lang="scss">
.el-input-readonly.el-textarea.is-disabled .el-textarea__inner {
  color: #656565;
  background: #eee;
  border: none;
  resize: none;
  height: auto;
  min-height: auto;
  font-weight: 600;
  font-family: monospace;
}

.vue-query-builder {
  .vqb-group-heading {
    background: #f4f4f5;
    padding: 10px;
  }

  .vqb-group-body .vqb-group-heading {
    border-radius: 0 4px 0 0;
  }

  .vqb-group-body {
    padding: 20px 10px 10px;
  }

  .vqb-group .vqb-group {
    border-radius: 4px;
    border: 1px solid #bbb;
  }

  .vqb-group .vqb-group .vqb-group-body {
    padding-bottom: 0;
  }

  .vqb-group .vqb-group {
    border-left: 3px solid #18cc2e;
    margin-bottom: 10px;
  }

  .vqb-group .vqb-group:last-child {
    margin-bottom: 0;
  }

  .vqb-group .vqb-group .vqb-group:last-child {
    margin-bottom: 10px;
  }

  .rule-actions {
    margin-bottom: 20px;

    select {
      margin-right: 10px;
    }

    button {
      margin-right: 10px;
    }
  }

  .vqb-rule {
    background: #f4f4f5;
    padding: 10px;
    margin: 10px 0;
    border-radius: 4px;
    border: 1px solid #bbb;
    border-left: 3px solid #189acc;

    > div {
      position: relative;
      padding-right: 21px;
    }

    label {
      margin-right: 10px;
      font-weight: 600;
    }

    select {
      margin-right: 10px;
    }

    input {
      border: 1px solid #ddd;
      border-radius: 3px;
      padding: 4px;
    }

    button {
      margin-top: 3px;
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  .match-type-container {
    > div {
      display: inline-block;
    }

    label {
      margin-right: 10px;
    }

    button {
      float: right;
    }
  }

  select {
    max-width: 100%;
  }
}
</style>
