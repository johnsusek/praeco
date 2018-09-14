<template>
  <el-form ref="form" :model="form" label-position="top" @submit.native.prevent>
    <el-form-item label="Query" prop="filter[0].query.query_string.query" required>
      <el-input v-model="form.filter[0].query.query_string.query" spellcheck="false" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  computed: {
    form() {
      return this.$store.state.editor.config;
    }
  }
};
</script>
