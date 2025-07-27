import { defineStore } from 'pinia';
import axios from 'axios';
import yaml from 'js-yaml';
import { htmlToConfigFormat } from '@/lib/alertText';
import { logger } from '@/lib/logger.js';

let sampleCancelToken = null;

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

    resetConfig() {
      // Reset to initial state
      this.$reset();
    }
  }
});