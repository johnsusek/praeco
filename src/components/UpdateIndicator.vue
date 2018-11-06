<template>
  <span>
    <el-tag v-if="updateAvailable" type="info">
      <a href="https://github.com/ServerCentral/praeco/releases" target="_blank">
        Update available
      </a>
    </el-tag>
    <el-tag type="info" class="m-w-xs">praeco {{ currentVersion }}</el-tag>
  </span>
</template>

<script>
import axios from 'axios';
import semver from 'semver';
import currentVersion from '@/../version.json';

export default {
  data() {
    return {
      currentVersion,
      latestRelease: {}
    };
  },

  computed: {
    updateAvailable() {
      if (!this.latestRelease.tag_name) return false;
      return semver.lt(this.currentVersion, this.latestRelease.tag_name);
    }
  },

  async mounted() {
    if (process.env.NODE_ENV === 'development' && sessionStorage.getItem('latestRelease')) {
      this.latestRelease = JSON.parse(sessionStorage.getItem('latestRelease'));
    } else {
      try {
        let res = await axios.get('/api-app/releases');
        if (res && res.data) {
          this.latestRelease = res.data[0];
          sessionStorage.setItem('latestRelease', JSON.stringify(this.latestRelease));
        }
      } catch (error) {}
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
