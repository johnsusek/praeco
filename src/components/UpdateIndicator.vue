<template>
  <span>
    <el-tag v-if="updateAvailable" type="info">
      <a href="https://github.com/johnsusek/praeco/releases" target="_blank" rel="noopener noreferrer">
        Update available
      </a>
    </el-tag>
    <el-tag type="info" class="m-w-xs">praeco {{ currentVersion }}</el-tag>
  </span>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import semver from 'semver';
import packageData from '@/../package.json';

const currentVersion = ref(packageData.version);
const latestRelease = ref({});

const updateAvailable = computed(() => {
  if (!latestRelease.value.tag_name) return false;
  return semver.lt(currentVersion.value, latestRelease.value.tag_name);
});

onMounted(async () => {
  if (import.meta.env.DEV && sessionStorage.getItem('latestRelease')) {
    latestRelease.value = JSON.parse(sessionStorage.getItem('latestRelease'));
  } else {
    try {
      let res = await axios.get('/api-app/releases');
      if (res && res.data) {
        latestRelease.value = res.data[0];
        sessionStorage.setItem('latestRelease', JSON.stringify(latestRelease.value));
      }
    } catch (error) {}
  }
});
</script>

<style>
.el-tag a {
  text-decoration: none;
  color: #157ce7;
}
</style>
