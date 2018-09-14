<template>
  <el-form ref="form" :model="form" label-position="top" @submit.native.prevent>
    <el-form-item label="Name" prop="name" required>
      <el-input ref="name" :disabled="mode === 'edit'" v-model="form.name" spellcheck="false" />
    </el-form-item>

    <el-form-item label="Index" prop="index" required>
      <el-input v-model="form.index" spellcheck="false" />
    </el-form-item>

    <el-form-item label="use_strftime_index">
      <el-switch v-model="form.use_strftime_index" />
    </el-form-item>

    <el-form-item label="Type" prop="type" required>
      <el-input v-model="form.type" />
    </el-form-item>

    <el-form-item label="Re-alert minutes">
      <el-input-number v-model="form.realert.minutes" />
      <label v-if="form.realert.minutes === 0">
        WARNING: When re-alert is set to 0 minutes, you will receive an alert
        every single time this rule triggers. This may result in large bursts
        of notifications.
      </label>
      <label v-else>
        You will receive, at most, one alert every
        {{ form.realert.minutes }} minute(s), even if a rule
        triggers multiple times within that timeframe.
      </label>
    </el-form-item>
  </el-form>
</template>

<script>
import Vue from 'vue';

export default {
  props: ['mode'],
  computed: {
    form() {
      return this.$store.state.editor.config;
    }
  },
  async mounted() {
    Vue.nextTick(() => {
      this.$refs.name.$el.querySelector('input').focus();
      Vue.nextTick(() => {
        this.$refs.name.$el.querySelector('input').select();
      });
    });
  }
};
</script>
