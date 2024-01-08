<template>
  <div>
    <praeco-form-item label="Zbx Sender Host" prop="zbxSenderHost" required>
      <el-input id="zbxSenderHost" :value="zbxSenderHost" :disabled="viewOnly" @input="zbxSenderHost = $event" />
      <label>The address where zabbix server is running.</label>
    </praeco-form-item>

    <praeco-form-item label="Zbx Sender Port" prop="zbxSenderPort" required>
      <el-input-number id="zbxSenderPort" :value="zbxSenderPort" :disabled="viewOnly" @input="zbxSenderPort = $event" />
      <label>The port where zabbix server is listenning.</label>
    </praeco-form-item>

    <praeco-form-item label="ZbxHost" prop="zbxHost" required>
      <el-input id="zbxHost" :value="zbxHost" :disabled="viewOnly" @input="zbxHost = $event" />
      <label>This field setup the host in zabbix that receives the value sent by ElastAlert 2.</label>
    </praeco-form-item>

    <praeco-form-item label="ZbxKey" prop="zbxKey" required>
      <el-input id="zbxKey" :value="zbxKey" :disabled="viewOnly" @input="zbxKey = $event" />
      <label>This field setup the key in the host that receives the value sent by ElastAlert 2.</label>
    </praeco-form-item>

    <el-form-item label="Host From Field" prop="zbxHostFromField">
      <el-switch
        id="zbxHostFromField"
        :value="zbxHostFromField"
        :disabled="viewOnly"
        @change="changeZbxHostFromField" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: ['viewOnly'],

  computed: {
    zbxSenderHost: {
      get() {
        return this.$store.state.config.alert.zbxSenderHost;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ZBX_SENDER_HOST',
          value
        );
      }
    },

    zbxSenderPort: {
      get() {
        return this.$store.state.config.alert.zbxSenderPort;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ZBX_SENDER_PORT',
          value
        );
      }
    },

    zbxHost: {
      get() {
        return this.$store.state.config.alert.zbxHost;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ZBX_HOST',
          value
        );
      }
    },

    zbxKey: {
      get() {
        return this.$store.state.config.alert.zbxKey;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ZBX_KEY',
          value
        );
      }
    },

    zbxHostFromField: {
      get() {
        return this.$store.state.config.alert.zbxHostFromField;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ZBX_HOST_FROM_FIELD',
          value
        );
      }
    }
  },

  methods: {
    changeZbxHostFromField(val) {
      this.zbxHostFromField = val;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
