<template>
  <div>
    <el-form-item label="API KEY" prop="datadogApiKey" required>
      <el-input id="datadogApiKey" :value="datadogApiKey" :disabled="viewOnly" @input="datadogApiKey = $event" />
      <label>Datadog API key.</label>
    </el-form-item>

    <el-form-item label="APP KEY" prop="datadogAppKey" required>
      <el-input id="datadogAppKey" :value="datadogAppKey" :disabled="viewOnly" @input="datadogAppKey = $event" />
      <label>Datadog application key.</label>
    </el-form-item>
  </div>
</template>

<script>
import { useConfigAlertDatadog } from '@/composables/useConfigAlertDatadog';

export default {
  props: {
    viewOnly: Boolean
  },

  setup() {
    const datadog = useConfigAlertDatadog();

    return {
      ...datadog
    };
  }
};
</script>
