<template>
  <div>
    <praeco-form-item label="integration key" prop="flashdutyIntegrationKey" required>
      <el-input v-model="flashdutyIntegrationKey" :disabled="viewOnly" />
    </praeco-form-item>

    <praeco-form-item label="alert_key" prop="flashdutyAlertKey">
      <el-input v-model="flashdutyAlertKey" :disabled="viewOnly" />
    </praeco-form-item>

    <praeco-form-item label="title" prop="flashdutyTitle">
      <el-input v-model="flashdutyTitle" :disabled="viewOnly" />
    </praeco-form-item>

    <praeco-form-item label="description" prop="flashdutyDescription">
      <el-input v-model="flashdutyDescription" :disabled="viewOnly" />
    </praeco-form-item>

    <praeco-form-item label="event_status" prop="flashdutyEventStatus">
      <el-radio-group v-model="flashdutyEventStatus" :disabled="viewOnly">
        <el-radio label="Info" border>
          Info
        </el-radio>
        <el-radio label="Warning" border>
          Warning
        </el-radio>
        <el-radio label="Critical" border>
          Critical
        </el-radio>
        <el-radio label="Ok" border>
          Ok
        </el-radio>
      </el-radio-group>
    </praeco-form-item>

    <praeco-form-item label="check" prop="flashdutyCheck">
      <el-input v-model="flashdutyCheck" :disabled="viewOnly" />
    </praeco-form-item>

    <praeco-form-item label="service" prop="flashdutyService">
      <el-input v-model="flashdutyService" :disabled="viewOnly" />
    </praeco-form-item>

    <praeco-form-item label="cluster" prop="flashdutyCluster">
      <el-input v-model="flashdutyCluster" :disabled="viewOnly" />
    </praeco-form-item>

    <praeco-form-item label="resource" prop="flashdutyResource">
      <el-input v-model="flashdutyResource" :disabled="viewOnly" />
    </praeco-form-item>

    <praeco-form-item label="metric" prop="flashdutyMetric">
      <el-input v-model="flashdutyMetric" :disabled="viewOnly" />
    </praeco-form-item>

    <praeco-form-item label="group" prop="flashdutyGroup">
      <el-input v-model="flashdutyGroup" :disabled="viewOnly" />
    </praeco-form-item>

    <praeco-form-item label="env" prop="flashdutyEnv">
      <el-input v-model="flashdutyEnv" :disabled="viewOnly" />
    </praeco-form-item>

    <praeco-form-item label="app" prop="flashdutyApp">
      <el-input v-model="flashdutyApp" :disabled="viewOnly" />
    </praeco-form-item>
  </div>
</template>

<script setup>
import { useConfigAlertFlashDuty } from '@/composables/config/alert/useConfigAlertFlashDuty';

// props
defineProps({
  viewOnly: Boolean
});

const {
  flashdutyIntegrationKey,
  flashdutyTitle,
  flashdutyAlertKey,
  flashdutyDescription,
  flashdutyEventStatus,
  flashdutyCheck,
  flashdutyService,
  flashdutyCluster,
  flashdutyResource,
  flashdutyMetric,
  flashdutyGroup,
  flashdutyEnv,
  flashdutyApp
} = useConfigAlertFlashDuty();
</script>
