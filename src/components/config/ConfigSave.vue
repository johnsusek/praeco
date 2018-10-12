<template>
  <div>
    <el-button v-if="!showYaml" type="text" @click="showYaml = true">Show YAML</el-button>

    <el-button v-if="showYaml" type="text" @click="showYaml = false">Hide YAML</el-button>

    <prism v-if="showYaml" language="yaml">{{ $store.getters['config/yaml'] }}</prism>

    <br>

    <el-button type="primary" plain @click="save">Save</el-button>
  </div>
</template>

<script>
export default {
  props: ['type'],

  data() {
    return {
      showYaml: false
    };
  },

  methods: {
    async save() {
      // let rootPath = false;

      // if (this.action === 'add' && this.prefillType === 'template') {
      //   // If type is add, and prefillType is template, we just
      //   // put the config into the root rules folder
      //   rootPath = true;
      // }

      let res = await this.$store.dispatch('config/save', { type: `${this.type}s` });

      if (res) {
        if (res.error) {
          this.$message.warning(res.error);
        } else {
          this.$message.success('Config saved.');
        }
      } else {
        this.$message.warning('Error saving config, are all fields filled out?');
      }
    }
  }
};
</script>
