<template>
  <div>
    <el-radio id="groupPagerduty" v-model="groupPagerduty" label="v1" @change="changePagerDutyV1">
      v1
    </el-radio>
    <el-radio id="groupPagerduty" v-model="groupPagerduty" label="v2" @change="changePagerDutyV2">
      v2
    </el-radio>

    <el-form-item label="Service Key" prop="pagerdutyServiceKey" required>
      <el-input id="pagerdutyServiceKey" v-model="pagerdutyServiceKey" :disabled="viewOnly" />
      <label>
        Integration Key generated after creating a service with the ‘Use our API directly’ option at Integration Settingsl
      </label>
    </el-form-item>

    <el-form-item label="Client Name" prop="pagerdutyClientName" required>
      <el-input id="pagerdutyClientName" v-model="pagerdutyClientName" :disabled="viewOnly" />
      <label>
        The name of the monitoring client that is triggering this event.
      </label>
    </el-form-item>

    <el-form-item label="Event Type" prop="pagerdutyEventType" required>
      <el-radio-group v-model="pagerdutyEventType" :disabled="viewOnly">
        <el-radio id="pagerdutyEventTypeTrigger" label="trigger">
          Trigger
        </el-radio>
        <el-radio id="pagerdutyEventTypeResolve" label="resolve">
          Resolve
        </el-radio>
        <el-radio id="pagerdutyEventTypeAcknowledge" label="acknowledge">
          Acknowledge
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="Incident Key" prop="pagerdutyIncidentKey">
      <el-input id="pagerdutyIncidentKey" v-model="pagerdutyIncidentKey" :disabled="viewOnly" />
      <label>
        If not set PagerDuty will trigger a new incident for each alert sent.
        If set to a unique string per rule PagerDuty will identify the incident that this event should be applied. If there’s no open (i.e. unresolved) incident with this key, a new one will be created.
        If there’s already an open incident with a matching key, this event will be appended to that incident’s log.
      </label>
    </el-form-item>

    <el-form-item label="Proxy" prop="pagerdutyProxy">
      <el-input id="pagerdutyProxy" v-model="pagerdutyProxy" :disabled="viewOnly" />
      <label>
        By default ElastAlert2 will not use a network proxy to send notifications to PagerDuty.
        Set this option using hostname:port if you need to use a proxy.
      </label>
    </el-form-item>

    <div v-if="groupPagerduty === 'v2'">
      <el-form-item label="Payload Class" prop="pagerdutyV2PayloadClass">
        <el-input id="pagerdutyV2PayloadClass" v-model="pagerdutyV2PayloadClass" :disabled="viewOnly" />
        <label>
          Sets the class of the payload. (the event type in PagerDuty)
        </label>
      </el-form-item>

      <el-form-item label="Payload Component" prop="pagerdutyV2PayloadComponent">
        <el-input id="pagerdutyV2PayloadComponent" v-model="pagerdutyV2PayloadComponent" :disabled="viewOnly" />
        <label>
          Sets the component of the payload. (what program/interface/etc the event came from)
        </label>
      </el-form-item>

      <el-form-item label="Payload Group" prop="pagerdutyV2PayloadGroup">
        <el-input id="pagerdutyV2PayloadGroup" v-model="pagerdutyV2PayloadGroup" :disabled="viewOnly" />
        <label>
          Sets the logical grouping (e.g. app-stack)
        </label>
      </el-form-item>

      <el-form-item label="Severity" prop="pagerdutyV2PayloadSeverity">
        <el-radio-group v-model="pagerdutyV2PayloadSeverity" :disabled="viewOnly">
          <el-radio id="pagerdutyV2PayloadSeverityCritical" label="critical">
            Critical
          </el-radio>
          <el-radio id="pagerdutyV2PayloadSeverityError" label="error">
            Error
          </el-radio>
          <el-radio id="pagerdutyV2PayloadSeverityWarning" label="warning">
            Warning
          </el-radio>
          <el-radio id="pagerdutyV2PayloadSeverityInfo" label="info">
            Info
          </el-radio>
        </el-radio-group>
        <label>
          Sets the severity of the page. (defaults to critical, valid options: critical, error, warning, info)
        </label>
      </el-form-item>

      <el-form-item label="Payload Group" prop="pagerdutyV2PayloadSource">
        <el-input id="pagerdutyV2PayloadSource" v-model="pagerdutyV2PayloadSource" :disabled="viewOnly" />
        <label>
          Sets the source of the event, preferably the hostname or fqdn.
        </label>
      </el-form-item>

      <el-form-item label="Payload include All Info" prop="pagerdutyV2PayloadIncludeAllInfo">
        <el-switch
          id="pagerdutyV2PayloadIncludeAllInfo"
          v-model="pagerdutyV2PayloadIncludeAllInfo"
          :disabled="viewOnly"
          @change="changePagerdutyV2PayloadIncludeAllInfo" />
      </el-form-item>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },

  props: ['viewOnly'],

  data() {
    let groupPagerdutyValue;
    if (typeof this.$store.state.config.alert.pagerdutyApiVersion === 'undefined' || this.$store.state.config.alert.pagerdutyApiVersion === '') {
      groupPagerdutyValue = 'v1';
    } else {
      groupPagerdutyValue = this.$store.state.config.alert.pagerdutyApiVersion;
    }
    return {
      groupPagerduty: groupPagerdutyValue,
      rules: {
      }
    };
  },

  computed: {
    pagerdutyServiceKey: {
      get() {
        return this.$store.state.config.alert.pagerdutyServiceKey;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_PAGERDUTY_SERVICE_KEY',
          value
        );
      }
    },

    pagerdutyClientName: {
      get() {
        return this.$store.state.config.alert.pagerdutyClientName;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_PAGERDUTY_CLIENT_NAME',
          value
        );
      }
    },

    pagerdutyEventType: {
      get() {
        return this.$store.state.config.alert.pagerdutyEventType;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_PAGERDUTY_EVENT_TYPE',
          value
        );
      }
    },

    pagerdutyIncidentKey: {
      get() {
        return this.$store.state.config.alert.pagerdutyIncidentKey;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_PAGERDUTY_INCIDENT_KEY',
          value
        );
      }
    },

    pagerdutyProxy: {
      get() {
        return this.$store.state.config.alert.pagerdutyProxy;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_PAGERDUTY_PROXYY',
          value
        );
      }
    },

    pagerdutyApiVersion: {
      get() {
        return this.$store.state.config.alert.pagerdutyApiVersion;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_PAGERDUTY_API_VERSION',
          value
        );
      }
    },

    pagerdutyV2PayloadClass: {
      get() {
        return this.$store.state.config.alert.pagerdutyV2PayloadClass;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_PAGERDUTY_V2_PAYLOAD_CLASS',
          value
        );
      }
    },

    pagerdutyV2PayloadComponent: {
      get() {
        return this.$store.state.config.alert.pagerdutyV2PayloadComponent;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_PAGERDUTY_V2_PAYLOAD_COMPONENT',
          value
        );
      }
    },

    pagerdutyV2PayloadGroup: {
      get() {
        return this.$store.state.config.alert.pagerdutyV2PayloadGroup;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_PAGERDUTY_V2_PAYLOAD_GROUP',
          value
        );
      }
    },

    pagerdutyV2PayloadSeverity: {
      get() {
        return this.$store.state.config.alert.pagerdutyV2PayloadSeverity;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_PAGERDUTY_V2_PAYLOAD_SEVERITY',
          value
        );
      }
    },

    pagerdutyV2PayloadSource: {
      get() {
        return this.$store.state.config.alert.pagerdutyV2PayloadSource;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_PAGERDUTY_V2_PAYLOAD_SOURCE',
          value
        );
      }
    },

    pagerdutyV2PayloadIncludeAllInfo: {
      get() {
        return this.$store.state.config.alert.pagerdutyV2PayloadIncludeAllInfo;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_PAGERDUTY_V2_PAYLOAD_INCLUDE_ALL_INFO',
          value
        );
      }
    },

    // TODO: pagerduty_v2_payload_class_args

    // TODO: pagerduty_v2_payload_component_args

    // TODO: pagerduty_v2_payload_group_args

    // TODO: pagerduty_v2_payload_source_args
  },

  methods: {
    changePagerDutyV1() {
      this.pagerdutyApiVersion = 'v1';
      this.pagerdutyV2PayloadClass = '';
      this.pagerdutyV2PayloadComponent = '';
      this.pagerdutyV2PayloadGroup = '';
      this.pagerdutyV2PayloadSeverity = 'critical';
      this.pagerdutyV2PayloadSource = 'ElastAlert';
      this.pagerdutyV2PayloadIncludeAllInfo = false;
    },

    changePagerDutyV2() {
      this.pagerdutyApiVersion = 'v2';
      this.pagerdutyV2PayloadClass = '';
      this.pagerdutyV2PayloadComponent = '';
      this.pagerdutyV2PayloadGroup = '';
      this.pagerdutyV2PayloadSeverity = 'critical';
      this.pagerdutyV2PayloadSource = 'ElastAlert';
      this.pagerdutyV2PayloadIncludeAllInfo = false;
    },

    changePagerdutyV2PayloadIncludeAllInfo(val) {
      if (val) {
        this.pagerdutyV2PayloadIncludeAllInfo = true;
      } else {
        this.pagerdutyV2PayloadIncludeAllInfo = false;
      }
    }
  }
};
</script>

<style lang="scss">
</style>
