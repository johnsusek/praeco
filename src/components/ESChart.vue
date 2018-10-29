<template>
  <div>
    <ExpandableAlert
      v-if="searchError"
      :contents="searchError"
      title="Search error"
      type="error"
    />

    <div class="praeco-chart m-s-med">
      <div v-if="groupBy">
        <el-tabs v-if="groups.length" v-model="activeGroupIndex" tab-position="bottom" @input="updateGroupIndex">
          <el-tab-pane
            v-for="(group, index) in groups"
            v-model="activeGroupIndex"
            :key="index"
            :label="group.key"
            :name="index.toString()">
            <v-chart
              v-loading="loading"
              ref="chart"
              :options="chart"
              auto-resize
              tabindex="0"
              @keydown.native.left="moveLeft"
              @keydown.native.right="moveRight" />
          </el-tab-pane>
        </el-tabs>
      </div>

      <div v-else>
        <v-chart
          v-loading="loading"
          ref="chart"
          :options="chart"
          auto-resize
          tabindex="0"
          @keydown.native.left="moveLeft"
          @keydown.native.right="moveRight"
          @click="ev => $emit('click', ev)" />

        <el-popover v-if="showControls" trigger="click" class="praeco-chart-popover">
          <el-button
            slot="reference"
            size="medium"
            class="praeco-chart-options"
            circle
            plain
            icon="el-icon-time" />

          <div class="praeco-chart-controls">
            <el-row type="flex" class="row-bg" justify="space-around">
              <el-col :span="24" align="right">
                <label>Group</label>
                <ElastalertTimePicker
                  v-if="interval"
                  :unit="Object.keys(interval)[0]"
                  :amount="Object.values(interval)[0]"
                  @input="updateInterval" />
              </el-col>
            </el-row>

            <el-row type="flex" class="row-bg" justify="space-around">
              <el-col :span="24" align="right">
                <label>View previous</label>
                <ElastalertTimePicker
                  v-if="timespan"
                  :unit="Object.keys(timespan)[0]"
                  :amount="Object.values(timespan)[0]"
                  @input="updateTimespan" />
              </el-col>
            </el-row>
          </div>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import moment from 'moment-timezone';
import debounce from 'debounce';
import 'echarts/lib/chart/bar.js';
import { intervalFromTimeframe } from '../lib/intervalFromTimeframe';
import chartOptions from '../lib/chartOptions';

const CancelToken = axios.CancelToken;

function getColorForIndex(index, data, spikeHeight) {
  if (!data[index] || !data[index - 1]) {
    return;
  }

  let val = data[index].value;
  let preVal = data[index - 1].value;

  if (spikeHeight === 1) {
    return '#333';
  }

  if (val / preVal > spikeHeight) {
    return '#fc8a00';
  } else if (preVal / val > spikeHeight) {
    return '#157ce7';
  }

  return '#333';
}

