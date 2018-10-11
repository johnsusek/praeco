<template>
  <el-row :gutter="40">
    <el-col :span="12" style="border-right: 1px solid #e6e6e6">
      <h1 class="m-s-xl">{{ pageTitle }}</h1>

      <el-collapse v-model="activePane" :accordion="true">
        <el-collapse-item title="Settings" name="settings">
          <ConfigSettings
            v-if="(config.index || (action === 'add' && !prefill)) && activePane === 'settings'"
            ref="settings"
            :name="config.name"
            :description="config.description"
            :index="config.index"
            :type="type"
            :prefill-path="prefill"
            :prefill-type="prefillType"
            :action="action"
            @input="updateConfigSettings" />

          <el-button class="m-n-lg" type="primary" plain @click="nextPane">
            Continue
          </el-button>
        </el-collapse-item>

        <el-collapse-item title="Filter" name="query">
          <ConfigQuery
            v-if="hasMapping && activePane === 'query'"
            ref="query"
            :fields="mappingFields"
            :query-string="config.filter[0].query.query_string.query"
            :query-tree="config.__praeco_query_builder.query"
            @input="updateQuerySettings" />

          <el-button class="m-n-lg" type="primary" plain @click="nextPane">
            Continue
          </el-button>
        </el-collapse-item>

        <el-collapse-item title="Match" name="match">
          <ConfigMatch
            v-if="hasMapping && activePane === 'match'"
            ref="match"
            :type="config.type"
            :query-string="config.filter[0].query.query_string.query"
            :spike-height="config.spike_height"
            :spike-type="config.spike_type"
            :threshold-ref="config.threshold_ref"
            :threshold-cur="config.threshold_cur"
            :use-terms-query="config.use_terms_query"
            :use-count-query="config.use_count_query"
            :doc-type="config.doc_type"
            :terms-size="config.terms_size"
            :strftime="config.use_strftime_index"
            :num-events="config.num_events"
            :timeframe="config.timeframe"
            :query-key="config.query_key"
            :ignore-null="config.ignore_null"
            :blacklist="config.blacklist"
            :whitelist="config.whitelist"
            :compare-key="config.compare_key"
            :index="wildcardIndex"
            :fields="mappingFields"
            :types="mappingTypes"
            @updateTimeframe="(t) => timeframe = t"
            @updateMarkLine="(m) => markLine = m"
            @updateSpikeHeight="(h) => spikeHeight = h"
            @input="updateMatchSettings" />

          <el-button class="m-n-lg" type="primary" plain @click="nextPane">
            Continue
          </el-button>
        </el-collapse-item>

        <el-collapse-item title="Alert" name="alert">
          <ConfigAlert
            ref="alert"
            :v-show="showAlertConfig"
            :prefill="config"
            :fields="fields" />
          <el-button class="m-n-lg" type="primary" plain @click="nextPane">
            Continue
          </el-button>
        </el-collapse-item>

        <el-collapse-item title="Save" name="save">
          <ConfigSave :config="config" @save="saveConfig" />
        </el-collapse-item>
      </el-collapse>
    </el-col>

    <!-- SIDEBAR -->
    <el-col :span="12">
      <h2><i class="el-icon-d-arrow-right" />Settings</h2>
      <SidebarSettings
        :show-mapping-validation="true"
        v-bind="{
          remoteValid,
          remoteValidating,
          remoteError,
      }" />

      <h2><i v-if="currentStep === 'query'" class="el-icon-d-arrow-right" />Search</h2>
      <SidebarQuery
        :show-preview="true"
        :spike-height="spikeHeight"
        :timeframe="timeframe"
        :mark-line="markLine"
        :index="wildcardIndex"
        :query="config.filter[0].query.query_string.query"
        v-bind="{ previewLoading, previewResult, previewError, config }" />

      <h2><i v-if="currentStep === 'match'" class="el-icon-d-arrow-right" />Match</h2>
      <SidebarMatch
        v-if="hasMapping"
        ref="sidebarMatch"
        :show-test="hasMapping"
        v-bind="{ config }"
        @validateMatchForTest="validateMatchForTest" />

      <h2><i v-if="currentStep === 'alert'" class="el-icon-d-arrow-right" />Alert</h2>

      <SidebarAlert v-bind="{ renderedAlertResult, alertType: config.alert_text_type }" />

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

      <SidebarSave :save-error="saveError" />

      <!-- <vue-json-pretty :data="config" /> -->

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
import { formatIndex } from '@/lib/elasticSearchMetadata.js';
import SidebarSettings from '@/components/sidebar/SidebarSettings.vue';
import SidebarQuery from '@/components/sidebar/SidebarQuery.vue';
import SidebarMatch from '@/components/sidebar/SidebarMatch.vue';
import SidebarAlert from '@/components/sidebar/SidebarAlert.vue';
import SidebarSave from '@/components/sidebar/SidebarSave.vue';
import ConfigSettings from '@/components/config/ConfigSettings.vue';
import ConfigQuery from '@/components/config/ConfigQuery.vue';
import ConfigAlert from '@/components/config/alert/ConfigAlert.vue';
import ConfigSave from '@/components/config/ConfigSave.vue';
import ConfigMatch from '@/components/config/match/ConfigMatch.vue';
import { formatConfig } from '../lib/formatConfig';
import { htmlToConfigFormat } from '../lib/alertText';

