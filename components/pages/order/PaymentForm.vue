<template>
  <ValidationObserver
    ref="observer"
    @update:flags="(value) => $emit('update:validation', value)"
  >
    <form>
      <div class="form-group">
        <div class="full-divider"></div>
        <div class="dropdown-section">
          <div class="dropdown-section-header" @click.prevent="toggleCredit">
            <div
              class="form-radio-wrapper"
              @click.stop="innerPaymentType = paymentTypeKv.CreditCard"
            >
              <input
                id="payment_type_credit"
                v-model="innerPaymentType"
                class="form-checkbox"
                type="radio"
                name="payment_type"
                :value="paymentTypeKv.CreditCard"
              />
              <label class="form-label" for="payment_type_credit">
                クレジットカード決済
              </label>
            </div>
            <fa
              :icon="faChevronDown"
              class="angle-down"
              :class="{ rotate: showCredit }"
            />
          </div>
          <div class="show-credit">
            <InputCreditCard
              :payment-method="paymentMethod"
              :is-save-card-info="isSaveCardInfo"
              :show-credit="showCredit"
              :payment-type="innerPaymentType"
              :billing-address="billingAddress"
              :card-input-cache="cardInputCache"
              :use-saved-card-info="useSavedCardInfo"
              :member-credit-card-id="memberCreditCardId"
              @update:cardInfo="handleUpdateCardInfo"
              @update:paymentMethod="handleUpdatePaymentMethod"
              @update:isSaveCardInfo="handleUpdateIsSaveCardInfo"
              @update:billingAddress="handleUpdateBillingAddress"
              @update:useSavedCardInfo="handleUpdateUseSavedCardInfo"
              @update:memberCreditCardId="handleUpdateMemberCreditCardId"
            ></InputCreditCard>
          </div>
        </div>
        <div class="full-divider"></div>
        <div class="dropdown-section">
          <div class="dropdown-section-header">
            <div class="form-radio-wrapper">
              <input
                id="payment_type_np"
                v-model="innerPaymentType"
                class="form-checkbox"
                type="radio"
                name="payment_type"
                :value="paymentTypeKv.NP"
              />
              <label class="form-label" for="payment_type_np">NP後払い</label>
            </div>
          </div>
          <div
            v-show="innerPaymentType === paymentTypeKv.NP"
            class="dropdown-section-content"
          >
            <div class="dropdown-section-content-inner">
              <div class="form-group">
                <p>※ お届け先の選択はできません。</p>
              </div>
            </div>
          </div>
        </div>
        <div class="full-divider"></div>
        <div class="dropdown-section">
          <div class="dropdown-section-header">
            <div class="form-radio-wrapper">
              <input
                id="payment_type_cash"
                v-model="innerPaymentType"
                class="form-checkbox"
                type="radio"
                name="payment_type"
                :value="paymentTypeKv.Cod"
              />
              <label class="form-label" for="payment_type_cash">代引き</label>
            </div>
          </div>
          <div
            v-show="innerPaymentType === paymentTypeKv.Cod"
            class="dropdown-section-content"
          >
            <div class="dropdown-section-content-inner">
              <div class="form-group">
                <p>
                  ※
                  {{
                    paymentFee[paymentTypeKv.Cod]
                  }}円の代引き手数料が全額に加算されております。
                </p>
                <p>※ お届け先の選択はできません。</p>
              </div>
            </div>
          </div>
        </div>
        <template v-if="isReserved">
          <div class="full-divider"></div>
          <div class="dropdown-section">
            <div class="dropdown-section-header">
              <div class="form-radio-wrapper">
                <input
                  id="payment_type_bank"
                  v-model="innerPaymentType"
                  class="form-checkbox"
                  type="radio"
                  name="payment_type"
                  :value="paymentTypeKv.Bank"
                />
                <label class="form-label" for="payment_type_bank">
                  銀行振り込み
                </label>
              </div>
            </div>
            <div
              v-show="innerPaymentType === paymentTypeKv.Bank"
              class="dropdown-section-content"
            >
              <div class="dropdown-section-content-inner">
                <div class="form-group">
                  <p>
                    銀行名 :みずほ銀行<br />
                    振込先の詳細はメールにてお伝え致します。<br />※お振込み手数料は、
                    お客様負担でお願いいたします。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="full-divider"></div>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { mapGetters } from "vuex";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import InputCreditCard from "@/components/atoms/order/InputCreditCard";

export default {
  emits: ["paymentSelectError"],
  components: {
    InputCreditCard,
  },
  props: {
    paymentType: {
      type: Number,
      default: null,
    },
    useSavedCardInfo: {
      type: [Boolean, Number],
      default: 0,
    },
    memberCreditCardId: {
      type: Number,
      default: null,
    },
    isSaveCardInfo: {
      type: [Number, Boolean],
      default: 0,
    },
    paymentMethod: {
      type: String,
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
  data() {
    return {
      showCredit: true,
    };
  },
  computed: {
    ...mapGetters({
      enumKv: "enum/kv",
      isReserved: "cart/isReserved",
      constants: "master/constants",
      paymentTypeKv: "order/paymentTypeKv",
      memberCreditCard: "memberCreditCard/data",
    }),
    paymentTypeKv() {
      return this.enumKv.order__payment_type || {};
    },
    faChevronDown() {
      return faChevronDown;
    },
    paymentFee() {
      return this.constants.order.payment_fee;
    },
    innerPaymentType: {
      get() {
        return this.paymentType || this.paymentTypeKv.CreditCard;
      },
      set(value) {
        this.$emit("update:paymentType", value);
      },
    },
  },
  methods: {
    handleUpdateCardInfo(cardInfo) {
      this.$emit("updateCardInfo", cardInfo);
    },
    handleUpdatePaymentMethod(value) {
      this.$emit("update:paymentMethod", value);
    },
    handleUpdateIsSaveCardInfo(value) {
      this.$emit("update:isSaveCardInfo", value);
    },
    handleUpdateBillingAddress(value) {
      this.$emit("update:billingAddress", value);
    },
    handleUpdateUseSavedCardInfo(value) {
      this.$emit("update:useSavedCardInfo", value);
    },
    handleUpdateMemberCreditCardId(value) {
      this.$emit("update:memberCreditCardId", value);
    },
    toggleCredit() {
      this.showCredit = !this.showCredit;
    },
    validateForm() {
      return this.$refs.observer.validate();
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown-section {
  .dropdown-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding: 16px 0;
    .angle-down {
      transition-duration: 0.3s;
    }
  }
  .dropdown-section-content {
    transition: 150ms ease-out;
    @include desktop {
      height: auto !important;
    }
    .dropdown-section-content-inner {
      transition: 150ms ease-out;
    }
  }
  .show-credit {
    @include touch {
      max-width: 400px;
      width: 100%;
    }
  }
}
.rotate {
  transform: rotate(180deg);
}
.error-box {
  border: 1px solid $error;
  margin-top: 20px;
  .error-title {
    color: $white;
    font-size: 10px;
    background-color: $error;
    padding: 5px 7px;
  }
  .error-text {
    color: $black;
    font-size: 10px;
    background-color: $white;
    padding: 7px;
  }
}
</style>
