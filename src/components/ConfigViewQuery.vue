<template>
  <el-card shadow="never" header="Query">
    {{ config.filter }}
    {{ config.type }}
  </el-card>
</template>

<script>
export default {
  props: ['config']
};
</script>
