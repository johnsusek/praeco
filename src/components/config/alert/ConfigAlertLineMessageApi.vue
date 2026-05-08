<template>
  <div>
    <praeco-form-item label="line_channel_access_token" prop="lineChannelAccessToken" required>
      <el-input v-model="lineChannelAccessToken" :disabled="viewOnly" />
    </praeco-form-item>

    <praeco-form-item label="line_to" prop="lineTo" required>
      <el-input v-model="lineTo" :disabled="viewOnly" />
    </praeco-form-item>
  </div>
</template>

<script setup>
import { useConfigAlertLineMessageApi } from '@/composables/config/alert/useConfigAlertLineMessageApi';

defineProps({
  viewOnly: Boolean
});

const {
  lineChannelAccessToken,
  lineTo
} = useConfigAlertLineMessageApi();
</script>
