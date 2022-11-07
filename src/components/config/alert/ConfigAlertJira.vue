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

    <praeco-form-item label="Priority" prop="jiraPriority">
      <el-input-number id="jiraPriority" v-model="jiraPriority" :disabled="viewOnly" />
      <label>The index of the priority to set the issue to. In the Jira dropdown for priorities, 0 would represent the first priority, 1 the 2nd, etc.</label>
    </praeco-form-item>

    <praeco-form-item label="Max Age" prop="jiraMaxAge">
      <el-input-number id="jiraMaxAge" v-model="jiraMaxAge" :disabled="viewOnly" />
      <label>If jira_bump_tickets is true, the maximum age of a ticket, in days, such that ElastAlert 2 will comment on the ticket instead of opening a new one. Default is 30 days.</label>
    </praeco-form-item>

    <praeco-form-item label="Bump After Inactivity" prop="jiraBumpAfterInactivity">
      <el-input-number id="jiraBumpAfterInactivity" v-model="jiraBumpAfterInactivity" :disabled="viewOnly" />
      <label> If this is set, ElastAlert 2 will only comment on tickets that have been inactive for at least this many days. It only applies if jira_bump_tickets is true. Default is 0 days.</label>
    </praeco-form-item>

    <el-form-item label="Bump Tickets" prop="jiraBumpTickets">
      <el-switch
        id="jiraBumpTickets"
        v-model="jiraBumpTickets"
        :disabled="viewOnly"
        @change="changeJiraBumpTickets" />
    </el-form-item>

    <el-form-item label="Bump Only" prop="jiraBumpOnly">
      <el-switch
        id="jiraBumpOnly"
        v-model="jiraBumpOnly"
        :disabled="viewOnly"
        @change="changeJiraBumpOnly" />
    </el-form-item>
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
    },

    jiraPriority: {
      get() {
        return this.$store.state.config.alert.jiraPriority;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_JIRA_PRIORITY',
          value
        );
      }
    },

    jiraMaxAge: {
      get() {
        return this.$store.state.config.alert.jiraMaxAge;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_JIRA_MAX_AGE',
          value
        );
      }
    },

    jiraBumpAfterInactivity: {
      get() {
        return this.$store.state.config.alert.jiraBumpAfterInactivity;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_JIRA_BUMP_AFTER_INACTIVITY',
          value
        );
      }
    },

    jiraBumpTickets: {
      get() {
        return this.$store.state.config.alert.jiraBumpTickets;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_JIRA_BUMP_TICKETS',
          value
        );
      }
    },

    jiraBumpOnly: {
      get() {
        return this.$store.state.config.alert.jiraBumpOnly;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_JIRA_BUMP_ONLY',
          value
        );
      }
    }
  },

  methods: {
    changeJiraBumpTickets(val) {
      if (val) {
        this.jiraBumpTickets = true;
      } else {
        this.jiraBumpTickets = false;
      }
    },

    changeJiraBumpOnly(val) {
      if (val) {
        this.jiraBumpOnly = true;
      } else {
        this.jiraBumpOnly = false;
      }
    }
  }
};
</script>

<style lang="scss">

</style>
