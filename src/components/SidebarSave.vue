<template>
  <div>
    <el-alert
      v-if="saveError"
      :description="saveError"
      :closable="false"
      title="Save failed"
      type="error"
      show-icon />

    <pre>{{ configDump }}</pre>
  </div>
</template>

<script>
export default {
  props: ['configDump', 'saveError']
};
</script>
