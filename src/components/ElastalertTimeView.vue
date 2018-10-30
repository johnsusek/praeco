<template>
  <span>
    {{ value }}
    {{ unit }}
  </span>
</template>

<script>
export default {
  props: ['time'],

  data() {
    return {
      value: '999',
      unit: 'seconds'
    };
  },

  watch: {
    time: {
      deep: true,
      handler() {
        this.updateTime();
      }
    }
  },

  mounted() {
    this.updateTime();
  },

  methods: {
    updateTime() {
      if (!this.time || !Object.values(this.time).length) return;

      this.value = Object.values(this.time)[0];

      let unit = Object.keys(this.time)[0];

      if (this.value <= 1 && this.unit) {
        unit = unit.slice(0, -1);
      }

      this.unit = unit;
    }
  }
};
</script>
