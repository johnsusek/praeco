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
          <VueCronEditorBuefy v-model="limitExcecution" /><br>
          {{ limitExcecution }}
        </div>
        <div v-else>
          {{ limitExcecution }}
        </div>
      </el-form-item>
    </el-col>
  </div>
</template>

<script>
import VueCronEditorBuefy from 'vue-cron-editor-buefy';

export default {
  components: {
    VueCronEditorBuefy
  },

  props: ['viewOnly'],

  data() {
    return {
      enableLimitExcecution: false,
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
