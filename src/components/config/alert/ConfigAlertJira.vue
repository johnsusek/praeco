<template>
  <div>
    <praeco-form-item label="jira_project" prop="jiraProject" required>
      <el-input v-model="jiraProject" :disabled="viewOnly" />
      <label>Jira project</label>
    </praeco-form-item>
    <praeco-form-item label="jira_issuetype" prop="jiraIssueType" required>
      <el-input v-model="jiraIssueType" :disabled="viewOnly" />
      <label>Jira issue type (Bug, Integration Bug, etc...)</label>
    </praeco-form-item>
    <praeco-form-item label="jira_components" prop="jiraComponents">
      <el-input v-model="jiraComponents" :disabled="viewOnly" />
      <label>Jira issue components</label>
    </praeco-form-item>
  </div>
</template>

<script setup>
import { useConfigAlertJira } from '@/composables/config/alert/useConfigAlertJira';

defineProps({
  viewOnly: Boolean
});

const {
  jiraIssueType,
  jiraProject,
  jiraComponents
} = useConfigAlertJira();
</script>
