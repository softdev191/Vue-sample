<template>
  <form>
    <OrderSection :title="title">
      <DeliveryOptionForm
        :inputs="inputs"
        @update:validation="(value) => $emit('update:validation', value)"
      />
    </OrderSection>
  </form>
</template>

<script>
import DeliveryOptionForm from "@/components/pages/order/DeliveryOptionForm";
import OrderSection from "@/components/pages/order/OrderSection";

export default {
  components: {
    OrderSection,
    DeliveryOptionForm,
  },
  props: {
    title: {
      type: String,
      default: "4. 配送方法とお届け日時",
    },
    inputs: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
