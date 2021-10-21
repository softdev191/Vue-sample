<template>
  <div class="breadcrumb-wrapper pc-only">
    <div class="breadcrumb">
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.breadcrumb-wrapper {
  margin: 30px 0 25px;
  .breadcrumb {
    font-size: 10px;
  }
}
</style>
