<template>
  <div>
    <h1>{{ template.name }}</h1>
    <div>This template is ready to be used as a base for a rule:</div>
    <br>
    <vue-json-pretty :data="template" />
    <br>

    <router-link :to="{
      name: 'ruleconfigbuilder',
      params: { action: 'add' }, query: { prefill: id, prefillType: 'template' }
    }">
      <el-button type="primary">
        Create rule from template
      </el-button>
    </router-link>

    <router-link :to="{
      name: 'templateconfigbuilder',
      params: { action: 'edit', template: id } }">
      <el-button type="info">Edit</el-button>
    </router-link>

    <router-link :to="{
      name: 'templateconfigbuilder',
      params: { action: 'add' }, query: { prefill: id, prefillType: 'template' } }">
      <el-button type="info">Duplicate</el-button>
    </router-link>

    <el-button type="danger" @click="handleDelete">
      Delete...
    </el-button>
  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty';

export default {
  components: {
    VueJsonPretty
  },
  props: ['id'],
  computed: {
    template() {
      return this.$store.state.templates.templates[this.id] || {};
    }
  },
  mounted() {
    this.$store.dispatch('templates/fetchTemplate', this.id);
  },
  methods: {
    handleDelete() {
      this.$confirm('Are you sure you want to delete this template?', 'Confirm', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async () => {
          let deleted = await this.$store.dispatch('templates/deleteTemplate', this.id);
          if (deleted) {
            this.$message({
              type: 'success',
              message: 'Template deleted'
            });
            this.$router.push({ name: 'templates' });
          }
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
.el-button {
  margin-right: 10px;
}
</style>

