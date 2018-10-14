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
              :action="action"
              :prefill-path="prefill" />

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
            <ConfigSave :action="action" :type="type" />
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
import changeCase from 'change-case';
import ConfigSettings from '@/components/config/ConfigSettings.vue';
import ConfigQuery from '@/components/config/ConfigQuery.vue';
import ConfigAlert from '@/components/config/alert/ConfigAlert.vue';
import ConfigSave from '@/components/config/ConfigSave.vue';
import ConfigMatch from '@/components/config/match/ConfigMatch.vue';
import ConfigDrawer from '@/components/config/ConfigDrawer.vue';

export default {
  components: {
    ConfigSettings,
    ConfigQuery,
    ConfigMatch,
    ConfigAlert,
    ConfigSave,
    ConfigDrawer,
  },

  props: ['path', 'action', 'type', 'prefill'],

  data() {
    return {
      activePane: 'settings',
      activePaneSidebar: 'settings',
    };
  },

  computed: {
    showDrawer() {
      return this.activePane.includes('query') || this.activePane.includes('match');
    },

    pageTitle() {
      let title = `${changeCase.titleCase(this.action)} ${this.type}`;

      if (this.action === 'edit') {
        title += ` ${this.$store.state.config.settings.name}`;
      }

      return title;
    },
  },

  async mounted() {
    if (this.action === 'edit' && this.path) {
      this.$store.dispatch('config/load', { type: `${this.type}s`, path: this.path });
      // get data from store (fetchconfig)
      // and set it to our working config
    } else if (this.action === 'add' && this.prefill) {
      // First we get the prefill from the store
      // and merge it into the config we are working on
    }
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
