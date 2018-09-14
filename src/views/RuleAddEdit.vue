<template>
  <div>
    <h1 v-if="mode === 'add'">Add rule</h1>
    <h1 v-if="mode === 'edit'">Edit rule {{ $store.state.editor.config.name }}</h1>
    <RuleEditor :show-test="true" :show-alert="true" :mode="mode" @save="handleCreate" />
  </div>
</template>

<script>
import addEditPage from '../mixins/addEditPage';

export default {
  mixins: [addEditPage],
  async mounted() {
    if (this.template) {
      if (this.mode === 'edit' || this.mode === 'dupe') {
        // in the context of editing/duping a rule, the rule itself is the "template"
        await this.$store.dispatch('rules/fetchRule', this.template);
        this.$store.commit('editor/CONFIG_LOAD', this.$store.state.rules.rules[this.template]);
      } else {
        await this.$store.dispatch('templates/fetchTemplate', this.template);
        this.$store.commit(
          'editor/CONFIG_LOAD',
          this.$store.state.templates.templates[this.template]
        );
      }
    } else {
      this.$store.commit('editor/CONFIG_RESET');
    }
  },
  methods: {
    async handleCreate(form) {
      let created = await this.$store.dispatch('rules/createRule', form);
      if (created) {
        this.$message({
          type: 'success',
          message: 'Rule created'
        });
        this.$router.push({
          name: 'ruleview',
          params: { id: this.$store.state.editor.config.name }
        });
      } else {
        // error handling
      }
    }
  }
};
</script>

