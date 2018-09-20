<template>
  <el-card shadow="never" header="Alerts">
    <DefinitionTable>
      <TableRow name="Subject">
        <span v-html="config.alert_subject" />
      </TableRow>
      <TableRow name="Text">
        <span v-html="config.alert_text" />
      </TableRow>
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
        <TableRow :value="config.smtp_host" name="SMTP host" />
        <TableRow :value="config.smtp_port" name="SMTP port" />
        <TableRow :value="config.from_addr" name="From address" />
        <TableRow :value="config.email_reply_to" name="Reply to" />
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
