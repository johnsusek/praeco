<template>
  <el-form-item
    v-show="!value || !hidePreconfiguredFields.includes(prop) || type === 'template'"
    :label="label"
    :prop="prop"
    :required="required"
    :label-width="labelWidth"
    :rules="rules"
    :error="error"
    :show-message="showMessage"
    :inline-message="inlineMessage"
    :size="size">
    <slot />
  </el-form-item>
</template>

<script>
import config from '../../praeco.config.js';

export default {
  props: [
    'value',
    'label',
    'prop',
    'required',
    'labelWidth',
    'rules',
    'error',
    'showMessage',
    'inlineMessage',
    'size'
  ],
  computed: {
    hidePreconfiguredFields() {
      return config.hidePreconfiguredFields;
    },
    type() {
      return this.$route.meta.type;
    }
  }
};
</script>
