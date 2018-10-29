<template>
  <div>
    <h1 class="m-s-xl">{{ pageTitle }}</h1>

    <ConfigSettings
      v-if="prefill && $store.state.config.settings.index || !prefill"
      ref="settings"
      :type="type"
      :prefill-path="prefill"
      action="add" />

    <template v-if="timeField">
      <ConfigCondition ref="condition" class="m-n-xl" @validate="val => valid = val" />

      <ConfigAlert ref="alert" />

      <hr>

      <el-row>
        <ConfigTest :valid="valid" class="m-e-sm" />

        <div class="save-button">
          <el-button v-if="!saving" type="primary" size="medium" @click="save">Save</el-button>
          <el-button v-else type="primary" disabled size="medium">Saving...</el-button>
        </div>
      </el-row>

    <!-- <vue-json-pretty :data="$store.getters['config/config']" /> -->
    </template>
  </div>
</template>

<script>
import ConfigSettings from '@/components/config/ConfigSettings.vue';
import ConfigCondition from '@/components/config/ConfigCondition.vue';
import ConfigTest from '@/components/config/ConfigTest';
import configSave from '@/mixins/configSave';

export default {
  components: {
    ConfigSettings,
    ConfigCondition,
    ConfigTest
  },

  mixins: [configSave],

  props: ['path', 'type', 'prefill'],

  data() {
    return {
      valid: false
    };
  },

  computed: {
    timeField() {
      return this.$store.state.config.settings.timeField;
    },

    name: {
      get() {
        return this.$store.state.config.settings.name;
      },
      set(value) {
        this.$store.commit('config/settings/UPDATE_NAME', value);
      }
    },

    pageTitle() {
      let title = `Add ${this.type}`;

      if (this.name) {
        title += ` “${this.name}”`;
      }

      return title;
    }
  },

  async mounted() {
    this.$store.dispatch('config/reset');
    this.$store.commit('config/UPDATE_TYPE', this.type);

    this.$nextTick(() => {
      if (this.$refs.settings) this.$refs.settings.$refs.form.clearValidate();
    });

    if (this.prefill) {
      await this.$store.dispatch('config/load', { type: 'templates', path: this.prefill });
      this.$store.commit('config/UPDATE_PATH', '');
      this.$store.commit('config/settings/UPDATE_NAME', 'New rule');
    }

    // Since this is a new rule, we want to disable it by default
    this.$store.commit('config/settings/UPDATE_ENABLED', false);
  },

  destroyed() {
    this.$store.dispatch('config/reset');
  }
};
</script>

<style>
.save-button {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
