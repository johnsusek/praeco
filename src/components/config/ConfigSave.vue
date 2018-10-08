<template>
  <div>
    <br>
    <ConfigViewSettings :config="config" />
    <ConfigViewQuery :config="config" />
    <ConfigViewMatch :config="config" />
    <ConfigViewAlert :config="config" />
  </div>
</template>

<script>
export default {
  props: ['config']
};
</script>
