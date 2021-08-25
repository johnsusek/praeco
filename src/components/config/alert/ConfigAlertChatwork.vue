<template>
  <div>
    <praeco-form-item label="Api Key" prop="chatworkApikey" required>
      <el-input id="chatworkApikey" v-model="chatworkApikey" :disabled="viewOnly" />
      <label>ChatWork API KEY.</label>
    </praeco-form-item>

    <praeco-form-item label="Room Id" prop="chatworkRoomId" required>
      <el-input id="chatworkRoomId" v-model="chatworkRoomId" :disabled="viewOnly" />
      <label>
        The ID of the room you are talking to in Chatwork.
        How to find the room ID is the part of the number after "rid" at the end of the URL of the browser.
      </label>
    </praeco-form-item>
  </div>
</template>

<script>

export default {
  components: {
  },

  props: ['viewOnly'],

  data() {
    return {
      rules: {
      }
    };
  },

  computed: {
    chatworkApikey: {
      get() {
        return this.$store.state.config.alert.chatworkApikey;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_CHATWORK_API_KEY',
          value
        );
      }
    },
    chatworkRoomId: {
      get() {
        return this.$store.state.config.alert.chatworkRoomId;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_CHATWORK_ROOM_ID',
          value
        );
      }
    }
  },

  methods: {
  }
};
</script>

<style lang="scss">

</style>
