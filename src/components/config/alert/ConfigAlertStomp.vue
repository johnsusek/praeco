<template>
  <div>
    <praeco-form-item label="Host Name" prop="stompHostname" required>
      <el-input v-model="stompHostname" :disabled="viewOnly" />
      <label>The STOMP host to use, defaults to localhost.</label>
    </praeco-form-item>

    <praeco-form-item label="Host Port" prop="stompHostport" required>
      <el-input v-model="stompHostport" :disabled="viewOnly" />
      <label>The STOMP port to use, defaults to 61613.</label>
    </praeco-form-item>

    <praeco-form-item label="Login" prop="stompLogin" required>
      <el-input v-model="stompLogin" :disabled="viewOnly" />
      <label>The STOMP login to use, defaults to admin.</label>
    </praeco-form-item>

    <praeco-form-item label="Password" prop="stompPassword" required>
      <el-input v-model="stompPassword" :disabled="viewOnly" />
      <label>The STOMP password to use, defaults to admin.</label>
    </praeco-form-item>

    <praeco-form-item label="Destination" prop="stompDestination">
      <el-input v-model="stompDestination" :disabled="viewOnly" />
      <label>The STOMP destination to use, defaults to /queue/ALERT</label>
    </praeco-form-item>
  </div>
</template>

<script setup>
import { useConfigAlertStomp } from '@/composables/config/alert/useConfigAlertStomp';

defineProps({
  viewOnly: Boolean
});

const {
  stompHostname,
  stompHostport,
  stompLogin,
  stompPassword,
  stompDestination
} = useConfigAlertStomp();
</script>
