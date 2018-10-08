<template>
  <div>
    <el-alert
      v-if="saveError"
      :description="description"
      :closable="false"
      title="Save failed"
      type="error"
      show-icon />
  </div>
</template>

<script>
export default {
  props: ['saveError'],
  computed: {
    description() {
      if (this.saveError.error) {
        return this.saveError.error;
      }
      return this.saveError;
    }
  }
};
</script>
