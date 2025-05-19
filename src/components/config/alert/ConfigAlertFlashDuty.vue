<template>
  <div>
    <el-form-item label="integration key" prop="flashdutyIntegrationKey" required>
      <el-input :value="flashdutyIntegrationKey" :disabled="viewOnly" @input="flashdutyIntegrationKey = $event" />
    </el-form-item>

    <el-form-item label="alert_key" prop="flashdutyAlertKey">
      <el-input :value="flashdutyAlertKey" :disabled="viewOnly" @input="flashdutyAlertKey = $event" />
    </el-form-item>

    <el-form-item label="title" prop="flashdutyTitle">
      <el-input :value="flashdutyTitle" :disabled="viewOnly" @input="flashdutyTitle = $event" />
    </el-form-item>

    <el-form-item label="description" prop="flashdutyDescription">
      <el-input :value="flashdutyDescription" :disabled="viewOnly" @input="flashdutyDescription = $event" />
    </el-form-item>

    <el-form-item label="event_status" prop="flashdutyEventStatus">
      <el-radio-group :value="flashdutyEventStatus" :disabled="viewOnly" @input="flashdutyEventStatus = $event">
        <el-radio id="flashdutyEventStatusInfo" label="Info" border>
          Info
        </el-radio>
        <el-radio id="flashdutyEventStatusWarning" label="Warning" border>
          Warning
        </el-radio>
        <el-radio id="flashdutyEventStatusCritical" label="Critical" border>
          Critical
        </el-radio>
        <el-radio id="flashdutyEventStatusOk" label="Ok" border>
          Ok
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="check" prop="flashdutyCheck">
      <el-input :value="flashdutyCheck" :disabled="viewOnly" @input="flashdutyCheck = $event" />
    </el-form-item>

    <el-form-item label="service" prop="flashdutyService">
      <el-input :value="flashdutyService" :disabled="viewOnly" @input="flashdutyService = $event" />
    </el-form-item>

    <el-form-item label="cluster" prop="flashdutyCluster">
      <el-input :value="flashdutyCluster" :disabled="viewOnly" @input="flashdutyCluster = $event" />
    </el-form-item>

    <el-form-item label="resource" prop="flashdutyResource">
      <el-input :value="flashdutyResource" :disabled="viewOnly" @input="flashdutyResource = $event" />
    </el-form-item>

    <el-form-item label="metric" prop="flashdutyMetric">
      <el-input :value="flashdutyMetric" :disabled="viewOnly" @input="flashdutyMetric = $event" />
    </el-form-item>

    <el-form-item label="group" prop="flashdutyGroup">
      <el-input :value="flashdutyGroup" :disabled="viewOnly" @input="flashdutyGroup = $event" />
    </el-form-item>

    <el-form-item label="env" prop="flashdutyEnv">
      <el-input :value="flashdutyEnv" :disabled="viewOnly" @input="flashdutyEnv = $event" />
    </el-form-item>

    <el-form-item label="app" prop="flashdutyApp">
      <el-input :value="flashdutyApp" :disabled="viewOnly" @input="flashdutyApp = $event" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  components: {
  },

  props: ['viewOnly'],
  emits: ['validate'],

  data() {
    return {
    };
  },
  computed: {
    flashdutyIntegrationKey: {
      get() {
        return this.$store.state.config.alert.flashdutyIntegrationKey;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_FLASHDUTY_INTEGRATION_KEY', value);
      }
    },
    flashdutyTitle: {
      get() {
        return this.$store.state.config.alert.flashdutyTitle;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_FLASHDUTY_TITLE', value);
      }
    },
    flashdutyAlertKey: {
      get() {
        return this.$store.state.config.alert.flashdutyAlertKey;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_FLASHDUTY_ALERT_KEY', value);
      }
    },
    flashdutyDescription: {
      get() {
        return this.$store.state.config.alert.flashdutyDescription;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_FLASHDUTY_DESCRIPTION', value);
      }
    },
    flashdutyEventStatus: {
      get() {
        return this.$store.state.config.alert.flashdutyEventStatus;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_FLASHDUTY_EVENT_STATUS', value);
      }
    },
    flashdutyCheck: {
      get() {
        return this.$store.state.config.alert.flashdutyCheck;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_FLASHDUTY_CHECK', value);
      }
    },
    flashdutyService: {
      get() {
        return this.$store.state.config.alert.flashdutyService;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_FLASHDUTY_SERVICE', value);
      }
    },
    flashdutyCluster: {
      get() {
        return this.$store.state.config.alert.flashdutyCluster;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_FLASHDUTY_CLUSTER', value);
      }
    },
    flashdutyResource: {
      get() {
        return this.$store.state.config.alert.flashdutyResource;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_FLASHDUTY_RESOURCE', value);
      }
    },
    flashdutyMetric: {
      get() {
        return this.$store.state.config.alert.flashdutyMetric;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_FLASHDUTY_METRIC', value);
      }
    },
    flashdutyGroup: {
      get() {
        return this.$store.state.config.alert.flashdutyGroup;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_FLASHDUTY_GROUP', value);
      }
    },
    flashdutyEnv: {
      get() {
        return this.$store.state.config.alert.flashdutyEnv;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_FLASHDUTY_ENV', value);
      }
    },
    flashdutyApp: {
      get() {
        return this.$store.state.config.alert.flashdutyApp;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_FLASHDUTY_APP', value);
      }
    },
  },

  methods: {
  }
};
</script>

<style lang="scss" scoped>
</style>
