<template>
  <el-tree-select
    ref="tree"
    :model-value="modelValue"
    :data="options"
    :multiple="false"
    :clearable="false"
    :filterable="true"
    :lazy="true"
    :load="loadOptions"
    :props="treeProps"
    :expand-on-click-node="false"
    class="folders-only"
    placeholder="Filter..."
    @update:model-value="(val) => $emit('update:modelValue', val)" />
</template>

<script>
import { capitalCase } from 'change-case';
import { loadChildrenOptions } from '@/lib/tree';

export default {
  props: ['type', 'modelValue'],
  emits: ['update:modelValue'],
  data() {
    return {
      options: [
        {
          value: `_${this.type}`,
          label: capitalCase(this.type),
          children: []
        }
      ],
      treeProps: {
        children: 'children',
        label: 'label',
        value: 'value',
        isLeaf: 'isLeaf'
      }
    };
  },
  methods: {
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
      await loadChildrenOptions(context, true);
    }
  }
};
</script>

<style>
.folders-only .el-tree-node__expand-icon {
  display: none;
}
</style>
