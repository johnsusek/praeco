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
import Vue from 'vue';

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
        num: 1,
        unit: 'hours'
      }
    };
  },
  watch: {
    value: {
      initial: true,
      deep: true,
      handler() {
        console.log(
          'v-model has changed skipping update',
          Object.values(this.value)[0],
          Object.keys(this.value)[0]
        );
        // if (Object.values(this.value)[0] && Object.keys(this.value)[0]) {
        //   Vue.set(this.currentValue, 'num', Object.values(this.value)[0]);
        //   Vue.set(this.currentValue, 'unit', Object.keys(this.value)[0]);
        // }
      }
    }
  },
  mounted() {
    if (Object.values(this.value)[0] && Object.keys(this.value)[0]) {
      Vue.set(this.currentValue, 'num', Object.values(this.value)[0]);
      Vue.set(this.currentValue, 'unit', Object.keys(this.value)[0]);
    }
  },
  methods: {
    plural() {
      if (this.currentValue.num !== 1) return 's';
      return '';
    },
    emitNumKeyup(ev) {
      if (ev.target) {
        Vue.set(this.currentValue, 'num', ev.target.value);
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
