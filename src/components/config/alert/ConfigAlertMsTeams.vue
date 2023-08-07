<template>
  <div>
    <el-popover v-model="popMsTeaMsWebhookUrlVisible" :class="{ 'is-invalid': !popMsTeamsWebhookUrlValid }">
      <template #reference>
        <span class="pop-trigger">
          <el-tooltip v-if="msTeamsWebhookUrl.length" :content="msTeamsWebhookUrl.join(', ')" placement="top">
            <span>MsTeamsWebhookUrls ({{ msTeamsWebhookUrl.length }})</span>
          </el-tooltip>
          <span v-else>MsTeamsWebhookUrls ({{ msTeamsWebhookUrl.length }})</span>
        </span>
      </template>
      <template>
        <el-form
          ref="msTeamsWebhookUrl"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in msTeamsWebhookUrl"
            :key="index"
            :prop="'msTeamsWebhookUrl.' + index"
            :disabled="viewOnly"
            class="el-form-item-list"
            label="">
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="msTeamsWebhookUrl[index]"
                  :disabled="viewOnly"
                  placeholder="WebhookUrl"
                  @input="(val) => updateMsTeamsWebhookUrl(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="removeMsTeamsWebhookUrlEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addMsTeamsWebhookUrlEntry">
          Add WebhookUrl
        </el-button>
      </template>
    </el-popover>

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
  emits: ['validate'],

  data() {
    return {
      popMsTeaMsWebhookUrlVisible: false,
      popMsTeamsWebhookUrlValid: true,
    };
  },

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
    async validate() {
      try {
        if (this.$refs.msTeamsWebhookUrl) {
          await this.validateMsTeamsWebhookUrl();
        }
        this.$emit('validate', true);
        return true;
      } catch (error) {
        this.$emit('validate', false);
        return false;
      }
    },

    async validateMsTeamsWebhookUrl() {
      if (!this.msTeamsWebhookUrl.length) {
        this.popMsTeamsWebhookUrlValid = false;
        return;
      }
      try {
        this.popMsTeamsWebhookUrlValid = await this.$refs.msTeamsWebhookUrl.validate();
      } catch (error) {
        this.popMsTeamsWebhookUrlValid = false;
        throw error;
      }
    },

    updateMsTeamsWebhookUrl(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_MS_TEAMS_WEBHOOK_URL_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removeMsTeamsWebhookUrlEntry(entry) {
      this.$store.commit('config/alert/REMOVE_MS_TEAMS_WEBHOOK_URL_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addMsTeamsWebhookUrlEntry() {
      this.$store.commit('config/alert/ADD_MS_TEAMS_WEBHOOK_URL_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

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
