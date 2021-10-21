<template>
  <OrderSection :title="title" class="bg">
    <AddressForm
      :inputs="inputs"
      :show-copy-info="false"
      @update:validation="(value) => $emit('update:validation', value)"
    />
  </OrderSection>
</template>

<script>
import OrderSection from "@/components/pages/order/OrderSection";
import AddressForm, {
  createNewInputs,
} from "@/components/pages/order/AddressForm.vue";

export default {
  components: {
    AddressForm,
    OrderSection,
  },
  props: {
    inputs: {
      type: Object,
      default: () => createNewInputs(),
    },
    title: {
      type: String,
      default: "2. お届け先",
    },
  },
};
</script>
