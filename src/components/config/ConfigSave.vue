<template>
  <div>
    <ConfigViewSettings :config="config" />

    <ConfigViewQuery :config="config" />

    <ConfigViewMatch :config="config" />

    <ConfigViewAlert :config="config" />

    <el-button
      plain
      size="small"
      type="primary"
      class="praeco-config-save"
      @click="$emit('save')">
      Save
    </el-button>
  </div>
</template>

<script>
export default {
  props: ['config']
};
</script>
