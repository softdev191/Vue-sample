<template>
  <BaseDialog
    ref="updatePaymentDialog"
    title="お支払い方法の編集"
    :has-cancel="false"
    :invalid="invalid"
    ok-text="更新する"
    @ok="handleUpdate"
  >
    <ValidationObserver
      ref="observer"
      @update:flags="(flags) => (invalid = flags.invalid)"
    >
      <form>
        <div class="form-group">
          <div class="full-divider"></div>
          <label class="form-label">クレジットカード決済</label>
          <div class="show-credit">
            <InputCreditCard
              v-if="cardInfo"
              :payment-method="cardInfo.method"
              :payment-type="paymentTypeCreditCard"
              :show-credit="true"
              :hide-save-card-info-option="true"
              :hide-billing-address="true"
              :card-input-cache="cardInputCache"
              @update:cardInfo="handleUpdateCardInfo"
            ></InputCreditCard>
          </div>
        </div>
      </form>
    </ValidationObserver>
  </BaseDialog>
</template>

<script>
import { mapGetters } from "vuex";
import BaseDialog from "@/components/atoms/BaseDialog";
import InputCreditCard from "@/components/atoms/order/InputCreditCard";

export default {
  components: {
    BaseDialog,
    InputCreditCard,
  },
  data() {
    return {
      cardInfo: null,
      cardInputCache: null,
      invalid: true,
    };
  },
  computed: {
    ...mapGetters({
      enumKv: "enum/kv",
    }),
    paymentTypeKv() {
      return this.enumKv.order__payment_type || {};
    },
    paymentTypeCreditCard() {
      return this.paymentTypeKv.CreditCard;
    },
  },
  methods: {
    show({ cardInfo = {}, cardInputCache = {} }) {
      this.cardInfo = { ...cardInfo };
      this.cardInputCache = { ...cardInputCache };
      this.invalid = true;
      this.$refs.updatePaymentDialog.show();
    },
    hide() {
      this.$refs.updatePaymentDialog.hide();
      this.cardInfo = null;
    },
    handleUpdateCardInfo(cardInfo) {
      this.cardInfo = Object.assign({}, this.cardInfo, cardInfo);
    },
    async handleUpdate() {
      if (!(await this.$refs.observer.validate())) {
        return;
      }

      try {
        const cardInfo = { ...this.cardInfo };
        const cardInputCache = { ...this.cardInputCache };
        this.$store.commit("order/setCardInfo", cardInfo);
        this.$store.commit("order/setCardInputCache", cardInputCache);

        this.hide();
      } catch (error) {
        this.$emit("paymentSelectError", error);
      }
    },
  },
};
</script>
