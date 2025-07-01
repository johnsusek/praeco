<template>
  <div>
    <el-radio id="groupPagerduty" v-model="groupPagerduty" label="v1" @change="changePagerDutyV1">
      v1
    </el-radio>
    <el-radio id="groupPagerduty" v-model="groupPagerduty" label="v2" @change="changePagerDutyV2">
      v2
    </el-radio>

    <el-form-item label="Service Key" prop="pagerdutyServiceKey" required>
      <el-input id="pagerdutyServiceKey" :value="pagerdutyServiceKey" :disabled="viewOnly" @input="pagerdutyServiceKey = $event" />
      <label>
        Integration Key generated after creating a service with the ‘Use our API directly’ option at Integration Settingsl
      </label>
    </el-form-item>

    <el-form-item label="Client Name" prop="pagerdutyClientName" required>
      <el-input id="pagerdutyClientName" :value="pagerdutyClientName" :disabled="viewOnly" @input="pagerdutyClientName = $event" />
      <label>
        The name of the monitoring client that is triggering this event.
      </label>
    </el-form-item>

    <el-form-item label="Event Type" prop="pagerdutyEventType" required>
      <el-radio-group :value="pagerdutyEventType" :disabled="viewOnly" @input="pagerdutyEventType = $event">
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
      <el-input id="pagerdutyIncidentKey" :value="pagerdutyIncidentKey" :disabled="viewOnly" @input="pagerdutyIncidentKey = $event" />
      <label>
        If not set PagerDuty will trigger a new incident for each alert sent.
        If set to a unique string per rule PagerDuty will identify the incident that this event should be applied. If there’s no open (i.e. unresolved) incident with this key, a new one will be created.
        If there’s already an open incident with a matching key, this event will be appended to that incident’s log.
      </label>
    </el-form-item>

    <el-popover v-model="popPagerdutyIncidentKeyArgsVisible" :class="{ 'is-invalid': !popPagerdutyIncidentKeyArgsValid }">
      <template #reference>
        <span class="pop-trigger">
          <el-tooltip v-if="pagerdutyIncidentKeyArgs.length" :content="pagerdutyIncidentKeyArgs.join(', ')" placement="top">
            <span>Incident Key Args ({{ pagerdutyIncidentKeyArgs.length }})</span>
          </el-tooltip>
          <span v-else>Incident Key Args ({{ pagerdutyIncidentKeyArgs.length }})</span>
        </span>
      </template>
      <div>
        <el-form
          ref="pagerdutyIncidentKeyArgs"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.prevent>
          <el-form-item
            v-for="(entry, index) in pagerdutyIncidentKeyArgs"
            :key="index"
            :prop="`pagerdutyIncidentKeyArgs.${index}`"
            :disabled="viewOnly"
            class="el-form-item-list"
            label=""
            required>
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="pagerdutyIncidentKeyArgs[index]"
                  :disabled="viewOnly"
                  placeholder="Incident Key Args"
                  @input="(val) => updatePagerdutyIncidentKeyArgs(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  :icon="Delete"
                  circle
                  plain
                  @click="removePagerdutyIncidentKeyArgsEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addPagerdutyIncidentKeyArgsEntry">
          Add Incident Key Args
        </el-button>
      </div>
    </el-popover>

    <el-form-item label="Proxy" prop="pagerdutyProxy">
      <el-input id="pagerdutyProxy" :value="pagerdutyProxy" :disabled="viewOnly" @input="pagerdutyProxy = $event" />
      <label>
        By default ElastAlert2 will not use a network proxy to send notifications to PagerDuty.
        Set this option using hostname:port if you need to use a proxy.
      </label>
    </el-form-item>

    <div v-if="groupPagerduty === 'v2'">
      <el-form-item label="Payload Class" prop="pagerdutyV2PayloadClass">
        <el-input id="pagerdutyV2PayloadClass" :value="pagerdutyV2PayloadClass" :disabled="viewOnly" @input="pagerdutyV2PayloadClass = $event" />
        <label>
          Sets the class of the payload. (the event type in PagerDuty)
        </label>
      </el-form-item>

      <el-popover v-model="popPagerdutyV2PayloadClassArgsVisible" :class="{ 'is-invalid': !popPagerdutyV2PayloadClassArgsValid }">
        <template #reference>
          <span class="pop-trigger">
            <el-tooltip v-if="pagerdutyV2PayloadClassArgs.length" :content="pagerdutyV2PayloadClassArgs.join(', ')" placement="top">
              <span>Payload Class Args ({{ pagerdutyV2PayloadClassArgs.length }})</span>
            </el-tooltip>
            <span v-else>Payload Class Args ({{ pagerdutyV2PayloadClassArgs.length }})</span>
          </span>
        </template>
        <div>
          <el-form
            ref="pagerdutyV2PayloadClassArgs"
            :model="$store.state.config.alert"
            label-position="top"
            style="width: 360px"
            @submit.prevent>
            <el-form-item
              v-for="(entry, index) in pagerdutyV2PayloadClassArgs"
              :key="index"
              :prop="`pagerdutyV2PayloadClassArgs.${index}`"
              :disabled="viewOnly"
              class="el-form-item-list"
              label=""
              required>
              <el-row :gutter="5" type="flex" justify="space-between">
                <el-col :span="20">
                  <el-input
                    v-model="pagerdutyV2PayloadClassArgs[index]"
                    :disabled="viewOnly"
                    placeholder="Payload Class Args"
                    @input="(val) => updatePagerdutyV2PayloadClassArgs(val, index)" />
                </el-col>
                <el-col :span="4">
                  <el-button
                    :disabled="viewOnly"
                    type="danger"
                    :icon="Delete"
                    circle
                    plain
                    @click="removePagerdutyV2PayloadClassArgsEntry(entry)" />
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>

          <el-button :disabled="viewOnly" class="m-n-sm" @click="addPagerdutyV2PayloadClassArgsEntry">
            Add Payload Class Args
          </el-button>
        </div>
      </el-popover>

      <el-form-item label="Payload Component" prop="pagerdutyV2PayloadComponent">
        <el-input id="pagerdutyV2PayloadComponent" :value="pagerdutyV2PayloadComponent" :disabled="viewOnly" @input="pagerdutyV2PayloadComponent = $event" />
        <label>
          Sets the component of the payload. (what program/interface/etc the event came from)
        </label>
      </el-form-item>

      <el-popover v-model="popPagerdutyV2PayloadComponentArgsVisible" :class="{ 'is-invalid': !popPagerdutyV2PayloadComponentArgsValid }">
        <template #reference>
          <span class="pop-trigger">
            <el-tooltip v-if="pagerdutyV2PayloadComponentArgs.length" :content="pagerdutyV2PayloadComponentArgs.join(', ')" placement="top">
              <span>Payload Component Args ({{ pagerdutyV2PayloadComponentArgs.length }})</span>
            </el-tooltip>
            <span v-else>Payload Component Args ({{ pagerdutyV2PayloadComponentArgs.length }})</span>
          </span>
        </template>
        <div>
          <el-form
            ref="pagerdutyV2PayloadComponentArgs"
            :model="$store.state.config.alert"
            label-position="top"
            style="width: 360px"
            @submit.prevent>
            <el-form-item
              v-for="(entry, index) in pagerdutyV2PayloadComponentArgs"
              :key="index"
              :prop="`pagerdutyV2PayloadComponentArgs.${index}`"
              :disabled="viewOnly"
              class="el-form-item-list"
              label=""
              required>
              <el-row :gutter="5" type="flex" justify="space-between">
                <el-col :span="20">
                  <el-input
                    v-model="pagerdutyV2PayloadComponentArgs[index]"
                    :disabled="viewOnly"
                    placeholder="Payload Component Args"
                    @input="(val) => updatePagerdutyV2PayloadComponentArgs(val, index)" />
                </el-col>
                <el-col :span="4">
                  <el-button
                    :disabled="viewOnly"
                    type="danger"
                    :icon="Delete"
                    circle
                    plain
                    @click="removePagerdutyV2PayloadComponentArgsEntry(entry)" />
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>

          <el-button :disabled="viewOnly" class="m-n-sm" @click="addPagerdutyV2PayloadComponentArgsEntry">
            Add Payload Component Args
          </el-button>
        </div>
      </el-popover>

      <el-form-item label="Payload Group" prop="pagerdutyV2PayloadGroup">
        <el-input id="pagerdutyV2PayloadGroup" :value="pagerdutyV2PayloadGroup" :disabled="viewOnly" @input="pagerdutyV2PayloadGroup = $event" />
        <label>
          Sets the logical grouping (e.g. app-stack)
        </label>
      </el-form-item>

      <el-popover v-model="popPagerdutyV2PayloadGroupArgsVisible" :class="{ 'is-invalid': !popPagerdutyV2PayloadGroupArgsValid }">
        <template #reference>
          <span class="pop-trigger">
            <el-tooltip v-if="pagerdutyV2PayloadGroupArgs.length" :content="pagerdutyV2PayloadGroupArgs.join(', ')" placement="top">
              <span>Payload Group Args ({{ pagerdutyV2PayloadGroupArgs.length }})</span>
            </el-tooltip>
            <span v-else>Payload Group Args ({{ pagerdutyV2PayloadGroupArgs.length }})</span>
          </span>
        </template>
        <div>
          <el-form
            ref="pagerdutyV2PayloadGroupArgs"
            :model="$store.state.config.alert"
            label-position="top"
            style="width: 360px"
            @submit.prevent>
            <el-form-item
              v-for="(entry, index) in pagerdutyV2PayloadGroupArgs"
              :key="index"
              :prop="`pagerdutyV2PayloadGroupArgs.${index}`"
              :disabled="viewOnly"
              class="el-form-item-list"
              label=""
              required>
              <el-row :gutter="5" type="flex" justify="space-between">
                <el-col :span="20">
                  <el-input
                    v-model="pagerdutyV2PayloadGroupArgs[index]"
                    :disabled="viewOnly"
                    placeholder="Payload Group Args"
                    @input="(val) => updatePagerdutyV2PayloadGroupArgs(val, index)" />
                </el-col>
                <el-col :span="4">
                  <el-button
                    :disabled="viewOnly"
                    type="danger"
                    :icon="Delete"
                    circle
                    plain
                    @click="removePagerdutyV2PayloadGroupArgsEntry(entry)" />
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>

          <el-button :disabled="viewOnly" class="m-n-sm" @click="addPagerdutyV2PayloadGroupArgsEntry">
            Add Payload Group Args
          </el-button>
        </div>
      </el-popover>

      <el-form-item label="Severity" prop="pagerdutyV2PayloadSeverity">
        <el-radio-group :value="pagerdutyV2PayloadSeverity" :disabled="viewOnly" @input="pagerdutyV2PayloadSeverity = $event">
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
        <el-input id="pagerdutyV2PayloadSource" :value="pagerdutyV2PayloadSource" :disabled="viewOnly" @input="pagerdutyV2PayloadSource = $event" />
        <label>
          Sets the source of the event, preferably the hostname or fqdn.
        </label>
      </el-form-item>

      <el-popover v-model="poppagerdutyV2PayloadSourceArgsVisible" :class="{ 'is-invalid': !poppagerdutyV2PayloadSourceArgsValid }">
        <template #reference>
          <span class="pop-trigger">
            <el-tooltip v-if="pagerdutyV2PayloadSourceArgs.length" :content="pagerdutyV2PayloadSourceArgs.join(', ')" placement="top">
              <span>Payload Source Args ({{ pagerdutyV2PayloadSourceArgs.length }})</span>
            </el-tooltip>
            <span v-else>Payload Source Args ({{ pagerdutyV2PayloadSourceArgs.length }})</span>
          </span>
        </template>
        <div>
          <el-form
            ref="pagerdutyV2PayloadSourceArgs"
            :model="$store.state.config.alert"
            label-position="top"
            style="width: 360px"
            @submit.prevent>
            <el-form-item
              v-for="(entry, index) in pagerdutyV2PayloadSourceArgs"
              :key="index"
              :prop="`pagerdutyV2PayloadSourceArgs.${index}`"
              :disabled="viewOnly"
              class="el-form-item-list"
              label=""
              required>
              <el-row :gutter="5" type="flex" justify="space-between">
                <el-col :span="20">
                  <el-input
                    v-model="pagerdutyV2PayloadSourceArgs[index]"
                    :disabled="viewOnly"
                    placeholder="Payload Source Args"
                    @input="(val) => updatePagerdutyV2PayloadSourceArgs(val, index)" />
                </el-col>
                <el-col :span="4">
                  <el-button
                    :disabled="viewOnly"
                    type="danger"
                    :icon="Delete"
                    circle
                    plain
                    @click="removePagerdutyV2PayloadSourceArgsEntry(entry)" />
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>

          <el-button :disabled="viewOnly" class="m-n-sm" @click="addPagerdutyV2PayloadSourceArgsEntry">
            Add Payload Source Args
          </el-button>
        </div>
      </el-popover>

      <el-form-item label="Payload include All Info" prop="pagerdutyV2PayloadIncludeAllInfo">
        <el-switch
          id="pagerdutyV2PayloadIncludeAllInfo"
          :value="pagerdutyV2PayloadIncludeAllInfo"
          :disabled="viewOnly"
          @change="changePagerdutyV2PayloadIncludeAllInfo" />
      </el-form-item>
    </div>

    <el-form-item label="Ignore SSL Errors" prop="pagerdutyIgnoreSslErrors">
      <el-switch
        id="pagerdutyIgnoreSslErrors"
        :value="pagerdutyIgnoreSslErrors"
        :disabled="viewOnly"
        @change="changeSlackIgnoreSslErrors" />
    </el-form-item>

    <el-form-item label="CA Certs" prop="pagerdutyCaCerts">
      <el-switch
        id="pagerdutyCaCerts"
        :value="pagerdutyCaCerts"
        :disabled="viewOnly"
        @change="changeSlackCaCerts" />
    </el-form-item>
  </div>
