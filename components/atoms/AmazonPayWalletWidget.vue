<template>
  <div
    id="amazon_pay_wallet_widget_div"
    class="amazon_pay_wallet_widget_div"
  ></div>
</template>

<script>
export default {
  name: "AmazonPayWalletWidget",
  emits: ["orderReferenceCreated", "select", "error"],
  props: {
    /**
     * onOrderReferenceCreateを指定するか。
     * AddressとWallet両方に設定するとリクエストが通らないので通常はfalse
     */
    listenOnOrderReferenceCreate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      widget: null,
      design: {
        designMode: "responsive",
      },
    };
  },
  mounted() {
    this.initWidget();
  },
  methods: {
    handleOrderReferenceCreated(orderReference) {
      this.$emit("orderReferenceCreated", orderReference);
    },
    handleSelect(orderReference) {
      this.$emit("select", orderReference);
    },
    handleError(error) {
      this.$emit("error", error);
    },
    initWidget() {
      const offAmazonPayments = this.$amazonPay.offAmazonPayments;

      const options = {
        sellerId: this.$amazonPay.amazonMerchantId,
        onPaymentSelect: this.handleSelect.bind(this),
        onError: this.handleError.bind(this),
        design: this.design,
      };

      if (this.listenOnOrderReferenceCreate) {
        options.onOrderReferenceCreate = this.handleOrderReferenceCreated.bind(
          this
        );
      }

      const widget = new offAmazonPayments.Widgets.Wallet(options);

      widget.bind("amazon_pay_wallet_widget_div");

      this.widget = widget;
    },
  },
};
</script>

<style lang="scss" scoped>
.amazon_pay_wallet_widget_div {
  width: 100%;
  height: 228px;

  @media screen and (min-width: 769px) {
    min-width: 300px;
    max-width: 600px;
    min-height: 228px;
    max-height: 400px;
  }
}
</style>
