<template>
  <div>

    <h3>Results</h3>

    <ExpandableAlert
      v-if="previewError"
      :contents="previewError"
      title="Query error"
      type="error"
    />

    <el-alert
      v-if="previewLoading"
      :closable="false"
      class="el-alert-loading"
      title="Testing query..."
      type="info">
      <i class="el-icon-loading" />
    </el-alert>

    <template v-if="previewResult && previewResult.success">
      <div
        :closable="false"
        title="">
        This query returned
        <strong>{{ previewResult.hits || 0 }}</strong> results
        over the last day.
        <span v-if="previewResult.hits">A sample result is below.</span>
      </div>

      <el-table v-if="previewResult.result" :data="Object.entries(previewResult.result).sort()">
        <el-table-column label="Field" prop="0" width="200" />
        <el-table-column label="Value" prop="1" />
      </el-table>
    </template>

    <h3>Test run</h3>
    Check alert settings by testing against last 24h of events. No actual alerts will be sent.
    <br><br>

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
    </el-alert>

    <template v-if="!testRunLoading">
      <el-button type="info" plain @click="testStream">Test</el-button>
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
  props: ['previewResult', 'previewError', 'previewLoading', 'config'],
  data() {
    return {
      messages: [],
      debugMessages: [],
      testRunResult: '',
      testRunError: '',
      testRunLoading: false
    };
  },
  methods: {
    testStream() {
      let rule = encodeURIComponent(yaml.safeDump(this.config));

      this.testRunLoading = true;
      this.testRunResult = '';
      this.testRunError = '';
      this.messages = [];
      this.messages.push('Starting test run...');

      let url = this.$store.state.config.config.apiBaseUrl;
      let options = {
        testType: 'all',
        days: 1,
        alert: false,
        format: 'json',
        maxResults: 1
      };
      let evtSource = new EventSource(`${url}test_stream?options=${JSON.stringify(options)}&rule=${rule}`);

      evtSource.addEventListener('done', () => {
        this.testRunLoading = false;
        evtSource.close();
      });

      evtSource.addEventListener('result', e => {
        try {
          this.testRunResult = JSON.parse(e.data);
        } catch (error) {
          this.testRunError = e.data;
        }
      });

      evtSource.addEventListener('progress', e => {
        if (e.data.startsWith('INFO:elastalert:')) {
          this.messages.push(e.data);
        } else {
          this.debugMessages.push(e.data);
          this.testRunError = this.debugMessages.join('\n');
        }
      });
    }
  }
};
</script>

<style scoped>
h3 {
  margin-bottom: 4px;
}
</style>

