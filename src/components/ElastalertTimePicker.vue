<template>
  <span>
    <el-input-number
      v-model="currentValue.num"
      :min="1"
      @input.native="emitNumKeyup"
      @input="emitValue"
    />
    <el-select
      v-model="currentValue.unit"
      @input="emitValue">
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
  props: {
    value: {
      type: Object,
      required: true,
      default () {
        return { minutes: 999 };
      }
    }
  },
  data() {
    return {
      currentValue: {
        num: 888,
        unit: 'minutes'
      }
    };
  },
  watch: {
    value: {
      initial: true,
      deep: true,
      handler() {
        if (Object.values(this.value)[0] && Object.keys(this.value)[0]) {
          this.currentValue.num = Object.values(this.value)[0];
          this.currentValue.unit = Object.keys(this.value)[0];
        }
      }
    }
  },
  methods: {
    plural() {
      if (this.currentValue.num !== 1) return 's';
      return '';
    },
    emitNumKeyup(ev) {
      if (ev.target) {
        this.currentValue.num = ev.target.value;
      }
    },
    emitValue() {
      this.$emit('input', { [this.currentValue.unit]: this.currentValue.num });
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
