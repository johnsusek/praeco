<template>
  <span>
    <el-popover v-model="testPopoverVisible" placement="top" width="310">
      <span slot="reference">
        <el-button v-if="!testRunLoading" type="primary" plain size="medium">
          Test
          <i v-if="!testPopoverVisible" class="el-icon-arrow-down el-icon-right" />
          <i v-if="testPopoverVisible" class="el-icon-arrow-up el-icon-right" />
        </el-button>
        <el-button v-else type="primary" plain disabled size="medium">Testing...</el-button>
      </span>
      <el-form label-position="top">
        <div>
          <el-form-item label="Test over previous">
            <ElastalertTimePicker
              :unit="Object.keys(testTime)[0]"
              :amount="Object.values(testTime)[0]"
              @input="updateTestTime" />
            <el-button class="m-w-med" type="primary" plain @click="runTest">Run</el-button>
          </el-form-item>
        </div>
        <div v-if="!aggregationSchedule" class="m-n-med">
          <el-form-item label="Send real alerts">
            <el-switch v-model="realAlerts" active-color="#F56C6C" />
            <label>
              WARNING: A large amount of alerts may be sent at once if re-alert is 0.
              Always send to a test channel/address.
            </label>
          </el-form-item>
        </div>
      </el-form>
    </el-popover>

    <ExpandableAlert
      v-if="testRunError"
      :contents="testRunError"
      title="Test run error"
      type="error"
      class="m-n-med" />

    <el-alert
      v-if="testRunResult &&
        testRunResult.writeback &&
      testRunResult.writeback.elastalert_status"
      :closable="false"
      type="success"
      show-icon
      title="Test run finished"
      class="m-n-med">
      <div>
        This rule would result in
        {{ testRunResult.writeback.elastalert_status.matches || 0 }}
        alert triggers over the last
        <ElastalertTimeView :time="testTime" />
      </div>
    </el-alert>

    <el-alert
      v-if="testRunLoading && messages.length"
      :closable="false"
      title="Test running"
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
  </span>
</template>

<script>
import moment from 'moment-timezone';
import { logger } from '@/lib/logger.js';

export default {
  props: ['valid'],

  data() {
    return {
      realAlerts: false,
      testTime: { hours: 1 },
      testPopoverVisible: false,
      messages: [],
      debugMessages: [],
      testRunResult: '',
      testRunError: '',
      testRunLoading: false
    };
  },

  computed: {
    aggregationSchedule: {
      get() {
        return this.$store.state.config.alert.aggregationSchedule;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_AGGREGATION_SCHEDULE', value);
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
      } else if (payload.event === 'done') {
        this.testRunLoading = false;
        this.$disconnect();
      }
    };
  },

  methods: {
    updateTestTime(value) {
      this.testTime = value;
      this.testRunResult = '';
    },

    cancelTestRun() {
      this.$disconnect();
    },

    runTest() {
      this.testPopoverVisible = false;
      this.$emit('validate');

      this.$nextTick(() => {
        if (!this.valid) return;

        this.$connect();

        let rule = this.$store.getters['config/yaml'](true);

        this.testRunLoading = true;
        this.testRunResult = '';
        this.debugMessages = [];
        this.testRunError = '';
        this.messages = [];
        this.messages.push('Starting test run...');

        let start = moment()
          .subtract(
            Object.values(this.testTime)[0],
            Object.keys(this.testTime)[0]
          )
          .toISOString();

        let options = {
          testType: 'all',
          start,
          end: 'NOW',
          format: 'json',
          maxResults: 1,
          alert: this.realAlerts
        };

        this.$socket.onopen = () => {
          this.$socket.sendObj({ rule, options });
        };

        this.$socket.onclose = () => {
          this.testRunLoading = false;
        };
      });
    }
  }
};
</script>
