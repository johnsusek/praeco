<template>
  <div v-if="height" class="event-table">
    <el-table
      ref="table"
      :data="loadedEvents"
      :border="true"
      :height="height"
      style="overflow-y: auto;"
      @header-dragend="saveColumnWidths">
      <el-table-column type="expand">
        <template slot-scope="props">
          <p v-for="col in Object.keys(events[0]).sort()" :key="col">
            <strong>{{ col }}</strong>
            <br>
            {{ props.row[col] }}
          </p>
        </template>
      </el-table-column>

      <el-table-column
        v-for="col in columns"
        :key="col"
        :label="col"
        :prop="col"
        :width="widths[col] || 'auto'"
        resizable>
        <template slot-scope="scope">
          <vue-json-pretty
            v-if="typeof scope.row[col] === 'object'"
            :data="scope.row[col]"
            :deep="0" />
          <template v-else>
            <DateTime v-if="col === '@timestamp'" :date="scope.row[col]" />
            <template v-else>{{ scope.row[col] }}</template>
          </template>
        </template>
      </el-table-column>

      <template slot="append">
        <div
          v-infinite-scroll="loadMore"
          infinite-scroll-distance="400" />
      </template>
    </el-table>

    <el-popover title="Hide columns">
      <el-button slot="reference" circle class="show-columns-button">
        <icon icon="ellipsis-h" />
      </el-button>
      <el-checkbox-group v-model="hidden">
        <div v-for="col in Object.keys(events[0]).sort()" :key="col" >
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
import throttle from 'lodash.throttle';
import { intervalFromTimeframe } from '@/lib/intervalFromTimeframe';

export default {
  props: ['events', 'bucket', 'from'],

  data() {
    return {
      height: 0,
      hidden: [],
      widths: {},
      offset: 0,
      totalEvents: 0,
      loadedEvents: null,
      eventsLoading: false
    };
  },

  computed: {
    columns() {
      return Object.keys(this.events[0]).sort().filter(col => !this.hidden.includes(col));
    }
  },

  watch: {
    events() {
      this.loadedEvents = this.events;
    }
  },

  created() {
    this.height = document.body.clientHeight - 260;
  },

  mounted() {
    this.loadedEvents = this.events;

    window.addEventListener('resize', throttle(() => {
      this.height = document.body.clientHeight - 260;
    }, 50));

    // if there are saved columns, use those
    if (localStorage.getItem('hiddenEventTableColumns')) {
      this.hidden = JSON.parse(localStorage.getItem('hiddenEventTableColumns'));
    } else if (this.events[0]) {
      this.hidden = Object.keys(this.events[0]).sort();
    }

    // if there are saved col widths, use those
    if (localStorage.getItem('eventTableColumnWidths')) {
      this.widths = JSON.parse(localStorage.getItem('eventTableColumnWidths'));
    }

    this.$refs.table.$el.querySelector('.el-table__body-wrapper').addEventListener('scroll', (e) => {
      let scrollVal;
      let scrollAmount = ((e.target.scrollTop + e.target.clientHeight) / e.target.scrollHeight);

      if (this.loadedEvents && this.loadedEvents.length) {
        scrollVal = parseInt(scrollAmount * this.loadedEvents.length);
      } else {
        scrollVal = parseInt(scrollAmount * this.events.length);
      }

      this.$emit('scroll', scrollVal);
    });
  },

  methods: {
    setLoadedEvents(events) {
      this.loadedEvents = events;
    },

    resetLoadedEvents() {
      this.$refs.table.$el.querySelector('.el-table__body-wrapper').scrollTop = 0;
      this.loadedEvents = null;
      this.offset = 0;
      this.totalEvents = 0;
    },

    saveColumns() {
      localStorage.setItem('hiddenEventTableColumns', JSON.stringify(this.hidden));
    },

    saveColumnWidths(newWidth, oldWidth, column) {
      this.widths[column.property] = newWidth;
      localStorage.setItem('eventTableColumnWidths', JSON.stringify(this.widths));
    },

    loadMore() {
      if (!this.loadedEvents) {
        this.loadedEvents = this.events;
      }

      if (this.totalEvents === 0 || this.loadedEvents.length < this.totalEvents) {
        this.offset += 40;
        this.fetchEvents();
      }
    },

    async fetchEvents() {
      if (!this.$store.state.config.settings.index) return;

      this.eventsLoading = true;

      let to = intervalFromTimeframe(this.bucket);

      let query = {
        query: {
          bool: {
            must: [
              {
                query_string: { query: this.$store.getters['config/query/queryString'] }
              },
              {
                range: {
                  '@timestamp': {
                    gte: this.from,
                    lte: `${this.from}||+${to}`
                  }
                }
              }
            ]
          }
        },
        sort: [{ '@timestamp': { order: 'desc' } }],
        from: this.offset,
        size: 40
      };

      let res = await axios.post(`/search/${this.$store.state.config.settings.index}`, query);

      if (res.data.hits) {
        res.data.hits.hits.map(h => h._source).forEach(event => {
          this.loadedEvents.push(event);
        });
        this.totalEvents = res.data.hits.total;
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
  font-family: Consolas, 'Andale Mono WT', 'Andale Mono', 'Lucida Console', 'Lucida Sans Typewriter',
    'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Liberation Mono', 'Nimbus Mono L', Monaco,
    'Courier New', Courier, monospace;
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
