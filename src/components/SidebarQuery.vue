<template>
  <div>
    <pre>{{ query }}</pre>

    <ESChart
      :timeframe="{ hours: 24 }"
      :bucket="{ minutes: 10 }"
      :query="query"
      :index="index" />

    <ExpandableAlert
      v-if="previewError"
      :contents="previewError"
      title="Query error"
      type="error"
    />

    <el-alert
      v-if="showPreview && previewLoading"
      :closable="false"
      class="el-alert-loading"
      title="Querying..."
      type="info">
      <i class="el-icon-loading" />
    </el-alert>

    <template v-if="showPreview && previewResult && previewResult.success">
      <div
        :closable="false"
        title="">
        This query returned
        <strong>{{ previewResult.hits || 0 }}</strong> results
        over the last day.
        <span v-if="previewResult.hits">A sample result is below.</span>
      </div>

      <br>

      <el-table v-if="previewResult.result" :data="Object.entries(previewResult.result).sort()">
        <el-table-column label="Field" prop="0" width="200" />
        <el-table-column label="Value" prop="1" />
      </el-table>
    </template>
  </div>
</template>

<script>
export default {
  props: ['showPreview', 'previewResult', 'previewError', 'previewLoading', 'query', 'index']
};
</script>

<style scoped>
pre {
  margin: 10px 0;
  border: 0;
  border-left: 3px solid #189acc;
  background: #f5f7fa;
  font-weight: bold;
  font-size: 15px;
}
</style>

