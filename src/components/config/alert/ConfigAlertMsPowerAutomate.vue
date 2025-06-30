<template>
  <div>
    <el-popover v-model="popMsPowerAutomatesWebhookUrlVisible" :class="{ 'is-invalid': !popMsPowerAutomateWebhookUrlValid }">
      <template #reference>
        <span class="pop-trigger">
          <el-tooltip v-if="msPowerAutomateWebhookUrl.length" :content="msPowerAutomateWebhookUrl.join(', ')" placement="top">
            <span>MsPowerAutomateWebhookUrls ({{ msPowerAutomateWebhookUrl.length }})</span>
          </el-tooltip>
          <span v-else>MsPowerAutomateWebhookUrls ({{ msPowerAutomateWebhookUrl.length }})</span>
        </span>
      </template>
      <div>
        <el-form
          ref="msPowerAutomateWebhookUrl"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in msPowerAutomateWebhookUrl"
            :key="index"
            :prop="`msPowerAutomateWebhookUrl.${index}`"
            :disabled="viewOnly"
            class="el-form-item-list"
            label="">
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="msPowerAutomateWebhookUrl[index]"
                  :disabled="viewOnly"
                  placeholder="WebhookUrl"
                  @input="(val) => updateMsPowerAutomateWebhookUrl(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  :icon="Delete"
                  circle
                  plain
                  @click="removeMsPowerAutomateWebhookUrlEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addMsPowerAutomateWebhookUrlEntry">
          Add WebhookUrl
        </el-button>
      </div>
    </el-popover>

    <el-form-item label="Alert Summary" prop="msPowerAutomateAlertSummary">
      <el-input :value="msPowerAutomateAlertSummary" :disabled="viewOnly" @input="msPowerAutomateAlertSummary = $event" />
      <label>
        Summary should be configured according to MS documentation, although it seems not displayed by PowerAutomate currently.
      </label>
    </el-form-item>

    <el-form-item label="Card Width Full" prop="msPowerAutomateTeamsCardWidthFull">
      <el-switch
        id="msPowerAutomateTeamsCardWidthFull"
        :value="msPowerAutomateTeamsCardWidthFull"
        :disabled="viewOnly"
        @change="changemsPowerAutomateTeamsCardWidthFull" />
      <label>
        By default, this is False and the notification will be sent to MS Teams without rendering full width in Microsoft Teams.
        Setting this attribute to True will render the alert in full width.
      </label>
    </el-form-item>

    <el-form-item label="Summary Text Size" prop="msPowerAutomateSummaryTextSize">
      <el-radio-group :value="msPowerAutomateSummaryTextSize" :disabled="viewOnly" @input="msPowerAutomateSummaryTextSize = $event">
        <el-radio id="msPowerAutomateSummaryTextSizeDefault" label="default">
          Default
        </el-radio>
        <el-radio id="msPowerAutomateSummaryTextSizeSmall" label="small">
          Small
        </el-radio>
        <el-radio id="msPowerAutomateSummaryTextSizeMedium" label="medium">
          Medium
        </el-radio>
        <el-radio id="msPowerAutomateSummaryTextSizeLarge" label="large">
          Large
        </el-radio>
        <el-radio id="msPowerAutomateSummaryTextSizeExtraLarge" label="extraLarge">
          ExtraLarge
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="Body Text Size" prop="msPowerAutomateBodyTextSize">
      <el-radio-group :value="msPowerAutomateBodyTextSize" :disabled="viewOnly" @input="msPowerAutomateBodyTextSize = $event">
        <el-radio id="msPowerAutomateBodyTextSizeDefault" label="default">
          Default
        </el-radio>
        <el-radio id="msPowerAutomateBodyTextSizeSmall" label="small">
          Small
        </el-radio>
        <el-radio id="msPowerAutomateBodyTextSizeMedium" label="medium">
          Medium
        </el-radio>
        <el-radio id="msPowerAutomateBodyTextSizeLarge" label="large">
          Large
        </el-radio>
        <el-radio id="msPowerAutomateBodyTextSizeExtraLarge" label="extraLarge">
          ExtraLarge
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="Proxy" prop="msPowerAutomateProxy">
      <el-input :value="msPowerAutomateProxy" :disabled="viewOnly" @input="msPowerAutomateProxy = $event" />
      <label>
        By default ElastAlert 2 will not use a network proxy to send notifications to MS Teams.
        Set this option using hostname:port if you need to use a proxy. only supports https.
      </label>
    </el-form-item>

    <el-form-item label="Attach Kibana Discover URL" prop="msPowerAutomateAttachKibanaDiscoverUrl">
      <el-switch
        id="msPowerAutomateAttachKibanaDiscoverUrl"
        :value="msPowerAutomateAttachKibanaDiscoverUrl"
        :disabled="viewOnly"
        @change="changeMsPowerAutomateAttachKibanaDiscoverUrl" />
    </el-form-item>

    <el-form-item label="Kibana Discover Title" prop="msPowerAutomateKibanaDiscoverTitle">
      <el-input :value="msPowerAutomateKibanaDiscoverTitle" :disabled="viewOnly" @input="msPowerAutomateKibanaDiscoverTitle = $event" />
      <label>The title of the Kibana Discover url attachment.</label>
    </el-form-item>

    <el-form-item label="Kibana Discover Color" prop="msPowerAutomateKibanaDiscoverColor">
      <el-radio-group :value="msPowerAutomateKibanaDiscoverColor" :disabled="viewOnly" @input="msPowerAutomateKibanaDiscoverColor = $event">
        <el-radio id="msPowerAutomateKibanaDiscoverColorDefault" label="default">
          Default
        </el-radio>
        <el-radio id="msPowerAutomateKibanaDiscoverColorPositive" label="positive">
          Positive
        </el-radio>
        <el-radio id="msPowerAutomateKibanaDiscoverColorDestructive" label="destructive">
          Destructive
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="Ignore SSL Errors" prop="msPowerAutomateIgnoreSslErrors">
      <el-switch
        id="msPowerAutomateIgnoreSslErrors"
        :value="msPowerAutomateIgnoreSslErrors"
        :disabled="viewOnly"
        @change="changeMsPowerAutomateIgnoreSslErrors" />
    </el-form-item>

    <el-form-item label="CA Certs" prop="msPowerAutomateCaCerts">
      <el-switch
        id="msPowerAutomateCaCerts"
        :value="msPowerAutomateCaCerts"
        :disabled="viewOnly"
        @change="changeMsPowerAutomateCaCerts" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: ['viewOnly'],
  emits: ['validate'],

  data() {
    return {
      popMsPowerAutomatesWebhookUrlVisible: false,
      popMsPowerAutomateWebhookUrlValid: true,
    };
  },

  computed: {
    msPowerAutomateWebhookUrl: {
      get() {
        return this.$store.state.config.alert.msPowerAutomateWebhookUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_POWER_AUTOMATE_WEBHOOK_URL', value);
      }
    },

    msPowerAutomateTeamsCardWidthFull: {
      get() {
        return this.$store.state.config.alert.msPowerAutomateTeamsCardWidthFull;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_POWER_AUTOMATE_ALERT_FIXED_WIDTH', value);
      }
    },

    msPowerAutomateAlertSummary: {
      get() {
        return this.$store.state.config.alert.msPowerAutomateAlertSummary;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_POWER_AUTOMATE_ALERT_SUMMARY', value);
      }
    },

    msPowerAutomateSummaryTextSize: {
      get() {
        return this.$store.state.config.alert.msPowerAutomateSummaryTextSize;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MS_POWER_AUTOMATE_SUMMARY_TEXT_SIZE',
          value
        );
      }
    },

    msPowerAutomateBodyTextSize: {
      get() {
        return this.$store.state.config.alert.msPowerAutomateBodyTextSize;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MS_POWER_AUTOMATE_BODY_TEXT_SIZE',
          value
        );
      }
    },

    msPowerAutomateProxy: {
      get() {
        return this.$store.state.config.alert.msPowerAutomateProxy;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_POWER_AUTOMATE_PROXY', value);
      }
    },

    msPowerAutomateIgnoreSslErrors: {
      get() {
        return this.$store.state.config.alert.msPowerAutomateIgnoreSslErrors;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MS_POWER_AUTOMATE_IGNORE_SSL_ERRORS',
          value
        );
      }
    },

    msPowerAutomateCaCerts: {
      get() {
        return this.$store.state.config.alert.msPowerAutomateCaCerts;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MS_POWER_AUTOMATE_CA_CERTS',
          value
        );
      }
    },

    msPowerAutomateAttachKibanaDiscoverUrl: {
      get() {
        return this.$store.state.config.alert.msPowerAutomateAttachKibanaDiscoverUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_POWER_AUTOMATE_ATTACH_KIBANA_DISCOVER_URL', value);
      }
    },

    msPowerAutomateKibanaDiscoverTitle: {
      get() {
        return this.$store.state.config.alert.msPowerAutomateKibanaDiscoverTitle;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_MS_POWER_AUTOMATE_KIBANA_DISCOVER_TITLE', value);
      }
    },

    msPowerAutomateKibanaDiscoverColor: {
      get() {
        return this.$store.state.config.alert.msPowerAutomateKibanaDiscoverColor;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_MS_POWER_AUTOMATE_KIBANA_DISCOVER_COLOR',
          value
        );
      }
    }
  },

  methods: {
    async validate() {
      try {
        if (this.$refs.msPowerAutomateWebhookUrl) {
          await this.validateMsPowerAutomateWebhookUrl();
        }
        this.$emit('validate', true);
        return true;
      } catch (error) {
        this.$emit('validate', false);
        return false;
      }
    },

    async validateMsPowerAutomateWebhookUrl() {
      if (!this.msPowerAutomateWebhookUrl.length) {
        this.popMsPowerAutomateWebhookUrlValid = false;
        return;
      }
      try {
        this.popMsPowerAutomateWebhookUrlValid = await this.$refs.msPowerAutomateWebhookUrl.validate();
      } catch (error) {
        this.popMsPowerAutomateWebhookUrlValid = false;
        throw error;
      }
    },

    updateMsPowerAutomateWebhookUrl(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_MS_POWER_AUTOMATE_WEBHOOK_URL_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removeMsPowerAutomateWebhookUrlEntry(entry) {
      this.$store.commit('config/alert/REMOVE_MS_POWER_AUTOMATE_WEBHOOK_URL_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addMsPowerAutomateWebhookUrlEntry() {
      this.$store.commit('config/alert/ADD_MS_POWER_AUTOMATE_WEBHOOK_URL_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    changemsPowerAutomateTeamsCardWidthFull(val) {
      this.msPowerAutomateTeamsCardWidthFull = val;
    },

    changeMsPowerAutomateIgnoreSslErrors(val) {
      this.msPowerAutomateIgnoreSslErrors = val;
    },

    changeMsPowerAutomateAttachKibanaDiscoverUrl(val) {
      this.msPowerAutomateAttachKibanaDiscoverUrl = val;
    },

    changeMsPowerAutomateCaCerts(val) {
      this.msPowerAutomateCaCerts = val;
    }
  }
};
</script>

  <style lang="scss" scoped>
  </style>
