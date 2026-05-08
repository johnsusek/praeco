<template>
  <div>
    <praeco-form-item label="lark_bot_id" prop="larkBotId" required>
      <el-input v-model="larkBotId" :disabled="viewOnly" />
      <label>Lark bot id.</label>
    </praeco-form-item>
  </div>
</template>

<script setup>
import { useConfigAlertLark } from '@/composables/config/alert/useConfigAlertLark';

defineProps({
  viewOnly: Boolean
});

const { larkBotId } = useConfigAlertLark();
</script>