export default {
  props: [
    'index',
    'query',
    'bucket',
    'timeframe',
    'markLine',
    'spikeHeight',
    'showAxisPointer',
    'showTitle',
    'showControls',
    'scrollPos',
    'groupBy',
    'aggAvg',
    'aggSum',
    'aggMin',
    'aggMax'
  ],

  data() {
    return {
      groups: [],
      activeGroupIndex: '0',
      movedFromKeyboard: false,
      source: null,
      searchError: '',
      interval: { minutes: 5 },
      timespan: { hours: 24 },
      loading: false,
      chart: {
        title: Object.assign({}, chartOptions.title),
        tooltip: Object.assign({}, chartOptions.tooltip),
        xAxis: Object.assign({}, chartOptions.xAxis),
        yAxis: Object.assign({}, chartOptions.yAxis),
        animation: false,
        grid: {
          top: this.showTitle ? 45 : 10,
          bottom: this.showAxisPointer ? 65 : 10,
          left: 10,
          right: 10,
          containLabel: true
        },
        dataZoom: [
          {
            show: false,
            bottom: 0,
            type: 'slider',
            xAxisIndex: [0],
            labelFormatter(value, valueStr) {
              let momentDate = moment(String(valueStr)).tz(Intl.DateTimeFormat().resolvedOptions().timeZone);
              return momentDate.format('M/D/YYYY h:mm:ssa');
            }
          },
          {
            show: false,
            bottom: 0,
            type: 'inside',
            xAxisIndex: [0],
          },
        ],
        series: [
          {
            name: 'Events',
            type: 'bar',
            barCategoryGap: '0',
            symbol: 'none',
            itemStyle: {
              color: '#333',
              emphasis: {
                color: '#666'
              }
            },
            markPoint: {
              silent: true,
              z: 9,
              zlevel: 9,
              symbol: 'diamond',
              symbolSize: '7',
              symbolOffset: [0, '-50%'],
              itemStyle: {
                borderWidth: '0.5',
                borderColor: 'black',
                color: '#fff700',
                opacity: 1
              },
              data: []
            },
            areaStyle: {
              color: '#333'
            },
            data: [],
            markLine: {}
          },
        ]
      }
    };
  },

  computed: {
    title() {
      let title = this.query;
      if (Object.values(this.interval)[0]) {
        title += '\n';
        title += Object.values(this.interval)[0];
        title += ' ';
        title += Object.keys(this.interval)[0].slice(0, -1);
        title += ' buckets over last ';
        title += intervalFromTimeframe(this.timespan);
      }
      return title;
    },

    timeField() {
      return this.$store.state.config.settings.timeField;
    },

    statAggs() {
      let aggs = {};

      if (this.aggAvg) {
        aggs = {
          avg: {
            avg: {
              field: this.aggAvg
            }
          }
        };
      } else if (this.aggSum) {
        aggs = {
          sum: {
            sum: {
              field: this.aggSum
            }
          }
        };
      } else if (this.aggMin) {
        aggs = {
          min: {
            min: {
              field: this.aggMin
            }
          }
        };
      } else if (this.aggMax) {
        aggs = {
          max: {
            max: {
              field: this.aggMax
            }
          }
        };
      }

      return aggs;
    },

    byMinuteAgg() {
      return {
        by_minute: {
          date_histogram: {
            field: this.timeField,
            interval: intervalFromTimeframe(this.interval),
            min_doc_count: 0,
            extended_bounds: {
              min: `now-${intervalFromTimeframe(this.timespan)}`,
              max: 'now'
            }
          },
          aggs: this.statAggs
        }
      };
    },

    aggs() {
      let aggs = {};

      if (this.groupBy) {
        aggs = {
          group_by_field: {
            terms: {
              field: `${this.groupBy}.keyword`
            },
            aggs: this.byMinuteAgg
          }
        };
      } else {
        aggs = this.byMinuteAgg;
      }

      return aggs;
    }
  },

  watch: {
    aggAvg() {
      this.updateChart();
    },

    aggSum() {
      this.updateChart();
    },

    aggMin() {
      this.updateChart();
    },

    aggMax() {
      this.updateChart();
    },

    groupBy() {
      this.updateChart();
    },

    query() {
      this.updateChart();
    },

    index() {
      this.updateChart();
    },

    markLine() {
      if (this.markLine && this.markLine.data) {
        Vue.set(this.chart.series[0], 'markLine', this.markLine);
      } else {
        Vue.set(this.chart.series[0], 'markLine', {
          silent: true,
          animation: false,
          symbol: 'none',
          data: []
        });
      }
    },

    spikeHeight() {
      this.setTooltipSpike();
      this.addSpikes();
    },

    bucket(val) {
      if (val) {
        this.interval = val;
        this.updateChart();
      }
    },

    showAxisPointer(show) {
      this.chart.grid.bottom = show ? 65 : 10;
      this.chart.xAxis.axisPointer.show = show;
      this.chart.dataZoom[0].show = show;
      this.chart.dataZoom[1].show = show;
      this.chart.series[0].markPoint.itemStyle.opacity = show ? 1 : 0;

      if (!show) {
        let current = new Date(this.chart.xAxis.data[this.chart.xAxis.data.length - 1].value);

        // Reset the axisPointer to the last position
        this.$refs.chart.mergeOptions({
          xAxis: {
            axisPointer: {
              value: current.toISOString()
            }
          }
        });
      }
    },

    scrollPos() {
      this.chart.xAxis.data.forEach((value, i) => {
        if (value.value === this.currentPosition) {
          this.chart.series[0].markPoint.data = [{
            xAxis: value.value,
            yAxis: this.chart.series[0].data[i].value - this.scrollPos
          }];
        }
      });
    }
  },

  mounted() {
    if (this.timeframe) {
      this.timespan = this.timeframe;
    }

    if (this.bucket) {
      this.interval = this.bucket;
    }

    this.chart.xAxis.axisPointer.label.formatter = debounce(val => {
      if (this.currentPosition && val.value === this.currentPosition) {
        return val.value;
      }

      if (this.movedFromKeyboard) {
        this.$emit('pointerMoved', val);
        this.movedFromKeyboard = false;
      } else {
        this.$emit('pointerDragged', val);
      }

      this.currentPosition = val.value;

      this.chart.xAxis.data.forEach((value, i) => {
        if (value.value === this.currentPosition) {
          this.chart.series[0].markPoint.data = [{
            xAxis: value.value,
            yAxis: this.chart.series[0].data[i].value - this.scrollPos
          }];
        }
      });

      return val.value;
    }, 40);

    this.chart.xAxis.axisPointer.show = this.showAxisPointer;

    this.updateChart();
  },

  methods: {
    getYValue(result) {
      let value = 0;

      if (this.aggAvg) {
        value = result.avg.value;
      } else if (this.aggSum) {
        value = result.sum.value;
      } else if (this.aggMin) {
        value = result.min.value;
      } else if (this.aggMax) {
        value = result.max.value;
      } else if (result.doc_count) {
        value = result.doc_count;
      }

      return {
        value
      };
    },

    updateGroupIndex() {
      let x = this.groups[this.activeGroupIndex].by_minute.buckets.map(r => ({
        value: r.key_as_string
      }));

      let y = this.groups[this.activeGroupIndex].by_minute.buckets.map(this.getYValue);

      // Remove the first and last values because they will contain
      // partial data
      x.pop();
      x.shift();
      y.pop();
      y.shift();

      this.chart.xAxis.data = x;
      this.chart.series[0].data = y;
    },

    moveLeft() {
      this.movedFromKeyboard = true;
      let xAxis = this.$refs.chart.options.xAxis;
      let current;

      if (this.currentPosition) {
        current = new Date(this.currentPosition);
      } else {
        current = new Date(xAxis.data[xAxis.data.length - 1].value);
      }

      let newDate = new Date(+current - 300000);
      this.currentPosition = newDate;

      this.$refs.chart.mergeOptions({
        xAxis: {
          axisPointer: {
            value: newDate.toISOString()
          }
        }
      });
    },

    moveRight() {
      this.movedFromKeyboard = true;
      let xAxis = this.$refs.chart.options.xAxis;
      let current;

      if (this.currentPosition) {
        current = new Date(this.currentPosition);
      } else {
        current = new Date(xAxis.data[xAxis.data.length - 1].value);
      }

      let newDate = new Date(+current + 300000);
      this.currentPosition = newDate;

      this.$refs.chart.mergeOptions({
        xAxis: {
          axisPointer: {
            value: newDate.toISOString()
          }
        }
      });
    },

    setTooltipDefault() {
      Vue.set(this.chart.tooltip, 'formatter', (options) => {
        let event = this.chart.xAxis.data[options.dataIndex];
        let momentDate = moment(String(event.value)).tz(Intl.DateTimeFormat().resolvedOptions().timeZone);
        return `${momentDate.format('M/D/YYYY h:mm:ssa')} <br> ${options.data.value} Events`;
      });
    },

    setTooltipSpike() {
      Vue.set(this.chart.tooltip, 'formatter', (options) => {
        let event = this.chart.xAxis.data[options.dataIndex];
        let preVal = this.chart.series[0].data[options.dataIndex > 0 ? (options.dataIndex - 1) : options.dataIndex].value;
        let val = this.chart.series[0].data[options.dataIndex].value;
        let spike = val / preVal;
        let momentDate = moment(String(event.value)).tz(Intl.DateTimeFormat().resolvedOptions().timeZone);

        if (spike.toFixed(1) === '1.0') {
          return `${momentDate.format('M/D/YYYY h:mm:ssa')} <br> ${options.data.value} Events`;
        }

        let spikeVal = spike;
        if (spike < 1) {
          spikeVal = preVal / val;
        }

        return `${momentDate.format('M/D/YYYY h:mm:ssa')} <br> 
              ${options.data.value} Events - Spike ${spike > 1 ? 'up' : 'down'} 
              ${spikeVal.toFixed(1)}`;
      });
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

    updateChart() {
      if (this.showTitle) {
        this.chart.title.text = this.title;
      }
      this.fetchData();
    },

    updateInterval(value) {
      this.interval = value;
      this.updateChart();
    },

    updateTimespan(value) {
      this.timespan = value;
      this.updateChart();
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
                  [this.timeField]: {
                    lte: 'now',
                    gte: `now-${intervalFromTimeframe(this.timespan)}`
                  }
                }
              }
            ]
          }
        },
        size: 0,
        aggs: this.aggs
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
        res = await axios.post(`/api/search/${this.index}`, query, { cancelToken: this.source.token });
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
        } else if (res.data.aggregations) {
          let x = null;
          let y = null;

          if (this.groupBy) {
            if (res.data.aggregations.group_by_field.buckets.length) {
              let buckets = res.data.aggregations.group_by_field.buckets;

              x = buckets[this.activeGroupIndex].by_minute.buckets.map(r => ({
                value: r.key_as_string
              }));

              y = buckets[this.activeGroupIndex].by_minute.buckets.map(this.getYValue);

              this.groups = buckets;
            } else {
              this.groups = [];
            }
          } else {
            x = res.data.aggregations.by_minute.buckets.map(r => ({
              value: r.key_as_string
            }));

            y = res.data.aggregations.by_minute.buckets.map(this.getYValue);
          }

          // Remove the first and last values because they will contain
          // partial data
          if (x && y) {
            x.pop();
            x.shift();
            y.pop();
            y.shift();
          }

          this.chart.xAxis.data = x;
          this.chart.series[0].data = y;

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
          } else {
            this.setTooltipDefault();
          }
        } else {
          console.warn('No aggregations in response data: ', res.data);
        }

        this.loading = false;
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
    padding-bottom: 0;
  }

  .echarts {
    width: 100%;
    height: 210px;
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
