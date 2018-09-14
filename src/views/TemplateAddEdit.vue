<template>
  <div>
    <h1 v-if="mode === 'add'">Add template</h1>
    <h1 v-if="mode === 'edit'">Edit template {{ $store.state.editor.config.name }}</h1>
    <RuleEditor :show-validate="true" :mode="mode" @save="handleCreate" />
  </div>
</template>

<script>
import addEditPage from '../mixins/addEditPage';

export default {
  mixins: [addEditPage],
  async mounted() {
    if (this.template) {
      await this.$store.dispatch('templates/fetchTemplate', this.template);
      this.$store.commit(
        'editor/CONFIG_LOAD',
        this.$store.state.templates.templates[this.template]
      );
    } else {
      this.$store.commit('editor/CONFIG_RESET');
    }
  },
  methods: {
    async handleCreate() {
      let created = await this.$store.dispatch('templates/createTemplate');
      if (created) {
        this.$message({
          type: 'success',
          message: 'Template created'
        });
        this.$router.push({
          name: 'templateview',
          params: { id: this.$store.state.editor.config.name }
        });
      } else {
        // error handling
      }
    }
  }
};
</script>

