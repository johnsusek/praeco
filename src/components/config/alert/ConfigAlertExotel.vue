
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
export default {
  props: ['viewOnly'],

  computed: {
    exotelAccountSid: {
      get() {
        return this.$store.state.config.alert.exotelAccountSid;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_EXOTEL_ACCOUNT_SID',
          value
        );
      }
    },

    exotelAuthToken: {
      get() {
        return this.$store.state.config.alert.exotelAuthToken;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_EXOTEL_AUTH_TOKEN',
          value
        );
      }
    },

    exotelToNumber: {
      get() {
        return this.$store.state.config.alert.exotelToNumber;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_EXOTEL_TO_NUMBER',
          value
        );
      }
    },

    exotelFromNumber: {
      get() {
        return this.$store.state.config.alert.exotelFromNumber;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_EXOTEL_FROM_NUMBER',
          value
        );
      }
    },

    exotelMessageBody: {
      get() {
        return this.$store.state.config.alert.exotelMessageBody;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_EXOTEL_MESSAGE_BODY',
          value
        );
      }
    }
  },

  methods: {
  }
};
</script>

<style lang="scss" scoped>

</style>
