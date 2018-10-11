<template>
  <div>
    <el-alert
      v-if="remoteValidating"
      :closable="false"
      class="el-alert-loading"
      title="Validating schema..."
      type="info">
      <i class="el-icon-loading" />
    </el-alert>

    <el-alert
      v-if="remoteValid === false"
      :description="remoteError"
      :closable="false"
      title="Remote validation failed"
      type="error"
      show-icon />

    <el-alert
      v-if="remoteValid"
      :closable="false"
      title="Rule is valid"
      type="success"
      show-icon />
  </div>
</template>

<script>
export default {
  props: [
    'remoteValidating',
    'remoteValid',
    'remoteError'
  ]
};
</script>
