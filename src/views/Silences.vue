<template>
  <div>
    <h1>Silences</h1>
    <el-alert
      show-icon
      title="Matches are silenced when you've already
          been alerted within the rule's re-alert timeframe." />
    <el-table :data="silenceLog" empty-text="">
      <el-table-column label="Rule" prop="rule_name" />
      <el-table-column label="Until" width="170">
        <span slot-scope="scope">
          {{ shortDate(scope.row.until) }}
        </span>
      </el-table-column>
      <el-table-column label="Timestamp" width="170">
        <span slot-scope="scope">
          {{ shortDate(scope.row['@timestamp']) }}
        </span>
      </el-table-column>
      <el-table-column label="Exponent" prop="exponent" />
    </el-table>
  </div>
</template>

<script>
import axios from 'axios';
import { logger } from '@/lib/logger.js';
import networkError from '../lib/networkError.js';

export default {
  data() {
    return {
      silenceLog: [],
      loading: true
    };
  },

  async mounted() {
    await this.getSilenceLog();
    this.loading = false;
  },

  methods: {
    shortDate(rawDate) {
      let [date, time] = new Date(rawDate).toLocaleString('en-US').split(', ');
      return `${date} ${time}`;
    },

    async getSilenceLog() {
      try {
        let res = await axios.get('/api/metadata/silence');
        if (res.data.error) {
          this.$notify.error({
            message: res.data.error.msg,
            title: 'Elasticsearch error',
            duration: 0
          });
          logger().error({ error: res.data.error });
        } else {
          this.silenceLog = res.data.hits;
        }
      } catch (error) {
        networkError(error);
      }
    }
  }
};
</script>
