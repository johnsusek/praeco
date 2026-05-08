<template>
  <div>
    <praeco-form-item label="exotel_account_sid" prop="exotelAccountSid" required>
      <el-input v-model="exotelAccountSid" :disabled="viewOnly" />
      <label>This is sid of your Exotel account.</label>
    </praeco-form-item>

    <praeco-form-item label="exotel_auth_token" prop="exotelAuthToken" required>
      <el-input v-model="exotelAuthToken" :disabled="viewOnly" />
      <label>Auth token assosiated with your Exotel account.</label>
    </praeco-form-item>

    <praeco-form-item label="exotel_to_number" prop="exotelToNumber" required>
      <el-input v-model="exotelToNumber" :disabled="viewOnly" />
      <label>The phone number where you would like send the notification.</label>
    </praeco-form-item>

    <praeco-form-item label="exotel_from_number" prop="exotelFromNumber" required>
      <el-input v-model="exotelFromNumber" :disabled="viewOnly" />
      <label>Your exophone number from which message will be sent.</label>
    </praeco-form-item>

    <praeco-form-item label="exotel_message_body" prop="exotelMessageBody">
      <el-input v-model="exotelMessageBody" :disabled="viewOnly" />
      <label>Message you want to send in the sms, is you don’t specify this argument only the rule name is sent</label>
    </praeco-form-item>
  </div>
</template>

<script setup>
import { useConfigAlertExotel } from '@/composables/config/alert/useConfigAlertExotel';

defineProps({
  viewOnly: Boolean
});

const {
  exotelAccountSid,
  exotelAuthToken,
  exotelToNumber,
  exotelFromNumber,
  exotelMessageBody
}= useConfigAlertExotel();
</script>
