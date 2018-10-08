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
        ref="chart"
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
        <EventTable :events="events" />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import debounce from 'debounce';
import 'echarts/lib/chart/bar.js';
import { logger } from '@/lib/logger.js';
import { intervalFromTimeframe } from '../lib/intervalFromTimeframe';
import chartOptions from '../lib/chartOptions';

const CancelToken = axios.CancelToken;

function getColorForIndex(index, data, spikeHeight) {
  if (!data[index] || !data[index - 1]) {
    return;
  }

  let val = data[index].value;
  let preVal = data[index - 1].value;

  if (val / preVal > spikeHeight) {
    return '#fc8a00';
  } else if (preVal / val > spikeHeight) {
    return '#157ce7';
  }

  return '#333';
}

export default {
  props: ['index', 'query', 'bucket', 'timeframe', 'markLine', 'tooltipFormatter', 'spikeHeight'],
  data() {
    return {
      source: null,
      events: [],
      eventsLoading: false,
      searchError: '',
      interval: { minutes: 20 },
      timespan: { hours: 24 },
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
            data: [],
            markLine: {}
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
    },
    markLine() {
      if (this.markLine.data) {
        Vue.set(this.chart.series[0], 'markLine', this.markLine);
      } else {
        Vue.set(this.chart.series[0], 'markLine', {});
      }
    },
    spikeHeight() {
      this.addSpikes();
    },
    bucket(val) {
      if (val) {
        this.interval = val;
        this.updateChart();
      }
    }
  },
  mounted() {
    if (this.timeframe) {
      this.timespan = this.timeframe;
    }

    if (this.bucket) {
      this.interval = this.bucket;
    }

    this.updateChart();
  },
  methods: {
    setTooltipSpike() {
      Vue.set(this.chart.tooltip, 'formatter', (options) => {
        let {
          dataIndex,
          data,
        } = options[0];

        let event = this.chart.xAxis.data[dataIndex];
        let preVal = this.chart.series[0].data[dataIndex > 0 ? (dataIndex - 1) : dataIndex].value;
        let val = this.chart.series[0].data[dataIndex].value;
        let spike = val / preVal;

        if (spike.toFixed(1) === '1.0') {
          return `${event.value} <br> ${data.value} Events`;
        }

        let spikeVal = spike;
        if (spike < 1) {
          spikeVal = preVal / val;
        }

        return `${event.value} <br> 
              ${data.value} Events - Spike ${spike > 1 ? 'up' : 'down'} 
              ${spikeVal.toFixed(1)}`;
      });

      if (this.chart.series[0].tooltip) {
        this.chart.series[0].tooltip.formatter = this.tooltipFormatter;
      }
    },
    addSpikes() {
      // Set the bars blue or red depending on the spike height
      this.chart.series[0].data = this.chart.series[0].data.map((yy, i) => ({
        value: yy.value,
        itemStyle: {
          color: getColorForIndex(i, this.chart.series[0].data, this.spikeHeight)
        }
      }));
    },
    handleClickChart(params) {
      this.fetchEvents(this.chart.xAxis.data[params.dataIndex].value);
    },
    updateChart() {
      this.chart.title.text = this.title;
      this.fetchData();
    },
    async fetchEvents(from) {
      if (!this.index) return;

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

      if (res.data.error) {
        this.$notify.error({
          message: res.data.error.msg,
          title: 'Elasticsearch error',
          duration: 0
        });
        logger().error({ error: res.data.error });
      } else if (res.data.hits) {
        this.events = res.data.hits.hits.map(h => h._source);
      } else {
        this.events = [];
      }

      this.eventsLoading = false;
    },
    fetchData: debounce(async function() {
      if (!this.index) return;
      if (!Object.keys(this.timespan)[0]) return;

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
                    lte: 'now',
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

      let res;

      // Cancel any currently running requests
      if (this.source) {
        this.source.cancel();
      }

      try {
        this.source = CancelToken.source();
        res = await axios.post(`/search/${this.index}`, query, { cancelToken: this.source.token });
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error(error);
        }
      } finally {
        this.source = null;
      }

      if (res && res.data) {
        if (res.data.error) {
          this.searchError = res.data.error.msg;
        } else {
          let x = res.data.aggregations.by_minute.buckets.map(r => ({
            value: r.key_as_string,
          }));

          let y = res.data.aggregations.by_minute.buckets.map((r, i) => ({
            value: r.doc_count,
          }));

          // Remove the first and last values because they will contain
          // partial data
          x.pop();
          x.shift();
          y.pop();
          y.shift();


          this.chart.xAxis.data = x;
          this.chart.series[0].data = y;

          this.events = [];

          // Charts can have one or more marklines on their main axis,
          // passed in as a prop to this component.
          // We'll want to redraw it now that new data has arrived.
          if (this.markLine) {
            this.chart.series[0].markLine = this.markLine;
          }

          // It the spikeHeight prop is set, we'll want to add the tooltip
          // and colored bars for it
          if (this.spikeHeight) {
            this.setTooltipSpike();
            this.addSpikes();
          }

          this.loading = false;
        }
      }
    }, 800)
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
