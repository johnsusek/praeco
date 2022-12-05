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

    <el-popover v-model="popjiraWatchersVisible" :class="{ 'is-invalid': !popjiraWatchersValid }">
      <template v-slot:reference>
        <span class="pop-trigger">
          <el-tooltip v-if="jiraWatchers.length" :content="jiraWatchers.join(', ')" placement="top">
            <span>Watchers ({{ jiraWatchers.length }})</span>
          </el-tooltip>
          <span v-else>Watchers ({{ jiraWatchers.length }})</span>
        </span>
      </template>
      <template>
        <el-form
          ref="jiraWatchers"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in jiraWatchers"
            :key="index"
            :prop="'jiraWatchers.' + index"
            :disabled="viewOnly"
            class="el-form-item-list"
            label=""
            required>
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="jiraWatchers[index]"
                  :disabled="viewOnly"
                  placeholder="AttributesValues"
                  @input="(val) => updatejiraWatchers(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="removejiraWatchersEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addjiraWatchersEntry">
          Add Watchers
        </el-button>
      </template>
    </el-popover>

    <el-popover v-model="popjiraBumpInStatusesVisible" :class="{ 'is-invalid': !popjiraBumpInStatusesValid }">
      <template v-slot:reference>
        <span class="pop-trigger">
          <el-tooltip v-if="jiraBumpInStatuses.length" :content="jiraBumpInStatuses.join(', ')" placement="top">
            <span>BumpInStatuses ({{ jiraBumpInStatuses.length }})</span>
          </el-tooltip>
          <span v-else>BumpInStatuses ({{ jiraBumpInStatuses.length }})</span>
        </span>
      </template>
      <template>
        <el-form
          ref="jiraBumpInStatuses"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in jiraBumpInStatuses"
            :key="index"
            :prop="'jiraBumpInStatuses.' + index"
            :disabled="viewOnly"
            class="el-form-item-list"
            label=""
            required>
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="jiraBumpInStatuses[index]"
                  :disabled="viewOnly"
                  placeholder="AttributesValues"
                  @input="(val) => updatejiraBumpInStatuses(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="removejiraBumpInStatusesEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addjiraBumpInStatusesEntry">
          Add BumpInStatuses
        </el-button>
      </template>
    </el-popover>

    <el-popover v-model="popjiraBumpNotInStatusesVisible" :class="{ 'is-invalid': !popjiraBumpNotInStatusesValid }">
      <template v-slot:reference>
        <span class="pop-trigger">
          <el-tooltip v-if="jiraBumpNotInStatuses.length" :content="jiraBumpNotInStatuses.join(', ')" placement="top">
            <span>BumpNotInStatuses ({{ jiraBumpNotInStatuses.length }})</span>
          </el-tooltip>
          <span v-else>BumpNotInStatuses ({{ jiraBumpNotInStatuses.length }})</span>
        </span>
      </template>
      <template>
        <el-form
          ref="jiraBumpNotInStatuses"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in jiraBumpNotInStatuses"
            :key="index"
            :prop="'jiraBumpNotInStatuses.' + index"
            :disabled="viewOnly"
            class="el-form-item-list"
            label=""
            required>
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="jiraBumpNotInStatuses[index]"
                  :disabled="viewOnly"
                  placeholder="AttributesValues"
                  @input="(val) => updatejiraBumpNotInStatuses(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="removejiraBumpNotInStatusesEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addjiraBumpNotInStatusesEntry">
          Add BumpNotInStatuses
        </el-button>
      </template>
    </el-popover>

    <el-popover v-model="popjiraLabelVisible" :class="{ 'is-invalid': !popjiraLabelValid }">
      <template v-slot:reference>
        <span class="pop-trigger">
          <el-tooltip v-if="jiraLabel.length" :content="jiraLabel.join(', ')" placement="top">
            <span>Label ({{ jiraLabel.length }})</span>
          </el-tooltip>
          <span v-else>Label ({{ jiraLabel.length }})</span>
        </span>
      </template>
      <template>
        <el-form
          ref="jiraLabel"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in jiraLabel"
            :key="index"
            :prop="'jiraLabel.' + index"
            :disabled="viewOnly"
            class="el-form-item-list"
            label=""
            required>
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="jiraLabel[index]"
                  :disabled="viewOnly"
                  placeholder="AttributesValues"
                  @input="(val) => updatejiraLabel(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="removejiraLabelEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addjiraLabelEntry">
          Add Label
        </el-button>
      </template>
    </el-popover>

    <el-popover v-model="popjiraLabelsVisible" :class="{ 'is-invalid': !popjiraLabelsValid }">
      <template v-slot:reference>
        <span class="pop-trigger">
          <el-tooltip v-if="jiraLabels.length" :content="jiraLabels.join(', ')" placement="top">
            <span>Labels ({{ jiraLabels.length }})</span>
          </el-tooltip>
          <span v-else>Labels ({{ jiraLabels.length }})</span>
        </span>
      </template>
      <template>
        <el-form
          ref="jiraLabels"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in jiraLabels"
            :key="index"
            :prop="'jiraLabels.' + index"
            :disabled="viewOnly"
            class="el-form-item-list"
            label=""
            required>
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="jiraLabels[index]"
                  :disabled="viewOnly"
                  placeholder="AttributesValues"
                  @input="(val) => updatejiraLabels(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="removejiraLabelsEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addjiraLabelsEntry">
          Add Labels
        </el-button>
      </template>
    </el-popover>
  </div>
