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

    <template v-if="previewAlertResult.subject">
      <h6>Subject sample</h6>
      <pre>{{ previewAlertResult.subject }}</pre>
    </template>

    <template v-if="previewAlertResult.body">
      <h6>Body sample</h6>
      <pre>{{ previewAlertResult.body }}</pre>
    </template>
  </div>
</template>

<script>
export default {
  props: ['previewAlertResult', 'remoteValidating']
};
</script>
