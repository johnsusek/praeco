<template>
  <span>
    {{ value }}
    {{ unit }}
  </span>
</template>

<script setup>
import { useElastalertTimeView } from '@/composables/useElastalertTimeView';

const props = defineProps({
  time: {
    type: Object,
    default: () => ({})
  }
});

const { value, unit } = useElastalertTimeView(props);
</script>
