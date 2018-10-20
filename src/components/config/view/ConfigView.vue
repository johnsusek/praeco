<template>
  <div>
    <el-row :gutter="20">
      <el-col :lg="12">
        <ConfigViewSettings :config="config" />
        <ConfigViewMatch :config="config" />
      </el-col>
      <el-col :lg="12">
        <ConfigViewAlert :config="config" />
      </el-col>
    </el-row>

    <ConfigViewQuery :config="config" :show-chart="type !== 'template'" />
  </div>
</template>

<script>
export default {
  props: ['config', 'type', 'path'],

  mounted() {
    this.$store.dispatch('config/reset');
    this.$store.commit('config/UPDATE_TYPE', this.type);
    this.$store.dispatch('config/load', { type: `${this.type}s`, path: this.path });
  }
};
</script>

<style>
.el-card {
  margin-bottom: 20px;
}
</style>
