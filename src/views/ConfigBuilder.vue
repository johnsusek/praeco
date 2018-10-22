<template>
  <div>
    <el-row :gutter="2" class="drawer-row">
      <el-col :span="24">
        <h1 class="m-s-xl">{{ pageTitle }}</h1>

        <!-- <vue-json-pretty :data="$store.getters['config/config']" /> -->

        <el-steps
          :active="steps.indexOf(activePane)"
          align-center
          class="builder-steps m-s-xl"
          process-status="finish"
          finish-status="success">
          <el-step title="Settings" />
          <el-step title="Filter" />
          <el-step title="Match" />
          <el-step title="Alert" />
          <el-step title="Save" />
        </el-steps>

        <el-collapse v-model="activePane" :accordion="true" class="builder-collapse">
          <el-collapse-item title="Settings" name="settings">
            <ConfigSettings
              ref="settings"
              :type="type"
              :prefill-path="prefill"
              action="add" />

            <el-button class="m-n-lg" type="primary" @click="nextPane">Continue</el-button>
          </el-collapse-item>

          <el-collapse-item title="Filter" name="query">
            <ConfigQuery ref="query" />

            <el-button class="m-n-lg" type="primary" @click="nextPane">Continue</el-button>
            <el-button class="m-n-lg" @click="previousPane">Back</el-button>
          </el-collapse-item>

          <el-collapse-item title="Match" name="match">
            <ConfigMatch ref="match" />

            <el-button class="m-n-lg" type="primary" @click="nextPane">Continue</el-button>
            <el-button class="m-n-lg" @click="previousPane">Back</el-button>
          </el-collapse-item>

          <el-collapse-item title="Alert" name="alert">
            <ConfigAlert ref="alert" />

            <el-button class="m-n-lg" type="primary" @click="nextPane">Continue</el-button>
            <el-button class="m-n-lg" @click="previousPane">Back</el-button>
          </el-collapse-item>

          <el-collapse-item title="Save" name="save">
            <el-button v-if="!saving" type="primary" plain @click="save">Save</el-button>
            <el-button v-else type="primary" plain disabled>Saving...</el-button>
          </el-collapse-item>
        </el-collapse>
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
      activePane: 'settings',
      steps: ['settings', 'query', 'match', 'alert', 'save']
    };
  },

  computed: {
    showDrawer() {
      return ((this.activeTab.includes('query') || this.activeTab.includes('match')) &&
      ['any', 'spike', 'frequency'].includes(this.$store.state.config.match.type))
        && this.$store.state.config.query.tree.children.length;
    },

    pageTitle() {
      let title = `Add ${this.type}`;
      return title;
    },
  },

  async mounted() {
    this.$store.dispatch('config/reset');
    this.$store.commit('config/UPDATE_TYPE', this.type);

    this.$nextTick(() => {
      this.$refs.settings.$refs.form.clearValidate();
    });

    if (this.prefill) {
      await this.$store.dispatch('config/load', { type: 'templates', path: this.prefill });
      this.$store.commit('config/UPDATE_PATH', '');
      this.$store.commit('config/settings/UPDATE_NAME', 'New rule');
    }
  },

  destroyed() {
    this.$store.dispatch('config/reset');
  },

  methods: {
    async previousPane() {
      if (this.activePane === 'save') {
        this.activePane = 'alert';
      } else if (this.activePane === 'alert') {
        this.activePane = 'match';
      } else if (this.activePane === 'match') {
        this.activePane = 'query';
      } else if (this.activePane === 'query') {
        this.activePane = 'settings';
      }
    },

    async nextPane() {
      if (this.activePane === 'settings') {
        try {
          await this.$refs.settings.$refs.form.validate();
          this.activePane = 'query';
        } catch (error) {}
      } else if (this.activePane === 'query') {
        this.activePane = 'match';
      } else if (this.activePane === 'match') {
        try {
          if (await this.$refs.match.validate()) {
            this.activePane = 'alert';
          }
        } catch (error) {}
      } else if (this.activePane === 'alert') {
        try {
          await this.$refs.alert.$refs.form.validate();
          this.activePane = 'save';
        } catch (error) {}
      }
    }
  }
};
</script>

<style>
.builder-collapse.el-collapse {
  border-bottom: none;
  padding-top: 15px;
}

.builder-collapse .el-collapse-item {
  display: none;
}

.builder-collapse .el-collapse-item.is-active {
  display: block;
}

.builder-collapse .el-collapse-item__header {
  pointer-events: none;
  display: none;
}

.builder-collapse .el-collapse-item__wrap {
  transition-property: none;
}
</style>
