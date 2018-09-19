<template>
  <tr>
    <td>{{ name }}</td>
    <td>
      {{ value }}
      <slot />
    </td>
  </tr>
</template>

<script>
export default {
  props: ['name', 'value']
};
</script>

<style scoped>
td {
  padding: 4px 0;
  word-break: break-all;
}

td:first-child {
  font-weight: 600;
  color: #909399;
  padding-right: 10px;
  padding-left: 10px;
  white-space: nowrap;
  width: 25%;
}

tr {
  border-bottom: 1px solid #ebeef5;
}

tr:last-child {
  border-bottom: none;
}
</style>
