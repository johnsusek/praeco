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

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
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

const props = defineProps({
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
});

const formattedUpdated = ref(null);
const timerId = ref(null);

const formatted = computed(() => {
  if (!props.date) return;
  let momentDate = parseDate(props.date);
  return momentDate.format('M/D/YYYY h:mm:ssa');
});

const beginTimer = () => {
  formattedUpdated.value = dayjs(String(props.date))
    .tz('UTC')
    .fromNow();

  timerId.value = setInterval(() => {
    formattedUpdated.value = dayjs(String(props.date))
      .tz('UTC')
      .fromNow();
  }, 1000);
};

watch(() => props.date, (newDate) => {
  if (newDate && props.fromNow) {
    beginTimer();
  }
});

onMounted(() => {
  if (props.date && props.fromNow) {
    beginTimer();
  }
});

onUnmounted(() => {
  if (timerId.value) {
    clearInterval(timerId.value);
  }
});
</script>
