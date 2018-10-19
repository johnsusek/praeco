<template>
  <div>
    <ExpandableAlert
      v-if="testRunError"
      :contents="testRunError"
      title="Test run error"
      type="error"
    />

    <el-row>
      <el-col :span="24">
        <el-button v-if="!testRunLoading" type="primary" plain @click="runTest">Test</el-button>
        <el-button v-else type="primary" plain disabled>Testing...</el-button>
        <label>
          Check alert settings by testing against last 24h of events. No actual alerts will be sent.
        </label>
      </el-col>
    </el-row>

    <el-alert
      v-if="(+new Date() - startTime) > 10000 && lastRateAverage > 0 && lastRateAverage < 70"
      :closable="false"
      :show-icon="true"
      title="This is a slow query that could consume a large amount of
      server resources. Please consider modifying your query or match settings."
      type="warning"
      class="m-n-med" />

    <el-alert
      v-if="testRunResult &&
        testRunResult.writeback &&
      testRunResult.writeback.elastalert_status"
      :closable="false"
      :title="`This rule would result in
      ${testRunResult.writeback.elastalert_status.matches || 0 }
      alert triggers
      over the last day.`"
      type="success"
      class="m-n-med" />

    <template v-if="testRunLoading && messages.length">
      <el-row type="flex" justify="center" align="middle" class="m-n-lg">
        <el-col :span="8" align="center">
          <div class="rate">{{ lastRateAverage }}</div>
        </el-col>
        <el-col :span="8" align="center">
          <el-progress
            :width="70"
            :percentage="Math.trunc(testRunStats.cpu) || 0"
            :color="colorFromPercent(testRunStats.cpu)"
            type="circle" />
        </el-col>
        <el-col :span="8" align="center">
          <el-progress
            :width="70"
            :percentage="Math.trunc(testRunStats.mem) || 0"
            :color="colorFromPercent(testRunStats.mem)"
            type="circle" />
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle">
        <el-col :span="8" align="center">
          Test rate
        </el-col>
        <el-col :span="8" align="center">
          CPU usage
        </el-col>
        <el-col :span="8" align="center">
          Memory usage
        </el-col>
      </el-row>
    </template>

    <el-alert
      v-if="testRunLoading && messages.length"
      :closable="false"
      title=""
      class="el-alert-loading m-n-med"
      type="info">
      <el-container>
        <div>
          <i class="el-icon-loading" />
        </div>
        <div style="flex: 1;">
          {{ messages.slice(-1)[0].replace('INFO:elastalert:', '') }}
        </div>
        <div>
          <el-button type="info" plain @click="cancelTestRun">Cancel</el-button>
        </div>
      </el-container>
    </el-alert>

  </div>
</template>

<script>
import { logger } from '@/lib/logger.js';

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;

export default {
  props: ['valid'],

  data() {
    return {
      startTime: 0,
      messages: [],
      lastRates: [],
      debugMessages: [],
      testRunResult: '',
      testRunStats: {},
      testRunError: '',
      testRunLoading: false
    };
  },

  computed: {
    lastRateAverage() {
      return Math.trunc(average(this.lastRates)) || 0;
    }
  },

  watch: {
    messages() {
      if (!this.messages.length || !this.startTime) return 0;
      let interval = +new Date() - this.startTime;
      if (interval === 0 || interval === 1) return 0;
      let rate = ((this.messages.length / interval) * 100000).toFixed(0);
      if (rate) {
        this.lastRates.push(parseInt(rate));
      }
    }
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
          logger().error({ error: payload.data });
          this.testRunError = payload.data;
        } finally {
          this.testRunLoading = false;
          this.$disconnect();
        }
      } else if (payload.event === 'stats') {
        try {
          this.testRunStats = payload.data;
        } catch (error) {}
      } else if (payload.event === 'done') {
        this.testRunLoading = false;
        this.$disconnect();
      }
    };
  },

  methods: {
    colorFromPercent(percent) {
      if (percent > 75) {
        return '#f56c6c';
      }
      if (percent > 50) {
        return '#e6a23c';
      }
      return '#67c23a';
    },
    cancelTestRun() {
      this.$disconnect();
    },
    runTest() {
      this.$emit('validate');

      this.$nextTick(() => {
        if (!this.valid) return;

        this.$connect();

        let rule = this.$store.getters['config/yaml'];

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
          this.startTime = +new Date();
          this.$socket.sendObj({ rule, options });
        };

        this.$socket.onclose = () => {
          this.lastRates = [];
          this.startTime = 0;
          this.testRunStats = {};
          this.testRunLoading = false;
        };
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.rate {
  font-size: 24px;
}
</style>
