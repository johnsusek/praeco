<template>
  <el-form ref="form" label-position="top" @submit.native.prevent>
    <el-row :gutter="30" :class="{ 'empty': !queryTree.children.length }">
      <el-col :span="12" class="scroll-pane">
        <el-form-item class="el-form-item-tight">
          <vue-query-builder
            v-if="rules.length"
            v-model="queryTree"
            :rules="rules"
            :labels="labels"
            :styled="false"
            @input="queryChanged" />
        </el-form-item>
        <el-form-item v-if="!queryTree.children.length">
          <label>
            To get started, select a term from the dropdown menu and click the "Add filter" button.
          </label>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <!-- <el-button
          v-if="!sampling"
          type="primary"
          plain
          class="m-n-xs"
          @click="sample">
          Sample
        </el-button>
        <el-button
          v-if="sampling"
          disabled
          type="primary"
          plain
          class="m-n-xs"
          @click="sample">
          Sampling...
        </el-button>
        <label>Preview a sample result matching your filters.</label> -->

        <el-form-item v-if="$store.state.config.sampleResult" label="Sample result" class="scroll-pane sample-result">
          <el-table
            :data="Object.entries($store.state.config.sampleResult).sort()">
            <el-table-column label="Field" prop="0" width="160" />
            <el-table-column label="Value" prop="1">
              <template slot-scope="scope">
                <vue-json-pretty
                  v-if="typeof scope.row[1] === 'object'"
                  :data="scope.row[1]" :deep="0" />
                <template v-else>{{ scope.row[1] }}</template>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import debounce from 'debounce';
import VueQueryBuilder from 'vue-query-builder';

export default {
  components: {
    VueQueryBuilder
  },

  data() {
    return {
      sampling: false,
      labels: {
        matchType: ' of the following conditions are met:',
        matchTypeAll: 'all',
        matchTypeAny: 'any',
        addRule: 'Add filter',
        removeRule: '&times;',
        addGroup: 'Add group',
        removeGroup: '&times;',
        textInputPlaceholder: 'value'
      }
    };
  },

  computed: {
    queryTree: {
      get() {
        return this.$store.state.config.query.tree;
      },
      set(value) {
        this.$store.commit('config/query/UPDATE_TREE', value);
      }
    },

    fields() {
      return this.$store.getters['metadata/fieldsForCurrentConfig'] || {};
    },

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

  methods: {
    async sample() {
      this.sampling = true;
      await this.$store.dispatch('config/sample');
      this.sampling = false;
    },

    sampleDebounced: debounce(async function() {
      this.sampling = true;
      await this.$store.dispatch('config/sample');
      this.sampling = false;
    }, 750),

    queryChanged() {
      let queryTree = this.queryTree;
      if (queryTree) {
        this.$store.commit('config/query/UPDATE_TREE', queryTree);
        this.sampleDebounced();
      }
    }
  }
};
</script>

<style>
.el-form-item-tight {
  margin-bottom: 0;
}

.el-row.empty .vue-query-builder > .vqb-group > .vqb-group-heading {
  display: none;
}

.el-row.empty .vue-query-builder > .vqb-group > .vqb-group-body > .rule-actions {
  position: static;
}

.el-row.empty .vue-query-builder {
  padding-bottom: 0;
}

.scroll-pane {
  max-height: 500px;
  overflow: auto;
}

.sample-result,
.sample-result * {
  background: #f9f9f9 !important;
}

.sample-result > .el-form-item__label {
  padding-left: 10px !important;
}
</style>
