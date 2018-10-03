<template>
  <el-table v-if="events.length" :data="events">
    <!--
      This contains the only logstash specific
      code in the app - to widen the 'message' column
    -->
    <el-table-column
      v-for="col in Object.keys(events[0]).sort()"
      :key="col"
      :label="col"
      :prop="col"
      :width="col === 'message' && events[0].type === 'syslog' ? 500 : ''"
      show-overflow-tooltip>
      <template slot-scope="scope">
        <vue-json-pretty
          v-if="typeof scope.row[col] === 'object'"
          :data="scope.row[col]"
          :deep="0" />
        <template v-else>{{ scope.row[col] }}</template>
      </template>
    </el-table-column>
  </el-table>

</template>

<script>
export default {
  props: ['events']
};
</script>

