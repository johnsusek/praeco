<template>
  <el-row :gutter="40">
    <el-col :span="12" style="border-right: 1px solid #e6e6e6">
      <h1>{{ pageTitle }}</h1>

      <!-- FORMS -->
      <ConfigSettings
        v-show="currentStep === 'settings'"
        ref="settings"
        :prefill="config"
        :action="action" />

      <ConfigQuery
        v-show="currentStep === 'query'"
        ref="query"
        :prefill="config"
        @preview="preview" />

      <ConfigAlert
        v-show="currentStep === 'alert'"
        ref="alert"
        :prefill="config"
        :fields="mappingFields" />

      <ConfigSave v-show="currentStep === 'save'" :config="config"/>

      <!-- BUTTON ROW -->
      <el-row class="button-row">
        <el-col :span="12">
          <el-button
            v-show="currentStep !== 'settings'"
            @click="back">
            Back
          </el-button>
          &nbsp;
        </el-col>

        <el-col :span="12" align="right">
          <el-button
            v-show="showNextButton"
            type="primary"
            @click="testRuleSoFar">
            Next
          </el-button>

          <span v-show="currentStep === 'save'">
            <el-button type="primary" @click="saveConfig">Save</el-button>
          </span>
        </el-col>
      </el-row>
    </el-col>

    <!-- SIDEBAR -->
    <el-col :span="12">
      <h2><i v-if="currentStep === 'settings'" class="el-icon-d-arrow-right" />Settings</h2>
      <SidebarSettings
        v-if="currentStep === 'settings'"
        v-bind="{
          mappingLoaded,
          mappingError,
          mappingLoading,
          remoteValid,
          remoteError,
          remoteValidating
      }" />

      <h2><i v-if="currentStep === 'query'" class="el-icon-d-arrow-right" />Query</h2>
      <SidebarQuery
        v-if="currentStep === 'query'"
        v-bind="{ previewLoading, previewResult, previewError, remoteValidating }" />

      <h2><i v-if="currentStep === 'alert'" class="el-icon-d-arrow-right" />Alert</h2>
      <SidebarAlert
        v-if="currentStep === 'alert'"
        v-bind="{ previewAlertResult, remoteValidating }" />

      <h2><i v-if="currentStep === 'save'" class="el-icon-d-arrow-right" />Save</h2>
      <SidebarSave
        v-if="currentStep === 'save'"
        :save-error="saveError"
        :config-dump="configDump" />
    </el-col>
  </el-row>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import yaml from 'js-yaml';
import format from 'string-format';
import { htmlToConfigFormat } from '../lib/alertText';
import ConfigSettings from '../components/ConfigSettings.vue';
import ConfigQuery from '../components/ConfigQuery.vue';
import ConfigAlert from '../components/ConfigAlert.vue';
import ConfigSave from '../components/ConfigSave.vue';
import SidebarSettings from '../components/SidebarSettings.vue';
import SidebarQuery from '../components/SidebarQuery.vue';
import SidebarAlert from '../components/SidebarAlert.vue';
import SidebarSave from '../components/SidebarSave.vue';

function buildMappingFields(mapping) {
  let fields = {};

  Object.values(mapping)
    .map(m => m.mappings)
    .forEach(mping => {
      Object.values(mping).forEach(mp => {
        Object.keys(mp.properties).forEach(prop => {
          fields[prop] = true;
        });
      });
    });

  return Object.keys(fields);
}

function formatIndex(index) {
  let formattedIndex = index;
  let now = new Date();

  formattedIndex = formattedIndex.replace('%Y', now.getFullYear());
  formattedIndex = formattedIndex.replace('%m', (now.getMonth() + 1).toString().padStart(2, 0));
  formattedIndex = formattedIndex.replace('%d', now.getDate());

  return formattedIndex;
}

