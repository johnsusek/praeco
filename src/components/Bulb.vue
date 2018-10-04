<template>
  <span>
    <span v-if="success !== undefined" class="success" />
    <span v-if="warning !== undefined" class="warning" />
    <span v-if="danger !== undefined" class="danger" />
    <span v-if="info !== undefined" class="info" />
  </span>
</template>

<script>
export default {
  props: ['success', 'warning', 'danger', 'info']
};
</script>

<style scoped>
span,
span span {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.success {
  background-color: #47d600;
}

.warning {
  background-color: #eca335;
}

.danger {
  background-color: #f55656;
}

.info {
  background-color: #dbdfe9;
}
</style>
