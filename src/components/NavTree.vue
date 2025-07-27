<template>
  <el-tree-select
    ref="tree"
    v-model="value"
    :data="options"
    :multiple="false"
    :clearable="false"
    :filterable="true"
    :lazy="true"
    :load="loadOptions"
    :props="treeProps"
    :expand-on-click-node="false"
    placeholder="Filter..."
    @change="handleSelect"
    @node-click="handleNodeClick">
    <template #default="{ node, data }">
      <span class="custom-tree-node">
        <span v-if="data.children !== undefined">
          <Icon :icon="node.expanded ? 'folder-open' : 'folder'" />
        </span>
        {{ data.label }}
      </span>
    </template>
  </el-tree-select>
</template>

<script>
import { nextTick } from 'vue';
import { loadChildrenOptions } from '@/lib/tree';

export default {
  data() {
    return {
      expanded: [],
      value: null,
      options: [],
      treeProps: {
        children: 'children',
        label: 'label',
        value: 'value',
        isLeaf: 'isLeaf'
      }
    };
  },
  watch: {
    $route: {
      initial: true,
      handler(to) {
        if (to.query.refreshTree !== undefined) {
          // TODO: addthis.$route.path to expanded so current folder
          // and its parent
          // is always expanded on load
          this.resetTree();
          this.loadExpanded();
        }
      }
    }
  },
  mounted() {
    this.resetTree();
    this.expanded = JSON.parse(localStorage.getItem('expandedNavTreeKeys')) || [];
    this.loadExpanded();
  },
  methods: {
    resetTree() {
      this.options = [
        {
          value: '_rules',
          label: 'Rules',
          children: []
        },
        {
          value: '_templates',
          label: 'Templates',
          children: []
        },
        {
          value: '_errors',
          label: 'Errors',
          isLeaf: true
        },
        {
          value: '_queries',
          label: 'Queries',
          isLeaf: true
        },
        {
          value: '_silences',
          label: 'Silences',
          isLeaf: true
        }
      ];
    },
    loadExpanded() {
      // Element Plus TreeSelect API is different, we'll need to adapt this
      // For now, skip the complex traversal logic and just set initial selection
      nextTick(() => {
        // TODO: Implement Element Plus specific tree expansion logic
        console.log('loadExpanded called - needs Element Plus specific implementation');
      });
    },
    saveExpanded() {
      // Element Plus TreeSelect API is different
      // For now, simplified version
      localStorage.setItem('expandedNavTreeKeys', JSON.stringify(this.expanded));
    },
    handleNodeClick() {
      // Handle node click for Element Plus
      this.saveExpanded();
    },
    handleSelect(value) {
      // Find the selected node data
      const findNode = (nodes, targetValue) => {
        for (const node of nodes) {
          if (node.value === targetValue) return node;
          if (node.children) {
            const found = findNode(node.children, targetValue);
            if (found) return found;
          }
        }
        return null;
      };
      
      const node = findNode(this.options, value);
      if (!node) return;

      // Convert value back to id for compatibility
      const nodeWithId = { ...node, id: node.value };

      if (!node.children || node.children.length === 0) {
        if (nodeWithId.id === '_errors') {
          this.$router.push('/errors');
        } else if (nodeWithId.id === '_queries') {
          this.$router.push('/queries');
        } else if (nodeWithId.id === '_silences') {
          this.$router.push('/silences');
        } else if (nodeWithId.isTemplate) {
          this.$router.push({
            name: 'templateview',
            params: { id: nodeWithId.id }
          }).catch(() => {});
        } else {
          this.$router.push({
            name: 'ruleview',
            params: { id: nodeWithId.id }
          }).catch(() => {});
        }
      } else if (nodeWithId.isDirectory) {
        this.$router.push({
          name: 'folder',
          params: {
            type: nodeWithId.isRule ? 'rules' : 'templates',
            path: nodeWithId.id
          }
        }).catch(() => {});
      } else if (nodeWithId.id === '_templates') {
        this.$router.push('/templates').catch(() => {});
      } else if (nodeWithId.id === '_rules') {
        this.$router.push('/rules').catch(() => {});
      }
    },
    async loadOptions(node, resolve) {
      // Convert Element Plus load context to vue3-treeselect format
      const context = {
        action: 'LOAD_CHILDREN_OPTIONS',
        parentNode: {
          id: node.value,
          ...node
        },
        callback: () => resolve(node.children || [])
      };
      await loadChildrenOptions(context);
      this.loadExpanded();
    }
  }
};
</script>
