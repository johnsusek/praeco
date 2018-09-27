<template>
  <div>

    <div v-if="showMappingValidation">
      <el-alert
        v-if="mappingLoading"
        :closable="false"
        class="el-alert-loading"
        title="Getting fields..."
        type="info">
        <i class="el-icon-loading" />
      </el-alert>

      <el-alert
        v-if="mappingLoaded === false"
        :description="mappingError"
        :closable="false"
        title="Get mapping failed. Make sure the index exists"
        type="error"
        show-icon />

      <el-alert
        v-if="mappingLoaded"
        :closable="false"
        title="Got field mapping"
        type="success"
        show-icon />
    </div>

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
    'showMappingValidation',
    'mappingLoaded',
    'mappingError',
    'mappingLoading',
    'remoteValid',
    'remoteError',
    'remoteValidating'
  ]
};
</script>
