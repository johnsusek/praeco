<template>
  <div>
    <pre>{{ query }}</pre>

    <ESChart
      :timeframe="{ hours: 24 }"
      :bucket="timeframe || { minutes: 10 }"
      :mark-line="markLine"
      :spike-height="spikeHeight"
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
        <strong>{{ commaNumber(previewResult.hits) || 0 }}</strong> results
        over the last day.
        <span v-if="previewResult.hits">A sample result is below.</span>
      </div>

      <br>

      <el-table v-if="previewResult.result" :data="Object.entries(previewResult.result).sort()">
        <el-table-column label="Field" prop="0" width="160" />
        <el-table-column label="Value" prop="1">
          <template slot-scope="scope">
            <vue-json-pretty
              v-if="typeof scope.row[1] === 'object'"
              :data="scope.row[1]" :deep="0" />
            <template v-else>{{ scope.row[1] }}</template>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script>
import commaNumber from 'comma-number';

export default {
  props: [
    'showPreview',
    'previewResult',
    'previewError',
    'previewLoading',
    'query',
    'index',
    'markLine',
    'timeframe',
    'spikeHeight'
  ],
  methods: {
    commaNumber(val) {
      return commaNumber(val);
    }
  }
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

