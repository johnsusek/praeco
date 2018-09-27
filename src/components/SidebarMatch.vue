<template>
  <div>
    <template v-if="showTest">
      Check alert settings by testing against last 24h of events. No actual alerts will be sent.
      <br><br>
    </template>

    <ExpandableAlert
      v-if="testRunError"
      :contents="testRunError"
      title="Test run error"
      type="error"
    />

    <el-alert
      v-if="testRunLoading && messages.length"
      :closable="false"
      :title="messages.slice(-1)[0].replace('INFO:elastalert:', '')"
      class="el-alert-loading"
      type="info">
      <i class="el-icon-loading" />
      <br><br>
      <el-button type="info" plain @click="cancelTestRun">Cancel</el-button>
    </el-alert>

    <template v-if="!testRunLoading">
      <template v-if="showTest">
        <el-button type="info" plain @click="testStream">Test</el-button>
      </template>
      <template v-if="testRunResult &&
        testRunResult.writeback &&
      testRunResult.writeback.elastalert_status">
        <br><br>
        <el-alert
          :closable="false"
          type="success"
          title="">
          This rule would result in
          <strong>
            {{ testRunResult.writeback.elastalert_status.matches || 0 }}
          </strong>
          alert triggers
          over the last day.
          <br>
          <small>Your re-alert settings may reduce the actual amount of alerts you receive.</small>
        </el-alert>
      </template>
    </template>

  </div>
</template>

<script>
import yaml from 'js-yaml';

export default {
  props: ['showTest', 'config'],
  data() {
    return {
      messages: [],
      debugMessages: [],
      testRunResult: '',
      testRunError: '',
      testRunLoading: false
    };
  },
  destroyed() {
    this.$disconnect();
  },
  mounted() {
    this.$options.sockets.onmessage = ev => {
      let payload = JSON.parse(ev.data);
      if (payload.event === 'progress') {
        if (payload.data.startsWith('INFO:elastalert:')) {
          this.messages.push(payload.data);
        } else {
          this.debugMessages.push(payload.data);
          this.testRunError = this.debugMessages.join('\n');
        }
      } else if (payload.event === 'result') {
        try {
          this.testRunResult = JSON.parse(payload.data);
        } catch (error) {
          this.testRunError = payload.data;
        }
        this.testRunLoading = false;
      } else if (payload.event === 'done') {
        this.testRunLoading = false;
      }
    };
  },
  methods: {
    cancelTestRun() {
      this.$disconnect();
      this.testRunLoading = false;
    },
    testStream() {
      this.$connect();

      let rule = yaml.safeDump(this.config);

      this.testRunLoading = true;
      this.testRunResult = '';
      this.testRunError = '';
      this.messages = [];
      this.messages.push('Starting test run...');

      let options = {
        testType: 'all',
        days: 1,
        alert: false,
        format: 'json',
        maxResults: 1
      };

      this.$socket.onopen = () => {
        this.$socket.sendObj({ rule, options });
      };
    }
  }
};
</script>
