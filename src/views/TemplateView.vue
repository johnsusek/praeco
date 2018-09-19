<template>
  <div>
    <h1><i class="el-icon-document" /> {{ template.name }}</h1>

    <el-row>
      <router-link :to="{
        name: 'ruleconfigbuilder',
        params: { action: 'add' }, query: { prefill: id, prefillType: 'template' }
      }">
        <el-button icon="el-icon-plus" plain type="primary">
          Create rule from template
        </el-button>
      </router-link>

      <router-link :to="{
        name: 'templateconfigbuilder',
        params: { action: 'edit', template: id } }">
        <el-button icon="el-icon-edit" plain type="info">Edit</el-button>
      </router-link>

      <router-link :to="{
        name: 'templateconfigbuilder',
        params: { action: 'add' }, query: { prefill: id, prefillType: 'template' } }">
        <el-button plain type="info">Duplicate</el-button>
      </router-link>

      <el-button icon="el-icon-delete" plain type="danger" @click="handleDelete">
        Delete...
      </el-button>
    </el-row>

    <ConfigView :config="template" />
  </div>
</template>

<script>
export default {
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
.el-row {
  margin-bottom: 20px;
}

.el-row .el-button {
  margin-right: 10px;
}
</style>

