<template>
  <span>
    {{ time && Object.values(time)[0] }}
    {{ time && Object.keys(time)[0] }}
  </span>
</template>

<script>
export default {
  props: ['time']
};
</script>