</template>

<script>

export default {
  props: ['viewOnly'],

  data() {
    return {
      popjiraLabelsVisible: false,
      popjiraLabelsValid: true,
      popjiraLabelVisible: false,
      popjiraLabelValid: true,
      popjiraBumpNotInStatusesVisible: false,
      popjiraBumpNotInStatusesValid: true,
      popjiraBumpInStatusesVisible: false,
      popjiraBumpInStatusesValid: true,
      popjiraWatchersVisible: false,
      popjiraWatchersValid: true,
    };
  },

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
    async validate() {
      try {
        if (this.$refs.jiraWatchers) {
          await this.validatejiraWatchers();
        }
        if (this.$refs.jiraBumpInStatuses) {
          await this.validatejiraBumpInStatuses();
        }
        if (this.$refs.jiraBumpNotInStatuses) {
          await this.validatejiraBumpNotInStatuses();
        }
        if (this.$refs.jiraLabel) {
          await this.validatejiraLabel();
        }
        if (this.$refs.jiraLabels) {
          await this.validatejiraLabels();
        }
        this.$emit('validate', true);
        return true;
      } catch (error) {
        this.$emit('validate', false);
        return false;
      }
    },

    async validatejiraWatchers() {
      if (!this.jiraWatchers.length) {
        this.popjiraWatchersValid = false;
        return;
      }
      try {
        this.popjiraWatchersValid = await this.$refs.jiraWatchers.validate();
      } catch (error) {
        this.popjiraWatchersValid = false;
        throw error;
      }
    },

    updatejiraWatchers(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_JIRA_WATCHERS_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removejiraWatchersEntry(entry) {
      this.$store.commit('config/alert/REMOVE_JIRA_WATCHERS_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addjiraWatchersEntry() {
      this.$store.commit('config/alert/ADD_JIRA_WATCHERS_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    async validatejiraBumpInStatuses() {
      if (!this.jiraBumpInStatuses.length) {
        this.popjiraBumpInStatusesValid = false;
        return;
      }
      try {
        this.popjiraBumpInStatusesValid = await this.$refs.jiraBumpInStatuses.validate();
      } catch (error) {
        this.popjiraBumpInStatusesValid = false;
        throw error;
      }
    },

    updatejiraBumpInStatuses(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_JIRA_BUMP_IN_STATUSES_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removejiraBumpInStatusesEntry(entry) {
      this.$store.commit('config/alert/REMOVE_JIRA_BUMP_IN_STATUSES_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addjiraBumpInStatusesEntry() {
      this.$store.commit('config/alert/ADD_JIRA_BUMP_IN_STATUSES_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    async validatejiraBumpNotInStatuses() {
      if (!this.jiraBumpNotInStatuses.length) {
        this.popjiraBumpNotInStatusesValid = false;
        return;
      }
      try {
        this.popjiraBumpNotInStatusesValid = await this.$refs.jiraBumpNotInStatuses.validate();
      } catch (error) {
        this.popjiraBumpNotInStatusesValid = false;
        throw error;
      }
    },

    updatejiraBumpNotInStatuses(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_JIRA_BUMP_NOT_IN_STATUSES_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removejiraBumpNotInStatusesEntry(entry) {
      this.$store.commit('config/alert/REMOVE_JIRA_BUMP_NOT_IN_STATUSES_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addjiraBumpNotInStatusesEntry() {
      this.$store.commit('config/alert/ADD_JIRA_BUMP_NOT_IN_STATUSES_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    async validatejiraLabel() {
      if (!this.jiraLabel.length) {
        this.popjiraLabelValid = false;
        return;
      }
      try {
        this.popjiraLabelValid = await this.$refs.jiraLabel.validate();
      } catch (error) {
        this.popjiraLabelValid = false;
        throw error;
      }
    },

    updatejiraLabel(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_JIRA_LABEL_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removejiraLabelEntry(entry) {
      this.$store.commit('config/alert/REMOVE_JIRA_LABEL_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addjiraLabelEntry() {
      this.$store.commit('config/alert/ADD_JIRA_LABEL_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    async validatejiraLabels() {
      if (!this.jiraLabels.length) {
        this.popjiraLabelsValid = false;
        return;
      }
      try {
        this.popjiraLabelsValid = await this.$refs.jiraLabels.validate();
      } catch (error) {
        this.popjiraLabelsValid = false;
        throw error;
      }
    },

    updatejiraLabels(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_JIRA_LABELS_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removejiraLabelsEntry(entry) {
      this.$store.commit('config/alert/REMOVE_JIRA_LABELS_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addjiraLabelsEntry() {
      this.$store.commit('config/alert/ADD_JIRA_LABELS_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

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
