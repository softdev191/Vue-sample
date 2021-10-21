<template>
  <OrderSection title="2. お支払い方法">
    <PaymentForm
      v-if="cardInfo"
      :payment-type="paymentType"
      :is-save-card-info="Number(cardInfo.isSaveCardInfo)"
      :payment-method="cardInfo.method"
      :billing-address="billingAddress"
      :card-input-cache="cardInputCache"
      :use-saved-card-info.sync="cardInfo.useSavedCardInfo"
      :member-credit-card-id.sync="cardInfo.memberCreditCardId"
      @update:validation="(value) => $emit('update:validation', value)"
      @update:paymentType="handleUpdatePaymentType"
      @updateCardInfo="handleUpdateCardInfo"
      @update:paymentMethod="(method) => handleUpdateCardInfo({ method })"
      @update:isSaveCardInfo="
        (isSaveCardInfo) => handleUpdateCardInfo({ isSaveCardInfo })
      "
    />
  </OrderSection>
</template>

<script>
import { mapGetters } from "vuex";
import OrderSection from "@/components/pages/order/OrderSection";
import PaymentForm from "@/components/pages/order/PaymentForm";

export default {
  components: {
    OrderSection,
    PaymentForm,
  },
  emits: ["paymentSelectError"],
  props: {
    paymentType: {
      type: Number,
      default: null,
    },
    cardInfo: {
      type: Object,
      default: null,
    },
    billingAddress: {
      type: Object,
      default: null,
    },
    cardInputCache: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapGetters({
      paymentTypeKv: "order/paymentTypeKv",
    }),
  },
  methods: {
    async handleUpdatePaymentType(value) {
      try {
        if (this.paymentType === value) {
          return;
        }

        await this.$store.dispatch("cart/updatePaymentType", value);

        this.$emit("update:paymentType", value);
      } catch (error) {
        console.error(error);
        this.$emit("paymentSelectError", error);
      }
    },
    handleUpdateCardInfo(cardInfo) {
      this.$emit("update:cardInfo", Object.assign({}, this.cardInfo, cardInfo));
    },
  },
};
</script>
