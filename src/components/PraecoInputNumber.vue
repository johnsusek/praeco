<template>
  <el-input-number
    :value="value"
    @input="(val) => $emit('input', val)"
    @input.native="(ev) => $emit('input', ev.target.value)" />
</template>

<script>
export default {
  props: [
    'value'
  ]
};
</script>
