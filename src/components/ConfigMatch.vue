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
        :config="config"
        :fields="fields" />

      <ConfigTypeWhitelist
        v-if="config.type === 'whitelist'"
        :config="config"
        :fields="fields" />

      <ConfigTypeFrequency
        v-if="config.type === 'frequency'"
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
        if (this.config.type !== 'blacklist') {
          delete this.config.compare_key;
          delete this.config.blacklist;
        }
        if (this.config.type !== 'whitelist') {
          delete this.config.whitelist;
          delete this.config.ignore_null;
        } else if (!this.config.ignore_null) Vue.set(this.config, 'ignore_null', false);
        if (this.config.type !== 'frequency') {
          delete this.config.num_events;
          delete this.config.timeframe;
        } else {
          if (!this.config.num_events) Vue.set(this.config, 'num_events', 1);
          if (!this.config.timeframe) Vue.set(this.config, 'timeframe', { minutes: 5 });
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
        await this.$refs.form.validate();
        return this.config;
      } catch (error) {
        return false;
      }
    }
  }
};
</script>
