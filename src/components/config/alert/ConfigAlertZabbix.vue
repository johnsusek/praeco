<template>
  <div>
    <praeco-form-item label="Zbx Sender Host" prop="zbxSenderHost" required>
      <el-input id="zbxSenderHost" v-model="zbxSenderHost" :disabled="viewOnly" />
      <label>The address where zabbix server is running.</label>
    </praeco-form-item>

    <praeco-form-item label="Zbx Sender Port" prop="zbxSenderPort" required>
      <el-input-number id="zbxSenderPort" v-model="zbxSenderPort" :disabled="viewOnly" />
      <label>The port where zabbix server is listenning.</label>
    </praeco-form-item>

    <praeco-form-item label="ZbxHost" prop="zbxHost" required>
      <el-input id="zbxHost" v-model="zbxHost" :disabled="viewOnly" />
      <label>This field setup the host in zabbix that receives the value sent by ElastAlert 2.</label>
    </praeco-form-item>

    <praeco-form-item label="ZbxKey" prop="zbxKey" required>
      <el-input id="zbxKey" v-model="zbxKey" :disabled="viewOnly" />
      <label>This field setup the key in the host that receives the value sent by ElastAlert 2.</label>
    </praeco-form-item>
  </div>
</template>

<script>
export default {
  components: {
  },

  props: ['viewOnly'],

  data() {
    return {
      rules: {
      }
    };
  },

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
    }
  },

  methods: {
  }
};
</script>

<style lang="scss">
</style>
