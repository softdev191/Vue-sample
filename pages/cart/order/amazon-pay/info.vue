<template>
  <OrderProcedureForm :amazon-pay-info="amazonPayInfo" :form-type="formType">
    <template
      #formSections="{
        inputs,
        handleUpdateDestination,
        handleUpdateTransportValidation,
        handleUpdatePaymentValidation,
        handleUpdatePointUsageValidation,
        handleUpdateMessageValidation,
      }"
    >
      <OrderClientSection />
      <AmazonPayAddressBookSection
        title="2. 配送先住所の選択"
        class="bg"
        @orderReferenceCreated="handleOrderReferenceCreated"
        @select="handleSelectAddressBook(handleUpdateDestination)"
        @error="handleErrorAddressBook(handleUpdateDestination)"
      />
      <OrderTransportSection
        :inputs="inputs.transport"
        @update:validation="handleUpdateTransportValidation"
      />
      <AmazonPayWalletSection
        title="4. お支払い方法の選択"
        class="bg"
        @orderReferenceCreated="handleOrderReferenceCreated"
        @select="handleSelectWallet(handleUpdatePaymentValidation)"
        @error="handleErrorWallet(handleUpdatePaymentValidation)"
      />
      <OrderPointUsageSection
        :inputs="inputs.pointUsage"
        @update:validation="handleUpdatePointUsageValidation"
      />
      <OrderMessageSection
        class="bg"
        :inputs="inputs.message"
        @update:validation="handleUpdateMessageValidation"
      />
    </template>
  </OrderProcedureForm>
</template>

<script>
import OrderClientSection from "@/components/pages/order/OrderClientSection";
import AmazonPayAddressBookSection from "@/components/pages/order/AmazonPayAddressBookSection";
import AmazonPayWalletSection from "@/components/pages/order/AmazonPayWalletSection";
import OrderTransportSection from "@/components/pages/order/OrderTransportSection";
import OrderPointUsageSection from "@/components/pages/order/OrderPointUsageSection";
import OrderMessageSection from "@/components/pages/order/OrderMessageSection";
import OrderProcedureForm, {
  FORM_TYPE_AMAZON_PAY,
} from "@/components/pages/order/OrderProcedureForm";

export default {
  components: {
    OrderClientSection,
    OrderPointUsageSection,
    OrderMessageSection,
    OrderTransportSection,
    AmazonPayAddressBookSection,
    AmazonPayWalletSection,
    OrderProcedureForm,
  },
  beforeRouteEnter(to, from, next) {
    if (
      !["cart-order-amazon-pay-callback", "cart-order-confirm"].includes(
        from.name
      )
    ) {
      return next(false);
    }

    next();
  },
  async fetch() {
    await Promise.all([
      this.$store.dispatch("master/fetch"),
      this.$store.dispatch("fetchUser"),
      this.$store.dispatch("destination/fetch"),
      this.$store.dispatch("point/fetch", this.$auth.user.id),
      this.$store.dispatch("cart/fetch"),
    ]);

    if (!this.$auth.user.is_amazon_linked) {
      this.$router.push("/404");
    }
  },
  middleware: "auth",
  data() {
    return {
      orderReference: null,
      formType: FORM_TYPE_AMAZON_PAY,
    };
  },
  computed: {
    amazonPayInfo() {
      if (!this.orderReference) {
        return {};
      }

      return {
        amazonOrderReferenceId: this.orderReference.getAmazonOrderReferenceId(),
        amazonAccessToken: this.$amazonPay.getAccessToken(),
      };
    },
  },
  methods: {
    handleOrderReferenceCreated(orderReference) {
      this.orderReference = orderReference;
    },
    handleSelectAddressBook(handler) {
      handler({ invalid: false });
    },
    handleSelectWallet(handler) {
      handler({ invalid: false });
    },
    handleErrorAddressBook(handler) {
      handler({ invalid: true });
    },
    handleErrorWallet(handler) {
      handler({ invalid: true });
    },
  },
};
</script>

<style lang="scss" scoped>
.order-section-wrapper {
  display: flex;
  padding: 50px 0;
  @include touch {
    padding: 30px 0;
  }
  .section-left {
    width: 180px;
    margin-right: 50px;
  }
  .section-main {
    flex: 1;
    width: 100%;
  }
  .section-right {
    width: 220px;
    margin-left: 50px;
  }
}
.section-top {
  text-align: right;
  padding: 25px 0 15px;
  border-bottom: 1px solid #aaa;
}
.base-table-wrapper {
  margin: 0 -5px;
  @include desktop {
    margin-left: 0;
    margin-right: 0;
  }
  .base-table-title {
    font-size: 14px;
    padding: 0 5px;
    &.fs10 {
      font-size: 10px;
      font-weight: 600;
    }
    &.flex {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .base-table {
    &.w120 {
      th {
        width: 120px;
      }
    }
  }
}
.order-info-wrapper {
  .order-info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    padding: 6px 0;
  }
  .order-sum-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 1;
    padding: 16px 0;
    .order-sum-label {
      .big {
        font-size: 14px;
      }
      .small {
        font-size: 10px;
      }
    }
    .order-sum-value {
      color: $error;
      font-size: 14px;
      font-weight: 600;
    }
  }
}
.product-list-wrapper {
  .product-list-title {
    font-size: 14px;
    margin: 20px 0 10px;
  }
  .product-list {
    > .product-list-item {
      .product-item {
        display: flex;
        margin-bottom: 10px;
        > .product-image-wrapper {
          width: 80px;
          margin-right: 10px;
        }
        > .product-info-wrapper {
          flex: 1;
          line-height: 1.4;
          > .product-brand {
            font-size: 10px;
            margin-bottom: 5px;
          }
          > .product-title {
            font-size: 12px;
            margin-bottom: 10px;
          }
          > .product-uuid {
            font-size: 10px;
            margin-bottom: 5px;
          }
          > .product-color {
            font-size: 10px;
          }
          > .product-size {
            font-size: 10px;
            margin-bottom: 6px;
          }
          > .product-cost {
            text-align: right;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
