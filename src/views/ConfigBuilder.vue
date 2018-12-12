<template>
  <div>
    <h1 class="m-s-xl">{{ pageTitle }}</h1>

    <ConfigSettings
      v-if="prefill && index || !prefill"
      ref="settings"
      :type="type"
      :prefill-path="prefill"
      :action="action" />

    <template v-if="index && timeField">
      <ConfigCondition ref="condition" class="m-n-xl m-s-xl" @validate="val => valid = val" />

      <ConfigAlert ref="alert" @validate="validateBuilder" />

      <hr>

      <el-row>
        <ConfigTest :valid="valid" class="m-e-sm" @validate="validateForTest" />

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
import ConfigTest from '@/components/config/ConfigTest';

export default {
  components: {
    ConfigTest
  },

  props: ['path', 'type', 'action', 'prefill'],

  data() {
    return {
      valid: false,
      saving: false
    };
  },

  computed: {
    timeField() {
      return this.$store.state.config.settings.timeField;
    },

    index() {
      return this.$store.state.config.settings.index;
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
      let title = this.action === 'add' ? 'Add ' : 'Edit ';

      title += this.type;

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

    if (this.action === 'add') {
      if (this.prefill) {
        await this.$store.dispatch('config/load', {
          type: 'templates',
          path: this.prefill
        });
        this.$store.commit('config/settings/UPDATE_NAME', '');
      }

      this.$store.commit('config/UPDATE_PATH', this.path);

      // Since this is a new rule, we want to disable it by default
      this.$store.commit('config/settings/UPDATE_ENABLED', false);
    } else if (this.action === 'edit') {
      await this.$store.dispatch('config/load', {
        type: `${this.type}s`,
        path: this.path
      });
      this.$store.dispatch('metadata/fetchMappings', this.index);
    }
  },

  destroyed() {
    this.$store.dispatch('config/reset');
  },

  methods: {
    async save() {
      if (!(await this.validateBuilder())) {
        this.$message.error('Please fill out all required fields before saving.');
        return;
      }

      this.saving = true;

      let res = await this.$store.dispatch('config/save', {
        type: `${this.type}s`,
        overwrite: this.action === 'edit'
      });

      this.saving = false;

      if (res) {
        if (res.error) {
          this.$message.warning(res.error);
        } else {
          this.$message.success('Config saved.');
          let path = this.$store.state.config.settings.name;
          if (this.$store.state.config.path) {
            path = `${this.$store.state.config.path}/${path}`;
          }
          this.$router.push({
            path: `/${this.type}s/${path}`,
            query: { refreshTree: true }
          });
        }
      } else {
        this.$message.warning('Error saving config, are all fields filled out?');
      }
    },

    async validateForTest() {
      if (!(await this.validateBuilder())) {
        this.$message.warning('Please fill out all required fields before testing.');
      }
    },

    async validateBuilder() {
      try {
        await this.$refs.settings.$refs.form.validate();
        await this.$refs.alert.$refs.form.validate();
        await this.$refs.alert.$refs.subjectBody.$refs.form.validate();
      } catch (error) {
        this.valid = false;
        return false;
      }

      let conditionsValid = await this.$refs.condition.validate();
      if (!conditionsValid) {
        this.valid = false;
        return false;
      }

      this.valid = true;
      return true;
    }
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
