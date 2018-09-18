<template>
  <el-form ref="form" :model="config" label-position="top" @submit.native.prevent>
    <el-form-item label="Enabled" prop="is_enabled">
      <el-switch ref="is_enabled" v-model="config.is_enabled" />
    </el-form-item>

    <el-form-item label="Name" prop="name" required>
      <el-input ref="name" v-model="config.name" :disabled="action === 'edit'" spellcheck="false"/>
    </el-form-item>

    <el-form-item label="Description" prop="description">
      <el-input ref="description" v-model="config.description" spellcheck="false" />
    </el-form-item>

    <el-form-item label="Index" prop="index" required>
      <el-input v-model="config.index" spellcheck="false" />
      <label>
        The index to use, e.g. logstash-* or logstash-%Y.%m.%d
        [<a href="https://elastalert.readthedocs.io/en/latest/ruletypes.html#index" target="_blank">?</a>]
      </label>
    </el-form-item>

    <el-form-item label="Use formatted date">
      <el-switch v-model="config.use_strftime_index" />
      <label>
        Use formatted date for index, when using an index like logstash-%Y.%m.%d
        [<a href="https://elastalert.readthedocs.io/en/latest/ruletypes.html#use-strftime-index" target="_blank">?</a>]
      </label>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: ['prefill', 'action'],
  data() {
    return {
      config: {}
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
