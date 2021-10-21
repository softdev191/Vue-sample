<template>
  <div class="page-title">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.page-title {
  font-size: 14px;
  font-weight: 600;
  margin: 25px 0 30px;
  @include desktop {
    margin-top: 0;
  }
  &.center {
    text-align: center;
  }
}
</style>
