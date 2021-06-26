<template>
  <el-row :gutter="19">
    <el-col :span="usePriority ? 6 : 19">
      <el-form-item label="Priority">
        <el-switch
          v-model="usePriority"
          :disabled="viewOnly"
          @change="changePriority" />
        <label>
          This value will be used to identify the relative priority of the alert.
          Optionally, this field can be included in any alert type (e.g. for use in email subject/body text).
        </label>
      </el-form-item>
    </el-col>

    <el-col v-if="usePriority" :span="6">
      <el-form-item label="Priority" prop="configPriority" required>
        <el-input-number id="configPriority" v-model="configPriority" :disabled="viewOnly" />
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ['viewOnly'],

  data() {
    return {};
  },

  computed: {
    usePriority: {
      get() {
        return this.$store.state.config.alert.usePriority;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_USE_PRIORITY', value);
      }
    },

    configPriority: {
      get() {
        return this.$store.state.config.alert.configPriority;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_PRIORITY', value);
      }
    },
  },

  mounted() {
    if (this.configPriority) {
      this.usePriority = true;
    }
  },

  methods: {
    changePriority(val) {
      if (val) {
        this.usePriority = true;
      } else {
        this.usePriority = false;
      }
    },
  }
};
</script>
