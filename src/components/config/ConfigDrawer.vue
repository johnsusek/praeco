<template>
  <div>
    <ESChart
      v-if="$store.getters['config/query/queryString']"
      :timeframe="{ hours: 24 }"
      :bucket="bucket"
      :mark-line="$store.getters['config/match/markLine']"
      :spike-height="$store.state.config.match.spikeHeight"
      :query="$store.getters['config/query/queryString']"
      :index="$store.state.config.settings.index" />
  </div>
</template>

<script>
export default {
  computed: {
    bucket() {
      let timeframe = this.$store.state.config.match.timeframe;
      if (Object.keys(timeframe).length) {
        return timeframe;
      }
      return { minutes: 10 };
    }
  }
};
</script>

<style>
</style>
