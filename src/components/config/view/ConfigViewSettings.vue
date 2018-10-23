<template>
  <el-card shadow="never" header="Settings">
    <DefinitionTable>
      <TableRow :value="config.name" name="Name" />
      <TableRow :value="config.description" name="Description" />
      <TableRow :value="config.is_enabled" name="Enabled" />
      <TableRow :value="config.index" name="Index" />
      <TableRow :value="config.use_strftime_index" name="use_strftime_index" />
    </DefinitionTable>
  </el-card>
</template>

<script>
export default {
  props: ['config']
};
</script>
