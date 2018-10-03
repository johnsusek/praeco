<template>
  <div>
    <div v-show="showRename" >
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input
            ref="rename"
            v-model="newName"
            size="large"
            autofocus
            autoselect
            @keyup.enter.native="rename" />
        </el-col>
        <el-col :span="18">
          <el-button size="large" type="primary" @click="rename">Save</el-button>
          <el-button size="large" @click="showRename = false">Cancel</el-button>
        </el-col>
      </el-row>
    </div>

    <h1 v-show="!showRename">{{ template.name }}</h1>

    <el-row>
      <router-link :to="{
        name: 'ruleconfigbuilder',
        params: { action: 'add' }, query: { prefill: id, prefillType: 'template' }
      }">
        <el-button icon="el-icon-plus" plain type="primary">
          Create rule from template
        </el-button>
      </router-link>

      <router-link :to="{
        name: 'templateconfigbuilder',
        params: { action: 'edit', path: id } }">
        <el-button type="primary" icon="el-icon-edit" plain>Edit</el-button>
      </router-link>

      <el-button plain type="info" @click="showRenameInput">Rename</el-button>

      <el-button plain type="info" @click="duplicate">Duplicate</el-button>

      <el-button plain type="info" @click="showMoveDialog">Move</el-button>

      <el-button icon="el-icon-delete" plain type="danger" @click="showDeleteConfirm">
        Delete...
      </el-button>
    </el-row>

    <el-dialog
      :visible.sync="moveVisible"
      title="Move"
      width="40%"
      @close="moveVisible = false">
      <div>
        <FolderTree v-model="moveDest" type="templates" />
      </div>
      <span slot="footer">
        <el-button @click="moveVisible = false">Cancel</el-button>
        <el-button type="primary" @click="move">Move template</el-button>
      </span>
    </el-dialog>

    <ConfigView :config="template" type="template" />
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  props: ['id'],
  data() {
    return {
      moveVisible: false,
      moveDest: '',
      showRename: false,
      newName: ''
    };
  },
  computed: {
    template() {
      return this.$store.state.configs.templates[this.id] || {};
    }
  },
  async mounted() {
    await this.$store.dispatch('configs/fetchConfig', { path: this.id, type: 'templates' });
    this.newName = this.template.name;
  },
  methods: {
    //
    // Move
    //

    async move() {
      let newPath = await this.$store.dispatch('configs/moveConfig', {
        oldConfig: this.template,
        newPath: this.moveDest.replace(/_templates/, ''),
        type: 'templates'
      });

      // This action returns the new path, so if it does (will return falsey if not)
      // then route to it.
      if (newPath) {
        this.$router.replace(`/templates/${newPath}?refreshTree`);
      } else {
        this.$message.warning(
          'Could not move the template. Perhaps a rule with the same name already exists at this location?'
        );
      }
    },

    showMoveDialog() {
      this.moveDest = '';
      this.moveVisible = true;
    },

    //
    // Rename
    //

    async rename() {
      let res = await this.$store.dispatch('configs/renameConfig', {
        config: this.template,
        newName: this.newName.trim(),
        type: 'templates'
      });

      // This action will return the new name back at us if it worked
      if (res) {
        this.$router.replace(`/templates/${res}?refreshTree`);
      } else {
        this.$message.warning(
          'Could not rename the template. Perhaps a rule already exists with that name?'
        );
      }
    },

    showRenameInput() {
      this.showRename = true;
      Vue.nextTick(() => {
        this.$refs.rename.$el.querySelector('input').focus();
        this.$refs.rename.$el.querySelector('input').select();
      });
    },

    //
    // Duplicate
    //

    async duplicate() {
      let path = await this.$store.dispatch('configs/duplicateConfig', {
        config: this.template,
        type: 'templates'
      });

      // This action returns the path of the new template
      if (path) {
        this.$router.replace(`/templates/${path}?refreshTree`);
      } else {
        this.$message.warning('Could not duplicate the template.');
      }
    },

    //
    // Delete
    //

    showDeleteConfirm() {
      this.$confirm('Are you sure you want to delete this template?', 'Confirm', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(this.delete)
        .catch(() => {});
    },

    async delete() {
      let deleted = await this.$store.dispatch('configs/deleteConfig', {
        path: this.id,
        type: 'templates'
      });

      // This action will return true/false depending on if the delete worked
      if (deleted) {
        this.$message({
          type: 'success',
          message: 'Template deleted'
        });
        this.$router.push('/templates?refreshTree');
      } else {
        this.$message.warning('Could not delete the template.');
      }
    }
  }
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
</style>
