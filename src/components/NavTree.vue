<template>
  <div>
    <treeselect
      ref="tree"
      v-model="value"
      :multiple="false"
      :clearable="false"
      :searchable="true"
      :always-open="true"
      :max-height="99999"
      :load-options="loadOptions"
      :options="options"
      placeholder="Filter..."
      no-children-text="No rules"
      @select="handleSelect"
      @click.native="handleClick" />
  </div>
</template>

<script>
import Vue from 'vue';
import Treeselect from '@riophae/vue-treeselect';
import axios from 'axios';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

function buildRuleNodes(rules, parentNode) {
  return rules.sort().map(rule => ({
    id: `${parentNode ? `${parentNode.id}/` : ''}${rule}`,
    label: rule,
    isRule: true
  }));
}

function buildTemplateNodes(rules, parentNode) {
  return rules.sort().map(rule => ({
    id: `${parentNode ? `${parentNode.id}/` : ''}${rule}`,
    label: rule,
    isTemplate: true
  }));
}

function buildDirectoryNodes(directories, parentNode) {
  return directories.sort().map(directory => ({
    id: `${parentNode ? `${parentNode.id}/` : ''}${directory}`,
    label: directory,
    isDirectory: true,
    children: null
  }));
}

function triggerMouseEvent(node, eventType) {
  let clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
}

function expandNode(id) {
  let targetNode = document.querySelector(`[data-id="${id}"] .vue-treeselect__option-arrow-container`);
  if (targetNode) {
    triggerMouseEvent(targetNode, 'mousedown');
  }
}

function selectNode(id) {
  let targetNode = document.querySelector(`[data-id="${id}"] .vue-treeselect__label-container`);
  if (targetNode) {
    triggerMouseEvent(targetNode, 'mouseover');
    triggerMouseEvent(targetNode, 'mousedown');
    triggerMouseEvent(targetNode, 'mouseup');
    triggerMouseEvent(targetNode, 'click');
  }
}

export default {
  components: { Treeselect },
  data() {
    return {
      expanded: [],
      value: null,
      options: [
        {
          id: '_rules',
          label: 'Rules',
          children: null
        },
        {
          id: '_templates',
          label: 'Templates',
          children: null
        },
        {
          id: '_errors',
          label: 'Errors'
        }
      ]
    };
  },
  mounted() {
    this.expanded = JSON.parse(localStorage.getItem('expandedNavTreeKeys')) || [];
    this.loadExpanded();
  },
  methods: {
    loadExpanded() {
      Vue.nextTick(() => {
        this.$refs.tree.traverseAllNodesByIndex(node => {
          if (node.isBranch && !node.isExpanded && this.expanded.includes(node.id)) {
            expandNode(node.id);
          }

          if (node.raw.isRule) {
            if (`/rules/${node.id}` === decodeURIComponent(this.$route.path)) {
              selectNode(node.id);
            }
          } else if (node.raw.isTemplate) {
            if (`/templates/${node.id}` === decodeURIComponent(this.$route.path)) {
              selectNode(node.id);
            }
          } else if (node.id === '_errors') {
            if (decodeURIComponent(this.$route.path) === '/errors') {
              selectNode(node.id);
            }
          }
        });
      });
    },
    saveExpanded() {
      this.expanded = [];

      this.$refs.tree.traverseAllNodesByIndex(node => {
        if (node.isBranch && node.isExpanded) {
          this.expanded.push(node.id);
        }
      });
      localStorage.setItem('expandedNavTreeKeys', JSON.stringify(this.expanded));
    },
    handleClick() {
      this.saveExpanded();
    },
    handleSelect(node, two) {
      this.saveExpanded();
      if (node.children === undefined) {
        if (node.id === '_errors') {
          this.$router.replace({ name: 'errors' });
        } else if (node.isTemplate) {
          this.$router.replace({
            name: 'templateview',
            params: { id: node.id }
          });
        } else {
          this.$router.replace({
            name: 'ruleview',
            params: { id: node.id }
          });
        }
      }
    },
    async loadOptions({ action, parentNode, callback }) {
      if (action === 'LOAD_CHILDREN_OPTIONS') {
        if (parentNode.id === '_rules') {
          // Load rules
          let res = await axios.get('/rules');
          let rules = buildRuleNodes(res.data.rules);
          let directories = buildDirectoryNodes(res.data.directories);
          parentNode.children = [...directories, ...rules];
        } else if (parentNode.id === '_templates') {
          // Load templates into parentNode
          let res = await axios.get('/templates');
          let templates = buildTemplateNodes(res.data.templates);
          let directories = buildDirectoryNodes(res.data.directories);
          parentNode.children = [...directories, ...templates];
        } else if (parentNode.id === '_errors') {
          // Route to errors page
        } else if (parentNode.isTemplate) {
          let res = await axios.get('/templates', { params: { path: parentNode.id } });
          let templates = buildRuleNodes(res.data.templates, parentNode);
          let directories = buildDirectoryNodes(res.data.directories, parentNode);
          parentNode.children = [...directories, ...templates];
        } else {
          let res = await axios.get('/rules', { params: { path: parentNode.id } });
          let rules = buildRuleNodes(res.data.rules, parentNode);
          let directories = buildDirectoryNodes(res.data.directories, parentNode);
          parentNode.children = [...directories, ...rules];
        }
      }
      this.loadExpanded();
      callback();
    }
  }
};
</script>

<style>
.vue-treeselect__control {
  display: none;
}

.vue-treeselect__menu {
  padding: 0;
  border: 0;
  border-radius: 0 !important;
  box-shadow: none !important;
  position: inherit;
}

.vue-treeselect__menu-container {
  position: inherit;
}

.vue-treeselect__label {
  color: inherit;
}
</style>
