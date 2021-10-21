<template>
  <div class="error-box">
    <div class="error-title">
      {{ title }}
    </div>
    <div class="error-text">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "もう一度お試しください",
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.error-box {
  border: 1px solid $error;
  margin-top: 20px;
  .error-title {
    color: $white;
    font-size: 10px;
    background-color: $error;
    padding: 5px 7px;
  }
  .error-text {
    color: $black;
    font-size: 10px;
    background-color: $white;
    padding: 7px;
  }
}
</style>
