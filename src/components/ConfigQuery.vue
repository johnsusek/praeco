<template>
  <el-form ref="form" :model="config" label-position="top" @submit.native.prevent>
    <el-form-item label="Query" prop="filter[0].query.query_string.query" required>
      <el-input v-model="config.filter[0].query.query_string.query" spellcheck="false" />
    </el-form-item>

    <el-button plain type="info" @click="$emit('preview', config)">Preview</el-button>
  </el-form>
</template>

<script>
export default {
  props: ['prefill'],
  data() {
    return {
      config: {
        filter: [
          {
            query: {
              query_string: {
                query: ''
              }
            }
          }
        ]
      }
    };
  },
  watch: {
    prefill() {
      this.config = this.prefill;
    }
  },
  methods: {
    async validate() {
      try {
        await this.$refs.form.validate();
        return this.config;
      } catch (error) {
        return false;
      }
    }
  }
};
</script>
