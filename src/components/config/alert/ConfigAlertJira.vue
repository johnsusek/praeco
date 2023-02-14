<template>
  <div>
    <praeco-form-item label="Project" prop="jiraProject" required>
      <el-input id="jiraProject" v-model="jiraProject" :disabled="viewOnly" />
      <label>Jira project</label>
    </praeco-form-item>
    <praeco-form-item label="Issue type" prop="jiraIssueType" required>
      <el-input id="jiraIssueType" v-model="jiraIssueType" :disabled="viewOnly" />
      <label>Jira issue type (Bug, Integration Bug, etc...)</label>
    </praeco-form-item>
    <praeco-form-item label="Components" prop="jiraComponents">
      <el-input id="jiraComponents" v-model="jiraComponents" :disabled="viewOnly" />
      <label>Jira issue components</label>
    </praeco-form-item>
  </div>
</template>

<script>

export default {
  props: ['viewOnly'],

  computed: {
    jiraIssueType: {
      get() {
        return this.$store.state.config.alert.jiraIssueType;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_JIRA_ISSUE_TYPE',
          value
        );
      }
    },

    jiraProject: {
      get() {
        return this.$store.state.config.alert.jiraProject;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_JIRA_PROJECT',
          value
        );
      }
    },

    jiraComponents: {
      get() {
        return this.$store.state.config.alert.jiraComponents;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_JIRA_COMPONENTS',
          value
        );
      }
    }
  },

  methods: {
  }
};
</script>

<style lang="scss">

</style>
