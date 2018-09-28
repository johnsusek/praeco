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
        params: { action: 'edit', template: id } }">
        <el-button icon="el-icon-edit" plain type="info">Edit</el-button>
      </router-link>

      <el-button plain type="info" @click="duplicate">Duplicate</el-button>

      <el-button plain type="info" @click="showRenameInput">Rename</el-button>

      <el-button icon="el-icon-delete" plain type="danger" @click="handleDelete">
        Delete...
      </el-button>
    </el-row>

    <ConfigView :config="template" />
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  props: ['id'],
  data() {
    return {
      showRename: false,
      newName: ''
    };
  },
  computed: {
    template() {
      return this.$store.state.templates.templates[this.id] || {};
    }
  },
  async mounted() {
    await this.$store.dispatch('templates/fetchTemplate', this.id);
    this.newName = this.template.name;
  },
  methods: {
    showRenameInput() {
      this.showRename = true;
      Vue.nextTick(() => {
        this.$refs.rename.$el.querySelector('input').focus();
        this.$refs.rename.$el.querySelector('input').select();
      });
    },
    async rename() {
      let res = await this.$store.dispatch('templates/renameTemplate', {
        oldName: this.template.name,
        newName: this.newName.trim()
      });
      if (res) {
        this.$router.replace(`/templates/${res}`);
      }
    },
    async duplicate() {
      let res = await this.$store.dispatch('templates/duplicateTemplate', {
        name: this.template.name
      });
      if (res) {
        this.$router.replace(`/templates/${res}`);
      }
    },
    handleDelete() {
      this.$confirm('Are you sure you want to delete this template?', 'Confirm', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async () => {
          let deleted = await this.$store.dispatch('templates/deleteTemplate', this.id);
          if (deleted) {
            this.$message({
              type: 'success',
              message: 'Template deleted'
            });
            this.$router.push({ name: 'templates' });
          }
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
</style>

