<template>
  <div>
    <h1>{{ type }}/{{ path }}</h1>

    <el-button type="primary" plain @click="addFolder">
      Add folder
    </el-button>

    <el-button type="danger" plain @click="deleteFolder">Delete folder...</el-button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['type', 'path'],
  methods: {
    addFolder() {
      this.$prompt('Name', 'Add folder', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      })
        .then(async ({ value }) => {
          await this.$store.dispatch('configs/createFolder', {
            path: `${this.path}/${value}`,
            type: this.type
          });
          this.$router.push(`/folders/${this.type}/${this.path}/${value}?refreshTree`);
        })
        .catch(() => {});
    },
    async deleteFolder() {
      try {
        let res = await axios.delete(`/folders/${this.type}/${this.path}`);
        if (res.data.deleted) {
          this.$message.success('Deleted folder successfully');
          let path = this.path.split('/');
          path.pop();

          if (path.length) {
            this.$router.push(`/folders/${this.type}/${path.join('/')}?refreshTree`);
          } else {
            this.$router.push(`/${this.type}?refreshTree`);
          }
        }
      } catch (error) {
        this.$message.error('Error deleting folder, is it empty?');
      }
    }
  }
};
</script>
