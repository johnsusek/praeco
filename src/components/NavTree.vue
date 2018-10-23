<template>
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
    @select="handleSelect"
    @click.native="handleClick">
    <label
      slot="option-label"
      slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }"
      :class="labelClassName">
      <span v-if="node.children !== undefined">
        <icon :icon="node.isExpanded ? 'folder-open' : 'folder'" />
      </span>
      {{ node.label }}
    </label>
  </treeselect>
</template>

<script>
import Vue from 'vue';
import { selectNode, expandNode, loadChildrenOptions } from '@/lib/tree';

export default {
  data() {
    return {
      expanded: [],
      value: null,
      options: []
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
        },
        {
          id: '_alerts',
          label: 'Alerts'
        },
        {
          id: '_queries',
          label: 'Queries'
        },
        {
          id: '_silences',
          label: 'Silences'
        }
      ];
    },
    loadExpanded() {
      Vue.nextTick(() => {
        this.$refs.tree.traverseAllNodesByIndex(node => {
          if (node.isBranch && !node.isExpanded && this.expanded.includes(node.id)) {
            expandNode(node.id);
          }

          // If we are looking at an item in the tree (noticed from the URL)
          // then make sure it is visible in the tree by expanding its parent
          // and also expand itself if it is a folder
          let pathFromRoute = decodeURIComponent(this.$route.path).replace(
            /\/?templates\/?|\/?rules\/?|\/?folders\/?/g,
            ''
          );
          if (pathFromRoute === node.id) {
            // Expand the parent so this is actually visible
            expandNode(node.parentNode.id);
            node.parentNode.isExpanded = true;
            // Expand ourself in case we are a folder
            expandNode(node.id);
            node.isExpanded = true;
            // Make sure we are highlighted since we are selected node
            selectNode(node.id);
          }

          // If we are a selected folder, make sure parent is expanded
          let parentPathFromRoute = pathFromRoute.split('/');
          parentPathFromRoute.pop();
          parentPathFromRoute = parentPathFromRoute.join('/');
          if (parentPathFromRoute === node.id) {
            // Expand the parent so this is actually visible
            expandNode(node.parentNode.id);
            node.parentNode.isExpanded = true;
          }

          if (node.raw.isRule) {
            if (`/rules/${node.id}` === decodeURIComponent(this.$route.path)) {
              selectNode(node.id);
            }
          } else if (node.raw.isTemplate) {
            if (`/templates/${node.id}` === decodeURIComponent(this.$route.path)) {
              selectNode(node.id);
            }
          } else if (node.raw.isDirectory) {
            if (
              `/folders/${node.raw.directoryType}/${node.id}` ===
              decodeURIComponent(this.$route.path)
            ) {
              selectNode(node.id);
            }
          } else if (node.id === '_errors') {
            if (decodeURIComponent(this.$route.path) === '/errors') {
              selectNode(node.id);
            }
          } else if (node.id === '_alerts') {
            if (decodeURIComponent(this.$route.path) === '/alerts') {
              selectNode(node.id);
            }
          } else if (node.id === '_queries') {
            if (decodeURIComponent(this.$route.path) === '/queries') {
              selectNode(node.id);
            }
          } else if (node.id === '_silences') {
            if (decodeURIComponent(this.$route.path) === '/silences') {
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
    handleClick(e) {
      if (e.synthetic) return;
      this.saveExpanded();
    },
    handleSelect(node) {
      if (node.children === undefined) {
        if (node.id === '_errors') {
          this.$router.push('/errors');
        } else if (node.id === '_alerts') {
          this.$router.push('/alerts');
        } else if (node.id === '_queries') {
          this.$router.push('/queries');
        } else if (node.id === '_silences') {
          this.$router.push('/silences');
        } else if (node.isTemplate) {
          this.$router.push({
            name: 'templateview',
            params: { id: node.id }
          });
        } else {
          this.$router.push({
            name: 'ruleview',
            params: { id: node.id }
          });
        }
      } else if (node.isDirectory) {
        this.$router.push({
          name: 'folder',
          params: {
            type: node.isRule ? 'rules' : 'templates',
            path: node.id
          }
        });
      } else if (node.id === '_templates') {
        this.$router.push('/templates');
      } else if (node.id === '_rules') {
        this.$router.push('/rules');
      }
    },
    async loadOptions(context) {
      await loadChildrenOptions(context);
      this.loadExpanded();
    }
  }
};
</script>
