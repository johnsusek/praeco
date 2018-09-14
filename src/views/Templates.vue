<template>
  <el-container>
    <el-aside width="200px">
      <el-menu :router="true" :default-active="$route.fullPath">
        <el-menu-item class="primary" index="/template/add">Add template...</el-menu-item>
        <el-menu-item
          v-for="template in Object.keys($store.state.templates.templates)"
          :key="template"
          :index="`/templates/${template}`">
          {{ template }}
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view :key="$route.fullPath" />
    </el-main>
  </el-container>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch('templates/fetchTemplates');
  }
};
</script>
