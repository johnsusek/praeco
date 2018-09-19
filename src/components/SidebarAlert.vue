<template>
  <div>
    <el-alert
      v-if="remoteValidating"
      :closable="false"
      class="el-alert-loading"
      title="Validating..."
      type="info">
      <i class="el-icon-loading" />
    </el-alert>
    Fields available for subject/body:
    {{ fields }}
    <template v-if="previewAlertResult.subject">
      <h6>Subject</h6>
      <pre>{{ previewAlertResult.subject }}</pre>
    </template>
    <template v-if="previewAlertResult.body">
      <h6>Body</h6>
      <pre>{{ previewAlertResult.body }}</pre>
    </template>
  </div>
</template>

<script>
export default {
  props: ['previewAlertResult', 'remoteValidating', 'previewResult'],
  computed: {
    fields() {
      return this.previewResult.terms && this.previewResult.terms.slice(0).sort();
    }
  }
};
</script>
