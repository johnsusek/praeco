<template>
  <div>
    <div>This rule is currently running and sending alerts:</div>
    <br>
    <vue-json-pretty :data="$store.state.rules.rules[id]" />
    <br>

    <router-link :to="{ name: 'ruleedit', params: { template: id } }">
      <el-button type="info">Edit</el-button>
    </router-link>

    <router-link :to="{ name: 'ruledupe', params: { template: id } }">
      <el-button type="info">Duplicate</el-button>
    </router-link>

    <el-button type="danger" @click="handleDelete">Delete...</el-button>
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
    this.$store.dispatch('rules/fetchRule', this.id);
  },
  methods: {
    handleDelete() {
      this.$confirm('Are you sure you want to delete this rule?', 'Confirm', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async () => {
          let deleted = await this.$store.dispatch('rules/deleteRule', this.id);
          if (deleted) {
            this.$message({
              type: 'success',
              message: 'Rule deleted'
            });
            this.$router.push({ name: 'rules' });
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

