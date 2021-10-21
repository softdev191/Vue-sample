<template>
  <div class="cart-header">
    <p class="count-row">
      <span class="count-label">カートの中身</span>
      計
      <span class="product-count">{{ productCount }}</span>
      点
    </p>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      productCount(state, getters) {
        return getters["cart/productCount"];
      },
    }),
  },
};
</script>

<style lang="scss" scoped>
.cart-header {
  text-align: center;
  padding: 23px 0;
  .count-row {
    font-size: 14px;
    font-weight: 600;
    .count-label {
      font-size: 10px;
      font-weight: 500;
      margin-right: 12px;
    }
    .product-count {
      font-size: 18px;
      font-weight: 600;
    }
  }
}
</style>
