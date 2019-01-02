<template>
  <div>
    <h1>Rules</h1>

    <el-button type="primary" plain @click="$router.push('/rule/add')">
      <icon icon="file-alt" transform="left-4" />
      Add rule
    </el-button>

    <el-button type="info" plain @click="addFolder">
      <icon icon="folder" transform="left-4" />
      Add folder
    </el-button>

    <el-table :data="rules" class="m-n-sm" style="width: 100%">
      <el-table-column label="Rules">
        <template slot-scope="scope">
          <icon icon="file-alt" style="padding-right: 4px" />
          <router-link :to="`/rules/${encodeURIComponent(scope.row.val)}`">{{ scope.row.val }}</router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  computed: {
    rules() {
      return Object.keys(this.$store.state.configs.rules)
        .filter(val => !val.includes('/'))
        .map(val => ({
          val
        }));
    }
  },

  methods: {
    addFolder() {
      this.$prompt('Name', 'Add folder', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      })
        .then(async ({ value }) => {
          await this.$store.dispatch('configs/createFolder', {
            path: value,
            type: 'rules'
          });
          this.$router.push({
            path: `/folders/rules/${value}`,
            query: { refreshTree: true }
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style>
table.vgt-table {
  font-size: inherit;
}

.vgt-table th.sorting:hover:after {
  border-bottom-color: #89afd8;
}

.vgt-table th.sorting:after {
  border-bottom: 6px solid #157ce7;
}
</style>
