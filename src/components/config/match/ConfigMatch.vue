<template>
  <el-form ref="form" :model="config" label-position="top" @submit.native.prevent>
    <br>

    <el-card header="Match type">
      <el-select v-model="config.type" placeholder="Select">
        <el-option key="any" label="Any" value="any" />
        <el-option key="blacklist" label="Blacklist" value="blacklist" />
        <el-option key="whitelist" label="Whitelist" value="whitelist" />
        <el-option key="change" label="Change" value="change" />
        <el-option key="frequency" label="Frequency" value="frequency" />
        <el-option key="spike" label="Spike" value="spike" />
      </el-select>

      <label v-if="config.type === 'any'">
        The "any" rule will match everything.
        Every hit that the query returns will generate an alert.
      </label>
      <label v-if="config.type === 'change'">
        This rule will monitor a certain field and match if that field changes.
        The field must change with respect to the last event with the same query key.
      </label>
      <label v-if="config.type === 'blacklist'">
        The blacklist rule will check a certain field against a
        blacklist, and match if it is in the blacklist.
      </label>
      <label v-if="config.type === 'whitelist'">
        This rule will compare a certain field to a whitelist,
        and match if the list does not contain the term.
      </label>
      <label v-if="config.type === 'frequency'">
        This rule matches when there are at least a certain number of
        events in a given time frame. This may be counted on a per-"query key" basis.
      </label>
      <label v-if="config.type === 'spike'">
        This rule matches when the volume of events during a given time period is
        "spike height" times larger or smaller than during the previous time period.
      </label>

      <ConfigMatchBlacklist
        v-if="config.type === 'blacklist'"
        ref="blacklist"
        :blacklist="config.blacklist"
        :compare-key="config.compare_key"
        :fields="fields"
        @input="updateBlacklistConfig" />

      <ConfigMatchWhitelist
        v-if="config.type === 'whitelist'"
        ref="whitelist"
        :whitelist="config.whitelist"
        :compare-key="config.compare_key"
        :ignore-null="config.ignore_null"
        :fields="fields"
        @input="updateWhitelistConfig" />

      <ConfigMatchChange
        v-if="config.type === 'change'"
        ref="change"
        :fields="fields"
        :compare-key="config.compare_key"
        :ignore-null="config.ignore_null"
        :query-key="config.query_key"
        :timeframe="config.timeframe"
        @input="updateChangeConfig" />

      <ConfigMatchFrequency
        v-if="config.type === 'frequency'"
        ref="freq"
        :query="config.filter[0].query.query_string.query"
        :index="index"
        :fields="fields"
        :types="types"
        :timeframe="config.timeframe"
        :num-events="config.num_events"
        :strftime="config.use_strftime_index"
        :terms-size="config.terms_size"
        :query-key="config.query_key"
        :doc-type="config.doc_type"
        :use-count-query="config.use_count_query"
        :use-terms-query="config.use_terms_query"
        @input="updateFrequencyConfig" />

      <ConfigMatchSpike
        v-if="config.type === 'spike'"
        ref="spike"
        :index="index"
        :query="config.filter[0].query.query_string.query"
        :strftime="config.use_strftime_index"
        :timeframe="config.timeframe"
        :threshold-ref="config.threshold_ref"
        :threshold-cur="config.threshold_cur"
        :spike-type="config.spike_type"
        :spike-height="config.spike_height"
        @input="updateSpikeConfig" />
    </el-card>

    <!-- <vue-json-pretty :data="config" /> -->
  </el-form>
</template>

<script>
import Vue from 'vue';
import debounce from 'debounce';
import ConfigMatchBlacklist from '@/components/config/match/ConfigMatchBlacklist';
import ConfigMatchWhitelist from '@/components/config/match/ConfigMatchWhitelist';
import ConfigMatchFrequency from '@/components/config/match/ConfigMatchFrequency';
import ConfigMatchSpike from '@/components/config/match/ConfigMatchSpike';
import ConfigMatchChange from '@/components/config/match/ConfigMatchChange';

