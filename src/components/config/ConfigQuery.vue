<template>
  <el-form ref="form" :model="config" label-position="top" @submit.native.prevent>
    <br>
    <el-form-item v-show="true" prop="filter[0].query.query_string.query" required>
      <el-input v-model="config.filter[0].query.query_string.query" type="textarea" @input="handleQueryChange" />
    </el-form-item>

    <el-card>
      <div slot="header">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="12">
            Query builder
          </el-col>
          <el-col :span="12" align="right">
            <el-button type="text" @click="helpVisible = !helpVisible">Toggle help</el-button>
          </el-col>
        </el-row>
      </div>

      <div v-if="helpVisible" class="help">
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
          <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-regexp-query.html#regexp-syntax" target="_blank">
            [?]
          </a>
        </el-alert>

        <br>
      </div>

      <vue-query-builder
        ref="vqb"
        :max-depth="2"
        :rules="rules"
        :labels="labels"
        :styled="false"
        @input="vqbInput" />
    </el-card>

    <vue-json-pretty :data="parsedQuery" />
    <vue-json-pretty v-if="$refs.vqb" :data="$refs.vqb.query" />
  </el-form>
</template>

<script>
import Vue from 'vue';
import VueQueryBuilder from 'vue-query-builder';
import debounce from 'debounce';
import parser from 'lucene-query-parser';
import { luceneSyntaxFromQueryBuilder } from '@/lib/luceneSyntaxBuilder.js';


export default {
  components: {
    VueQueryBuilder
  },
  props: ['prefill', 'fields', 'queryBuilderQuery'],
  data() {
    return {
      children: [],
      parsedQuery: {},
      helpVisible: false,
      labels: {
        matchType: 'Match type',
        matchTypeAll: 'All',
        matchTypeAny: 'Any',
        addRule: 'Add term',
        removeRule: '&times;',
        addGroup: 'Add group',
        removeGroup: '&times;',
        textInputPlaceholder: 'value'
      },

      config: {
        __praeco_query_builder: {},
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
    },
  },
  watch: {
    prefill() {
      this.config = this.prefill;
    }
  },
  mounted() {
    this.config = this.prefill;
    this.handleQueryChange(this.config.filter[0].query.query_string.query);
  },
  methods: {
    buildNodesStart(left, operator, right) {
      this.parsedQuery = {
        logicalOperator: operator === 'AND' ? 'All' : 'Any',
        children: []
      };
      this.buildNodes(left, operator, right);

      let listener = this.$refs.vqb.$listeners.input;
      this.$refs.vqb.$off('input');

      this.$refs.vqb.query = this.parsedQuery;

      setTimeout(() => {
        this.$refs.vqb.$on('input', listener);
      }, 100);
    },

    buildNodes(left, operator, right, parent) {
      if (right && right.left && right.operator && right.right) {
        if (right.left.field && right.right.field) {
          let group = {
            type: 'query-builder-group',
            query: {
              logicalOperator: right.operator === 'AND' ? 'All' : 'Any',
              children: []
            }
          };

          this.parsedQuery.children.push(group);
          this.buildNodes(right.left, right.operator, right.right, group.query.children);
        } else {
          this.buildNodes(right.left, right.operator, right.right);
        }
      }

      if (left && left.left && left.operator && left.right) {
        if (left.left.field && left.right.field) {
          let group = {
            type: 'query-builder-group',
            query: {
              logicalOperator: left.operator === 'AND' ? 'All' : 'Any',
              children: []
            }
          };

          this.parsedQuery.children.push(group);
          this.buildNodes(left.left, left.operator, left.right, group.query.children);
        } else {
          this.buildNodes(left.left, left.operator, left.right);
        }
      }

      // Leafs
      if (right && right.term && right.field) {
        let pushTarget = parent || this.parsedQuery.children;
        pushTarget.push({
          type: 'query-builder-rule',
          query: {
            rule: right.field,
            selectedOperator: 'contains',
            selectedOperand: right.field,
            value: right.term
          }
        });
      }

      if (left && left.term && left.field) {
        let pushTarget = parent || this.parsedQuery.children;
        pushTarget.push({
          type: 'query-builder-rule',
          query: {
            rule: left.field,
            selectedOperator: 'contains',
            selectedOperand: left.field,
            value: left.term
          }
        });
      }
    },

    handleQueryChange(query) {
      try {
        let parsed = parser.parse(query);
        if (parsed && parsed.left && parsed.operator && parsed.right) {
          this.buildNodesStart(parsed.left, parsed.operator, parsed.right);
          this.preview();
        }
      } catch (error) {}
    },

    vqbInput(input) {
      console.log('INPUT FIRED VQB', input);
      if (input) {
        this.config.filter[0].query.query_string.query = luceneSyntaxFromQueryBuilder(input);
        this.preview();
      }
    },

    preview: debounce(function() {
      this.$emit('preview', this.config);
    }, 500),

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

<style scoped>
.help {
  background: #f5f7fa;
  margin: -20px -20px 0;
}
</style>
