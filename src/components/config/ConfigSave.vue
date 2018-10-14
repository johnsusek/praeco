<template>
  <div>
    <el-button v-if="!saving" type="primary" plain @click="save">Save</el-button>
    <el-button v-else type="primary" plain disabled>Saving...</el-button>

    <el-button v-if="!showYaml" type="text" @click="showYaml = true">Show YAML</el-button>
    <el-button v-if="showYaml" type="text" @click="showYaml = false">Hide YAML</el-button>

    <prism v-if="showYaml" language="yaml">{{ $store.getters['config/yaml'] }}</prism>
  </div>
</template>

<script>
export default {
  props: ['type', 'action'],

  data() {
    return {
      showYaml: false,
      saving: false
    };
  },

  methods: {
    async save() {
      let path = this.$store.state.config.settings.name;

      // If the config has a path (like editing a rule/template at a path) use that
      if (this.$store.state.config.path) {
        path = `${this.$store.state.config.path}/${path}`;
      }

      this.saving = true;

      let res = await this.$store.dispatch('config/save', { type: `${this.type}s`, overwrite: this.action === 'edit' });

      this.saving = false;

      if (res) {
        if (res.error) {
          this.$message.warning(res.error);
        } else {
          this.$message.success('Config saved.');
          this.$router.push({
            path: `/${this.type}s/${path}`,
            query: { refreshTree: true }
          });
        }
      } else {
        this.$message.warning('Error saving config, are all fields filled out?');
      }
    }
  }
};
</script>
