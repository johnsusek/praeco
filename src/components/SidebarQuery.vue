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

    <div v-if="previewResult">
      <template v-if="previewResult.success">
        <el-alert
          :closable="false"
          title="">
          This query returned
          <strong>{{ previewResult.hits || 0 }}</strong> results
          over the last day.
          <span v-if="previewResult.hits">A sample result is below.</span>
        </el-alert>

        <el-table v-if="previewResult.result" :data="Object.entries(previewResult.result).sort()">
          <el-table-column label="Field" prop="0" width="200" />
          <el-table-column label="Value" prop="1" />
        </el-table>
      </template>

      <br>

      <template v-if="previewResult.writeback && previewResult.writeback.elastalert_status">
        <el-alert
          :closable="false"
          type="success"
          title="">
          This rule type would result in
          <strong>
            {{ previewResult.writeback.elastalert_status.matches || 0 }}
          </strong>
          alert triggers
          over the last day.
          <br>
          <small>Your re-alert settings may reduce the actual amount of alerts you receive.</small>
        </el-alert>

      </template>
    </div>

    <ExpandableAlert
      v-if="previewError"
      :contents="previewError"
      title="Preview error"
      type="error"
    />
  </div>
</template>

<script>
export default {
  props: ['previewLoading', 'previewResult', 'previewError', 'remoteValidating']
};
</script>

