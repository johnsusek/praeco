<template>
  <span class="elastalert-timepicker">
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-input-number v-model="currentAmount" :min="allowZero ? 0 : 1" @keyup="emitNumKeyup" @input="emitValue" />

    <el-select v-model="currentUnit" @input="emitValue">
      <el-option :label="`Second${plural()}`" value="seconds" />
      <el-option :label="`Minute${plural()}`" value="minutes" />
      <el-option :label="`Hour${plural()}`" value="hours" />
      <el-option :label="`Day${plural()}`" value="days" />
      <el-option :label="`Week${plural()}`" value="weeks" />
    </el-select>
  </span>
</template>

<script>
export default {
  // props: ['unit', 'amount', 'allowZero'],
  props: {
    unit: {
      type: String,
      default: 'minutes'
    },
    amount: {
      type: Number,
      default: 1
    },
    allowZero: {
      type: Boolean,
      default: false
    },
  },
  emits: ['update:modelValue'],

  data() {
    return {
      currentUnit: 'minutes',
      currentAmount: 888
    };
  },

  mounted() {
    this.currentUnit = this.unit;
    this.currentAmount = this.amount;
  },

  methods: {
    plural() {
      if (this.currentAmount !== 1) return 's';
      return '';
    },

    emitNumKeyup(ev) {
      if (ev.target) {
        this.currentAmount = parseInt(ev.target.value);
      }
    },

    emitValue() {
      if (this.currentUnit && this.currentAmount !== undefined) {
        this.$emit('update:modelValue', { [this.currentUnit]: parseInt(this.currentAmount) });
      }
    }
  }
};
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
