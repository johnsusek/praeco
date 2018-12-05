<template>
  <el-form ref="form" label-position="top" @submit.native.prevent>

    <el-tabs v-model="queryType" type="card" @tab-click="changeQueryType">
      <el-tab-pane label="Builder" name="tree">
        <el-popover v-model="popFilterVisible">
          <span slot="reference" class="pop-trigger">
            <span v-if="!queryTree.children.length">NEW FILTER</span>
            <span else>{{ queryString }}</span>
          </span>
          <div>
            <el-row :gutter="30" :class="{ 'empty': !queryTree.children.length }">
              <el-col :span="24">
                <el-form-item class="el-form-item-tight">
                  <vue-query-builder
                    v-if="rules.length"
                    v-model="queryTree"
                    :rules="rules"
                    :labels="labels"
                    :styled="false" />
                </el-form-item>
                <el-form-item v-if="!queryTree.children.length">
                  <label>
                    To get started, select a term from the dropdown menu and click the "Add filter" button.
                  </label>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-popover>
      </el-tab-pane>

      <el-tab-pane label="Manual" name="manual">
        <el-input
          ref="manual"
          v-model="manual"
          placeholder="Search... (e.g. status:200 AND extension:PL)"
          size="medium" />
      </el-tab-pane>
    </el-tabs>

    <EventTable v-if="queryString" :height="eventTableHeight" class="m-n-lg" />
  </el-form>
</template>

<script>
import VueQueryBuilder from 'vue-query-builder';

export default {
  components: {
    VueQueryBuilder
  },

  data() {
    return {
      popFilterVisible: false,
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
    eventTableHeight() {
      return document.body.clientHeight - 145;
    },

    queryType: {
      get() {
        return this.$store.state.config.query.type;
      },
      set(value) {
        this.$store.commit('config/query/UPDATE_TYPE', value);
      }
    },

    manual: {
      get() {
        return this.$store.state.config.query.manual;
      },
      set(value) {
        this.$store.commit('config/query/UPDATE_MANUAL', value);
      }
    },

    queryString() {
      return this.$store.getters['config/query/queryString'];
    },

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
        let operators = [
          'contains',
          'does not contain',
          'is empty',
          'is not empty',
          'regex'
        ];

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
    changeQueryType() {
      if (this.queryType === 'manual') {
        this.$nextTick(() => {
          this.$refs.manual.focus();
        });
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

.el-row.empty
  .vue-query-builder
  > .vqb-group
  > .vqb-group-body
  > .rule-actions {
  position: static;
}

.el-row.empty .vue-query-builder {
  padding-bottom: 0;
}

.is-fullscreen .el-dialog__body {
  padding-bottom: 0;
}
</style>

<style scoped>
.el-form {
  margin-top: -2ex;
}

.el-tabs .el-input {
  font-size: 16px;
  font-weight: bold;
  font-family: monospace;
}
</style>
