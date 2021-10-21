<template>
  <form>
    <OrderSection :title="title">
      <AmazonPayWalletWidget
        @orderReferenceCreated="
          (event) => $emit('orderReferenceCreated', event)
        "
        @select="(event) => $emit('select', event)"
        @error="(error) => $emit('error', error)"
      />
    </OrderSection>
  </form>
</template>

<script>
import OrderSection from "@/components/pages/order/OrderSection";
import AmazonPayWalletWidget from "@/components/atoms/AmazonPayWalletWidget";

export default {
  name: "AmazonPayWalletSection",
  components: {
    OrderSection,
    AmazonPayWalletWidget,
  },
  props: {
    title: {
      type: String,
      default: "2. お支払い方法の選択",
    },
  },
};
</script>
