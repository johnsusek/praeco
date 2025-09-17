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

    <Splitpanes class="split-container" @resized="onDragEnd">
      <Pane :size="sidebarWidth[0]" min-size="0" style="background: #f8f8fb">
        <div class="pane-content">
          <NavTree style="padding: 10px" />
        </div>
      </Pane>
      <Pane :size="sidebarWidth[1]">
        <div class="pane-content">
          <router-view :key="$route.fullPath" style="padding: 10px" />
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>

<script>
import UpdateIndicator from '@/components/UpdateIndicator.vue';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

export default {
  components: {
    UpdateIndicator,
    Splitpanes,
    Pane
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

.split-container {
  height: calc(100% - 48px); /* 既存のSplitと同じ高さ指定 */
  display: flex;
  flex-direction: row;
}

.pane-content {
  height: 100%;
  overflow-y: auto; /* ★ここが重要：Pane内でスクロール可能にする */
}
</style>
