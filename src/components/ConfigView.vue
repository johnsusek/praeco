<template>
  <div>
    <el-row :gutter="20">
      <el-col :lg="12">
        <ConfigViewSettings :config="config" />
        <ConfigViewMatch :config="config" />
      </el-col>
      <el-col :lg="12">
        <ConfigViewAlert :config="config" />
      </el-col>
    </el-row>

    <ConfigViewQuery :config="config" />
  </div>
</template>

<script>
export default {
  props: ['config']
};
</script>

<style>
.el-card {
  margin-bottom: 20px;
}
</style>
