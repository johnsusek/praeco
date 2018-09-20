<template>
  <div>
    <el-alert
      v-if="saveError"
      :description="saveError"
      :closable="false"
      title="Save failed"
      type="error"
      show-icon />
  </div>
</template>

<script>
export default {
  props: ['saveError']
};
</script>
