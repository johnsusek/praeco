<template>
  <el-alert
    :type="type"
    :title="title"
    :closable="false"
    class="expandable-alert"
    show-icon>
    <div>
      <el-button
        v-if="!showDetails"
        :type="type === 'error' ? 'danger' : type"
        plain
        icon="el-icon-arrow-right"
        @click="showDetails = true">
        Details
      </el-button>
      <el-button
        v-if="showDetails"
        :type="type === 'error' ? 'danger' : type"
        plain
        icon="el-icon-arrow-down"
        @click="showDetails = false">
        Details
      </el-button>
      <pre v-if="showDetails">{{ contents.trim() }}</pre>
    </div>
  </el-alert>
</template>

<script>
export default {
  props: ['title', 'type', 'contents'],
  data() {
    return {
      showDetails: false
    };
  }
};
</script>

<style>
.expandable-alert .el-alert__content {
  padding: 5px 8px 0;
}
</style>

<style scoped>
.el-alert {
  align-items: flex-start;
}

.el-alert pre {
  background-color: inherit;
  border: 0;
  color: inherit;
  margin-top: 5px;
  padding-left: 0;
  padding-right: 0;
  font-weight: bold;
}

.el-alert__icon.is-big {
  margin-top: 4px;
}

.el-button.el-button--mini {
  padding-left: 6px;
  padding-right: 10px;
  position: absolute;
  right: 10px;
  top: 8px;
}

.el-button.el-button--mini [class*='el-icon-'] + span {
  margin-left: 0;
}
</style>
