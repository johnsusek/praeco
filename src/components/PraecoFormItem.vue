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

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

defineProps([
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
]);

const store = useStore();
const route = useRoute();

const hidePreconfiguredFields = computed(() => {
  return store.state.appconfig.config.hidePreconfiguredFields || [];
});

const type = computed(() => {
  return route.meta.type;
});
</script>
