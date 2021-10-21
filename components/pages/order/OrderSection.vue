<template>
  <section class="order-section">
    <div class="order-section-title">{{ title }}</div>
    <div class="order-section-content">
      <slot />
    </div>
  </section>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.order-section {
  padding: 50px 0;
  @include desktop {
    padding: 0;
    margin-bottom: 30px;
  }
  &.bg {
    position: relative;
    @include touch {
      &::before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        height: 100%;
        left: 0;
        right: 100vw;
        background-color: #f6f6f6;
      }
    }
  }
  .order-section-title {
    font-size: 14px;
    border-bottom: 1px solid $black;
    margin: 0 -5px 20px;
    padding: 0 5px;
    @include desktop {
      margin-left: 0;
      margin-right: 0;
    }
  }
}
.edit-button-row {
  text-align: right;
  .btn {
    margin-top: 10px;
    &.sm {
      display: inline-block;
      font-size: 10px;
      line-height: 10px;
      width: 100px;
      padding: 10px;
    }
    &.edit {
      color: $black;
      background-color: #dbdbdb;
      border: 1px solid $black;
    }
  }
}
</style>
