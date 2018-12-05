<template>
  <div class="event-table">
    <el-table
      v-loading="eventsLoading && !loadedEvents.length"
      ref="table"
      :data="loadedEvents"
      :border="true"
      :height="height"
      style="overflow-y: auto;"
      stripe
      @header-dragend="saveColumnWidths">
      <el-table-column type="expand">
        <template slot-scope="props">
          <p v-for="col in columns" :key="col">
            <strong>{{ col }}</strong>
            <br>
            {{ props.row[col] }}
          </p>
        </template>
      </el-table-column>

      <el-table-column
        v-for="(col, i) in visibleColumns"
        :key="col"
        :label="col"
        :prop="col"
        :width="widthForCol(col, i)"
        resizable>
        <template slot-scope="scope">
          <vue-json-pretty
            v-if="typeof scope.row[col] === 'object'"
            :data="scope.row[col]"
            :deep="0" />
          <template v-else>
            <DateTime v-if="col === timeField" :date="scope.row[col]" />
            <template v-else>{{ scope.row[col] }}</template>
          </template>
        </template>
      </el-table-column>

      <template slot="append">
        <div v-infinite-scroll="loadMore" infinite-scroll-distance="800" />
      </template>
    </el-table>

    <el-popover title="Hide columns">
      <el-button slot="reference" circle class="show-columns-button">
        <icon icon="ellipsis-h" />
      </el-button>
      <el-checkbox-group v-model="hidden">
        <div v-for="col in columns" :key="col" >
          <el-checkbox :label="col" @change="saveColumns">
            {{ col }}
          </el-checkbox>
        </div>
      </el-checkbox-group>
    </el-popover>

  </div>
</template>

<script>
import axios from 'axios';
import debounce from 'debounce';
import { intervalFromTimeframe } from '@/lib/intervalFromTimeframe';

const CancelToken = axios.CancelToken;

function msFromTimeframe(timeframe) {
  let value = Object.values(timeframe)[0];
  let unit = Object.keys(timeframe)[0];

  if (unit === 'seconds') {
    return value * 1000;
  } else if (unit === 'minutes') {
    return value * 60000;
  } else if (unit === 'hours') {
    return value * 3600000;
  } else if (unit === 'days') {
    return value * 86400000;
  } else if (unit === 'weeks') {
    return value * 604800000;
  }
}

export default {
  props: ['timeframe', 'from', 'height', 'groupByField', 'groupByValue'],

  data() {
    return {
      source: null,
      hidden: [],
      widths: {},
      offset: 0,
      totalEvents: 0,
      loadedEvents: [],
      eventsLoading: false
    };
  },

  computed: {
    columns() {
      if (this.loadedEvents.length) {
        return Object.keys(this.loadedEvents[0]).sort();
      }
      return [];
    },

    visibleColumns() {
      if (this.loadedEvents.length) {
        return Object.keys(this.loadedEvents[0])
          .sort()
          .filter(col => !this.hidden.includes(col));
      }
      return [];
    },

    timeField() {
      return this.$store.state.config.settings.timeField;
    },

    timeType() {
      return this.$store.state.config.settings.timeType;
    },

    queryString() {
      return this.$store.getters['config/query/queryString'];
    }
  },

  watch: {
    queryString() {
      this.reset();
      this.fetchEventsDebounced();
    },

    from() {
      this.reset();
      this.fetchEvents();
    }
  },

  mounted() {
    if (this.from) {
      this.fetchEvents();
    }

    // if there are saved columns, use those
    if (localStorage.getItem('hiddenEventTableColumns')) {
      this.hidden = JSON.parse(localStorage.getItem('hiddenEventTableColumns'));
    } else if (this.loadedEvents[0]) {
      this.hidden = [];
    }

    // if there are saved col widths, use those
    if (localStorage.getItem('eventTableColumnWidths')) {
      this.widths = JSON.parse(localStorage.getItem('eventTableColumnWidths'));
    }
  },

  methods: {
    reset() {
      this.loadedEvents = [];
      this.offset = 0;
      this.totalEvents = 0;
      this.$refs.table.$el.querySelector('.el-table__body-wrapper').scrollTop = 0;
    },

    widthForCol(col, i) {
      if (this.visibleColumns.length === i + 1) {
        return 'auto';
      }
      return this.widths[col] || 'auto';
    },

    saveColumns() {
      localStorage.setItem(
        'hiddenEventTableColumns',
        JSON.stringify(this.hidden)
      );
    },

    saveColumnWidths(newWidth, oldWidth, column) {
      this.widths[column.property] = newWidth;
      localStorage.setItem(
        'eventTableColumnWidths',
        JSON.stringify(this.widths)
      );
    },

    loadMore() {
      if (
        !this.eventsLoading &&
        (this.totalEvents === 0 || this.loadedEvents.length < this.totalEvents)
      ) {
        this.fetchEvents();
      }
    },

    fetchEventsDebounced: debounce(async function() {
      this.fetchEvents();
    }, 1000),

    async fetchEvents() {
      if (!this.$store.state.config.settings.index) return;

      this.eventsLoading = true;

      let query = {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query:
                    this.$store.getters['config/query/queryString'] ||
                    `${this.timeField}:*`
                }
              }
            ]
          }
        },
        sort: [{ [this.timeField]: { order: 'desc' } }],
        from: this.offset,
        size: 40
      };

      if (this.groupByField && this.groupByValue) {
        query.query.bool.must.push({
          query_string: {
            query: `${this.groupByField}:"${this.groupByValue}"`
          }
        });
      }

      if (this.from) {
        let to;

        if (this.timeType === 'iso') {
          to = `${this.from}||+${intervalFromTimeframe(this.timeframe)}`;
        } else if (this.timeType === 'unix_ms') {
          to = this.from + msFromTimeframe(this.timeframe);
        } else {
          to = this.from + Math.trunc(msFromTimeframe(this.timeframe) / 1000);
        }

        query.query.bool.must.push({
          range: {
            [this.timeField]: {
              gte: this.from,
              lte: to
            }
          }
        });
      }

      let res;

      // Cancel any currently running requests
      if (this.source) {
        this.source.cancel();
      }

      try {
        this.source = CancelToken.source();
        res = await axios.post(
          `/api/search/${this.$store.state.config.settings.index}`,
          query,
          { cancelToken: this.source.token }
        );
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error(error);
        }
      } finally {
        this.source = null;
      }

      if (res && res.data && res.data.hits) {
        res.data.hits.hits
          .map(h => h._source)
          .forEach(event => {
            this.loadedEvents.push(event);
          });
        this.totalEvents = res.data.hits.total;
        this.offset += 40;
      }

      this.eventsLoading = false;
    }
  }
};
</script>

<style scoped>
.el-table {
  position: inherit !important;
}
</style>

<style>
.event-table .el-table__body-wrapper {
  overflow-y: auto;
}

.event-table .el-table td {
  color: #212121;
  font-family: Consolas, "Andale Mono WT", "Andale Mono", "Lucida Console",
    "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono",
    "Liberation Mono", "Nimbus Mono L", Monaco, "Courier New", Courier,
    monospace;
  vertical-align: top;
}

.event-table .el-table td .cell {
  line-height: 17px;
}

.event-table .el-table tr {
  background-color: #eceff1;
}

.el-checkbox {
  display: block;
}

.show-columns-button {
  position: absolute;
  z-index: 9;
  left: 13px;
  top: 8px;
  padding: 3px !important;
}

.event-table {
  position: relative;
}
</style>
