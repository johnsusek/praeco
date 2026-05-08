<template>
  <div>
    <!-- dingtalk_msgtype -->

    <el-radio-group v-model="dingtalkMsgtype" :disabled="viewOnly">
      <el-radio label="text" border>
        Text
      </el-radio>
      <el-radio label="markdown" border>
        Markdown
      </el-radio>
      <el-radio label="single_action_card" border>
        Single Action Card
      </el-radio>
      <el-radio label="action_card" border>
        Action Card
      </el-radio>
    </el-radio-group>

    <!-- dingtalk_access_token -->

    <praeco-form-item label="Access Token" prop="dingtalkAccessToken">
      <el-input v-model="dingtalkAccessToken" :disabled="viewOnly" />
      <label>
        Dingtalk access token.
      </label>
    </praeco-form-item>

    <div v-if="groupDingtalk === 'single_action_card'">
      <!-- dingtalk_single_title -->

      <praeco-form-item label="Single Title" prop="dingtalkSingleTitle" required>
        <el-input v-model="dingtalkSingleTitle" :disabled="viewOnly" />
        <label>
          The title of a single button.
        </label>
      </praeco-form-item>

      <!-- dingtalk_single_url -->

      <praeco-form-item label="Single URL" prop="dingtalkSingleUrl">
        <el-input v-model="dingtalkSingleUrl" :disabled="viewOnly" />
        <label>
          Jump link for a single button.
        </label>
      </praeco-form-item>
    </div>

    <div v-if="groupDingtalk === 'action_card'">
      <!-- dingtalk_btn_orientation -->
      <praeco-form-item label="Msg Type" prop="dingtalkBtnOrientation" required>
        <el-radio-group v-model="dingtalkBtnOrientation" :disabled="viewOnly">
          <el-radio label="0">
            Buttons are arranged vertically
          </el-radio><br>
          <el-radio label="1">
            Buttons are arranged horizontally
          </el-radio>
        </el-radio-group>
      </praeco-form-item>
    </div>

    <praeco-form-item label="dingtalk_sign" prop="dingtalkSign">
      <el-input v-model="dingtalkSign" :disabled="viewOnly" />
      <label>DingTalk HMAC secret, used for message authentication.</label>
    </praeco-form-item>
  </div>
</template>

<script setup>
import { useConfigAlertDingtalk } from '@/composables/config/alert/useConfigAlertDingtalk';

defineProps({
  viewOnly: Boolean
});

const {
  groupDingtalk,
  dingtalkAccessToken,
  dingtalkMsgtype,
  dingtalkSingleTitle,
  dingtalkSingleUrl,
  dingtalkBtnOrientation,
  dingtalkSign
} = useConfigAlertDingtalk();
</script>
