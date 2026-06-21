<template>
  <div>
    <praeco-form-item label="indexer_alerts_name" prop="indexerAlertsName" required>
      <el-input v-model="indexerAlertsName" :disabled="viewOnly" />
      <label>The index to use for creating the new alert records.</label>
    </praeco-form-item>

    <praeco-form-item label="indexer_connection.es_host" prop="indexerConnectionEsHost">
      <el-input v-model="indexerConnectionEsHost" :disabled="viewOnly" />
      <label>Elasticsearch/OpenSearch host address.</label>
    </praeco-form-item>

    <praeco-form-item label="indexer_connection.es_port" prop="indexerConnectionEsPort" required>
      <el-input-number v-model="indexerConnectionEsPort" :disabled="viewOnly" />
      <label>Elasticsearch/OpenSearch port number.</label>
    </praeco-form-item>

    <praeco-form-item label="indexer_connection.es_username" prop="indexerConnectionEsUsername">
      <el-input v-model="indexerConnectionEsUsername" :disabled="viewOnly" />
      <label>Username for authentication.</label>
    </praeco-form-item>

    <praeco-form-item label="indexer_connection.es_password" prop="indexerConnectionEsPassword">
      <el-input v-model="indexerConnectionEsPassword" :disabled="viewOnly" show-password />
      <label>Password for authentication.</label>
    </praeco-form-item>

    <el-form-item label="indexer_connection.use_ssl" prop="indexerConnectionUseSsl">
      <el-switch
        v-model="indexerConnectionUseSsl"
        :disabled="viewOnly" />
      <label>Whether to use SSL.</label>
    </el-form-item>

    <el-form-item label="indexer_connection.verify_certs" prop="indexerConnectionVerifyCerts">
      <el-switch
        v-model="indexerConnectionVerifyCerts"
        :disabled="viewOnly" />
      <label>Whether to verify SSL certificates.</label>
    </el-form-item>

    <el-form-item label="indexer_connection.ssl_show_warn" prop="indexerConnectionSslShowWarn">
      <el-switch
        v-model="indexerConnectionSslShowWarn"
        :disabled="viewOnly" />
      <label>Whether to show SSL warnings.</label>
    </el-form-item>

    <praeco-form-item label="indexer_config" prop="indexerConfig">
      <el-input v-model="indexerConfig" :disabled="viewOnly" />
      <label>
        Path to a config file to use for loading the connection details
        (alternative to specifying connection details above).
      </label>
    </praeco-form-item>

    <el-form-item label="indexer_alert_config" prop="indexerAlertConfig">
      <div v-for="(key, index) in indexerAlertConfigKeys" :key="index" class="el-row">
        <el-col :span="11">
          <el-input
            v-model="indexerAlertConfigKeys[index]"
            :disabled="viewOnly"
            placeholder="Field name" />
        </el-col>
        <el-col :span="11" :offset="1">
          <el-input
            v-model="indexerAlertConfigValues[index]"
            :disabled="viewOnly"
            placeholder="Field value" />
        </el-col>
      </div>
      <el-button v-if="!viewOnly" @click="addIndexerAlertConfigEntry">
        Add field
      </el-button>
      <label>
        Fields to include in the alert document written to the index.
        Use existing field names from the match to reference their values.
      </label>
    </el-form-item>
  </div>
</template>

<script setup>
import { useConfigAlertIndex } from '@/composables/config/alert/useConfigAlertIndex';
import { useStore } from '@/composables/useStore';

defineProps({
  viewOnly: Boolean
});

const store = useStore();

const {
  indexerAlertsName,
  indexerConnectionEsHost,
  indexerConnectionEsPort,
  indexerConnectionEsUsername,
  indexerConnectionEsPassword,
  indexerConnectionUseSsl,
  indexerConnectionVerifyCerts,
  indexerConnectionSslShowWarn,
  indexerConfig,
  indexerAlertConfigKeys,
  indexerAlertConfigValues
} = useConfigAlertIndex();

function addIndexerAlertConfigEntry() {
  store.commit('config/alert/ADD_INDEXER_ALERT_CONFIG_KEY_ENTRY');
  store.commit('config/alert/ADD_INDEXER_ALERT_CONFIG_VALUE_ENTRY');
}
</script>
