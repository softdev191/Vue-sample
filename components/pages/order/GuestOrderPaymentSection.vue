<template>
  <OrderSection :title="title">
    <ValidationObserver
      ref="observer"
      @update:flags="(value) => $emit('update:validation', value)"
    >
      <form>
        <div class="form-group">
          <div class="full-divider"></div>
          <label class="form-label">クレジットカード決済</label>
          <div class="show-credit">
            <InputCreditCard
              v-if="cardInfo"
              :show-credit="true"
              :hide-save-card-info-option="true"
              :hide-billing-address="true"
              :payment-method="cardInfo.method"
              :card-input-cache="cardInputCache"
              :payment-type="paymentTypeCreditCard"
              @update:cardInfo="handleUpdateCardInfo"
              @update:paymentMethod="
                (method) => handleUpdateCardInfo({ method })
              "
            ></InputCreditCard>
          </div>
        </div>
      </form>
    </ValidationObserver>
  </OrderSection>
</template>

<script>
import OrderSection from "@/components/pages/order/OrderSection";
import InputCreditCard from "@/components/atoms/order/InputCreditCard";

export default {
  components: {
    OrderSection,
    InputCreditCard,
  },
  emits: ["paymentSelectError"],
  props: {
    cardInfo: {
      type: Object,
      default: null,
    },
    cardInputCache: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: "4. お支払い方法",
    },
  },
  computed: {
    paymentTypeCreditCard() {
      return this.$store.getters["order/paymentTypeKv"].CreditCard;
    },
  },
  methods: {
    handleUpdateCardInfo(cardInfo) {
      this.$emit("update:cardInfo", Object.assign({}, this.cardInfo, cardInfo));
    },
  },
};
</script>

<style lang="scss" scoped>
.show-credit {
  @include touch {
    max-width: 400px;
    width: 100%;
  }
}
</style>
