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
  // props: [
  //   'value',
  //   'label',
  //   'prop',
  //   'required',
  //   'labelWidth',
  //   'rules',
  //   'error',
  //   'showMessage',
  //   'inlineMessage',
  //   'size'
  // ],
  props: {
    value: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    prop: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: () => []
    },
    error: {
      type: String,
      default: ''
    },
    showMessage: {
      type: Boolean,
      default: true
    },
    inlineMessage: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: ''
    }
  },
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
