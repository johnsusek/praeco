<template>
  <el-row :gutter="20">
    <el-col :lg="12">
      <ConfigViewSettings :config="config" />
      <ConfigViewQuery :config="config" />
    </el-col>
    <el-col :lg="12">
      <ConfigViewAlert :config="config" />
    </el-col>
  </el-row>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty';

export default {
  components: {
    VueJsonPretty
  },
  props: ['config']
};
</script>

<style>
.el-card {
  margin-bottom: 20px;
}
</style>
