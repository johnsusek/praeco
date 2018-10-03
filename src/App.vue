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
      <el-aside width="200px">
        <NavTree />
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
html,
body {
  height: 100%;
}

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

body > section > section > .el-aside {
  padding: 22px 0 20px 10px;
}

.el-header {
  background: #ddd;
  height: initial !important;
}

.el-container > aside {
  max-width: 300px;
}
</style>
