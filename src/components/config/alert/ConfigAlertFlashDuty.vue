<template>
  <div>
    <el-form-item label="integration key" prop="flashdutyIntegrationKey" required>
      <el-input v-model="flashdutyIntegrationKey" :disabled="viewOnly" @update:model-value="flashdutyIntegrationKey = $event" />
    </el-form-item>

    <el-form-item label="alert_key" prop="flashdutyAlertKey">
      <el-input v-model="flashdutyAlertKey" :disabled="viewOnly" @update:model-value="flashdutyAlertKey = $event" />
    </el-form-item>

    <el-form-item label="title" prop="flashdutyTitle">
      <el-input v-model="flashdutyTitle" :disabled="viewOnly" @update:model-value="flashdutyTitle = $event" />
    </el-form-item>

    <el-form-item label="description" prop="flashdutyDescription">
      <el-input v-model="flashdutyDescription" :disabled="viewOnly" @update:model-value="flashdutyDescription = $event" />
    </el-form-item>

    <el-form-item label="event_status" prop="flashdutyEventStatus">
      <el-radio-group v-model="flashdutyEventStatus" :disabled="viewOnly" @update:model-value="flashdutyEventStatus = $event">
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
      <el-input v-model="flashdutyCheck" :disabled="viewOnly" @update:model-value="flashdutyCheck = $event" />
    </el-form-item>

    <el-form-item label="service" prop="flashdutyService">
      <el-input v-model="flashdutyService" :disabled="viewOnly" @update:model-value="flashdutyService = $event" />
    </el-form-item>

    <el-form-item label="cluster" prop="flashdutyCluster">
      <el-input v-model="flashdutyCluster" :disabled="viewOnly" @update:model-value="flashdutyCluster = $event" />
    </el-form-item>

    <el-form-item label="resource" prop="flashdutyResource">
      <el-input v-model="flashdutyResource" :disabled="viewOnly" @update:model-value="flashdutyResource = $event" />
    </el-form-item>

    <el-form-item label="metric" prop="flashdutyMetric">
      <el-input v-model="flashdutyMetric" :disabled="viewOnly" @update:model-value="flashdutyMetric = $event" />
    </el-form-item>

    <el-form-item label="group" prop="flashdutyGroup">
      <el-input v-model="flashdutyGroup" :disabled="viewOnly" @update:model-value="flashdutyGroup = $event" />
    </el-form-item>

    <el-form-item label="env" prop="flashdutyEnv">
      <el-input v-model="flashdutyEnv" :disabled="viewOnly" @update:model-value="flashdutyEnv = $event" />
    </el-form-item>

    <el-form-item label="app" prop="flashdutyApp">
      <el-input v-model="flashdutyApp" :disabled="viewOnly" @update:model-value="flashdutyApp = $event" />
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
