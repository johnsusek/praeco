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

    <el-alert
      v-if="previewLoading"
      :closable="false"
      class="el-alert-loading"
      title="Preview loading..."
      type="info">
      <i class="el-icon-loading" />
    </el-alert>

    <div v-if="previewResult && previewResult.success">
      <el-alert
        :closable="false"
        type="info"
        title="">
        This query returned
        <strong>{{ previewResult.hits || 0 }}</strong> results
        over the last 30 days.
        <span v-if="previewResult.hits">A sample result is below.</span>
      </el-alert>

      <el-table v-if="previewResult.result" :data="Object.entries(previewResult.result).sort()">
        <el-table-column label="Field" prop="0" width="200" />
        <el-table-column label="Value" prop="1" />
      </el-table>
    </div>

    <el-alert
      v-if="previewError"
      :description="previewError"
      :closable="false"
      title="Preview error"
      type="error"
      show-icon />
  </div>
</template>

<script>
export default {
  props: ['previewLoading', 'previewResult', 'previewError', 'remoteValidating']
};
</script>
