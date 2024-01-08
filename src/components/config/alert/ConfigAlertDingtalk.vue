<template>
  <div>
    <!-- dingtalk_msgtype -->

    <el-radio id="groupDingtalk" v-model="groupDingtalk" :disabled="viewOnly" label="text" border @change="changeDingtalk">
      Text
    </el-radio>
    <el-radio id="groupDingtalk" v-model="groupDingtalk" :disabled="viewOnly" label="markdown" border @change="changeDingtalk">
      Markdown
    </el-radio>
    <el-radio id="groupDingtalk" v-model="groupDingtalk" :disabled="viewOnly" label="single_action_card" border @change="changeDingtalk">
      Single Action Card
    </el-radio>
    <el-radio id="groupDingtalk" v-model="groupDingtalk" :disabled="viewOnly" label="action_card" border @change="changeDingtalk">
      Action Card
    </el-radio>

    <!-- dingtalk_access_token -->

    <praeco-form-item label="Access Token" prop="dingtalkAccessToken">
      <el-input id="dingtalkAccessToken" :value="dingtalkAccessToken" :disabled="viewOnly" @input="dingtalkAccessToken = $event" />
      <label>
        Dingtalk access token.
      </label>
    </praeco-form-item>

    <div v-if="groupDingtalk === 'single_action_card'">
      <!-- dingtalk_single_title -->

      <praeco-form-item label="Single Title" prop="dingtalkSingleTitle" required>
        <el-input id="dingtalkSingleTitle" :value="dingtalkSingleTitle" :disabled="viewOnly" @input="dingtalkSingleTitle = $event" />
        <label>
          The title of a single button.
        </label>
      </praeco-form-item>

      <!-- dingtalk_single_url -->

      <praeco-form-item label="Single URL" prop="dingtalkSingleUrl">
        <el-input id="dingtalkSingleUrl" :value="dingtalkSingleUrl" :disabled="viewOnly" @input="dingtalkSingleUrl = $event" />
        <label>
          Jump link for a single button.
        </label>
      </praeco-form-item>
    </div>

    <div v-if="groupDingtalk === 'action_card'">
      <!-- dingtalk_btn_orientation -->
      <praeco-form-item label="Msg Type" prop="dingtalkBtnOrientation" required>
        <el-radio-group :value="dingtalkBtnOrientation" :disabled="viewOnly" @input="dingtalkBtnOrientation = $event">
          <el-radio id="dingtalkBtnOrientation0" label="0">
            Buttons are arranged vertically
          </el-radio><br>
          <el-radio id="dingtalkBtnOrientation1" label="1">
            Buttons are arranged horizontally
          </el-radio>
        </el-radio-group>
      </praeco-form-item>
    </div>
  </div>
</template>

<script>

export default {
  props: ['viewOnly'],

  data() {
    let groupDingtalkValue = this.$store.state.config.alert.dingtalkMsgtype;
    if (typeof this.$store.state.config.alert.dingtalkMsgtype === 'undefined' || this.$store.state.config.alert.dingtalkMsgtype === '') {
      groupDingtalkValue = 'text';
    }
    return {
      groupDingtalk: groupDingtalkValue,
    };
  },

  computed: {
    dingtalkAccessToken: {
      get() {
        return this.$store.state.config.alert.dingtalkAccessToken;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_DINGTALK_ACCESS_TOKEN', value);
      }
    },

    dingtalkMsgtype: {
      get() {
        return this.$store.state.config.alert.dingtalkMsgtype;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_DINGTALK_MSGTYPE', value);
      }
    },

    dingtalkSingleTitle: {
      get() {
        return this.$store.state.config.alert.dingtalkSingleTitle;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_DINGTALK_SINGLE_TITLE', value);
      }
    },

    dingtalkSingleUrl: {
      get() {
        return this.$store.state.config.alert.dingtalkSingleUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_DINGTALK_SINGLE_URL', value);
      }
    },

    dingtalkBtnOrientation: {
      get() {
        return this.$store.state.config.alert.dingtalkBtnOrientation;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_DINGTALK_BTN_ORIENTATION', value);
      }
    },
  },

  methods: {
    changeDingtalk(val) {
      this.dingtalkMsgtype = val;
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
