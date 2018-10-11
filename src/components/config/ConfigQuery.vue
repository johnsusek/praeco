<template>
  <el-form ref="form" :model="form" label-position="top" @submit.native.prevent>
    <el-form-item>
      <vue-query-builder
        v-if="form.queryTree"
        v-model="form.queryTree"
        :rules="rules"
        :labels="labels"
        :styled="false"
        @input="queryChanged" />
      <label>
        To get started, select a term from the dropdown menu and click the "+ Add" button.
        Once you have some filtered results, you can choose criteria for being alerted on them.
      </label>
    </el-form-item>
  </el-form>
</template>

<script>
import Vue from 'vue';
import VueQueryBuilder from 'vue-query-builder';
import { luceneSyntaxFromQueryBuilder } from '@/lib/luceneSyntaxBuilder.js';
import { validateForm } from '@/mixins/validateForm';

export default {
  components: {
    VueQueryBuilder
  },

  mixins: [validateForm],

  props: ['fields', 'queryTree'],

  data() {
    return {
      labels: {
        matchType: ' of the following conditions are met:',
        matchTypeAll: 'all',
        matchTypeAny: 'any',
        addRule: '&plus; Add',
        removeRule: '&times;',
        addGroup: 'Add group',
        removeGroup: '&times;',
        textInputPlaceholder: 'value'
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

  mounted() {
    if (this.queryTree) {
      Vue.set(this.form, 'queryTree', this.queryTree);
    } else {
      Vue.set(this.form, 'queryTree', {
        query: {
          logicalOperator: 'all',
          children: []
        }
      });
    }
  },

  methods: {
    queryChanged() {
      let queryTree = this.form.queryTree;
      if (queryTree) {
        this.form.queryString = luceneSyntaxFromQueryBuilder(queryTree);
      }
    }
  }
};
</script>
