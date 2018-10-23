<template>
  <div>
    <h1>Errors</h1>

    <el-table v-loading="loading" :data="errorLog" empty-text=" ">
      <el-table-column label="Rule" prop="data.rule" width="150" />
      <el-table-column label="Error">
        <span slot-scope="scope">
          <strong>{{ shortDate(scope.row['@timestamp']) }}</strong>
          <br>
          {{ scope.row.message }}
        </span>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios';
import networkError from '../lib/networkError.js';

export default {
  data() {
    return {
      errorLog: [],
      loading: true
    };
  },
  async mounted() {
    await this.getErrorLog();
    this.loading = false;
  },
  methods: {
    shortDate(rawDate) {
      let [date, time] = new Date(rawDate).toLocaleString('en-US').split(', ');
      return `${date} ${time}`;
    },
    async getErrorLog() {
      try {
        let res = await axios.get('/api/metadata/elastalert_error');
        this.errorLog = res.data.hits;
      } catch (error) {
        networkError(error);
      }
    }
  }
};
</script>
