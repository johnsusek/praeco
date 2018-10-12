<template>
  <el-form
    ref="form"
    :model="$store.state.config.match"
    label-position="top"
    @submit.native.prevent>

    <el-row :gutter="100">
      <el-col :span="12">
        <div :class="{ 'm-s-med': type !== 'any' }">
          <el-select
            v-model="type"
            placeholder="Select"
            size="medium">
            <el-option key="any" label="Any" value="any" />
            <el-option key="blacklist" label="Blacklist" value="blacklist" />
            <el-option key="whitelist" label="Whitelist" value="whitelist" />
            <el-option key="change" label="Change" value="change" />
            <el-option key="frequency" label="Frequency" value="frequency" />
            <el-option key="spike" label="Spike" value="spike" />
          </el-select>

          <label v-if="type === 'any'">
            The "any" rule will match everything.
            Every hit that the query returns will generate an alert.
          </label>
          <label v-if="type === 'change'">
            This rule will monitor a certain field and match if that field changes.
            The field must change with respect to the last event with the same query key.
          </label>
          <label v-if="type === 'blacklist'">
            The blacklist rule will check a certain field against a
            blacklist, and match if it is in the blacklist.
          </label>
          <label v-if="type === 'whitelist'">
            This rule will compare a certain field to a whitelist,
            and match if the list does not contain the term.
          </label>
          <label v-if="type === 'frequency'">
            This rule matches when there are at least a certain number of
            events in a given time frame. This may be counted on a per-"query key" basis.
          </label>
          <label v-if="type === 'spike'">
            This rule matches when the volume of events during a given time period is
            "spike height" times larger or smaller than during the previous time period.
          </label>
        </div>

        <ConfigMatchBlacklist v-if="type === 'blacklist'" ref="blacklist" />
        <ConfigMatchWhitelist v-if="type === 'whitelist'" ref="whitelist" />
        <ConfigMatchChange v-if="type === 'change'" ref="change" />
        <ConfigMatchFrequency v-if="type === 'frequency'" ref="freq" />
        <ConfigMatchSpike v-if="type === 'spike'" ref="spike" />
      </el-col>

      <el-col :span="12">
        <ConfigTest />
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import ConfigMatchBlacklist from '@/components/config/match/ConfigMatchBlacklist';
import ConfigMatchWhitelist from '@/components/config/match/ConfigMatchWhitelist';
import ConfigMatchFrequency from '@/components/config/match/ConfigMatchFrequency';
import ConfigMatchSpike from '@/components/config/match/ConfigMatchSpike';
import ConfigMatchChange from '@/components/config/match/ConfigMatchChange';
import ConfigTest from '@/components/config/ConfigTest';

export default {
  components: {
    ConfigMatchBlacklist,
    ConfigMatchWhitelist,
    ConfigMatchFrequency,
    ConfigMatchSpike,
    ConfigMatchChange,
    ConfigTest
  },

  computed: {
    type: {
      get() {
        return this.$store.state.config.match.type;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_TYPE', value);
      }
    },
  },

  methods: {
    async validate() {
      try {
        if (this.$refs.freq) {
          if (!await this.$refs.freq.$refs.form.validate()) {
            return false;
          }
        }
        if (this.$refs.spike) {
          if (!await this.$refs.spike.$refs.form.validate()) {
            return false;
          }
        }
        if (this.$refs.blacklist) {
          if (!await this.$refs.blacklist.$refs.form.validate()) {
            return false;
          }
        }
        if (this.$refs.whitelist) {
          if (!await this.$refs.whitelist.$refs.form.validate()) {
            return false;
          }
        }
        if (this.$refs.change) {
          if (!await this.$refs.change.$refs.form.validate()) {
            return false;
          }
        }

        return true;
      } catch (error) {
        return false;
      }
    }
  }
};
</script>
