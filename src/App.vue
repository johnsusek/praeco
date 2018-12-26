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

    <el-container>
      <multipane layout="vertical" @paneResizeStop="handleResize">
        <div :style="{ width: sidebarWidth, maxWidth: '600px', minWidth: '100px' }">
          <NavTree style="margin: 10px" />
        </div>
        <multipane-resizer/>
        <div :style="{ flexGrow: 1, padding: '10px' }">
          <router-view :key="$route.fullPath" />
        </div>
      </multipane>
    </el-container>
  </div>
</template>

<script>
import { Multipane, MultipaneResizer } from 'vue-multipane';
import UpdateIndicator from '@/components/UpdateIndicator';

export default {
  components: {
    UpdateIndicator,
    Multipane,
    MultipaneResizer
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
    handleResize(pane, container, size) {
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

.multipane.layout-v .multipane-resizer {
  margin: 0;
  left: 0; /* reset default styling */
  width: 15px;
  margin-left: -15px;
  background: white;
}

.multipane.layout-v .multipane-resizer:hover {
  background: #efefef;
}
</style>
