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
      return this.time && Object.values(this.time)[0];
    },

    unit() {
      let unit = this.time && Object.keys(this.time)[0];
      if (this.value <= 1 && this.unit) {
        unit = unit.slice(0, -1);
      }
      return unit;
    }
  }
};
</script>
