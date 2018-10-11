<template>
  <el-form ref="form" :model="form" label-position="top" @submit.native.prevent>
    <div :class="{ 'm-s-med': form.type !== 'any' }">
      <el-select
        v-model="form.type"
        placeholder="Select"
        size="medium">
        <el-option key="any" label="Any" value="any" />
        <el-option key="blacklist" label="Blacklist" value="blacklist" />
        <el-option key="whitelist" label="Whitelist" value="whitelist" />
        <el-option key="change" label="Change" value="change" />
        <el-option key="frequency" label="Frequency" value="frequency" />
        <el-option key="spike" label="Spike" value="spike" />
      </el-select>

      <label v-if="form.type === 'any'">
        The "any" rule will match everything.
        Every hit that the query returns will generate an alert.
      </label>
      <label v-if="form.type === 'change'">
        This rule will monitor a certain field and match if that field changes.
        The field must change with respect to the last event with the same query key.
      </label>
      <label v-if="form.type === 'blacklist'">
        The blacklist rule will check a certain field against a
        blacklist, and match if it is in the blacklist.
      </label>
      <label v-if="form.type === 'whitelist'">
        This rule will compare a certain field to a whitelist,
        and match if the list does not contain the term.
      </label>
      <label v-if="form.type === 'frequency'">
        This rule matches when there are at least a certain number of
        events in a given time frame. This may be counted on a per-"query key" basis.
      </label>
      <label v-if="form.type === 'spike'">
        This rule matches when the volume of events during a given time period is
        "spike height" times larger or smaller than during the previous time period.
      </label>
    </div>

    <ConfigMatchBlacklist
      v-if="form.type === 'blacklist'"
      ref="blacklist"
      :blacklist="form.blacklist"
      :compare-key="form.compareKey"
      :fields="fields"
      @input="updateBlacklistConfig" />

    <ConfigMatchWhitelist
      v-if="form.type === 'whitelist'"
      ref="whitelist"
      :whitelist="form.whitelist"
      :compare-key="form.compareKey"
      :ignore-null="form.ignoreNull"
      :fields="fields"
      @input="updateWhitelistConfig" />

    <ConfigMatchChange
      v-if="form.type === 'change'"
      ref="change"
      :fields="fields"
      :compare-key="form.compareKey"
      :ignore-null="form.ignoreNull"
      :query-key="form.queryKey"
      :timeframe="form.timeframe"
      @input="updateChangeConfig" />

    <ConfigMatchFrequency
      v-if="form.type === 'frequency'"
      ref="freq"
      :query="form.queryString"
      :index="index"
      :fields="fields"
      :types="types"
      :timeframe="form.timeframe"
      :num-events="form.numEvents"
      :strftime="form.strftime"
      :terms-size="form.termsSize"
      :query-key="form.queryKey"
      :doc-type="form.docType"
      :use-count-query="form.useCountQuery"
      :use-terms-query="form.useTermsQuery"
      @updateTimeframe="(t) => $emit('updateTimeframe', t)"
      @updateMarkLine="(m) => $emit('updateMarkLine', m)"
      @input="updateFrequencyConfig" />

    <ConfigMatchSpike
      v-if="form.type === 'spike'"
      ref="spike"
      :index="index"
      :query="form.queryString"
      :strftime="form.strftime"
      :timeframe="form.timeframe"
      :threshold-ref="form.thresholdRef"
      :threshold-cur="form.thresholdCur"
      :spike-type="form.spikeType"
      :spike-height="form.spikeHeight"
      @updateSpikeHeight="(m) => $emit('updateSpikeHeight', m)"
      @updateTimeframe="(t) => $emit('updateTimeframe', t)"
      @updateMarkLine="(m) => $emit('updateMarkLine', m)"
      @input="updateSpikeConfig" />

  </el-form>
</template>

