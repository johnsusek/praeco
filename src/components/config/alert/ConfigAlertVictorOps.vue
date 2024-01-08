<template>
  <div>
    <praeco-form-item label="Api Key" prop="victoropsApiKey" required>
      <el-input id="victoropsApiKey" :value="victoropsApiKey" :disabled="viewOnly" @input="victoropsApiKey = $event" />
      <label>API key generated under the ‘REST Endpoint’ in the Integrations settings.</label>
    </praeco-form-item>

    <praeco-form-item label="Routing Key" prop="victoropsRoutingKey" required>
      <el-input id="victoropsRoutingKey" :value="victoropsRoutingKey" :disabled="viewOnly" @input="victoropsRoutingKey = $event" />
      <label>VictorOps routing key to route the alert to.</label>
    </praeco-form-item>

    <praeco-form-item label="Message Type" prop="victoropsMessageType" required>
      <el-radio-group :value="victoropsMessageType" :disabled="viewOnly" @input="victoropsMessageType = $event">
        <el-radio id="victoropsMessageTypeInfo" label="INFO" border>
          INFO
        </el-radio>
        <el-radio id="victoropsMessageTypeWarning" label="WARNING" border>
          WARNING
        </el-radio>
        <el-radio id="victoropsMessageTypeAcknowledgement" label="ACKNOWLEDGEMENT" border>
          ACKNOWLEDGEMENT
        </el-radio>
        <el-radio id="victoropsMessageTypeCritical" label="CRITICAL" border>
          CRITICAL
        </el-radio>
        <el-radio id="victoropsMessageTypeRecovery" label="RECOVERY" border>
          RECOVERY
        </el-radio>
      </el-radio-group>
      <label>
        VictorOps field to specify severity level.
        Must be one of the following: INFO, WARNING, ACKNOWLEDGEMENT, CRITICAL, RECOVERY
      </label>
    </praeco-form-item>

    <praeco-form-item label="Entity Id" prop="victoropsEntityId">
      <el-input id="victoropsEntityId" :value="victoropsEntityId" :disabled="viewOnly" @input="victoropsEntityId = $event" />
      <label>
        The identity of the incident used by VictorOps to correlate incidents throughout the alert lifecycle.
        If not defined, VictorOps will assign a random string to each alert.
        /label>
      </label>
    </praeco-form-item>

    <praeco-form-item label="Entity Display Name" prop="victoropsEntityDisplayName">
      <el-input id="victoropsEntityDisplayName" :value="victoropsEntityDisplayName" :disabled="viewOnly" @input="victoropsEntityDisplayName = $event" />
      <label>Human-readable name of alerting entity to summarize incidents without affecting the life-cycle workflow.</label>
    </praeco-form-item>

    <praeco-form-item label="Proxy" prop="victoropsProxy">
      <el-input id="victoropsProxy" :value="victoropsProxy" :disabled="viewOnly" @input="victoropsProxy = $event" />
      <label>
        By default ElastAlert 2 will not use a network proxy to send notifications to VictorOps.
        Set this option using hostname:port if you need to use a proxy.
      </label>
    </praeco-form-item>
  </div>
</template>

<script>
export default {
  props: ['viewOnly'],

  computed: {
    victoropsApiKey: {
      get() {
        return this.$store.state.config.alert.victoropsApiKey;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_VICTOROPS_API_KEY',
          value
        );
      }
    },

    victoropsRoutingKey: {
      get() {
        return this.$store.state.config.alert.victoropsRoutingKey;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_VICTOROPS_ROUTING_KEY',
          value
        );
      }
    },

    victoropsMessageType: {
      get() {
        return this.$store.state.config.alert.victoropsMessageType;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_VICTOROPS_MESSAGE_TYPE',
          value
        );
      }
    },

    victoropsEntityId: {
      get() {
        return this.$store.state.config.alert.victoropsEntityId;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_VICTOROPS_ENTITY_ID',
          value
        );
      }
    },

    victoropsEntityDisplayName: {
      get() {
        return this.$store.state.config.alert.victoropsEntityDisplayName;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_VICTOROPS_ENTITY_DISPLAY_NAME',
          value
        );
      }
    },

    victoropsProxy: {
      get() {
        return this.$store.state.config.alert.victoropsProxy;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_VICTOROPS_PROXY',
          value
        );
      }
    }
  },

  methods: {
  }
};
</script>

<style lang="scss" scoped>
</style>
