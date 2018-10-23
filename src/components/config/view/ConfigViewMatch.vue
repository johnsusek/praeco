<template>
  <el-card shadow="never" header="Match">
    <DefinitionTable>
      <TableRow :value="config.type" name="Type" />
      <TableRow
        v-if="config.type === 'frequency'"
        :value="config.num_events"
        name="Number of events" />
      <TableRow v-if="config.type === 'frequency'" :value="config.timeframe" name="Timeframe" />
      <TableRow
        v-if="config.type === 'blacklist' || config.type === 'whitelist'"
        :value="config.compare_key"
        name="Term" />
      <TableRow v-if="config.type === 'blacklist'" :value="config.blacklist" name="Blacklist" />
      <TableRow v-if="config.type === 'whitelist'" :value="config.whitelist" name="Whitelist" />
    </DefinitionTable>
  </el-card>
</template>

<script>
export default {
  props: ['config']
};
</script>
