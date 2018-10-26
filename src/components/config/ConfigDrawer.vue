<template>
  <el-card
    :class="{ 'drawer-card-open': drawerOpen }"
    class="drawer-card">
    <div>
      <el-button
        class="toggle-results p-w-sm p-e-sm"
        size="mini"
        @click="toggleDrawer">
        <icon v-if="drawerOpen" icon="chevron-down" />
        <icon v-if="!drawerOpen" icon="chevron-up" />
        Events
      </el-button>

      <div v-if="$store.state.config.match.type === 'spike'" class="spike-legend">
        <div class="swatch spike-up" /> Spike up
        <div class="swatch spike-down" /> Spike down
      </div>

      <ESChart
        v-if="$store.getters['config/query/queryString']"
        :timeframe="{ hours: 24 }"
        :bucket="bucket"
        :show-axis-pointer="drawerOpen"
        :mark-line="$store.getters['config/match/markLine']"
        :scroll-pos="scrollPos"
        :spike-height="$store.getters['config/match/spikeHeight']"
        :query="$store.getters['config/query/queryString']"
        :from="from"
        :index="$store.state.config.settings.index"
        @pointerDragged="pointerDragged"
        @pointerMoved="pointerMoved" />

      <EventTable
        v-loading="eventsLoading"
        v-if="events.length"
        ref="eventTable"
        :bucket="bucket"
        :events="events"
        :from="from"
        @scroll="handleScroll" />
    </div>
  </el-card>
</template>

<script>
import axios from 'axios';
import debounce from 'debounce';
import { logger } from '@/lib/logger.js';
import { intervalFromTimeframe } from '@/lib/intervalFromTimeframe';

export default {
  data() {
    return {
      events: [],
      eventsLoading: false,
      drawerOpen: false,
      from: null,
      scrollPos: 0
    };
  },

  computed: {
    bucket() {
      return this.$store.state.config.match.timeframe || { minutes: 5 };
    },

    timeField() {
      return this.$store.state.config.settings.timeField;
    }
  },

  methods: {
    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen;

      if (!this.drawerOpen) {
        if (this.$refs.eventTable) {
          this.$refs.eventTable.resetLoadedEvents();
        }
        this.from = null;
      } else if (this.$refs.eventTable) {
        this.$refs.eventTable.resetLoadedEvents();
        this.$refs.eventTable.setLoadedEvents(this.events);
      }
    },

    handleScroll(val) {
      this.scrollPos = val;
    },

    pointerDragged: debounce(async function(val) {
      this.fetchEvents(val.value);
      this.from = val.value;
      if (this.$refs.eventTable) {
        this.$refs.eventTable.resetLoadedEvents();
      }
    }, 1000),

    pointerMoved: debounce(async function(val) {
      this.fetchEvents(val.value);
      this.from = val.value;
      if (this.$refs.eventTable) {
        this.$refs.eventTable.resetLoadedEvents();
      }
    }, 40),

    async fetchEvents(from) {
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
                  [this.timeField]: {
                    gte: from,
                    lte: `${from}||+${to}`
                  }
                }
              }
            ]
          }
        },
        sort: [{ [this.timeField]: { order: 'desc' } }],
        size: 40
      };

      let res = await axios.post(`/api/search/${this.$store.state.config.settings.index}`, query);

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
    }
  }
};
</script>

<style>
.toggle-results {
  position: absolute;
  left: 10px;
  z-index: 10;
}

.spike-legend {
  position: absolute;
  left: 50px;
  top: 20px;
}

.swatch {
  width: 10px;
  height: 10px;
}

.swatch.spike-up {
  display: inline-block;
  background: #fc8a00;
}

.swatch.spike-down {
  margin-left: 5px;
  display: inline-block;
  background: #157ce7;
}
</style>
