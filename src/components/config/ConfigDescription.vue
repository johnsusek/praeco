<template>
  <el-row :gutter="19">
    <el-col :span="19">
      <el-form-item label="Description">
        <el-switch
          v-model="useDescription"
          :disabled="viewOnly" />
        <label>
          text describing the purpose of rule.
          (Optional, string, default empty string) Can be referenced in custom alerters
          to provide context as to why a rule might trigger.
        </label>
      </el-form-item>
    </el-col>

    <el-col v-if="useDescription" :span="19">
      <el-form-item label="Description" prop="configDescription" required>
        <el-input v-model="configDescription" :disabled="viewOnly" />
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script setup>
import { useConfigDescription } from '@/composables/config/useConfigDescription';

defineProps({
  viewOnly: Boolean
});

const {
  useDescription,
  configDescription
} = useConfigDescription();
</script>
