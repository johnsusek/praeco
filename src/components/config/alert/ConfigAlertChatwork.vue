<template>
  <div>
    <praeco-form-item label="chatwork_apikey" prop="chatworkApikey" required>
      <el-input v-model="chatworkApikey" :disabled="viewOnly" />
      <label>ChatWork API KEY.</label>
    </praeco-form-item>

    <praeco-form-item label="chatwork_room_id" prop="chatworkRoomId" required>
      <el-input v-model="chatworkRoomId" :disabled="viewOnly" />
      <label>
        The ID of the room you are talking to in Chatwork.
        How to find the room ID is the part of the number after "rid" at the end of the URL of the browser.
      </label>
    </praeco-form-item>

    <praeco-form-item label="chatwork_proxy" prop="chatworkProxy">
      <el-input v-model="chatworkProxy" :disabled="viewOnly" />
      <label>
        By default ElastAlert 2 will not use a network proxy to send notifications to chatwork.
        Set this option using hostname:port if you need to use a proxy.
      </label>
    </praeco-form-item>

    <praeco-form-item label="chatwork_proxy_login" prop="chatworkProxyLogin">
      <el-input v-model="chatworkProxyLogin" :disabled="viewOnly" />
      <label>The chatwork proxy auth username.</label>
    </praeco-form-item>

    <praeco-form-item label="chatwork_proxy_pass:" prop="chatworkProxyPass">
      <el-input v-model="chatworkProxyPass" :disabled="viewOnly" />
      <label>The chatwork proxy auth password.</label>
    </praeco-form-item>
  </div>
</template>

<script setup>
import { useConfigAlertChatwork } from '@/composables/config/alert/useConfigAlertChatwork';

defineProps({
  viewOnly: Boolean
});

const {
  chatworkApikey,
  chatworkRoomId,
  chatworkProxy,
  chatworkProxyLogin,
  chatworkProxyPass
} = useConfigAlertChatwork();
</script>
