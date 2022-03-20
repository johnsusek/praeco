<template>
  <div>
    <el-form-item label="Team webhook" prop="msTeamsWebhookUrl" required>
      <el-input v-model="msTeamsWebhookUrl" :disabled="viewOnly" />
      <label>
        See<a href="https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook">
          https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook</a>
      </label>
    </el-form-item>

    <el-form-item label="Color" prop="msTeamsThemeColor" required>
      <el-color-picker v-model="msTeamsThemeColor" :disabled="viewOnly" />
    </el-form-item>

    <el-form-item label="Alert Summary" prop="msTeamsAlertSummary" required>
      <el-input v-model="msTeamsAlertSummary" :disabled="viewOnly" />
      <label>
        Summary should be configured according to MS documentation, although it seems not displayed by Teams currently.
      </label>
    </el-form-item>

    <el-form-item label="Alert Fixed Width" prop="msTeamsAlertFixedWidth">
      <el-switch
        id="msTeamsAlertFixedWidth"
        v-model="msTeamsAlertFixedWidth"
        :disabled="viewOnly"
        @change="changemsTeamsAlertFixedWidth" />
      <label>
        By default this is False and the notification will be sent to MS Teams as-is.
        Teams supports a partial Markdown implementation, which means asterisk, underscore and other characters may be interpreted as Markdown.
        Currenlty, Teams does not fully implement code blocks. Setting this attribute to True will enable line by line code blocks.
        It is recommended to enable this to get clearer notifications in Teams.
      </label>
    </el-form-item>

    <el-form-item label="Proxy" prop="msTeamsProxy">
      <el-input v-model="msTeamsProxy" :disabled="viewOnly" />
      <label>
        By default ElastAlert 2 will not use a network proxy to send notifications to MS Teams.
        Set this option using hostname:port if you need to use a proxy.
      </label>
    </el-form-item>

    <el-form-item label="Attach Kibana Discover URL" prop="msTeamsAttachKibanaDiscoverUrl">
      <el-switch
        id="msTeamsAttachKibanaDiscoverUrl"
        v-model="msTeamsAttachKibanaDiscoverUrl"
        :disabled="viewOnly"
        @change="changeMsTeamsAttachKibanaDiscoverUrl" />
    </el-form-item>

    <el-form-item label="Kibana Discover Title" prop="msTeamsKibanaDiscoverTitle">
      <el-input v-model="msTeamsKibanaDiscoverTitle" :disabled="viewOnly" />
      <label>The title of the Kibana Discover url attachment.</label>
    </el-form-item>

    <el-form-item label="Ignore SSL Errors" prop="msTeamsIgnoreSslErrors">
      <el-switch
        id="msTeamsIgnoreSslErrors"
        v-model="msTeamsIgnoreSslErrors"
        :disabled="viewOnly"
        @change="changeMsTeamsIgnoreSslErrors" />
    </el-form-item>

    <el-form-item label="CA Certs" prop="msTeamsCaCerts">
      <el-switch
        id="msTeamsCaCerts"
        v-model="msTeamsCaCerts"
        :disabled="viewOnly"
        @change="changeMsTeamsCaCerts" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: ['viewOnly'],

  computed: {
    msTeamsWebhookUrl: {
      get() {
        return this.$store.state.config.alert.msTeamsWebhookUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_TEAMS_WEBHOOK_URL', value);
      }
    },

    msTeamsThemeColor: {
      get() {
        return this.$store.state.config.alert.msTeamsThemeColor;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_TEAMS_THEME_COLOR', value);
      }
    },

    msTeamsAlertFixedWidth: {
      get() {
        return this.$store.state.config.alert.msTeamsAlertFixedWidth;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_TEAMS_ALERT_FIXED_WIDTH', value);
      }
    },

    msTeamsAlertSummary: {
      get() {
        return this.$store.state.config.alert.msTeamsAlertSummary;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_TEAMS_ALERT_SUMMARY', value);
      }
    },

    msTeamsProxy: {
      get() {
        return this.$store.state.config.alert.msTeamsProxy;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_TEAMS_PROXY', value);
      }
    },

    msTeamsIgnoreSslErrors: {
      get() {
        return this.$store.state.config.alert.msTeamsIgnoreSslErrors;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MS_TEAMS_IGNORE_SSL_ERRORS',
          value
        );
      }
    },

    msTeamsCaCerts: {
      get() {
        return this.$store.state.config.alert.msTeamsCaCerts;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MS_TEAMS_CA_CERTS',
          value
        );
      }
    },

    msTeamsAttachKibanaDiscoverUrl: {
      get() {
        return this.$store.state.config.alert.msTeamsAttachKibanaDiscoverUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_TEAMS_ATTACH_KIBANA_DISCOVER_URL', value);
      }
    },

    msTeamsKibanaDiscoverTitle: {
      get() {
        return this.$store.state.config.alert.msTeamsKibanaDiscoverTitle;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_TEAMS_KIBANA_DISCOVER_TITLE', value);
      }
    }
  },

  methods: {
    changemsTeamsAlertFixedWidth(val) {
      if (val) {
        this.msTeamsAlertFixedWidth = true;
      } else {
        this.msTeamsAlertFixedWidth = false;
      }
    },

    changeMsTeamsIgnoreSslErrors(val) {
      if (val) {
        this.msTeamsIgnoreSslErrors = true;
      } else {
        this.msTeamsIgnoreSslErrors = false;
      }
    },

    changeMsTeamsAttachKibanaDiscoverUrl(val) {
      if (val) {
        this.msTeamsAttachKibanaDiscoverUrl = true;
      } else {
        this.msTeamsAttachKibanaDiscoverUrl = false;
      }
    },

    changeMsTeamsCaCerts(val) {
      if (val) {
        this.msTeamsCaCerts = true;
      } else {
        this.msTeamsCaCerts = false;
      }
    }
  }
};
</script>

<style lang="scss">
</style>