export default {
  components: {
    ConfigMatchBlacklist,
    ConfigMatchWhitelist,
    ConfigMatchFrequency,
    ConfigMatchSpike,
    ConfigMatchChange
  },

  props: ['prefill', 'fields', 'types', 'index'],

  data() {
    return {
      config: {}
    };
  },

  watch: {
    'config.type': {
      immediate: true,
      handler(type, oldType) {
        // When switching between match types, we want to clear
        // any config items that might have been set for the old selection
        if (oldType === 'blacklist') {
          this.clearBlacklistConfig();
        } else if (oldType === 'whitelist') {
          this.clearWhitelistConfig();
        } else if (oldType === 'change') {
          this.clearChangeConfig();
        } else if (oldType === 'frequency') {
          this.clearFrequencyConfig();
        } else if (oldType === 'spike') {
          this.clearSpikeConfig();
        }
      }
    },

    prefill() {
      this.config = this.prefill;
    }
  },

  mounted() {
    this.config = this.prefill;
  },

  methods: {
    clearBlacklistConfig() {
      Vue.delete(this.config, 'compare_key');
      Vue.delete(this.config, 'blacklist');
    },

    clearWhitelistConfig() {
      Vue.delete(this.config, 'compare_key');
      Vue.delete(this.config, 'ignore_null');
      Vue.delete(this.config, 'whitelist');
    },

    clearChangeConfig() {
      Vue.delete(this.config, 'compare_key');
      Vue.delete(this.config, 'timeframe');
      Vue.delete(this.config, 'query_key');
      Vue.delete(this.config, 'ignore_null');
    },

    clearFrequencyConfig() {
      Vue.delete(this.config, 'timeframe');
      Vue.delete(this.config, 'query_key');
      Vue.delete(this.config, 'num_events');
      Vue.delete(this.config, 'terms_size');
      Vue.delete(this.config, 'use_count_query');
      Vue.delete(this.config, 'use_terms_query');
      Vue.delete(this.config, 'doc_type');
    },

    clearSpikeConfig() {
      Vue.delete(this.config, 'spike_type');
      Vue.delete(this.config, 'spike_height');
      Vue.delete(this.config, 'timeframe');
      Vue.delete(this.config, 'threshold_ref');
      Vue.delete(this.config, 'threshold_cur');
    },

    async updateWhitelistConfig() {
      let form = await this.$refs.whitelist.validate();

      if (!form) {
        this.clearWhitelistConfig();
        return;
      }

      Vue.set(this.config, 'compare_key', form.compareKey);

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
    },

    async updateBlacklistConfig() {
      let form = await this.$refs.blacklist.validate();

      if (!form) {
        this.clearBlacklistConfig();
        return;
      }

      Vue.set(this.config, 'compare_key', form.compareKey);

      if (form.blacklist && form.blacklist.length) {
        Vue.set(this.config, 'blacklist', form.blacklist);
      } else {
        Vue.delete(this.config, 'blacklist');
      }
    },

    async updateChangeConfig() {
      let form = await this.$refs.change.validate();

      if (!form) {
        this.clearChangeConfig();
        return;
      }

      Vue.set(this.config, 'compare_key', form.compareKey);

      if (form.ignoreNull) {
        Vue.set(this.config, 'ignore_null', form.ignoreNull);
      } else {
        Vue.delete(this.config, 'ignore_null');
      }

      if (form.queryKey) {
        Vue.set(this.config, 'query_key', form.queryKey);
      }

      if (form.timeframe) {
        Vue.set(this.config, 'timeframe', form.timeframe);
      } else {
        Vue.delete(this.config, 'timeframe');
      }
    },

    async updateSpikeConfig() {
      let form = await this.$refs.spike.validate();

      if (!form) {
        this.clearSpikeConfig();
        return;
      }

      Vue.set(this.config, 'spike_height', parseFloat(form.spikeHeight));
      Vue.set(this.config, 'timeframe', form.timeframe);
      Vue.set(this.config, 'spike_type', form.spikeType);

      if (form.thresholdRef) {
        Vue.set(this.config, 'threshold_ref', parseFloat(form.thresholdRef));
      } else {
        Vue.delete(this.config, 'threshold_ref');
      }

      if (form.thresholdCur) {
        Vue.set(this.config, 'threshold_cur', parseFloat(form.thresholdCur));
      } else {
        Vue.delete(this.config, 'threshold_cur');
      }
    },

    async updateFrequencyConfig() {
      let form = await this.$refs.freq.validate();

      if (!form) {
        this.updateFrequencyConfig();
        return;
      }

      Vue.set(this.config, 'num_events', parseFloat(form.numEvents));
      Vue.set(this.config, 'timeframe', form.timeframe);

      if (form.termsSize) {
        Vue.set(this.config, 'terms_size', parseFloat(form.termsSize));
      } else {
        Vue.delete(this.config, 'threshold_cur');
      }

      if (form.docType) {
        Vue.set(this.config, 'doc_type', form.docType);
      } else {
        Vue.delete(this.config, 'doc_type');
      }

      if (form.queryKey) {
        Vue.set(this.config, 'query_key', form.queryKey);
      } else {
        Vue.delete(this.config, 'query_key');
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
    },

    preview: debounce(function() {
      this.$emit('preview', this.config);
    }, 350),

    async validate() {
      try {
        if (this.$refs.freq) {
          if (!await this.$refs.freq.validate()) {
            return false;
          }
        }
        if (this.$refs.spike) {
          if (!await this.$refs.spike.validate()) {
            return false;
          }
        }
        if (this.$refs.blacklist) {
          if (!await this.$refs.blacklist.validate()) {
            return false;
          }
        }
        if (this.$refs.whitelist) {
          if (!await this.$refs.whitelist.validate()) {
            return false;
          }
        }
        if (this.$refs.change) {
          if (!await this.$refs.change.validate()) {
            return false;
          }
        }

        if (!await this.$refs.form.validate()) {
          return false;
        }

        return this.config;
      } catch (error) {
        return false;
      }
    }
  }
};
</script>
