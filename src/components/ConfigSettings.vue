<template>
  <el-form ref="form" :rules="rules" :model="config" label-position="top" @submit.native.prevent>
    <el-form-item label="Enabled" prop="is_enabled">
      <el-switch ref="is_enabled" v-model="config.is_enabled" />
    </el-form-item>

    <el-form-item v-if="action !== 'edit'" label="Name" prop="name" required>
      <el-input ref="name" v-model="config.name" spellcheck="false"/>
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
  props: ['prefill', 'prefillPath', 'prefillType', 'action', 'type'],

  data() {
    return {
      config: {},
      rules: {
        name: [{ validator: this.validateName }]
      }
    };
  },
  watch: {
    prefill() {
      this.config = this.prefill;
    }
  },
  methods: {
    validateName(rule, value, callback) {
      let path = this.prefillPath || '';

      // If the prefill type is template, and the type is rule, use root for prefillpath
      if (this.type === 'rule' && this.prefillType === 'template') {
        path = '';
      }

      path = path.split('/');
      path.pop();
      path.push(value);
      path = path.join('/');

      let configs = Object.keys(this.$store.state.configs[`${this.type}s`]);

      if (configs.includes(path)) {
        callback(new Error(`A ${this.type} by that name already exists`));
      } else {
        callback();
      }
    },

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
