<template>
  <div v-if="$store.state.config.settings.name">
    <el-row :gutter="2" class="drawer-row">
      <el-col :span="24">
        <h1 class="m-s-sm">{{ pageTitle }}</h1>

        <!-- <vue-json-pretty :data="$store.getters['config/config']" /> -->

        <el-button v-if="!saving" type="primary" plain @click="save">Save</el-button>
        <el-button v-else type="primary" plain disabled>Saving...</el-button>

        <el-tabs v-model="activeTab" type="card" class="el-tabs-padded m-n-lg">
          <el-tab-pane label="Settings" name="settings">
            <ConfigSettings
              ref="settings"
              :type="type"
              :prefill-path="prefill"
              action="edit" />
          </el-tab-pane>
          <el-tab-pane label="Filter" name="query">
            <ConfigQuery ref="query" />
          </el-tab-pane>
          <el-tab-pane label="Match" name="match">
            <ConfigMatch ref="match" />
          </el-tab-pane>
          <el-tab-pane label="Alert" name="alert">
            <ConfigAlert ref="alert" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <ConfigDrawer v-if="showDrawer" />
  </div>
</template>

<script>
import ConfigSettings from '@/components/config/ConfigSettings.vue';
import ConfigQuery from '@/components/config/ConfigQuery.vue';
import ConfigAlert from '@/components/config/alert/ConfigAlert.vue';
import ConfigMatch from '@/components/config/match/ConfigMatch.vue';
import ConfigDrawer from '@/components/config/ConfigDrawer.vue';
import configSave from '@/mixins/configSave';

export default {
  components: {
    ConfigSettings,
    ConfigQuery,
    ConfigMatch,
    ConfigAlert,
    ConfigDrawer,
  },

  mixins: [configSave],

  props: ['path', 'type', 'prefill'],

  data() {
    return {
      activeTab: 'settings',
    };
  },

  computed: {
    showDrawer() {
      return ((this.activeTab.includes('query') || this.activeTab.includes('match')) &&
      ['any', 'spike', 'frequency'].includes(this.$store.state.config.match.type))
        && this.$store.state.config.query.tree.children.length;
    },

    pageTitle() {
      let title = `Edit ${this.type}`;
      title += ` ${this.$store.state.config.settings.name}`;
      return title;
    },
  },

  async mounted() {
    this.$store.dispatch('config/reset');
    this.$store.commit('config/UPDATE_TYPE', this.type);

    this.$store.dispatch('config/load', { type: `${this.type}s`, path: this.path });
  },

};
</script>
