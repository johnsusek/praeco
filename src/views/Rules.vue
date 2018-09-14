<template>
  <el-container>
    <el-aside width="200px">
      <el-menu :router="true" :default-active="$route.fullPath">
        <el-menu-item
          v-for="rule in Object.keys($store.state.rules.rules)"
          :key="rule"
          :index="`/rules/${rule}`">
          {{ rule }}
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
    this.$store.dispatch('rules/fetchRules');
  }
};
</script>
