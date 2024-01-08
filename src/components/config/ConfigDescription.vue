<template>
  <el-row :gutter="19">
    <el-col :span="19">
      <el-form-item label="Description">
        <el-switch
          :value="useDescription"
          :disabled="viewOnly"
          @change="changeUseDescription" />
        <label>
          text describing the purpose of rule.
          (Optional, string, default empty string) Can be referenced in custom alerters
          to provide context as to why a rule might trigger.
        </label>
      </el-form-item>
    </el-col>

    <el-col v-if="useDescription" :span="19">
      <el-form-item label="Description" prop="configDescription" required>
        <el-input id="configDescription" :value="configDescription" :disabled="viewOnly" @input="configDescription = $event" />
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ['viewOnly'],

  computed: {
    useDescription: {
      get() {
        return this.$store.state.config.alert.useDescription;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_USE_DESCRIPTION', value);
      }
    },

    configDescription: {
      get() {
        return this.$store.state.config.alert.configDescription;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_DESCRIPTION', value);
      }
    },
  },

  mounted() {
    if (this.configDescription) {
      this.useDescription = true;
    }
  },

  methods: {
    changeUseDescription(val) {
      this.useDescription = val;
    },
  }
};
</script>
