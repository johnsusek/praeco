<template>
  <div>
    <praeco-form-item label="gelf_type" prop="gelfType" required>
      <el-radio-group v-model="gelfType" :disabled="viewOnly">
        <el-radio label="http" border>
          http
        </el-radio>
        <el-radio label="tcp" border>
          tcp
        </el-radio>
      </el-radio-group>
    </praeco-form-item>

    <div v-if="gelfType === 'http'">
      <praeco-form-item label="gelf_endpoint" prop="gelfEndpoint">
        <el-input v-model="gelfEndpoint" :disabled="viewOnly" />
        <label>Link to GELF HTTP Input as an example: ‘http://example.com/gelf'</label>
      </praeco-form-item>

      <praeco-form-item label="gelf_http_ignore_ssl_errors" prop="gelfHttpIgnoreSslErrors">
        <el-switch
          v-model="gelfHttpIgnoreSslErrors"
          :disabled="viewOnly" />
      </praeco-form-item>
    </div>

    <div v-if="gelfType === 'tcp'">
      <praeco-form-item label="gelf_host" prop="gelfHost" required>
        <el-input v-model="gelfHost" :disabled="viewOnly" />
        <label>Graylog server address where Input launched.</label>
      </praeco-form-item>

      <praeco-form-item label="gelf_port" prop="gelfPort" required>
        <el-input-number v-model="gelfPort" :disabled="viewOnly" />
        <label>Port, specified for Input.</label>
      </praeco-form-item>
    </div>

    <praeco-form-item label="gelf_log_level" prop="gelfLogLevel">
      <el-input-number v-model="gelfLogLevel" :disabled="viewOnly" :min="0" :max="7" />
      <label>Standard syslog severity levels. </label>
    </praeco-form-item>

    <praeco-form-item label="gelf_ca_cert" prop="gelfCaCert">
      <el-input v-model="gelfCaCert" :disabled="viewOnly" />
      <label>Path to custom CA certificate.</label>
    </praeco-form-item>

    <praeco-form-item label="gelf_timeout" prop="gelfTimeout">
      <el-input-number v-model="gelfTimeout" :disabled="viewOnly" />
      <label>Custom timeout.</label>
    </praeco-form-item>
  </div>
</template>

<script setup>
import { useConfigAlertGelf } from '@/composables/config/alert/useConfigAlertGelf';

defineProps({
  viewOnly: Boolean
});

const {
  gelfType,
  gelfEndpoint,
  gelfHttpIgnoreSslErrors,
  gelfHost,
  gelfPort,
  gelfLogLevel,
  gelfCaCert,
  gelfTimeout
}= useConfigAlertGelf();
</script>
