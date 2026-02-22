<template>
  <div>
    <praeco-form-item label="Bot Id" prop="workWechatBotId" required>
      <el-input id="workWechatBotId" v-model="workWechatBotId" :disabled="viewOnly" @update:model-value="workWechatBotId = $event" />
      <label>WorkWechat bot id.</label>
    </praeco-form-item>

    <praeco-form-item label="Msg Type" prop="workWechatMsgtype" required>
      <el-radio-group v-model="workWechatMsgtype" :disabled="viewOnly" @update:model-value="workWechatMsgtype = $event">
        <el-radio id="workWechatMsgtypeText" label="text" border>
          text
        </el-radio>
        <el-radio id="workWechatMsgtypeMarkdown" label="markdown" border>
          markdown
        </el-radio>
      </el-radio-group>
    </praeco-form-item>
  </div>
</template>

<script>

export default {
  props: ['viewOnly'],

  computed: {
    workWechatBotId: {
      get() {
        return this.$store.state.config.alert.workWechatBotId;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_WORK_WECHAT_BOT_ID',
          value
        );
      }
    },
    workWechatMsgtype: {
      get() {
        return this.$store.state.config.alert.workWechatMsgtype;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_WORK_WECHAT_MSGTYPE',
          value
        );
      }
    },
  },

  methods: {
  }
};
</script>

<style lang="scss" scoped>

</style>
