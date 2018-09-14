<template>
  <div>
    <div>This template is ready to be used as a base for a rule:</div>
    <br>
    <vue-json-pretty :data="$store.state.templates.templates[id]" />
    <br>

    <router-link :to="{ name: 'ruleadd', params: { template: id } }">
      <el-button type="primary">
        Create rule from template
      </el-button>
    </router-link>

    <router-link :to="{ name: 'templateedit', params: { template: id } }">
      <el-button type="info">Edit</el-button>
    </router-link>

    <router-link :to="{ name: 'templateadd', params: { template: id } }">
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

