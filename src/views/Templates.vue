<template>
  <el-container>
    <el-aside width="auto">
      <el-menu :router="true" :default-active="$route.fullPath">
        <router-link to="/template/add">
          <el-button plain style="margin: 10px">
            Add template...
          </el-button>
        </router-link>
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

