<template>
  <div>
    <praeco-form-item label="Account Sid" prop="exotelAccountSid" required>
      <el-input id="exotelAccountSid" :value="exotelAccountSid" :disabled="viewOnly" @input="exotelAccountSid = $event" />
      <label>This is sid of your Exotel account.</label>
    </praeco-form-item>

    <praeco-form-item label="Auth Token" prop="exotelAuthToken" required>
      <el-input id="exotelAuthToken" :value="exotelAuthToken" :disabled="viewOnly" @input="exotelAuthToken = $event" />
      <label>Auth token assosiated with your Exotel account.</label>
    </praeco-form-item>

    <praeco-form-item label="Number" prop="exotelToNumber" required>
      <el-input id="exotelToNumber" :value="exotelToNumber" :disabled="viewOnly" @input="exotelToNumber = $event" />
      <label>The phone number where you would like send the notification.</label>
    </praeco-form-item>

    <praeco-form-item label="From Number" prop="exotelFromNumber" required>
      <el-input id="exotelFromNumber" :value="exotelFromNumber" :disabled="viewOnly" @input="exotelFromNumber = $event" />
      <label>Your exophone number from which message will be sent.</label>
    </praeco-form-item>

    <praeco-form-item label="Message Body" prop="exotelMessageBody">
      <el-input id="exotelMessageBody" :value="exotelMessageBody" :disabled="viewOnly" @input="exotelMessageBody = $event" />
      <label>Message you want to send in the sms, is you don’t specify this argument only the rule name is sent</label>
    </praeco-form-item>
  </div>
</template>

<script>
import { useConfigAlertExotel } from '@/composables/config/alert/useConfigAlertExotel';

export default {
  props: {
    viewOnly: Boolean
  },

  setup() {
    const exotel = useConfigAlertExotel();

    return {
      ...exotel
    };
  }
};
</script>

<style lang="scss" scoped>

</style>