const CancelToken = axios.CancelToken;

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
      showAlertConfig: false,

      spikeHeight: 1,
      timeframe: null,
      markLine: 0,

      activePane: 'settings',

      nextDisabled: false,
      nextLabel: 'Next',

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

      if (!config.__praeco_query_builder) return false;

      let conf = formatConfig(config);
      return yaml.safeDump(conf);
    },
    hasMapping() {
      return Object.keys(this.mappingFields).length;
    },
    mappingFields() {
      let mappings = this.$store.state.metadata.mappings[formatIndex(this.config.index)];
      if (mappings) {
        return mappings.fields;
      }
      return [];
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
    wildcardIndex() {
      let formattedIndex = formatIndex(this.config.index);

      if (this.config.use_strftime_index && formattedIndex) {
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
    async updateMatchSettings() {
      console.log('called updatematchsettings...');
      let form = await this.$refs.match.validate();

      if (!form) {
        return;
      }

      console.log('GOT TYPE FROM UPDATED MATCH SETTINGS', form.type);

      Vue.set(this.config, 'type', form.type);

      if (form.compareKey) {
        Vue.set(this.config, 'compare_key', form.compareKey);
      } else {
        Vue.delete(this.config, 'compare_key');
      }

      if (form.blacklist && form.blacklist.length) {
        Vue.set(this.config, 'blacklist', form.blacklist);
      } else {
        Vue.delete(this.config, 'blacklist');
      }

      if (form.whitelist && form.whitelist.length) {
        Vue.set(this.config, 'whitelist', form.whitelist);
      } else {
        Vue.delete(this.config, 'whitelist');
      }

      if (form.ignoreNull) {
        Vue.set(this.config, 'ignore_null', form.ignoreNull);
      } else {
        Vue.delete(this.config, 'ignore_null');
      }

      if (form.queryKey) {
        Vue.set(this.config, 'query_key', form.queryKey);
      } else {
        Vue.delete(this.config, 'query_key');
      }

      if (form.timeframe) {
        Vue.set(this.config, 'timeframe', form.timeframe);
      } else {
        Vue.delete(this.config, 'timeframe');
      }

      if (form.numEvents) {
        Vue.set(this.config, 'num_events', form.numEvents);
      } else {
        Vue.delete(this.config, 'num_events');
      }

      if (form.strftime) {
        Vue.set(this.config, 'use_strftime_index', form.strftime);
      } else {
        Vue.set(this.config, 'use_strftime_index', false);
      }

      if (form.termsSize) {
        Vue.set(this.config, 'terms_size', form.termsSize);
      } else {
        Vue.delete(this.config, 'terms_size');
      }

      if (form.docType) {
        Vue.set(this.config, 'doc_type', form.docType);
      } else {
        Vue.delete(this.config, 'doc_type');
      }

      if (form.useCountQuery) {
        Vue.set(this.config, 'use_count_query', form.useCountQuery);
      } else {
        Vue.delete(this.config, 'use_count_query');
      }

      if (form.useTermsQuery) {
        Vue.set(this.config, 'use_terms_query', form.useTermsQuery);
      } else {
        Vue.delete(this.config, 'use_terms_query');
      }

      if (form.thresholdCur) {
        Vue.set(this.config, 'threshold_cur', form.thresholdCur);
      } else {
        Vue.delete(this.config, 'threshold_cur');
      }

      if (form.thresholdRef) {
        Vue.set(this.config, 'threshold_ref', form.thresholdRef);
      } else {
        Vue.delete(this.config, 'threshold_ref');
      }

      if (form.spikeType) {
        Vue.set(this.config, 'spike_type', form.spikeType);
      } else {
        Vue.delete(this.config, 'spike_type');
      }

      if (form.spikeHeight) {
        Vue.set(this.config, 'spike_height', form.spikeHeight);
      } else {
        Vue.delete(this.config, 'spike_height');
      }
    },

    async updateConfigSettings() {
      let form = await this.$refs.settings.validate();

      if (!form) {
        return;
      }

      Vue.set(this.config, 'name', form.name);

      if (form.description) {
        Vue.set(this.config, 'description', form.description);
      } else {
        Vue.delete(this.config, 'description');
      }

      Vue.set(this.config, 'index', form.index);

      if (form.strftime) {
        Vue.set(this.config, 'use_strftime_index', true);
      } else {
        Vue.set(this.config, 'use_strftime_index', false);
      }
    },

    async updateQuerySettings() {
      let form = await this.$refs.query.validate();

      if (!form) {
        return;
      }
      console.log(form);
      Vue.set(this.config.filter[0].query.query_string, 'query', form.queryString);

      Vue.set(this.config.__praeco_query_builder, 'query', form.queryTree);
    },

    async nextPane() {
      if (this.activePane === 'settings') {
        let settingsConfig = await this.$refs.settings.validate();
        if (!settingsConfig) {
          return;
        }
        this.config = { ...this.config, ...settingsConfig };
        this.activePane = 'query';
      } else if (this.activePane === 'query') {
        let queryConfig = await this.$refs.query.validate();
        if (!queryConfig) {
          return;
        }
        this.config = { ...this.config, ...queryConfig };
        this.activePane = 'match';
      } else if (this.activePane === 'match') {
        let matchConfig = await this.$refs.match.validate();
        if (!matchConfig) {
          return;
        }
        this.config = { ...this.config, ...matchConfig };
        this.activePane = 'alert';
      } else if (this.activePane === 'alert') {
        this.activePane = 'save';
      }
    },

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
        this.nextDisabled = true;
        if (!(await this.getMapping())) {
          this.nextDisabled = false;
          return false;
        }
        this.nextDisabled = false;
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
