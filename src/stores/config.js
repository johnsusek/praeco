import { defineStore } from 'pinia';
import { useConfigsStore } from './configs.js';
import yaml from 'js-yaml';

export const useConfigStore = defineStore('config', {
  state: () => ({
    path: '',
    type: '',
    
    valid: true,
    validating: false,
    validateError: null,
    
    sampleResult: null,
    
    // Settings state
    settings: {
      name: '',
      type: '',
      index: '',
      timeField: '@timestamp',
      realert: '5m',
      queryDelay: '0s',
      bufferTime: '45s',
      scanEntireTimeframe: false,
      runEvery: { minutes: 1 },
      import: '',
      maxQuerySize: 10000,
      aggregationSchedule: '* * * * *',
      summaryPrefix: '',
      timestampFormat: '%Y-%m-%dT%H:%M:%S.%fZ',
      timestampFormatExpr: '',
      useStrftimeFormat: true,
      generateKibanaLink: true,
      kibanaUrl: '',
      shardTimeout: 30,
      maxScrollingCount: 995000,
      metricAggKey: '',
      docType: '',
      owner: '',
      priority: 2,
      category: '',
      description: '',
      tags: [],
      generateKibanaDiscoverUrl: true,
      kibanaDiscoverApp: 'discover',
      kibanaDiscoverIndex: '',
      kibanaDiscoverVersion: '7.15.0',
      useKibanaDiscoverLink: 'Always',
      kibanaDiscoverColumns: ['_source'],
      kibanaDiscoverFromTimedelta: { minutes: 10 },
      kibanaDiscoverToTimedelta: { minutes: 10 },
      limitExecution: { times: 1, schedule: '* * * * *' }
    },
    
    // Query state
    query: {
      queryType: 'query_string',
      queryString: '',
      rawQuery: ''
    },
    
    // Match state  
    match: {
      type: '',
      numEvents: 1,
      timeframe: { minutes: 5 },
      queryKey: '',
      blacklist: [],
      whitelist: [],
      compareKey: '',
      ignoreNull: true,
      doc: {},
      useCountQuery: true,
      useTermsQuery: false,
      termsSize: 50,
      cardinality: '',
      maxCardinality: 0,
      minCardinality: 0,
      usePercentageMatch: false,
      matchBucket: { minutes: 5 },
      minPercentage: 30,
      maxPercentage: 70,
      percentageFormatString: '{0}%',
      spike: { up: 2, down: 2 },
      threshold: { up: 1.5, down: 0.5 },
      metric: { up: 0, down: 0 },
      aggregationKey: '',
      summaryTableFields: []
    },
    
    // Alert state
    alert: {
      subjectArgs: [],
      textArgs: [],
      subject: 'ElastAlert: {0}',
      text: '',
      alerters: []
    }
  }),

  getters: {
    config() {
      return {
        settings: this.settings,
        query: this.query,
        match: this.match,
        alert: this.alert
      };
    },

    yaml() {
      return (raw = false) => {
        const configsStore = useConfigsStore();
        
        // If we have a full path, get the config from the configs store
        if (this.path && configsStore.rules && configsStore.rules[this.path]) {
          let config = configsStore.rules[this.path];
          
          if (raw) {
            return config;
          }
          
          // Create a clean copy for YAML generation, maintaining field order
          let yamlConfig = {};
          
          // Ensure __praeco_full_path comes first
          yamlConfig.__praeco_full_path = config.__praeco_full_path || this.path;
          
          // Convert query builder back to string format for YAML
          if (config.__praeco_query_builder && typeof config.__praeco_query_builder === 'object') {
            yamlConfig.__praeco_query_builder = JSON.stringify(config.__praeco_query_builder);
          } else if (config.__praeco_query_builder) {
            yamlConfig.__praeco_query_builder = config.__praeco_query_builder;
          }
          
          // Copy all other fields in a specific order to match expected output
          const fieldOrder = [
            'alert', 'alert_subject', 'alert_subject_args', 'alert_text', 'alert_text_args', 'alert_text_type',
            'dingtalk_access_token', 'dingtalk_btn_orientation', 'dingtalk_msgtype', 'dingtalk_single_title', 
            'dingtalk_single_url', 'doc_type', 'filter', 'import', 'index',
            'is_enabled', 'match_enhancements', 'name', 'num_events', 'realert',
            'terms_size', 'timeframe', 'timestamp_field', 'timestamp_type', 
            'type', 'use_count_query', 'use_strftime_index'
          ];
          
          fieldOrder.forEach(field => {
            if (config[field] !== undefined) {
              yamlConfig[field] = config[field];
            }
          });
          
          // Add any remaining fields not in the order list
          Object.keys(config).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(yamlConfig, key) && key !== '__praeco_query_builder') {
              yamlConfig[key] = config[key];
            }
          });
          
          return yaml.dump(yamlConfig, { 
            quotingType: '"', 
            forceQuotes: true,
            flowLevel: -1,
            sortKeys: true
          });
        }
        
        return '';
      };
    }
  },

  actions: {
    updateType(type) {
      this.type = type;
    },

    updateValid(valid) {
      this.valid = valid;
    },

    updateValidating(validating) {
      this.validating = validating;
    },

    updateValidationError(validateError) {
      this.validateError = validateError;
    },

    updateSampleResult(sampleResult) {
      this.sampleResult = sampleResult;
    },

    updatePath(path) {
      this.path = path;
    },

    // Settings actions
    updateSettingsProperty({ property, value }) {
      this.settings[property] = value;
    },

    // Query actions
    updateQueryProperty({ property, value }) {
      this.query[property] = value;
    },

    // Match actions
    updateMatchProperty({ property, value }) {
      this.match[property] = value;
    },

    // Alert actions  
    updateAlertProperty({ property, value }) {
      this.alert[property] = value;
    },

    // Load config
    loadConfig(config) {
      if (config.settings) {
        Object.assign(this.settings, config.settings);
      }
      if (config.query) {
        Object.assign(this.query, config.query);
      }
      if (config.match) {
        Object.assign(this.match, config.match);
      }
      if (config.alert) {
        Object.assign(this.alert, config.alert);
      }
    },

    // Load config from API
    async load({ type, path }) {
      const configsStore = useConfigsStore();
      
      // Update our internal path reference
      this.path = path;
      this.type = type;
      
      // Fetch the config from the API via configs store
      await configsStore.fetchConfig({ path, type });
      
      // The config is now available in configsStore[type][path]
      // We don't need to copy it to this store as the getter will read from configs store
    },

    resetConfig() {
      // Reset to initial state
      this.$reset();
    }
  }
});