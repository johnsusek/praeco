<template>
  <el-form ref="form" :model="config" label-position="top" @submit.native.prevent>
    <br>

    <el-card header="Query" class="tight">
      <el-form-item prop="filter[0].query.query_string.query" style="margin-bottom: 0" required>
        <el-input
          :rows="1"
          v-model="config.filter[0].query.query_string.query"
          class="el-input-readonly"
          disabled
          type="textarea"
          spellcheck="false" />
      </el-form-item>
    </el-card>

    <el-card header="Query builder">
      <vue-query-builder
        v-if="config.__praeco_query_builder.query"
        v-model="config.__praeco_query_builder.query"
        :rules="rules"
        :labels="labels"
        :styled="false" />

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
    </el-card>

    <el-card header="Match type">
      <el-select v-model="config.type" placeholder="Select">
        <el-option key="any" label="Any" value="any" />
        <el-option key="blacklist" label="Blacklist" value="blacklist" />
        <el-option key="whitelist" label="Whitelist" value="whitelist" />
        <el-option key="frequency" label="Frequency" value="frequency" />
      </el-select>

      <label v-if="config.type === 'any'">
        The "any" rule will match everything.
        Every hit that the query returns will generate an alert.
      </label>
      <label v-if="config.type === 'blacklist'">
        The blacklist rule will check a certain field against a
        blacklist, and match if it is in the blacklist.
      </label>
      <label v-if="config.type === 'whitelist'">
        This rule will compare a certain field to a whitelist,
        and match if the list does not contain the term.
      </label>
      <label v-if="config.type === 'frequency'">
        This rule matches when there are at least a certain number of
        events in a given time frame. This may be counted on a per-"query key" basis.
      </label>

      <ConfigTypeBlacklist
        v-if="config.type === 'blacklist'"
        :config="config"
        :fields="fields" />

      <ConfigTypeWhitelist
        v-if="config.type === 'whitelist'"
        :config="config"
        :fields="fields" />

      <ConfigTypeFrequency
        v-if="config.type === 'frequency'"
        :config="config"
        :index="index"
        :fields="fields"
        :types="types"
        :query="config.filter[0].query" />
    </el-card>


    <vue-json-pretty :data="config" />
  </el-form>
</template>

<script>
import Vue from 'vue';
import VueQueryBuilder from 'vue-query-builder';
import debounce from 'debounce';
import { luceneSyntaxFromQueryBuilder } from '../lib/luceneSyntaxBuilder.js';
import ConfigTypeBlacklist from './ConfigTypeBlacklist';
import ConfigTypeWhitelist from './ConfigTypeWhitelist';
import ConfigTypeFrequency from './ConfigTypeFrequency';

export default {
  components: {
    VueQueryBuilder,
    ConfigTypeBlacklist,
    ConfigTypeWhitelist,
    ConfigTypeFrequency
  },
  props: ['prefill', 'fields', 'types', 'queryBuilderQuery', 'action', 'index'],
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
    'config.type': {
      immediate: true,
      handler() {
        if (this.config.type !== 'blacklist') {
          delete this.config.compare_key;
          delete this.config.blacklist;
        }
        if (this.config.type !== 'whitelist') {
          delete this.config.whitelist;
          delete this.config.ignore_null;
        } else if (!this.config.ignore_null) Vue.set(this.config, 'ignore_null', false);
        if (this.config.type !== 'frequency') {
          delete this.config.num_events;
          delete this.config.timeframe;
        } else {
          if (!this.config.num_events) Vue.set(this.config, 'num_events', 1);
          if (!this.config.timeframe) Vue.set(this.config, 'timeframe', { minutes: 5 });
        }
      }
    },
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
    }, 350),

    async validate() {
      try {
        await this.$refs.formFreq.validate();
        await this.$refs.form.validate();
        return this.config;
      } catch (error) {
        return false;
      }
    }
  }
};
</script>
