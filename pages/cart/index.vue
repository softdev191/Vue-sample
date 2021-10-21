<template>
  <div class="fixed-container">
    <CartHeader />
    <div class="cart-body">
      <div class="cart-section">
        <ErrorBox v-if="error" :title="errorTitle">
          {{ errorMessage }}
        </ErrorBox>
        <div class="full-divider sp-only"></div>
        <ProductListSection />

        <div class="full-divider pc-only"></div>
        <CouponSection :use-coupon-ids="useCouponIds" />

        <div class="full-divider"></div>
        <OrderSection />
        <p v-if="isReserved" class="text">
          こちらの商品は「予約商品」となっています。お届け予定は、変動する場合があります。予めご了承頂いた上で、購入手続きの方にすすんでください。
        </p>
        <p v-if="isBackOrdered" class="text">
          こちらの商品は「お取り寄せ商品」です。<br />
          以下の内容を予めご了承の上、購入手続きにお進みください。<br />
          ・注文取消し・返品・交換は対象外です。<br />
          ・取り寄せ後の発送の為、通常よりもお届けにお時間がかかる場合がございます。<br />
          ・配達指定は希望時間帯のみとなります。<br />
        </p>
      </div>
      <PaymentSection />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ErrorBox from "@/components/atoms/ErrorBox";
import CartHeader from "@/components/pages/cart/CartHeader.vue";
import ProductListSection from "@/components/pages/cart/ProductListSection.vue";
import CouponSection from "@/components/pages/cart/CouponSection.vue";
import OrderSection from "@/components/pages/cart/OrderSection.vue";
import PaymentSection from "@/components/pages/cart/PaymentSection.vue";

export default {
  components: {
    ErrorBox,
    CartHeader,
    ProductListSection,
    CouponSection,
    OrderSection,
    PaymentSection,
  },
  async fetch() {
    await Promise.all([
      this.$auth.fetchUser().catch(() => {}),
      this.$store.dispatch("master/fetch"),
      this.$store.dispatch("cart/fetch", { params: { delete_expired: 1 } }),
    ]);
  },
  data() {
    return {
      localError: null,
    };
  },
  computed: {
    ...mapGetters({
      isReserved: "cart/isReserved",
      isBackOrdered: "cart/isBackOrdered",
      availableCoupons: "cart/availableCoupons",
      useCouponIds: "cart/useCouponIds",
    }),
    lastError() {
      return this.$store.getters.sessionData.lastError;
    },
    errorMessage() {
      return (this.error || {}).message || "";
    },
    errorTitle() {
      return (this.error || {}).title || "エラーが発生しました。";
    },
    error() {
      return this.lastError || this.localError;
    },
  },
  created() {
    this.$store.commit("order/resetAll");
    this.localError = this.$cookies.get("lastError");
    this.$cookies.remove("lastError");
  },
  beforeDestroy() {
    this.$store.commit("clearSessionData", "lastError");
  },
  methods: {
    handleError(error) {
      this.localError = error;
    },
  },
};
</script>

<style lang="scss" scoped>
.cart-body {
  @include desktop {
    display: flex;
    align-items: flex-start;
  }
  .cart-section {
    @include desktop {
      flex: 1;
    }
  }
  .payment-section {
    @include desktop {
      width: 230px;
      margin-left: 50px;
      background-color: #f6f6f6;
      padding: 30px 15px;
    }
  }
}
.dropdown-section {
  .dropdown-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    line-height: 1;
    padding: 16px 0;
    .angle-down {
      transition-duration: 0.3s;
    }
  }
  .dropdown-section-content {
    transition: 150ms ease-out;
    .dropdown-section-content-inner {
      transition: 150ms ease-out;
    }
  }
}
.form-text {
  font-size: 10px;
  margin-top: 10px;
}
.text {
  margin-top: 15px;
  font-size: 10px;
  line-height: 1.6;
}
.error-box {
  margin-top: 0;
  margin-bottom: 20px;
}
</style>
