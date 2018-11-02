<template>
  <span class="elastalert-timepicker">
    <el-input-number v-model="currentAmount" :min="allowZero ? 0 : 1" @input.native="emitNumKeyup" @input="emitValue" />

    <el-select v-model="currentUnit" @input="emitValue">
      <el-option :label="`Second`+plural()" value="seconds" />
      <el-option :label="`Minute`+plural()" value="minutes" />
      <el-option :label="`Hour`+plural()" value="hours" />
      <el-option :label="`Day`+plural()" value="days" />
      <el-option :label="`Week`+plural()" value="weeks" />
    </el-select>
  </span>
</template>

<script>
export default {
  props: ['unit', 'amount', 'allowZero'],

  data() {
    return {
      currentUnit: 'minutes',
      currentAmount: '888'
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
        this.currentAmount = ev.target.value;
      }
    },

    emitValue() {
      if (this.currentUnit && this.currentAmount !== undefined) {
        this.$emit('input', { [this.currentUnit]: this.currentAmount });
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
