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

    <praeco-form-item label="Description" prop="jiraDescription">
      <el-input id="jiraDescription" v-model="jiraDescription" :disabled="viewOnly" />
      <label>Similar to alert_text, this text is prepended to the Jira description.</label>
    </praeco-form-item>

    <praeco-form-item label="Assignee" prop="jiraAssignee">
      <el-input id="jiraAssignee" v-model="jiraAssignee" :disabled="viewOnly" />
      <label>Assigns an issue to a user.</label>
    </praeco-form-item>

    <praeco-form-item label="TransitionT" prop="jiraTransitionTo">
      <el-input id="jiraTransitionTo" v-model="jiraTransitionTo" :disabled="viewOnly" />
      <label>If jira_bump_tickets is true, Transition this ticket to the given Status when bumping. Must match the text of your Jira implementation’s Status field.</label>
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
    },

    jiraDescription: {
      get() {
        return this.$store.state.config.alert.jiraDescription;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_JIRA_DESCRIPTIONT',
          value
        );
      }
    },

    jiraAssignee: {
      get() {
        return this.$store.state.config.alert.jiraAssignee;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_JIRA_ASSIGNEE',
          value
        );
      }
    },

    jiraTransitionTo: {
      get() {
        return this.$store.state.config.alert.jiraTransitionTo;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_JIRA_TRANSITION_TO',
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
