<template>
  <div>
    <el-form-item label="webex_webhook_id" prop="webexWebhookId" required>
      <el-input v-model="webexWebhookId" :disabled="viewOnly" />
      <label>Webex webhook ID.</label>
    </el-form-item>

    <el-form-item label="webex_webhook_msgtype" prop="webexWebhookMsgtype" required>
      <el-radio-group v-model="webexWebhookMsgtype" :disabled="viewOnly">
        <el-radio label="text" border>
          Text
        </el-radio>
        <el-radio label="markdown" border>
          MarkDown
        </el-radio>
      </el-radio-group>
    </el-form-item>
  </div>
</template>

<script setup>
import { useConfigAlertWebex } from '@/composables/config/alert/useConfigAlertWebex';

defineProps({
  viewOnly: Boolean
});

const {
  webexWebhookId,
  webexWebhookMsgtype
} = useConfigAlertWebex();
</script>
