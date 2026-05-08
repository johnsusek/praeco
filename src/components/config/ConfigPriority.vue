<template>
  <el-row :gutter="19">
    <el-col :span="usePriority ? 6 : 19">
      <el-form-item label="Priority">
        <el-switch
          v-model="usePriority"
          :disabled="viewOnly" />
        <label>
          This value will be used to identify the relative priority of the alert.
          Optionally, this field can be included in any alert type (e.g. for use in email subject/body text).
        </label>
      </el-form-item>
    </el-col>

    <el-col v-if="usePriority" :span="6">
      <el-form-item label="Priority" prop="configPriority" required>
        <el-input-number v-model="configPriority" :disabled="viewOnly" />
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script setup>
import { useConfigPriority } from '@/composables/config/useConfigPriority';

defineProps({
  viewOnly: Boolean
});

const {
  usePriority,
  configPriority
} = useConfigPriority();
</script>
