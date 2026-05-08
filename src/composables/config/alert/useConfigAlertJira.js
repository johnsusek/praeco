import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

export function useConfigAlertJira() {

  // store
  const store = useStore();

  // ===== jiraIssueType =====
  const jiraIssueType = computed({
    get: () => store.state.config.alert.jiraIssueType,
    set: (v) => store.commit('config/alert/UPDATE_JIRA_ISSUE_TYPE', v)
  });

  // ===== jiraProject =====
  const jiraProject = computed({
    get: () => store.state.config.alert.jiraProject,
    set: (v) => store.commit('config/alert/UPDATE_JIRA_PROJECT', v)
  });

  // ===== jiraComponents =====
  const jiraComponents = computed({
    get: () => store.state.config.alert.jiraComponents,
    set: (v) => store.commit('config/alert/UPDATE_JIRA_COMPONENTS', v)
  });

  // ===== return =====
  return {
    jiraIssueType,
    jiraProject,
    jiraComponents
  };
}
