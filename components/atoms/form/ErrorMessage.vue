<template>
  <small class="error">※ <slot /></small>
</template>

<script>
export default {
  name: "ErrorMessage",
};
</script>

<style lang="scss" scoped>
.error {
  display: block;
  color: $error;
}
</style>
