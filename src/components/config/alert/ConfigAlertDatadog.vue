<template>
  <div>
    <praeco-form-item label="datadog_api_key" prop="datadogApiKey" required>
      <el-input v-model="datadogApiKey" :disabled="viewOnly" />
      <label>Datadog API key.</label>
    </praeco-form-item>

    <praeco-form-item label="datadog_app_key" prop="datadogAppKey" required>
      <el-input v-model="datadogAppKey" :disabled="viewOnly" />
      <label>Datadog application key.</label>
    </praeco-form-item>
  </div>
</template>

<script setup>
import { useConfigAlertDatadog } from '@/composables/config/alert/useConfigAlertDatadog';

defineProps({
  viewOnly: Boolean
});

const {
  datadogApiKey,
  datadogAppKey
} = useConfigAlertDatadog();
</script>
