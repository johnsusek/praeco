<template>
  <el-form-item
    v-show="!(value && hidePreconfiguredFields.includes(prop)) || type === 'template'"
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
      return this.$store.state.appconfig.config.hidePreconfiguredFields || [];
    },
    type() {
      return this.$route.meta.type;
    }
  }
};
</script>