</template>

<script>

export default {
  props: ['viewOnly'],
  emits: ['validate'],

  data() {
    let groupPagerdutyValue;
    if (typeof this.$store.state.config.alert.pagerdutyApiVersion === 'undefined' || this.$store.state.config.alert.pagerdutyApiVersion === '') {
      groupPagerdutyValue = 'v1';
    } else {
      groupPagerdutyValue = this.$store.state.config.alert.pagerdutyApiVersion;
    }
    return {
      popPagerdutyIncidentKeyArgsVisible: false,
      popPagerdutyIncidentKeyArgsValid: true,
      popPagerdutyV2PayloadClassArgsVisible: false,
      popPagerdutyV2PayloadClassArgsValid: true,
      popPagerdutyV2PayloadComponentArgsVisible: false,
      popPagerdutyV2PayloadComponentArgsValid: true,
      popPagerdutyV2PayloadGroupArgsVisible: false,
      popPagerdutyV2PayloadGroupArgsValid: true,
      poppagerdutyV2PayloadSourceArgsVisible: false,
      poppagerdutyV2PayloadSourceArgsValid: true,
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

    pagerdutyIncidentKeyArgs: {
      get() {
        return this.$store.state.config.alert.pagerdutyIncidentKeyArgs;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_PAGERDUTY_INCIDENT_KEY_ARGS', value);
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

    pagerdutyV2PayloadClassArgs: {
      get() {
        return this.$store.state.config.alert.pagerdutyV2PayloadClassArgs;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_pagerduty_v2_payload_class_args', value);
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

    pagerdutyV2PayloadComponentArgs: {
      get() {
        return this.$store.state.config.alert.pagerdutyV2PayloadComponentArgs;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_pagerduty_v2_payload_component_args', value);
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

    pagerdutyV2PayloadGroupArgs: {
      get() {
        return this.$store.state.config.alert.pagerdutyV2PayloadGroupArgs;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_PAGERDUTY_V2_PAYLOAD_GROUP_ARGS', value);
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

    pagerdutyV2PayloadSourceArgs: {
      get() {
        return this.$store.state.config.alert.pagerdutyV2PayloadSourceArgs;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_pagerduty_v2_payload_source_args', value);
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

    pagerdutyIgnoreSslErrors: {
      get() {
        return this.$store.state.config.alert.pagerdutyIgnoreSslErrors;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_PAGERDUTY_IGNORE_SSL_ERRORS',
          value
        );
      }
    },

    pagerdutyCaCerts: {
      get() {
        return this.$store.state.config.alert.pagerdutyCaCerts;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_PAGERDUTY_CA_CERTS',
          value
        );
      }
    },
  },

  methods: {
    async validate() {
      try {
        if (this.$refs.pagerdutyIncidentKeyArgs) {
          await this.validatePagerdutyIncidentKeyArgs();
        }
        if (this.$refs.pagerdutyV2PayloadClassArgs) {
          await this.validatePagerdutyV2PayloadClassArgs();
        }
        if (this.$refs.pagerdutyV2PayloadComponentArgs) {
          await this.validatePagerdutyV2PayloadComponentArgs();
        }
        if (this.$refs.pagerdutyV2PayloadGroupArgs) {
          await this.validatePagerdutyV2PayloadGroupArgs();
        }
        if (this.$refs.pagerdutyV2PayloadSourceArgs) {
          await this.validatePagerdutyV2PayloadSourceArgs();
        }
        this.$emit('validate', true);
        return true;
      } catch (error) {
        this.$emit('validate', false);
        return false;
      }
    },

    async validatePagerdutyIncidentKeyArgs() {
      if (!this.pagerdutyIncidentKeyArgs.length) {
        this.popPagerdutyIncidentKeyArgsValid = false;
        return;
      }
      try {
        this.popPagerdutyIncidentKeyArgsValid = await this.$refs.pagerdutyIncidentKeyArgs.validate();
      } catch (error) {
        this.popPagerdutyIncidentKeyArgsValid = false;
        throw error;
      }
    },
    updatePagerdutyIncidentKeyArgs(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_PAGERDUTY_INCIDENT_KEY_ARGS_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },
    removePagerdutyIncidentKeyArgsEntry(entry) {
      this.$store.commit('config/alert/REMOVE_PAGERDUTY_INCIDENT_KEY_ARGS_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },
    addPagerdutyIncidentKeyArgsEntry() {
      this.$store.commit('config/alert/ADD_PAGERDUTY_INCIDENT_KEY_ARGS_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    async validatePagerdutyV2PayloadClassArgs() {
      if (!this.pagerdutyV2PayloadClassArgs.length) {
        this.popPagerdutyV2PayloadClassArgsValid = false;
        return;
      }
      try {
        this.popPagerdutyV2PayloadClassArgsValid = await this.$refs.pagerdutyV2PayloadClassArgs.validate();
      } catch (error) {
        this.popPagerdutyV2PayloadClassArgsValid = false;
        throw error;
      }
    },
    updatePagerdutyV2PayloadClassArgs(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_PAGERDUTY_V2_PAYLOAD_CLASS_ARGS_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },
    removePagerdutyV2PayloadClassArgsEntry(entry) {
      this.$store.commit('config/alert/REMOVE_PAGERDUTY_V2_PAYLOAD_CLASS_ARGS_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },
    addPagerdutyV2PayloadClassArgsEntry() {
      this.$store.commit('config/alert/ADD_PAGERDUTY_V2_PAYLOAD_CLASS_ARGS_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    async validatePagerdutyV2PayloadComponentArgs() {
      if (!this.pagerdutyV2PayloadComponentArgs.length) {
        this.popPagerdutyV2PayloadComponentArgsValid = false;
        return;
      }
      try {
        this.popPagerdutyV2PayloadComponentArgsValid = await this.$refs.pagerdutyV2PayloadComponentArgs.validate();
      } catch (error) {
        this.popPagerdutyV2PayloadComponentArgsValid = false;
        throw error;
      }
    },
    updatePagerdutyV2PayloadComponentArgs(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_PAGERDUTY_V2_PAYLOAD_COMPONENT_ARGS_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },
    removePagerdutyV2PayloadComponentArgsEntry(entry) {
      this.$store.commit('config/alert/REMOVE_PAGERDUTY_V2_PAYLOAD_COMPONENT_ARGS_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },
    addPagerdutyV2PayloadComponentArgsEntry() {
      this.$store.commit('config/alert/ADD_PAGERDUTY_V2_PAYLOAD_COMPONENT_ARGS_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    async validatePagerdutyV2PayloadGroupArgs() {
      if (!this.pagerdutyV2PayloadGroupArgs.length) {
        this.popPagerdutyV2PayloadGroupArgsValid = false;
        return;
      }
      try {
        this.popPagerdutyV2PayloadGroupArgsValid = await this.$refs.pagerdutyV2PayloadGroupArgs.validate();
      } catch (error) {
        this.popPagerdutyV2PayloadGroupArgsValid = false;
        throw error;
      }
    },
    updatePagerdutyV2PayloadGroupArgs(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_PAGERDUTY_V2_PAYLOAD_GROUP_ARGS_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },
    removePagerdutyV2PayloadGroupArgsEntry(entry) {
      this.$store.commit('config/alert/REMOVE_PAGERDUTY_V2_PAYLOAD_GROUP_ARGS_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },
    addPagerdutyV2PayloadGroupArgsEntry() {
      this.$store.commit('config/alert/ADD_PAGERDUTY_V2_PAYLOAD_GROUP_ARGS_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    async validatePagerdutyV2PayloadSourceArgs() {
      if (!this.pagerdutyV2PayloadSourceArgs.length) {
        this.poppagerdutyV2PayloadSourceArgsValid = false;
        return;
      }
      try {
        this.poppagerdutyV2PayloadSourceArgsValid = await this.$refs.pagerdutyV2PayloadSourceArgs.validate();
      } catch (error) {
        this.poppagerdutyV2PayloadSourceArgsValid = false;
        throw error;
      }
    },
    updatePagerdutyV2PayloadSourceArgs(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_PAGERDUTY_V2_PAYLOAD_SOURCE_ARGS_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },
    removePagerdutyV2PayloadSourceArgsEntry(entry) {
      this.$store.commit('config/alert/REMOVE_PAGERDUTY_V2_PAYLOAD_SOURCE_ARGS_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },
    addPagerdutyV2PayloadSourceArgsEntry() {
      this.$store.commit('config/alert/ADD_PAGERDUTY_V2_PAYLOAD_SOURCE_ARGS_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

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
      this.pagerdutyV2PayloadIncludeAllInfo = val;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
