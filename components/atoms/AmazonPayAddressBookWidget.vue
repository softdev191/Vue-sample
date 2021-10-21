<template>
  <div
    id="amazon_pay_address_book_widget_div"
    class="amazon_pay_address_book_widget_div"
  ></div>
</template>

<script>
export default {
  name: "AmazonPayAddressBookWidget",
  emits: ["orderReferenceCreated", "select", "error"],
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

      const widget = new offAmazonPayments.Widgets.AddressBook({
        sellerId: this.$amazonPay.amazonMerchantId,
        onOrderReferenceCreate: this.handleOrderReferenceCreated.bind(this),
        onAddressSelect: this.handleSelect.bind(this),
        onError: this.handleError.bind(this),
        design: this.design,
      });

      widget.bind("amazon_pay_address_book_widget_div");

      this.widget = widget;
    },
  },
};
</script>

<style lang="scss" scoped>
.amazon_pay_address_book_widget_div {
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
