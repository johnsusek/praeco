<template>
  <el-form ref="form" :model="config" label-position="top" @submit.native.prevent>
    <br>

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
          <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-regexp-query.html#regexp-syntax" target="_blank">[?]</a>
        </el-alert>

        <br>
      </div>

      <vue-query-builder
        v-if="config.__praeco_query_builder.query"
        v-model="config.__praeco_query_builder.query"
        :rules="rules"
        :labels="labels"
        :styled="false" />
    </el-card>

    <!-- <vue-json-pretty :data="config" /> -->
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
  props: ['prefill', 'fields', 'queryBuilderQuery'],
  data() {
    return {
      helpVisible: false,
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
    }
  },
  watch: {
    'config.__praeco_query_builder': {
      immediate: true,
      deep: true,
      handler() {
        let query = this.config.__praeco_query_builder.query;
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
    this.config = this.prefill;

    if (this.queryBuilderQuery.query) {
      Vue.set(this.config, '__praeco_query_builder', this.queryBuilderQuery);
    } else {
      Vue.set(this.config, '__praeco_query_builder', {
        query: {
          logicalOperator: 'All',
          children: []
        }
      });
    }
  },
  methods: {
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
