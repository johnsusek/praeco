<template>
  <el-row :gutter="19">
    <el-col :span="19">
      <el-form-item label="buffer_time">
        <el-switch
          :value="useBufferTime"
          :disabled="viewOnly"
          @change="changeUseBufferTime" />
        <label>buffer_time Setting.</label>
      </el-form-item>
    </el-col>

    <el-col v-if="useBufferTime" :span="6">
      <el-form-item :class="{ 'view-only': viewOnly }" label="buffer_time">
        <ElastalertTimeView v-if="viewOnly" :time="bufferTimeLocal" />
        <ElastalertTimePicker
          v-else-if="bufferTimeLocal"
          id="bufferTimeLocal"
          :allow-zero="true"
          :unit="Object.keys(bufferTimeLocal)[0]"
          :amount="Object.values(bufferTimeLocal)[0]"
          @input="updateBufferTime" />
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
    useBufferTime: {
      get() {
        return this.$store.state.config.alert.useBufferTime;
      },
      set(value) {
        this.$store.commit('config/alert/USE_BUFFER_TIME', value);
      }
    },

    bufferTimeLocal: {
      get() {
        return this.$store.state.config.alert.bufferTimeLocal || { minutes: 1 };
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_BUFFER_TIME', value);
      }
    },
  },

  mounted() {
    if (this.$store.state.config.alert.bufferTimeLocal) {
      this.useBufferTime = true;
    }
  },

  methods: {
    changeUseBufferTime(value) {
      this.useBufferTime = value;
    },

    updateBufferTime(value) {
      this.bufferTimeLocal = {};
      this.$set(this.bufferTimeLocal, Object.keys(value)[0], Object.values(value)[0]);
    },
  }
};
</script>
