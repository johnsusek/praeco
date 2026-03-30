<template>
  <span class="elastalert-timepicker">
    <el-input-number v-model="currentAmount" :min="allowZero ? 0 : 1" @input.native="emitNumKeyup" @input="emitValue" />

    <el-select v-model="currentUnit" @input="emitValue">
      <el-option :label="`Second${plural()}`" value="seconds" />
      <el-option :label="`Minute${plural()}`" value="minutes" />
      <el-option :label="`Hour${plural()}`" value="hours" />
      <el-option :label="`Day${plural()}`" value="days" />
      <el-option :label="`Week${plural()}`" value="weeks" />
    </el-select>
  </span>
</template>

<script setup>
import { useElastalertTimePicker } from '@/composables/useElastalertTimePicker';

const props = defineProps({
  unit: {
    type: String,
    default: 'minutes',
  },
  amount: {
    type: Number,
    default: 888,
  },
  allowZero: {
    type: Boolean,
    default: false,
  },
  value: {
    type: Object,
    default: () => ({ unit: 'minutes', amount: 888 }),
  },
});

const emit = defineEmits(['update:value']);

const { currentUnit, currentAmount, plural, emitNumKeyup, emitValue } = useElastalertTimePicker(props, emit);
</script>

<style scoped>
.el-input-number {
  margin-right: 10px;
  width: 110px;
}

.el-select {
  width: 110px;
}
</style>
