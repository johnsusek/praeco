<template>
  <div>
    <el-form-item label="Token" prop="yzjToken" required>
      <el-input id="yzjToken" :value="yzjToken" :disabled="viewOnly" @input="yzjToken = $event" />
      <label>
        The YZJ custom net location, include domain name and port, like: www.xxxx.com:80.
      </label>
    </el-form-item>

    <el-form-item label="Proxy" prop="yzjProxy">
      <el-input id="yzjProxy" :value="yzjProxy" :disabled="viewOnly" @input="yzjProxy = $event" />
      <label>
        By default ElastAlert 2 will not use a network proxy to send notifications to YZJ.
        Set this option using hostname:port if you need to use a proxy. only supports https.
      </label>
    </el-form-item>

    <el-form-item label="CustomLoc" prop="yzjCustomLoc">
      <el-input id="yzjCustomLoc" :value="yzjCustomLoc" :disabled="viewOnly" @input="yzjCustomLoc = $event" />
      <label>
        The YZJ custom net location, include domain name and port, like: www.xxxx.com:80.
      </label>
    </el-form-item>
  </div>
</template>

<script>
export default {
  components: {
  },

  props: ['viewOnly'],
  emits: ['validate'],

  data() {
    return {
    };
  },
  computed: {
    yzjToken: {
      get() {
        return this.$store.state.config.alert.yzjToken;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_YZJ_TOKEN', value);
      }
    },
    yzjProxy: {
      get() {
        return this.$store.state.config.alert.yzjProxy;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_YZJ_PROXY', value);
      }
    },
    yzjCustomLoc: {
      get() {
        return this.$store.state.config.alert.yzjCustomLoc;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_YZJ_CUSTOM_LOC', value);
      }
    }
  },

  methods: {
  }
};
</script>

<style lang="scss" scoped>
</style>
