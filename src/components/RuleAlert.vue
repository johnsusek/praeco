<template>
  <el-form ref="form" :model="form" label-position="top" @submit.native.prevent>
    <el-form-item label="Type" prop="alert">
      <el-checkbox-group v-model="form.alert">
        <el-checkbox label="slack" border>Slack</el-checkbox>
        <el-checkbox label="email" border>Email</el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-card v-if="form.alert.includes('slack')" shadow="never">
      <h5>Slack options</h5>
      <el-form-item label="Slack webhook URL" prop="slack_webhook_url">
        <el-input v-model="form.slack_webhook_url" />
      </el-form-item>

      <el-form-item label="Slack channel or username" prop="slack_channel_override">
        <el-input v-model="form.slack_channel_override" />
      </el-form-item>

      <el-form-item label="Slack post as" prop="slack_username_override">
        <el-input v-model="form.slack_username_override" />
      </el-form-item>

      <el-form-item label="Slack message color" prop="slack_msg_color">
        <el-input v-model="form.slack_msg_color" />
      </el-form-item>
    </el-card>

    <el-form-item label="Subject" prop="alert_subject">
      <at v-model="form.alert_subject" :members="terms" :allow-spaces="false" at="#">
        <span slot="embeddedItem" slot-scope="s">
          <el-tag :data-term="s.current" size="mini" type="info">{{ s.current }}</el-tag>
        </span>
        <div contenteditable />
      </at>
    </el-form-item>

    <el-form-item label="Body" prop="alert_text">
      <at v-model="form.alert_text" :members="terms" :allow-spaces="false" at="#">
        <span slot="embeddedItem" slot-scope="s">
          <el-tag :data-term="s.current" size="mini" type="info">{{ s.current }}</el-tag>
        </span>
        <div contenteditable />
      </at>
    </el-form-item>

  </el-form>
</template>

<script>
import At from 'vue-at';

export default {
  components: {
    At
  },
  computed: {
    form() {
      return this.$store.state.editor.config;
    },
    test() {
      return this.$store.state.editor.test;
    },
    terms() {
      if (!this.test || !this.test.terms) {
        return [];
      }
      return this.test.terms.slice(0).sort();
    }
  }
};
</script>

<style scoped>
.el-tag {
  margin-right: 5px;
}

.el-checkbox.is-bordered.el-checkbox--small {
  height: auto;
}

[contenteditable] {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
  overflow-y: auto;
  line-height: 1.4;
}

[contenteditable]:focus {
  border: 1px solid #ccc;
  outline: none;
}

[contenteditable] .el-tag {
  margin-right: 0;
}
</style>
