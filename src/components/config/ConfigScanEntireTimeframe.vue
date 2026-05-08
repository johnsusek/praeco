<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-form-item label="scan entire timeframe">
        <el-switch
          v-model="scanEntireTimeframe"
          :disabled="viewOnly" />
        <label>
          If true, when ElastAlert 2 starts, it will always start querying at the current time minus the timeframe.
          timeframe must exist in the rule.
        </label>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script setup>
import { useConfigScanEntireTimeframe } from '@/composables/config/useConfigScanEntireTimeframe';

defineProps({
  viewOnly: Boolean
});

const {
  scanEntireTimeframe
} = useConfigScanEntireTimeframe();
</script>
