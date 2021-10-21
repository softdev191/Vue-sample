<template>
  <BaseDialog
    ref="updatePaymentDialog"
    title="お支払い方法の編集"
    :has-cancel="false"
    :invalid="invalid"
    ok-text="更新する"
    @ok="handleUpdate"
  >
    <PaymentForm
      v-if="cardInfo"
      ref="form"
      :payment-type.sync="paymentType"
      :billing-address.sync="billingAddress"
      :is-save-card-info.sync="cardInfo.isSaveCardInfo"
      :payment-method.sync="cardInfo.method"
      :card-input-cache.sync="cardInputCache"
      :use-saved-card-info.sync="cardInfo.useSavedCardInfo"
      :member-credit-card-id.sync="cardInfo.memberCreditCardId"
      @updateCardInfo="handleUpdateCardInfo"
      @update:validation="(flags) => (invalid = flags.invalid)"
    />
  </BaseDialog>
</template>

<script>
import { mapGetters } from "vuex";
import BaseDialog from "@/components/atoms/BaseDialog";
import PaymentForm from "@/components/pages/order/PaymentForm";

export default {
  components: {
    PaymentForm,
    BaseDialog,
  },
  data() {
    return {
      paymentType: null,
      cardInfo: null,
      billingAddress: null,
      cardInputCache: null,
      invalid: true,
    };
  },
  computed: {
    ...mapGetters({
      enumKv: "enum/kv",
      paymentTypes: "master/orderPaymentTypes",
      activeBillingAddress: "order/activeBillingAddress",
    }),
    paymentTypeKv() {
      return this.enumKv.order__payment_type || {};
    },
  },
  methods: {
    show({
      paymentType,
      cardInfo = {},
      billingAddress = {},
      cardInputCache = {},
    }) {
      this.paymentType = paymentType;
      this.billingAddress = { ...billingAddress };
      this.cardInfo = { ...cardInfo };

      if (Number(paymentType) === this.paymentTypeKv.CreditCard) {
        this.cardInfo.isSaveCardInfo = Number(cardInfo.isSaveCardInfo);
      }

      this.cardInputCache = { ...cardInputCache };

      this.invalid = true;
      this.$refs.updatePaymentDialog.show();
    },
    hide() {
      this.$refs.updatePaymentDialog.hide();
      this.paymentType = null;
      this.cardInfo = null;
      this.billingAddress = null;
    },
    handleUpdateCardInfo(cardInfo) {
      this.cardInfo = Object.assign({}, this.cardInfo, cardInfo);
    },
    async handleUpdate() {
      if (!(await this.$refs.form.validateForm())) {
        return;
      }

      try {
        const paymentType = this.paymentType;
        const cardInfo = { ...this.cardInfo };
        const billingAddress = { ...this.billingAddress };
        const cardInputCache = { ...this.cardInputCache };

        await this.$store.dispatch("cart/updatePaymentType", paymentType);
        this.$store.commit("order/setPaymentType", paymentType);

        if (paymentType === this.paymentTypeKv.CreditCard) {
          this.$store.commit("order/setCardInfo", cardInfo);
          this.$store.commit("order/setBillingAddress", billingAddress);
          this.$store.commit("order/setCardInputCache", cardInputCache);
        }

        this.hide();
      } catch (error) {
        this.$emit("paymentSelectError", error);
      }
    },
  },
};
</script>
