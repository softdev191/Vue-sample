<template>
  <span class="required-mrk medium"><slot /></span>
</template>

<script>
export default {
  name: "Astarisk",
};
</script>

<style lang="scss" scoped>
.required-mrk {
  &.medium {
    color: #000;

    &::before {
      font-size: 18px !important;
    }
  }
}
</style>
