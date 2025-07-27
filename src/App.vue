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
                elastalert status: {{ serverStore.status || '?' }}
              </el-tag>
            </p>
          </el-col>
        </el-row>
      </div>
    </el-header>

    <Splitpanes style="height: calc(100% - 48px)" @resized="onResize">
      <Pane :size="sidebarWidth[0]" :min-size="0" style="background: #f8f8fb">
        <NavTree style="padding: 10px" />
      </Pane>
      <Pane :size="sidebarWidth[1]">
        <router-view :key="$route.fullPath" style="padding: 10px" />
      </Pane>
    </Splitpanes>
  </div>
</template>

<script>
import UpdateIndicator from '@/components/UpdateIndicator.vue';
import { useUIStore, useServerStore, useElastalertStore } from '@/stores';

export default {
  components: {
    UpdateIndicator
  },

  setup() {
    const uiStore = useUIStore();
    const serverStore = useServerStore();
    const elastalertStore = useElastalertStore();

    return {
      uiStore,
      serverStore,
      elastalertStore
    };
  },

  computed: {
    sidebarWidth: {
      get() {
        return this.uiStore.sidebarWidth;
      },
      set(value) {
        this.uiStore.updateSidebarWidth(value);
      }
    }
  },

  mounted() {
    this.serverStore.fetchVersion();
    this.serverStore.fetchStatus();
    this.elastalertStore.fetchConfig();
  },

  methods: {
    onResize(panes) {
      // panes is an array of sizes for each pane
      this.sidebarWidth = panes.map(pane => pane.size);
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
