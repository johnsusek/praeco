<template>
  <el-row :gutter="19">
    <el-col :span="useOwner ? 6 : 19">
      <el-form-item label="Owner">
        <el-switch
          v-model="useOwner"
          :disabled="viewOnly"
          @change="changeOwner" />
        <label>
          This value will be used to identify the stakeholder of the alert.
          Optionally, this field can be included in any alert type. (Optional, string)
        </label>
      </el-form-item>
    </el-col>

    <el-col v-if="useOwner" :span="6">
      <el-form-item label="Owner" prop="configOwner" required>
        <el-input id="configOwner" v-model="configOwner" :disabled="viewOnly" />
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
    useOwner: {
      get() {
        return this.$store.state.config.alert.useOwner;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_USE_OWNER', value);
      }
    },

    configOwner: {
      get() {
        return this.$store.state.config.alert.configOwner;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_OWNER', value);
      }
    },
  },

  mounted() {
    if (this.configOwner) {
      this.useOwner = true;
    }
  },

  methods: {
    changeOwner(val) {
      if (val) {
        this.useOwner = true;
      } else {
        this.useOwner = false;
      }
    },
  }
};
</script>
