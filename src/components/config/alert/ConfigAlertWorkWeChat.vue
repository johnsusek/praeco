<template>
  <div>
    <praeco-form-item label="work_wechat_bot_id" prop="workWechatBotId" required>
      <el-input v-model="workWechatBotId" :disabled="viewOnly" />
      <label>WorkWechat bot id.</label>
    </praeco-form-item>

    <praeco-form-item label="work_wechat_msgtype" prop="workWechatMsgtype" required>
      <el-radio-group v-model="workWechatMsgtype" :disabled="viewOnly">
        <el-radio label="text" border>
          text
        </el-radio>
        <el-radio label="markdown" border>
          markdown
        </el-radio>
      </el-radio-group>
    </praeco-form-item>
  </div>
</template>

<script setup>
import { useConfigAlertWorkWeChat } from '@/composables/config/alert/useConfigAlertWorkWeChat';

defineProps({
  viewOnly: Boolean
});

const {
  workWechatBotId,
  workWechatMsgtype
} = useConfigAlertWorkWeChat();
</script>
