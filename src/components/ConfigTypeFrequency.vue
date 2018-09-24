<template>
  <el-form ref="form" :model="config" label-position="top" @submit.native.prevent>
    <br>

    <el-form-item label="Number of events" prop="num_events" required>
      <el-input-number
        :min="1"
        :controls="false"
        v-model="config.num_events"
        @keyup.native="updateNumEvents"/>
      <label>The number of events which will trigger an alert, inclusive.</label>
    </el-form-item>

    <el-form-item label="Timeframe" props="timeframe" required>
      <ElastalertTimePicker v-model="config.timeframe" @input="updateTimeframe" />
      <label>The time that the number of events must occur within.</label>
    </el-form-item>

    <el-button
      v-if="showAdvanced"
      type="text"
      @click="toggleAdvanced">
      <i class="el-icon-caret-bottom" />
      Hide advanced options
    </el-button>
    <el-button v-else type="text" @click="toggleAdvanced">
      <i class="el-icon-caret-right" />
      Show advanced options
    </el-button>

    <template v-if="showAdvanced">
      <el-form-item label="Use count query">
        <el-switch v-model="config.use_count_query" />
        <label>
          If true, ElastAlert will poll Elasticsearch using the count api,
          and not download all of the matching documents.
          This is useful is you care only about numbers and not the actual data.
          It should also be used if you expect a large number of query hits, in the order of
          tens of thousands or more. "Doc type" must be set to use this.
        </label>
      </el-form-item>

      <el-form-item label="Use terms query">
        <el-switch v-model="config.use_terms_query" @input="updateTermsSize" />
        <label>
          If true, ElastAlert will make an aggregation query against Elasticsearch
          to get counts of documents matching each unique value of "query key". This
          must be used with "query key" and "doc type". This will only return a maximum
          of "terms size", default 50, unique terms.
        </label>
      </el-form-item>

      <el-form-item v-if="config.use_terms_query" label="Terms size">
        <el-input-number :min="1" v-model="config.terms_size" />
        <label>
          When used with "use terms query", this is the maximum number of terms returned
          per query. Default is 50.
        </label>
      </el-form-item>

      <el-form-item :required="config.use_terms_query" prop="query_key" label="Query key">
        <el-select
          v-model="config.query_key"
          filterable
          clearable
          placeholder="Field"
          @input="updateQueryKey">
          <el-option
            v-for="field in Object.keys(fields)"
            :key="field"
            :label="field"
            :value="field" />
        </el-select>
        <label>
          Counts of documents will be stored independently for each value of "query key".
          Only "number of events" documents, all with the same value of "query key",
          will trigger an alert.
          <a href="https://github.com/Yelp/elastalert/blob/master/docs/source/ruletypes.rst#query_key" target="_blank">[?]</a>
        </label>
      </el-form-item>

      <el-form-item
        v-if="config.use_count_query || config.use_terms_query"
        label="Doc type"
        prop="doc_type"
        required>
        <el-select v-model="config.doc_type" placeholder="">
          <el-option
            v-for="type in types"
            :key="type"
            :label="type"
            :value="type"/>
        </el-select>
        <label>
          Specify the _type of document to search for.
          This must be present if "use count query" or "use terms query" is set.
        </label>
      </el-form-item>
    </template>

    <hr>

    <el-form-item label="Frequency visualizer" >
      <ExpandableAlert
        v-if="chartSearchError"
        :contents="chartSearchError"
        title="Preview error"
        type="error"
      />

      <v-chart
        :options="chart.area"
        auto-resize
        style="width: 100%; min-height 400x;"
        @click="handleClickChart" />

      <el-row class="chart-controls">
        <el-col :span="24" align="right">
          <label>Chart timespan</label>
          <ElastalertTimePicker v-model="chartTimespan" @input="updateChart" />
        </el-col>
      </el-row>
    </el-form-item>

    <div v-loading="eventsLoading">
      <el-form-item
        v-if="events.length"
        :label="eventsLoading ? '' : `Event viewer (${events.length})`">
        <el-table v-if="events.length" :data="events">
          <el-table-column
            v-for="col in Object.keys(events[0]).sort()"
            :key="col"
            :label="col"
            :prop="col"
            show-overflow-tooltip
          />
        </el-table>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import debounce from 'debounce';
import 'echarts/lib/chart/bar.js';
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
  props: ['config', 'index', 'query', 'fields', 'types'],
  data() {
    return {
      showAdvanced: false,
      events: [],
      eventsLoading: false,
      chartTimespan: { hours: 24 },
      chartSearchError: '',
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
              type: 'bar',
              barCategoryGap: '0',
              smooth: true,
              symbol: 'none',
              sampling: 'average',
              itemStyle: {
                color: 'rgb(255, 0, 0)'
              },
              areaStyle: {
                color: 'rgb(255, 0, 0)'
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
                    yAxis: this.config.num_events
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
      let title = this.query.query_string.query;
      title += '\n';
      title += this.index;
      title += '\n';
      title += Object.values(this.config.timeframe)[0];
      title += ' ';
      title += Object.keys(this.config.timeframe)[0].slice(0, -1);
      title += ' buckets over last ';
      title += intervalFromTimeframe(this.chartTimespan);
      return title;
    }
  },
  watch: {
    'query.query_string.query': function() {
      this.updateChart();
    }
  },
  mounted() {
    this.chart.area.title.text = this.chartTitle;
    this.fetchData();
  },
  methods: {
    async validate() {
      try {
        await this.$refs.form.validate();
        return this.config;
      } catch (error) {
        return false;
      }
    },
    toggleAdvanced() {
      this.showAdvanced = !this.showAdvanced;
    },
    updateChart() {
      this.chart.area.title.text = this.chartTitle;
      this.fetchData();
    },
    updateTimeframe() {
      this.chart.area.title.text = this.chartTitle;
      this.fetchData();
    },
    updateQueryKey(val) {
      if (val === '') {
        Vue.delete(this.config, 'query_key');
      }
    },
    updateTermsSize(val) {
      if (val) {
        Vue.set(this.config, 'terms_size', 50);
      } else {
        delete this.config.terms_size;
      }
    },
    updateNumEvents(e) {
      this.chart.area.series[0].markLine.data[0].yAxis = e.target.value;
      this.config.num_events = e.target.value;
    },
    handleClickChart(params) {
      this.fetchEvents(this.chart.area.xAxis.data[params.dataIndex]);
    },
    async fetchEvents(from) {
      this.eventsLoading = true;

      let to = intervalFromTimeframe(this.config.timeframe);
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
                    gte: from,
                    lte: `${from}||+${to}`
                  }
                }
              }
            ]
          }
        },
        sort: [{ '@timestamp': { order: 'asc' } }],
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

      this.chartSearchError = '';

      let res = await axios.post(`/search/${this.index}`, query);

      if (res.data.error) {
        this.chartSearchError = res.data.error.msg;
      } else {
        let x = res.data.aggregations.by_minute.buckets.map(r => r.key_as_string);
        let y = res.data.aggregations.by_minute.buckets.map(r => r.doc_count);

        this.chart.area.xAxis.data = x;
        this.chart.area.series[0].data = y;
        this.events = [];
      }
    }, 400)
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
