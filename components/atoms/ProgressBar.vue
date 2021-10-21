<template>
  <div class="progress-bar-component">
    <div class="progress-bar" :style="{ width: `${percentage}%` }"></div>
  </div>
</template>

<script>
export default {
  props: {
    percentage: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss" scoped>
.progress-bar-component {
  position: relative;
  width: 100%;
  height: 6px;
  background-color: $gray;
  .progress-bar {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background-color: #6c6c6c;
  }
}
</style>
