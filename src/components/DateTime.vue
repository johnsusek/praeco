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
import parseDate from '@/lib/parseDate';

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
  destroyed() {
    clearInterval(this.timerId);
  },
  methods: {
    beginTimer() {
      this.formattedUpdated = moment(String(this.date))
        .tz(this.timeZone)
        .fromNow();

      this.timerId = setInterval(() => {
        this.formattedUpdated = moment(String(this.date))
          .tz(this.timeZone)
          .fromNow();
      }, 1000);
    }
  }
};
</script>
