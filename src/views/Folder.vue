<template>
  <div>
    <h1>
      <icon icon="folder" transform="left-0" />
      {{ type.capitalize() }}/{{ path }}
    </h1>

    <el-button
      v-if="type === 'rules'"
      type="primary"
      plain
      @click="$router.push('/rule/add/' + encodeURIComponent(path))">
      <icon icon="file-alt" transform="left-4" />
      Add rule
    </el-button>

    <el-button
      v-if="type === 'templates'"
      type="primary"
      plain
      @click="$router.push('/template/add/' + encodeURIComponent(path))">
      <icon icon="file" transform="left-4" />
      Add template
    </el-button>

    <el-button type="info" plain @click="addFolder">
      <icon icon="folder" transform="left-4" />
      Add folder
    </el-button>

    <el-button type="danger" plain @click="deleteFolder">Delete folder...</el-button>

    <el-table :data="type === 'templates' ? templatesForFolder : rulesForFolder" class="m-n-sm" style="width: 100%">
      <el-table-column :label="type.capitalize()">
        <template slot-scope="scope">
          <icon icon="file-alt" style="padding-right: 4px" />
          <router-link :to="`/${type}/${encodeURIComponent(scope.row.val)}`">{{ scope.row.label }}</router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: ['type', 'path'],

  computed: {
    rulesForFolder() {
      return Object.keys(this.$store.state.configs.rules)
        .filter(val => val.startsWith(this.path))
        .filter(val => !val.replace(this.path, '').includes('/'))
        .map(val => ({ val, label: val.replace(this.path, '') }));
    },

    templatesForFolder() {
      return Object.keys(this.$store.state.configs.templates)
        .filter(val => val.startsWith(this.path))
        .filter(val => !val.replace(this.path, '').includes('/'))
        .map(val => ({ val, label: val.replace(this.path, '') }));
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
            path: `${this.path}/${value}`,
            type: this.type
          });
          this.$router.push({
            path: `/folders/${this.type}/${this.path}/${value}`,
            query: { refreshTree: true }
          });
        })
        .catch(() => {});
    },
    async deleteFolder() {
      try {
        let res = await this.$store.dispatch('configs/deleteFolder', {
          path: this.path,
          type: this.type
        });

        if (res.deleted) {
          this.$message.success('Deleted folder successfully');
          let path = res.path.split('/');
          path.pop();
          path = path.join('/');

          if (path.length) {
            this.$router.push({
              path: `/folders/${this.type}/${path}`,
              query: { refreshTree: true }
            });
          } else {
            this.$router.push({
              path: `/${this.type}`,
              query: { refreshTree: true }
            });
          }
        }
      } catch (error) {
        this.$message.error('Error deleting folder, is it empty?');
      }
    }
  }
};
</script>
