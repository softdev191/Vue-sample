<template>
  <div class="order-header">
    <Cart class="cart" :payment-type="paymentType" />
    <div class="progress-bar-wrapper">
      <span class="progress-bar-label">購入完了まで</span>
      <ProgressBar :percentage="progressPercentage" class="progress-bar" />
    </div>
  </div>
</template>

<script>
import Cart from "@/components/atoms/Cart";
import ProgressBar from "@/components/atoms/ProgressBar";

export default {
  components: {
    Cart,
    ProgressBar,
  },
  props: {
    progressPercentage: {
      type: Number,
      default: 0,
    },
    paymentType: {
      type: Number,
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped>
.cart {
  margin-bottom: 25px;
}
.progress-bar-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .progress-bar-label {
    font-size: 10px;
    margin-right: 10px;
  }
  .progress-bar {
    flex: 1;
  }
}
</style>
