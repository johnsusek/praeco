<template>
  <div id="app">
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
              <UpdateIndicator />
              <el-tag type="info" class="m-w-xs">
                elastalert status: {{ $store.state.server.status || '?' }}
              </el-tag>
            </p>
          </el-col>
        </el-row>
      </div>
    </el-header>

    <Split style="height: calc(100% - 48px)" @onDragEnd="onDragEnd">
      <SplitArea :size="sidebarWidth[0]" :min-size="0" style="background: #f8f8fb">
        <NavTree style="padding: 10px" />
      </SplitArea>
      <SplitArea :size="sidebarWidth[1]">
        <router-view :key="$route.fullPath" style="padding: 10px" />
      </SplitArea>
    </Split>

  </div>
</template>

<script>
import UpdateIndicator from '@/components/UpdateIndicator';

export default {
  components: {
    UpdateIndicator
  },

  computed: {
    sidebarWidth: {
      get() {
        return this.$store.state.ui.sidebarWidth;
      },
      set(value) {
        this.$store.commit('ui/UPDATE_SIDEBAR_WIDTH', value);
      }
    }
  },

  mounted() {
    this.$store.dispatch('server/fetchVersion');
    this.$store.dispatch('server/fetchStatus');
    this.$store.dispatch('elastalert/fetchConfig');
  },

  methods: {
    onDragEnd(size) {
      this.sidebarWidth = size;
    }
  }
};
</script>

<style lang="scss">
html,
body {
  height: 100%;
}

body {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;
  color: #303133;
}

#app,
.el-aside > .el-menu,
.el-main > section {
  height: 100%;
}

#app .el-container {
  height: calc(100% - 48px);
}

.el-header img {
  height: 41px;
  width: auto;
  opacity: 0.5;
}

#app > section > .el-aside {
  padding: 22px 0 20px 10px;
}

.el-header {
  background: #ddd;
  height: initial !important;
}

.gutter.gutter-horizontal {
  opacity: 0;
}

.gutter.gutter-horizontal:hover {
  opacity: 1;
}
</style>
