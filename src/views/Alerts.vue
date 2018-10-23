<template>
  <div>
    <h1>Alerts</h1>
    <el-table :data="alertLog" empty-text="">
      <el-table-column label="Rule" prop="rule_name" />
      <el-table-column label="Alert sent" width="100">
        <span slot-scope="scope">
          <el-tag v-if="scope.row.alert_sent" type="success">Sent</el-tag>
          <el-tag v-else type="danger">Not sent</el-tag>
        </span>
      </el-table-column>
      <el-table-column label="Match time" width="170">
        <span slot-scope="scope">
          {{ shortDate(scope.row.match_time) }}
        </span>
      </el-table-column>
      <el-table-column label="Alert time" width="170">
        <span slot-scope="scope">
          {{ shortDate(scope.row.alert_time) }}
        </span>
      </el-table-column>
      <el-table-column label="Alert type" width="100">
        <span slot-scope="scope">
          {{ titleCase(scope.row.alert_info && scope.row.alert_info.type) }}
        </span>
      </el-table-column>
      <el-table-column label="Exception" prop="alert_exception" />
      <el-table-column label="Aggregate ID" prop="aggregate_id" />
  </el-table>  </div>
</template>

<script>
import axios from 'axios';
import changeCase from 'change-case';
import { logger } from '@/lib/logger.js';
import networkError from '../lib/networkError.js';

export default {
  data() {
    return {
      alertLog: [],
      loading: true
    };
  },

  async mounted() {
    await this.getAlertLog();
    this.loading = false;
  },

  methods: {
    titleCase(val) {
      return changeCase.titleCase(val);
    },

    shortDate(rawDate) {
      let [date, time] = new Date(rawDate).toLocaleString('en-US').split(', ');
      return `${date} ${time}`;
    },

    async getAlertLog() {
      try {
        let res = await axios.get('/api/metadata/elastalert');
        if (res.data.error) {
          this.$notify.error({
            message: res.data.error.msg,
            title: 'Elasticsearch error',
            duration: 0
          });
          logger().error({ error: res.data.error });
        } else {
          this.alertLog = res.data.hits;
        }
      } catch (error) {
        networkError(error);
      }
    }
  }
};
</script>
