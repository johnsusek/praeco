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

    <el-splitter style="height:calc(100%-48px)" @resize-end="resizeEnd">
      <el-splitter-panel :size="sidebarWidth[0]" :min="0" style="background: #f8f8fb">
        <div class="pane-content">
          <NavTree style="padding: 10px" />
        </div>
      </el-splitter-panel>
      <el-splitter-panel :size="sidebarWidth[1]">
        <div class="pane-content">
          <router-view :key="$route.fullPath" style="padding: 10px" />
        </div>
      </el-splitter-panel>
    </el-splitter>
  </div>
</template>

<script>
import UpdateIndicator from '@/components/UpdateIndicator.vue';
import { ElSplitter, ElSplitterPanel } from 'element-plus';

export default {
  components: {
    UpdateIndicator,
    ElSplitter,
    ElSplitterPanel
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
    resizeEnd(index, sizes) {
      this.sidebarWidth = sizes;
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
