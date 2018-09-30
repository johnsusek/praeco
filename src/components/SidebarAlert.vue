<template>
  <div>
    <h6>Subject preview</h6>
    <pre v-if="renderedAlertResult.subject">{{ renderedAlertResult.subject }}</pre>

    <h6>Body text preview</h6>
    <pre v-if="renderedAlertResult.body">{{ renderedAlertResult.body }}</pre>
    <pre v-if="!alertType || alertType === 'exclude_fields'" type="info">(Trigger details)</pre>
    <pre v-if="!alertType || alertType === 'exclude_fields'" type="info">(Top counts)</pre>
    <pre v-if="!alertType && alertType !== 'exclude_fields'" type="info">(Field values)</pre>
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
