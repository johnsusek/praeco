<template>
  <el-form ref="form" :model="config" label-position="top" @submit.native.prevent>
    <br>

    <el-card header="Match type">
      <el-select v-model="config.type" placeholder="Select">
        <el-option key="any" label="Any" value="any" />
        <el-option key="blacklist" label="Blacklist" value="blacklist" />
        <el-option key="whitelist" label="Whitelist" value="whitelist" />
        <el-option key="frequency" label="Frequency" value="frequency" />
      </el-select>

      <label v-if="config.type === 'any'">
        The "any" rule will match everything.
        Every hit that the query returns will generate an alert.
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

      <ConfigTypeBlacklist
        v-if="config.type === 'blacklist'"
        ref="blacklist"
        :config="config"
        :fields="fields" />

      <ConfigTypeWhitelist
        v-if="config.type === 'whitelist'"
        ref="whitelist"
        :config="config"
        :fields="fields" />

      <ConfigTypeFrequency
        v-if="config.type === 'frequency'"
        ref="freq"
        :config="config"
        :index="index"
        :fields="fields"
        :types="types"
        :query="config.filter[0].query" />
    </el-card>

    <!-- <vue-json-pretty :data="config" /> -->
  </el-form>
</template>

<script>
import Vue from 'vue';
import debounce from 'debounce';
import ConfigTypeBlacklist from './ConfigTypeBlacklist';
import ConfigTypeWhitelist from './ConfigTypeWhitelist';
import ConfigTypeFrequency from './ConfigTypeFrequency';

export default {
  components: {
    ConfigTypeBlacklist,
    ConfigTypeWhitelist,
    ConfigTypeFrequency
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
      handler() {
        // When switching between match types, we want to clear
        // any config items that might have been set for the old selection
        if (this.config.type !== 'blacklist') {
          Vue.delete(this.config, 'compare_key');
          Vue.delete(this.config, 'blacklist');
        }
        if (this.config.type !== 'whitelist') {
          Vue.delete(this.config, 'whitelist');
          Vue.delete(this.config, 'ignore_null');
        } else if (!this.config.ignore_null) Vue.set(this.config, 'ignore_null', false);
        if (this.config.type !== 'frequency') {
          Vue.delete(this.config, 'num_events');
          Vue.delete(this.config, 'timeframe');
          Vue.delete(this.config, 'terms_size');
          Vue.delete(this.config, 'use_count_query');
          Vue.delete(this.config, 'use_terms_query');
          Vue.delete(this.config, 'query_key');
          Vue.delete(this.config, 'doc_type');
        } else {
          if (!this.config.num_events) Vue.set(this.config, 'num_events', 1);
          if (!this.config.timeframe) Vue.set(this.config, 'timeframe', { minutes: 10 });
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
    preview: debounce(function() {
      this.$emit('preview', this.config);
    }, 350),

    async validate() {
      try {
        if (this.$refs.freq) {
          await this.$refs.freq.$refs.form.validate();
        }
        if (this.$refs.blacklist) {
          await this.$refs.blacklist.$refs.form.validate();
        }
        if (this.$refs.whitelist) {
          await this.$refs.whitelist.$refs.form.validate();
        }
        await this.$refs.form.validate();
        return this.config;
      } catch (error) {
        return false;
      }
    }
  }
};
</script>
