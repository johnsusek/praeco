<template>
  <div>
    <template v-if="renderedAlertResult.subject">
      <h6>Subject preview</h6>
      <pre>{{ renderedAlertResult.subject }}</pre>
    </template>

    <template v-if="renderedAlertResult.body">
      <h6>Body text preview</h6>
      <pre>{{ renderedAlertResult.body }}</pre>
      <pre v-if="!alertType || alertType === 'exclude_fields'" type="info">(Trigger details)</pre>
      <pre v-if="!alertType || alertType === 'exclude_fields'" type="info">(Top counts)</pre>
      <pre v-if="!alertType && alertType !== 'exclude_fields'" type="info">(Field values)</pre>
    </template>
  </div>
</template>

<script>
export default {
  props: ['renderedAlertResult', 'alertType']
};
</script>

<style lang="scss" scoped>
pre {
  background: white;
  border: none;
}
</style>
