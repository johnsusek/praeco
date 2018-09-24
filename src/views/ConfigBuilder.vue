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
        v-if="currentStep === 'query'"
        ref="query"
        :prefill="config"
        :index="wildcardIndex"
        :action="action"
        :fields="mappingFields"
        :types="mappingTypes"
        :query-builder-query="config.__praeco_query_builder"
        @preview="preview" />

      <ConfigAlert
        v-show="currentStep === 'alert'"
        ref="alert"
        :prefill="config"
        :fields="Object.keys(mappingFields)" />

      <ConfigSave v-show="currentStep === 'save'" :config="config"/>

      <!-- BUTTON ROW -->
      <el-row class="button-row">
        <el-col :span="12">
          <el-button
            v-show="currentStep !== 'settings'"
            plain
            size="small"
            @click="back">
            Back
          </el-button>
          &nbsp;
        </el-col>

        <el-col :span="12" align="right">
          <el-button
            v-show="showNextButton"
            plain
            size="small"
            type="primary"
            @click="handleClickNext">
            Next

          </el-button>

          <span v-show="currentStep === 'save'">
            <el-button
              plain
              size="small"
              type="primary"
              @click="saveConfig">
              Save
            </el-button>
          </span>
        </el-col>
      </el-row>
    </el-col>

    <!-- SIDEBAR -->
    <el-col :span="12">
      <h2><i v-if="currentStep === 'settings'" class="el-icon-d-arrow-right" />Settings</h2>
      <SidebarSettings
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
        v-if="currentStep !== 'settings'"
        v-bind="{ previewLoading, previewResult, previewError, config }" />

      <h2><i v-if="currentStep === 'alert'" class="el-icon-d-arrow-right" />Alert</h2>

      <SidebarAlert
        v-if="currentStep !== 'settings' && currentStep !== 'query'"
        v-bind="{ renderedAlertResult, previewResult }" />

      <h2><i v-if="currentStep === 'save'" class="el-icon-d-arrow-right" />Save</h2>
      <SidebarSave
        v-if="currentStep === 'save'"
        :save-error="saveError" />

        <!-- <vue-json-pretty :data="config" /> -->
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
        Object.entries(mp.properties).forEach(prop => {
          fields[prop[0]] = prop[1];
        });
      });
    });

  return fields;
}

function buildMappingTypes(mapping) {
  let types = {};

  Object.values(mapping)
    .map(m => m.mappings)
    .forEach(m =>
      Object.keys(m).forEach(k => {
        types[k] = true;
      })
    );

  return Object.keys(types).sort();
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
      previewError: null,
      previewResult: null,

      remoteValidating: false,
      remoteValid: null,
      remoteError: '',

      mappingLoading: false,
      mappingLoaded: null,
      mappingError: '',
      mappingFields: [],
      mappingTypes: [],

      config: {
        __praeco_query_builder: {},

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
        smtp_host: 'localhost',
        smtp_port: 25,

        type: 'any'
      }
    };
  },
  computed: {
    formattedIndex() {
      let formattedIndex = this.config.index;

      if (this.config.use_strftime_index) {
        formattedIndex = formatIndex(this.config.index);
      }

      return formattedIndex;
    },
    wildcardIndex() {
      let formattedIndex = this.config.index;

      if (this.config.use_strftime_index) {
        formattedIndex = formattedIndex.replace(/%[Ymd]/g, '*');
      }

      return formattedIndex;
    },
    pageTitle() {
      return `${this.capitalize(this.action)} ${this.type} "${this.config.name}"`;
    },
    showNextButton() {
      if (this.currentStep === 'save') return false;
      if (this.currentStep === 'query' && !this.previewResult) return false;
      return true;
    },
    renderedAlertResult() {
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
    capitalize(str) {
      if (str.length) {
        return str[0].toUpperCase() + str.slice(1);
      }
    },
    async preview(config) {
      this.previewResult = null;
      this.previewError = null;
      this.previewLoading = true;

      try {
        let res = await axios.post('/test', {
          rule: yaml.safeDump({ ...this.config, ...config }),
          options: {
            testType: 'countOnly',
            days: 1,
            alert: false,
            format: 'json',
            maxResults: 1
          }
        });
        this.previewResult = res.data;
        return true;
      } catch (error) {
        if (error.response && error.response.data) {
          this.previewError = error.response.data;
        } else {
          this.previewError = 'Query error.';
        }
        return false;
      } finally {
        this.previewLoading = false;
      }
    },
    async handleClickNext() {
      window.scrollTo({ top: 0 });

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

      this.remoteValid = null;
      this.remoteValidating = true;
      this.remoteValid = await this.remoteValidation();
      this.remoteValidating = false;

      if (this.remoteValid) {
        this.next();
      }
    },
    back() {
      window.scrollTo({ top: 0 });

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
            testType: 'schemaOnly',
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
        this.$message.success(`${this.capitalize(this.type)} saved`);
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
          this.mappingLoaded = false;
          this.mappingError = res.data.error.msg;
          return false;
        }

        this.mappingFields = buildMappingFields(res.data);
        this.mappingTypes = buildMappingTypes(res.data);
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

<style scoped>
h2 {
  border-top: 1px solid #ddd;
  padding-top: 22px;
}

h2:first-child {
  border-top: 0;
}

.button-row {
  border-top: 1px solid #e6e6e6;
  margin-top: 20px;
  padding-top: 20px;
}
</style>
