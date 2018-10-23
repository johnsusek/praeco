<template>
  <div>
    <h1>Queries</h1>
    <el-table :data="queryLog" empty-text="">
      <el-table-column label="Rule" prop="rule_name" />
      <el-table-column label="Start time" width="170">
        <span slot-scope="scope">
          {{ shortDate(scope.row.starttime) }}
        </span>
      </el-table-column>
      <el-table-column label="End time" width="170">
        <span slot-scope="scope">
          {{ shortDate(scope.row.endtime) }}
        </span>
      </el-table-column>
      <el-table-column label="Hits" prop="hits" width="100" />
      <el-table-column label="Matches" prop="matches" width="100" />
      <el-table-column label="Time taken" prop="time_taken" />
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
      queryLog: [],
      loading: true
    };
  },

  async mounted() {
    await this.getQueryLog();
    this.loading = false;
  },

  methods: {
    shortDate(rawDate) {
      let [date, time] = new Date(rawDate).toLocaleString('en-US').split(', ');
      return `${date} ${time}`;
    },

    async getQueryLog() {
      try {
        let res = await axios.get('/api/metadata/elastalert_status');
        if (res.data.error) {
          this.$notify.error({
            message: res.data.error.msg,
            title: 'Elasticsearch error',
            duration: 0
          });
          logger().error({ error: res.data.error });
        } else {
          this.queryLog = res.data.hits;
        }
      } catch (error) {
        networkError(error);
      }
    }
  }
};
</script>
