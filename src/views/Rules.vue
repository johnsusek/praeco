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
  </div>
</template>

<script>
export default {
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
