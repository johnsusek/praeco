import axios from 'axios';
import { useConfigsStore } from '@/stores';

export function triggerMouseEvent(node, eventType) {
  let clickEvent = new Event(eventType, { bubbles: true, cancelable: true });
  clickEvent.synthetic = true;
  node.dispatchEvent(clickEvent);
}

export function expandNode(id) {
  // Element Plus TreeSelect uses different selectors
  let selector = `[data-value="${id}"] .el-tree-node__expand-icon`;
  let targetNode = document.querySelector(selector);
  if (targetNode) {
    triggerMouseEvent(targetNode, 'click');
  }
}

export function selectNode(id) {
  // Element Plus TreeSelect uses different selectors  
  let targetNode = document.querySelector(`[data-value="${id}"] .el-tree-node__content`);
  if (targetNode) {
    triggerMouseEvent(targetNode, 'mouseover');
    triggerMouseEvent(targetNode, 'click');
  }
}

export async function loadChildrenOptions({ action, parentNode, callback }, onlyFolders) {
  const configsStore = useConfigsStore();
  
  if (action === 'LOAD_CHILDREN_OPTIONS') {
    if (parentNode.id === '_rules') {
      // Load root rules folder
      let res = await axios.get('/api/rules?all');
      configsStore.fetchedConfigsTree({ paths: res.data, type: 'rules' });

      let folderNodes = {};
      let ruleNodes = {};

      configsStore.tree.rules.sort().forEach(entry => {
        let entryParts = entry.split('/');
        let entryName = entryParts[0];

        if (entry.endsWith('/') && entryParts.length === 2) {
          folderNodes[entry] = {
            value: entry,
            label: entryName,
            isDirectory: true,
            isRule: true,
            children: [],
            isLeaf: false
          };
        } else if (entryParts.length === 1 && !onlyFolders) {
          ruleNodes[entry] = {
            value: entry,
            label: entryName,
            isRule: true,
            isLeaf: true
          };
        }
      });

      let paths = configsStore.tree.rules.filter(entry => !entry.endsWith('/'));
      configsStore.fetchedConfigs({ paths, type: 'rules' });

      parentNode.children = [...Object.values(folderNodes).sort(), ...Object.values(ruleNodes).sort()];
    } else if (parentNode.id === '_templates') {
      if (parentNode.id === '_templates') {
        // Load root templates folder
        let res = await axios.get('/api/templates?all');
        configsStore.fetchedConfigsTree({ paths: res.data, type: 'templates' });

        let folderNodes = {};
        let templateNodes = {};

        configsStore.tree.templates.sort().forEach(entry => {
          let entryParts = entry.split('/');
          let entryName = entryParts[0];

          if (entry.endsWith('/') && entryParts.length === 2) {
            folderNodes[entry] = {
              value: entry,
              label: entryName,
              isDirectory: true,
              children: [],
              isTemplate: true,
              isLeaf: false
            };
          } else if (entryParts.length === 1 && !onlyFolders) {
            templateNodes[entry] = {
              value: entry,
              label: entryName,
              isTemplate: true,
              isLeaf: true
            };
          }
        });

        let paths = configsStore.tree.templates.filter(entry => !entry.endsWith('/'));
        configsStore.fetchedConfigs({ paths, type: 'templates' });

        parentNode.children = [...Object.values(folderNodes).sort(), ...Object.values(templateNodes).sort()];
      }
    } else {
      // Load child rule or template nodes
      let folderNodes = {};
      let ruleNodes = {};

      let nodeEntries = [];

      if (parentNode.isTemplate) {
        nodeEntries = configsStore.tree.templates;
      } else if (parentNode.isRule) {
        nodeEntries = configsStore.tree.rules;
      }

      nodeEntries.forEach(entry => {
        if (!entry.startsWith(parentNode.id)) {
          return;
        }

        let stripped = entry.replace(parentNode.id, '');

        if (!stripped) {
          return;
        }

        // We are only interested in direct children
        let match = stripped.match(/\//g);

        if (!match && !onlyFolders) {
          // Direct child rule
          ruleNodes[entry] = {
            value: entry,
            label: stripped,
            isTemplate: parentNode.isTemplate,
            isRule: parentNode.isRule,
            isLeaf: true
          };
        } else if (match && match.length === 1) {
          // Direct child folder
          if (stripped.endsWith('/')) {
            folderNodes[entry] = {
              value: entry,
              label: stripped.replace('/', ''),
              isDirectory: true,
              children: [],
              isTemplate: parentNode.isTemplate,
              isRule: parentNode.isRule,
              isLeaf: false
            };
          }
        }
      });

      parentNode.children = [...Object.values(folderNodes).sort(), ...Object.values(ruleNodes).sort()];
    }
  }

  callback();
}
