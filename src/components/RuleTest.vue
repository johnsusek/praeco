<template>
  <div>
    <el-button type="info" @click="handleTest">Test</el-button>

    <div v-if="testLoading">Loading...</div>

    <div v-if="test && test.success">
      <h2>Results</h2>

      <el-alert
        :closable="false"
        type="info"
        title=""
        show-icon>
        This rule will have triggered
        <strong>{{ test.hits }}</strong> time(s)
        over the last day.
      </el-alert>

      <el-alert
        v-if="realert.minutes > 0"
        :closable="false"
        type="info"
        title=""
        show-icon>
        This rule will alert at most once every {{ realert.minutes }} minute(s).
      </el-alert>

      <el-alert
        v-if="test.hits > 20 && realert.minutes === 0"
        :closable="false"
        type="warning"
        title=""
        show-icon>
        This rule will result in a
        <strong>large number of alerts</strong>
        per day.
      </el-alert>

      <h2>Preview</h2>

      <el-table v-if="testResults[0]" :data="Object.entries(testResults[0]).sort()">
        <el-table-column label="Term" prop="0" width="200" />
        <el-table-column label="Value" prop="1" />
      </el-table>

      <h2>Terms</h2>

      <el-card v-if="testTerms" shadow="never">
        This rule provides the following terms for your alerts: <br>
        <el-tag v-for="term in testTerms" :key="term" size="mini" type="info">{{ term }}</el-tag>
        <br><br>
        Place terms into your alert by typing '#' followed by the term name.
      </el-card>
    </div>

    <div v-if="test && !test.success">
      <br>
      <el-alert
        :closable="false"
        type="error"
        title=""
        show-icon>
        Test failed, please make sure all required fields are filled.
        <el-button type="danger" @click="dialogVisible = true">View error</el-button>
      </el-alert>

      <el-dialog
        :visible.sync="dialogVisible"
        top="1vh"
        title="elastalert error"
        width="90%">
        <pre>{{ $store.state.editor.test.error }}</pre>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">Close</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      testLoading: false,
      dialogVisible: false
    };
  },
  computed: {
    realert() {
      return this.$store.state.editor.config.realert;
    },
    test() {
      return this.$store.state.editor.test;
    },
    testTerms() {
      if (!this.test || !this.test.terms) {
        return [];
      }
      return this.test.terms.slice(0).sort();
    },
    testResults() {
      return this.test.results.map(r => r._source);
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
