<template>
  <div class="success-box">
    <div class="success-title">
      {{ title }}
    </div>
    <div class="success-text">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "成功しました。",
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.success-box {
  border: 1px solid $success;
  margin-top: 20px;
  .success-title {
    color: $white;
    font-size: 10px;
    background-color: $success;
    padding: 5px 7px;
  }
  .success-text {
    color: $black;
    font-size: 10px;
    background-color: $white;
    padding: 7px;
  }
}
</style>
