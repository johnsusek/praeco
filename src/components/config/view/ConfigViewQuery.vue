<template>
  <el-card shadow="never" header="Query">
    <DefinitionTable>
      <TableRow :value="query" name="Query" />
      <TableRow :value="config.type" name="Type" />
    </DefinitionTable>

    <ConfigDrawer v-if="showChart" />
  </el-card>
</template>

<script>
import ConfigDrawer from '@/components/config/ConfigDrawer.vue';

export default {
  components: {
    ConfigDrawer
  },

  props: ['config', 'showChart'],

  computed: {
    query() {
      if (
        this.config.filter &&
        this.config.filter[0] &&
        this.config.filter[0].query.query_string.query
      ) {
        return this.config.filter[0].query.query_string.query;
      }
    },

    wildcardIndex() {
      let formattedIndex = this.config.index;
      if (this.config.use_strftime_index) {
        formattedIndex = formattedIndex.replace(/%[Ymd]/g, '*');
      }
      return formattedIndex;
    }
  }
};
</script>
