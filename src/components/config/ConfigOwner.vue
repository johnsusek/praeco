<template>
  <el-row :gutter="19">
    <el-col :span="useOwner ? 6 : 19">
      <el-form-item label="Owner">
        <el-switch
          v-model="useOwner"
          :disabled="viewOnly" />
        <label>
          This value will be used to identify the stakeholder of the alert.
          Optionally, this field can be included in any alert type. (Optional, string)
        </label>
      </el-form-item>
    </el-col>

    <el-col v-if="useOwner" :span="6">
      <el-form-item label="Owner" prop="configOwner" required>
        <el-input v-model="configOwner" :disabled="viewOnly" />
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script setup>
import { useConfigOwner } from '@/composables/config/useConfigOwner';

defineProps({
  viewOnly: Boolean
});

const {
  useOwner,
  configOwner
} = useConfigOwner();
</script>
