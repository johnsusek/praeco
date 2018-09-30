<template>
  <div>
    <ExpandableAlert
      v-if="searchError"
      :contents="searchError"
      title="Search error"
      type="error"
    />

    <div class="praeco-chart">
      <v-chart
        v-loading="loading"
        :options="chart"
        auto-resize
        @click="handleClickChart" />

      <el-popover trigger="click" class="praeco-chart-popover">
        <el-button
          slot="reference"
          class="praeco-chart-options"
          circle
          plain
          icon="el-icon-setting"/>

        <div class="praeco-chart-controls">
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="24" align="right">
              <label>Group</label>
              <ElastalertTimePicker v-if="interval" v-model="interval" @input="updateChart" />
            </el-col>
          </el-row>

          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="24" align="right">
              <label>View previous</label>
              <ElastalertTimePicker v-if="timespan" v-model="timespan" @input="updateChart" />
            </el-col>
          </el-row>
        </div>
      </el-popover>

      <div v-loading="eventsLoading">
        <el-table v-if="events.length" :data="events">
          <!--
            This contains the only logstash specific
            code in the app - to widen the 'message' column
          -->
          <el-table-column
            v-for="col in Object.keys(events[0]).sort()"
            :key="col"
            :label="col"
            :prop="col"
            :width="col === 'message' && events[0].type === 'syslog' ? 500 : ''"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <vue-json-pretty
                v-if="typeof scope.row[col] === 'object'"
                :data="scope.row[col]"
                :deep="0" />
              <template v-else>{{ scope.row[col] }}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import debounce from 'debounce';
import 'echarts/lib/chart/bar.js';
import { intervalFromTimeframe } from '../lib/intervalFromTimeframe';
import chartOptions from '../lib/chartOptions';

export default {
  props: ['index', 'query', 'bucket', 'timeframe'],
  data() {
    return {
      events: [],
      eventsLoading: false,
      searchError: '',
      interval: null,
      timespan: null,
      loading: false,
      chart: {
        title: Object.assign({}, chartOptions.title),
        tooltip: Object.assign({}, chartOptions.tooltip),
        xAxis: Object.assign({}, chartOptions.xAxis),
        yAxis: Object.assign({}, chartOptions.yAxis),
        animation: false,
        grid: {
          top: 35,
          bottom: 15,
          left: 10,
          right: 0,
          containLabel: true
        },
        series: [
          {
            name: 'Events',
            type: 'bar',
            barCategoryGap: '0',
            symbol: 'none',
            itemStyle: {
              color: '#333'
            },
            areaStyle: {
              color: '#333'
            },
            data: []
          }
        ]
      }
    };
  },
  computed: {
    title() {
      let title = Object.values(this.interval)[0];
      title += ' ';
      title += Object.keys(this.interval)[0].slice(0, -1);
      title += ' buckets over last ';
      title += intervalFromTimeframe(this.timespan);
      return title;
    }
  },
  watch: {
    query() {
      this.updateChart();
    }
  },
  mounted() {
    if (this.timeframe) {
      this.timespan = this.timeframe;
    } else {
      this.timespan = { hours: 24 };
    }

    if (this.bucket) {
      this.interval = this.bucket;
    } else {
      this.interval = { minutes: 10 };
    }

    this.updateChart();
  },
  methods: {
    handleClickChart(params) {
      this.fetchEvents(this.chart.xAxis.data[params.dataIndex]);
    },
    updateChart() {
      this.chart.title.text = this.title;
      this.fetchData();
    },
    async fetchEvents(from) {
      this.eventsLoading = true;

      let to = intervalFromTimeframe(this.interval);
      let query = {
        query: {
          bool: {
            must: [
              {
                query_string: { query: this.query }
              },
              {
                range: {
                  '@timestamp': {
                    gte: from,
                    lte: `${from}||+${to}`
                  }
                }
              }
            ]
          }
        },
        sort: [{ '@timestamp': { order: 'desc' } }],
        size: 1000
      };

      let res = await axios.post(`/search/${this.index}`, query);

      if (res.data.hits) {
        this.events = res.data.hits.hits.map(h => h._source);
      } else {
        this.events = [];
      }

      this.eventsLoading = false;
    },
    fetchData: debounce(async function() {
      let query = {
        query: {
          bool: {
            must: [
              {
                query_string: { query: this.query }
              },
              {
                range: {
                  '@timestamp': {
                    gte: `now-${intervalFromTimeframe(this.timespan)}`
                  }
                }
              }
            ]
          }
        },
        aggs: {
          by_minute: {
            date_histogram: {
              field: '@timestamp',
              interval: intervalFromTimeframe(this.interval)
            }
          }
        }
      };

      this.loading = true;
      this.searchError = '';

      let res = await axios.post(`/search/${this.index}`, query);

      if (res.data.error) {
        this.searchError = res.data.error.msg;
      } else {
        let x = res.data.aggregations.by_minute.buckets.map(r => r.key_as_string);
        let y = res.data.aggregations.by_minute.buckets.map(r => r.doc_count);

        this.chart.xAxis.data = x;
        this.chart.series[0].data = y;
        this.events = [];

        this.loading = false;
      }
    }, 400)
  }
};
</script>

<style lang="scss">
.praeco-chart {
  position: relative;

  button.praeco-chart-options {
    position: absolute;
    top: 0;
    right: 0;
    border: 0;
  }

  .echarts {
    width: 100%;
    height: 200px;
  }
}

.praeco-chart-popover {
  z-index: 99999999;
}

.praeco-chart-controls {
  label {
    margin-right: 12px;
  }

  .el-row {
    margin-bottom: 10px;
  }

  .el-row:last-child {
    margin-bottom: 0;
  }
}
</style>
