<template>
  <div>
    <br>

    <el-form-item label="Number of events" prop="num_events" required>
      <el-input-number
        :min="1"
        :controls="false"
        v-model="config.num_events"
        @keyup.native="numEventsChange"/>
      <label>The number of events which will trigger an alert, inclusive.</label>
    </el-form-item>

    <el-form-item label="Timeframe" required>
      <ElastalertTimePicker v-model="config.timeframe" />
      <label>The time that the number of events must occur within.</label>
    </el-form-item>

    <ExpandableAlert
      v-if="previewError"
      :contents="previewError"
      title="Preview error"
      type="error"
    />

    <el-form-item label="Frequency visualizer" >
      <v-chart :options="chart.area" auto-resize style="width: 100%; min-height 400x;" />
      <el-row class="chart-controls">
        <el-col :span="24" align="right">
          <label>Chart timespan</label>
          <ElastalertTimePicker v-model="chartTimespan" />
        </el-col>
      </el-row>
    </el-form-item>
  </div>
</template>

<script>
import axios from 'axios';
import echarts from 'echarts';
import debounce from 'debounce';
import ElastalertTimePicker from './ElastalertTimePicker';

function intervalFromTimeframe(timeframe) {
  let interval = Object.values(timeframe)[0];
  let unit = Object.keys(timeframe)[0];

  if (unit === 'seconds') {
    interval += 's';
  } else if (unit === 'minutes') {
    interval += 'm';
  } else if (unit === 'hours') {
    interval += 'h';
  } else if (unit === 'days') {
    interval += 'd';
  } else if (unit === 'weeks') {
    interval += 'w';
  }

  return interval;
}

export default {
  components: {
    ElastalertTimePicker
  },
  props: ['config', 'index', 'query'],
  data() {
    return {
      chartTimespan: { hours: 24 },
      previewError: '',
      chart: {
        area: {
          grid: {
            top: 60,
            bottom: 15,
            left: 50,
            right: 0
          },
          animation: false,
          tooltip: {
            trigger: 'axis',
            position(pt) {
              return [pt[0], '10%'];
            }
          },
          title: {
            left: 'center',
            text: ''
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
          },
          series: [
            {
              name: 'Events',
              type: 'line',
              smooth: true,
              symbol: 'none',
              sampling: 'average',
              itemStyle: {
                color: 'rgb(255, 0, 0)'
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgb(255, 158, 68)'
                  },
                  {
                    offset: 1,
                    color: 'rgb(255, 0, 0)'
                  }
                ])
              },
              data: [],
              markLine: {
                lineStyle: {
                  color: 'rgb(0, 37, 255)',
                  type: 'solid'
                },
                symbol: 'none',
                data: [
                  {
                    name: 'Alert level',
                    yAxis: 0
                  }
                ]
              }
            }
          ]
        }
      }
    };
  },
  computed: {
    chartTitle() {
      return `${this.query.query_string.query}\n${this.index}\n${
        Object.values(this.config.timeframe)[0]
      } ${Object.keys(this.config.timeframe)[0].slice(
        0,
        -1
      )} buckets over last ${intervalFromTimeframe(this.chartTimespan)}`;
    }
  },
  watch: {
    'config.num_events': {
      deep: true,
      initial: true,
      handler(val) {
        this.chart.area.series[0].markLine.data[0].yAxis = val;
      }
    },
    'config.timeframe': {
      deep: true,
      initial: true,
      handler() {
        this.chart.area.title.text = this.chartTitle;
        this.fetchData();
      }
    },
    index: {
      deep: true,
      initial: true,
      handler() {
        this.chart.area.title.text = this.chartTitle;
        this.fetchData();
      }
    },
    query: {
      deep: true,
      initial: true,
      handler() {
        this.chart.area.title.text = this.chartTitle;
        this.fetchData();
      }
    },
    chartTimespan: {
      deep: true,
      initial: true,
      handler() {
        this.chart.area.title.text = this.chartTitle;
        this.fetchData();
      }
    }
  },
  mounted() {
    this.chart.area.title.text = this.chartTitle;
    this.fetchData();
  },
  methods: {
    numEventsChange(e) {
      this.config.num_events = e.target.value;
    },
    fetchData: debounce(async function() {
      let query = {
        query: {
          bool: {
            must: [
              {
                query_string: this.query.query_string
              },
              {
                range: {
                  '@timestamp': {
                    gte: `now-${intervalFromTimeframe(this.chartTimespan)}`
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
              interval: intervalFromTimeframe(this.config.timeframe)
            }
          }
        }
      };

      this.previewError = '';

      let res = await axios.post(`/search/${this.index}`, query);

      if (res.data.error) {
        this.previewError = res.data.error.msg;
      } else {
        let x = res.data.aggregations.by_minute.buckets.map(r => r.key_as_string);
        let y = res.data.aggregations.by_minute.buckets.map(r => r.doc_count);

        this.chart.area.xAxis.data = x;
        this.chart.area.series[0].data = y;
      }
    }, 500)
  }
};
</script>

<style lang="scss" scoped>
.chart-controls {
  label {
    margin-right: 15px;
  }

  .el-col:first-child {
    padding-left: 100px;
  }
}
</style>
