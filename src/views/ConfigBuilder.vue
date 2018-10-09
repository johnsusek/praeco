<template>
  <el-row :gutter="40">
    <el-col :span="12" style="border-right: 1px solid #e6e6e6">
      <h1>{{ pageTitle }}</h1>

      <!-- FORMS -->
      <ConfigSettings
        v-show="currentStep === 'settings'"
        ref="settings"
        :type="type"
        :prefill-path="prefill"
        :prefill-type="prefillType"
        :prefill="config"
        :action="action" />

      <ConfigQuery
        v-if="currentStep === 'query'"
        ref="query"
        :prefill="config"
        :fields="mappingFields"
        :query-builder-query="config.__praeco_query_builder"
        @preview="preview" />

      <ConfigMatch
        v-if="currentStep === 'match'"
        ref="match"
        :prefill="config"
        :index="wildcardIndex"
        :fields="mappingFields"
        :types="mappingTypes"
        @preview="preview" />

      <ConfigAlert
        v-show="currentStep === 'alert'"
        ref="alert"
        :prefill="config"
        :fields="fields" />

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
              class="praeco-config-save"
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
        :show-mapping-validation="currentStep === 'settings'"
        v-bind="{
          mappingLoaded,
          mappingError,
          mappingLoading,
          remoteValid,
          remoteError,
          remoteValidating
      }" />

      <h2><i v-if="currentStep === 'query'" class="el-icon-d-arrow-right" />Search</h2>
      <SidebarQuery
        v-if="currentStep === 'query'"
        :show-preview="currentStep === 'query'"
        :index="wildcardIndex"
        :query="config.filter[0].query.query_string.query"
        v-bind="{ previewLoading, previewResult, previewError, config }" />

      <h2><i v-if="currentStep === 'match'" class="el-icon-d-arrow-right" />Match</h2>
      <SidebarMatch
        v-if="currentStep === 'match'"
        ref="sidebarMatch"
        :show-test="currentStep === 'query' || currentStep === 'match'"
        v-bind="{ config }"
        @validateMatchForTest="validateMatchForTest" />

      <h2><i v-if="currentStep === 'alert'" class="el-icon-d-arrow-right" />Alert</h2>

      <SidebarAlert
        v-if="currentStep === 'alert'"
        v-bind="{ renderedAlertResult, alertType: config.alert_text_type }" />

      <h2>
        <i v-if="currentStep === 'save'" />
        <el-container style="align-items: center">
          <div v-if="currentStep === 'save'">
            <i class="el-icon-d-arrow-right" />
          </div>
          <div style="flex-grow: 1">
            Save
          </div>
          <div>
            <el-button v-if="!showYaml" type="text" @click="showYaml = true">Show YAML</el-button>
            <el-button v-if="showYaml" type="text" @click="showYaml = false">Hide YAML</el-button>
          </div>
        </el-container>

      </h2>
      <SidebarSave
        v-if="currentStep === 'save'"
        :save-error="saveError" />

      <prism v-if="showYaml" language="javascript">{{ yaml }}</prism>
    </el-col>
  </el-row>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import yaml from 'js-yaml';
import format from 'string-format';
import get from 'lodash.get';
import changeCase from 'change-case';
import { logger } from '@/lib/logger.js';
import SidebarSettings from '@/components/sidebar/SidebarSettings.vue';
import SidebarQuery from '@/components/sidebar/SidebarQuery.vue';
import SidebarMatch from '@/components/sidebar/SidebarMatch.vue';
import SidebarAlert from '@/components/sidebar/SidebarAlert.vue';
import SidebarSave from '@/components/sidebar/SidebarSave.vue';
import ConfigSettings from '@/components/config/ConfigSettings.vue';
import ConfigQuery from '@/components/config/ConfigQuery.vue';
import ConfigAlert from '@/components/config/ConfigAlert.vue';
import ConfigSave from '@/components/config/ConfigSave.vue';
import ConfigMatch from '@/components/config/match/ConfigMatch.vue';
import { formatConfig } from '../lib/formatConfig';
import { htmlToConfigFormat } from '../lib/alertText';

