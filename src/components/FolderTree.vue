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
    @input="(val) => $emit('update:modelValue', val)" />
</template>

<script>
import * as changeCase from 'change-case';
import { loadChildrenOptions } from '@/lib/tree';

export default {
  // props: ['type'],
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      options: [
        {
          id: `_${this.type}`,
          label: changeCase.capitalCase(this.type),
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
