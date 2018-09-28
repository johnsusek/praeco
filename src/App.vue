<template>
  <el-container id="app">
    <el-header>
      <div id="nav">
        <el-row>
          <el-col :span="12">
            <router-link to="/">
              <img alt="praeco" src="@/assets/logo.png">
            </router-link>
          </el-col>
          <el-col :span="12" align="right">
            <p>
              elastalert v{{ $store.state.server.version || '?' }}
              status: {{ $store.state.server.status || '?' }}
            </p>
          </el-col>
        </el-row>
      </div>
    </el-header>

    <el-container>
      <el-aside width="auto">
        <el-menu :router="true">
          <el-menu-item index="/templates">
            <i class="el-icon-document" />
            <span>Templates</span>
          </el-menu-item>
          <el-menu-item index="/rules">
            <i class="el-icon-tickets" />
            <span>Rules</span>
          </el-menu-item>
          <el-menu-item index="/errors">
            <i class="el-icon-warning" />
            <span>Errors</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view :key="$route.fullPath" />
      </el-main>
    </el-container>

  </el-container>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch('server/fetchVersion');
    this.$store.dispatch('server/fetchStatus');
  }
};
</script>

<style lang="scss">
body {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  color: #303133;
}

#app,
.el-aside > .el-menu,
.el-main > section {
  height: 100%;
}

.el-header img {
  height: 46px;
  width: auto;
  opacity: 0.5;
}

body > section > section > .el-main {
  padding: 0;
}

.el-header {
  background: #ddd;
  height: initial !important;
}

.el-container > aside {
  max-width: 300px;
}
</style>