const CancelToken = axios.CancelToken;

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
      }));

  return Object.keys(types).sort();
}

function formatIndex(index) {
  let formattedIndex = index;
  let now = new Date();

  formattedIndex = formattedIndex.replace('%Y', now.getFullYear());
  formattedIndex = formattedIndex.replace('%m', (now.getMonth() + 1).toString().padStart(2, 0));
  formattedIndex = formattedIndex.replace(
    '%d',
    now
      .getDate()
      .toString()
      .padStart(2, 0)
  );

  return formattedIndex;
}

export default {
  components: {
    ConfigSettings,
    ConfigQuery,
    ConfigMatch,
    ConfigAlert,
    ConfigSave,
    SidebarSettings,
    SidebarQuery,
    SidebarMatch,
    SidebarAlert,
    SidebarSave
  },
  props: ['path', 'action', 'prefill', 'type', 'prefillType'],
  data() {
    return {
      source: null,
      showYaml: false,

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

        is_enabled: false,
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
        realert: {
          minutes: 10
        },
        slack_username_override: 'Praeco',
        slack_emoji_override: ':postal_horn:',
        slack_title_link: '',
        smtp_host: 'localhost',
        smtp_port: 25,

        type: 'any'
      }
    };
  },
  computed: {
    yaml() {
      let config = {};

      // Sort the keys in the object so it appears alphabetically
      // in the UI
      Object.keys(this.config)
        .sort()
        .forEach(v => {
          config[v] = this.config[v];
        });

      if (!this.config.name) return false;

      let conf = formatConfig(config);
      return yaml.safeDump(conf);
    },
    fields() {
      let fields = [];

      // Handle JSON fields with dot notation
      Object.entries(this.mappingFields).forEach(([field, mapping]) => {
        if (mapping.properties) {
          Object.entries(mapping.properties).forEach(([f]) => {
            fields.push(`${field}.${f}`);
          });
        } else {
          fields.push(field);
        }
      });

      return fields;
    },
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
      let title = `${changeCase.titleCase(this.action)} ${this.type}`;
      if (this.action === 'edit') {
        title += ` ${this.config.name}`;
      }
      return title;
    },
    showNextButton() {
      if (this.currentStep === 'save') return false;
      if (this.currentStep === 'query' && this.previewError) return false;
      return true;
    },
    renderedAlertResult() {
      let previewResult = this.previewResult || { result: {} };

      let preformSubject = htmlToConfigFormat(this.config.alert_subject);
      let preformBody = htmlToConfigFormat(this.config.alert_text);

      preformSubject.alertArgs =
        preformSubject.alertArgs.map(a => get(previewResult.result, a) || '<MISSING VALUE>');

      preformBody.alertArgs =
        preformBody.alertArgs.map(a => get(previewResult.result, a) || '<MISSING VALUE>');

      let formattedSubject = format(preformSubject.alertText, ...preformSubject.alertArgs);
      let formattedBody = format(preformBody.alertText, ...preformBody.alertArgs);

      return {
        subject: formattedSubject,
        body: formattedBody
      };
    }
  },
  async mounted() {
    if (this.action === 'edit' && this.path) {
      // First we get the prefill from the store
      await this.$store.dispatch('configs/fetchConfig', {
        path: this.path,
        type: `${this.type}s`
      });

      // and merge it into the config we are working on
      this.config = {
        ...this.config,
        ...this.$store.state.configs[`${this.type}s`][this.path]
      };
    } else if (this.action === 'add' && this.prefill) {
      // First we get the prefill from the store
      await this.$store.dispatch('configs/fetchConfig', {
        path: this.prefill,
        type: `${this.prefillType}s`
      });

      // and merge it into the config we are working on
      this.config = {
        ...this.config,
        ...this.$store.state.configs[`${this.prefillType}s`][this.prefill]
      };

      Vue.set(this.config, 'name', 'New rule');
    }

    let appUrl = this.$store.state.config.config.appUrl;
    let encodedPath = encodeURIComponent(this.config.__praeco_full_path);

    Vue.set(
      this.config,
      'slack_title_link',
      `${appUrl}/rules/${encodedPath}`
    );
  },
  methods: {
    async validateMatchForTest() {
      let matchConfig = await this.$refs.match.validate();
      if (!matchConfig) {
        return;
      }
      this.$refs.sidebarMatch.runTest();
    },
    async preview(config) {
      this.previewResult = null;
      this.previewError = null;
      this.previewLoading = true;

      try {
        // Cancel any currently running requests
        if (this.source) {
          this.source.cancel();
        }

        let res;

        // Cancel any currently running requests
        if (this.source) {
          this.source.cancel();
        }

        try {
          this.source = CancelToken.source();
          res = await axios.post(
            '/test',
            {
              rule: yaml.safeDump({ ...this.config, ...config }),
              options: {
                testType: 'countOnly',
                days: 1,
                alert: false,
                format: 'json',
                maxResults: 1
              }
            },
            {
              cancelToken: this.source.token
            }
          );
        } catch (error) {
          if (!axios.isCancel(error)) {
            console.error(error);
          }
        } finally {
          this.source = null;
        }

        if (!res.data) {
          this.previewError =
            'Error testing rule, there may be a bad key or value in your rule file.';
        } else {
          this.previewResult = res.data;
        }
        return true;
      } catch (error) {
        logger().error({ error });
        if (error.response && error.response.data) {
          this.previewError = error.response.data;
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
      } else if (this.currentStep === 'match') {
        let matchConfig = await this.$refs.match.validate();
        if (!matchConfig) {
          return;
        }
        this.config = { ...this.config, ...matchConfig };
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
        if (!(await this.getMapping())) {
          return false;
        }
      }

      if (this.currentStep !== 'settings') {
        this.remoteValid = null;
        this.remoteValidating = true;
        this.remoteValid = await this.remoteValidation();
        this.remoteValidating = false;
        if (this.remoteValid) {
          this.next();
        }
      } else {
        this.next();
      }
    },
    back() {
      window.scrollTo({ top: 0 });

      if (this.currentStep === 'query') {
        this.currentStep = 'settings';
      } else if (this.currentStep === 'match') {
        this.currentStep = 'query';
      } else if (this.currentStep === 'alert') {
        this.currentStep = 'match';
      } else if (this.currentStep === 'save') {
        this.currentStep = 'alert';
      }
    },
    next() {
      if (this.currentStep === 'settings') {
        this.currentStep = 'query';
      } else if (this.currentStep === 'query') {
        this.currentStep = 'match';
      } else if (this.currentStep === 'match') {
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
        logger.error(error);
        this.remoteError = error.toString();
        return false;
      }
    },
    async saveConfig() {
      this.saveError = '';
      let rootPath = false;

      if (this.action === 'add' && this.prefillType === 'template') {
        // If type is add, and prefillType is template, we just
        // put the config into the root rules folder
        rootPath = true;
      }

      let res = await this.$store.dispatch('configs/createConfig', {
        config: this.config,
        type: `${this.type}s`,
        rootPath,
        overwrite: this.action === 'edit'
      });

      if (res && res.__praeco_full_path) {
        this.$router.push({
          name: this.type === 'template' ? 'templateview' : 'ruleview',
          params: { id: res.__praeco_full_path },
          query: { refreshTree: true }
        });
        this.$message.success(`${changeCase.titleCase(this.type)} saved`);
      } else {
        this.saveError = res;
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
  margin-top: 0;
  padding-top: 0;
}

.button-row {
  margin-top: 20px;
  padding-top: 20px;
}
</style>
