<template>
  <treeselect
    ref="tree"
    :multiple="false"
    :clearable="false"
    :searchable="true"
    :always-open="true"
    :default-expand-level="Infinity"
    :max-height="99999"
    :load-options="loadOptions"
    :options="options"
    class="folders-only"
    placeholder="Filter..."
    @input="(val) => $emit('input', val)" />
</template>

<script>
import { loadChildrenOptions } from '@/lib/tree';
import changeCase from 'change-case';

export default {
  props: ['type'],
  data() {
    return {
      options: [
        {
          id: `_${this.type}`,
          label: changeCase.titleCase(this.type),
          children: null
        }
      ]
    };
  },
  methods: {
    async loadOptions(context) {
      await loadChildrenOptions(context, true);
    }
  }
};
</script>

<style>
.folders-only .vue-treeselect__option-arrow-container {
  display: none;
}
</style>

