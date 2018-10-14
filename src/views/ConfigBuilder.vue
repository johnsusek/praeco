<template>
  <div>
    <el-row :gutter="2" class="drawer-row">
      <el-col :span="24">
        <h1 class="m-s-xl">{{ pageTitle }}</h1>

        <el-collapse v-model="activePane" :accordion="true">
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
            <el-button class="m-n-lg" type="text" @click="previousPane">Back</el-button>
          </el-collapse-item>

          <el-collapse-item title="Match" name="match">
            <ConfigMatch ref="match" />

            <el-button class="m-n-lg" type="primary" @click="nextPane">Continue</el-button>
            <el-button class="m-n-lg" type="text" @click="previousPane">Back</el-button>
          </el-collapse-item>

          <el-collapse-item title="Alert" name="alert">
            <ConfigAlert ref="alert" />

            <el-button class="m-n-lg" type="primary" @click="nextPane">Continue</el-button>
            <el-button class="m-n-lg" type="text" @click="previousPane">Back</el-button>
          </el-collapse-item>

          <el-collapse-item title="Save" name="save">
            <el-button v-if="!saving" type="primary" plain @click="save">Save</el-button>
            <el-button v-else type="primary" plain disabled>Saving...</el-button>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>

    <el-card v-if="showDrawer" class="drawer-card">
      <ConfigDrawer />
    </el-card>
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
    };
  },

  computed: {
    showDrawer() {
      return this.activePane.includes('query') || this.activePane.includes('match');
    },

    pageTitle() {
      let title = `Add ${this.type}`;
      return title;
    },
  },

  async mounted() {
    this.$store.commit('config/UPDATE_TYPE', this.type);

    if (this.prefill) {
      // First we get the prefill from the store
      // and merge it into the config we are working on
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
      } if (this.activePane === 'match') {
        this.activePane = 'query';
      } if (this.activePane === 'query') {
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
