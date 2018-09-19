<template>
  <el-card shadow="never" header="Alerts">
    <DefinitionTable>
      <TableRow :value="config.alert_subject" name="Subject" />
      <TableRow :value="config.alert_text" name="Text" />
      <TableRow :value="config.alert_text_type" name="alert_text_type" />
      <TableRow name="Re-alert">
        <Time :time="config.realert" />
      </TableRow>
    </DefinitionTable>
    <template v-if="alert.includes('slack')">
      <h5>Slack</h5>
      <DefinitionTable>
        <TableRow :value="config.slack_channel_override" name="Channel" />
        <TableRow :value="config.slack_msg_color" name="Message color" />
        <TableRow :value="config.slack_username_override" name="Post as" />
        <TableRow :value="config.slack_emoji_override" name="Emoji" />
        <TableRow :value="config.slack_webhook_url" name="Webhook URL" />
      </DefinitionTable>
    </template>
    <template v-if="alert.includes('email')">
      <h5>Email</h5>
      <DefinitionTable>
        <TableRow :value="config.email" name="To" />
        <TableRow :value="config.cc" name="CC" />
        <TableRow :value="config.bcc" name="BCC" />
      </DefinitionTable>
    </template>
    <template v-if="alert.includes('post')">
      <h5>HTTP POST</h5>
      <DefinitionTable>
        <TableRow :value="config.http_post_url" name="URL" />
      </DefinitionTable>
    </template>
  </el-card>
</template>

<script>
export default {
  props: ['config'],
  computed: {
    alert() {
      return this.config.alert || [];
    }
  }
};
</script>
