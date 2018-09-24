<template>
  <div>
    <template v-if="renderedAlertResult.subject">
      <h6>Subject preview</h6>
      <pre>{{ renderedAlertResult.subject }}</pre>
    </template>

    <template v-if="renderedAlertResult.body">
      <h6>Body preview</h6>
      <pre>{{ renderedAlertResult.body }}</pre>
    </template>
  </div>
</template>

<script>
export default {
  props: ['renderedAlertResult']
};
</script>
