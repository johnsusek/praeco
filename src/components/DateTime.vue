<template>
  <span :title="date">
    <span v-if="!fromNow">
      {{ formatted }}
    </span>
    <span v-if="fromNow">
      {{ formattedUpdated }}
    </span>
  </span>
</template>

<script>
import dayjs from 'dayjs';
import dayjs_advancedFormat from 'dayjs/plugin/advancedFormat';
import dayjs_relativeTime from 'dayjs/plugin/relativeTime';
import dayjs_timezone from 'dayjs/plugin/timezone';
import dayjs_utc from 'dayjs/plugin/utc';

import parseDate from '@/lib/parseDate';

dayjs.extend(dayjs_advancedFormat);
dayjs.extend(dayjs_relativeTime);
dayjs.extend(dayjs_timezone);
dayjs.extend(dayjs_utc);

export default {
  props: {
    date: {
      default: null,
      validator (value) {
        return (typeof value === 'string' || typeof value === 'number');
      }
    },
    fromNow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formattedUpdated: null,
      timers: [],
      timerId: null
    };
  },
  computed: {
    formatted() {
      if (!this.date) return;
      let momentDate = parseDate(this.date);
      return momentDate.format('M/D/YYYY h:mm:ssa');
    }
  },
  watch: {
    date() {
      if (this.date && this.fromNow) {
        this.beginTimer();
      }
    }
  },
  created() {
    if (this.date && this.fromNow) {
      this.beginTimer();
    }
  },
  unmounted() {
    clearInterval(this.timerId);
  },
  methods: {
    beginTimer() {
      this.formattedUpdated = dayjs(String(this.date))
        .tz(this.timeZone)
        .fromNow();

      this.timerId = setInterval(() => {
        this.formattedUpdated = dayjs(String(this.date))
          .tz(this.timeZone)
          .fromNow();
      }, 1000);
    }
  }
};
</script>
