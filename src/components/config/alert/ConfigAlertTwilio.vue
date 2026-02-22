<template>
  <div>
    <el-radio id="groupTwilio" v-model="groupTwilio" :disabled="viewOnly" label="sms" border @change="changeTwilio">
      SMS
    </el-radio>
    <el-radio id="groupTwilio" v-model="groupTwilio" :disabled="viewOnly" label="copilot" border @change="changeTwilio">
      Copilot
    </el-radio>

    <praeco-form-item label="Twilio Account Sid" prop="twilioAccountSid" required>
      <el-input id="twilioAccountSid" v-model="twilioAccountSid" :disabled="viewOnly" @update:model-value="twilioAccountSid = $event" />
      <label>This is sid of your twilio account.</label>
    </praeco-form-item>

    <praeco-form-item label="Twilio Auth Token" prop="twilioAuth" required>
      <el-input id="twilioAuth" v-model="twilioAuth" :disabled="viewOnly" @update:model-value="twilioAuth = $event" />
      <label>Auth token assosiated with your twilio account.</label>
    </praeco-form-item>

    <praeco-form-item label="Twilio To Number" prop="twilioToNumber" required>
      <el-input id="twilioToNumber" v-model="twilioToNumber" :disabled="viewOnly" @update:model-value="twilioToNumber = $event" />
      <label>The phone number where you would like send the notification. </label>
    </praeco-form-item>

    <div v-if="groupTwilio === 'sms'">
      <praeco-form-item label="Twilio From Number" prop="twilioFromNumber" required>
        <el-input id="twilioFromNumber" v-model="twilioFromNumber" :disabled="viewOnly" @update:model-value="twilioFromNumber = $event" />
        <label>Your twilio phone number from which message will be sent. </label>
      </praeco-form-item>
    </div>

    <div v-if="groupTwilio === 'copilot'">
      <praeco-form-item label="Twilio Message Service Sid" prop="twilioMessageServiceSid" required>
        <el-input id="twilioMessageServiceSid" v-model="twilioMessageServiceSid" :disabled="viewOnly" @update:model-value="twilioMessageServiceSid = $event" />
        <label>The SID of your twilio message service.</label>
      </praeco-form-item>
    </div>
  </div>
</template>

<script>
export default {
  props: ['viewOnly'],

  data() {
    let groupTwilioValue = 'copilot';
    if (typeof this.$store.state.config.alert.twilio_message_service_sid === 'undefined' || this.$store.state.config.alert.twilio_message_service_sid === '') {
      groupTwilioValue = 'sms';
    }
    return {
      groupTwilio: groupTwilioValue,
    };
  },

  computed: {
    twilioAccountSid: {
      get() {
        return this.$store.state.config.alert.twilioAccountSid;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TWILIO_ACCOUNT_SID',
          value
        );
      }
    },

    twilioAuth: {
      get() {
        return this.$store.state.config.alert.twilioAuth;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TWILIO_AUTH_TOKEN',
          value
        );
      }
    },

    twilioToNumber: {
      get() {
        return this.$store.state.config.alert.twilioToNumber;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TWILIO_TO_NUMBER',
          value
        );
      }
    },

    twilioFromNumber: {
      get() {
        return this.$store.state.config.alert.twilioFromNumber;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TWILIO_FROM_NUMBER',
          value
        );
      }
    },

    twilioMessageServiceSid: {
      get() {
        return this.$store.state.config.alert.twilioMessageServiceSid;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TWILIO_MESSAGE_SERVICE_SID',
          value
        );
      }
    }
  },

  methods: {
    changeTwilio() {
      this.twilioFromNumber = '';
      this.twilioMessageServiceSid = '';
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
