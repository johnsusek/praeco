<template>
  <span>
    <el-input-number
      v-model="num"
      :min="1"
      @input.native="emitNumKeyup"
      @input="emitValue"
    />
    <el-select
      v-model="unit"
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
        return { minutes: 20 };
      }
    }
  },
  data() {
    return {
      num: 0,
      unit: ''
    };
  },
  watch: {
    value() {
      this.num = Object.values(this.value)[0];
      this.unit = Object.keys(this.value)[0];
    }
  },
  mounted() {
    this.num = Object.values(this.value)[0];
    this.unit = Object.keys(this.value)[0];
  },
  methods: {
    plural() {
      if (this.num !== 1) return 's';
      return '';
    },
    emitNumKeyup(ev) {
      if (ev.target) {
        this.num = ev.target.value;
      }
    },
    emitValue() {
      this.$emit('input', { [this.unit]: this.num });
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
