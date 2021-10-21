<template>
  <form>
    <OrderSection :title="title">
      <AmazonPayAddressBookWidget
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
import AmazonPayAddressBookWidget from "@/components/atoms/AmazonPayAddressBookWidget";

export default {
  name: "AmazonPayAddressBookSection",
  components: {
    OrderSection,
    AmazonPayAddressBookWidget,
  },
  props: {
    title: {
      type: String,
      default: "1. 配送先住所の選択",
    },
  },
};
</script>
