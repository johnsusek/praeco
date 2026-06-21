<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-form-item label="disable_rules_on_error">
        <el-switch
          v-model="disableRulesOnError"
          :disabled="viewOnly" />
        <label>
          If true, disable the rule when ElastAlert encounters an error while processing it.
        </label>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from '@/composables/useStore';

defineProps({
  viewOnly: Boolean
});

const store = useStore();

const disableRulesOnError = computed({
  get: () => store.state.config.alert.disableRulesOnError,
  set: (value) => store.commit('config/alert/UPDATE_DISABLE_RULES_ON_ERROR', value)
});
</script>
