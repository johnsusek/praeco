<template>
  <div>
    <el-form-item label="opsgenie_key" prop="opsgenieKey" required>
      <el-input v-model="opsgenieKey" :disabled="viewOnly" @update:model-value="opsgenieKey = $event" />
      <label>
        The randomly generated API Integration key created by OpsGenie.
      </label>
    </el-form-item>

    <el-form-item label="opsgenie_account" prop="opsgenieAccount">
      <el-input v-model="opsgenieAccount" :disabled="viewOnly" @update:model-value="opsgenieAccount = $event" />
      <label>
        The randomly generated API Integration key created by OpsGenie.
      </label>
    </el-form-item>

    <el-form-item label="opsgenie_message" prop="opsgenieMessage">
      <el-input v-model="opsgenieMessage" :disabled="viewOnly" @update:model-value="opsgenieMessage = $event" />
      <label>
        Set the OpsGenie message to something other than the rule name. The message can be formatted with fields from the first match e.g. “Error occurred for {app_name} at {timestamp}.”.
      </label>
    </el-form-item>

    <el-form-item label="opsgenie_subject" prop="opsgenieSubject">
      <el-input v-model="opsgenieSubject" :disabled="viewOnly" @update:model-value="opsgenieSubject = $event" />
      <label>
        A string used to create the title of the OpsGenie alert. Can use Python string formatting.
      </label>
    </el-form-item>

    <el-form-item label="opsgenie_alias" prop="opsgenieAlias">
      <el-input v-model="opsgenieAlias" :disabled="viewOnly" @update:model-value="opsgenieAlias = $event" />
      <label>
        Set the OpsGenie alias. The alias can be formatted with fields from the first match e.g “{app_name} error”.
      </label>
    </el-form-item>

    <el-form-item label="opsgenie_proxy" prop="opsgenieProxy">
      <el-input v-model="opsgenieProxy" :disabled="viewOnly" @update:model-value="opsgenieProxy = $event" />
      <label>
        By default ElastAlert 2 will not use a network proxy to send notifications to OpsGenie. Set this option using hostname:port if you need to use a proxy. only supports https.
      </label>
    </el-form-item>

    <el-form-item label="opsgenie_description" prop="opsgenieDescription">
      <el-input v-model="opsgenieDescription" :disabled="viewOnly" @update:model-value="opsgenieDescription = $event" />
      <label>
        Set the OpsGenie description to something other than the rule body. The message can be formatted with fields from the first match e.g. “Error occurred for {app_name} at {timestamp}.”.
      </label>
    </el-form-item>

    <el-form-item label="opsgenie_priority" prop="opsgeniePriority">
      <el-radio-group v-model="opsgeniePriority" :disabled="viewOnly" @update:model-value="opsgeniePriority = $event">
        <el-radio id="opsgeniePriorityP1" label="P1" border>
          P1
        </el-radio>
        <el-radio id="opsgeniePriorityP2" label="P2" border>
          P2
        </el-radio>
        <el-radio id="opsgeniePriorityP3" label="P3" border>
          P3
        </el-radio>
        <el-radio id="opsgeniePriorityP4" label="P4" border>
          P4
        </el-radio>
        <el-radio id="opsgeniePriorityP5" label="P5" border>
          P5
        </el-radio>
      </el-radio-group>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: ['viewOnly'],

  computed: {
    opsgenieKey: {
      get() {
        return this.$store.state.config.alert.opsgenieKey;
      },
      set(value) {
        this.$store.commit(
          'config/alert/OPSGENIE_KEY',
          value
        );
      }
    },

    opsgenieAccount: {
      get() {
        return this.$store.state.config.alert.opsgenieAccount;
      },
      set(value) {
        this.$store.commit(
          'config/alert/OPSGENIE_ACCOUNT',
          value
        );
      }
    },

    opsgenieMessage: {
      get() {
        return this.$store.state.config.alert.opsgenieMessage;
      },
      set(value) {
        this.$store.commit(
          'config/alert/OPSGENIE_MESSAGE',
          value
        );
      }
    },

    opsgenieSubject: {
      get() {
        return this.$store.state.config.alert.opsgenieSubject;
      },
      set(value) {
        this.$store.commit(
          'config/alert/OPSGENIE_SUBJECT',
          value
        );
      }
    },

    opsgenieAlias: {
      get() {
        return this.$store.state.config.alert.opsgenieAlias;
      },
      set(value) {
        this.$store.commit(
          'config/alert/OPSGENIE_ALIAS',
          value
        );
      }
    },

    opsgenieProxy: {
      get() {
        return this.$store.state.config.alert.opsgenieProxy;
      },
      set(value) {
        this.$store.commit(
          'config/alert/OPSGENIE_PROXY',
          value
        );
      }
    },

    opsgenieDescription: {
      get() {
        return this.$store.state.config.alert.opsgenieDescription;
      },
      set(value) {
        this.$store.commit(
          'config/alert/OPSGENIE_DESCRIPTION',
          value
        );
      }
    },

    opsgeniePriority: {
      get() {
        return this.$store.state.config.alert.opsgeniePriority;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_OPSGENIE_PRIORITY', value);
      }
    },
  },

  methods: {
  }
};
</script>

<style lang="scss" scoped>
</style>
