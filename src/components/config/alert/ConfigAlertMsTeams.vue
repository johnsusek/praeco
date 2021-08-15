<template>
  <div>
    <el-form-item label="Team webhook" prop="ms_teamsWebhookUrl" required>
      <el-input id="ms_teamsWebhookUrl" v-model="ms_teamsWebhookUrl" :disabled="viewOnly" />
      <label>
        See<a href="https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook">
          https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook</a>
      </label>
    </el-form-item>

    <el-form-item label="Color" prop="ms_teamsThemeColor" required>
      <el-color-picker id="ms_teamsThemeColor" v-model="ms_teamsThemeColor" :disabled="viewOnly" />
    </el-form-item>

    <el-form-item label="Alert Summary" prop="ms_teamsAlertSummary" required>
      <el-input id="ms_teamsAlertSummary" v-model="ms_teamsAlertSummary" :disabled="viewOnly" />
      <label>
        Summary should be configured according to MS documentation, although it seems not displayed by Teams currently.
      </label>
    </el-form-item>

    <el-form-item label="Alert Fixed Width" prop="ms_teamsAlertFixedWidth">
      <el-switch
        id="ms_teamsAlertFixedWidth"
        v-model="ms_teamsAlertFixedWidth"
        :disabled="viewOnly"
        @change="changemsTeamsAlertFixedWidth" />
      <label>
        By default this is False and the notification will be sent to MS Teams as-is.
        Teams supports a partial Markdown implementation, which means asterisk, underscore and other characters may be interpreted as Markdown.
        Currenlty, Teams does not fully implement code blocks. Setting this attribute to True will enable line by line code blocks.
        It is recommended to enable this to get clearer notifications in Teams.
      </label>
    </el-form-item>

    <el-form-item label="Proxy" prop="ms_teamsProxy">
      <el-input id="ms_teamsProxy" v-model="ms_teamsProxy" :disabled="viewOnly" />
      <label>
        By default ElastAlert 2 will not use a network proxy to send notifications to MS Teams.
        Set this option using hostname:port if you need to use a proxy.
      </label>
    </el-form-item>
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
    ms_teamsWebhookUrl: {
      get() {
        return this.$store.state.config.alert.ms_teamsWebhookUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_TEAMS_WEBHOOK_URL', value);
      }
    },

    ms_teamsThemeColor: {
      get() {
        return this.$store.state.config.alert.ms_teamsThemeColor;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_TEAMS_THEME_COLOR', value);
      }
    },

    ms_teamsAlertFixedWidth: {
      get() {
        return this.$store.state.config.alert.ms_teamsAlertFixedWidth;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_TEAMS_ALERT_FIXED_WIDTH', value);
      }
    },

    ms_teamsAlertSummary: {
      get() {
        return this.$store.state.config.alert.ms_teamsAlertSummary;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_TEAMS_ALERT_SUMMARY', value);
      }
    },

    ms_teamsProxy: {
      get() {
        return this.$store.state.config.alert.ms_teamsProxy;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_TEAMS_PROXY', value);
      }
    }
  },

  methods: {
    changemsTeamsAlertFixedWidth(val) {
      if (val) {
        this.ms_teamsAlertFixedWidth = true;
      } else {
        this.ms_teamsAlertFixedWidth = false;
      }
    }
  }
};
</script>

<style lang="scss">
</style>
