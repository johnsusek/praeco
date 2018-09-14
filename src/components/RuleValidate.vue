<template>
  <div>
    <el-button type="info" @click="handleTest">Validate</el-button>
    <br><br>
    <div v-if="testLoading">Validating...</div>

    <el-alert
      v-if="test && !test.success"
      :closable="false"
      type="error"
      title=""
      show-icon>
      Rule is not valid
    </el-alert>

    <div v-if="test && test.success">
      <el-alert
        :closable="false"
        type="success"
        title=""
        show-icon>
        Rule is valid
      </el-alert>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      testLoading: false
    };
  },
  computed: {
    test() {
      return this.$store.state.editor.test;
    }
  },
  methods: {
    async handleTest() {
      this.testLoading = true;
      await this.$store.dispatch('editor/testRule');
      this.testLoading = false;
    }
  }
};
</script>
