<template>
  <div>
    <el-form-item label="Token" prop="yzjToken" required>
      <el-input v-model="yzjToken" :disabled="viewOnly" />
      <label>
        The YZJ custom net location, include domain name and port, like: www.xxxx.com:80.
      </label>
    </el-form-item>

    <el-form-item label="Proxy" prop="yzjProxy">
      <el-input v-model="yzjProxy" :disabled="viewOnly" />
      <label>
        By default ElastAlert 2 will not use a network proxy to send notifications to YZJ.
        Set this option using hostname:port if you need to use a proxy. only supports https.
      </label>
    </el-form-item>

    <el-form-item label="CustomLoc" prop="yzjCustomLoc">
      <el-input v-model="yzjCustomLoc" :disabled="viewOnly" />
      <label>
        The YZJ custom net location, include domain name and port, like: www.xxxx.com:80.
      </label>
    </el-form-item>
  </div>
</template>

<script setup>
import { useConfigAlertYzj } from '@/composables/config/alert/useConfigAlertYzj';

defineProps({
  viewOnly: Boolean
});

const {
  yzjToken,
  yzjProxy,
  yzjCustomLoc
} = useConfigAlertYzj();
</script>
