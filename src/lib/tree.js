import axios from 'axios';
import store from '@/store';

export function triggerMouseEvent(node, eventType) {
  let clickEvent = document.createEvent('MouseEvents');
  clickEvent.synthetic = true;
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
}

export function expandNode(id) {
  let selector = `[data-id="${id}"] .vue-treeselect__option-arrow-container`;
  let targetNode = document.querySelector(selector);
  if (targetNode) {
    triggerMouseEvent(targetNode, 'mousedown');
  }
}

export function selectNode(id) {
  let targetNode = document.querySelector(`[data-id="${id}"] .vue-treeselect__label-container`);
  if (targetNode) {
    triggerMouseEvent(targetNode, 'mouseover');
    triggerMouseEvent(targetNode, 'mousedown');
    triggerMouseEvent(targetNode, 'mouseup');
    triggerMouseEvent(targetNode, 'click');
  }
}

export async function loadChildrenOptions({ action, parentNode, callback }, onlyFolders) {
  if (action === 'LOAD_CHILDREN_OPTIONS') {
    if (parentNode.id === '_rules') {
      // Load root rules folder
      let res = await axios.get('/api/rules?all');
      store.commit('configs/FETCHED_CONFIGS_TREE', { paths: res.data, type: 'rules' });

      let folderNodes = {};
      let ruleNodes = {};

      store.state.configs.tree.rules.sort().forEach(entry => {
        let entryParts = entry.split('/');
        let entryName = entryParts[0];

        if (entry.endsWith('/') && entryParts.length === 2) {
          folderNodes[entry] = {
            id: entry,
            label: entryName,
            isDirectory: true,
            isRule: true,
            children: null
          };
        } else if (entryParts.length === 1 && !onlyFolders) {
          ruleNodes[entry] = {
            id: entry,
            label: entryName,
            isRule: true
          };
        }
      });

      let paths = store.state.configs.tree.rules.filter(entry => !entry.endsWith('/'));
      store.commit('configs/FETCHED_CONFIGS', { paths, type: 'rules' });

      parentNode.children = [...Object.values(folderNodes).sort(), ...Object.values(ruleNodes).sort()];
    } else if (parentNode.id === '_templates') {
      if (parentNode.id === '_templates') {
        // Load root templates folder
        let res = await axios.get('/api/templates?all');
        store.commit('configs/FETCHED_CONFIGS_TREE', { paths: res.data, type: 'templates' });

        let folderNodes = {};
        let templateNodes = {};

        store.state.configs.tree.templates.sort().forEach(entry => {
          let entryParts = entry.split('/');
          let entryName = entryParts[0];

          if (entry.endsWith('/') && entryParts.length === 2) {
            folderNodes[entry] = {
              id: entry,
              label: entryName,
              isDirectory: true,
              children: null,
              isTemplate: true
            };
          } else if (entryParts.length === 1 && !onlyFolders) {
            templateNodes[entry] = {
              id: entry,
              label: entryName,
              isTemplate: true
            };
          }
        });

        let paths = store.state.configs.tree.templates.filter(entry => !entry.endsWith('/'));
        store.commit('configs/FETCHED_CONFIGS', { paths, type: 'templates' });

        parentNode.children = [...Object.values(folderNodes).sort(), ...Object.values(templateNodes).sort()];
      }
    } else {
      // Load child rule or template nodes
      let folderNodes = {};
      let ruleNodes = {};

      let nodeEntries = [];

      if (parentNode.isTemplate) {
        nodeEntries = store.state.configs.tree.templates;
      } else if (parentNode.isRule) {
        nodeEntries = store.state.configs.tree.rules;
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
            id: entry,
            label: stripped,
            isTemplate: parentNode.isTemplate,
            isRule: parentNode.isRule
          };
        } else if (match && match.length === 1) {
          // Direct child folder
          if (stripped.endsWith('/')) {
            folderNodes[entry] = {
              id: entry,
              label: stripped.replace('/', ''),
              isDirectory: true,
              children: null,
              isTemplate: parentNode.isTemplate,
              isRule: parentNode.isRule
            };
          }
        }
      });

      parentNode.children = [...Object.values(folderNodes).sort(), ...Object.values(ruleNodes).sort()];
    }
  }

  callback();
}