<script>
import Vue from 'vue';
import ConfigMatchBlacklist from '@/components/config/match/ConfigMatchBlacklist';
import ConfigMatchWhitelist from '@/components/config/match/ConfigMatchWhitelist';
import ConfigMatchFrequency from '@/components/config/match/ConfigMatchFrequency';
import ConfigMatchSpike from '@/components/config/match/ConfigMatchSpike';
import ConfigMatchChange from '@/components/config/match/ConfigMatchChange';
import { validateForm } from '@/mixins/validateForm';

export default {
  components: {
    ConfigMatchBlacklist,
    ConfigMatchWhitelist,
    ConfigMatchFrequency,
    ConfigMatchSpike,
    ConfigMatchChange
  },

  mixins: [validateForm],

  props: [
    'spikeHeight',
    'spikeType',

    'thresholdRef',
    'thresholdCur',

    'useTermsQuery',
    'useCountQuery',

    'docType',
    'termsSize',

    'strftime',

    'numEvents',

    'timeframe',

    'queryKey',

    'compareKey',
    'blacklist',
    'whitelist',
    'ignoreNull',

    'type',
    'fields',
    'types',
    'index'
  ],

  watch: {
    'form.type': {
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
  },

  mounted() {
    if (this.type) {
      Vue.set(this.form, 'type', this.type);
    }

    if (this.blacklist) {
      Vue.set(this.form, 'blacklist', this.blacklist);
    }

    if (this.whitelist) {
      Vue.set(this.form, 'whitelist', this.whitelist);
    }

    if (this.compareKey) {
      Vue.set(this.form, 'compareKey', this.compareKey);
    }

    if (this.ignoreNull) {
      Vue.set(this.form, 'ignoreNull', this.ignoreNull);
    }

    if (this.queryKey) {
      Vue.set(this.form, 'queryKey', this.queryKey);
    }

    if (this.timeframe) {
      Vue.set(this.form, 'timeframe', this.timeframe);
    }

    if (this.numEvents) {
      Vue.set(this.form, 'numEvents', this.numEvents);
    }

    if (this.strftime) {
      Vue.set(this.form, 'strftime', this.strftime);
    }

    if (this.termsSize) {
      Vue.set(this.form, 'termsSize', this.termsSize);
    }

    if (this.docType) {
      Vue.set(this.form, 'docType', this.docType);
    }

    if (this.useCountQuery) {
      Vue.set(this.form, 'useCountQuery', this.useCountQuery);
    }

    if (this.useTermsQuery) {
      Vue.set(this.form, 'useTermsQuery', this.useTermsQuery);
    }

    if (this.thresholdCur) {
      Vue.set(this.form, 'thresholdCur', this.thresholdCur);
    }

    if (this.thresholdRef) {
      Vue.set(this.form, 'thresholdRef', this.thresholdRef);
    }

    if (this.spikeHeight) {
      Vue.set(this.form, 'spikeHeight', this.spikeHeight);
    }

    if (this.spikeType) {
      Vue.set(this.form, 'spikeType', this.spikeType);
    }
  },

  methods: {
    clearBlacklistConfig() {
      Vue.delete(this.form, 'compareKey');
      Vue.delete(this.form, 'blacklist');
    },

    clearWhitelistConfig() {
      Vue.delete(this.form, 'compareKey');
      Vue.delete(this.form, 'ignoreNull');
      Vue.delete(this.form, 'whitelist');
    },

    clearChangeConfig() {
      Vue.delete(this.form, 'compareKey');
      Vue.delete(this.form, 'timeframe');
      Vue.delete(this.form, 'queryKey');
      Vue.delete(this.form, 'ignoreNull');
    },

    clearFrequencyConfig() {
      Vue.delete(this.form, 'timeframe');
      Vue.delete(this.form, 'queryKey');
      Vue.delete(this.form, 'numEvents');
      Vue.delete(this.form, 'termsSize');
      Vue.delete(this.form, 'useCountQuery');
      Vue.delete(this.form, 'useTermsQuery');
      Vue.delete(this.form, 'docType');
    },

    clearSpikeConfig() {
      Vue.delete(this.form, 'spikeType');
      Vue.delete(this.form, 'spikeHeight');
      Vue.delete(this.form, 'timeframe');
      Vue.delete(this.form, 'thresholdRef');
      Vue.delete(this.form, 'thresholdCur');
    },

    async updateWhitelistConfig() {
      let form = await this.$refs.whitelist.validate();

      if (!form) {
        this.clearWhitelistConfig();
        return;
      }

      Vue.set(this.form, 'compareKey', form.compareKey);

      if (form.whitelist && form.whitelist.length) {
        Vue.set(this.form, 'whitelist', form.whitelist);
      } else {
        Vue.delete(this.form, 'whitelist');
      }

      if (form.ignoreNull) {
        Vue.set(this.form, 'ignoreNull', form.ignoreNull);
      } else {
        Vue.delete(this.form, 'ignoreNull');
      }
    },

    async updateBlacklistConfig() {
      let form = await this.$refs.blacklist.validate();

      if (!form) {
        this.clearBlacklistConfig();
        return;
      }

      Vue.set(this.form, 'compareKey', form.compareKey);

      if (form.blacklist && form.blacklist.length) {
        Vue.set(this.form, 'blacklist', form.blacklist);
      } else {
        Vue.delete(this.form, 'blacklist');
      }
    },

    async updateChangeConfig() {
      let form = await this.$refs.change.validate();

      if (!form) {
        this.clearChangeConfig();
        return;
      }

      Vue.set(this.form, 'compareKey', form.compareKey);

      if (form.ignoreNull) {
        Vue.set(this.form, 'ignoreNull', form.ignoreNull);
      } else {
        Vue.delete(this.form, 'ignoreNull');
      }

      if (form.queryKey) {
        Vue.set(this.form, 'queryKey', form.queryKey);
      }

      if (form.timeframe) {
        Vue.set(this.form, 'timeframe', form.timeframe);
      } else {
        Vue.delete(this.form, 'timeframe');
      }
    },

    async updateSpikeConfig() {
      let form = await this.$refs.spike.validate();

      if (!form) {
        this.clearSpikeConfig();
        return;
      }

      Vue.set(this.form, 'spikeHeight', parseFloat(form.spikeHeight));
      Vue.set(this.form, 'timeframe', form.timeframe);
      Vue.set(this.form, 'spikeType', form.spikeType);

      if (form.thresholdRef) {
        Vue.set(this.form, 'thresholdRef', parseFloat(form.thresholdRef));
      } else {
        Vue.delete(this.form, 'thresholdRef');
      }

      if (form.thresholdCur) {
        Vue.set(this.form, 'thresholdCur', parseFloat(form.thresholdCur));
      } else {
        Vue.delete(this.form, 'thresholdCur');
      }
    },

    async updateFrequencyConfig() {
      let form = await this.$refs.freq.validate();

      if (!form) {
        this.updateFrequencyConfig();
        return;
      }

      Vue.set(this.form, 'numEvents', parseFloat(form.numEvents));
      Vue.set(this.form, 'timeframe', form.timeframe);

      if (form.termsSize) {
        Vue.set(this.form, 'termsSize', parseFloat(form.termsSize));
      } else {
        Vue.delete(this.form, 'thresholdCur');
      }

      if (form.docType) {
        Vue.set(this.form, 'docType', form.docType);
      } else {
        Vue.delete(this.form, 'docType');
      }

      if (form.queryKey) {
        Vue.set(this.form, 'queryKey', form.queryKey);
      } else {
        Vue.delete(this.form, 'queryKey');
      }

      if (form.useCountQuery) {
        Vue.set(this.form, 'useCountQuery', form.useCountQuery);
      } else {
        Vue.delete(this.form, 'useCountQuery');
      }

      if (form.useTermsQuery) {
        Vue.set(this.form, 'useTermsQuery', form.useTermsQuery);
      } else {
        Vue.delete(this.form, 'useTermsQuery');
      }
    },

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

        return this.form;
      } catch (error) {
        return false;
      }
    }
  }
};
</script>
