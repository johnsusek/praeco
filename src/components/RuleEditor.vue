<template>
  <div>
    <el-card header="Settings">
      <RuleSettings :mode="mode" />
    </el-card>

    <el-card header="Query">
      <RuleQuery />
    </el-card>

    <el-card v-if="showTest">
      <RuleTest />
    </el-card>

    <el-card v-if="showValidate">
      <RuleValidate />
    </el-card>

    <el-card v-if="showAlert && test.success" header="Alert">
      <RuleAlert />
    </el-card>

    <el-card v-if="test.success">
      <el-button type="primary" @click="$emit('save')">Save</el-button>
    </el-card>
  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty';
import RuleSettings from './RuleSettings.vue';
import RuleQuery from './RuleQuery.vue';
import RuleTest from './RuleTest.vue';
import RuleAlert from './RuleAlert.vue';
import RuleValidate from './RuleValidate.vue';

export default {
  components: {
    VueJsonPretty,
    RuleSettings,
    RuleQuery,
    RuleTest,
    RuleAlert,
    RuleValidate
  },
  props: ['mode', 'template', 'showValidate', 'showTest', 'showAlert'],
  computed: {
    test() {
      return this.$store.state.editor.test || {};
    }
  },
  async mounted() {
    this.$store.commit('editor/CLEAR_TEST_RESULT');
  }
};
</script>

<style scoped>
.el-card {
  margin: 20px 0;
}
</style>

