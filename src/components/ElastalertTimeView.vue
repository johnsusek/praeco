<template>
  <span>
    {{ value }}
    {{ unit }}
  </span>
</template>

<script>
export default {
  props: ['time'],

  computed: {
    value() {
      if (!this.time) return;

      return Object.values(this.time)[0];
    },

    unit() {
      if (!this.time) return;

      let unit = Object.keys(this.time)[0];

      if (this.value <= 1 && this.unit) {
        unit = unit.slice(0, -1);
      }

      return unit;
    }
  }
};
</script>