export default {
  components: {
    ConfigSettings,
    ConfigQuery,
    ConfigAlert,
    ConfigSave,
    SidebarSettings,
    SidebarQuery,
    SidebarAlert,
    SidebarSave
  },
  props: ['template', 'action', 'prefill', 'type', 'prefillType'],
  data() {
    return {
      // settings, query, alert, or save
      currentStep: 'settings',

      saveError: '',

      previewLoading: false,
      previewError: '',
      previewResult: null,

      remoteValidating: false,
      remoteValid: null,
      remoteError: '',

      mappingLoading: false,
      mappingLoaded: null,
      mappingError: '',
      mappingFields: [],

      config: {
        is_enabled: true,
        filter: [
          {
            query: {
              query_string: {
                query: ''
              }
            }
          }
        ],
        alert: [],
        alert_subject: '',
        alert_subject_args: [],
        alert_text: '',
        alert_text_args: [],
        alert_text_type: 'alert_text_only',
        realert: {
          minutes: 5
        },
        slack_username_override: 'Praeco',

        type: 'any'
      }
    };
  },
  computed: {
    configDump() {
      return yaml.safeDump(this.config);
    },
    pageTitle() {
      return `${this.action[0].toUpperCase()}${this.action.slice(1)} ${this.type}`;
    },
    showNextButton() {
      if (this.currentStep === 'save') return false;
      if (this.currentStep === 'query' && !this.previewResult) return false;
      return true;
    },
    previewAlertResult() {
      let previewResult = this.previewResult || { result: {} };

      let preformSubject = htmlToConfigFormat(this.config.alert_subject);
      preformSubject.alertArgs = preformSubject.alertArgs.map(a => previewResult.result[a]);
      let formattedSubject = format(preformSubject.alertText, ...preformSubject.alertArgs);

      let preformBody = htmlToConfigFormat(this.config.alert_text);
      preformBody.alertArgs = preformBody.alertArgs.map(a => previewResult.result[a]);
      let formattedBody = format(preformBody.alertText, ...preformBody.alertArgs);

      return {
        subject: formattedSubject,
        body: formattedBody
      };
    }
  },
  async mounted() {
    if (this.action === 'edit' && this.template) {
      let action = this.type === 'template' ? 'templates/fetchTemplate' : 'rules/fetchRule';

      await this.$store.dispatch(action, this.template);
      if (this.type === 'template') {
        this.config = { ...this.config, ...this.$store.state.templates.templates[this.template] };
      } else {
        this.config = { ...this.config, ...this.$store.state.rules.rules[this.template] };
      }
    } else if (this.action === 'add' && this.prefill) {
      let action = this.prefillType === 'template' ? 'templates/fetchTemplate' : 'rules/fetchRule';

      await this.$store.dispatch(action, this.prefill);
      if (this.prefillType === 'template') {
        this.config = { ...this.config, ...this.$store.state.templates.templates[this.prefill] };
      } else {
        this.config = { ...this.config, ...this.$store.state.rules.rules[this.prefill] };
      }
      Vue.set(this.config, 'name', `New ${this.type}`);
    }
  },
  methods: {
    async preview(config) {
      this.previewResult = null;
      this.previewError = '';
      this.previewLoading = true;

      try {
        let res = await axios.post('/test', {
          rule: yaml.safeDump({ ...this.config, ...config }),
          options: {
            testType: 'countOnly',
            days: 1,
            alert: false,
            format: 'json'
          }
        });
        this.previewResult = res.data;
        return true;
      } catch (error) {
        this.previewError = error.toString();
        return false;
      } finally {
        this.previewLoading = false;
      }
    },
    async testRuleSoFar() {
      this.remoteValid = null;

      if (this.currentStep === 'settings') {
        let settingsConfig = await this.$refs.settings.validate();
        if (!settingsConfig) {
          return;
        }
        this.config = { ...this.config, ...settingsConfig };
      } else if (this.currentStep === 'query') {
        let queryConfig = await this.$refs.query.validate();
        if (!queryConfig) {
          return;
        }
        this.config = { ...this.config, ...queryConfig };
      } else if (this.currentStep === 'alert') {
        let alertConfig = await this.$refs.alert.validate();
        if (!alertConfig) {
          return;
        }
        this.config = { ...this.config, ...alertConfig };
      }

      if (this.currentStep === 'settings') {
        this.mappingLoaded = null;
        this.mappingLoading = true;
        if (!await this.getMapping()) {
          return false;
        }
      }

      this.remoteValidating = true;
      this.remoteValid = await this.remoteValidation();
      this.remoteValidating = false;

      if (this.remoteValid) {
        this.next();
      }
    },
    back() {
      if (this.currentStep === 'query') {
        this.currentStep = 'settings';
      } else if (this.currentStep === 'alert') {
        this.currentStep = 'query';
      } else if (this.currentStep === 'save') {
        this.currentStep = 'alert';
      }
    },
    next() {
      if (this.currentStep === 'settings') {
        this.currentStep = 'query';
      } else if (this.currentStep === 'query') {
        this.currentStep = 'alert';
      } else if (this.currentStep === 'alert') {
        this.currentStep = 'save';
      }
    },
    async remoteValidation() {
      try {
        await axios.post('/test', {
          rule: yaml.safeDump(this.config),
          options: {
            testType: 'countOnly',
            days: 1,
            alert: false,
            format: 'json'
          }
        });
        return true;
      } catch (error) {
        this.remoteError = error.toString();
        return false;
      }
    },
    async saveConfig() {
      this.saveError = '';

      let action = this.type === 'template' ? 'templates/createTemplate' : 'rules/createRule';
      let res = await this.$store.dispatch(action, this.config);

      if (res.created) {
        this.$router.push({
          name: this.type === 'template' ? 'templateview' : 'ruleview',
          params: { id: this.config.name }
        });
      } else {
        this.saveError = res.toString();
      }
    },
    async getMapping() {
      try {
        let formattedIndex = this.config.index;

        if (this.config.use_strftime_index) {
          formattedIndex = formatIndex(this.config.index);
        }

        let res = await axios.get(`/mapping/${formattedIndex}`);

        if (res.data.error) {
          this.mappingError = res.data.error.msg;
          return false;
        }

        this.mappingFields = buildMappingFields(res.data);
        this.mappingLoaded = true;
        return true;
      } catch (error) {
        this.mappingLoaded = false;
        this.mappingError = error.toString();
        return false;
      } finally {
        this.mappingLoading = false;
      }
    }
  }
};
</script>

<style>
.button-row {
  border-top: 1px solid #e6e6e6;
  margin-top: 20px;
  padding-top: 20px;
}
</style>
