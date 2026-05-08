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

<script>
import axios from 'axios';
import semver from 'semver';
import packageData from '@/../package.json';

export default {
  data() {
    return {
      currentVersion: packageData.version,
      latestRelease: null
    };
  },

  computed: {
    updateAvailable() {
      const tag = this.latestRelease?.tag_name;
      if (!tag) return false;
      return semver.lt(this.currentVersion, tag);
    }
  },

  async mounted() {
    if (import.meta.env.DEV && sessionStorage.getItem('latestRelease')) {
      this.latestRelease = JSON.parse(sessionStorage.getItem('latestRelease')) || {};
    } else {
      try {
        let res = await axios.get('/api-app/releases');
        this.latestRelease = res?.data?.[0] || {};
        sessionStorage.setItem('latestRelease', JSON.stringify(this.latestRelease));
      } catch (error) {
        this.latestRelease = {};
      }
    }
  }
};
</script>

<style>
.el-tag a {
  text-decoration: none;
  color: #157ce7;
}
</style>
