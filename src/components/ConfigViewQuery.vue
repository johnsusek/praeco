<template>
  <el-card shadow="never" header="Query">
    <DefinitionTable>
      <TableRow :value="config.filter && config.filter[0] && config.filter[0].query.query_string.query" name="Query" />
      <TableRow :value="config.type" name="Type" />
    </DefinitionTable>
  </el-card>
</template>

<script>
export default {
  props: ['config']
};
</script>
