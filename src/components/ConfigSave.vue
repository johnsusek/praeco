<template>
  <div>
    <vue-json-pretty :data="config" style="overflow-wrap: break-word;" />
  </div>
</template>

<script>
export default {
  props: ['config']
};
</script>
