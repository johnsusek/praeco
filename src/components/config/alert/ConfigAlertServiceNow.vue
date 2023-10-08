<template>
  <div>
    <praeco-form-item label="Username" prop="serviceNowUsername" required>
      <el-input id="serviceNowUsername" v-model="serviceNowUsername" :disabled="viewOnly" />
      <label>The ServiceNow Username to access the api.</label>
    </praeco-form-item>

    <praeco-form-item label="Password" prop="serviceNowPassword" required>
      <el-input id="serviceNowPassword" v-model="serviceNowPassword" :disabled="viewOnly" />
      <label>The ServiceNow password to access the api.</label>
    </praeco-form-item>

    <praeco-form-item label="REST URL" prop="servicenowRestUrl" required>
      <el-input id="servicenowRestUrl" v-model="servicenowRestUrl" :disabled="viewOnly" />
      <label>The ServiceNow RestApi url.</label>
    </praeco-form-item>

    <praeco-form-item label="ShortDescription" prop="servicenowShortDescription" required>
      <el-input id="servicenowShortDescription" v-model="servicenowShortDescription" :disabled="viewOnly" />
      <label>The ServiceNow password to access the api.</label>
    </praeco-form-item>

    <praeco-form-item label="Comments" prop="servicenowComments" required>
      <el-input id="servicenowComments" v-model="servicenowComments" :disabled="viewOnly" />
      <label>Comments to be attached to the incident, this is the equivilant of work notes.</label>
    </praeco-form-item>

    <praeco-form-item label="AssignmentGroup" prop="servicenowAssignmentGroup" required>
      <el-input id="servicenowAssignmentGroup" v-model="servicenowAssignmentGroup" :disabled="viewOnly" />
      <label>The group to assign the incident to.</label>
    </praeco-form-item>

    <praeco-form-item label="Category" prop="servicenowCategory" required>
      <el-input id="servicenowCategory" v-model="servicenowCategory" :disabled="viewOnly" />
      <label>The category to attach the incident to, use an existing category.</label>
    </praeco-form-item>

    <praeco-form-item label="Subcategory" prop="servicenowSubcategory" required>
      <el-input id="servicenowSubcategory" v-model="servicenowSubcategory" :disabled="viewOnly" />
      <label>The subcategory to attach the incident to, use an existing subcategory.</label>
    </praeco-form-item>

    <praeco-form-item label="CmdbCi" prop="servicenowCmdbCi" required>
      <el-input id="servicenowCmdbCi" v-model="servicenowCmdbCi" :disabled="viewOnly" />
      <label>The configuration item to attach the incident to.</label>
    </praeco-form-item>

    <praeco-form-item label="CallerId" prop="servicenowCallerId" required>
      <el-input id="servicenowCallerId" v-model="servicenowCallerId" :disabled="viewOnly" />
      <label>The caller id (email address) of the user that created the incident.</label>
    </praeco-form-item>

    <praeco-form-item label="Proxy" prop="servicenowProxy">
      <el-input id="servicenowProxy" v-model="servicenowProxy" :disabled="viewOnly" />
      <label>
        By default ElastAlert 2 will not use a network proxy to send notifications to ServiceNow.
        Set this option using hostname:port if you need to use a proxy.
      </label>
    </praeco-form-item>

    <praeco-form-item label="Impact" prop="servicenowImpact">
      <el-input-number id="servicenowImpact" v-model="servicenowImpact" :disabled="viewOnly" :min="1" :max="3" />
      <label>
        An integer 1, 2, or 3 representing high, medium, and low respectively.
        This measures the effect of an incident on business processes.
      </label>
    </praeco-form-item>

    <praeco-form-item label="Urgency" prop="servicenowUrgency">
      <el-input-number id="servicenowUrgency" v-model="servicenowUrgency" :disabled="viewOnly" :min="1" :max="3" />
      <label>
        An integer 1, 2, or 3 representing high, medium, and low respecitvely.
        This measures how long this incident can be delayed until there is a significant business impact.
      </label>
    </praeco-form-item>
  </div>
</template>

<script>
export default {
  props: {
    viewOnly: Boolean
  },

  computed: {
    serviceNowUsername: {
      get() {
        return this.$store.state.config.alert.serviceNowUsername;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SERVICENOW_USERNAME',
          value
        );
      }
    },

    serviceNowPassword: {
      get() {
        return this.$store.state.config.alert.serviceNowPassword;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SERVICENOW_PASSWORD',
          value
        );
      }
    },

    servicenowRestUrl: {
      get() {
        return this.$store.state.config.alert.servicenowRestUrl;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SERVICENOW_REST_URL',
          value
        );
      }
    },

    servicenowShortDescription: {
      get() {
        return this.$store.state.config.alert.servicenowShortDescription;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SERVICENOW_SHORT_DESCRIPTION',
          value
        );
      }
    },

    servicenowComments: {
      get() {
        return this.$store.state.config.alert.servicenowComments;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SERVICENOW_COMMENTS',
          value
        );
      }
    },

    servicenowAssignmentGroup: {
      get() {
        return this.$store.state.config.alert.servicenowAssignmentGroup;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SERVICENOW_ASSIGNMENT_GROUP',
          value
        );
      }
    },

    servicenowCategory: {
      get() {
        return this.$store.state.config.alert.servicenowCategory;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SERVICENOW_CATEGORY',
          value
        );
      }
    },

    servicenowSubcategory: {
      get() {
        return this.$store.state.config.alert.servicenowSubcategory;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SERVICENOW_SUBCATEGORY',
          value
        );
      }
    },

    servicenowCmdbCi: {
      get() {
        return this.$store.state.config.alert.servicenowCmdbCi;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SERVICENOW_CMDB_CI',
          value
        );
      }
    },

    servicenowCallerId: {
      get() {
        return this.$store.state.config.alert.servicenowCallerId;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SERVICENOW_CALLER_ID',
          value
        );
      }
    },

    servicenowProxy: {
      get() {
        return this.$store.state.config.alert.servicenowProxy;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SERVICENOW_PROXY',
          value
        );
      }
    },

    servicenowImpact: {
      get() {
        return this.$store.state.config.alert.servicenowImpact;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SERVICENOW_IMPACT',
          value
        );
      }
    },

    servicenowUrgency: {
      get() {
        return this.$store.state.config.alert.servicenowUrgency;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_SERVICENOW_URGENCY',
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
