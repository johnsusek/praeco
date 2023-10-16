<template>
  <div>
    <el-col :span="enableLimitExcecution ? 6 : 24">
      <el-form-item label="Limit Excecution">
        <el-switch
          id="enableLimitExcecution"
          v-model="enableLimitExcecution"
          :disabled="viewOnly"
          @change="changeLimitExcecution" />
        <label>Limit Excecution Setting.</label>
      </el-form-item>
    </el-col>

    <el-col v-if="enableLimitExcecution" :span="20">
      <el-form-item label="" prop="limitExcecution">
        <div v-if="!viewOnly" class="limit-excecution">
          <div class="getting-started-light">
            <cron-light v-model="limitExcecution" @error="error = $event" />
            <div class="mt-2 grey--text text--darken-1">
              cron expression: {{ limitExcecution }}
            </div>
          </div>
        </div>
        <div v-else>
          cron expression: {{ limitExcecution }}
        </div>
      </el-form-item>
    </el-col>
  </div>
</template>

<script>
export default {

  props: {
    viewOnly: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
      enableLimitExcecution: false,
      error: ''
    };
  },

  computed: {
    limitExcecution: {
      get() {
        return this.$store.state.config.alert.limitExcecution;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_LIMIT_EXCECUTION', value);
      }
    }
  },

  mounted() {
    if (this.limitExcecution) {
      this.enableLimitExcecution = true;
    }
  },

  methods: {
    changeLimitExcecution(val) {
      if (val) {
        this.enableLimitExcecution = true;
      } else {
        this.enableLimitExcecution = false;
        this.limitExcecution = '';
      }
    }
  }
};
</script>
