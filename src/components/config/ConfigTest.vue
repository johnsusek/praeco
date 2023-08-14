<template>
  <span>
    <el-popover v-model="testPopoverVisible" placement="top" width="310">
      <template #reference>
        <span>
          <el-button v-if="!testRunLoading" type="primary" plain size="medium">
            Test
            <i v-if="!testPopoverVisible" class="el-icon-caret-bottom el-icon-right" />
            <i v-if="testPopoverVisible" class="el-icon-caret-top el-icon-right" />
          </el-button>
          <el-button v-else type="primary" plain disabled size="medium">Testing...</el-button>
        </span>
      </template>
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
            <label v-if="realert && Object.values(realert)[0] === 0">
              <strong>
                WARNING: A large amount of alerts may be sent at once, since re-alert is set to 0.
                Always send to a test channel/address.
              </strong>
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
        <strong>{{ testRunResult.writeback.elastalert_status.matches || 0 }}</strong>
        alert triggers over the last
        <strong>
          <ElastalertTimeView :time="testTime" />
        </strong>.
        <div>
          (This does not take into account your re-alert settings.)
        </div>
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

export default {
  props: ['valid'],
  emits: ['validateForTest'],

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
    realert: {
      get() {
        return this.$store.state.config.alert.realert || { minutes: 5 };
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_REALERT', value);
      }
    },

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

          let runError = this.debugMessages.join('\n');

          // Ignore this error until elastalert fixes it:
          // https://github.com/Yelp/elastalert/issues/2634
          let ignoredError = 'ERROR:root:Uncaught exception running rule test: \'_thread._local\' object has no attribute \'alerts_sent\'';
          if (!runError.includes(ignoredError)) {
            this.testRunError = runError;
          }
        }
      } else if (payload.event === 'result') {
        try {
          this.testRunResult = JSON.parse(payload.data);
        } catch (error) {
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

      this.$emit('validateForTest', this.realAlerts);

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
          alert: !!this.realAlerts
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

<style scoped>
label > strong {
  color: red;
}
</style>
