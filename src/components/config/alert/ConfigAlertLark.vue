<template>
  <div>
    <praeco-form-item label="Bot Id" prop="larkBotId" required>
      <el-input id="larkBotId" :value="larkBotId" :disabled="viewOnly" @input="larkBotId = $event" />
      <label>Lark bot id.</label>
    </praeco-form-item>
  </div>
</template>

<script>
import { useConfigAlertLark } from '@/composables/useConfigAlertLark';

export default {
  props: {
    viewOnly: Boolean
  },

  setup() {
    const lark = useConfigAlertLark();

    return {
      ...lark
    };
  }
};
</script>

  <style lang="scss" scoped>
  </style>
