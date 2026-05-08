<template>
  <div>
    <praeco-form-item label="Zbx Sender Host" prop="zbxSenderHost" required>
      <el-input v-model="zbxSenderHost" :disabled="viewOnly" />
      <label>The address where zabbix server is running.</label>
    </praeco-form-item>

    <praeco-form-item label="Zbx Sender Port" prop="zbxSenderPort" required>
      <el-input-number v-model="zbxSenderPort" :disabled="viewOnly" />
      <label>The port where zabbix server is listenning.</label>
    </praeco-form-item>

    <praeco-form-item label="ZbxHost" prop="zbxHost" required>
      <el-input v-model="zbxHost" :disabled="viewOnly" />
      <label>This field setup the host in zabbix that receives the value sent by ElastAlert 2.</label>
    </praeco-form-item>

    <praeco-form-item label="ZbxKey" prop="zbxKey" required>
      <el-input v-model="zbxKey" :disabled="viewOnly" />
      <label>This field setup the key in the host that receives the value sent by ElastAlert 2.</label>
    </praeco-form-item>

    <el-form-item label="Host From Field" prop="zbxHostFromField">
      <el-switch
        v-model="zbxHostFromField"
        :disabled="viewOnly" />
    </el-form-item>
  </div>
</template>

<script setup>
import { useConfigAlertZabbix } from '@/composables/config/alert/useConfigAlertZabbix';

defineProps({
  viewOnly: Boolean
});

const {
  zbxSenderHost,
  zbxSenderPort,
  zbxHost,
  zbxKey,
  zbxHostFromField
} = useConfigAlertZabbix();
</script>
