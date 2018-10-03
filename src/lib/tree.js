import axios from 'axios';
import store from '@/store';

export function buildRuleNodes(rules, parentNode) {
  return rules.sort().map(rule => ({
    id: `${parentNode ? `${parentNode.id}/` : ''}${rule}`,
    label: rule,
    isRule: true
  }));
}

export function buildTemplateNodes(rules, parentNode) {
  return rules.sort().map(rule => ({
    id: `${parentNode ? `${parentNode.id}/` : ''}${rule}`,
    label: rule,
    isTemplate: true
  }));
}

export function buildDirectoryNodes(directories, parentNode, directoryType) {
  return directories.sort().map(directory => ({
    id: `${parentNode ? `${parentNode.id}/` : ''}${directory}`,
    label: directory,
    isDirectory: true,
    directoryType,
    children: null
  }));
}

export function triggerMouseEvent(node, eventType) {
  let clickEvent = document.createEvent('MouseEvents');
  clickEvent.synthetic = true;
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
}

export function expandNode(id) {
  let targetNode = document.querySelector(`[data-id="${id}"] .vue-treeselect__option-arrow-container`);
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
      let res = await axios.get('/rules');

      store.commit('configs/FETCHED_CONFIGS', { configs: res.data, type: 'rules' });

      let rules = onlyFolders ? [] : buildRuleNodes(res.data.rules);
      let directories = buildDirectoryNodes(res.data.directories, null, 'rules');

      parentNode.children = [...directories, ...rules];
    } else if (parentNode.id === '_templates') {
      // Load root templates folder
      let res = await axios.get('/templates');

      store.commit('configs/FETCHED_CONFIGS', { configs: res.data, type: 'templates' });

      let templates = onlyFolders ? [] : buildTemplateNodes(res.data.templates);
      let directories = buildDirectoryNodes(res.data.directories, null, 'templates');

      parentNode.children = [...directories, ...templates];
    } else {
      // Load a rules or templates child folder
      let res = await axios.get(`/${parentNode.directoryType}`, {
        params: { path: parentNode.id }
      });

      store.commit('configs/FETCHED_CONFIGS', {
        configs: res.data,
        path: parentNode.id,
        type: parentNode.directoryType
      });

      let rules = [];
      if (res.data.rules && !onlyFolders) {
        rules = buildRuleNodes(res.data.rules, parentNode);
      }

      let templates = [];
      if (res.data.templates && !onlyFolders) {
        templates = buildTemplateNodes(res.data.templates, parentNode);
      }

      let directories = buildDirectoryNodes(
        res.data.directories,
        parentNode,
        parentNode.directoryType
      );

      parentNode.children = [...directories, ...rules, ...templates];
    }
  }
  callback();
}
